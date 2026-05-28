#!/usr/bin/env node

/**
 * Fix @games/diagnostics-utils TypeScript path in all app tsconfig.json files
 * 
 * This script adds the missing path configuration to allow apps to resolve
 * the diagnostics-utils package from the shared packages directory.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

// Find all app directories
const appsDir = path.join(rootDir, 'apps')
const appDirs = fs.readdirSync(appsDir).filter(f => {
  const fullPath = path.join(appsDir, f)
  return fs.statSync(fullPath).isDirectory()
})

let fixed = 0
let skipped = 0

for (const appDir of appDirs) {
  const tsconfigPath = path.join(appsDir, appDir, 'tsconfig.json')
  
  if (!fs.existsSync(tsconfigPath)) {
    skipped++
    continue
  }

  let content = fs.readFileSync(tsconfigPath, 'utf-8')
  
  // Check if already has diagnostics-utils path
  if (content.includes('@games/diagnostics-utils')) {
    skipped++
    continue
  }

  // Check if it has a paths object
  if (!content.includes('"@games/')) {
    skipped++
    continue
  }

  // Add the diagnostics-utils path after app-hook-utils entries
  const diagnosticsPath = `      "@games/diagnostics-utils": [\n        "../../packages/diagnostics-utils/src"\n      ],`
  
  // Find the position to insert - after app-hook-utils/* entry
  const appHookUtilsMatch = content.match(/"@games\/app-hook-utils\/\*":\s*\[[^\]]*\]\n/)
  
  if (appHookUtilsMatch) {
    const insertPos = appHookUtilsMatch.index + appHookUtilsMatch[0].length
    content = content.slice(0, insertPos) + diagnosticsPath + '\n' + content.slice(insertPos)
    fs.writeFileSync(tsconfigPath, content)
    fixed++
    console.log(`✅ Fixed: ${appDir}`)
  } else {
    skipped++
  }
}

console.log(`\n📊 Results:`)
console.log(`   Fixed: ${fixed}`)
console.log(`   Skipped: ${skipped}`)
