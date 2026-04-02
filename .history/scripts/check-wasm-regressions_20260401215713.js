#!/usr/bin/env node

/**
 * WASM Regression Detection Script
 *
 * Phase 2 Week 2: Automated Regression Detection
 *
 * Detects performance regressions in WASM builds by comparing current profiles
 * against the established baseline.
 *
 * Usage:
 *   node check-wasm-regressions.js
 *   pnpm check:regressions
 *
 * Exit Codes:
 *   0 = No regressions detected (NO_ISSUE)
 *   1 = Minor regressions detected (INVESTIGATE)
 *   2 = Critical regressions detected (FIX_REQUIRED)
 *
 * Output:
 *   - Console report with colorized severity levels
 *   - JSON log entry appended to compliance/regression-alerts.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get directory of this file (for ES modules)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ============================================================================
// Configuration
// ============================================================================

const BASELINES_DIR = path.join(__dirname, '..', 'compliance')
const BASELINE_FILE = path.join(BASELINES_DIR, 'wasm-profiles-baseline.json')
const CURRENT_FILE = path.join(BASELINES_DIR, 'wasm-profiles.json')
const ALERTS_LOG_FILE = path.join(BASELINES_DIR, 'regression-alerts.json')

// Regression thresholds
const THRESHOLDS = {
  NO_ISSUE: 5, // < 5% regression = OK
  INVESTIGATE: 10, // 5-10% regression = Review needed
  FIX_REQUIRED: Infinity, // > 10% regression = Must fix
}

const SEVERITY_MAP = {
  NO_ISSUE: 'ok',
  INVESTIGATE: 'investigate',
  FIX_REQUIRED: 'fixRequired',
}

// ============================================================================
// Color Codes for Console Output
// ============================================================================

const COLORS = {
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',

  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Load and parse JSON file
 */
function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`\n${COLORS.RED}❌ Failed to load ${filePath}${COLORS.RESET}`)
    console.error(`   ${error.message}\n`)
    process.exit(2)
  }
}

/**
 * Save JSON file (with pretty printing)
 */
function saveJSON(filePath, data) {
  const content = JSON.stringify(data, null, 2)
  fs.writeFileSync(filePath, content, 'utf-8')
}

/**
 * Classify regression severity
 */
function classifyRegression(regressionPercent) {
  if (regressionPercent < THRESHOLDS.NO_ISSUE) {
    return 'NO_ISSUE'
  } else if (regressionPercent < THRESHOLDS.INVESTIGATE) {
    return 'INVESTIGATE'
  } else {
    return 'FIX_REQUIRED'
  }
}

/**
 * Format percentage for display
 */
function formatPercent(value) {
  return (value >= 0 ? '+' : '') + value.toFixed(2) + '%'
}

/**
 * Get color for severity
 */
function getSeverityColor(severity) {
  switch (severity) {
    case 'NO_ISSUE':
      return COLORS.GREEN
    case 'INVESTIGATE':
      return COLORS.YELLOW
    case 'FIX_REQUIRED':
      return COLORS.RED
    default:
      return COLORS.RESET
  }
}

/**
 * Get emoji for severity
 */
function getSeverityEmoji(severity) {
  switch (severity) {
    case 'NO_ISSUE':
      return '✅'
    case 'INVESTIGATE':
      return '⚠️ '
    case 'FIX_REQUIRED':
      return '❌'
    default:
      return '  '
  }
}

// ============================================================================
// Main Detection Logic
// ============================================================================

/**
 * Compare baseline vs current profiles
 */
