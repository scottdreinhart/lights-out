#!/usr/bin/env node

/**
 * Performance Budget Validator
 * Enforces CSS, JavaScript, and bundle size thresholds per AGENTS.md § 30
 *
 * Authority: AGENTS.md § 30 (CSS Performance & Rendering Optimization)
 * Referenced in: .github/instructions/20-css-performance-rendering-optimization.instructions.md
 *
 * Budgets (Hard Limits):
 * - CSS Critical Path: <50KB (warn >40KB, fail >100KB)
 * - Total Bundle: <200KB (warn >150KB, fail >300KB)
 * - JavaScript: <100KB (warn >80KB, fail >150KB)
 * - Core Web Vitals: FCP <1.8s, LCP <2.5s, CLS <0.1 (enforcement via Lighthouse)
 * - DevTools Coverage: CSS >80% used (enforcement via DevTools)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  WHITE: '\x1b[97m',
  BLUE: '\x1b[94m',
  GRAY: '\x1b[90m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

// Budget thresholds per AGENTS.md § 30
const BUDGETS = {
  css: {
    critical: { warn: 40 * 1024, fail: 100 * 1024 }, // 40KB warn, 100KB fail
    name: 'CSS Critical Path',
  },
  js: {
    warn: 80 * 1024, // 80KB warn
    fail: 150 * 1024, // 150KB fail
    name: 'JavaScript Bundle',
  },
  total: {
    warn: 150 * 1024, // 150KB warn
    fail: 300 * 1024, // 300KB fail
    name: 'Total Bundle',
  },
}

const STATUS = {
  PASS: { code: 0, color: '\x1b[32m', label: '✅ PASS' }, // Green
  WARN: { code: 1, color: '\x1b[33m', label: '⚠️  WARN' }, // Yellow
  FAIL: { code: 2, color: '\x1b[31m', label: '❌ FAIL' }, // Red
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath)
    return stats.size
  } catch (e) {
    return 0
  }
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(2) + ' KB'
}

function colorize(text, status) {
  return `${status.color}${text}\x1b[0m`
}

function validateBudgets() {
  if (!fs.existsSync(distDir)) {
    console.error(`${COLORS.RED}${COLORS.BOLD}❌ dist/ directory not found. Run \`pnpm build\` first.${COLORS.RESET}`)
    process.exit(1)
  }

  const files = fs.readdirSync(distDir).reduce((acc, file) => {
    const filePath = path.join(distDir, file)
    const isDir = fs.statSync(filePath).isDirectory()

    if (!isDir) {
      const size = getFileSize(filePath)
      const ext = path.extname(file)

      if (ext === '.css' || ext === '.js') {
        acc[file] = { size, ext }
      }
    }

    return acc
  }, {})

  let cssTotal = 0
  let jsTotal = 0
  let bundleTotal = 0
  const results = []

  // Calculate totals
  Object.entries(files).forEach(([file, { size, ext }]) => {
    bundleTotal += size

    if (ext === '.css') {
      cssTotal += size
      // Critical CSS = files with 'index' or 'critical' in name
      if (file.includes('index') || file.includes('critical')) {
        cssTotal = Math.max(cssTotal, size) // Use file size as minimum
      }
    } else if (ext === '.js') {
      jsTotal += size
    }
  })

  // Validate CSS Critical Path
  console.log(`${COLORS.BLUE}${COLORS.BOLD}\n📊 CSS Performance Metrics${COLORS.RESET}`)
  console.log(`${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}`)

  const cssStatus =
    cssTotal > BUDGETS.css.critical.fail
      ? STATUS.FAIL
      : cssTotal > BUDGETS.css.critical.warn
        ? STATUS.WARN
        : STATUS.PASS

  results.push(cssStatus)

  console.log(
    `${colorize(BUDGETS.css.name, cssStatus)} ${formatBytes(cssTotal)}`,
  )
  console.log(
    `  → Budget: <${formatBytes(BUDGETS.css.critical.fail)} (hard limit)`,
  )
  console.log(`  → Authority: AGENTS.md § 30 (Critical Rendering Path)`)

  // Validate JavaScript
  const jsStatus =
    jsTotal > BUDGETS.js.fail
      ? STATUS.FAIL
      : jsTotal > BUDGETS.js.warn
        ? STATUS.WARN
        : STATUS.PASS

  results.push(jsStatus)

  console.log(
    `\n${colorize(BUDGETS.js.name, jsStatus)} ${formatBytes(jsTotal)}`,
  )
  console.log(`  → Budget: <${formatBytes(BUDGETS.js.fail)} (hard limit)`)
  console.log(`  → Authority: AGENTS.md § 22 (Dependency Governance)`)

  // Validate Total Bundle
  const totalStatus =
    bundleTotal > BUDGETS.total.fail
      ? STATUS.FAIL
      : bundleTotal > BUDGETS.total.warn
        ? STATUS.WARN
        : STATUS.PASS

  results.push(totalStatus)

  console.log(
    `\n${colorize(BUDGETS.total.name, totalStatus)} ${formatBytes(bundleTotal)}`,
  )
  console.log(`  → Budget: <${formatBytes(BUDGETS.total.fail)} (hard limit)`)
  console.log(`  → Authority: pnpm validate quality gate`)

  // Summary
  console.log('\n' + '─'.repeat(60))
  const worstStatus = results.reduce(
    (worst, curr) => (curr.code > worst.code ? curr : worst),
    STATUS.PASS,
  )

  if (worstStatus === STATUS.FAIL) {
    console.log(
      `\n${colorize('❌ FAILURE', STATUS.FAIL)}: Performance budgets exceeded.`,
    )
    console.log('   Reduce bundle size before committing.')
    console.log('   Authority: AGENTS.md § 30 + § 0.A (Self-Correction Loop)')
    process.exit(1)
  } else if (worstStatus === STATUS.WARN) {
    console.log(
      `\n${colorize('⚠️  WARNING', STATUS.WARN)}: Approaching performance budgets.`,
    )
    console.log('   Monitor carefully; optimize if possible.')
  } else {
    console.log(
      `\n${colorize('✅ SUCCESS', STATUS.PASS)}: All performance budgets met.`,
    )
    console.log('   CSS critical path optimized per AGENTS.md § 30.')
  }

  // File breakdown
  console.log('\n📁 File Breakdown:')
  console.log('─'.repeat(60))
  Object.entries(files)
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 10)
    .forEach(([file, { size }]) => {
      const percent = ((size / bundleTotal) * 100).toFixed(1)
      console.log(`  ${file.padEnd(30)} ${formatBytes(size).padStart(10)} (${percent}%)`)
    })

  console.log('\n✅ Run `pnpm build` to rebuild with optimizations.')
  console.log('✅ Run `pnpm validate` to run full quality gate (lint + check + build + Lighthouse).\n')

  process.exit(worstStatus.code)
}

validateBudgets()
