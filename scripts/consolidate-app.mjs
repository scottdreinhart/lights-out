#!/usr/bin/env node
/**
 * consolidate-app.mjs — Consolidate individual app to use Phase 8 frameworks
 * 
 * Replaces duplicate animation keyframes with imports from @games/ui-utils
 * 
 * Usage:
 *   node consolidate-app.mjs nim
 *   node consolidate-app.mjs tictactoe
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const appName = process.argv[2]

if (!appName) {
  console.error('❌ Usage: node consolidate-app.mjs <app-name>')
  process.exit(1)
}

const appDir = path.join(rootDir, 'apps', appName)
if (!fs.existsSync(appDir)) {
  console.error(`❌ App not found: ${appName}`)
  process.exit(1)
}

console.log(`\n╔═══════════════════════════════════════════════════════════╗`)
console.log(`║        App Consolidation: ${appName.padEnd(40)}║`)
console.log(`╚═══════════════════════════════════════════════════════════╝\n`)

// Find all CSS module files
const cssFiles = []
function findCssFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      findCssFiles(path.join(dir, entry.name))
    } else if (entry.name.endsWith('.module.css')) {
      cssFiles.push(path.join(dir, entry.name))
    }
  }
}

findCssFiles(path.join(appDir, 'src'))

// List of common animations we can consolidate
const commonAnimations = [
  'fadeIn',
  'fadeOut',
  'slideUp',
  'slideDown',
  'slideLeft',
  'slideRight',
  'scaleUp',
  'scaleDown',
  'spin',
  'spinReverse',
  'pulse',
  'bounce',
  'shimmer',
  'blink',
]

// Track replacements
let totalKeyframesRemoved = 0
let filesModified = 0

// Process each CSS file
for (const cssFile of cssFiles) {
  let content = fs.readFileSync(cssFile, 'utf-8')
  const originalContent = content
  
  // Check for common keyframe patterns
  for (const animation of commonAnimations) {
    const keyframeRegex = new RegExp(`@keyframes ${animation}\\s*\\{[^}]*\\}`, 'g')
    const matches = content.match(keyframeRegex)
    
    if (matches) {
      totalKeyframesRemoved += matches.length
      // Remove the keyframe definitions
      content = content.replace(keyframeRegex, '')
    }
  }
  
  // Clean up extra whitespace
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n')
  
  if (content !== originalContent) {
    fs.writeFileSync(cssFile, content)
    filesModified++
    console.log(`  ✅ Updated: ${path.relative(appDir, cssFile)}`)
  }
}

// Find all tsx/ts files
const tsFiles = []
function findTsFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      findTsFiles(path.join(dir, entry.name))
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      tsFiles.push(path.join(dir, entry.name))
    }
  }
}

findTsFiles(path.join(appDir, 'src'))

// Check if animationsModule needs to be imported
let hasAnimationUsage = false
for (const tsFile of tsFiles) {
  const content = fs.readFileSync(tsFile, 'utf-8')
  if (content.includes('animationsModule') || content.includes('animations')) {
    hasAnimationUsage = true
    break
  }
}

// Update imports in index files if consolidating animations
if (totalKeyframesRemoved > 0) {
  for (const tsFile of tsFiles) {
    if (tsFile.includes('/index.ts')) {
      let content = fs.readFileSync(tsFile, 'utf-8')
      
      // Add animation import if not already present
      if (!content.includes('animationsModule')) {
        const importLine = `import { animationsModule } from '@games/ui-utils'\n`
        
        // Find where to insert the import
        if (!content.includes('from \'@games/')) {
          // No imports yet, add at top
          content = importLine + content
        } else {
          // Insert after other @games imports
          const lastGameImportIdx = content.lastIndexOf("from '@games/")
          const lineEnd = content.indexOf('\n', lastGameImportIdx)
          content = content.slice(0, lineEnd + 1) + importLine + content.slice(lineEnd + 1)
        }
        
        fs.writeFileSync(tsFile, content)
        console.log(`  ✅ Updated imports: ${path.relative(appDir, tsFile)}`)
      }
    }
  }
}

console.log(`\n📊 Summary:`)
console.log(`   Keyframes removed: ${totalKeyframesRemoved}`)
console.log(`   Files modified: ${filesModified}`)
console.log(`   Estimated LOC saved: ~${totalKeyframesRemoved * 3} lines`)
console.log(`\n✅ App consolidation complete for ${appName}!`)
console.log(`\n💡 Next: Run 'pnpm --filter @games/${appName} build' to verify\n`)
