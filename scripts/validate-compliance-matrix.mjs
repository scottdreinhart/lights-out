#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const complianceDir = path.join(rootDir, 'compliance')
const appsDir = path.join(rootDir, 'apps')
const matrixFile = path.join(complianceDir, 'matrix.json')
const appStatusFile = path.join(complianceDir, 'app-status.json')

// Parse CLI flags
const args = process.argv.slice(2)
const flags = {
  detailed: args.includes('--detailed'),
  fix: args.includes('--fix'),
  verbose: args.includes('--verbose'),
}

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  BLUE: '\x1b[94m',
  WHITE: '\x1b[97m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
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

function normalizeMatrixInput(raw) {
  if (raw && typeof raw === 'object' && raw.summary && raw.apps) {
    return raw
  }

  const isPlatformMatrix =
    raw &&
    typeof raw === 'object' &&
    raw.metadata &&
    Array.isArray(raw.games) &&
    raw.matrix &&
    typeof raw.matrix === 'object'

  if (!isPlatformMatrix) {
    return raw
  }

  const timestamp = raw.metadata.lastUpdated || raw.metadata.generatedAt || new Date().toISOString()
  const gameNames = Array.isArray(raw.games) ? raw.games : Object.keys(raw.matrix || {})

  const apps = Object.fromEntries(
    gameNames.map((game) => {
      const platformCells = raw.matrix?.[game]
      const statuses = platformCells ? Object.values(platformCells).map((cell) => cell?.status) : []
      const status =
        statuses.includes('completed') ||
        statuses.includes('complete') ||
        statuses.includes('ready') ||
        statuses.includes('passed')
          ? 'passed'
          : statuses.includes('failed') || statuses.includes('blocked')
            ? 'failed'
            : statuses.includes('partial') ||
                statuses.includes('in-progress') ||
                statuses.includes('pending')
            ? 'pending'
            : 'skipped'

      return [game, { status, timestamp }]
    }),
  )

  const statusCounts = Object.values(apps).reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    },
    { passed: 0, fixed: 0 },
  )

  return {
    lastUpdated: timestamp,
    summary: {
      total: Object.keys(apps).length,
      passed: statusCounts.passed || 0,
      fixed: statusCounts.fixed || 0,
    },
    apps,
  }
}

function normalizeAppStatusInput(raw) {
  const isAppStatus =
    raw &&
    typeof raw === 'object' &&
    Array.isArray(raw.apps) &&
    raw.metadata &&
    typeof raw.summary === 'object'

  if (!isAppStatus) {
    return raw
  }

  const apps = Object.fromEntries(
    raw.apps.map((app) => {
      const hasCriticalIssue = Array.isArray(app.issues)
        ? app.issues.some((issue) => issue?.severity === 'critical')
        : false

      const status = app.readyForPromotion ? 'passed' : hasCriticalIssue ? 'failed' : 'pending'
      return [app.id, { status, timestamp: app.lastAuditedAt || raw.metadata.generatedAt }]
    }),
  )

  const counts = Object.values(apps).reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    },
    { passed: 0, fixed: 0 },
  )

  return {
    lastUpdated: raw.metadata.generatedAt || new Date().toISOString(),
    summary: {
      total: Object.keys(apps).length,
      passed: counts.passed || 0,
      fixed: counts.fixed || 0,
    },
    apps,
  }
}

async function validateComplianceMatrix() {
  console.log(`\n${colors.cyan}🔍 Compliance Matrix Validation${colors.reset}`)
  console.log('='.repeat(70) + '\n')

  let matrix
  try {
    const sourceFile = (await fs
      .access(appStatusFile)
      .then(() => appStatusFile)
      .catch(() => matrixFile))
    const data = await fs.readFile(sourceFile, 'utf-8')
    const parsed = JSON.parse(data)
    matrix = normalizeAppStatusInput(normalizeMatrixInput(parsed))
    console.log(`${symbols.pass} Loaded: ${sourceFile}\n`)
  } catch (error) {
    console.log(`${symbols.fail} Failed to load matrix: ${error.message}`)
    process.exit(1)
  }

  validateSchema(matrix)
  validateConsistency(matrix)
  validateTimestamps(matrix)
  await validateReferentialIntegrity(matrix)
  validateStatusValues(matrix)

  printSummary(matrix)
  process.exit(issues.length > 0 ? 1 : 0)
}

