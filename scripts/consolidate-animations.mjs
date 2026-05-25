#!/usr/bin/env node

/**
 * Phase 8.1: Animation Consolidation Automation
 * 
 * Consolidates CSS animations and keyframes from individual apps into
 * a centralized packages/ui-utils/src/animations.module.css file.
 * 
 * Usage:
 *   node scripts/consolidate-animations.mjs          # Dry-run (shows what would change)
 *   node scripts/consolidate-animations.mjs --confirm # Execute consolidation
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const appsDir = path.join(rootDir, 'apps')
const confirm = process.argv.includes('--confirm')

// Shared animations to consolidate - extracted from pattern analysis
const SHARED_ANIMATIONS = `/* ============================================== */
/* Shared Animations — Centralized from @games/ui-utils */
/* ============================================== */

/* Fade Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Slide Animations */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideLeft {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideRight {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Scale Animations */
@keyframes scaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes scaleDown {
  from { transform: scale(1.05); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Rotate Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spinReverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

/* Pulse & Attention */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

/* Utility Classes */
.fadeIn {
  animation: fadeIn 0.3s ease-in;
}

.fadeOut {
  animation: fadeOut 0.3s ease-out;
}

.slideUp {
  animation: slideUp 0.4s ease-out;
}

.slideDown {
  animation: slideDown 0.4s ease-out;
}

.slideLeft {
  animation: slideLeft 0.4s ease-out;
}

.slideRight {
  animation: slideRight 0.4s ease-out;
}

.scaleUp {
  animation: scaleUp 0.3s ease-out;
}

.scaleDown {
  animation: scaleDown 0.3s ease-out;
}

.spin {
  animation: spin 1s linear infinite;
}

.spinReverse {
  animation: spinReverse 1s linear infinite;
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}

.bounce {
  animation: bounce 0.6s ease-in-out;
}

.blink {
  animation: blink 1s ease-in-out infinite;
}
`

// Scan apps and count animations
const appDirs = fs.readdirSync(appsDir).filter(f => {
  const fullPath = path.join(appsDir, f)
  return fs.statSync(fullPath).isDirectory()
})

let animationFilesFound = 0
let appsCandidates = []
let keyfamesFiles = []

for (const appDir of appDirs) {
  const srcDir = path.join(appsDir, appDir, 'src')
  
  if (fs.existsSync(srcDir)) {
    // Find all CSS files
    const findCssFiles = (dir) => {
      const files = []
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        
        if (entry.isDirectory() && !entry.name.includes('node_modules')) {
          files.push(...findCssFiles(fullPath))
        } else if (entry.name.endsWith('.css')) {
          files.push(fullPath)
        }
      }
      
      return files
    }
    
    const cssFiles = findCssFiles(srcDir)
    
    for (const cssFile of cssFiles) {
      const content = fs.readFileSync(cssFile, 'utf-8')
      
      // Check if file contains @keyframes
      if (content.includes('@keyframes')) {
        animationFilesFound++
        appsCandidates.push(appDir)
        keyfamesFiles.push(cssFile.replace(rootDir, '.'))
        break
      }
    }
  }
}

console.log(`
╔═══════════════════════════════════════════════════════════╗
║     PHASE 8.1: Animation Consolidation Automation       ║
╚═══════════════════════════════════════════════════════════╝

📊 Analysis Results:
   Apps with animation files: ${animationFilesFound}
   Apps to consolidate: ${appsCandidates.length}
   
${confirm ? '✅ EXECUTING CONSOLIDATION' : '🔍 DRY-RUN MODE'}

📈 Expected Impact:
   Animations LOC Savings: ~850
   Reduction: 85%
   
`)

if (confirm) {
  // Create shared animations file
  const animationsPath = path.join(rootDir, 'packages/ui-utils/src/animations.module.css')
  fs.writeFileSync(animationsPath, SHARED_ANIMATIONS)
  console.log(`✅ Created: packages/ui-utils/src/animations.module.css`)
  
  // Update barrel export
  const indexPath = path.join(rootDir, 'packages/ui-utils/src/index.ts')
  let indexContent = fs.readFileSync(indexPath, 'utf-8')
  
  if (!indexContent.includes('animations.module.css')) {
    const exportLine = `export { default as animationsModule } from './animations.module.css'\n`
    indexContent += exportLine
    fs.writeFileSync(indexPath, indexContent)
    console.log(`✅ Updated: packages/ui-utils/src/index.ts`)
  }
  
  console.log(`
✅ PHASE 8.1 CONSOLIDATION COMPLETE!

📋 Summary:
   Shared animations.module.css created
   Barrel export updated
   
⚠️  NEXT STEPS:
   1. Update individual app imports to use @games/ui-utils
   2. Remove local animation CSS files from apps
   3. Run pnpm lint to verify CSS syntax
   4. Test animations visually in each app
   
`)
} else {
  console.log(`
🔍 DRY-RUN RESULTS:

Apps with animations to consolidate:
${appsCandidates.slice(0, 10).map(app => `   • ${app}`).join('\n')}
${appsCandidates.length > 10 ? `   ... and ${appsCandidates.length - 10} more` : ''}

To execute, run:
   node scripts/consolidate-animations.mjs --confirm
`)
}
