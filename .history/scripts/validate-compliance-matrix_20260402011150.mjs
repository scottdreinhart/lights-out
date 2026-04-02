#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const complianceDir = path.join(rootDir, 'compliance')
const appsDir = path.join(rootDir, 'apps')
const matrixFile = path.join(complianceDir, 'matrix.json')

// Parse CLI flags
const args = process.argv.slice(2)
const flags = {
  detailed: args.includes('--detailed'),
  fix: args.includes('--fix'),
  verbose: args.includes('--verbose'),
}

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

const symbols = {
  pass: '✅',
  fail: '❌',
  warn: '⚠️ ',
  info: 'ℹ️ ',
  ok: '✓',
}

let issues = []
let warnings = []

async function validateComplianceMatrix() {
  console.log(`\n${colors.cyan}🔍 Compliance Matrix Validation Report${colors.reset}`)
  console.log('='.repeat(70) + '\n')

  // Load matrix data
  let matrix
  try {
    const data = await fs.readFile(matrixFile, 'utf-8')
    matrix = JSON.parse(data)
    console.log(`${symbols.pass} Matrix file loaded: ${matrixFile}\n`)
  } catch (error) {
    console.log(`${symbols.fail} Failed to load matrix file: ${error.message}`)
    process.exit(1)
  }

  // Validate schema
  await validateSchema(matrix)

  // Validate cross-game consistency
  await validateConsistency(matrix)

  // Validate quality gates
  await validateQualityGates(matrix)

  // Validate feature requirements
  await validateFeatureRequirements(matrix)

  // Validate status values
  await validateStatusValues(matrix)

  // Validate referential integrity
  await validateReferentialIntegrity(matrix)

  // Check for duplicates
  await checkDuplicates(matrix)

  // Print summary
  printSummary(matrix)

  // Exit with appropriate code
  process.exit(issues.length > 0 ? 1 : 0)
}

async function validateSchema(matrix) {
  console.log(`${colors.blue}Schema Validation${colors.reset}`)
  console.log('-'.repeat(70))

  const requiredFields = ['lastUpdated', 'summary', 'apps']
  let schemaValid = true

  // Check root fields
  requiredFields.forEach((field) => {
    if (!matrix[field]) {
      issues.push(`Missing required field: "${field}"`)
      schemaValid = false
    }
  })

  // Check summary structure
  if (matrix.summary) {
    const summaryFields = ['total', 'passed', 'fixed']
    summaryFields.forEach((field) => {
      if (typeof matrix.summary[field] !== 'number') {
        warnings.push(`Summary.${field} should be a number`)
      }
    })
  }

  // Check apps structure
  if (matrix.apps && typeof matrix.apps === 'object') {
    Object.entries(matrix.apps).forEach(([appName, appData]) => {
      if (!appData.status) {
        warnings.push(`App "${appName}" missing status field`)
      }
      if (!appData.timestamp) {
        warnings.push(`App "${appName}" missing timestamp field`)
      }
    })
  }

  if (schemaValid) {
    console.log(`${symbols.pass} Schema validation: PASS`)
  } else {
    console.log(`${symbols.fail} Schema validation: FAIL`)
  }
  console.log()
}

async function validateConsistency(matrix) {
  console.log(`${colors.blue}Cross-Game Consistency${colors.reset}`)
  console.log('-'.repeat(70))

  const statusCounts = { GREEN: 0, AMBER: 0, RED: 0 }
  const categoryCounts = {}
  let consistent = true

  matrix.games.forEach((game) => {
    if (!game.entries) return

    game.entries.forEach((entry) => {
      if (entry.status && ['GREEN', 'AMBER', 'RED'].includes(entry.status)) {
        statusCounts[entry.status]++
      } else if (entry.status) {
        warnings.push(`Invalid status "${entry.status}" in game "${game.id}"`)
        consistent = false
      }

      if (entry.category) {
        categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1
      }
    })
  })

  console.log(`${symbols.pass} Status distribution:`)
  console.log(`   • GREEN:  ${statusCounts.GREEN}`)
  console.log(`   • AMBER:  ${statusCounts.AMBER}`)
  console.log(`   • RED:    ${statusCounts.RED}`)
  console.log(`\n${symbols.pass} Categories found:`)
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([cat, count]) => console.log(`   • ${cat}: ${count} entries`))

  if (!consistent) {
    console.log(`\n${symbols.warn} Some consistency issues found`)
  }
  console.log()
}

async function validateQualityGates(matrix) {
  console.log(`${colors.blue}Quality Gates Validation${colors.reset}`)
  console.log('-'.repeat(70))

  const requiredGates = [
    'keyboard-navigation',
    'accessibility',
    'focus-management',
    'shared-tile-usage',
    'shared-theme-usage',
  ]

  let gatesValid = true

  matrix.games.forEach((game) => {
    if (!game.entries) return

    const gateIds = game.entries.map((e) => e.id)
    requiredGates.forEach((gate) => {
      if (!gateIds.includes(gate)) {
        warnings.push(`Game "${game.id}" missing quality gate: ${gate}`)
        gatesValid = false
      }
    })

    // Check if critical gates are RED
    game.entries.forEach((entry) => {
      if (requiredGates.includes(entry.id) && entry.status === 'RED') {
        warnings.push(`Game "${game.id}" has critical quality gate RED: ${entry.id}`)
      }
    })
  })

  if (gatesValid) {
    console.log(`${symbols.pass} All games have required quality gates`)
  } else {
    console.log(`${symbols.warn} Some games missing quality gates`)
  }
  console.log()
}