function validateSchema(matrix) {
  console.log(`${colors.blue}Schema Validation${colors.reset}`)
  console.log('-'.repeat(70))

  const required = ['lastUpdated', 'summary', 'apps']
  let valid = true

  required.forEach((field) => {
    if (!(field in matrix)) {
      issues.push(`Missing required field: "${field}"`)
      valid = false
    }
  })

  if (matrix.summary && typeof matrix.summary === 'object') {
    ;['total', 'passed', 'fixed'].forEach((field) => {
      if (typeof matrix.summary[field] !== 'number') {
        warnings.push(`Summary.${field} is not a number`)
      }
    })
  }

  if (matrix.apps) {
    if (typeof matrix.apps !== 'object' || Array.isArray(matrix.apps)) {
      issues.push('Apps must be an object, not an array')
      valid = false
    } else {
      Object.entries(matrix.apps).forEach(([name, data]) => {
        if (!data.status) warnings.push(`App "${name}" missing status`)
        if (!data.timestamp) warnings.push(`App "${name}" missing timestamp`)
      })
    }
  }

  console.log(valid ? `${symbols.pass} Schema PASS` : `${symbols.fail} Schema FAIL`)
  console.log()
}

function validateConsistency(matrix) {
  console.log(`${colors.blue}Consistency Check${colors.reset}`)
  console.log('-'.repeat(70))

  if (!matrix.apps) {
    console.log(`${symbols.fail} No apps data\n`)
    return
  }

  const appCount = Object.keys(matrix.apps).length
  const statusCounts = {}

  Object.entries(matrix.apps).forEach(([name, data]) => {
    const st = data.status || 'unknown'
    statusCounts[st] = (statusCounts[st] || 0) + 1
  })

  console.log(`Status Distribution (${appCount} apps):`)
  Object.entries(statusCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([st, cnt]) => {
      const pct = ((cnt / appCount) * 100).toFixed(1)
      console.log(`   • ${st.padEnd(10)} ${cnt.toString().padStart(2)} (${pct}%)`)
    })

  if ((statusCounts.skipped || 0) === appCount && appCount > 0) {
    issues.push('All compliance entries are skipped; canonical compliance state is not actionable')
  }

  if (matrix.summary) {
    const issues_local = []
    if (matrix.summary.total !== appCount)
      issues_local.push(`total: ${matrix.summary.total} vs ${appCount}`)
    if ((statusCounts['passed'] || 0) !== matrix.summary.passed)
      issues_local.push(`passed: ${matrix.summary.passed} vs ${statusCounts['passed'] || 0}`)
    if ((statusCounts['fixed'] || 0) !== matrix.summary.fixed)
      issues_local.push(`fixed: ${matrix.summary.fixed} vs ${statusCounts['fixed'] || 0}`)

    if (issues_local.length > 0) {
      warnings.push(`Summary mismatch: ${issues_local.join(', ')}`)
    }
  }

  console.log()
}

function validateTimestamps(matrix) {
  console.log(`${colors.blue}Timestamp Check${colors.reset}`)
  console.log('-'.repeat(70))

  if (!matrix.apps) {
    console.log(`${symbols.fail} No apps\n`)
    return
  }

  const now = new Date()
  const thirtyDays = new Date(now - 30 * 24 * 3600 * 1000)

  let stale = 0
  Object.entries(matrix.apps).forEach(([name, data]) => {
    if (!data.timestamp) {
      warnings.push(`${name}: missing timestamp`)
    } else if (new Date(data.timestamp) < thirtyDays) {
      stale++
    }
  })

  if (stale === 0) {
    console.log(`${symbols.pass} All timestamps recent`)
  } else {
    console.log(`${symbols.warn} ${stale} entries older than 30 days`)
  }
  console.log()
}

