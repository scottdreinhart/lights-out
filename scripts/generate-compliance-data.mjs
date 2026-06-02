#!/usr/bin/env node

import { spawnSync } from 'child_process'
import fs from 'fs'
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
const rootDir = path.resolve(__dirname, '..')
const complianceDir = path.join(rootDir, 'compliance')
const appsDir = path.join(rootDir, 'apps')
const appStatusPath = path.join(complianceDir, 'app-status.json')
const featureMatrixPath = path.join(complianceDir, 'feature-implementation-matrix.json')
const platformRequirementsPath = path.join(
  rootDir,
  'scripts',
  'config',
  'platform-requirements.json',
)
const sourcesPath = path.join(complianceDir, 'sources.json')
const matrixPath = path.join(complianceDir, 'matrix.json')
const platformGapAnalysisPath = path.join(complianceDir, 'platform-gap-analysis.json')
const platformRequirementsCatalogPath = path.join(
  complianceDir,
  'platform-requirements-catalog.json',
)
const blockersPath = path.join(complianceDir, 'blockers.json')
const bundleMetricsPath = path.join(complianceDir, 'bundle-metrics.json')
const semanticActionsPath = path.join(complianceDir, 'semantic-actions.json')
const rootPackageJsonPath = path.join(rootDir, 'package.json')
const sharedPackageCoverageScriptPath = path.join(
  rootDir,
  'scripts',
  'generate-shared-package-coverage.mjs',
)

const PNPM_NON_SCRIPT_COMMANDS = new Set([
  'exec',
  'dlx',
  'install',
  'add',
  'remove',
  'update',
  'up',
  'list',
  'rebuild',
  'publish',
  'pack',
  'config',
  'help',
  'why',
  'import',
  'outdated',
  'audit',
  'fetch',
  'store',
  'prune',
  'setup',
])

const SEMANTIC_ACTION_BLUEPRINT = [
  {
    id: 'build-workflow',
    title: 'Build Workflow',
    description: 'Primary build orchestration and delivery-facing build chains.',
    items: [
      { id: 'build', label: 'Root build pipeline', script: 'build', required: true },
      { id: 'build-apps', label: 'Sequential app builds', script: 'build:apps', required: true },
      {
        id: 'build-workspace',
        label: 'Workspace build chain',
        script: 'build:ws',
        required: false,
      },
      {
        id: 'build-preview',
        label: 'Build + preview chain',
        script: 'build:preview',
        required: false,
      },
    ],
  },
  {
    id: 'qa-workflow',
    title: 'Quality & QA Workflow',
    description: 'Lint, test, typecheck, validation, and gated quality chains.',
    items: [
      { id: 'check', label: 'Quality check chain', script: 'check', required: true },
      { id: 'test', label: 'Primary test chain', script: 'test', required: true },
      { id: 'test-names', label: 'Test naming validation', script: 'test:names', required: true },
      { id: 'validate', label: 'Validation gate', script: 'validate', required: true },
      {
        id: 'validate-gated',
        label: 'Gated validation entrypoint',
        script: 'validate:gated',
        required: true,
      },
      { id: 'e2e', label: 'End-to-end test chain', script: 'test:e2e', required: false },
    ],
  },
  {
    id: 'compliance-workflow',
    title: 'Compliance & Dashboard Workflow',
    description: 'Compliance generation, approval reporting, and dashboard refresh automation.',
    items: [
      {
        id: 'compliance-data',
        label: 'Compliance data generation',
        script: 'generate-compliance-data',
        required: true,
      },
      {
        id: 'compliance-metrics',
        label: 'Compliance metrics generation',
        script: 'compliance:metrics',
        required: true,
      },
      {
        id: 'platform-approval',
        label: 'Platform approval report',
        script: 'report:platform-approval',
        required: true,
      },
      {
        id: 'dashboard-refresh',
        label: 'One-command dashboard refresh',
        script: 'dashboard:refresh',
        required: true,
      },
      {
        id: 'platform-approval-gate',
        label: 'Strict platform approval gate',
        script: 'validate:platform-approval',
        required: false,
      },
    ],
  },
  {
    id: 'packaging-workflow',
    title: 'Packaging & Platform Workflow',
    description: 'Desktop/mobile packaging and WASM build process triggers.',
    items: [
      {
        id: 'electron-build',
        label: 'Electron packaging chain',
        script: 'electron:build',
        required: true,
      },
      { id: 'capacitor-sync', label: 'Capacitor sync chain', script: 'cap:sync', required: true },
      { id: 'wasm-build', label: 'WASM build chain', script: 'wasm:build', required: true },
      {
        id: 'windows-build',
        label: 'Windows packaging chain',
        script: 'electron:build:win',
        required: false,
      },
      { id: 'ios-run', label: 'iOS runtime chain', script: 'cap:run:ios', required: false },
    ],
  },
]

