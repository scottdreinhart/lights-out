#!/usr/bin/env node

/**
 * Generate human-readable reports from app-status.json
 * 
 * Usage:
 *   node scripts/status-report.mjs                    # Summary report
 *   node scripts/status-report.mjs --detailed          # Detailed report
 *   node scripts/status-report.mjs --tier web-complete # Filter by tier
 *   node scripts/status-report.mjs --format csv        # Export as CSV
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const STATUS_FILE = path.join(ROOT, 'compliance', 'app-status.json')

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  WHITE: '\x1b[97m',
  BLUE: '\x1b[94m',
  MAGENTA: '\x1b[95m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

/**
 * Standardized boxed header for terminal output
 */
function boxedHeader(title, color = COLORS.BLUE) {
  const width = 80
  const horizontalLine = '═'.repeat(width - 2)
  
  console.log(`\n${COLORS.WHITE}╔${horizontalLine}╗${COLORS.RESET}`)
  
  const paddingTotal = width - 2 - title.length
  const paddingLeft = Math.floor(paddingTotal / 2)
  const paddingRight = paddingTotal - paddingLeft
  
  console.log(`${COLORS.WHITE}║${' '.repeat(paddingLeft)}${COLORS.BOLD}${color}${title}${COLORS.RESET}${COLORS.WHITE}${' '.repeat(paddingRight)}║${COLORS.RESET}`)
  console.log(`${COLORS.WHITE}╚${horizontalLine}╝${COLORS.RESET}\n`)
}

const args = process.argv.slice(2)
const detailed = args.includes('--detailed')
const tierFilter = args.find(a => a.startsWith('--tier='))?.split('=')[1]
const format = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'text'

let data = {}
try {
  data = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf-8'))
} catch {
  console.error(`${COLORS.RED}${COLORS.BOLD}❌ app-status.json not found or invalid${COLORS.RESET}`)
  console.error(`${COLORS.RED}   Run: node scripts/audit-app-status.mjs${COLORS.RESET}`)
  process.exit(1)
}

const apps = data.apps || []
const summary = data.summary || {}

function filterApps() {
  return tierFilter ? apps.filter(a => a.maturityTier === tierFilter) : apps
}

function formatPercent(value, total) {
  return `${Math.round((value / total) * 100)}%`
}

