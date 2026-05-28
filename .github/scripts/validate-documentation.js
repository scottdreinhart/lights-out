#!/usr/bin/env node

/**
 * validate-documentation.js
 *
 * Helper script for CI/CD validation of documentation consistency.
 * Validates icon usage, required files, cross-references, and structure.
 *
 * Usage: node .github/scripts/validate-documentation.js [--fix]
 *
 * Exit codes:
 *   0 = all checks passed
 *   1 = validation failed (critical)
 *   2 = warnings only (non-blocking)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const DOCS_DIR = path.join(ROOT, 'docs')
const FIX_MODE = process.argv.includes('--fix')

const CANONICAL_ICONS = [
  '🏗️',
  '✅',
  '❌',
  '⏳',
  '📚',
  '🎮',
  '🎴',
  '🛠️',
  '🧪',
  '⚠️',
  '🚨',
  '⭐',
  '📄',
  '📁',
  '📖',
  '⚙️',
  '🔐',
  '🚀',
  '✔️',
  '🎲',
]

const REQUIRED_FILES = [
  'docs/DOCUMENTATION-INDEX-COMMIT-DRIVEN.md',
  'APP_FEATURE_MATRIX.md',
  'docs/COMMIT-ENFORCEMENT.md',
  'CHANGELOG.md',
  'docs/RELEASE_NOTES.md',
  'docs/MIGRATIONS.md',
  'docs/SECURITY-CHANGES.md',
  'docs/DEPENDENCY-UPDATES.md',
  '.commitlintrc.cjs',
  '.czrc.json',
  '.husky/commit-msg',
]

const CROSS_REFERENCES = [
  { from: 'CHANGELOG.md', to: 'RELEASE_NOTES.md', shouldExist: true },
  { from: 'RELEASE_NOTES.md', to: 'MIGRATIONS.md', shouldExist: true },
  { from: 'MIGRATIONS.md', to: 'SECURITY-CHANGES.md', shouldExist: true },
  { from: 'DEPENDENCY-UPDATES.md', to: 'SECURITY-CHANGES.md', shouldExist: true },
]

let errors = 0
let warnings = 0

/**
 * Check if all required files exist.
 */
function checkRequiredFiles() {
  console.log('📋 Checking required files...\n')

  let passed = 0
  for (const file of REQUIRED_FILES) {
    const fullPath = path.join(ROOT, file)
    if (fs.existsSync(fullPath)) {
      console.log(`  ✅ ${file}`)
      passed++
    } else {
      console.log(`  ❌ ${file}`)
      errors++
    }
  }

  console.log(`\n✅ Passed: ${passed}/${REQUIRED_FILES.length}\n`)
  return errors === 0
}

/**
 * Validate icon usage across all markdown files.
 */
function validateIcons() {
  console.log('🎨 Validating icon consistency...\n')

  const mdFiles = fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(DOCS_DIR, f))

  const iconRegex = /[\p{Emoji_Presentation}]/gu
  const issues = []

  for (const file of mdFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    const matches = content.match(iconRegex) || []
    const uniqueIcons = [...new Set(matches)]

    // Check for non-canonical icons
    const nonCanonical = uniqueIcons.filter((icon) => !CANONICAL_ICONS.includes(icon))

    if (nonCanonical.length > 0) {
      const filename = path.basename(file)
      console.log(`  ⚠️ ${filename}: Found ${nonCanonical.length} non-canonical icon(s)`)
      console.log(`     Icons: ${nonCanonical.join(' ')}`)
      warnings++
      issues.push({ file: filename, icons: nonCanonical })
    } else {
      console.log(`  ✅ ${path.basename(file)}`)
    }
  }

  console.log(`\n✔️ Icon validation complete (${warnings} warning(s))\n`)
  return issues
}

/**
 * Validate cross-document references.
 */
