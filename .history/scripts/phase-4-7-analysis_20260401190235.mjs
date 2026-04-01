#!/usr/bin/env node

/**
 * Phase 4-7 Decomposition Analysis
 *
 * Systematically identify consolidation opportunities across all 38 apps:
 * - Phase 4: Service consolidation patterns
 * - Phase 5: UI component extraction patterns
 * - Phase 6: Custom hook opportunities
 * - Phase 7: Game-specific engine packages
 */

import { readdirSync, statSync } from 'fs'
import { join } from 'path'

const APPS_DIR = './apps'
const REPO_ROOT = process.cwd()

// Get all app directories
const appDirs = readdirSync(APPS_DIR)
  .filter((f) => {
    const stat = statSync(join(APPS_DIR, f))
    return stat.isDirectory() && !f.startsWith('.')
  })
  .sort()

console.log(`\n📊 PHASE 4-7 DECOMPOSITION ANALYSIS`)
console.log(`${'='.repeat(70)}`)
console.log(`\nAnalyzing ${appDirs.length} apps for consolidation opportunities...\n`)

// Analysis results collection
const analysis = {
  hooks: new Map(),
  services: new Map(),
  components: new Map(),
  contexts: new Map(),
  engines: new Map(),
}

// Phase 4: Analyze services
console.log(`\n📂 PHASE 4: Service Consolidation`)
console.log(`${'─'.repeat(70)}`)

for (const app of appDirs) {
  const servicesDir = join(REPO_ROOT, APPS_DIR, app, 'src/app/services')
  try {
    const files = readdirSync(servicesDir)
      .filter((f) => f.match(/\.(ts|tsx)$/))
      .map((f) => f.replace(/\.(ts|tsx)$/, ''))

    if (files.length > 0) {
      analysis.services.set(app, files)
    }
  } catch {
    // Directory doesn't exist, skip
  }
}

// 2. Phase 5: Analyze UI components
console.log(`\n📦 PHASE 5: UI Component Extraction`)
console.log(`${'─'.repeat(70)}`)

// Count atoms/molecules/organisms across all apps
const componentStats = {
  atoms: 0,
  molecules: 0,
  organisms: 0,
  totalFiles: 0,
}

for (const app of appDirs) {
  const uiDir = join(REPO_ROOT, APPS_DIR, app, 'src/ui')
  try {
    const files = readdirSync(uiDir, { recursive: true })
    const tsxFiles = files.filter((f) => f.toString().match(/\.tsx?$/))

    tsxFiles.forEach((f) => {
      const path = f.toString()
      componentStats.totalFiles++
      if (path.includes('atoms/')) componentStats.atoms++
      if (path.includes('molecules/')) componentStats.molecules++
      if (path.includes('organisms/')) componentStats.organisms++
    })
  } catch {
    // Directory doesn't exist
  }
}

// 3. Phase 6: Identify custom hooks by pattern
console.log(`\n🪝 PHASE 6: Custom Hook Opportunities`)
console.log(`${'─'.repeat(70)}`)

const hookPatterns = {}

for (const app of appDirs) {
  const hooksDir = join(REPO_ROOT, APPS_DIR, app, 'src/app/hooks')
  try {
    const files = readdirSync(hooksDir)
      .filter((f) => f.match(/^use[A-Z].*\.(ts|tsx)$/))
      .map((f) => f.replace(/\.(ts|tsx)$/, ''))

    if (files.length > 0) {
      analysis.hooks.set(app, files)
    }
  } catch {
    // Directory doesn't exist
  }
}

// 4. Phase 7: Identify game-specific engines
console.log(`\n🎮 PHASE 7: Game-Specific Engine Packages`)
console.log(`${'─'.repeat(70)}`)

const enginePatterns = [
  'engine',
  'rules',
  'ai',
  'solver',
  'generator',
  'logic',
  'moves',
  'validator',
  'calc',
  'strategy',
]

for (const app of appDirs) {
  const domainDir = join(REPO_ROOT, APPS_DIR, app, 'src/domain')
  try {
    const files = readdirSync(domainDir)
      .filter((f) => f.match(/\.(ts|tsx)$/))
      .map((f) => f.replace(/\.(ts|tsx)$/, ''))

    const matches = files.filter((f) => enginePatterns.some((p) => f.toLowerCase().includes(p)))

    if (matches.length > 0) {
      analysis.engines.set(app, matches)
    }
  } catch {
    // Directory doesn't exist
  }
}

// Generate report
console.log(`\n\n📋 ANALYSIS REPORT`)
console.log(`${'='.repeat(70)}`)

// Phase 4 Report
console.log(`\nPHASE 4: Service Consolidation`)
console.log(`${'─'.repeat(40)}`)
if (analysis.services.size > 0) {
  console.log(`Found ${analysis.services.size} apps with custom services:`)
  for (const [app, services] of analysis.services.entries()) {
    console.log(`  ${app}: ${services.join(', ')}`)
  }
} else {
  console.log(`No custom services found (all using shared patterns).`)
}

// Phase 5 Report
console.log(`\nPHASE 5: UI Components`)
console.log(`${'─'.repeat(40)}`)
console.log(`Total component files: ${componentStats.totalFiles}`)
console.log(`  - Atoms: ${componentStats.atoms}`)
console.log(`  - Molecules: ${componentStats.molecules}`)
console.log(`  - Organisms: ${componentStats.organisms}`)

// Phase 6 Report
console.log(`\nPHASE 6: Custom Hooks`)
console.log(`${'─'.repeat(40)}`)
if (analysis.hooks.size > 0) {
  console.log(`Found ${analysis.hooks.size} apps with custom hooks:`)
  for (const [app, hooks] of analysis.hooks.entries()) {
    console.log(`  ${app}: ${hooks.join(', ')}`)
  }
} else {
  console.log(`No custom hooks follow use* pattern.`)
}

// Phase 7 Report
console.log(`\nPHASE 7: Game Engines`)
console.log(`${'─'.repeat(40)}`)
if (analysis.engines.size > 0) {
  console.log(`Found ${analysis.engines.size} apps with game engines:`)
  for (const [app, engines] of analysis.engines.entries()) {
    console.log(`  ${app}: ${engines.join(', ')}`)
  }
} else {
  console.log(`No game-specific engines identified.`)
}

// Summary
console.log(`\n\n✅ ANALYSIS COMPLETE`)
console.log(`${'='.repeat(70)}`)
console.log(`
Total apps analyzed: ${appDirs.length}
Apps with custom services: ${analysis.services.size}
Apps with custom hooks: ${analysis.hooks.size}
Apps with game engines: ${analysis.engines.size}

Recommendations for next phases:
- Phase 4: Review ${analysis.services.size > 0 ? analysis.services.size : 'potential'} service consolidation \\opportunities  
- Phase 5: Component extraction from common patterns
- Phase 6: Custom hook extraction and reuse patterns
- Phase 7: Create game-engine packages for reusable logic

`)