function reportText() {
  const filtered = filterApps()
  boxedHeader('GAME PLATFORM APP STATUS REPORT', COLORS.MAGENTA)
  console.log(`Generated: ${new Date().toISOString().split('T')[0]}`)

  console.log(`\n📊 DISTRIBUTION BY TIER`)
${'═'.repeat(60)}
  Template:              ${String(summary.byTier?.template || 0).padStart(2)} apps  ${formatPercent(summary.byTier?.template || 0, data.metadata?.totalApps || 1).padStart(4)}
  Web-Complete:         ${String(summary.byTier?.webComplete || 0).padStart(2)} apps  ${formatPercent(summary.byTier?.webComplete || 0, data.metadata?.totalApps || 1).padStart(4)}
  Platform-Complete:    ${String(summary.byTier?.platformComplete || 0).padStart(2)} apps  ${formatPercent(summary.byTier?.platformComplete || 0, data.metadata?.totalApps || 1).padStart(4)}
  Production-Ready:     ${String(summary.byTier?.productionReady || 0).padStart(2)} apps  ${formatPercent(summary.byTier?.productionReady || 0, data.metadata?.totalApps || 1).padStart(4)}

🔒 SECURITY BASELINE
${'═'.repeat(60)}
  Average Score:        ${String(summary.securityScore?.average || 0).padStart(3)}/100
  Critical Issues:      ${String(summary.securityScore?.criticalIssues || 0).padStart(2)} ${summary.securityScore?.criticalIssues > 0 ? '⚠️ URGENT' : '✅'}
  
  Module Adoption:
    • Input Validators:   ${formatPercent(filtered.reduce((n, a) => n + (a.security.validators ? 1 : 0), 0), filtered.length)}
    • HTML Sanitizers:    ${formatPercent(filtered.reduce((n, a) => n + (a.security.sanitizers ? 1 : 0), 0), filtered.length)}
    • Env Config:         ${formatPercent(filtered.reduce((n, a) => n + (a.security.config ? 1 : 0), 0), filtered.length)}
    • API Client:         ${formatPercent(filtered.reduce((n, a) => n + (a.security.apiClient ? 1 : 0), 0), filtered.length)}
    • Logger:             ${formatPercent(filtered.reduce((n, a) => n + (a.security.logger ? 1 : 0), 0), filtered.length)}

🧪 TESTING COVERAGE
${'═'.repeat(60)}
  Apps with Tests:      ${summary.testingCoverage?.appsWithTests || 0}/${data.metadata?.totalApps || 0}  ${formatPercent(summary.testingCoverage?.appsWithTests || 0, data.metadata?.totalApps || 1)}
  With setup.ts:        ${filtered.reduce((n, a) => n + (a.testing.hasSetupFile ? 1 : 0), 0)}/${filtered.length}  ${formatPercent(filtered.reduce((n, a) => n + (a.testing.hasSetupFile ? 1 : 0), 0), filtered.length)}
  With Security Tests:  ${summary.testingCoverage?.appsWithSecurityTests || 0}/${data.metadata?.totalApps || 0}  ${formatPercent(summary.testingCoverage?.appsWithSecurityTests || 0, data.metadata?.totalApps || 1)}
  With E2E Tests:       ${summary.testingCoverage?.appsWithE2E || 0}/${data.metadata?.totalApps || 0}  ${formatPercent(summary.testingCoverage?.appsWithE2E || 0, data.metadata?.totalApps || 1)}

✨ PROMOTION READINESS
${'═'.repeat(60)}
  Ready for Promotion:  ${summary.promotionReadiness?.readyForPromotion || 0}/${data.metadata?.totalApps || 0}  ${formatPercent(summary.promotionReadiness?.readyForPromotion || 0, data.metadata?.totalApps || 1)}
  By Tier:
    • Web-Complete →
      Platform-Complete: ${summary.promotionReadiness?.readyByTier?.webComplete || 0} apps ready
    • Platform-Complete →
      Production-Ready:  ${summary.promotionReadiness?.readyByTier?.platformComplete || 0} apps ready

${detailed ? reportDetailed(filtered) : ''}
`)
}

function reportDetailed(filtered) {
  let output = `
📋 DETAILED APP STATUS
${'═'.repeat(60)}
`
  filtered.forEach(app => {
    const issues = app.issues.length > 0 
      ? `\n    Issues: ${app.issues.map(i => `${i.severity.toUpperCase()} - ${i.message}`).join('\n             ')}`
      : ''
    
    output += `
${app.name}
  Tier:                 ${app.maturityTier}
  Security:             ${app.security.overallScore}/100 ${app.security.overallScore >= 70 ? '✅' : '⚠️'}
  Testing:              ${app.testing.totalTests} tests ${app.testing.hasSetupFile ? '✅' : '❌'}
  Infrastructure:       ${Object.values(app.infrastructure).filter(Boolean).length}/9 ✓
  Ready for Promotion:  ${app.readyForPromotion ? '✅ YES' : '❌ NO'}${issues}
`
  })
  
  return output
}

function reportCSV(filtered) {
  const header = 'Name,Tier,Security Score,Tests,Infrastructure,Ready,Issues'
  const rows = filtered.map(app => 
    `"${app.name}",${app.maturityTier},${app.security.overallScore},${app.testing.totalTests},${Object.values(app.infrastructure).filter(Boolean).length},${app.readyForPromotion ? 'Yes' : 'No'},"${app.issues.map(i => i.message).join('; ')}"`
  )
  return [header, ...rows].join('\n')
}

if (format === 'csv') {
  console.log(reportCSV(filterApps()))
} else {
  reportText()
}

console.log(`\n💾 Data source: ${STATUS_FILE}`)
console.log(`🔄 To refresh: node scripts/audit-app-status.mjs\n`)
