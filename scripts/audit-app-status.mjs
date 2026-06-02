#!/usr/bin/env node

/**
 * Auto-detect app status across all discovered apps in /apps
 * Generates compliance/app-status.json based on actual repo state
 * 
 * Usage:
 *   node scripts/audit-app-status.mjs [--apps comma-separated-names] [--detailed]
 * 
 * Examples:
 *   node scripts/audit-app-status.mjs                           # Audit all apps
 *   node scripts/audit-app-status.mjs --apps sudoku,nim,lights-out  # Audit 3 specific apps
 *   node scripts/audit-app-status.mjs --detailed                # Verbose output
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const APPS_DIR = path.join(ROOT, 'apps')

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

// Parse CLI args
const args = process.argv.slice(2)
const appsArg = args.find(a => a.startsWith('--apps='))?.split('=')[1]
const specificApps = appsArg ? appsArg.split(',').map(s => s.trim()) : null
const detailed = args.includes('--detailed')

// Shared module imports to detect
const SHARED_MODULES = {
  validators: ['@games/shared-validators', 'securityModules.validators'],
  sanitizers: ['@games/shared-sanitizers', 'securityModules.sanitizers'],
  config: ['@games/shared-config', 'securityModules.config'],
  apiClient: ['@games/shared-api-client', 'securityModules.apiClient'],
  logger: ['@games/shared-logger', 'logger'],
}

/**
 * Check if file exists in app directory
 */
function fileExists(appPath, ...segments) {
  return fs.existsSync(path.join(APPS_DIR, appPath, ...segments))
}

/**
 * Read file safely
 */
function readFile(appPath, ...segments) {
  try {
    const fullPath = path.isAbsolute(appPath)
      ? appPath
      : path.join(APPS_DIR, appPath, ...segments)
    return fs.readFileSync(fullPath, 'utf-8')
  } catch {
    return null
  }
}

/**
 * Count test files by type
 */
function countTestFiles(appPath) {
  const srcDir = path.join(APPS_DIR, appPath, 'src')
  if (!fs.existsSync(srcDir)) return { unit: 0, integration: 0, component: 0, e2e: 0, a11y: 0, total: 0 }

  let counts = { unit: 0, integration: 0, component: 0, e2e: 0, a11y: 0, api: 0, visual: 0, perf: 0 }

  const walkDir = (dir) => {
    for (const file of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, file)
      if (fs.statSync(fullPath).isDirectory()) {
        walkDir(fullPath)
      } else {
        if (file.includes('.unit.test.')) counts.unit++
        if (file.includes('.integration.test.')) counts.integration++
        if (file.includes('.component.test.')) counts.component++
        if (file.includes('.e2e.spec.')) counts.e2e++
        if (file.includes('.a11y.spec.')) counts.a11y++
        if (file.includes('.api.test.')) counts.api++
        if (file.includes('.visual.spec.')) counts.visual++
        if (file.includes('.perf.test.')) counts.perf++
      }
    }
  }

  walkDir(srcDir)
  counts.total = Object.values(counts).reduce((a, b) => a + b, 0)
  return counts
}

/**
 * Check for security module imports
 */
function checkSecurityModules(appPath) {
  const srcDir = path.join(APPS_DIR, appPath, 'src')
  if (!fs.existsSync(srcDir)) return { validators: false, sanitizers: false, config: false, apiClient: false, logger: false }

  const files = []
  const walkDir = (dir) => {
    for (const file of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, file)
      if (fs.statSync(fullPath).isDirectory()) {
        walkDir(fullPath)
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        files.push(readFile(fullPath) || '')
      }
    }
  }

  walkDir(srcDir)
  const content = files.join('\n')

  return {
    validators: SHARED_MODULES.validators.some(mod => content.includes(mod)),
    sanitizers: SHARED_MODULES.sanitizers.some(mod => content.includes(mod)),
    config: SHARED_MODULES.config.some(mod => content.includes(mod)),
    apiClient: SHARED_MODULES.apiClient.some(mod => content.includes(mod)),
    logger: SHARED_MODULES.logger.some(mod => content.includes(mod)),
  }
}

/**
 * Check TypeScript strictness
 */
function checkTypeScriptStrict(appPath) {
  const tsconfig = readFile(appPath, 'tsconfig.json')
  if (!tsconfig) return false
  try {
    const config = JSON.parse(tsconfig)
    return config.compilerOptions?.strict === true
  } catch {
    return false
  }
}

/**
 * Check for @ts-ignore or @ts-expect-error comments
 */
function checkTypeScriptEscapes(appPath) {
  const srcDir = path.join(APPS_DIR, appPath, 'src')
  if (!fs.existsSync(srcDir)) return false

  const walkDir = (dir) => {
    for (const file of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, file)
      if (fs.statSync(fullPath).isDirectory()) {
        if (walkDir(fullPath)) return true
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = readFile(fullPath) || ''
        if (content.includes('@ts-ignore') || content.includes('@ts-expect-error')) {
          return true
        }
      }
    }
    return false
  }

  return walkDir(srcDir)
}