const PLATFORM_DISPLAY_FALLBACK = {
  web: 'Web',
  meta: 'Meta Instant Games',
  ios: 'iOS',
  android: 'Android',
  electron: 'Electron',
  twitch: 'Twitch Extensions',
  crazygames: 'CrazyGames',
  discord: 'Discord Activities',
  telegram: 'Telegram Mini Apps',
  steam: 'Steam',
}

function listApps() {
  return fs
    .readdirSync(appsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name !== 'ui')
    .filter((name) => fs.existsSync(path.join(appsDir, name, 'package.json')))
    .sort((a, b) => a.localeCompare(b))
}

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return fallback
  }
}

function extractScriptReferences(command) {
  if (!command || typeof command !== 'string') return []
  const refs = new Set()
  const regex =
    /pnpm(?:\s+-C\s+\S+|\s+--filter\s+\S+|\s+-r|\s+--workspace-concurrency=\S+|\s+--parallel|\s+--sequential)*\s+([a-zA-Z0-9:_-]+)/g
  let match = regex.exec(command)
  while (match) {
    const token = match[1]
    if (token && !PNPM_NON_SCRIPT_COMMANDS.has(token)) refs.add(token)
    match = regex.exec(command)
  }
  return [...refs]
}

function evaluateSemanticScript(scriptName, scripts, required) {
  const command = scripts?.[scriptName]
  if (!command) {
    return {
      script: scriptName,
      command: null,
      status: required ? 'FAIL' : 'PENDING',
      references: [],
      missingReferences: [],
    }
  }

  const references = extractScriptReferences(command)
    .filter((ref) => ref !== scriptName)
    .map((ref) => ({
      script: ref,
      exists: Boolean(scripts?.[ref]),
    }))
  const missingReferences = references.filter((ref) => !ref.exists).map((ref) => ref.script)
  const status = missingReferences.length > 0 ? 'IN-PROGRESS' : 'PASS'

  return {
    script: scriptName,
    command,
    status,
    references,
    missingReferences,
  }
}

function generateSemanticActionsReport() {
  const packageJson = readJson(rootPackageJsonPath, {})
  const scripts = packageJson?.scripts || {}
  const scriptFiles = [
    'scripts/validate-gated.mjs',
    'scripts/generate-compliance-data.mjs',
    'scripts/generate-compliance-metrics.mjs',
    'scripts/generate-platform-approval-report.mjs',
    'scripts/build-apps-sequential.mjs',
    'scripts/test-segmented.mjs',
  ]

  const sections = SEMANTIC_ACTION_BLUEPRINT.map((section) => ({
    id: section.id,
    title: section.title,
    description: section.description,
    items: section.items.map((item) => ({
      id: item.id,
      label: item.label,
      required: item.required,
      ...evaluateSemanticScript(item.script, scripts, item.required),
    })),
  }))

  const packageContractChecks = [
    {
      id: 'package-manager',
      label: 'pnpm package manager contract',
      required: true,
      status: String(packageJson?.packageManager || '').startsWith('pnpm@') ? 'PASS' : 'FAIL',
      detail: packageJson?.packageManager || 'missing',
    },
    {
      id: 'workspace-lock',
      label: 'pnpm lockfile present',
      required: true,
      status: fs.existsSync(path.join(rootDir, 'pnpm-lock.yaml')) ? 'PASS' : 'FAIL',
      detail: 'pnpm-lock.yaml',
    },
    {
      id: 'workspace-config',
      label: 'pnpm workspace config present',
      required: true,
      status: fs.existsSync(path.join(rootDir, 'pnpm-workspace.yaml')) ? 'PASS' : 'FAIL',
      detail: 'pnpm-workspace.yaml',
    },
    {
      id: 'node-engine',
      label: 'Node engine declared',
      required: true,
      status: packageJson?.engines?.node ? 'PASS' : 'FAIL',
      detail: packageJson?.engines?.node || 'missing',
    },
    {
      id: 'pnpm-engine',
      label: 'pnpm engine declared',
      required: true,
      status: packageJson?.engines?.pnpm ? 'PASS' : 'FAIL',
      detail: packageJson?.engines?.pnpm || 'missing',
    },
    {
      id: 'workflow-scripts',
      label: 'Core workflow scripts present',
      required: true,
      status: scriptFiles.every((filePath) => fs.existsSync(path.join(rootDir, filePath)))
        ? 'PASS'
        : 'IN-PROGRESS',
      detail: scriptFiles,
    },
  ]

  sections.push({
    id: 'package-engine-contracts',
    title: 'Package, Engine & Script Contracts',
    description: 'Contract checks that enforce build and QA pipeline execution prerequisites.',
    items: packageContractChecks,
  })

  const allItems = sections.flatMap((section) => section.items)
  const summary = {
    total: allItems.length,
    pass: allItems.filter((item) => item.status === 'PASS').length,
    fail: allItems.filter((item) => item.status === 'FAIL').length,
    pending: allItems.filter((item) => item.status === 'PENDING').length,
    inProgress: allItems.filter((item) => item.status === 'IN-PROGRESS').length,
  }

  return {
    metadata: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      source: 'package.json scripts + repository workflow files',
      description:
        'Semantic action workflow disclosure for build, QA, compliance, packaging, and pipeline contract enforcement.',
    },
    summary,
    sections,
  }
}

