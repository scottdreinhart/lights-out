import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  BLUE: '\x1b[94m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const APPS_DIR = path.join(ROOT_DIR, 'apps')
const HELPER_IMPORT = '../../scripts/vite/createOptimizedViteConfig.mjs'
const HELPER_IMPORT_LINE = `import { createOptimizedBuild, createOptimizedPlugins, createOptimizedResolve } from '${HELPER_IMPORT}'`

function listViteConfigs(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      files.push(...listViteConfigs(fullPath))
      continue
    }

    if (/vite\.config\.(js|ts)$/.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

function findBalancedRange(text, startIndex, openChar, closeChar) {
  let depth = 0
  let stringQuote = null
  let escaped = false
  let inLineComment = false
  let inBlockComment = false

  for (let index = startIndex; index < text.length; index += 1) {
    const char = text[index]
    const next = text[index + 1]

    if (inLineComment) {
      if (char === '\n') {
        inLineComment = false
      }
      continue
    }

    if (inBlockComment) {
      if (char === '*' && next === '/') {
        inBlockComment = false
        index += 1
      }
      continue
    }

    if (stringQuote) {
      if (escaped) {
        escaped = false
        continue
      }

      if (char === '\\') {
        escaped = true
        continue
      }

      if (char === stringQuote) {
        stringQuote = null
      }
      continue
    }

    if (char === '/' && next === '/') {
      inLineComment = true
      index += 1
      continue
    }

    if (char === '/' && next === '*') {
      inBlockComment = true
      index += 1
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      stringQuote = char
      continue
    }

    if (char === openChar) {
      depth += 1
      continue
    }

    if (char === closeChar) {
      depth -= 1
      if (depth === 0) {
        return index
      }
    }
  }

  throw new Error(`Unbalanced block starting at index ${startIndex}`)
}

function replaceBlock(text, key, openChar, closeChar, replacement) {
  const keyPattern = new RegExp(`^(\\s*)${key}:\\s*\\${openChar}`, 'm')
  const match = keyPattern.exec(text)

  if (!match) {
    return text
  }

  const startIndex = match.index
  const openIndex = text.indexOf(openChar, startIndex)
  const closeIndex = findBalancedRange(text, openIndex, openChar, closeChar)
  const endIndex = text[closeIndex + 1] === ',' ? closeIndex + 1 : closeIndex

  return `${text.slice(0, startIndex)}${match[1]}${replacement}${text.slice(endIndex + 1)}`
}

function insertHelperImport(text) {
  if (text.includes(HELPER_IMPORT)) {
    return text
  }

  const viteImportPattern = /import\s+\{\s*defineConfig\s*\}\s+from\s+'vite'\r?\n/

  if (viteImportPattern.test(text)) {
    return text.replace(
      viteImportPattern,
      `import { defineConfig } from 'vite'\n${HELPER_IMPORT_LINE}\n`,
    )
  }

  return `${HELPER_IMPORT_LINE}\n${text}`
}

function rewriteConfig(text) {
  const hasAnalyzeMode = /mode === 'analyze'|isAnalyzeMode/.test(text)
  const hasModeParam = /defineConfig\(\(\{\s*mode\s*\}\)\s*=>/.test(text)

  let nextText = text

  nextText = nextText.replace(/^import react from '@vitejs\/plugin-react'\r?\n/m, '')
  nextText = nextText.replace(/^import \{ visualizer \} from 'rollup-plugin-visualizer'\r?\n/m, '')
  nextText = nextText.replace(/^import viteCompression from 'vite-plugin-compression'\r?\n/m, '')
  nextText = nextText.replace(/^\s*const isAnalyzeMode = mode === 'analyze'\r?\n/m, '')
  nextText = insertHelperImport(nextText)

  if (!nextText.includes('plugins: createOptimizedPlugins')) {
    const pluginReplacement = hasAnalyzeMode
      ? hasModeParam
        ? "plugins: createOptimizedPlugins({ mode, visualizerMode: 'analyze' }),"
        : "plugins: createOptimizedPlugins({ visualizerMode: 'analyze' }),"
      : hasModeParam
        ? 'plugins: createOptimizedPlugins({ mode }),'
        : 'plugins: createOptimizedPlugins(),'

    nextText = replaceBlock(nextText, 'plugins', '[', ']', pluginReplacement)
  }

  nextText = nextText.replace(
    /^(\s*)dedupe: \['react', 'react-dom'\],\r?\n/m,
    '$1...createOptimizedResolve(),\n',
  )

  if (!nextText.includes('build: createOptimizedBuild')) {
    const buildMatch = /^(\s*)build:\s*\{/m.exec(nextText)

    if (buildMatch) {
      const startIndex = buildMatch.index
      const openIndex = nextText.indexOf('{', startIndex)
      const closeIndex = findBalancedRange(nextText, openIndex, '{', '}')
      const buildBlock = nextText.slice(startIndex, closeIndex + 1)
      const overrides = /sourcemap:\s*true/.test(buildBlock) ? '{ sourcemap: true }' : ''
      const replacement = overrides
        ? `${buildMatch[1]}build: createOptimizedBuild(${overrides}),`
        : `${buildMatch[1]}build: createOptimizedBuild(),`

      nextText = `${nextText.slice(0, startIndex)}${replacement}${nextText.slice(closeIndex + 2)}`
    }
  }

  return nextText
}

const configFiles = listViteConfigs(APPS_DIR)
let updatedCount = 0

for (const filePath of configFiles) {
  const before = fs.readFileSync(filePath, 'utf8')
  const after = rewriteConfig(before)

  if (after !== before) {
    fs.writeFileSync(filePath, after)
    updatedCount += 1
    console.log(`updated ${path.relative(ROOT_DIR, filePath)}`)
  }
}

console.log(`rewrote ${updatedCount} vite config files`)