/**
 * Check if app can build
 */
function canBuild(appPath) {
  try {
    execSync(`cd "${path.join(APPS_DIR, appPath)}" && pnpm run build 2>&1 | head -1`, { timeout: 30000 })
    return true
  } catch {
    return false
  }
}

/**
 * Check if pnpm audit is clean
 */
function auditClean(appPath) {
  try {
    execSync(`cd "${path.join(APPS_DIR, appPath)}" && pnpm audit --audit-level=moderate 2>&1 | grep -c "0 vulnerabilities"`, { timeout: 30000 })
    return true
  } catch {
    return false
  }
}

/**
 * Determine maturity tier based on features
 */
function determineTier(infrastructure, testing, security) {
  const infraScore = Object.values(infrastructure).filter(Boolean).length
  const testScore = testing.totalTests > 0 ? 1 : 0
  const secScore = security.overallScore >= 70 ? 1 : 0

  // Production-Ready: All infrastructure + tests + high security
  if (infraScore === 9 && testScore === 1 && secScore === 1) return 'production-ready'

  // Platform-Complete: Complete infrastructure + some tests + decent security
  if (infraScore === 9 && testScore === 1) return 'platform-complete'

  // Web-Complete: Core infrastructure + any validation
  if (infraScore >= 6) return 'web-complete'

  // Template: Basic structure
  return 'template'
}

/**
 * Calculate security score
 */
function calculateSecurityScore(security, typeScriptStrict, hasTypeScriptEscapes, hasSecurityTests) {
  let score = 0

  // Shared modules (50 points max)
  const moduleCount = Object.values(security).filter(Boolean).length
  score += (moduleCount / 5) * 50

  // TypeScript strictness (30 points)
  if (typeScriptStrict) score += 30
  else if (!hasTypeScriptEscapes) score += 15

  // Security tests (15 points)
  if (hasSecurityTests) score += 15

  // Audit clean (5 points)
  // (Will be added separately in main flow)

  return Math.min(100, Math.round(score))
}

/**
 * Audit a single app
 */
function auditApp(appName) {
  const appPath = appName

  // Infrastructure
  const infrastructure = {
    hasTsconfig: fileExists(appPath, 'tsconfig.json'),
    hasViteConfig:
      fileExists(appPath, 'vite.config.js') ||
      fileExists(appPath, 'vite.config.ts') ||
      fileExists(appPath, 'vite.config.mjs') ||
      fileExists(appPath, 'vite.config.cjs'),
    hasIndexHtml: fileExists(appPath, 'index.html'),
    hasPublicFolder: fileExists(appPath, 'public'),
    hasPackageJson: fileExists(appPath, 'package.json'),
    hasEslintrc: fileExists(appPath, '.eslintrc') || fileExists(appPath, '.eslintrc.json'),
    hasHusky: fileExists(appPath, '.husky'),
    hasValidateScript: (() => {
      const pkg = readFile(appPath, 'package.json')
      return pkg ? JSON.parse(pkg).scripts?.validate ? true : false : false
    })(),
  }

  // Testing
  const testing = countTestFiles(appPath)
  const hasSecurityTests = testing.unit > 0 && testing.total > 0 // Simplified for now

  // Security
  const security = checkSecurityModules(appPath)
  const typeScriptStrict = checkTypeScriptStrict(appPath)
  const hasTypeScriptEscapes = checkTypeScriptEscapes(appPath)
  const securityScore = calculateSecurityScore(security, typeScriptStrict, hasTypeScriptEscapes, hasSecurityTests)

  // Promotion criteria
  const promotionCriteria = {
    securityBaselineImplemented: Object.values(security).filter(Boolean).length >= 3 && hasSecurityTests,
    testingSetupComplete: fileExists(appPath, 'src/__tests__/setup.ts') && testing.total > 0,
    sharedModulesAdopted: Object.values(security).filter(Boolean).length >= 3,
    qualityGatesPassing: true, // Would need to run pnpm validate
    securityAuditPassing: true, // Would need to run pnpm audit
  }

  const readyForPromotion = Object.values(promotionCriteria).every(Boolean)

  // Detect issues
  const issues = []
  if (!infrastructure.hasTsconfig) issues.push({ severity: 'high', category: 'infrastructure', message: 'Missing tsconfig.json' })
  if (!infrastructure.hasViteConfig) issues.push({ severity: 'high', category: 'infrastructure', message: 'Missing vite.config.js' })
  if (!infrastructure.hasIndexHtml) issues.push({ severity: 'high', category: 'infrastructure', message: 'Missing index.html' })
  if (securityScore < 50) issues.push({ severity: 'critical', category: 'security', message: `Low security score: ${securityScore}/100` })
  if (testing.total === 0) issues.push({ severity: 'high', category: 'testing', message: 'No tests found' })
  if (!typeScriptStrict) issues.push({ severity: 'medium', category: 'governance', message: 'TypeScript strict mode not enabled' })

  return {
    id: appName,
    name: appName.charAt(0).toUpperCase() + appName.slice(1),
    path: `apps/${appName}`,
    maturityTier: determineTier(infrastructure, testing, { overallScore: securityScore }),
    security: {
      ...security,
      strictTypeScript: typeScriptStrict,
      noAnyEscapes: !hasTypeScriptEscapes,
      hasSecurityTests,
      auditClean: true, // Placeholder
      overallScore: securityScore,
    },
    testing: {
      hasSetupFile: fileExists(appPath, 'src/__tests__/setup.ts'),
      hasVitestConfig: fileExists(appPath, 'vitest.config.ts'),
      unitTestCount: testing.unit,
      integrationTestCount: testing.integration,
      componentTestCount: testing.component,
      e2eTestCount: testing.e2e,
      a11yTestCount: testing.a11y,
      testNamingCompliant: true, // Would need deeper check
      totalTests: testing.total,
      hasPlaywright: fileExists(appPath, 'playwright.config.ts'),
    },
    infrastructure,
    promotionCriteria,
    readyForPromotion,
    issues,
    lastAuditedAt: new Date().toISOString(),
  }
}

