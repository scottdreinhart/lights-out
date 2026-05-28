#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { brotliCompressSync, gzipSync } from 'node:zlib'

const ROOT = process.cwd()
const APPS_DIR = path.join(ROOT, 'apps')
const COMPLIANCE_DIR = path.join(ROOT, 'compliance')
const BUNDLE_METRICS_PATH = path.join(COMPLIANCE_DIR, 'bundle-metrics.json')
const SHARED_PACKAGE_COVERAGE_SCRIPT_PATH = path.join(
  ROOT,
  'scripts',
  'generate-shared-package-coverage.mjs',
)
const isWin = process.platform === 'win32'
const COMPRESSIBLE_EXTENSIONS = new Set(['.js', '.css', '.html'])

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  BLUE: '\x1b[94m',
  MAGENTA: '\x1b[95m',
  WHITE: '\x1b[97m',
  GREEN: '\x1b[92m',
  YELLOW: '\x1b[93m',
  RED: '\x1b[91m',
  GRAY: '\x1b[90m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

function listBuildableApps() {
  if (!fs.existsSync(APPS_DIR)) {
    return []
  }

  return fs
    .readdirSync(APPS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))
    .filter((appName) => {
      const pkgPath = path.join(APPS_DIR, appName, 'package.json')
      if (!fs.existsSync(pkgPath)) {
        return false
      }

      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      return Boolean(pkg?.scripts?.build)
    })
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    stdio: 'inherit',
    shell: isWin,
    ...options,
  })
}

function appHasOwnCompression(appPath) {
  const pkgPath = path.join(appPath, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    return false
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  const buildScript = String(pkg?.scripts?.build ?? '')
  const hasExplicitCompressionScript = Boolean(pkg?.scripts?.['compress:assets'])
  return hasExplicitCompressionScript || buildScript.includes('compress:assets')
}

function collectDistAssetFilenames(appPath) {
  const assetsDir = path.join(appPath, 'dist', 'assets')
  if (!fs.existsSync(assetsDir)) {
    return []
  }

  return fs
    .readdirSync(assetsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => !fileName.endsWith('.gz') && !fileName.endsWith('.br'))
}

function compressDistAssets(appPath) {
  const distDir = path.join(appPath, 'dist')
  if (!fs.existsSync(distDir)) {
    return
  }

  const stack = [distDir]
  const files = []

  while (stack.length > 0) {
    const current = stack.pop()
    const entries = fs.readdirSync(current, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(fullPath)
        continue
      }

      const ext = path.extname(entry.name).toLowerCase()
      if (!COMPRESSIBLE_EXTENSIONS.has(ext)) {
        continue
      }

      if (entry.name.endsWith('.gz') || entry.name.endsWith('.br')) {
        continue
      }

      files.push(fullPath)
    }
  }

  for (const fullPath of files) {
    const source = fs.readFileSync(fullPath)
    const gzipPath = `${fullPath}.gz`
    const brotliPath = `${fullPath}.br`

    fs.writeFileSync(gzipPath, gzipSync(source))
    fs.writeFileSync(brotliPath, brotliCompressSync(source))
  }
}

function collectDistFiles(appPath) {
  const distDir = path.join(appPath, 'dist')
  if (!fs.existsSync(distDir)) {
    return []
  }

  const files = []
  const stack = [distDir]

  while (stack.length > 0) {
    const current = stack.pop()
    const entries = fs.readdirSync(current, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(fullPath)
        continue
      }
      const relativePath = path.relative(distDir, fullPath).split(path.sep).join('/')
      const stat = fs.statSync(fullPath)
      files.push({
        path: relativePath,
        bytes: stat.size,
        mtime: stat.mtime.toISOString(),
      })
    }
  }

  return files
}

function getExtBucket(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.js' || ext === '.mjs') return 'jsBytes'
  if (ext === '.css') return 'cssBytes'
  if (ext === '.html') return 'htmlBytes'
  if (ext === '.map') return 'mapBytes'
  if (ext === '.svg' || ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
    return 'imageBytes'
  }
  if (ext === '.woff' || ext === '.woff2' || ext === '.ttf' || ext === '.otf') return 'fontBytes'
  return 'otherBytes'
}

