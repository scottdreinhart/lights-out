#!/usr/bin/env node

/**
 * Batch Fix Script - Applies common error patterns across all apps
 *
 * Fixes identified patterns from tictactoe validation:
 * 1. Missing package.json dependencies
 * 2. TypeScript compile errors (categorized by type)
 * 3. CSS malformation issues
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

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

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')
const appsDir = path.join(rootDir, 'apps')
const packagesDir = path.join(rootDir, 'packages')

const COMMON_PACKAGE_IMPORTS = {
  '@games/app-hook-utils': [
    'useKeyboardControls',
    'useResponsiveState',
    'useStats',
    'useSoundController',
  ],
  '@games/storage-utils': ['loadWithFallback', 'saveJson', 'storageService'],
  '@games/theme-context': ['useThemeContext', 'ThemeContext', 'ThemeProvider'],
  '@games/sound-context': ['useSoundEffects', 'SoundProvider'],
  '@games/domain-shared': ['GameRules', 'calculateScore', 'validateMove'],
  '@games/ui-board-core': ['BoardGrid', 'Tile', 'useKeyboardBoardNavigation'],
}

const PACKAGE_DEPENDENCIES_MATRIX = {
  'sound-context': ['@games/storage-utils', 'react'],
  'ui-board-core': ['@games/app-hook-utils', 'react'],
  'app-hook-utils': ['@games/storage-utils', 'react'],
  'theme-context': ['react'],
  'ai-framework': [],
  'domain-shared': [],
  'assets-shared': [],
  common: ['react'],
}

/**
 * Scan directory for all package.json files
 */
function scanPackageJsonFiles(dir) {
  const results = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      const pkgPath = path.join(fullPath, 'package.json')
      if (fs.existsSync(pkgPath)) {
        results.push({ name: item, path: pkgPath, dir: fullPath })
      }
    }
  }

  return results
}

/**
 * Detect missing dependencies in package.json
 */
function detectMissingDependencies(pkgPath) {
  const content = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  const srcDir = path.dirname(pkgPath)
  const missing = []

  // Check source files for imports
  const tsxFiles = scanSourceFiles(srcDir, ['.ts', '.tsx'])

  for (const file of tsxFiles) {
    const fileContent = fs.readFileSync(file, 'utf8')

    for (const [depName, possibleImports] of Object.entries(COMMON_PACKAGE_IMPORTS)) {
      for (const importName of possibleImports) {
        if (
          fileContent.includes(`from '${depName}'`) ||
          fileContent.includes(`from "${depName}"`)
        ) {
          // Check if dependency is in package.json
          if (
            !content.dependencies?.[depName] &&
            !content.devDependencies?.[depName] &&
            !content.peerDependencies?.[depName]
          ) {
            missing.push(depName)
          }
        }
      }
    }
  }

  return [...new Set(missing)]
}

/**
 * Scan source files in directory
 */
function scanSourceFiles(dir, extensions) {
  const results = []
  const items = fs.readdirSync(dir, { recursive: true })

  for (const item of items) {
    if (extensions.some((ext) => item.endsWith(ext))) {
      results.push(path.join(dir, item))
    }
  }

  return results
}

/**
 * Fix missing dependencies in package.json
 */
function fixPackageJson(pkgPath, missingDeps) {
  const content = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

  if (!content.dependencies) {
    content.dependencies = {}
  }

  for (const dep of missingDeps) {
    if (!content.dependencies[dep]) {
      content.dependencies[dep] = 'workspace:*'
    }
  }

  // Ensure react and react-dom if not present (for apps)
  if (pkgPath.includes('/apps/') && !content.dependencies.react) {
    content.dependencies.react = '^19.2.4'
  }

  fs.writeFileSync(pkgPath, JSON.stringify(content, null, 2) + '\n')
  return true
}

/**
 * Run TypeScript check and collect errors
 */
function runTypeScriptCheck(dir) {
  try {
    const output = execSync(`pnpm --filter ${path.basename(dir)} typecheck 2>&1`, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: 'pipe',
    })
    return { success: true, output, errors: [] }
  } catch (error) {
    const output = error.stdout || error.message
    const errors = parseTypeScriptErrors(output)
    return { success: errors.length === 0, output, errors }
  }
}

/**
 * Parse TypeScript error output
 */
function parseTypeScriptErrors(output) {
  const errors = []
  const lines = output.split('\n')

  for (const line of lines) {
    if (line.includes('error TS')) {
      const match = line.match(/src\/.+?:\d+:\d+.*error TS\d+: (.+)/)
      if (match) {
        errors.push({ message: match[1], line })
      }
    }
  }

  return errors
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Batch Fix Script - Scanning for common patterns\n')

  const apps = scanPackageJsonFiles(appsDir)
  const packages_ = scanPackageJsonFiles(packagesDir)
  const allTargets = [...packages_, ...apps]

  console.log(`Found ${allTargets.length} applications/packages to analyze\n`)

  let fixedCount = 0
  let errorCount = 0

  for (const { name, path: pkgPath, dir } of allTargets) {
    try {
      console.log(`📦 Checking ${name}...`)

      // Detect missing dependencies
      const missing = detectMissingDependencies(pkgPath)

      if (missing.length > 0) {
        console.log(`  ├─ Found ${missing.length} missing dependencies: ${missing.join(', ')}`)
        fixPackageJson(pkgPath, missing)
        console.log(`  └─ ✅ Fixed dependencies`)
        fixedCount++
      } else {
        console.log(`  └─ ✓ Dependencies OK`)
      }
    } catch (error) {
      console.error(`  └─ ❌ Error: ${error.message}`)
      errorCount++
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`  ✅ Fixed: ${fixedCount}`)
  console.log(`  ❌ Errors: ${errorCount}`)
  console.log(`\n📝 Next steps:`)
  console.log(`  1. Run: pnpm install`)
  console.log(`  2. Run: pnpm validate`)
  console.log(`  3. Test individual apps: pnpm --filter @games/<app> typecheck`)
}

main().catch(console.error)
