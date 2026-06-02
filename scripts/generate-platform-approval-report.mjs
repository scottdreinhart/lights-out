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

const matrixPath = path.join(complianceDir, 'matrix.json')
const platformGapAnalysisPath = path.join(complianceDir, 'platform-gap-analysis.json')
const appStatusPath = path.join(complianceDir, 'app-status.json')
const gateConfigPath = path.join(rootDir, 'scripts', 'config', 'platform-approval-gates.json')
const manualEvidencePath = path.join(complianceDir, 'platform-manual-evidence.json')
const reportPath = path.join(complianceDir, 'platform-approval-report.json')
const matrixReportPath = path.join(complianceDir, 'platform-approval-matrix.json')

const args = process.argv.slice(2)
const strict = args.includes('--strict')
const allowBlocked = args.includes('--allow-blocked')
const CORE_RUNTIME_PLATFORMS = new Set(['web', 'electron', 'ios', 'android'])

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return fallback
  }
}

function readRequiredJson(filePath, label) {
  const data = readJson(filePath, null)
  if (!data) {
    console.error(`ERROR: Missing ${label} (${path.relative(rootDir, filePath)})`)
    process.exit(1)
  }
  return data
}

function getPlatformDisplayName(platformKey, gateConfig) {
  return (
    gateConfig.platforms?.[platformKey]?.displayName ||
    platformKey.charAt(0).toUpperCase() + platformKey.slice(1)
  )
}

function getAutomatedGateCitationSources(platformKey, gateId, gateConfig) {
  const platformSources = gateConfig.platforms?.[platformKey]?.sources || []
  const gateSources = gateConfig.automatedGateCitations?.[gateId]?.sources || []
  return [...new Set([...gateSources, ...platformSources])]
}

function evaluateAutomatedGates(cell, platformKey, appMetadata, gateConfig) {
  const required = Number(cell?.requirementsCoverage?.required || 0)
  const met = Number(cell?.requirementsCoverage?.met || 0)
  const missingRequirements = Array.isArray(cell?.requirementsCoverage?.missingRequirements)
    ? cell.requirementsCoverage.missingRequirements
    : []
  const status = cell?.status || 'not-started'
  const started = status !== 'not-started'
  const runtimeScoped = CORE_RUNTIME_PLATFORMS.has(platformKey)
  const readyForPromotion = Boolean(appMetadata?.readyForPromotion)
  const maturityTier = String(appMetadata?.maturityTier || 'template')
  const scopeEnabled = (() => {
    if (!runtimeScoped) return true
    if (platformKey === 'web') return readyForPromotion
    if (maturityTier === 'web-complete') return false
    return readyForPromotion && started
  })()

  const evaluate = (applicable, pass) => (applicable ? (pass ? 'PASS' : 'FAIL') : 'SKIP')

  const checks = [
    {
      id: 'status-complete',
      label: 'Matrix status must be complete',
      expected: 'complete',
      actual: status,
      status: evaluate(scopeEnabled, status === 'complete'),
    },
    {
      id: 'app-exists',
      label: 'App record must exist',
      expected: true,
      actual: Boolean(cell?.appExists),
      status: evaluate(true, Boolean(cell?.appExists)),
    },
    {
      id: 'rules-verified',
      label: 'Rules must be verified',
      expected: true,
      actual: Boolean(cell?.rulesVerified),
      status: evaluate(scopeEnabled, Boolean(cell?.rulesVerified)),
    },
    {
      id: 'platform-adapter',
      label: 'Platform adapter must be present',
      expected: true,
      actual: Boolean(cell?.platformAdapter),
      status: evaluate(scopeEnabled, Boolean(cell?.platformAdapter)),
    },
    {
      id: 'performance-compliance',
      label: 'Performance compliance must pass',
      expected: true,
      actual: Boolean(cell?.performanceCompliance),
      status: evaluate(scopeEnabled, Boolean(cell?.performanceCompliance)),
    },
    {
      id: 'ui-compliance',
      label: 'UI compliance must pass',
      expected: true,
      actual: Boolean(cell?.uiCompliance),
      status: evaluate(scopeEnabled, Boolean(cell?.uiCompliance)),
    },
    {
      id: 'blockers-free',
      label: 'No critical blockers',
      expected: true,
      actual: Boolean(cell?.blockersFree),
      status: evaluate(scopeEnabled, Boolean(cell?.blockersFree)),
    },
    {
      id: 'requirements-coverage',
      label: 'All platform requirements must be met',
      expected: { met: required, required },
      actual: { met, required, missingRequirements },
      status: evaluate(scopeEnabled, required > 0 && met === required),
    },
  ].map((check) => ({
    ...check,
    citationSources: getAutomatedGateCitationSources(platformKey, check.id, gateConfig),
    citationRationale: gateConfig.automatedGateCitations?.[check.id]?.rationale || '',
  }))

  return checks
}

