#!/usr/bin/env node

/**
 * Test File Naming Validator
 *
 * Enforces strict test file naming conventions:
 *   - Feature name comes FIRST
 *   - Test type comes AFTER feature name
 *   - Use .test.* for Vitest files
 *   - Use .spec.* for Playwright files
 *
 * Valid patterns:
 *   auth.unit.test.ts         ✅
 *   login.e2e.spec.ts         ✅
 *   button.component.test.tsx  ✅
 *   dashboard.a11y.spec.ts     ✅
 *   checkout.visual.spec.ts    ✅
 *   board.integration.test.ts  ✅
 *   minimax.perf.js            ✅
 *
 * Invalid patterns (rejected):
 *   test.auth.ts               ❌
 *   auth.test.unit.ts          ❌
 *   unit.test.ts               ❌
 *   test.ts                    ❌
 *   component.tsx              ❌
 */

import glob from 'glob'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

// ===================================================================
// VALIDATION PATTERNS
// ===================================================================

const VALID_PATTERNS = [
  // Vitest patterns
  /^[a-z0-9._-]+\.unit\.test\.tsx?$/i,
  /^[a-z0-9._-]+\.integration\.test\.tsx?$/i,
  /^[a-z0-9._-]+\.component\.test\.tsx?$/i,
  /^[a-z0-9._-]+\.api\.test\.tsx?$/i,

  // Playwright patterns
  /^[a-z0-9._-]+\.e2e\.spec\.tsx?$/i,
  /^[a-z0-9._-]+\.a11y\.spec\.tsx?$/i,
  /^[a-z0-9._-]+\.visual\.spec\.tsx?$/i,

  // Performance patterns
  /^[a-z0-9._-]+\.(perf|load|stress|soak|spike)\.js$/i,
]

const VITEST_PATTERNS = [
  '**/*.unit.test.ts',
  '**/*.unit.test.tsx',
  '**/*.integration.test.ts',
  '**/*.integration.test.tsx',
  '**/*.component.test.ts',
  '**/*.component.test.tsx',
  '**/*.api.test.ts',
  '**/*.api.test.tsx',
]

const PLAYWRIGHT_PATTERNS = [
  '**/*.e2e.spec.ts',
  '**/*.e2e.spec.tsx',
  '**/*.a11y.spec.ts',
  '**/*.a11y.spec.tsx',
  '**/*.visual.spec.ts',
  '**/*.visual.spec.tsx',
]

const PERF_PATTERNS = [
  '**/*.perf.js',
  '**/*.load.js',
  '**/*.stress.js',
  '**/*.soak.js',
  '**/*.spike.js',
]

// ===================================================================
// DISCOVERY
// ===================================================================

function findTestFiles() {
  const allPatterns = [...VITEST_PATTERNS, ...PLAYWRIGHT_PATTERNS, ...PERF_PATTERNS]
  const allFiles = new Set()

  // Search for each pattern individually to avoid glob array issues
  for (const pattern of allPatterns) {
    try {
      const files = glob.sync(pattern, { cwd: repoRoot })
      files.forEach((f) => {
        // Filter out excluded directories
        if (
          !f.includes('node_modules') &&
          !f.includes('dist') &&
          !f.includes('release') &&
          !f.includes('.next') &&
          !f.includes('.turbo')
        ) {
          allFiles.add(f)
        }
      })
    } catch (e) {
      console.warn(`⚠️  Pattern failed: "${pattern}" (${e.message})`)
    }
  }

  return Array.from(allFiles).sort()
}

// ===================================================================
// VALIDATION
// ===================================================================

function isValidTestName(filename) {
  const basename = path.basename(filename)
  return VALID_PATTERNS.some((pattern) => pattern.test(basename))
}

function getTestType(filename) {
  const basename = path.basename(filename)

  if (/\.unit\.test\.tsx?$/.test(basename)) return 'unit'
  if (/\.integration\.test\.tsx?$/.test(basename)) return 'integration'
  if (/\.component\.test\.tsx?$/.test(basename)) return 'component'
  if (/\.api\.test\.tsx?$/.test(basename)) return 'api'
  if (/\.e2e\.spec\.tsx?$/.test(basename)) return 'e2e'
  if (/\.a11y\.spec\.tsx?$/.test(basename)) return 'a11y'
  if (/\.visual\.spec\.tsx?$/.test(basename)) return 'visual'
  if (/\.perf\.js$/.test(basename)) return 'perf'
  if (/\.load\.js$/.test(basename)) return 'load'
  if (/\.stress\.js$/.test(basename)) return 'stress'
  if (/\.soak\.js$/.test(basename)) return 'soak'
  if (/\.spike\.js$/.test(basename)) return 'spike'

  return 'unknown'
}

