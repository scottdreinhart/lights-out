#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const ROOT = process.cwd()
const APPS_DIR = path.join(ROOT, 'apps')
const COMPLIANCE_DIR = path.join(ROOT, 'compliance')
const OUTPUT_PATH = path.join(COMPLIANCE_DIR, 'bundle-metrics.json')

function listBuildableApps() {
  if (!fs.existsSync(APPS_DIR)) return []
  return fs
    .readdirSync(APPS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))
    .filter((appName) => {
      const pkgPath = path.join(APPS_DIR, appName, 'package.json')
      if (!fs.existsSync(pkgPath)) return false
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      return Boolean(pkg?.scripts?.build)
    })
}

function collectDistFiles(appPath) {
  const distDir = path.join(appPath, 'dist')
  if (!fs.existsSync(distDir)) return []
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
      const stat = fs.statSync(fullPath)
      files.push({
        path: path.relative(distDir, fullPath).split(path.sep).join('/'),
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

function main() {
  const apps = listBuildableApps()
  const bundleMetricsByApp = {}
  const missingDistApps = []

  for (const appName of apps) {
    const appPath = path.join(APPS_DIR, appName)
    const distPath = path.join(appPath, 'dist')
    if (!fs.existsSync(distPath)) {
      missingDistApps.push(appName)
      continue
    }
    bundleMetricsByApp[appName] = buildBundleMetrics(appPath)
  }

  const aggregate = {
    totalAppsWithMetrics: Object.keys(bundleMetricsByApp).length,
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

  for (const metrics of Object.values(bundleMetricsByApp)) {
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

  const report = {
    metadata: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      source: 'scripts/generate-bundle-metrics.mjs',
      notes: [
        'Run after pnpm build:apps to capture total root-build bundle sizes.',
        'Includes complete file inventory under each app dist/ directory.',
      ],
    },
    summary: {
      scannedApps: apps.length,
      appsWithDist: Object.keys(bundleMetricsByApp).length,
      missingDistApps,
      aggregate,
    },
    apps: bundleMetricsByApp,
  }

  fs.mkdirSync(COMPLIANCE_DIR, { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2))
  console.log(
    `Generated compliance/bundle-metrics.json (${Object.keys(bundleMetricsByApp).length}/${apps.length} apps)`,
  )
}

main()