function getByPath(obj, dottedPath) {
  if (!dottedPath) return undefined
  return dottedPath
    .split('.')
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}

function readPlatformRequirements() {
  const catalog = readJson(platformRequirementsPath, null)
  if (!catalog || !catalog.platforms) {
    return {
      metadata: { version: 'fallback' },
      platforms: Object.fromEntries(
        Object.entries(PLATFORM_DISPLAY_FALLBACK).map(([key, displayName]) => [
          key,
          { displayName, requirements: [] },
        ]),
      ),
    }
  }
  return catalog
}

function requirementPassCondition(requirement) {
  switch (requirement?.type) {
    case 'scriptExists':
      return `PASS when package.json scripts contains "${requirement.value}". FAIL when missing.`
    case 'scriptContains':
      return `PASS when any script key or command contains "${requirement.value}". FAIL when none match.`
    case 'fileExists':
      return `PASS when file exists at "${requirement.value}". FAIL when file is missing.`
    case 'folderExists':
      return `PASS when folder exists at "${requirement.value}". FAIL when folder is missing.`
    case 'oneOfFiles':
      return `PASS when at least one candidate file exists. FAIL when all candidates are missing.`
    case 'dependencyExists':
      return `PASS when dependency "${requirement.value}" exists in dependencies or devDependencies. FAIL when absent.`
    case 'packageFieldExists':
      return `PASS when package.json field "${requirement.value}" exists and is non-empty. FAIL when absent or empty.`
    case 'sourcePatternAll':
      return 'PASS when all required source patterns are present in app source. FAIL when any required pattern is missing.'
    default:
      return 'PASS/FAIL rule unavailable for this requirement type.'
  }
}

function buildPlatformRequirementsCatalog(platformCatalog) {
  const platforms = Object.fromEntries(
    Object.entries(platformCatalog?.platforms || {}).map(([platformKey, platformConfig]) => [
      platformKey,
      {
        displayName:
          platformConfig?.displayName || PLATFORM_DISPLAY_FALLBACK[platformKey] || platformKey,
        requirementCount: (platformConfig?.requirements || []).length,
        requirements: (platformConfig?.requirements || []).map((requirement) => ({
          id: requirement.id,
          label: requirement.label,
          type: requirement.type,
          value: requirement.value || null,
          values: requirement.values || null,
          passCondition: requirementPassCondition(requirement),
        })),
      },
    ]),
  )

  return {
    metadata: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      source: path.relative(rootDir, platformRequirementsPath),
      description: 'Platform requirement catalog with explicit PASS/FAIL criteria.',
    },
    platforms,
  }
}

function buildContext(packageJson, appName) {
  const scripts = packageJson?.scripts || {}
  const dependencies = packageJson?.dependencies || {}
  const devDependencies = packageJson?.devDependencies || {}
  const appDir = path.join(appsDir, appName)
  const sourceText = collectSourceText(appDir)
  return {
    appDir,
    scripts,
    packageJson,
    deps: { ...dependencies, ...devDependencies },
    sourceText,
  }
}

