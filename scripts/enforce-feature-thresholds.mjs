#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const ROOT = process.cwd()
const FEATURE_MATRIX_FILE = path.join(ROOT, 'compliance', 'feature-implementation-matrix.json')
const SECURITY_REPORT_FILE = path.join(ROOT, 'compliance', 'security-module-adoption.json')

const FEATURE_THRESHOLD = Number(process.env.FEATURE_THRESHOLD ?? 40)
const SECURITY_WIRED_THRESHOLD = Number(process.env.SECURITY_WIRED_THRESHOLD ?? 40)

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function fail(message) {
  // eslint-disable-next-line no-console
  console.error(message)
  process.exit(1)
}

function run() {
  if (!fs.existsSync(FEATURE_MATRIX_FILE)) {
    fail(`Missing matrix file: ${path.relative(ROOT, FEATURE_MATRIX_FILE)}`)
  }
  if (!fs.existsSync(SECURITY_REPORT_FILE)) {
    fail(`Missing security report: ${path.relative(ROOT, SECURITY_REPORT_FILE)}`)
  }

  const featureMatrix = readJson(FEATURE_MATRIX_FILE)
  const securityReport = readJson(SECURITY_REPORT_FILE)

  const featureEntries = Object.entries(featureMatrix.features ?? {})
  if (featureEntries.length === 0) {
    fail('No feature entries found in feature implementation matrix')
  }

  const featureFailures = featureEntries
    .map(([key, feature]) => ({
      key,
      name: feature.name ?? key,
      implemented: feature.implemented ?? 0,
    }))
    .filter((feature) => feature.implemented < FEATURE_THRESHOLD)

  const fullyWiredApps = securityReport?.totals?.fullyWiredApps ?? 0
  const securityFailure = fullyWiredApps < SECURITY_WIRED_THRESHOLD

  if (featureFailures.length > 0 || securityFailure) {
    // eslint-disable-next-line no-console
    console.error('❌ Compliance threshold gate failed')
    if (featureFailures.length > 0) {
      // eslint-disable-next-line no-console
      console.error(`Features below threshold (${FEATURE_THRESHOLD}):`)
      for (const feature of featureFailures) {
        // eslint-disable-next-line no-console
        console.error(`  - ${feature.name}: ${feature.implemented}`)
      }
    }
    if (securityFailure) {
      // eslint-disable-next-line no-console
      console.error(
        `Security wired apps below threshold (${SECURITY_WIRED_THRESHOLD}): ${fullyWiredApps}`,
      )
    }
    process.exit(1)
  }

  // eslint-disable-next-line no-console
  console.log(
    `✅ Compliance thresholds met: ${featureEntries.length} features >= ${FEATURE_THRESHOLD}, security wired apps >= ${SECURITY_WIRED_THRESHOLD}`,
  )
}

run()