async function validateReferentialIntegrity(matrix) {
  console.log(`${colors.blue}App References${colors.reset}`)
  console.log('-'.repeat(70))

  let appDirs
  try {
    appDirs = await fs.readdir(appsDir)
  } catch (error) {
    console.log(`${symbols.fail} Cannot read apps/\n`)
    return
  }

  const validApps = (
    await Promise.all(
      appDirs
        .filter((n) => n !== 'ui')
        .map(async (name) => {
          try {
            await fs.access(path.join(appsDir, name, 'package.json'))
            return name
          } catch {
            return null
          }
        }),
    )
  )
    .filter(Boolean)
    .sort()
  const matrixApps = Object.keys(matrix.apps || {}).filter((n) => n !== 'ui').sort()

  const missing = validApps.filter((a) => !matrixApps.includes(a))
  const extra = matrixApps.filter((a) => !validApps.includes(a))

  console.log(`Apps in directory: ${validApps.length}`)
  console.log(`Apps in matrix: ${matrixApps.length}`)

  if (extra.length > 0) {
    warnings.push(`${extra.length} apps in matrix but not in directory`)
  }

  if (missing.length > 0) {
    warnings.push(`${missing.length} apps in directory but not in matrix`)
    if (missing.length <= 10) {
      console.log(`Missing: ${missing.join(', ')}`)
    }
  }

  if (extra.length === 0 && missing.length === 0) {
    console.log(`${symbols.pass} All apps accounted for`)
  }
  console.log()
}

function validateStatusValues(matrix) {
  console.log(`${colors.blue}Status Values${colors.reset}`)
  console.log('-'.repeat(70))

  const valid = ['passed', 'fixed', 'failed', 'pending', 'skipped']
  let invalid = 0

  if (matrix.apps) {
    Object.entries(matrix.apps).forEach(([name, data]) => {
      if (data.status && !valid.includes(data.status)) {
        warnings.push(`${name}: invalid status "${data.status}"`)
        invalid++
      }
    })
  }

  if (invalid === 0) {
    console.log(`${symbols.pass} All statuses valid`)
    console.log(`Valid: ${valid.join(', ')}`)
  } else {
    console.log(`${symbols.fail} ${invalid} invalid status values`)
  }
  console.log()
}

function printSummary(matrix) {
  console.log(`${colors.cyan}Summary${colors.reset}`)
  console.log('='.repeat(70) + '\n')

  const appCount = matrix.apps ? Object.keys(matrix.apps).length : 0
  console.log(`Total Apps: ${appCount}`)
  if (matrix.summary) {
    console.log(
      `Summary: ${matrix.summary.total} total, ${matrix.summary.passed} passed, ${matrix.summary.fixed} fixed`,
    )
  }
  console.log(`Updated: ${matrix.lastUpdated || 'unknown'}\n`)

  if (warnings.length > 0) {
    console.log(`${colors.yellow}⚠️  Warnings (${warnings.length}):${colors.reset}`)
    warnings.slice(0, 8).forEach((w) => console.log(`   • ${w}`))
    if (warnings.length > 8) console.log(`   ... +${warnings.length - 8} more`)
    console.log()
  }

  if (issues.length > 0) {
    console.log(`${colors.red}❌ Issues (${issues.length}):${colors.reset}`)
    issues.forEach((i) => console.log(`   • ${i}`))
    console.log()
  }

  const status =
    issues.length === 0
      ? `${colors.green}✅ PASS${colors.reset}`
      : `${colors.red}❌ FAIL${colors.reset}`
  console.log(`Result: ${status}\n`)
}

validateComplianceMatrix().catch((e) => {
  console.error(`Fatal: ${e.message}`)
  process.exit(1)
})