function collectSourceText(appDir) {
  const srcDir = path.join(appDir, 'src')
  if (!fs.existsSync(srcDir)) return ''

  const segments = []
  const walkDir = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walkDir(fullPath)
        continue
      }
      if (!/\.(ts|tsx|js|jsx|mjs|cjs)$/i.test(entry.name)) continue
      try {
        segments.push(fs.readFileSync(fullPath, 'utf8'))
      } catch {
        // Ignore unreadable files; requirement checks fail closed.
      }
    }
  }

  walkDir(srcDir)
  return segments.join('\n')
}

function evaluateRequirement(requirement, ctx) {
  const { scripts, deps, appDir, packageJson, sourceText } = ctx
  switch (requirement.type) {
    case 'scriptExists':
      return Boolean(scripts?.[requirement.value])
    case 'scriptContains':
      return Object.keys(scripts || {}).some(
        (scriptKey) =>
          scriptKey.includes(requirement.value) ||
          String(scripts[scriptKey]).includes(requirement.value),
      )
    case 'fileExists':
      return fs.existsSync(path.join(appDir, requirement.value))
    case 'folderExists': {
      const fullPath = path.join(appDir, requirement.value)
      return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()
    }
    case 'oneOfFiles':
      return (requirement.values || []).some((value) => fs.existsSync(path.join(appDir, value)))
    case 'dependencyExists':
      return Boolean(deps?.[requirement.value])
    case 'packageFieldExists': {
      const field = getByPath(packageJson, requirement.value)
      return field !== undefined && field !== null && String(field).trim() !== ''
    }
    case 'sourcePatternAll': {
      const patterns = requirement.values || []
      if (!Array.isArray(patterns) || patterns.length === 0) return false
      return patterns.every((pattern) => {
        try {
          return new RegExp(pattern, 'm').test(sourceText)
        } catch {
          return false
        }
      })
    }
    default:
      return false
  }
}

function evaluatePlatformRequirements(platformConfig, ctx) {
  const requirements = platformConfig?.requirements || []
  const checks = requirements.map((requirement) => ({
    id: requirement.id,
    label: requirement.label,
    passed: evaluateRequirement(requirement, ctx),
  }))

  const total = checks.length
  const met = checks.filter((check) => check.passed).length
  const missing = checks
    .filter((check) => !check.passed)
    .map((check) => ({ id: check.id, label: check.label }))
  const completion = total === 0 ? 0 : Number(((met / total) * 100).toFixed(1))

  return { total, met, completion, missing, checks }
}

function resolveCellStatus(requirements, appStatusRecord, platformKey) {
  const { total, met, completion } = requirements
  if (total === 0 || met === 0) {
    return { status: 'not-started', completion }
  }
  if (met < total) return { status: 'partial', completion }
  return { status: 'complete', completion }
}

function buildSourcesData() {
  const appStatus = readJson(appStatusPath, { apps: [] })
  const statusById = Object.fromEntries((appStatus.apps || []).map((app) => [app.id, app]))
  const platformCatalog = readPlatformRequirements()
  const platformKeys = Object.keys(platformCatalog.platforms || {})
  const platformDisplayByKey = Object.fromEntries(
    platformKeys.map((key) => [
      key,
      platformCatalog.platforms[key]?.displayName || PLATFORM_DISPLAY_FALLBACK[key] || key,
    ]),
  )
  const platforms = platformKeys.map((key) => platformDisplayByKey[key])
  const appNames = listApps()

  const matrix = {}
  const gameMetadata = {}
  let startedCells = 0
  let completeCells = 0
  let partialCells = 0

  for (const appName of appNames) {
    const packageJson = readJson(path.join(appsDir, appName, 'package.json'), {})
    const ctx = buildContext(packageJson, appName)
    matrix[appName] = {}

    for (const platformKey of platformKeys) {
      const platform = platformDisplayByKey[platformKey]
      const requirements = evaluatePlatformRequirements(
        platformCatalog.platforms?.[platformKey],
        ctx,
      )
      const { status, completion } = resolveCellStatus(
        requirements,
        statusById[appName],
        platformKey,
      )

      matrix[appName][platform] = {
        status,
        completion,
        lastUpdated: new Date().toISOString(),
        readinessScore: requirements.completion,
        requirementsCoverage: {
          required: requirements.total,
          met: requirements.met,
          missingRequirements: requirements.missing,
        },
      }

      if (status !== 'not-started') startedCells += 1
      if (status === 'partial') partialCells += 1
      if (status === 'complete') completeCells += 1
    }

    gameMetadata[appName] = {
      name: appName,
      maturityTier: statusById[appName]?.maturityTier || 'template',
      readyForPromotion: Boolean(statusById[appName]?.readyForPromotion),
    }
  }

  const totalCells = appNames.length * platforms.length
  const coverage = Number(((startedCells / totalCells) * 100).toFixed(1))
  const progress = Number((((completeCells + partialCells * 0.5) / totalCells) * 100).toFixed(1))

  return {
    metadata: {
      version: '4.0.0',
      generatedAt: new Date().toISOString(),
      canonicalSource: 'compliance/app-status.json',
      requirementsSource: 'scripts/config/platform-requirements.json',
      description:
        'Game-by-platform deployment matrix derived from audited app status and requirement-level platform inspection standards',
      gameCount: appNames.length,
      platformCount: platforms.length,
      coverage,
      progress,
      platformDisplayByKey,
    },
    games: appNames,
    platforms,
    matrix,
    gameMetadata,
  }
}