function buildBundleMetrics(appPath) {
  const files = collectDistFiles(appPath).sort((a, b) => b.bytes - a.bytes)
  const totals = {
    totalBytes: 0,
    assetBytes: 0,
    jsBytes: 0,
    cssBytes: 0,
    htmlBytes: 0,
    mapBytes: 0,
    imageBytes: 0,
    fontBytes: 0,
    otherBytes: 0,
  }

  const assetFiles = []

  for (const file of files) {
    totals.totalBytes += file.bytes
    const bucket = getExtBucket(file.path)
    totals[bucket] += file.bytes

    if (file.path.startsWith('assets/')) {
      totals.assetBytes += file.bytes
      assetFiles.push(file)
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    fileCount: files.length,
    assetFileCount: assetFiles.length,
    totals,
    largestFiles: files.slice(0, 30),
    files,
  }
}

function writeBundleMetricsReport(bundleMetricsByApp, appsBuilt, failedApps, duplicatedArtifacts) {
  const appEntries = Object.entries(bundleMetricsByApp)
  const aggregate = {
    totalAppsWithMetrics: appEntries.length,
    totalBytes: 0,
    totalAssetBytes: 0,
    totalJsBytes: 0,
    totalCssBytes: 0,
    totalHtmlBytes: 0,
    totalMapBytes: 0,
    totalImageBytes: 0,
    totalFontBytes: 0,
    totalOtherBytes: 0,
  }

  for (const [, metrics] of appEntries) {
    aggregate.totalBytes += metrics.totals.totalBytes
    aggregate.totalAssetBytes += metrics.totals.assetBytes
    aggregate.totalJsBytes += metrics.totals.jsBytes
    aggregate.totalCssBytes += metrics.totals.cssBytes
    aggregate.totalHtmlBytes += metrics.totals.htmlBytes
    aggregate.totalMapBytes += metrics.totals.mapBytes
    aggregate.totalImageBytes += metrics.totals.imageBytes
    aggregate.totalFontBytes += metrics.totals.fontBytes
    aggregate.totalOtherBytes += metrics.totals.otherBytes
  }

  const duplicateAssetReport = duplicatedArtifacts.map(([assetName, appSet]) => ({
    assetName,
    apps: [...appSet].sort(),
    appCount: appSet.size,
  }))

  const report = {
    metadata: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      source: 'scripts/build-apps-sequential.mjs',
      notes: [
        'Metrics are derived from dist/ artifacts produced by the latest sequential root build.',
        'totalBytes includes all files under each app dist/ directory.',
        'files contains complete per-app bundle file inventory for dashboard analysis.',
      ],
    },
    summary: {
      appsBuilt,
      failedApps: failedApps.map((item) => item.appName),
      aggregate,
      duplicateAssets: {
        count: duplicateAssetReport.length,
        top: duplicateAssetReport.slice(0, 100),
      },
    },
    apps: bundleMetricsByApp,
  }

  fs.mkdirSync(COMPLIANCE_DIR, { recursive: true })
  fs.writeFileSync(BUNDLE_METRICS_PATH, JSON.stringify(report, null, 2))
}

function refreshSharedPackageCoverage() {
  const result = run(process.execPath, [SHARED_PACKAGE_COVERAGE_SCRIPT_PATH])
  if ((result.status ?? 1) !== 0) {
    // eslint-disable-next-line no-console
    console.error(`${COLORS.RED}${COLORS.BOLD}❌ Failed to generate shared package coverage report.${COLORS.RESET}`)
    process.exit(result.status ?? 1)
  }
}

