#!/usr/bin/env node

/**
 * fix-tile-accessibility.mjs
 *
 * Fixes all tile accessibility violations where tiles are < 58px × 58px
 *
 * Games Fixed:
 * - Shut-the-Box: Mobile size 45px → 58px width minimum
 * - Battleship: Touch minimum 32px → 58px minimum
 * - Zip: All sizes (32px, 24px) → 58px minimum
 *
 * Compliance: WCAG 2.5.5 Target Size (Level AAA)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

// All fixes needed
const fixes = [
  {
    name: 'Shut-the-Box Mobile Width',
    appPath: 'apps/shut-the-box/src/ui/atoms/Tile.module.css',
    find: '@media (max-width: 480px) {',
    check: '.tileContainer { width: 45px;',
    replace: [
      {
        find: 'width: 45px;',
        replaceWith: 'width: 58px;',
        reason: 'Increase mobile width to meet 58px minimum',
      },
    ],
    severity: 'MEDIUM',
  },
  {
    name: 'Battleship Touch Minimum Size',
    appPath: 'apps/battleship/src/ui/atoms/Cell.module.css',
    find: '@media (pointer: coarse)',
    check: 'min-width: 32px;',
    replace: [
      {
        find: 'min-width: 32px;',
        replaceWith: 'min-width: 58px;',
        reason: 'Increase touch target width to meet 58px minimum',
      },
      {
        find: 'min-height: 32px;',
        replaceWith: 'min-height: 58px;',
        reason: 'Increase touch target height to meet 58px minimum',
      },
    ],
    severity: 'HIGH',
  },
  {
    name: 'Zip Board Fixed Size',
    appPath: 'apps/zip/src/ui/ZipBoard.module.css',
    find: '.cell {',
    check: 'width: 32px;',
    replace: [
      {
        find: 'width: 32px;',
        replaceWith: 'width: 58px;',
        reason: 'Increase desktop width to meet 58px minimum',
      },
      {
        find: 'height: 32px;',
        replaceWith: 'height: 58px;',
        reason: 'Increase desktop height to meet 58px minimum',
      },
    ],
    severity: 'CRITICAL',
  },
  {
    name: 'Zip Board Mobile Size',
    appPath: 'apps/zip/src/ui/ZipBoard.module.css',
    find: '@media (max-width: 599px)',
    check: 'width: 24px;',
    replace: [
      {
        find: 'width: 24px;',
        replaceWith: 'width: 58px;',
        reason: 'Increase mobile width to meet 58px minimum (was critically small)',
      },
      {
        find: 'height: 24px;',
        replaceWith: 'height: 58px;',
        reason: 'Increase mobile height to meet 58px minimum (was critically small)',
      },
    ],
    severity: 'CRITICAL',
  },
]

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

function log(color, ...args) {
  if (typeof color !== 'string' || !Object.keys(colors).includes(color)) {
    args.unshift(color)
    color = 'reset'
  }
  console.log(`${colors[color]}${args.join(' ')}${colors.reset}`)
}

function formatSeverity(severity) {
  const severityMap = {
    CRITICAL: `${colors.red}██ CRITICAL${colors.reset}`,
    HIGH: `${colors.yellow}▓▓ HIGH${colors.reset}`,
    MEDIUM: `${colors.yellow}░░ MEDIUM${colors.reset}`,
  }
  return severityMap[severity] || severity
}

async function applyFix(fix) {
  const filePath = path.join(rootDir, fix.appPath)

  if (!fs.existsSync(filePath)) {
    log('red', `✗ File not found: ${filePath}`)
    return false
  }

  let content = fs.readFileSync(filePath, 'utf8')
  const originalContent = content

  // Validate we can find the check string
  if (!content.includes(fix.check)) {
    log('red', `✗ Check string not found in ${fix.appPath}`)
    log('red', `  Looking for: "${fix.check}"`)
    return false
  }

  // Apply each replacement
  for (const replacement of fix.replace) {
    if (!content.includes(replacement.find)) {
      log('red', `✗ Could not find: "${replacement.find}"`)
      return false
    }
    content = content.replace(replacement.find, replacement.replaceWith)
  }

  // Make sure we actually changed something
  if (content === originalContent) {
    log('red', `✗ No changes were made (content identical)`)
    return false
  }

  // Write the fixed file
  fs.writeFileSync(filePath, content, 'utf8')
  return true
}

async function main() {
  log('bright', '\n═══════════════════════════════════════════════════════════')
  log('bright', '  Tile Accessibility Fixes (58px × 58px Minimum Enforcement)')
  log('bright', '═══════════════════════════════════════════════════════════\n')

  let successCount = 0
  let failureCount = 0

  for (const fix of fixes) {
    log('cyan', `\n→ ${fix.name}`)
    log('cyan', `  Severity: ${formatSeverity(fix.severity)}`)
    log('cyan', `  File: ${fix.appPath}`)

    const success = await applyFix(fix)

    if (success) {
      log('green', `  ✓ Fixed successfully`)
      for (const replacement of fix.replace) {
        log('green', `    • ${replacement.find}`)
        log('green', `      → ${replacement.replaceWith}`)
        log('green', `      (${replacement.reason})`)
      }
      successCount++
    } else {
      log('red', `  ✗ Fix failed (file not found or check string missing)`)
      failureCount++
    }
  }

  log('bright', `\n═══════════════════════════════════════════════════════════`)
  log('bright', `  Summary: ${successCount} fixed, ${failureCount} failed`)
  if (failureCount === 0) {
    log('green', `  ✓ All tile accessibility violations corrected!`)
  } else {
    log('red', `  ✗ Some fixes failed - please review manually`)
  }
  log('bright', `═══════════════════════════════════════════════════════════\n`)

  if (failureCount > 0) {
    process.exit(1)
  }
}

main().catch((err) => {
  log('red', 'Error:', err.message)
  process.exit(1)
})