function validateReferences() {
  console.log('🔗 Validating cross-document references...\n')

  let passed = 0

  for (const ref of CROSS_REFERENCES) {
    const fromFile = path.join(DOCS_DIR, ref.from)
    const toName = ref.to

    if (!fs.existsSync(fromFile)) {
      console.log(`  ⚠️ ${ref.from} not found`)
      warnings++
      continue
    }

    const content = fs.readFileSync(fromFile, 'utf-8')
    const hasRef = content.includes(toName) || content.includes(toName.replace('.md', ''))

    if (hasRef === ref.shouldExist) {
      console.log(`  ✅ ${ref.from} → ${toName}`)
      passed++
    } else {
      console.log(`  ❌ ${ref.from} → ${toName}`)
      if (ref.shouldExist) {
        console.log(`     Expected reference not found`)
        errors++
      }
    }
  }

  console.log(`\n✅ Passed: ${passed}/${CROSS_REFERENCES.length}\n`)
  return errors === 0
}

/**
 * Validate CHANGELOG.md structure.
 */
function validateChangelog() {
  console.log('📖 Validating CHANGELOG structure...\n')

  const changelogFile = path.join(ROOT, 'CHANGELOG.md')

  if (!fs.existsSync(changelogFile)) {
    console.log('  ❌ CHANGELOG.md not found')
    errors++
    return false
  }

  const content = fs.readFileSync(changelogFile, 'utf-8')

  // Check for required sections
  const checks = [
    { pattern: /## \[(\d+\.\d+\.\d+)\]/m, label: 'Version headers' },
    { pattern: /###\s+(feat|fix|refactor|perf|docs)/m, label: 'Type headers' },
    { pattern: /^-\s+[^\n]+/m, label: 'Entry items' },
  ]

  let passed = 0
  for (const check of checks) {
    if (check.pattern.test(content)) {
      console.log(`  ✅ ${check.label}`)
      passed++
    } else {
      console.log(`  ⚠️ ${check.label} (weak match)`)
      warnings++
    }
  }

  // Check for dates
  const hasDate = /\d{4}-\d{2}-\d{2}/.test(content)
  console.log(`  ${hasDate ? '✅' : '⚠️'} Date format entries`)

  console.log(`\n✅ CHANGELOG validation complete\n`)
  return errors === 0
}

/**
 * Validate file freshness (modified within reasonable timeframe).
 */
function validateFreshness() {
  console.log('📅 Checking documentation freshness...\n')

  const files = ['CHANGELOG.md', 'docs/RELEASE_NOTES.md', 'docs/DEPENDENCY-UPDATES.md']

  const now = Date.now()
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000

  let fresh = 0

  for (const file of files) {
    const fullPath = path.join(ROOT, file)
    if (!fs.existsSync(fullPath)) {
      console.log(`  ⚠️ ${file} not found`)
      continue
    }

    const stat = fs.statSync(fullPath)
    const ageMs = now - stat.mtime.getTime()
    const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000))

    if (ageMs < thirtyDaysMs) {
      console.log(`  ✅ ${file} (${ageDays} days old)`)
      fresh++
    } else {
      console.log(`  ⚠️ ${file} (${ageDays} days old)`)
      warnings++
    }
  }

  console.log(`\n✅ Freshness check complete (${fresh}/${files.length} recent)\n`)
  return fresh > 0
}

/**
 * Main validation runner.
 */
async function main() {
  console.log('🔍 DOCUMENTATION VALIDATION\n')
  console.log('='.repeat(50) + '\n')

  // Run all checks
  checkRequiredFiles()
  validateIcons()
  validateReferences()
  validateChangelog()
  validateFreshness()

  // Summary
  console.log('='.repeat(50) + '\n')
  console.log(`📊 Validation Summary:\n`)
  console.log(`  ✅ Errors: ${errors}`)
  console.log(`  ⚠️ Warnings: ${warnings}\n`)

  if (errors === 0 && warnings === 0) {
    console.log('✅ All checks passed!\n')
    process.exit(0)
  } else if (errors === 0) {
    console.log('⚠️ Passed with warnings (non-blocking)\n')
    process.exit(2) // Warnings only
  } else {
    console.log('❌ Validation failed\n')
    process.exit(1) // Critical errors
  }
}

main().catch((error) => {
  console.error('❌ Validation error:', error.message)
  process.exit(1)
})