async function validateFeatureRequirements(matrix) {
  console.log(`${colors.blue}Feature Requirements${colors.reset}`)
  console.log('-'.repeat(70))

  const featureCategories = ['feature', 'quality', 'accessibility']
  const gameCompleteness = {}

  matrix.games.forEach((game) => {
    if (!game.entries) return

    const featureEntries = game.entries.filter((e) => featureCategories.includes(e.category))
    const greenCount = featureEntries.filter((e) => e.status === 'GREEN').length
    const completeness = featureEntries.length > 0 ? greenCount / featureEntries.length : 0

    gameCompleteness[game.id] = {
      total: featureEntries.length,
      green: greenCount,
      percentage: Math.round(completeness * 100),
    }
  })

  // Sort by completeness
  const sorted = Object.entries(gameCompleteness)
    .sort((a, b) => b[1].percentage - a[1].percentage)
    .slice(0, 5)

  console.log(`${symbols.pass} Top 5 most complete games:`)
  sorted.forEach(([game, data]) => {
    const bar =
      '█'.repeat(Math.floor(data.percentage / 10)) +
      '░'.repeat(10 - Math.floor(data.percentage / 10))
    console.log(`   • ${game.padEnd(25)} ${bar} ${data.percentage}% (${data.green}/${data.total})`)
  })
  console.log()
}

async function validateStatusValues(matrix) {
  console.log(`${colors.blue}Status Value Validation${colors.reset}`)
  console.log('-'.repeat(70))

  const validStatuses = ['GREEN', 'AMBER', 'RED']
  let statusValid = true

  matrix.games.forEach((game) => {
    if (!game.entries) return

    game.entries.forEach((entry) => {
      if (entry.status && !validStatuses.includes(entry.status)) {
        issues.push(`Invalid status "${entry.status}" in game "${game.id}" entry "${entry.id}"`)
        statusValid = false
      }
    })
  })

  if (statusValid) {
    console.log(`${symbols.pass} All status values valid (GREEN/AMBER/RED only)`)
  } else {
    console.log(`${symbols.fail} Invalid status values found`)
  }
  console.log()
}

async function validateReferentialIntegrity(matrix) {
  console.log(`${colors.blue}Referential Integrity${colors.reset}`)
  console.log('-'.repeat(70))

  const appFolders = await fs.readdir(appsDir)
  const validGames = appFolders.filter((name) => name !== 'ui').map((name) => name)

  let integrityValid = true

  matrix.games.forEach((game) => {
    if (!validGames.includes(game.id)) {
      warnings.push(`Game "${game.id}" in matrix not found in apps directory`)
      integrityValid = false
    }
  })

  validGames.forEach((appName) => {
    if (!matrix.games.find((g) => g.id === appName)) {
      warnings.push(`App "${appName}" not found in compliance matrix`)
    }
  })

  if (integrityValid) {
    console.log(`${symbols.pass} Referential integrity: PASS`)
  } else {
    console.log(`${symbols.warn} Some referential integrity issues`)
  }
  console.log(`   • Total apps in directory: ${validGames.length}`)
  console.log(`   • Total games in matrix: ${matrix.games.length}`)
  console.log()
}

async function checkDuplicates(matrix) {
  console.log(`${colors.blue}Duplicate Detection${colors.reset}`)
  console.log('-'.repeat(70))

  let hasDuplicates = false

  matrix.games.forEach((game) => {
    if (!game.entries) return

    const ids = game.entries.map((e) => e.id)
    const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx)

    if (duplicates.length > 0) {
      issues.push(`Game "${game.id}" has duplicate entry IDs: ${duplicates.join(', ')}`)
      hasDuplicates = true
    }
  })

  if (!hasDuplicates) {
    console.log(`${symbols.pass} No duplicate entry IDs found`)
  } else {
    console.log(`${symbols.fail} Duplicate entry IDs detected`)
  }
  console.log()
}

function printSummary(matrix) {
  console.log(`${colors.cyan}Summary${colors.reset}`)
  console.log('='.repeat(70) + '\n')

  const totalGames = matrix.games.length
  const totalEntries = matrix.games.reduce((sum, g) => sum + (g.entries?.length || 0), 0)

  console.log(`Total Games: ${totalGames}`)
  console.log(`Total Entries: ${totalEntries}`)
  console.log(`Average Entries per Game: ${(totalEntries / totalGames).toFixed(1)}`)
  console.log()

  if (warnings.length > 0) {
    console.log(`${colors.yellow}Warnings (${warnings.length}):${colors.reset}`)
    warnings.slice(0, 5).forEach((w) => console.log(`   • ${w}`))
    if (warnings.length > 5) {
      console.log(`   ... and ${warnings.length - 5} more warnings`)
    }
    console.log()
  }

  if (issues.length > 0) {
    console.log(`${colors.red}Issues (${issues.length}):${colors.reset}`)
    issues.slice(0, 5).forEach((i) => console.log(`   • ${i}`))
    if (issues.length > 5) {
      console.log(`   ... and ${issues.length - 5} more issues`)
    }
    console.log()
  }

  if (issues.length === 0) {
    console.log(`${colors.green}✅ Validation PASSED - No critical issues found${colors.reset}\n`)
  } else {
    console.log(
      `${colors.red}❌ Validation FAILED - ${issues.length} critical issue(s)${colors.reset}\n`,
    )
  }
}

// Run validation
validateComplianceMatrix().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error)
  process.exit(1)
})
