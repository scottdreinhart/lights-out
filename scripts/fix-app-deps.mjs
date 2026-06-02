#!/usr/bin/env node
/**
 * Fix missing workspace dependencies in all game apps
 * Detects @games/* imports and adds them to package.json
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
const ROOT = path.resolve(__dirname, '..')
const APPS_DIR = path.join(ROOT, 'apps')

// Standard packages all apps typically use
const STANDARD_PACKAGES = [
  '@games/app-hook-utils',
  '@games/assets-shared',
  '@games/common',
  '@games/domain-shared',
  '@games/storage-utils',
  '@games/theme-context',
  '@games/sound-context',
  '@games/ui-utils',
]

// Recursively find all .ts and .tsx files
function findFiles(dir) {
  const files = []
  try {
    const items = fs.readdirSync(dir)
    items.forEach((item) => {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        files.push(...findFiles(fullPath))
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        files.push(fullPath)
      }
    })
  } catch (e) {
    // Ignore errors
  }
  return files
}

// Detect which packages an app actually imports
function detectPackages(appDir) {
  const srcDir = path.join(appDir, 'src')
  if (!fs.existsSync(srcDir)) return []

  const files = findFiles(srcDir)
  const imports = new Set()

  files.forEach((filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const matches = content.matchAll(/from\s+['"](@games\/[a-z0-9-]+)['"]/g)
      for (const match of matches) {
        imports.add(match[1])
      }
    } catch (e) {
      // Ignore read errors
    }
  })

  return Array.from(imports).sort()
}

// Update package.json with workspace dependencies
function updatePackageJson(appDir, packages) {
  const pkgPath = path.join(appDir, 'package.json')
  if (!fs.existsSync(pkgPath)) return false

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

  if (!pkg.dependencies) {
    pkg.dependencies = {}
  }

  // Add all detected packages with workspace version
  packages.forEach((pkg_name) => {
    pkg.dependencies[pkg_name] = '*'
  })

  // Also add standard packages if not already there
  STANDARD_PACKAGES.forEach((pkg_name) => {
    if (!pkg.dependencies[pkg_name]) {
      pkg.dependencies[pkg_name] = '*'
    }
  })

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  return true
}

// Main
const apps = fs
  .readdirSync(APPS_DIR)
  .filter((name) => fs.statSync(path.join(APPS_DIR, name)).isDirectory() && name !== 'ui')
  .sort()

console.log(`🔧 Fixing ${apps.length} game apps...\n`)

let fixed = 0
apps.forEach((appName) => {
  const appDir = path.join(APPS_DIR, appName)
  const detected = detectPackages(appDir)

  if (detected.length > 0) {
    updatePackageJson(appDir, detected)
    console.log(`✅ ${appName}: ${detected.length} packages`)
    fixed++
  } else {
    // Add standard packages even if no imports detected yet
    updatePackageJson(appDir, [])
    console.log(`⚠️  ${appName}: using standard packages`)
  }
})

console.log(`\n✨ Fixed ${fixed} apps!`)
console.log('\nNext: pnpm clean:node && pnpm install')
