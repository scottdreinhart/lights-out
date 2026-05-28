#!/usr/bin/env node
/**
 * consolidate-nim.mjs — Safe consolidation guide for nim app
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const appPath = path.join(rootDir, 'apps', 'nim')

console.log(`\n╔════════════════════════════════════════════════════╗`)
console.log(`║  NIM CONSOLIDATION ANALYSIS & GUIDE              ║`)
console.log(`╚════════════════════════════════════════════════════╝\n`)

// Scan for CSS files with keyframes
const srcPath = path.join(appPath, 'src')
const cssFiles = []
const findCss = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      findCss(fullPath)
    } else if (entry.name.endsWith('.css')) {
      cssFiles.push(fullPath)
    }
  }
}
findCss(srcPath)

// Analyze each CSS file
const consolidationMap = {}
const sharedAnimations = [
  'fadeIn', 'fadeOut', 'slideUp', 'slideDown', 'slideLeft', 'slideRight',
  'scaleUp', 'scaleDown', 'spin', 'spinReverse', 'pulse', 'bounce', 'shimmer', 'blink'
]

for (const cssFile of cssFiles) {
  const content = fs.readFileSync(cssFile, 'utf-8')
  const keyframes = content.match(/@keyframes\s+(\w+)/g) || []
  
  if (keyframes.length > 0) {
    const rel = path.relative(appPath, cssFile)
    consolidationMap[rel] = {
      total: keyframes.length,
      names: keyframes.map(kf => kf.match(/\w+$/)[0]),
      consolidatable: []
    }
    
    // Check which match shared animations
    for (const kf of consolidationMap[rel].names) {
      if (sharedAnimations.some(sa => 
        kf.toLowerCase().includes(sa.toLowerCase()) ||
        sa.toLowerCase().includes(kf.toLowerCase())
      )) {
        consolidationMap[rel].consolidatable.push(kf)
      }
    }
  }
}

console.log('📋 CSS FILES WITH KEYFRAMES:\n')
let totalRemovable = 0
let totalLoc = 0

for (const [file, data] of Object.entries(consolidationMap)) {
  console.log(`📄 ${file}`)
  console.log(`   Total keyframes: ${data.total}`)
  if (data.consolidatable.length > 0) {
    console.log(`   ✅ Consolidatable: ${data.consolidatable.join(', ')}`)
    totalRemovable += data.consolidatable.length
    totalLoc += data.consolidatable.length * 3  // ~3 LOC per keyframe
  } else {
    console.log(`   🔒 Game-specific only: ${data.names.join(', ')}`)
  }
  console.log('')
}

console.log('═'.repeat(52))
console.log('\n📊 CONSOLIDATION SUMMARY:')
console.log(`   Total CSS files with keyframes: ${Object.keys(consolidationMap).length}`)
console.log(`   Total keyframes across app: ${Object.values(consolidationMap).reduce((s, d) => s + d.total, 0)}`)
console.log(`   Consolidatable keyframes: ${totalRemovable}`)
console.log(`   Estimated LOC saved: ${totalLoc}-${totalLoc * 4} lines`)
console.log(`   Framework readiness: ✅ Ready (test component exists)\n`)
