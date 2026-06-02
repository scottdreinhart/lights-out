#!/usr/bin/env node
/**
 * analyze-consolidation.mjs — Analyze consolidation opportunities per app
 * Safe analysis without making changes
 * 
 * Usage:
 *   node analyze-consolidation.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const appsDir = path.join(rootDir, 'apps')

console.log(`\n╔═══════════════════════════════════════════════════════════╗`)
console.log(`║          Framework Consolidation Analysis              ║`)
console.log(`╚═══════════════════════════════════════════════════════════╝\n`)

const results = []

// Scan each app
const appDirs = fs.readdirSync(appsDir).filter(f => 
  fs.statSync(path.join(appsDir, f)).isDirectory()
)

for (const appName of appDirs) {
  const appPath = path.join(appsDir, appName)
  const srcPath = path.join(appPath, 'src')
  
  if (!fs.existsSync(srcPath)) continue

  let analysis = {
    app: appName,
    validationPatterns: 0,
    keyframes: 0,
    loadingPatterns: 0,
    hasErrors: 0,
    potentialSavings: 0,
  }

  // Find validation patterns
  try {
    const files = []
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          walk(fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          files.push(fullPath)
        }
      }
    }
    walk(srcPath)

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8')
      
      // Count validation patterns
      if (content.match(/useState.*valid|useValidat|validat.*Error|handleValidate/gi)) {
        analysis.validationPatterns++
      }
      
      // Count loading patterns
      if (content.match(/useState.*loading|useLoading|isLoading|showLoading/gi)) {
        analysis.loadingPatterns++
      }
    }

    // Count keyframes in CSS
    const cssFiles = []
    const walkCss = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          walkCss(fullPath)
        } else if (entry.name.endsWith('.css')) {
          cssFiles.push(fullPath)
        }
      }
    }
    walkCss(srcPath)

    for (const file of cssFiles) {
      const content = fs.readFileSync(file, 'utf-8')
      const matches = content.match(/@keyframes/g)
      if (matches) {
        analysis.keyframes += matches.length
      }
    }

    // Calculate potential savings
    analysis.potentialSavings = 
      (analysis.validationPatterns * 15) +  // ~15 LOC per validation pattern
      (analysis.keyframes * 3) +             // ~3 LOC per keyframe
      (analysis.loadingPatterns * 20)        // ~20 LOC per loading pattern
  } catch (err) {
    analysis.hasErrors = 1
  }

  results.push(analysis)
}

// Sort by potential savings
results.sort((a, b) => b.potentialSavings - a.potentialSavings)

// Display results
console.log('Top 15 Apps by Consolidation Opportunity:')
console.log('')
console.log('App Name'.padEnd(25) + 
            'Validation'.padEnd(12) + 
            'Keyframes'.padEnd(12) +
            'Loading'.padEnd(12) +
            'Savings'.padEnd(10))
console.log('─'.repeat(70))

let totalSavings = 0
for (let i = 0; i < Math.min(15, results.length); i++) {
  const r = results[i]
  if (r.potentialSavings > 0) {
    console.log(
      r.app.padEnd(25) +
      String(r.validationPatterns).padEnd(12) +
      String(r.keyframes).padEnd(12) +
      String(r.loadingPatterns).padEnd(12) +
      String(r.potentialSavings).padEnd(10)
    )
    totalSavings += r.potentialSavings
  }
}

console.log('─'.repeat(70))
console.log(`Total Potential Savings (Top 15): ${totalSavings} LOC`)
console.log(`Average per app: ${Math.round(totalSavings / 15)} LOC\n`)

// Summary
const appsWithOpportunity = results.filter(r => r.potentialSavings > 0).length
console.log(`📊 Summary:`)
console.log(`   Apps scanned: ${appDirs.length}`)
console.log(`   Apps with consolidation opportunity: ${appsWithOpportunity}`)
console.log(`   Total potential savings (all apps): ${results.reduce((s, r) => s + r.potentialSavings, 0)} LOC`)
console.log(`   Reduction if consolidated: ~75-85%\n`)
