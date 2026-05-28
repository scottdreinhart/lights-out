#!/usr/bin/env node

/**
 * Auto-generate APP_FEATURE_MATRIX.md status sections from app-status.json
 *
 * Usage:
 *   node scripts/update-feature-matrix.mjs
 *
 * This script:
 * 1. Reads compliance/app-status.json
 * 2. Generates dynamic sections with current metrics
 * 3. Updates APP_FEATURE_MATRIX.md (preserves other sections)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const STATUS_FILE = path.join(ROOT, 'compliance', 'app-status.json')
const MATRIX_FILE = path.join(ROOT, 'APP_FEATURE_MATRIX.md')

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  BLUE: '\x1b[94m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

let data = {}
try {
  data = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf-8'))
  console.log(`${COLORS.GREEN}✅ Loaded app-status.json${COLORS.RESET}`)
} catch {
  console.error(`${COLORS.RED}${COLORS.BOLD}❌ app-status.json not found${COLORS.RESET}`)
  console.error(`${COLORS.RED}   Run: node scripts/audit-app-status.mjs${COLORS.RESET}`)
  process.exit(1)
}

const apps = data.apps || []
const summary = data.summary || {}
const metadata = data.metadata || {}

function generateMetricsTable() {
  const total = metadata.totalApps || apps.length
  const getPercent = (val) => Math.round((val / total) * 100)
  const getStatus = (val, target) => {
    if (val === 0) return '🔴'
    if (val < target * 0.5) return '🔴'
    if (val < target) return '🟡'
    return '🟢'
  }

  return `### Global Platform Metrics

**Generated**: \`node scripts/audit-app-status.mjs\` | **Data**: \`compliance/app-status.json\`

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| **Apps by Tier** |
| · Template | ${summary.byTier?.template || 0} | 0 | ${getStatus(summary.byTier?.template || 0, 0)} Need migration |
| · Web-Complete | ${summary.byTier?.webComplete || 0} | ${total * 0.8} | ${getStatus(summary.byTier?.webComplete || 0, total * 0.8)} |
| · Platform-Complete | ${summary.byTier?.platformComplete || 0} | ${total * 0.6} | ${getStatus(summary.byTier?.platformComplete || 0, total * 0.6)} |
| · Production-Ready | ${summary.byTier?.productionReady || 0} | ${total * 0.25} | ${getStatus(summary.byTier?.productionReady || 0, total * 0.25)} |
| **Security** |
| · Average Score | ${summary.securityScore?.average || 0}/100 | 70/100 | ${summary.securityScore?.average >= 70 ? '🟢' : summary.securityScore?.average >= 50 ? '🟡' : '🔴'} |
| · Critical Issues | ${summary.securityScore?.criticalIssues || 0} | 0 | ${summary.securityScore?.criticalIssues === 0 ? '🟢' : '🔴'} URGENT |
| · Validators Adopted | ${apps.filter((a) => a.security.validators).length}/${total} | ${total}/${total} | ${getStatus(apps.filter((a) => a.security.validators).length, total)} \`${getPercent(apps.filter((a) => a.security.validators).length)}%\` |
| · Sanitizers Adopted | ${apps.filter((a) => a.security.sanitizers).length}/${total} | ${total}/${total} | ${getStatus(apps.filter((a) => a.security.sanitizers).length, total)} \`${getPercent(apps.filter((a) => a.security.sanitizers).length)}%\` |
| **Testing** |
| · Apps with Tests | ${summary.testingCoverage?.appsWithTests || 0}/${total} | ${total}/${total} | ${getStatus(summary.testingCoverage?.appsWithTests || 0, total)} \`${getPercent(summary.testingCoverage?.appsWithTests || 0)}%\` |
| · Apps with setup.ts | ${apps.filter((a) => a.testing.hasSetupFile).length}/${total} | ${total}/${total} | ${getStatus(apps.filter((a) => a.testing.hasSetupFile).length, total)} \`${getPercent(apps.filter((a) => a.testing.hasSetupFile).length)}%\` |
| · Security Tests | ${summary.testingCoverage?.appsWithSecurityTests || 0}/${total} | ${total}/${total} | ${getStatus(summary.testingCoverage?.appsWithSecurityTests || 0, total)} \`${getPercent(summary.testingCoverage?.appsWithSecurityTests || 0)}%\` |
| · E2E Tests | ${summary.testingCoverage?.appsWithE2E || 0}/${total} | ${Math.floor(total * 0.6)}/${total} | ${getStatus(summary.testingCoverage?.appsWithE2E || 0, total * 0.6)} \`${getPercent(summary.testingCoverage?.appsWithE2E || 0)}%\` |
| **Governance** |
| · TypeScript Strict | ${apps.filter((a) => a.security.strictTypeScript).length}/${total} | ${total}/${total} | ${getStatus(apps.filter((a) => a.security.strictTypeScript).length, total)} \`${getPercent(apps.filter((a) => a.security.strictTypeScript).length)}%\` |
| · Ready for Promotion | ${summary.promotionReadiness?.readyForPromotion || 0}/${total} | ${Math.floor(total * 0.25)}/${total} | ${getStatus(summary.promotionReadiness?.readyForPromotion || 0, total * 0.25)} \`${getPercent(summary.promotionReadiness?.readyForPromotion || 0)}%\` |`
}

function generatePhase2Progress() {
  const tiers = [
    {
      name: 'Tier 1 (High Priority)',
      apps: apps.filter((a) => a.maturityTier === 'web-complete').slice(0, 4),
    },
    {
      name: 'Tier 2 (Medium Priority)',
      apps: apps.filter((a) => a.maturityTier === 'web-complete').slice(4, 8),
    },
    {
      name: 'Tier 3 (Platform-Complete)',
      apps: apps.filter((a) => a.maturityTier === 'platform-complete'),
    },
    { name: 'Tier 4 (Template)', apps: apps.filter((a) => a.maturityTier === 'template') },
  ]

  let output = `### Phase 2 Testing Rollout Progress

**Target**: Add \`src/__tests__/setup.ts\` to all apps + security tests

| Tier | Apps | With Tests | % | Status |
|------|------|-----------|---|--------|`

  const totalApps = apps.length
  let totalWithTests = 0

  tiers.forEach((tier) => {
    const count = tier.apps.length
    const withTests = tier.apps.filter(
      (a) => a.testing.hasSetupFile && a.testing.totalTests > 0,
    ).length
    totalWithTests += withTests
    const pct = count > 0 ? Math.round((withTests / count) * 100) : 0
    const status = pct === 0 ? '🔴' : pct < 50 ? '🟡' : '🟢'
    output += `\n| ${tier.name} | ${count} | ${withTests} | ${pct}% | ${status} |`
  })

  output += `\n| **TOTAL** | ${totalApps} | ${totalWithTests} | ${Math.round((totalWithTests / totalApps) * 100)}% | ${totalWithTests === 0 ? '🔴' : totalWithTests < totalApps / 2 ? '🟡' : '🟢'} |`

  return output
}

function generateReadyForPromotion() {
  const ready = apps.filter((a) => a.readyForPromotion)
  const notReady = apps.filter((a) => !a.readyForPromotion)

  let output = `### Apps Ready for Promotion

**Requirements**: Security baseline ✅ + Testing setup ✅ + Shared modules ✅ + Quality gates ✅ + Audit clean ✅

**Currently Ready**: ${ready.length}/${apps.length} apps

${
  ready.length > 0
    ? `#### ✅ Ready (${ready.length})
${ready.map((a) => `- **${a.name}** — ${a.maturityTier}`).join('\n')}
`
    : ''
}

#### 🚀 Top Candidates (Closest to Completion)
${notReady
  .slice(0, 5)
  .map((app, i) => {
    const completionRate =
      (((app.promotionCriteria.securityBaselineImplemented ? 1 : 0) +
        (app.promotionCriteria.testingSetupComplete ? 1 : 0) +
        (app.promotionCriteria.sharedModulesAdopted ? 1 : 0) +
        (app.promotionCriteria.qualityGatesPassing ? 1 : 0) +
        (app.promotionCriteria.securityAuditPassing ? 1 : 0)) /
        5) *
      100
    return `${i + 1}. **${app.name}** — ${Math.round(completionRate)}% ready (needs: ${[
      !app.promotionCriteria.securityBaselineImplemented ? 'security baseline' : '',
      !app.promotionCriteria.testingSetupComplete ? 'tests' : '',
      !app.promotionCriteria.sharedModulesAdopted ? 'modules' : '',
    ]
      .filter(Boolean)
      .join(', ')})`
  })
  .join('\n')}
`

  return output
}

function generateSecurityModuleAdoption() {
  const modules = {
    validators: apps.filter((a) => a.security.validators),
    sanitizers: apps.filter((a) => a.security.sanitizers),
    config: apps.filter((a) => a.security.config),
    apiClient: apps.filter((a) => a.security.apiClient),
    logger: apps.filter((a) => a.security.logger),
  }

  return `### Security Module Adoption Matrix

| Module | Adopted | % | Priority |
|--------|---------|---|----------|
| **Input Validators** | ${modules.validators.length}/${apps.length} | ${Math.round((modules.validators.length / apps.length) * 100)}% | ${modules.validators.length < apps.length * 0.3 ? '🔴 CRITICAL' : modules.validators.length < apps.length * 0.7 ? '🟡 HIGH' : '🟢'} |
| **HTML Sanitizers** | ${modules.sanitizers.length}/${apps.length} | ${Math.round((modules.sanitizers.length / apps.length) * 100)}% | ${modules.sanitizers.length < apps.length * 0.3 ? '🔴 CRITICAL' : modules.sanitizers.length < apps.length * 0.7 ? '🟡 HIGH' : '🟢'} |
| **Env Config** | ${modules.config.length}/${apps.length} | ${Math.round((modules.config.length / apps.length) * 100)}% | ${modules.config.length < apps.length * 0.5 ? '🟡 HIGH' : '🟢'} |
| **API Client** | ${modules.apiClient.length}/${apps.length} | ${Math.round((modules.apiClient.length / apps.length) * 100)}% | 🟡 MEDIUM |
| **Logger** | ${modules.logger.length}/${apps.length} | ${Math.round((modules.logger.length / apps.length) * 100)}% | 🟡 MEDIUM |`
}

function updateMatrixFile() {
  let content = fs.readFileSync(MATRIX_FILE, 'utf-8')

  // Find and replace the metrics section
  const metricsStart = content.indexOf('### Global Platform Metrics')
  const metricsEnd = content.indexOf('\n### Tier Distribution', metricsStart)

  if (metricsStart !== -1 && metricsEnd !== -1) {
    content =
      content.slice(0, metricsStart) + generateMetricsTable() + '\n' + content.slice(metricsEnd)
    console.log('✅ Updated metrics section')
  }

  // Update phase 2 progress
  const phase2Start = content.indexOf('### Phase 2 Testing Rollout Progress')
  const phase2End = content.indexOf('\n### Apps Ready', phase2Start)

  if (phase2Start !== -1 && phase2End !== -1) {
    content =
      content.slice(0, phase2Start) + generatePhase2Progress() + '\n' + content.slice(phase2End)
    console.log('✅ Updated Phase 2 progress')
  }

  // Update apps ready for promotion
  const readyStart = content.indexOf('### Apps Ready for Promotion')
  const readyEnd = content.indexOf('\n### Security Module', readyStart)

  if (readyStart !== -1 && readyEnd !== -1) {
    content =
      content.slice(0, readyStart) + generateReadyForPromotion() + '\n' + content.slice(readyEnd)
    console.log('✅ Updated promotion readiness')
  }

  // Update security module adoption
  const moduleStart = content.indexOf('### Security Module Adoption Matrix')
  const moduleEnd = content.indexOf('\n---', moduleStart)

  if (moduleStart !== -1 && moduleEnd !== -1) {
    content =
      content.slice(0, moduleStart) +
      generateSecurityModuleAdoption() +
      '\n' +
      content.slice(moduleEnd)
    console.log('✅ Updated security module adoption')
  }

  fs.writeFileSync(MATRIX_FILE, content)
  console.log('✅ APP_FEATURE_MATRIX.md updated!')
}

console.log('🔄 Updating APP_FEATURE_MATRIX.md...')
updateMatrixFile()
console.log(`\n✨ Done! View: ${MATRIX_FILE}`)
