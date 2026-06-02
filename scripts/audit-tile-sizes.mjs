#!/usr/bin/env node

/**
 * Audit Tile Sizes - Ensure all interactive game tiles meet 58px × 58px minimum
 * for touchscreen/mouse accessibility
 */

import fs from 'fs'
import { glob } from 'glob'
import path from 'path'
import { fileURLToPath } from 'url'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  BLUE: '\x1b[94m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

/**
 * Patterns to detect tile/cell sizing in CSS
 */
const TILE_PATTERNS = [
  {
    name: 'Explicit pixel sizing',
    patterns: [
      /\.tile\s*{[^}]*width:\s*(\d+)px[^}]*}/,
      /\.cell\s*{[^}]*width:\s*(\d+)px[^}]*}/,
      /\.square\s*{[^}]*width:\s*(\d+)px[^}]*}/,
      /\.tile\s*{[^}]*height:\s*(\d+)px[^}]*}/,
      /\.cell\s*{[^}]*height:\s*(\d+)px[^}]*}/,
    ],
  },
  {
    name: 'min-width/min-height constraints',
    patterns: [/min-width:\s*(\d+)px/, /min-height:\s*(\d+)px/],
  },
  {
    name: 'CSS variables (calculated sizing)',
    patterns: [
      /--cell-size:\s*calc\([^)]+\)/,
      /--tile-size:\s*calc\([^)]+\)/,
      /var\(--cell-size\)/,
      /var\(--tile-size\)/,
    ],
  },
  {
    name: 'Touch-optimized declarations',
    patterns: [/@media\s*\(pointer:\s*coarse\)/, /touch-optimized/, /touch:/],
  },
]

/**
 * Scan CSS file for tile size patterns
 */
function scanCSSFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const filename = path.basename(filePath)
  const appName = extractAppName(filePath)

  const findings = {
    file: filePath,
    app: appName,
    filename: filename,
    hasTileElements: false,
    explicitSizes: [],
    minSizes: [],
    calculatedVars: [],
    touchOptimized: false,
    issues: [],
  }

  // Check for tile/cell references
  if (/\.(tile|cell|square)\s*{/.test(content)) {
    findings.hasTileElements = true
  }

  // Extract explicit sizes
  const pixelMatches = content.matchAll(
    /\.(?:tile|cell|square)\s*{[^}]*(?:width|height):\s*(\d+)px/g,
  )
  for (const match of pixelMatches) {
    const size = parseInt(match[1])
    findings.explicitSizes.push(size)
    if (size < 58) {
      findings.issues.push(`Explicit size ${size}px is below 58px minimum`)
    }
  }

  // Extract min-width/min-height
  const minMatches = content.matchAll(/min-(?:width|height):\s*(\d+)px/g)
  for (const match of minMatches) {
    const size = parseInt(match[1])
    findings.minSizes.push(size)
    if (size > 0 && size < 58) {
      findings.issues.push(`Minimum size ${size}px is below 58px requirement`)
    }
  }

  // Detect calculated vars
  if (/--(?:cell|tile)-size:\s*calc\(/.test(content)) {
    findings.calculatedVars.push('calc() based sizing detected')
    // Extract the calc expression for analysis
    const calcMatches = content.matchAll(/--(?:cell|tile)-size:\s*(calc\([^)]+\))/g)
    for (const match of calcMatches) {
      findings.calculatedVars.push(`Formula: ${match[1]}`)
    }
  }

  // Check for touch optimization
  if (/@media\s*\(\s*pointer:\s*coarse\s*\)/.test(content)) {
    findings.touchOptimized = true
  }

  return findings
}

/**
 * Extract app name from file path
 */
function extractAppName(filePath) {
  const match = filePath.match(/apps[\/\\]([^\/\\]+)/)
  return match ? match[1] : 'unknown'
}

/**
 * Main audit function
 */