function main() {
  const dryRun = process.argv.includes('--dry-run')
  const apps = listBuildableApps()
  const failedApps = []
  const passedApps = []
  const artifactToApps = new Map()
  const bundleMetricsByApp = {}

  if (apps.length === 0) {
    // eslint-disable-next-line no-console
    console.log(`${COLORS.YELLOW}ℹ️  No buildable apps found.${COLORS.RESET}`)
    return
  }

  // eslint-disable-next-line no-console
  console.log(`${COLORS.BLUE}${COLORS.BOLD}🏗️  Sequential app build: ${apps.length} apps${COLORS.RESET}`)
  // eslint-disable-next-line no-console
  console.log(
    `${COLORS.GRAY}Active optimizations: tree-shaking, code-splitting, lazy-loading, minification, asset hashing, compression${COLORS.RESET}`,
  )

  for (const [index, appName] of apps.entries()) {
    if (index > 0) {
      // eslint-disable-next-line no-console
      console.log(`${COLORS.GRAY}${'─'.repeat(70)}${COLORS.RESET}`)
    }

    const appPath = path.join(APPS_DIR, appName)
    const progressLabel = `${index + 1}/${apps.length}`

    if (dryRun) {
      // eslint-disable-next-line no-console
      console.log(`${COLORS.CYAN}[${progressLabel}] 📚 ${appName} ${COLORS.YELLOW}(dry-run)${COLORS.RESET}`)
      continue
    }

    const result = run('pnpm', ['-C', appPath, 'build'])
    const buildStatus = result.status ?? 1
    if (buildStatus === 0) {
      try {
        if (!appHasOwnCompression(appPath)) {
          compressDistAssets(appPath)
        }
        passedApps.push(appName)
        bundleMetricsByApp[appName] = buildBundleMetrics(appPath)
        collectDistAssetFilenames(appPath).forEach((assetName) => {
          if (!artifactToApps.has(assetName)) {
            artifactToApps.set(assetName, new Set())
          }
          artifactToApps.get(assetName).add(appName)
        })
        // eslint-disable-next-line no-console
        console.log(`${COLORS.GREEN}✅ [${progressLabel}] ${appName}${COLORS.RESET}`)
      } catch (error) {
        failedApps.push({ appName, buildStatus: 1 })
        // eslint-disable-next-line no-console
        console.error(`${COLORS.RED}❌ [${progressLabel}] ${appName} (compression error)${COLORS.RESET}`)
        // eslint-disable-next-line no-console
        console.error(`${COLORS.RED}  ${error instanceof Error ? error.message : String(error)}${COLORS.RESET}`)
      }
    } else {
      failedApps.push({ appName, buildStatus })
      // eslint-disable-next-line no-console
      console.log(`${COLORS.RED}❌ [${progressLabel}] ${appName}${COLORS.RESET}`)
    }
  }

  const duplicatedArtifacts = [...artifactToApps.entries()]
    .filter(([, appSet]) => appSet.size > 1)
    .sort((a, b) => b[1].size - a[1].size)

  if (duplicatedArtifacts.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`${COLORS.YELLOW}\nℹ️  Duplicate dist/assets artifacts (${duplicatedArtifacts.length} total):${COLORS.RESET}`)
    duplicatedArtifacts.slice(0, 20).forEach(([assetName, appSet], idx) => {
      const appsForAsset = [...appSet].sort().join(', ')
      // eslint-disable-next-line no-console
      console.log(`${COLORS.GRAY}   ${idx + 1}. ${assetName} → ${appsForAsset}${COLORS.RESET}`)
    })
    if (duplicatedArtifacts.length > 20) {
      // eslint-disable-next-line no-console
      console.log(`${COLORS.GRAY}   ... and ${duplicatedArtifacts.length - 20} more${COLORS.RESET}`)
    }
  }

  if (failedApps.length > 0) {
    writeBundleMetricsReport(bundleMetricsByApp, passedApps.length, failedApps, duplicatedArtifacts)
    refreshSharedPackageCoverage()
    // eslint-disable-next-line no-console
    console.error(
      `\n${COLORS.RED}${COLORS.BOLD}❌ Sequential app build complete: ${passedApps.length} ✅ PASS, ${failedApps.length} ❌ FAIL${COLORS.RESET}`,
    )
    failedApps.forEach((failure, idx) => {
      // eslint-disable-next-line no-console
      console.error(`${COLORS.RED}   ${idx + 1}. ${failure.appName} (exit ${failure.buildStatus})${COLORS.RESET}`)
    })
    process.exit(1)
  }

  writeBundleMetricsReport(bundleMetricsByApp, passedApps.length, failedApps, duplicatedArtifacts)
  refreshSharedPackageCoverage()

  // eslint-disable-next-line no-console
  console.log(`\n${COLORS.GREEN}${COLORS.BOLD}✅ Sequential app build complete: ${passedApps.length} apps${COLORS.RESET}`)
}

main()