function detectRegressions(baseline, current) {
  const results = {
    timestamp: new Date().toISOString(),
    baselineVersion: baseline.version,
    baselineDate: baseline.releaseDate,
    currentDate: new Date().toISOString().split('T')[0],
    regressions: [],
    summary: {
      totalApps: 0,
      ok: 0,
      investigate: 0,
      fixRequired: 0,
    },
  }

  // Get list of apps to compare
  const baselineApps = Object.keys(baseline.profiles || {})
  const currentProfiles = current.profiles || {}

  baselineApps.forEach((appName) => {
    const baselineProfile = baseline.profiles[appName]
    const currentProfile = currentProfiles[appName]

    if (!currentProfile) {
      console.warn(`  ${COLORS.DIM}⚠️  ${appName} missing in current profiles${COLORS.RESET}`)
      return
    }

    // Compare hard difficulty (most critical)
    const difficulty = 'hard'
    const baselineMs = baselineProfile[difficulty]?.timeMs
    const currentMs = currentProfile[difficulty]?.timeMs

    if (baselineMs === undefined || currentMs === undefined) {
      console.warn(
        `  ${COLORS.DIM}⚠️  ${appName}.${difficulty} missing baseline or current${COLORS.RESET}`,
      )
      return
    }

    // Calculate regression
    const regressionMs = currentMs - baselineMs
    const regressionPercent = (regressionMs / baselineMs) * 100
    const severity = classifyRegression(regressionPercent)

    results.regressions.push({
      app: appName,
      difficulty,
      baselineMs: parseFloat(baselineMs.toFixed(3)),
      currentMs: parseFloat(currentMs.toFixed(3)),
      regressionMs: parseFloat(regressionMs.toFixed(3)),
      regressionPercent: parseFloat(regressionPercent.toFixed(2)),
      severity,
      threshold: THRESHOLDS[severity],
    })

    // Update summary
    results.summary.totalApps++
    results.summary[SEVERITY_MAP[severity]]++
  })

  // Sort by regression percent (descending)
  results.regressions.sort((a, b) => b.regressionPercent - a.regressionPercent)

  return results
}

/**
 * Append results to alerts log
 */
function logRegressions(results) {
  let alertsData = { alerts: [] }

  // Load existing alerts if file exists
  if (fs.existsSync(ALERTS_LOG_FILE)) {
    try {
      alertsData = loadJSON(ALERTS_LOG_FILE)
    } catch (e) {
      console.warn(`${COLORS.DIM}Warning: Could not load existing alerts${COLORS.RESET}`)
    }
  }

  // Append new entry
  alertsData.alerts.push({
    timestamp: results.timestamp,
    baselineVersion: results.baselineVersion,
    buildNumber: alertsData.alerts.length + 1,
    summary: results.summary,
    regressions: results.regressions.filter((r) => r.severity !== 'NO_ISSUE'),
    acknowledged: false,
  })

  saveJSON(ALERTS_LOG_FILE, alertsData)
}

/**
 * Print formatted console report
 */
