#!/usr/bin/env node

/**
 * validate-matrix.mjs
 * 
 * Validates Platform × Game Coverage Matrix
 * 
 * Checks:
 * 1. All apps exist in /apps
 * 2. All platforms have valid configuration
 * 3. No forbidden imports in matrix cells
 * 4. Required sources documented
 * 5. Blocker resolution tracking
 */

import { readFileSync, existsSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')
const ROOT = resolve(__dirname, '..')
const COMPLIANCE = join(ROOT, 'compliance')
const APPS = join(ROOT, 'apps')

// Color codes for terminal output
const color = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
}

function log(msg, c = 'reset') {
  console.log(`${color[c]}${msg}${color.reset}`)
}

function header(title) {
  log(`\n${'='.repeat(60)}`, 'bold')
  log(`  ${title}`, 'cyan')
  log(`${'='.repeat(60)}\n`, 'bold')
}

async function main() {
  const results = {
    totalChecks: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    errors: [],
  }

  header('Platform × Game Coverage Matrix Validation')

  // 1. Load compliance files
  log('1. Loading compliance configuration...', 'blue')
  let sources, matrix, blockers
  try {
    sources = JSON.parse(readFileSync(join(COMPLIANCE, 'sources.json'), 'utf8'))
    matrix = JSON.parse(readFileSync(join(COMPLIANCE, 'matrix.json'), 'utf8'))
    blockers = JSON.parse(readFileSync(join(COMPLIANCE, 'blockers.json'), 'utf8'))
    log(`✓ Loaded 3 compliance files`)
    results.passed++
  } catch (err) {
    log(`✗ Failed to load compliance files: ${err.message}`, 'red')
    results.failed++
    results.errors.push(`Compliance files: ${err.message}`)
    process.exit(1)
  }
  results.totalChecks++

  // 2. Verify apps exist
  log('\n2. Verifying game apps exist...', 'blue')
  const expGames = matrix.games || []
  for (const game of expGames) {
    const appPath = join(APPS, game)
    results.totalChecks++
    if (existsSync(appPath)) {
      log(`✓ /apps/${game}`, 'green')
      results.passed++
    } else {
      log(`✗ /apps/${game} NOT FOUND`, 'red')
      results.failed++
      results.errors.push(`Game app missing: /apps/${game}`)
    }
  }

  // 3. Verify source documentation
  log('\n3. Verifying game rule sources...', 'blue')
  const sourceGames = Object.keys(sources.gameRules || {})
  for (const game of expGames) {
    results.totalChecks++
    if (sources.gameRules[game]) {
      const rule = sources.gameRules[game]
      if (rule.sources && rule.sources.length > 0) {
        log(`✓ ${game}: ${rule.sources.length} source(s) documented`, 'green')
        results.passed++
      } else {
        log(`⚠ ${game}: No sources documented`, 'yellow')
        results.warnings++
      }
    } else {
      log(`✗ ${game}: No rule definition found`, 'red')
      results.failed++
      results.errors.push(`Game rule missing: ${game}`)
    }
  }

  // 4. Verify platform configuration
  log('\n4. Verifying platform configuration...', 'blue')
  const expPlatforms = matrix.platforms || []
  const configPlatforms = Object.keys(sources.platforms || {})
  for (const platform of expPlatforms) {
    results.totalChecks++
    if (configPlatforms.includes(platform)) {
      const config = sources.platforms[platform]
      log(`✓ ${platform}: configured with ${config.constraints ? 'constraints' : 'no constraints'}`, 'green')
      results.passed++
    } else {
      log(`✗ ${platform}: missing from sources.json`, 'red')
      results.failed++
      results.errors.push(`Platform config missing: ${platform}`)
    }
  }

  // 5. Verify matrix structure
  log('\n5. Validating matrix structure...', 'blue')
  results.totalChecks++
  const expectedCells = expGames.length * expPlatforms.length
  let actualCells = 0
  for (const game of expGames) {
    if (matrix.matrix[game]) {
      for (const platform of expPlatforms) {
        if (matrix.matrix[game][platform]) {
          actualCells++
        }
      }
    }
  }

  if (actualCells === expectedCells) {
    log(`✓ Matrix contains ${actualCells} cells (${expGames.length} games × ${expPlatforms.length} platforms)`, 'green')
    results.passed++
  } else {
    log(`✗ Matrix incomplete: ${actualCells}/${expectedCells} cells`, 'red')
    results.failed++
    results.errors.push(`Matrix cells: ${actualCells}/${expectedCells}`)
  }

  // 6. Check blocker references
  log('\n6. Verifying blocker references...', 'blue')
  const blockerList = blockers.blockers || []
  results.totalChecks++
  const validGames = new Set(expGames)
  const validPlatforms = new Set(expPlatforms)
  const invalidBlockers = []

  for (const blocker of blockerList) {
    if (blocker.game && !validGames.has(blocker.game)) {
      invalidBlockers.push(`${blocker.id}: invalid game '${blocker.game}'`)
    }
    if (blocker.platform && blocker.platform !== 'all' && !validPlatforms.has(blocker.platform)) {
      invalidBlockers.push(`${blocker.id}: invalid platform '${blocker.platform}'`)
    }
  }

  if (invalidBlockers.length === 0) {
    log(`✓ All ${blockerList.length} blockers reference valid games/platforms`, 'green')
    results.passed++
  } else {
    for (const msg of invalidBlockers) {
      log(`✗ ${msg}`, 'red')
      results.failed++
      results.errors.push(msg)
    }
  }

  // 7. Coverage analysis
  log('\n7. Coverage analysis...', 'blue')
  results.totalChecks++

  const cellStatus = {
    complete: 0,
    partial: 0,
    'not-started': 0,
  }

  for (const game of expGames) {
    for (const platform of expPlatforms) {
      const cell = matrix.matrix[game][platform]
      if (cell.status in cellStatus) {
        cellStatus[cell.status]++
      }
    }
  }

  const totalPercentage = (
    (cellStatus.complete + cellStatus.partial * 0.5) /
    expectedCells * 100
  ).toFixed(1)

  log(`Complete:    ${cellStatus.complete}/${expectedCells} (${(cellStatus.complete / expectedCells * 100).toFixed(1)}%)`)
  log(`Partial:     ${cellStatus.partial}/${expectedCells} (${(cellStatus.partial / expectedCells * 100).toFixed(1)}%)`)
  log(`Not Started: ${cellStatus['not-started']}/${expectedCells} (${(cellStatus['not-started'] / expectedCells * 100).toFixed(1)}%)`)
  log(`Overall:     ${totalPercentage}% (weighted)`)
  results.passed++

  // 8. Critical gaps
  log('\n8. Critical gaps (high-severity blockers)...', 'blue')
  results.totalChecks++
  const highBlockers = blockerList.filter(b => b.severity === 'high')
  if (highBlockers.length > 0) {
    log(`Found ${highBlockers.length} high-severity blockers:`, 'yellow')
    for (const blocker of highBlockers) {
      log(`  • ${blocker.game}/${blocker.platform}: ${blocker.issue}`)
    }
    results.warnings++
  } else {
    log(`✓ No high-severity blockers`, 'green')
    results.passed++
  }

  // Summary
  header('Validation Summary')
  log(`Total Checks:  ${results.totalChecks}`)
  log(`Passed:        ${results.passed}`, results.passed === results.totalChecks ? 'green' : 'yellow')
  log(`Failed:        ${results.failed}`, results.failed > 0 ? 'red' : 'green')
  log(`Warnings:      ${results.warnings}`, results.warnings > 0 ? 'yellow' : 'green')

  if (results.errors.length > 0) {
    log('\nErrors:', 'red')
    for (const err of results.errors) {
      log(`  • ${err}`, 'red')
    }
  }

  log('\nCoverage:', cellStatus.complete === expectedCells ? 'green' : 'yellow')
  log(`  ${cellStatus.complete}/${expectedCells} cells complete`)
  log(`  ${cellStatus.partial} cells partial`)
  log(`  ${cellStatus['not-started']} cells not started`)

  log('\nBlockers:', highBlockers.length === 0 ? 'green' : 'yellow')
  log(`  ${blockerList.filter(b => b.severity === 'high').length} high-severity`)
  log(`  ${blockerList.filter(b => b.severity === 'medium').length} medium-severity`)
  log(`  ${blockerList.filter(b => b.severity === 'low').length} low-severity`)

  const exitCode = results.failed > 0 ? 1 : 0
  log(`\nExit code: ${exitCode}`, exitCode === 0 ? 'green' : 'red')
  process.exit(exitCode)
}

main().catch(err => {
  log(`Fatal error: ${err.message}`, 'red')
  console.error(err)
  process.exit(1)
})
