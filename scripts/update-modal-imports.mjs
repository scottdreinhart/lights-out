#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const appDir = 'apps'
const dirs = readdirSync(appDir)

let updated = 0
for (const dir of dirs) {
  const platformDir = join(appDir, dir, 'src/ui/organisms/platform')
  if (!existsSync(platformDir)) continue
  
  const files = readdirSync(platformDir)
  for (const file of files) {
    if (file.endsWith('Modal.tsx')) {
      const filePath = join(platformDir, file)
      let content = readFileSync(filePath, 'utf-8')
      
      // Check if it still imports from local Modal.module.css
      if (content.includes("from './Modal.module.css'")) {
        // Replace the local import with modalStyles from @games/ui-utils
        const oldImport = "import styles from './Modal.module.css'"
        const newImport = "import { modalStyles } from '@games/ui-utils'"
        
        content = content.replace(oldImport, newImport)
        
        // Replace all styles. references with modalStyles.
        content = content.replace(/styles\./g, 'modalStyles.')
        
        writeFileSync(filePath, content, 'utf-8')
        console.log(`Updated: ${filePath}`)
        updated++
      }
    }
  }
}

console.log(`\nTotal files updated: ${updated}`)
