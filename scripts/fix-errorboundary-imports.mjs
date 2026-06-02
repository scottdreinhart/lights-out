#!/usr/bin/env node

/**
 * Update all app atoms/index.ts to import ErrorBoundary from @games/ui-utils
 * instead of @games/common, to bypass typescript resolution issues.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const appsDir = path.join(rootDir, 'apps')

let updated = 0
let failed = 0

const appDirs = fs.readdirSync(appsDir).filter(f => {
  const fullPath = path.join(appsDir, f)
  return fs.statSync(fullPath).isDirectory()
})

for (const appDir of appDirs) {
  const atomsIndexPath = path.join(appsDir, appDir, 'src/ui/atoms/index.ts')
  
  if (!fs.existsSync(atomsIndexPath)) {
    continue
  }

  let content = fs.readFileSync(atomsIndexPath, 'utf-8')
  
  // Update the export statement
  const updated_content = content
    .replace(
      /export \{ ErrorBoundary, OfflineIndicator, SplashScreen \} from '@games\/common'/,
      `export { ErrorBoundary } from '@games/ui-utils'\nexport { OfflineIndicator, SplashScreen } from '@games/common'`
    )
  
  if (updated_content !== content) {
    fs.writeFileSync(atomsIndexPath, updated_content)
    updated++
    console.log(`✅ Updated: ${appDir}`)
  }
}

console.log(`\n📊 Results: ${updated} apps updated`)