function hasManualEvidence(manualEvidence, appId, platformKey, manualGate) {
  const raw = manualEvidence?.evidence?.[appId]?.[platformKey]?.[manualGate.id]
  if (!raw || typeof raw !== 'object') return false
  const requiredFields = manualGate.requiredEvidenceFields || []
  return requiredFields.every((field) => {
    const value = raw[field]
    return value !== undefined && value !== null && String(value).trim().length > 0
  })
}

function evaluateManualGates(manualEvidence, appId, platformKey, gateConfig) {
  const manualGates = gateConfig.platforms?.[platformKey]?.manualGates || []
  return manualGates.map((manualGate) => {
    const present = hasManualEvidence(manualEvidence, appId, platformKey, manualGate)
    return {
      id: manualGate.id,
      label: manualGate.label,
      source: manualGate.source,
      requiredEvidenceFields: manualGate.requiredEvidenceFields || [],
      status: present ? 'PASS' : 'BLOCKED',
      evidence: manualEvidence?.evidence?.[appId]?.[platformKey]?.[manualGate.id] || null,
    }
  })
}

function decideVerdict(automatedChecks, manualChecks) {
  if (manualChecks.some((check) => check.status === 'BLOCKED')) return 'BLOCKED'
  if (automatedChecks.some((check) => check.status === 'FAIL')) return 'FAIL'
  return 'PASS'
}

