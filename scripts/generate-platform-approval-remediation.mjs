#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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
const rootDir = path.resolve(__dirname, '..')
const complianceDir = path.join(rootDir, 'compliance')

const reportPath = path.join(complianceDir, 'platform-approval-report.json')
const gateConfigPath = path.join(rootDir, 'scripts', 'config', 'platform-approval-gates.json')
const manualEvidencePath = path.join(complianceDir, 'platform-manual-evidence.json')
const remediationPath = path.join(complianceDir, 'platform-approval-remediation.json')

const args = process.argv.slice(2)
const shouldInitManualEvidence = args.includes('--init-manual-evidence')
const topLimitArg = args.find((arg) => arg.startsWith('--top='))
const topLimit = Number.parseInt(topLimitArg?.split('=')[1] || '20', 10)

function readRequiredJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    console.error(`ERROR: Missing/invalid ${label} (${path.relative(rootDir, filePath)}): ${error.message}`)
    process.exit(1)
  }
}

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return fallback
  }
}

function incrementMapCounter(map, key, seed) {
  const current = map.get(key)
  if (current) {
    current.count += 1
    return current
  }
  const next = { ...seed, count: 1 }
  map.set(key, next)
  return next
}

function buildRemediation(report) {
  const automatedFailures = new Map()
  const blockedManualGates = new Map()
  const byApp = {}
  const byPlatform = {}

  for (const [appId, platformResults] of Object.entries(report.results || {})) {
    byApp[appId] = { fail: 0, blocked: 0, platforms: {} }
    for (const [platformKey, platformResult] of Object.entries(platformResults || {})) {
      if (!byPlatform[platformKey]) byPlatform[platformKey] = { fail: 0, blocked: 0, apps: 0 }
      byPlatform[platformKey].apps += 1

      const appPlatform = {
        verdict: platformResult.verdict,
        automatedFailures: [],
        manualBlocks: [],
      }

      for (const check of platformResult.automatedChecks || []) {
        if (check.status !== 'FAIL') continue
        byApp[appId].fail += 1
        byPlatform[platformKey].fail += 1
        appPlatform.automatedFailures.push(check.id)
        incrementMapCounter(automatedFailures, check.id, {
          id: check.id,
          label: check.label,
          expected: check.expected,
          sampleActual: check.actual,
          platforms: new Set([platformKey]),
          apps: new Set([appId]),
        })
      }

      for (const check of platformResult.manualChecks || []) {
        if (check.status !== 'BLOCKED') continue
        byApp[appId].blocked += 1
        byPlatform[platformKey].blocked += 1
        appPlatform.manualBlocks.push(check.id)
        incrementMapCounter(blockedManualGates, check.id, {
          id: check.id,
          label: check.label,
          source: check.source,
          requiredEvidenceFields: check.requiredEvidenceFields || [],
          platforms: new Set([platformKey]),
          apps: new Set([appId]),
        })
      }

      byApp[appId].platforms[platformKey] = appPlatform
    }
  }

  const normalizedAutomatedFailures = [...automatedFailures.values()]
    .map((entry) => ({
      ...entry,
      platforms: [...entry.platforms].sort(),
      apps: [...entry.apps].sort(),
    }))
    .sort((a, b) => b.count - a.count)

  const normalizedManualBlocks = [...blockedManualGates.values()]
    .map((entry) => ({
      ...entry,
      platforms: [...entry.platforms].sort(),
      apps: [...entry.apps].sort(),
    }))
    .sort((a, b) => b.count - a.count)

  const topApps = Object.entries(byApp)
    .map(([appId, stats]) => ({ appId, ...stats }))
    .sort((a, b) => b.fail + b.blocked - (a.fail + a.blocked))
    .slice(0, topLimit)

  const topPlatforms = Object.entries(byPlatform)
    .map(([platformKey, stats]) => ({ platformKey, ...stats }))
    .sort((a, b) => b.fail + b.blocked - (a.fail + a.blocked))
    .slice(0, topLimit)

  return {
    summary: report.summary || {},
    topAutomatedFailures: normalizedAutomatedFailures.slice(0, topLimit),
    topManualBlocks: normalizedManualBlocks.slice(0, topLimit),
    topApps,
    topPlatforms,
  }
}

function initManualEvidence(report, gateConfig, manualEvidence) {
  const next = manualEvidence || { metadata: {}, evidence: {} }
  next.metadata = {
    version: next.metadata?.version || '1.0.0',
    description:
      next.metadata?.description ||
      'Manual evidence for platform gates that cannot be automatically validated.',
    updatedAt: new Date().toISOString(),
  }
  if (!next.evidence || typeof next.evidence !== 'object') next.evidence = {}

  let scaffolded = 0
  for (const [appId, platformResults] of Object.entries(report.results || {})) {
    if (!next.evidence[appId]) next.evidence[appId] = {}

    for (const [platformKey, platformResult] of Object.entries(platformResults || {})) {
      const manualGates = gateConfig.platforms?.[platformKey]?.manualGates || []
      if (!manualGates.length) continue
      if (!next.evidence[appId][platformKey]) next.evidence[appId][platformKey] = {}

      for (const gate of manualGates) {
        if (next.evidence[appId][platformKey][gate.id]) continue
        const placeholder = Object.fromEntries(
          (gate.requiredEvidenceFields || []).map((field) => [field, null]),
        )
        placeholder.status = 'pending-manual-review'
        placeholder.source = gate.source
        placeholder.createdAt = new Date().toISOString()
        next.evidence[appId][platformKey][gate.id] = placeholder
        scaffolded += 1
      }

      if (platformResult.verdict === 'BLOCKED' && manualGates.length === 0) {
        // No-op: kept to avoid silently ignoring future blocked-only platforms.
      }
    }
  }

  fs.writeFileSync(manualEvidencePath, JSON.stringify(next, null, 2))
  return scaffolded
}

function run() {
  const report = readRequiredJson(reportPath, 'platform approval report')
  const gateConfig = readRequiredJson(gateConfigPath, 'platform approval gate config')
  const remediation = buildRemediation(report)

  const payload = {
    metadata: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      sourceReport: path.relative(rootDir, reportPath),
      sourceGateConfig: path.relative(rootDir, gateConfigPath),
      topLimit,
    },
    ...remediation,
  }
  fs.writeFileSync(remediationPath, JSON.stringify(payload, null, 2))
  console.log(`Platform approval remediation report generated: ${path.relative(rootDir, remediationPath)}`)

  if (shouldInitManualEvidence) {
    const manualEvidence = readJson(manualEvidencePath, {
      metadata: { version: '1.0.0', description: 'Manual evidence template', updatedAt: null },
      evidence: {},
    })
    const scaffolded = initManualEvidence(report, gateConfig, manualEvidence)
    console.log(
      `Manual evidence scaffold updated: ${path.relative(rootDir, manualEvidencePath)} (added ${scaffolded} entries)`,
    )
  }
}

run()