function printReport(results) {
  const { summary, regressions } = results

  console.log(
    '\n' +
      COLORS.BOLD +
      '═══════════════════════════════════════════════════════════' +
      COLORS.RESET,
  )
  console.log(COLORS.BOLD + '  WASM Regression Detection Report' + COLORS.RESET)
  console.log(
    COLORS.BOLD + '═══════════════════════════════════════════════════════════' + COLORS.RESET,
  )

  // Summary stats
  console.log('\n' + COLORS.BOLD + 'Summary:' + COLORS.RESET)
  console.log(`  ${COLORS.GREEN}✅ OK (< 5%):${COLORS.RESET}          ${summary.ok} apps`)
  console.log(
    `  ${COLORS.YELLOW}⚠️  INVESTIGATE (5-10%):${COLORS.RESET}   ${summary.investigate} apps`,
  )
  console.log(
    `  ${COLORS.RED}❌ FIX_REQUIRED (> 10%):${COLORS.RESET}   ${summary.fixRequired} apps`,
  )
  console.log(`  ${COLORS.BLUE}📊 Total:${COLORS.RESET}              ${summary.totalApps} apps`)

  // Detailed regressions (non-OK only)
  const filteredRegressions = regressions.filter((r) => r.severity !== 'NO_ISSUE')

  if (filteredRegressions.length > 0) {
    console.log('\n' + COLORS.BOLD + 'Regressions Detected:' + COLORS.RESET)
    console.log(COLORS.DIM + '─'.repeat(60) + COLORS.RESET)

    filteredRegressions.forEach((reg) => {
      const color = getSeverityColor(reg.severity)
      const emoji = getSeverityEmoji(reg.severity)
      const percent = formatPercent(reg.regressionPercent)

      console.log(
        `  ${emoji} ${color}${reg.app.padEnd(20)}${COLORS.RESET} ` +
          `${percent.padStart(8)} (${reg.baselineMs.toFixed(3)}ms → ${reg.currentMs.toFixed(3)}ms)`,
      )
    })

    console.log(COLORS.DIM + '─'.repeat(60) + COLORS.RESET)
  } else {
    console.log(`\n${COLORS.GREEN}${COLORS.BOLD}✅ No regressions detected!${COLORS.RESET}`)
  }

  // Baseline reference
  console.log('\n' + COLORS.BOLD + 'Baseline Reference:' + COLORS.RESET)
  console.log(`  Version: ${results.baselineVersion}`)
  console.log(`  Date:    ${results.baselineDate}`)
  console.log(`  Thresholds: NO_ISSUE <5%, INVESTIGATE 5-10%, FIX_REQUIRED >10%`)

  console.log(
    '\n' +
      COLORS.BOLD +
      '═══════════════════════════════════════════════════════════' +
      COLORS.RESET +
      '\n',
  )
}

/**
 * Determine exit code based on severity
 */
function getExitCode(summary) {
  if (summary.fixRequired > 0) {
    return 2 // Critical: must fix
  }
  if (summary.investigate > 0) {
    return 1 // Minor: investigate
  }
  return 0 // All clear
}

// ============================================================================
// Main Execution
// ============================================================================

;(function main() {
  // Load baseline
  if (!fs.existsSync(BASELINE_FILE)) {
    console.error(`\n${COLORS.RED}❌ Baseline file not found: ${BASELINE_FILE}${COLORS.RESET}`)
    console.error(`   Run 'pnpm wasm:build' to create baseline.\n`)
    process.exit(2)
  }

  const baseline = loadJSON(BASELINE_FILE)
  console.log(`${COLORS.CYAN}📦 Loaded baseline v${baseline.version}${COLORS.RESET}`)

  // Load current profiles
  if (!fs.existsSync(CURRENT_FILE)) {
    console.error(`\n${COLORS.RED}❌ Current profiles not found: ${CURRENT_FILE}${COLORS.RESET}`)
    console.error(`   Run 'pnpm wasm:build' to generate profiles.\n`)
    process.exit(2)
  }

  const current = loadJSON(CURRENT_FILE)
  console.log(`${COLORS.CYAN}📊 Loaded current profiles${COLORS.RESET}`)

  // Detect regressions
  console.log(`${COLORS.CYAN}🔍 Comparing profiles...${COLORS.RESET}`)
  const results = detectRegressions(baseline, current)

  // Print report
  printReport(results)

  // Log to alerts file
  logRegressions(results)
  console.log(`${COLORS.CYAN}📝 Results logged to regression-alerts.json${COLORS.RESET}\n`)

  // Exit with appropriate code
  const exitCode = getExitCode(results.summary)
  if (exitCode === 0) {
    console.log(`${COLORS.GREEN}${COLORS.BOLD}✅ All checks passed!${COLORS.RESET}\n`)
  } else if (exitCode === 1) {
    console.log(
      `${COLORS.YELLOW}${COLORS.BOLD}⚠️  Minor regressions found - review recommended${COLORS.RESET}\n`,
    )
  } else {
    console.log(
      `${COLORS.RED}${COLORS.BOLD}❌ Critical regressions found - fixup required${COLORS.RESET}\n`,
    )
  }

  process.exit(exitCode)
})()