function buildReport(matrix, platformGapAnalysis, gateConfig, manualEvidence, appStatus) {
  const perPlatformTotals = Object.fromEntries(
    (matrix.platforms || []).map((platformKey) => [
      platformKey,
      { pass: 0, fail: 0, blocked: 0, total: 0, displayName: getPlatformDisplayName(platformKey, gateConfig) },
    ]),
  )

  const results = {}
  let pass = 0
  let fail = 0
  let blocked = 0

  for (const appId of matrix.games || []) {
    results[appId] = {}
    const appMetadata = (appStatus.apps || []).find((app) => app.id === appId) || {}
    for (const platformKey of matrix.platforms || []) {
      const cell = matrix.matrix?.[appId]?.[platformKey] || {}
      const automatedChecksWithCitations = evaluateAutomatedGates(
        cell,
        platformKey,
        appMetadata,
        gateConfig,
      )
      const manualChecks = evaluateManualGates(manualEvidence, appId, platformKey, gateConfig)
      const verdict = decideVerdict(automatedChecksWithCitations, manualChecks)

      if (verdict === 'PASS') pass += 1
      if (verdict === 'FAIL') fail += 1
      if (verdict === 'BLOCKED') blocked += 1

      perPlatformTotals[platformKey].total += 1
      if (verdict === 'PASS') perPlatformTotals[platformKey].pass += 1
      if (verdict === 'FAIL') perPlatformTotals[platformKey].fail += 1
      if (verdict === 'BLOCKED') perPlatformTotals[platformKey].blocked += 1

      results[appId][platformKey] = {
        verdict,
        matrixStatus: cell.status || 'not-started',
        completionPercentage: Number(cell.completionPercentage || 0),
        readinessScore: Number(cell.readinessScore || 0),
        automatedChecks: automatedChecksWithCitations,
        manualChecks,
        sources: gateConfig.platforms?.[platformKey]?.sources || [],
        notes: cell.notes || '',
      }
    }
  }

  const totalCells = pass + fail + blocked
  const summary = {
    totalCells,
    pass,
    fail,
    blocked,
    passRate: totalCells === 0 ? 0 : Number(((pass / totalCells) * 100).toFixed(1)),
    failRate: totalCells === 0 ? 0 : Number(((fail / totalCells) * 100).toFixed(1)),
    blockedRate: totalCells === 0 ? 0 : Number(((blocked / totalCells) * 100).toFixed(1)),
  }

  const perPlatform = Object.fromEntries(
    Object.entries(perPlatformTotals).map(([platformKey, totals]) => [
      platformKey,
      {
        displayName: totals.displayName,
        total: totals.total,
        pass: totals.pass,
        fail: totals.fail,
        blocked: totals.blocked,
        passRate: totals.total === 0 ? 0 : Number(((totals.pass / totals.total) * 100).toFixed(1)),
        topMissingRequirements:
          platformGapAnalysis?.platforms?.[platformKey]?.topMissingRequirements || [],
      },
    ]),
  )

  const report = {
    metadata: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      sourceMatrix: path.relative(rootDir, matrixPath),
      sourceGapAnalysis: path.relative(rootDir, platformGapAnalysisPath),
      sourceGateConfig: path.relative(rootDir, gateConfigPath),
      sourceManualEvidence: path.relative(rootDir, manualEvidencePath),
    },
    summary,
    perPlatform,
    results,
  }

  const matrixReport = {
    metadata: report.metadata,
    summary: report.summary,
    perPlatform: report.perPlatform,
    matrix: Object.fromEntries(
      Object.entries(results).map(([appId, platforms]) => [
        appId,
        Object.fromEntries(
          Object.entries(platforms).map(([platformKey, data]) => [platformKey, data.verdict]),
        ),
      ]),
    ),
    details: Object.fromEntries(
      Object.entries(results).map(([appId, platforms]) => [
        appId,
        Object.fromEntries(
          Object.entries(platforms).map(([platformKey, data]) => {
            const automatedPassing = data.automatedChecks.filter((check) => check.status === 'PASS').length
            const automatedApplicable = data.automatedChecks.filter(
              (check) => check.status === 'PASS' || check.status === 'FAIL',
            ).length
            const failedAutomatedGates = data.automatedChecks
              .filter((check) => check.status === 'FAIL')
              .map((check) => check.label)
            const blockedManualGates = data.manualChecks
              .filter((check) => check.status === 'BLOCKED')
              .map((check) => check.label)

            return [
              platformKey,
              {
                verdict: data.verdict,
                automatedGatesPassing: automatedPassing,
                automatedGatesTotal: automatedApplicable,
                failedAutomatedGates,
                blockedManualGates,
              },
            ]
          }),
        ),
      ]),
    ),
  }

  return { report, matrixReport, summary }
}

function ensureManualEvidenceTemplate() {
  if (fs.existsSync(manualEvidencePath)) return
  const template = {
    metadata: {
      version: '1.0.0',
      description:
        'Manual evidence for platform gates that cannot be automatically validated (e.g., auth-restricted policies).',
      updatedAt: new Date().toISOString(),
    },
    evidence: {},
  }
  fs.writeFileSync(manualEvidencePath, JSON.stringify(template, null, 2))
}

function run() {
  ensureManualEvidenceTemplate()

  const matrix = readRequiredJson(matrixPath, 'compliance matrix')
  const platformGapAnalysis = readRequiredJson(platformGapAnalysisPath, 'platform gap analysis')
  const appStatus = readRequiredJson(appStatusPath, 'app status')
  const gateConfig = readRequiredJson(gateConfigPath, 'platform approval gate config')
  const manualEvidence = readRequiredJson(manualEvidencePath, 'manual evidence template')

  const { report, matrixReport, summary } = buildReport(
    matrix,
    platformGapAnalysis,
    gateConfig,
    manualEvidence,
    appStatus,
  )

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  fs.writeFileSync(matrixReportPath, JSON.stringify(matrixReport, null, 2))

  console.log(
    `Platform approval report generated: ${path.relative(rootDir, reportPath)} | PASS=${summary.pass} FAIL=${summary.fail} BLOCKED=${summary.blocked}`,
  )
  console.log(`Platform approval matrix generated: ${path.relative(rootDir, matrixReportPath)}`)

  if (strict && (summary.fail > 0 || (!allowBlocked && summary.blocked > 0))) {
    console.error(
      `Strict validation failed (FAIL=${summary.fail}, BLOCKED=${summary.blocked}, allowBlocked=${allowBlocked})`,
    )
    process.exit(1)
  }
}

run()