function normalizeFeatureMap(featureMatrix) {
  const features = featureMatrix?.features || {}
  const toSet = (key) => new Set((features[key]?.implementedBy || []).map((name) => String(name)))
  return {
    rules: toSet('rulesModal'),
    responsive: toSet('responsiveFeatures'),
    accessibility: toSet('accessibility'),
  }
}

function getBundleLimitBytes(platformKey) {
  if (platformKey === 'discord') return 10 * 1024 * 1024
  if (platformKey === 'telegram') return 8 * 1024 * 1024
  if (platformKey === 'meta') return 4 * 1024 * 1024
  return null
}

function normalizeBlockerPlatform(value) {
  if (!value) return ''
  const normalized = String(value).trim().toLowerCase()
  if (normalized === 'all') return 'all'
  const map = {
    web: 'web',
    electron: 'electron',
    ios: 'ios',
    android: 'android',
    meta: 'meta',
    'meta instant games': 'meta',
    twitch: 'twitch',
    'twitch extensions': 'twitch',
    crazygames: 'crazygames',
    discord: 'discord',
    'discord activities': 'discord',
    telegram: 'telegram',
    'telegram mini apps': 'telegram',
    steam: 'steam',
  }
  return map[normalized] || normalized
}

function isBundleRiskBlocker(blocker) {
  const id = String(blocker?.id || '').toLowerCase()
  const issue = String(blocker?.issue || '').toLowerCase()
  return id.includes('bundle') || issue.includes('bundle')
}

function shouldSuppressLowRiskBundleBlocker(blocker, bundleByApp) {
  if (!isBundleRiskBlocker(blocker)) return false
  const game = blocker?.game
  if (!game) return false

  const platform = normalizeBlockerPlatform(blocker.platform)
  const limitBytes = getBundleLimitBytes(platform)
  if (!limitBytes) return false

  const totalBytes = bundleByApp?.[game]?.totals?.totalBytes
  if (typeof totalBytes !== 'number') return false

  const utilizationPct = (totalBytes / limitBytes) * 100
  return utilizationPct < 50
}

function createBlockerIndex(blockersData, bundleByApp) {
  const index = new Map()
  for (const blocker of blockersData?.blockers || []) {
    if (blocker.severity !== 'high') continue
    if (blocker.status === 'resolved') continue
    if (shouldSuppressLowRiskBundleBlocker(blocker, bundleByApp)) continue
    const game = blocker.game
    if (!game) continue
    const platform = normalizeBlockerPlatform(blocker.platform)
    const key = `${game}::${platform || 'all'}`
    if (!index.has(key)) {
      index.set(key, [])
    }
    index.get(key).push(blocker)
  }
  return index
}

function findActiveHighBlockers(blockerIndex, game, platform) {
  return [
    ...(blockerIndex.get(`${game}::${platform}`) || []),
    ...(blockerIndex.get(`${game}::all`) || []),
  ]
}

