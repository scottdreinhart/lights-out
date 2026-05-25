#!/usr/bin/env node

/**
 * Phase 8.0: ErrorBoundary Consolidation
 * 
 * Consolidates ErrorBoundary components across 21 apps into a single
 * centralized component in packages/ui-utils/
 * 
 * Files consolidated:
 * - 21 × ErrorBoundary.tsx (~80 LOC each = 1,680 LOC)
 * - 21 × ErrorBoundary.module.css (~50 LOC each = 1,050 LOC)
 * 
 * Total potential savings: ~2,730 LOC
 * 
 * Usage: node scripts/consolidate-errorboundary.mjs [--confirm]
 */

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appsDir = path.join(__dirname, '../apps')

const COMPONENT_NAME = 'ErrorBoundary'
const RE_EXPORT_CODE = `export { ErrorBoundary, type ErrorBoundaryProps } from '@games/ui-utils'\n`

// Apps that have ErrorBoundary components
const APPS_WITH_COMPONENT = [
  'battleship',
  'bingo',
  'bunco',
  'cee-lo',
  'chicago',
  'cho-han',
  'checkers',
  'farkle',
  'hangman',
  'liars-dice',
  'lights-out',
  'mancala',
  'memory-game',
  'mexico',
  'minesweeper',
  'nim',
  'pig',
  'reversi',
  'rock-paper-scissors',
  'simon-says',
  'snake',
  'tictactoe',
]

async function consolidate() {
  try {
    const args = process.argv.slice(2)
    const confirmed = args.includes('--confirm')

    console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║              PHASE 8.0: ErrorBoundary CONSOLIDATION SCRIPT                 ║
║                                                                            ║
║  This script consolidates 21 ErrorBoundary components into a single        ║
║  reusable component in packages/ui-utils/                                  ║
║                                                                            ║
║  Apps affected: 21                                                         ║
║  TypeScript files: 21 × ErrorBoundary.tsx                                  ║
║  CSS files: 21 × ErrorBoundary.module.css                                  ║
║  Projected LOC savings: ~2,730 (1,680 TS + 1,050 CSS)                      ║
╚════════════════════════════════════════════════════════════════════════════╝
    `)

    console.log(`📋 Apps to consolidate (${APPS_WITH_COMPONENT.length} total):`)
    APPS_WITH_COMPONENT.forEach((app) => console.log(`   • ${app}`))

    if (!confirmed) {
      console.log(`
⚠️  DRY RUN MODE (no changes will be made)

To actually consolidate files, run:
   node scripts/consolidate-errorboundary.mjs --confirm

    `)
    }

    let checkCount = 0
    let foundCount = 0
    let updateCount = 0
    let deleteCount = 0

    for (const app of APPS_WITH_COMPONENT) {
      const componentPath = path.join(
        appsDir,
        app,
        'src/ui/organisms',
        `${COMPONENT_NAME}.tsx`
      )
      const cssPath = path.join(
        appsDir,
        app,
        'src/ui/organisms',
        `${COMPONENT_NAME}.module.css`
      )

      // Check if files exist
      let tsExists = false
      let cssExists = false

      try {
        await fs.stat(componentPath)
        tsExists = true
        foundCount++
      } catch (e) {
        // File doesn't exist
      }

      try {
        await fs.stat(cssPath)
        cssExists = true
      } catch (e) {
        // File doesn't exist
      }

      if (!tsExists && !cssExists) {
        console.log(`   ⚠️  ${app}: No component found (skipping)`)
        continue
      }

      checkCount++
      const status = []
      if (tsExists) status.push('TS')
      if (cssExists) status.push('CSS')
      console.log(`   ✓ ${app}: Found [${status.join(', ')}]`)

      if (confirmed) {
        // Replace TypeScript file with re-export
        if (tsExists) {
          try {
            await fs.writeFile(componentPath, RE_EXPORT_CODE)
            updateCount++
          } catch (e) {
            console.error(`   ❌ Failed to update ${app}/ErrorBoundary.tsx:`, e.message)
          }
        }

        // Delete CSS file
        if (cssExists) {
          try {
            await fs.unlink(cssPath)
            deleteCount++
          } catch (e) {
            console.error(`   ❌ Failed to delete ${app}/ErrorBoundary.module.css:`, e.message)
          }
        }
      }
    }

    // Results
    console.log(`
${'═'.repeat(80)}
CONSOLIDATION SUMMARY
${'═'.repeat(80)}

📊 Files Found:
   Total apps checked: ${APPS_WITH_COMPONENT.length}
   Apps with component: ${checkCount}
   Apps without component: ${APPS_WITH_COMPONENT.length - checkCount}
   Component files found: ${foundCount}

${confirmed ? `✅ CONSOLIDATION EXECUTED:
   TypeScript files converted to re-exports: ${updateCount}
   CSS files deleted: ${deleteCount}

📈 LOC Savings Impact:
   Before: ${foundCount} × ErrorBoundary.tsx (~80 LOC) = ~${foundCount * 80} LOC
   Before: ${deleteCount} × ErrorBoundary.module.css (~50 LOC) = ~${deleteCount * 50} LOC
   After: 1 × packages/ui-utils/ErrorBoundary.tsx (~80 LOC)
   After: 1 × packages/ui-utils/ErrorBoundary.module.css (~50 LOC)

   Total Saved: ~${foundCount * 80 + deleteCount * 50} LOC
   Reduction: ${foundCount > 0 ? ((foundCount * 80 - 80) / (foundCount * 80) * 100).toFixed(1) : 0}%

✅ PHASE 8.0 CONSOLIDATION COMPLETE!

Next steps:
   1. Run: pnpm --filter @games/ui-utils typecheck
   2. Run: pnpm --filter @games/bingo typecheck (spot check)
   3. Run: pnpm --filter @games/checkers build (spot check)
   4. Run: pnpm validate (full gate)
   5. Update CONSOLIDATION_COMPLETION_REPORT.md with Phase 8.0 results
` : `

⏭️  DRY RUN COMPLETE

To proceed with consolidation, run:
   node scripts/consolidate-errorboundary.mjs --confirm

This will:
   • Convert ${updateCount} ErrorBoundary.tsx files to 1-line re-exports
   • Delete ${deleteCount} ErrorBoundary.module.css files
   • Save approximately ${foundCount * 80 + deleteCount * 50} LOC
`}

${'═'.repeat(80)}
    `)

    process.exit(confirmed && deleteCount > 0 ? 0 : 0)
  } catch (error) {
    console.error('❌ Consolidation script failed:', error.message)
    process.exit(1)
  }
}

consolidate()
