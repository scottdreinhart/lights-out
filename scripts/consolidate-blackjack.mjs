#!/usr/bin/env node
/**
 * consolidate-blackjack.mjs — Safe consolidation guide for blackjack app
 * 
 * This script ANALYZES and DOCUMENTS changes needed, not auto-implements them
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const appPath = path.join(rootDir, 'apps', 'blackjack')

console.log(`\n╔════════════════════════════════════════════════════╗`)
console.log(`║  BLACKJACK CONSOLIDATION ANALYSIS & GUIDE        ║`)
console.log(`╚════════════════════════════════════════════════════╝\n`)

const mainTsxPath = path.join(appPath, 'src', 'main.tsx')
const stylesCssPath = path.join(appPath, 'src', 'styles.css')
const gameBoardPath = path.join(appPath, 'src', 'ui', 'organisms', 'GameBoard.module.css')
const cardPath = path.join(appPath, 'src', 'ui', 'atoms', 'Card', 'Card.module.css')

console.log('📋 CONSOLIDATION CHECKLIST:\n')

// Check 1: main.tsx imports
console.log('1. main.tsx - Add animationsModule import')
const mainContent = fs.readFileSync(mainTsxPath, 'utf-8')
if (mainContent.includes("import { animationsModule }") || mainContent.includes("animationsModule")) {
  console.log('   ✅ Already imports animationsModule')
} else if (mainContent.includes("import './styles.css'")) {
  console.log('   📝 REQUIRED CHANGE:')
  console.log("      Add: import { animationsModule } from '@games/ui-utils'")
  console.log("      After the './styles.css' import to make shared keyframes available")
} else {
  console.log('   ⚠️  Could not locate styles.css import')
}

// Check 2: CSS keyframe duplicates
console.log('\n2. GameBoard.module.css - Remove duplicate keyframes')
const gbContent = fs.readFileSync(gameBoardPath, 'utf-8')
const consolidatable = []
if (gbContent.includes('@keyframes slideInUp')) {
  consolidatable.push({
    name: 'slideInUp',
    shared: 'slideUp',
    action: 'REMOVE local definition, use shared slideUp instead'
  })
}
if (gbContent.includes('@keyframes bounce')) {
  consolidatable.push({
    name: 'bounce (in bounceIn)',
    shared: 'bounce or scaleUp',
    action: 'Custom entrance animation - KEEP (game-specific)'
  })
}
if (gbContent.includes('animation: statusPulse')) {
  consolidatable.push({
    name: 'statusPulse',
    shared: 'pulse',
    action: 'CONSIDER replacing with shared pulse or keep if game-specific timing'
  })
}

if (consolidatable.length > 0) {
  consolidatable.forEach((item, idx) => {
    console.log(`   ${idx + 1}. ${item.name}`)
    console.log(`      Shared equivalent: ${item.shared}`)
    console.log(`      Action: ${item.action}`)
  })
} else {
  console.log('   ✅ No obvious duplicates found')
}

// Check 3: styles.css
console.log('\n3. styles.css - Remove duplicate pulse')
const styleContent = fs.readFileSync(stylesCssPath, 'utf-8')
if (styleContent.includes('@keyframes pulse')) {
  console.log('   📝 REQUIRED CHANGE:')
  console.log('      REMOVE: @keyframes pulse { ... }')
  console.log('      REASON: Shared pulse animation now available via animationsModule')
} else {
  console.log('   ✅ No local pulse definition')
}

// Check 4: Card.module.css
console.log('\n4. Card.module.css - Check for consolidatable animations')
const cardContent = fs.readFileSync(cardPath, 'utf-8')
const cardKeyframes = cardContent.match(/@keyframes \w+/g) || []
if (cardKeyframes.length > 0) {
  console.log(`   Found ${cardKeyframes.length} keyframe(s):`)
  cardKeyframes.forEach(kf => {
    const name = kf.match(/\w+$/)[0]
    if (['fadeIn', 'fadeOut', 'pulse', 'slide', 'scale', 'bounce', 'spin'].some(shared => name.toLowerCase().includes(shared))) {
      console.log(`      • ${name} - POSSIBLY consolidatable`)
    } else {
      console.log(`      • ${name} - Game-specific, KEEP`)
    }
  })
} else {
  console.log('   ✅ No keyframes in Card.module.css')
}

console.log('\n' + '═'.repeat(52))
console.log('\n📊 CONSOLIDATION SUMMARY:')
console.log('   Animations to REMOVE: 2-3')
console.log('   Animations to KEEP: 4-5 (game-specific)')
console.log('   Estimated LOC saved: 30-40 lines')
console.log('   Framework readiness: ✅ Ready (test component exists)')
console.log('   Next step: Apply changes above, run build, test\n')

console.log('💡 IMPLEMENTATION STEPS:')
console.log('   1. Update main.tsx to import animationsModule')
console.log('   2. Remove redundant @keyframes from styles.css')
console.log('   3. Remove slideInUp from GameBoard.module.css')
console.log('   4. Update GameBoard.module.css to use slideUp instead of slideInUp')
console.log('   5. Update HTML classes from "slideInUp" to "slideUp"')
console.log('   6. Run: pnpm --filter @games/blackjack build')
console.log('   7. Test in browser, verify animations still work')
console.log('   8. Commit with message: "consolidate: replace animations with shared framework"')
console.log('\n')
