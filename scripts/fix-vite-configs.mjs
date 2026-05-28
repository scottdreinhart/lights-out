#!/usr/bin/env node

/***
 * Fix Vite Configs - Apply Zip optimization baseline across app configs.
 *
 * This script normalizes all app vite.config.{js,ts} files to include:
 * - rollup-plugin-visualizer in plugins
 * - vite-plugin-compression (gzip + brotli output assets)
 * - build optimizations (target/cssTarget/modulePreload/minify/cssMinify)
 * - Capacitor externals in rollupOptions
 * - React + vendor manualChunks split
 * - Rollup treeshake and stable chunk file naming
 *
 * Usage:
 *   node scripts/fix-vite-configs.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const appsDir = path.join(rootDir, 'apps')

const CAPACITOR_PACKAGES = [
  '@capacitor/core',
  '@capacitor/app',
  '@capacitor/device',
  '@capacitor/preferences',
  '@capacitor/haptics',
  '@capacitor/splash-screen',
  '@capacitor/keyboard',
]

function generateExternalArray(indent = '      ') {
  return `${indent}external: [
${indent}  '${CAPACITOR_PACKAGES.join(`',\n${indent}  '`)}',
${indent}],`
}

function generateManualChunks(indent = '        ') {
  return `${indent}manualChunks: (id) => {
${indent}  if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
${indent}    return 'react'
${indent}  }
${indent}  if (id.includes('node_modules')) {
${indent}    return 'vendor'
${indent}  }
${indent}},`
}

function generateCompressionPlugins(indent = '    ') {
  return `${indent}viteCompression({
${indent}  algorithm: 'gzip',
${indent}  ext: '.gz',
${indent}  threshold: 10240,
${indent}  deleteOriginFile: false,
${indent}}),
${indent}viteCompression({
${indent}  algorithm: 'brotliCompress',
${indent}  ext: '.br',
${indent}  threshold: 10240,
${indent}  deleteOriginFile: false,
${indent}  compressionOptions: { level: 11 },
${indent}}),`
}

function findMatchingBrace(content, openBraceIndex) {
  let depth = 0
  let inSingle = false
  let inDouble = false
  let inTemplate = false
  let escaped = false

  for (let i = openBraceIndex; i < content.length; i++) {
    const ch = content[i]

    if (escaped) {
      escaped = false
      continue
    }

    if (ch === '\\') {
      escaped = true
      continue
    }

    if (!inDouble && !inTemplate && ch === "'") {
      inSingle = !inSingle
      continue
    }
    if (!inSingle && !inTemplate && ch === '"') {
      inDouble = !inDouble
      continue
    }
    if (!inSingle && !inDouble && ch === '`') {
      inTemplate = !inTemplate
      continue
    }

    if (inSingle || inDouble || inTemplate) continue

    if (ch === '{') depth++
    if (ch === '}') {
      depth--
      if (depth === 0) return i
    }
  }

  return -1
}

function replaceObjectBlock(content, keyName, updater) {
  const keyRegex = new RegExp(`${keyName}\\s*:\\s*\\{`)
  const match = keyRegex.exec(content)
  if (!match) return content

  const openBraceIndex = match.index + match[0].lastIndexOf('{')
  const closeBraceIndex = findMatchingBrace(content, openBraceIndex)
  if (closeBraceIndex === -1) return content

  const block = content.slice(openBraceIndex, closeBraceIndex + 1)
  const updated = updater(block)
  if (updated === block) return content
  return content.slice(0, openBraceIndex) + updated + content.slice(closeBraceIndex + 1)
}

function ensureVisualizerImport(content) {
  if (content.includes(`from 'rollup-plugin-visualizer'`)) return content

  const lines = content.split('\n')
  let insertionIndex = lines.findIndex((line) => line.includes("from '@vitejs/plugin-react'"))
  if (insertionIndex === -1) insertionIndex = 0
  lines.splice(insertionIndex + 1, 0, "import { visualizer } from 'rollup-plugin-visualizer'")
  return lines.join('\n')
}

function ensureCompressionImport(content) {
  if (content.includes(`from 'vite-plugin-compression'`)) return content

  const lines = content.split('\n')
  let insertionIndex = lines.findIndex((line) => line.includes("from 'rollup-plugin-visualizer'"))
  if (insertionIndex === -1) {
    insertionIndex = lines.findIndex((line) => line.includes("from '@vitejs/plugin-react'"))
  }
  if (insertionIndex === -1) insertionIndex = 0
  lines.splice(insertionIndex + 1, 0, "import viteCompression from 'vite-plugin-compression'")
  return lines.join('\n')
}

function ensureVisualizerPlugin(content) {
  if (content.includes('visualizer(')) return content

  const simplePlugins = /plugins:\s*\[\s*react\(\)\s*\]/m
  if (simplePlugins.test(content)) {
    return content.replace(
      simplePlugins,
      `plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-report.html',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ]`,
    )
  }

  return content.replace(/plugins:\s*\[([\s\S]*?)\]/m, (match, inner) => {
    const trimmed = inner.trimEnd()
    const needsComma = trimmed.length > 0 && !trimmed.trim().endsWith(',')
    const suffix = `${needsComma ? ',' : ''}\n    visualizer({\n      filename: 'dist/bundle-report.html',\n      gzipSize: true,\n      brotliSize: true,\n      open: false,\n    })\n  `
    return `plugins: [${trimmed}${suffix}]`
  })
}

function ensureCompressionPlugins(content) {
  if (content.includes('viteCompression(')) return content

  return content.replace(/plugins:\s*\[([\s\S]*?)\]/m, (match, inner) => {
    const trimmed = inner.trimEnd()
    const needsComma = trimmed.length > 0 && !trimmed.trim().endsWith(',')
    const suffix = `${needsComma ? ',' : ''}\n${generateCompressionPlugins('    ')}\n  `
    return `plugins: [${trimmed}${suffix}]`
  })
}

function ensureBuildOptions(block) {
  let next = block
  const inserts = []
  if (!/target\s*:\s*['"]es2020['"]/.test(block)) inserts.push(`  target: 'es2020',`)
  if (!/cssTarget\s*:\s*['"]es2020['"]/.test(block)) inserts.push(`  cssTarget: 'es2020',`)
  if (!/modulePreload\s*:\s*\{\s*polyfill\s*:\s*false\s*\}/.test(block)) {
    inserts.push(`  modulePreload: { polyfill: false },`)
  }
  if (!/minify\s*:\s*['"]esbuild['"]/.test(block)) inserts.push(`  minify: 'esbuild',`)
  if (!/cssMinify\s*:\s*true/.test(block)) inserts.push(`  cssMinify: true,`)
  if (!/cssCodeSplit\s*:\s*true/.test(block)) inserts.push(`  cssCodeSplit: true,`)
  if (!/reportCompressedSize\s*:\s*true/.test(block)) inserts.push(`  reportCompressedSize: true,`)
  if (!/chunkSizeWarningLimit\s*:\s*500/.test(block)) inserts.push(`  chunkSizeWarningLimit: 500,`)

  if (inserts.length > 0) {
    next = next.replace('{', `{\n${inserts.join('\n')}`)
  }

  if (!/rollupOptions\s*:/.test(next)) {
    const rollupBlock = `  rollupOptions: {\n${generateExternalArray('    ')}\n    output: {\n${generateManualChunks('      ')}\n    },\n  },`
    next = next.replace(/}\s*$/, `\n${rollupBlock}\n}`)
  }

  return next
}

function ensureRollupExternalAndChunks(block) {
  let next = block

  if (!/treeshake\s*:/.test(next)) {
    next = next.replace('{', `{\n    treeshake: 'recommended',`)
  }

  if (!/external\s*:\s*\[/.test(next)) {
    next = next.replace('{', `{\n${generateExternalArray('    ')}`)
  } else {
    next = next.replace(/external\s*:\s*\[([\s\S]*?)\]/m, (match, inner) => {
      const existing = new Set(
        inner
          .split('\n')
          .map((line) => line.trim().replace(/['",]/g, ''))
          .filter(Boolean),
      )
      const missing = CAPACITOR_PACKAGES.filter((pkg) => !existing.has(pkg))
      if (missing.length === 0) return match
      const addition = missing.map((pkg) => `      '${pkg}',`).join('\n')
      const closeBracketIndex = match.lastIndexOf(']')
      return `${match.slice(0, closeBracketIndex)}\n${addition}\n    ]`
    })
  }

  if (!/output\s*:\s*\{/.test(next)) {
    next = next.replace(
      /}\s*$/,
      `\n    output: {\n      chunkFileNames: 'assets/chunks/[name]-[hash].js',\n      entryFileNames: 'assets/[name]-[hash].js',\n      assetFileNames: 'assets/[name]-[hash][extname]',\n${generateManualChunks('      ')}\n    },\n}`,
    )
  } else {
    next = replaceObjectBlock(next, 'output', (outputBlock) => {
      let normalized = outputBlock
      normalized = normalized.replace(
        /\n?\s*manualChunks\s*:\s*(?:\([^)]*\)\s*=>\s*\{[\s\S]*?\}|[a-zA-Z0-9_]+\s*\([^)]*\)\s*\{[\s\S]*?\})\s*,?/g,
        '',
      )
      if (!/chunkFileNames\s*:/.test(normalized)) {
        normalized = normalized.replace('{', `{\n      chunkFileNames: 'assets/chunks/[name]-[hash].js',`)
      }
      if (!/entryFileNames\s*:/.test(normalized)) {
        normalized = normalized.replace('{', `{\n      entryFileNames: 'assets/[name]-[hash].js',`)
      }
      if (!/assetFileNames\s*:/.test(normalized)) {
        normalized = normalized.replace('{', `{\n      assetFileNames: 'assets/[name]-[hash][extname]',`)
      }
      normalized = normalized.replace('{', `{\n${generateManualChunks('      ')}`)
      return normalized
    })
  }

  return next
}

function ensureBuildBlock(content) {
  if (/build\s*:\s*\{/.test(content)) return content

  const buildSnippet = `  build: {\n  target: 'es2020',\n  cssTarget: 'es2020',\n  modulePreload: { polyfill: false },\n  minify: 'esbuild',\n  cssMinify: true,\n  cssCodeSplit: true,\n  reportCompressedSize: true,\n  chunkSizeWarningLimit: 500,\n  rollupOptions: {\n    treeshake: 'recommended',\n    external: [\n      '@capacitor/core',\n      '@capacitor/app',\n      '@capacitor/device',\n      '@capacitor/preferences',\n      '@capacitor/haptics',\n      '@capacitor/splash-screen',\n      '@capacitor/keyboard',\n    ],\n    output: {\n      chunkFileNames: 'assets/chunks/[name]-[hash].js',\n      entryFileNames: 'assets/[name]-[hash].js',\n      assetFileNames: 'assets/[name]-[hash][extname]',\n      manualChunks: (id) => {\n        if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {\n          return 'react'\n        }\n        if (id.includes('node_modules')) {\n          return 'vendor'\n        }\n      },\n    },\n  },\n},\n`

  if (/server\s*:\s*\{/.test(content)) {
    return content.replace(/(\n\s*server\s*:\s*\{)/, `\n${buildSnippet}$1`)
  }

  return content.replace(/\n\}\)\s*$/, `\n${buildSnippet}})\n`)
}

function normalizeViteConfig(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  const original = content

  content = ensureVisualizerImport(content)
  content = ensureCompressionImport(content)
  content = ensureVisualizerPlugin(content)
  content = ensureCompressionPlugins(content)
  content = ensureBuildBlock(content)

  content = replaceObjectBlock(content, 'build', (buildBlock) => {
    let nextBuild = ensureBuildOptions(buildBlock)
    nextBuild = replaceObjectBlock(nextBuild, 'rollupOptions', (rollupBlock) =>
      ensureRollupExternalAndChunks(rollupBlock),
    )
    return nextBuild
  })

  if (content === original) {
    return { status: 'skip', msg: 'Already aligned with optimization baseline' }
  }

  fs.writeFileSync(filePath, content, 'utf8')
  return { status: 'updated', msg: 'Applied optimization baseline' }
}

function isAppDir(fullPath) {
  return fs.statSync(fullPath).isDirectory() && !fullPath.endsWith(`${path.sep}ui`)
}

function findViteConfig(appPath) {
  const candidates = ['vite.config.ts', 'vite.config.js']
  for (const file of candidates) {
    const full = path.join(appPath, file)
    if (fs.existsSync(full)) return full
  }
  return null
}

async function main() {
  try {
    const apps = fs.readdirSync(appsDir).filter((name) => isAppDir(path.join(appsDir, name)))

    console.log(`\nUpdating Vite configs for ${apps.length} app directories...\n`)

    let updated = 0
    let skipped = 0
    let errors = 0

    for (const app of apps) {
      const appPath = path.join(appsDir, app)
      const viteConfig = findViteConfig(appPath)
      if (!viteConfig) {
        console.log(`⊘ ${app.padEnd(25)} - No vite.config.js/ts found`)
        skipped++
        continue
      }

      try {
        const result = normalizeViteConfig(viteConfig)
        if (result.status === 'updated') {
          console.log(`✓ ${app.padEnd(25)} - ${result.msg}`)
          updated++
        } else {
          console.log(`⊘ ${app.padEnd(25)} - ${result.msg}`)
          skipped++
        }
      } catch (error) {
        console.log(`✗ ${app.padEnd(25)} - ERROR: ${error.message}`)
        errors++
      }
    }

    console.log(`\n────────────────────────────────────────`)
    console.log(`Updated: ${updated}`)
    console.log(`Skipped: ${skipped}`)
    console.log(`Errors:  ${errors}`)
    console.log(`────────────────────────────────────────\n`)

    if (errors > 0) {
      process.exit(1)
    }
    process.exit(0)
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

main()