function toPlatformMatrix(sources, blockersData, bundleMetrics) {
  const appStatus = readJson(appStatusPath, { apps: [] })
  const statusById = Object.fromEntries((appStatus.apps || []).map((app) => [app.id, app]))
  const featureMatrix = readJson(featureMatrixPath, { features: {} })
  const platformCatalog = readPlatformRequirements()
  const featureSets = normalizeFeatureMap(featureMatrix)
  const bundleByApp = bundleMetrics?.apps || {}
  const blockerIndex = createBlockerIndex(blockersData, bundleByApp)

  const platforms = Object.keys(platformCatalog.platforms || {})
  const platformDisplayByKey = sources.metadata.platformDisplayByKey || {}

  const matrix = {}
  let complete = 0
  let partial = 0
  let notStarted = 0

  for (const game of sources.games) {
    const app = statusById[game]
    const hasCriticalIssue = Array.isArray(app?.issues)
      ? app.issues.some((issue) => issue?.severity === 'critical')
      : false
    matrix[game] = {}

    for (const platform of platforms) {
      const canonicalPlatform = platformDisplayByKey[platform]
      const sourceCell = canonicalPlatform ? sources.matrix?.[game]?.[canonicalPlatform] : null
      const sourceStatus = sourceCell?.status || 'not-started'
      const limitBytes = getBundleLimitBytes(platform)
      const appBundle = bundleByApp[game]
      const bundleBytes = appBundle?.totals?.totalBytes ?? null
      const utilizationPct =
        limitBytes && bundleBytes !== null
          ? Number(((bundleBytes / limitBytes) * 100).toFixed(1))
          : null
      const bundleAssessment =
        limitBytes && bundleBytes !== null
          ? {
              limitBytes,
              bundleBytes,
              utilizationPct,
              withinLimit: bundleBytes <= limitBytes,
            }
          : null

      const status =
        sourceStatus === 'complete'
          ? 'complete'
          : sourceStatus === 'partial'
            ? 'partial'
            : 'not-started'
      if (status === 'complete') complete += 1
      else if (status === 'partial') partial += 1
      else notStarted += 1

      const activeHighBlockers = findActiveHighBlockers(blockerIndex, game, platform)
      const hasHighBlocker = activeHighBlockers.length > 0
      const basePerformance = (app?.security?.overallScore || 0) >= 70
      const bundleWithinLimit = bundleAssessment ? bundleAssessment.withinLimit : true

      matrix[game][platform] = {
        status,
        appExists: Boolean(app),
        rulesVerified: featureSets.rules.has(game),
        platformAdapter: status !== 'not-started',
        performanceCompliance: basePerformance && bundleWithinLimit,
        uiCompliance:
          app?.promotionCriteria?.qualityGatesPassing === true
            ? true
            : featureSets.responsive.has(game) && featureSets.accessibility.has(game),
        blockersFree: !hasCriticalIssue && !hasHighBlocker,
        completionPercentage: sourceCell?.completion || 0,
        readinessScore: sourceCell?.readinessScore || 0,
        bundleTelemetry: bundleAssessment
          ? {
              totalBytes: bundleAssessment.bundleBytes,
              limitBytes: bundleAssessment.limitBytes,
              utilizationPct: bundleAssessment.utilizationPct,
              withinLimit: bundleAssessment.withinLimit,
            }
          : appBundle
            ? {
                totalBytes: appBundle.totals.totalBytes,
              }
            : null,
        blockerTelemetry: {
          highSeverityActive: hasHighBlocker,
          activeHighBlockerIds: activeHighBlockers.map((blocker) => blocker.id),
        },
        requirementsCoverage: {
          required: sourceCell?.requirementsCoverage?.required || 0,
          met: sourceCell?.requirementsCoverage?.met || 0,
          missingRequirements: sourceCell?.requirementsCoverage?.missingRequirements || [],
        },
        notes:
          status === 'not-started'
            ? 'No platform requirements currently met'
            : status === 'partial'
              ? 'Partially meets platform inspection requirements'
              : 'Meets platform inspection requirements',
      }
    }
  }

  const totalCells = sources.games.length * platforms.length
  return {
    metadata: {
      version: '2.0.0',
      generatedAt: new Date().toISOString(),
      description: 'Platform x Game Coverage Matrix (derived from app-status canonical source)',
      totalCells,
      games: sources.games.length,
      platforms: platforms.length,
      completionPercentage:
        totalCells === 0 ? 0 : Number((((complete + partial * 0.5) / totalCells) * 100).toFixed(1)),
      canonicalSource: 'compliance/app-status.json',
      requirementsSource: 'scripts/config/platform-requirements.json',
      bundleMetricsSource: 'compliance/bundle-metrics.json',
    },
    games: sources.games,
    platforms,
    matrix,
    summary: {
      complete,
      partial,
      notStarted,
    },
  }
}

