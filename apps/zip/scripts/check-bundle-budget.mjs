import fs from 'node:fs'
import path from 'node:path'

const COLORS = {
  RED: '\x1b[91m',
  GREEN: '\x1b[92m',
  BOLD: '\x1b[1m',
  RESET: '\x1b[0m',
}

const distRoot = path.resolve(process.cwd(), 'dist')
const assetsDir = path.join(distRoot, 'assets')

const assertExists = (targetPath, description) => {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`${description} not found at ${targetPath}`)
  }
}

const toKiB = (bytes) => bytes / 1024

const collectFilesRecursive = (dirPath) => {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectFilesRecursive(fullPath))
      continue
    }
    const stats = fs.statSync(fullPath)
    files.push({
      fileName: entry.name,
      relativePath: path.relative(assetsDir, fullPath),
      fullPath,
      size: stats.size,
    })
  }
  return files
}

const readAssets = () => {
  assertExists(assetsDir, 'assets directory')
  return collectFilesRecursive(assetsDir)
}

const hasCompressedPair = (assetPath) => {
  const gzipPath = `${assetPath}.gz`
  const brotliPath = `${assetPath}.br`
  return fs.existsSync(gzipPath) && fs.existsSync(brotliPath)
}

const validateCompression = (assets) => {
  const compressionTargets = assets.filter(({ fileName }) => /\.(js|css)$/i.test(fileName))
  const missingCompression = compressionTargets.filter(({ fullPath }) => !hasCompressedPair(fullPath))

  if (missingCompression.length > 0) {
    const missingList = missingCompression
      .map(({ relativePath }) => `- ${relativePath}`)
      .join('\n')
    throw new Error(`Missing .gz/.br compressed artifacts for:\n${missingList}`)
  }
}

const validateBudgets = (assets) => {
  const jsAssets = assets.filter(({ fileName }) => fileName.endsWith('.js'))
  const cssAssets = assets.filter(({ fileName }) => fileName.endsWith('.css'))
  const entryJs = jsAssets.find(({ fileName }) => /^index-.*\.js$/.test(fileName))
  const reactChunk = jsAssets.find(({ fileName }) => /^react-.*\.js$/.test(fileName))
  const lazyZipChunk = jsAssets.find(({ fileName }) => /^ZipGame-.*\.js$/.test(fileName))

  if (!entryJs) {
    throw new Error('Could not find entry JS chunk (index-*.js)')
  }

  if (!reactChunk) {
    throw new Error('Could not find react vendor chunk (react-*.js)')
  }

  if (!lazyZipChunk) {
    throw new Error('Could not find lazy ZipGame chunk (ZipGame-*.js)')
  }

  const totalJsKiB = toKiB(jsAssets.reduce((total, item) => total + item.size, 0))
  const totalCssKiB = toKiB(cssAssets.reduce((total, item) => total + item.size, 0))

  const budgets = {
    entryJsKiB: 24,
    reactChunkKiB: 220,
    lazyZipChunkKiB: 90,
    totalJsKiB: 320,
    totalCssKiB: 40,
  }

  const checks = [
    { label: 'entry JS', value: toKiB(entryJs.size), limit: budgets.entryJsKiB },
    { label: 'react vendor chunk', value: toKiB(reactChunk.size), limit: budgets.reactChunkKiB },
    { label: 'lazy ZipGame chunk', value: toKiB(lazyZipChunk.size), limit: budgets.lazyZipChunkKiB },
    { label: 'total JS', value: totalJsKiB, limit: budgets.totalJsKiB },
    { label: 'total CSS', value: totalCssKiB, limit: budgets.totalCssKiB },
  ]

  const failures = checks.filter(({ value, limit }) => value > limit)
  if (failures.length > 0) {
    const failureText = failures
      .map(({ label, value, limit }) => `- ${label}: ${value.toFixed(2)} KiB exceeds ${limit.toFixed(2)} KiB`)
      .join('\n')
    throw new Error(`Bundle budget validation failed:\n${failureText}`)
  }

  const summary = checks
    .map(({ label, value, limit }) => `${label}: ${value.toFixed(2)} KiB / ${limit.toFixed(2)} KiB`)
    .join('\n')

  console.log(`${COLORS.GREEN}✅ Bundle budget validation passed:${COLORS.RESET}`)
  console.log(summary)
}

try {
  assertExists(distRoot, 'dist directory')
  const assets = readAssets()
  validateCompression(assets)
  validateBudgets(assets)
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`${COLORS.RED}${COLORS.BOLD}❌ ${message}${COLORS.RESET}`)
  process.exit(1)
}