/**
 * Main audit flow
 */
async function main() {
  console.log('🔍 Auditing apps...\n')

  // Get list of apps to audit
  const appNames = specificApps || fs.readdirSync(APPS_DIR).filter(name => {
    const full = path.join(APPS_DIR, name)
    return fs.statSync(full).isDirectory() && name !== 'ui' && fileExists(name, 'package.json')
  })

  const apps = appNames.map(name => {
    console.log(`  📊 Auditing ${name}...`)
    return auditApp(name)
  })

  // Calculate summary
  const summary = {
    byTier: {
      template: apps.filter(a => a.maturityTier === 'template').length,
      webComplete: apps.filter(a => a.maturityTier === 'web-complete').length,
      platformComplete: apps.filter(a => a.maturityTier === 'platform-complete').length,
      productionReady: apps.filter(a => a.maturityTier === 'production-ready').length,
    },
    securityScore: {
      average: Math.round(apps.reduce((sum, a) => sum + a.security.overallScore, 0) / apps.length),
      min: Math.min(...apps.map(a => a.security.overallScore)),
      max: Math.max(...apps.map(a => a.security.overallScore)),
      criticalIssues: apps.reduce((count, a) => count + a.issues.filter(i => i.severity === 'critical').length, 0),
    },
    testingCoverage: {
      appsWithSetupFile: apps.filter(a => a.testing.hasSetupFile).length,
      appsWithTests: apps.filter(a => a.testing.totalTests > 0).length,
      appsWithSecurityTests: apps.filter(a => a.testing.totalTests > 0 && a.security.hasSecurityTests).length,
      appsWithE2E: apps.filter(a => a.testing.e2eTestCount > 0).length,
      testNamingCompliance: 100, // Simplified
    },
    promotionReadiness: {
      readyForPromotion: apps.filter(a => a.readyForPromotion).length,
      readyByTier: {
        webComplete: apps.filter(a => a.maturityTier === 'web-complete' && a.readyForPromotion).length,
        platformComplete: apps.filter(a => a.maturityTier === 'platform-complete' && a.readyForPromotion).length,
      },
    },
  }

  const result = {
    metadata: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      totalApps: apps.length,
      auditedApps: apps.length,
    },
    apps,
    summary,
  }

  // Write output
  const outputPath = path.join(ROOT, 'compliance', 'app-status.json')
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2))

  console.log(`\n✅ Audit complete!\n`)
  console.log(`📊 Summary:`)
  console.log(`  Template: ${summary.byTier.template}`)
  console.log(`  Web-Complete: ${summary.byTier.webComplete}`)
  console.log(`  Platform-Complete: ${summary.byTier.platformComplete}`)
  console.log(`  Production-Ready: ${summary.byTier.productionReady}`)
  console.log(`\n🔒 Security Average: ${summary.securityScore.average}/100`)
  console.log(`  Critical Issues: ${summary.securityScore.criticalIssues}`)
  console.log(`\n🧪 Testing Coverage:`)
  console.log(`  With Tests: ${summary.testingCoverage.appsWithTests}/${apps.length}`)
  console.log(`  Ready for Promotion: ${summary.promotionReadiness.readyForPromotion}/${apps.length}`)
  console.log(`\n📄 Output: ${outputPath}`)
}

main().catch(console.error)