async function auditTiles() {
  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('🎮 TILE SIZE ACCESSIBILITY AUDIT (58px × 58px Minimum)')
  console.log('═══════════════════════════════════════════════════════════════\n')

  // Find all game CSS files
  const cssGlob = path.join(projectRoot, 'apps/*/src/**/*.module.css')
  const files = await glob(cssGlob, { ignore: '**/node_modules/**' })

  console.log(`📋 Found ${files.length} CSS files to scan\n`)

  const allFindings = []
  const byApp = {}

  // Scan each file
  for (const file of files) {
    const findings = scanCSSFile(file)

    if (
      findings.hasTileElements ||
      findings.explicitSizes.length > 0 ||
      findings.issues.length > 0
    ) {
      allFindings.push(findings)

      // Group by app
      if (!byApp[findings.app]) {
        byApp[findings.app] = []
      }
      byApp[findings.app].push(findings)
    }
  }

  // Generate report
  console.log('📊 SUMMARY BY APP:\n')

  const conforming = []
  const nonConforming = []
  const needsReview = []

  for (const app of Object.keys(byApp).sort()) {
    const appFiles = byApp[app]
    const hasIssues = appFiles.some((f) => f.issues.length > 0)
    const hasCalc = appFiles.some((f) => f.calculatedVars.length > 0)

    if (hasIssues) {
      nonConforming.push({ app, files: appFiles })
    } else if (hasCalc) {
      needsReview.push({ app, files: appFiles })
    } else if (appFiles.some((f) => f.explicitSizes.length > 0)) {
      conforming.push({ app, files: appFiles })
    }
  }

  // Display conforming apps
  if (conforming.length > 0) {
    console.log('✅ CONFORMING (Meets 58px minimum):')
    for (const { app } of conforming) {
      console.log(`   • ${app}`)
    }
    console.log()
  }

  // Display non-conforming apps
  if (nonConforming.length > 0) {
    console.log('❌ NON-CONFORMING (Below 58px minimum):')
    for (const { app, files } of nonConforming) {
      console.log(`\n   🔴 ${app}:`)
      for (const file of files) {
        if (file.issues.length > 0) {
          console.log(`      File: ${path.relative(projectRoot, file.file)}`)
          for (const issue of file.issues) {
            console.log(`        - ${issue}`)
          }
          if (file.explicitSizes.length > 0) {
            console.log(`        Sizes found: ${file.explicitSizes.join(', ')}px`)
          }
        }
      }
    }
    console.log()
  }

  // Display apps needing review (calculated sizing)
  if (needsReview.length > 0) {
    console.log('⏳ NEEDS REVIEW (Calculated/Variable sizing):')
    for (const { app, files } of needsReview) {
      console.log(`\n   🟡 ${app}:`)
      for (const file of files) {
        if (file.calculatedVars.length > 0) {
          console.log(`      File: ${path.relative(projectRoot, file.file)}`)
          for (const formula of file.calculatedVars) {
            console.log(`        ${formula}`)
          }
          if (file.touchOptimized) {
            console.log(`        ✓ Has touch-optimized styles`)
          }
        }
      }
    }
    console.log()
  }

  // Summary statistics
  console.log('📈 STATISTICS:')
  console.log(`   Total CSS files scanned: ${files.length}`)
  console.log(`   Apps with tile elements: ${Object.keys(byApp).length}`)
  console.log(`   ✅ Conforming: ${conforming.length}`)
  console.log(`   ❌ Non-conforming: ${nonConforming.length}`)
  console.log(`   ⏳ Needs review: ${needsReview.length}`)
  console.log()

  // Detailed findings
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('📝 DETAILED FINDINGS\n')

  for (const findings of allFindings) {
    if (findings.hasTileElements || findings.explicitSizes.length > 0) {
      console.log(`\n${findings.app}: ${findings.filename}`)
      console.log(`  Path: ${path.relative(projectRoot, findings.file)}`)

      if (findings.explicitSizes.length > 0) {
        console.log(`  Explicit sizes: ${findings.explicitSizes.join(', ')}px`)
      }

      if (findings.minSizes.length > 0) {
        console.log(`  Min sizes: ${findings.minSizes.join(', ')}px`)
      }

      if (findings.calculatedVars.length > 0) {
        console.log(`  Calculated:`)
        for (const formula of findings.calculatedVars) {
          console.log(`    - ${formula}`)
        }
      }

      if (findings.touchOptimized) {
        console.log(`  ✓ Touch-optimized styles present`)
      }

      if (findings.issues.length > 0) {
        console.log(`  Issues:`)
        for (const issue of findings.issues) {
          console.log(`    ⚠️  ${issue}`)
        }
      }
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════\n')

  // Return summary for downstream processing
  return {
    nonConforming,
    needsReview,
    conforming,
    totalFiles: files.length,
  }
}

// Run audit
const summary = await auditTiles()

// Exit with appropriate code
process.exit(summary.nonConforming.length > 0 ? 1 : 0)