function getFeatureName(filename) {
  const basename = path.basename(filename)
  const parts = basename.split('.')
  return parts[0] // Everything before first dot
}

// ===================================================================
// REPORTING
// ===================================================================

function isValidFilename(filename) {
  const basename = path.basename(filename)

  // Reject obviously wrong patterns
  if (/^test[.-]/.test(basename)) return false // test.* or test-*
  if (/test\.[a-z]+\.ts/.test(basename)) return false // *.test.unit.ts
  if (/spec\.[a-z]+\.ts/.test(basename)) return false // *.spec.unit.ts
  if (basename === 'test.ts' || basename === 'test.tsx') return false
  if (basename === 'index.test.ts' || basename === 'index.spec.ts') return false
  if (basename === 'app.test.ts' || basename === 'app.spec.ts') return false
  if (basename === 'main.test.ts' || basename === 'main.spec.ts') return false

  // Accept valid patterns
  return isValidTestName(filename)
}

function printError(file, reason, suggestions = []) {
  console.error(`\n❌ INVALID TEST NAME: ${file}`)
  console.error(`   Reason: ${reason}`)

  if (suggestions.length > 0) {
    console.error(`   Examples of valid names:`)
    suggestions.forEach((s) => console.error(`     ✅ ${s}`))
  }

  console.error(`\n   See: docs/TEST_NAMING_CONVENTION.md for complete rules`)
}

function getSuggestions(filename) {
  const basename = path.basename(filename)
  const feature = getFeatureName(filename)

  // Common invalid patterns and suggestions
  if (/^test[.-]/.test(basename)) {
    return [
      `${feature}.unit.test.ts`,
      `${feature}.integration.test.ts`,
      `${feature}.component.test.tsx`,
    ]
  }

  if (/\.test\.[a-z]+\.ts/.test(basename)) {
    return [
      `${feature}.unit.test.ts`,
      `${feature}.integration.test.ts`,
      `${feature}.component.test.tsx`,
    ]
  }

  return [`${feature}.unit.test.ts`, `${feature}.integration.test.tsx`, `${feature}.e2e.spec.ts`]
}

// ===================================================================
// MAIN
// ===================================================================

function main() {
  const args = process.argv.slice(2)
  const verbose = args.includes('--verbose') || args.includes('-v')
  const fix = args.includes('--fix') || args.includes('-f')

  console.log('🔍 Validating test file names...\n')

  const testFiles = findTestFiles()

  if (testFiles.length === 0) {
    console.log('   ℹ️  No test files found.')
    process.exit(0)
  }

  console.log(`   Found ${testFiles.length} test file(s)\n`)

  let validCount = 0
  let invalidCount = 0
  const invalid = []

  testFiles.forEach((file) => {
    const isValid = isValidFilename(file)
    const testType = getTestType(file)
    const feature = getFeatureName(file)

    if (isValid) {
      validCount++
      if (verbose) {
        console.log(`✅ ${file}`)
        console.log(`   Type: ${testType} | Feature: ${feature}`)
      }
    } else {
      invalidCount++
      invalid.push(file)

      const reason = determineErrorReason(file)
      const suggestions = getSuggestions(file)

      printError(file, reason, suggestions)
    }
  })

  console.log(`\n${'='.repeat(70)}`)
  console.log(`Summary: ${validCount} valid, ${invalidCount} invalid`)
  console.log(`${'='.repeat(70)}\n`)

  if (invalidCount > 0) {
    console.error(
      '❌ NAMING VALIDATION FAILED\n' +
        'Fix test filenames to match: <feature>.<type>.test.ts or <feature>.<type>.spec.ts\n' +
        'See docs/TEST_NAMING_CONVENTION.md for complete rules.\n',
    )
    process.exit(1)
  } else {
    console.log('✅ All test files follow naming conventions!\n')
    process.exit(0)
  }
}

function determineErrorReason(filename) {
  const basename = path.basename(filename)

  if (/^test[.-]/.test(basename)) {
    return 'Feature name must come FIRST (test.* is reversed)'
  }

  if (/\.test\.[a-z]+\./.test(basename)) {
    return 'Test type must come AFTER feature name (e.g., feature.type.test.ts, not feature.test.type.ts)'
  }

  if (/^[a-z.]+\.(spec|test)\.ts$/.test(basename)) {
    return 'Missing test type (must include: unit, integration, component, api, e2e, a11y, visual, perf, etc.)'
  }

  return 'Does not match approved test naming patterns'
}

main()