function buildPlatformGapAnalysis(sources, matrixProjection) {
  const platformDisplayByKey = sources.metadata.platformDisplayByKey || {}
  const platformKeys = matrixProjection.platforms || []
  const analysis = {}

  for (const platformKey of platformKeys) {
    const displayName = platformDisplayByKey[platformKey] || platformKey
    let complete = 0
    let partial = 0
    let notStarted = 0
    let readinessTotal = 0
    const missingFrequency = new Map()

    for (const game of sources.games) {
      const cell = matrixProjection.matrix?.[game]?.[platformKey]
      if (!cell) continue
      if (cell.status === 'complete') complete += 1
      else if (cell.status === 'partial') partial += 1
      else notStarted += 1
      readinessTotal += Number(cell.readinessScore || 0)
      for (const req of cell.requirementsCoverage?.missingRequirements || []) {
        const key = req.id || req.label
        const current = missingFrequency.get(key)
        if (current) current.count += 1
        else missingFrequency.set(key, { id: req.id, label: req.label, count: 1 })
      }
    }

    const total = sources.games.length
    const topMissing = [...missingFrequency.values()].sort((a, b) => b.count - a.count).slice(0, 10)
    analysis[platformKey] = {
      displayName,
      totalApps: total,
      complete,
      partial,
      notStarted,
      completionPercentage: total === 0 ? 0 : Number(((complete / total) * 100).toFixed(1)),
      avgReadinessScore: total === 0 ? 0 : Number((readinessTotal / total).toFixed(1)),
      topMissingRequirements: topMissing,
    }
  }

  return {
    metadata: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      canonicalSource: 'compliance/app-status.json',
      requirementsSource: 'scripts/config/platform-requirements.json',
      notes: [
        "Platform key 'twitch' maps to Twitch Extensions.",
        'This report emphasizes inspection readiness by concrete requirement coverage.',
      ],
    },
    platforms: analysis,
  }
}

function generateComplianceData() {
  console.log('Generating compliance data...')
  const blockersData = readJson(blockersPath, { blockers: [] })
  const bundleMetrics = readJson(bundleMetricsPath, { apps: {} })
  const sources = buildSourcesData()
  const platformRequirementsCatalog = buildPlatformRequirementsCatalog(readPlatformRequirements())
  const semanticActions = generateSemanticActionsReport()
  fs.writeFileSync(sourcesPath, JSON.stringify(sources, null, 2))
  const matrixProjection = toPlatformMatrix(sources, blockersData, bundleMetrics)
  fs.writeFileSync(matrixPath, JSON.stringify(matrixProjection, null, 2))
  const platformGapAnalysis = buildPlatformGapAnalysis(sources, matrixProjection)
  fs.writeFileSync(platformGapAnalysisPath, JSON.stringify(platformGapAnalysis, null, 2))
  fs.writeFileSync(
    platformRequirementsCatalogPath,
    JSON.stringify(platformRequirementsCatalog, null, 2),
  )
  fs.writeFileSync(semanticActionsPath, JSON.stringify(semanticActions, null, 2))
  const sharedCoverageResult = spawnSync(process.execPath, [sharedPackageCoverageScriptPath], {
    cwd: rootDir,
    stdio: 'inherit',
  })
  if ((sharedCoverageResult.status ?? 1) !== 0) {
    throw new Error('Failed to generate shared-package-coverage.json')
  }
  console.log(
    `Generated sources.json (${sources.metadata.gameCount} games x ${sources.metadata.platformCount} platforms)`,
  )
  console.log(`Generated matrix.json projection (${matrixProjection.metadata.totalCells} cells)`)
  console.log(
    `Generated platform-gap-analysis.json (${Object.keys(platformGapAnalysis.platforms).length} platforms)`,
  )
  console.log(
    `Generated platform-requirements-catalog.json (${Object.keys(platformRequirementsCatalog.platforms).length} platforms)`,
  )
  console.log(`Generated semantic-actions.json (${semanticActions.summary.total} workflow checks)`)
  console.log(`Coverage: ${sources.metadata.coverage}%`)
  console.log(`Progress: ${sources.metadata.progress}%`)
}

generateComplianceData()
