#!/usr/bin/env node

/**
 * validate-matrix.mjs
 *
 * Validates Platform × Game Coverage Matrix
 */

import { existsSync, readFileSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')
const ROOT = resolve(__dirname, '..')
const COMPLIANCE = join(ROOT, 'compliance')
const APPS = join(ROOT, 'apps')

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  BLUE: '\x1b[94m',
  WHITE: '\x1b[97m',
  MAGENTA: '\x1b[95m',
  GRAY: '\x1b[90m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

function log(msg, colorCode = 'WHITE', indent = 0) {
  const code = colorCode.toUpperCase();
  const color = COLORS[code] || COLORS.WHITE;
  const indentation = '  '.repeat(indent);
  console.log(`${indentation}${color}${msg}${COLORS.RESET}`);
}

/**
 * Standardized boxed header for terminal output
 */
function boxedHeader(title, color = COLORS.BLUE) {
  const width = 80;
  const horizontalLine = '═'.repeat(width - 2);
  
  console.log(`\n${COLORS.WHITE}╔${horizontalLine}╗${COLORS.RESET}`);
  
  const titleText = title.toUpperCase();
  const paddingTotal = width - 2 - titleText.length;
  const paddingLeft = Math.floor(paddingTotal / 2);
  const paddingRight = paddingTotal - paddingLeft;
  
  console.log(`${COLORS.WHITE}║${' '.repeat(paddingLeft)}${COLORS.BOLD}${color}${titleText}${COLORS.RESET}${COLORS.WHITE}${' '.repeat(paddingRight)}║${COLORS.RESET}`);
  console.log(`${COLORS.WHITE}╚${horizontalLine}╝${COLORS.RESET}\n`);
}

function header(title) {
  boxedHeader(title, COLORS.CYAN);
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

  const normalizeId = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')

  // 1. Load compliance files
  log('1. Loading compliance configuration...', 'BLUE')
  let sources, matrix, blockers
  try {
    sources = JSON.parse(readFileSync(join(COMPLIANCE, 'sources.json'), 'utf8'))
    matrix = JSON.parse(readFileSync(join(COMPLIANCE, 'matrix.json'), 'utf8'))
    blockers = JSON.parse(readFileSync(join(COMPLIANCE, 'blockers.json'), 'utf8'))
    log('✓ Loaded 3 compliance files', 'GREEN', 1)
    results.passed++
  } catch (err) {
    log(`✗ Failed to load compliance files: ${err.message}`, 'RED', 1)
    results.failed++
    results.errors.push(`Compliance files: ${err.message}`)
    process.exit(1)
  }
  results.totalChecks++

  // 2. Verify apps exist
  log('\n2. Verifying game apps exist...', 'BLUE')
  const expGames = matrix.games || []
  for (const game of expGames) {
    const appPath = join(APPS, game)
    results.totalChecks++
    if (existsSync(appPath)) {
      log(`✓ /apps/${game}`, 'GREEN', 1)
      results.passed++
    } else {
      log(`✗ /apps/${game} NOT FOUND`, 'RED', 1)
      results.failed++
      results.errors.push(`Game app missing: /apps/${game}`)
    }
  }

  // 3. Verify source documentation
  log('\n3. Verifying game rule sources...', 'BLUE')
  const isMatrixStyleSources =
    Array.isArray(sources.games) && Array.isArray(sources.platforms) && typeof sources.matrix === 'object'

  for (const game of expGames) {
    results.totalChecks++
    const legacyRule = sources.gameRules?.[game]
    const metadataRule = sources.gameMetadata?.[game]
    const matrixRule = sources.matrix?.[game]

    if (legacyRule || metadataRule || matrixRule) {
      const sourceCount = legacyRule?.sources?.length ?? (metadataRule?.description ? 1 : 0)
      if (sourceCount > 0) {
        log(`✓ ${game}: ${sourceCount} source(s) documented`, 'GREEN', 1)
        results.passed++
      } else if (matrixRule) {
        log(`✓ ${game}: matrix coverage metadata documented`, 'GREEN', 1)
        results.passed++
      } else {
        log(`⚠ ${game}: No sources documented`, 'YELLOW', 1)
        results.warnings++
      }
    } else {
      if (isMatrixStyleSources) {
        log(`⚠ ${game}: No source metadata entry found`, 'YELLOW', 1)
        results.warnings++
      } else {
        log(`✗ ${game}: No rule definition found`, 'RED', 1)
        results.failed++
        results.errors.push(`Game rule missing: ${game}`)
      }
    }
  }

  // 4. Verify platform configuration
  log('\n4. Verifying platform configuration...', 'BLUE')
  const expPlatforms = matrix.platforms || []
  const configuredPlatforms = Array.isArray(sources.platforms)
    ? [...sources.platforms]
    : Object.keys(sources.platforms || {})
  const normalizedConfiguredPlatforms = new Set(configuredPlatforms.map((platform) => normalizeId(platform)))

  for (const platform of expPlatforms) {
    results.totalChecks++
    const normalizedPlatform = normalizeId(platform)
    const isConfigured = normalizedConfiguredPlatforms.has(normalizedPlatform)

    if (isConfigured) {
      const config = Array.isArray(sources.platforms)
        ? sources.platformMetadata?.[platform] ||
          Object.entries(sources.platformMetadata || {}).find(
            ([platformId]) => normalizeId(platformId) === normalizedPlatform,
          )?.[1]
        : sources.platforms?.[platform]
      log(
        `✓ ${platform}: configured with ${config?.constraints ? 'constraints' : 'no constraints'}`,
        'GREEN',
        1
      )
      results.passed++
    } else {
      if (isMatrixStyleSources) {
        log(`⚠ ${platform}: not present in sources platform taxonomy`, 'YELLOW', 1)
        results.warnings++
      } else {
        log(`✗ ${platform}: missing from sources.json`, 'RED', 1)
        results.failed++
        results.errors.push(`Platform config missing: ${platform}`)
      }
    }
  }

  // 5. Verify matrix structure
  log('\n5. Validating matrix structure...', 'BLUE')
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
    log(
      `✓ Matrix contains ${actualCells} cells (${expGames.length} games × ${expPlatforms.length} platforms)`,
      'GREEN',
      1
    )
    results.passed++
  } else {
    log(`✗ Matrix incomplete: ${actualCells}/${expectedCells} cells`, 'RED', 1)
    results.failed++
    results.errors.push(`Matrix cells: ${actualCells}/${expectedCells}`)
  }

  // 6. Check blocker references
  log('\n6. Verifying blocker references...', 'BLUE')
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
    log(`✓ All ${blockerList.length} blockers reference valid games/platforms`, 'GREEN', 1)
    results.passed++
  } else {
    for (const msg of invalidBlockers) {
      if (isMatrixStyleSources) {
        log(`⚠ ${msg}`, 'YELLOW', 1)
        results.warnings++
      } else {
        log(`✗ ${msg}`, 'RED', 1)
        results.failed++
        results.errors.push(msg)
      }
    }
  }

  // 7. Coverage analysis
  log('\n7. Coverage analysis...', 'BLUE')
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
    ((cellStatus.complete + cellStatus.partial * 0.5) / expectedCells) *
    100
  ).toFixed(1)

  log(`Complete:    ${cellStatus.complete}/${expectedCells} (${((cellStatus.complete / expectedCells) * 100).toFixed(1)}%)`, 'WHITE', 1)
  log(`Partial:     ${cellStatus.partial}/${expectedCells} (${((cellStatus.partial / expectedCells) * 100).toFixed(1)}%)`, 'WHITE', 1)
  log(`Not Started: ${cellStatus['not-started']}/${expectedCells} (${((cellStatus['not-started'] / expectedCells) * 100).toFixed(1)}%)`, 'WHITE', 1)
  log(`Overall:     ${totalPercentage}% (weighted)`, 'CYAN', 1)
  results.passed++

  // 8. Critical gaps
  log('\n8. Critical gaps (high-severity blockers)...', 'BLUE')
  results.totalChecks++
  const highBlockers = blockerList.filter((b) => b.severity === 'high')
  if (highBlockers.length > 0) {
    log(`Found ${highBlockers.length} high-severity blockers:`, 'YELLOW', 1)
    for (const blocker of highBlockers) {
      log(`• ${blocker.game}/${blocker.platform}: ${blocker.issue}`, 'WHITE', 2)
    }
    results.warnings++
  } else {
    log('✓ No high-severity blockers', 'GREEN', 1)
    results.passed++
  }

  // Summary
  header('Validation Summary')
  log(`Total Checks:  ${results.totalChecks}`, 'WHITE', 1)
  log(
    `Passed:        ${results.passed}`,
    results.passed === results.totalChecks ? 'GREEN' : 'YELLOW',
    1
  )
  log(`Failed:        ${results.failed}`, results.failed > 0 ? 'RED' : 'GREEN', 1)
  log(`Warnings:      ${results.warnings}`, results.warnings > 0 ? 'YELLOW' : 'GREEN', 1)

  if (results.errors.length > 0) {
    log('\nErrors:', 'RED', 1)
    for (const err of results.errors) {
      log(`• ${err}`, 'RED', 2)
    }
  }

  log('\nCoverage:', cellStatus.complete === expectedCells ? 'GREEN' : 'YELLOW', 1)
  log(`${cellStatus.complete}/${expectedCells} cells complete`, 'WHITE', 2)
  log(`${cellStatus.partial} cells partial`, 'WHITE', 2)
  log(`${cellStatus['not-started']} cells not started`, 'WHITE', 2)

  log('\nBlockers:', highBlockers.length === 0 ? 'GREEN' : 'YELLOW', 1)
  log(`${blockerList.filter((b) => b.severity === 'high').length} high-severity`, 'WHITE', 2)
  log(`${blockerList.filter((b) => b.severity === 'medium').length} medium-severity`, 'WHITE', 2)
  log(`${blockerList.filter((b) => b.severity === 'low').length} low-severity`, 'WHITE', 2)

  const exitCode = results.failed > 0 ? 1 : 0
  log(`\nExit code: ${exitCode}`, exitCode === 0 ? 'GREEN' : 'RED', 1)
  process.exit(exitCode)
}

main().catch((err) => {
  log(`Fatal error: ${err.message}`, 'RED')
  console.error(err)
  process.exit(1)
})
