#!/usr/bin/env node
/**
 * Segmented Format Validation
 * 
 * Breaks down Prettier format:check into isolated tiers by category
 * to identify which specific formatting rules are blocking gates.
 * 
 * Usage: pnpm exec node scripts/format-segmented-validate.mjs [app-filter]
 * Example: node scripts/format-segmented-validate.mjs @games/nim
 */

import { spawn } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import path from 'path'

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

const appFilter = process.argv[2] || '@games/nim'
const rootDir = process.cwd()

// Format validation tiers
// Each tier tests a specific category of formatting rules
const formatTiers = [
  {
    name: 'Tier 1: Prettier Syntax Check',
    description: 'Basic syntax validity (can parse the file)',
    command: 'prettier',
    args: ['--parser', 'babel', '--write', '--dry-run', 'src/'],
    envKey: 'PRETTIER_TIER_1',
  },
  {
    name: 'Tier 2: Line Endings & Whitespace',
    description: 'Trailing whitespace, CRLF→LF, blank lines',
    command: 'prettier',
    args: ['--end-of-line', 'lf', '--check', 'src/'],
    envKey: 'PRETTIER_TIER_2',
  },
  {
    name: 'Tier 3: Indentation & Spacing',
    description: 'Indent width, operator spacing, arrow functions',
    command: 'prettier',
    args: ['--tab-width', '2', '--check', 'src/'],
    envKey: 'PRETTIER_TIER_3',
  },
  {
    name: 'Tier 4: Line Length & Wrapping',
    description: 'Print width, object/array wrapping, JSX formatting',
    command: 'prettier',
    args: ['--print-width', '100', '--check', 'src/'],
    envKey: 'PRETTIER_TIER_4',
  },
  {
    name: 'Tier 5: Quote Style & Semicolons',
    description: 'Single vs double quotes, semicolon rules',
    command: 'prettier',
    args: ['--single-quote', 'false', '--semi', 'true', '--check', 'src/'],
    envKey: 'PRETTIER_TIER_5',
  },
  {
    name: 'Tier 6: Import/Export Ordering',
    description: 'Import/export statement ordering and grouping',
    command: 'prettier',
    args: ['--check', 'src/', '--parser', 'babel'],
    envKey: 'PRETTIER_TIER_6',
  },
  {
    name: 'Tier 7: Arrow & Function Formatting',
    description: 'Arrow function parentheses, function formatting',
    command: 'prettier',
    args: ['--arrow-parens', 'always', '--check', 'src/'],
    envKey: 'PRETTIER_TIER_7',
  },
  {
    name: 'Tier 8: Full Prettier Compliance (config)',
    description: 'Full .prettierrc.json configuration validation',
    command: 'prettier',
    args: ['--check', 'src/'],
    envKey: 'PRETTIER_TIER_8',
  },
]

/**
 * Run a command and capture exit code
 */
function runCommand(cmd, args, cwd) {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    })

    let stdout = ''
    let stderr = ''

    proc.stdout.on('data', (data) => {
      stdout += data
    })
    proc.stderr.on('data', (data) => {
      stderr += data
    })

    proc.on('close', (code) => {
      resolve({
        code,
        stdout,
        stderr,
      })
    })
  })
}

/**
 * Format file count from prettier output
 */
function extractFileCount(output) {
  const match = output.match(/(\d+)\s+file/)
  return match ? parseInt(match[1], 10) : 0
}

/**
 * Main validation runner
 */
async function main() {
  console.log(`\n📋 Segmented Format Validation Report`)
  console.log(`📦 App: ${appFilter}`)
  console.log(`🕐 Started: ${new Date().toISOString()}\n`)

  const appDir = path.join(rootDir, 'apps', appFilter.replace('@games/', ''))

  if (!existsSync(appDir)) {
    console.error(`❌ App directory not found: ${appDir}`)
    process.exit(1)
  }

  const results = []
  let allPassed = true

  // Run each tier
  for (const tier of formatTiers) {
    process.stdout.write(`⏳ ${tier.name}... `)

    const result = await runCommand('pnpm', ['exec', 'prettier', ...tier.args], appDir)

    const passed = result.code === 0
    const status = passed ? '✅ PASS' : '❌ FAIL'
    const fileCount = extractFileCount(result.stdout + result.stderr)

    console.log(status)
    console.log(`   📝 ${tier.description}`)
    if (fileCount > 0 && !passed) {
      console.log(`   📊 ${fileCount} files affected`)
    }
    if (result.stderr && result.code !== 0) {
      const lines = result.stderr.split('\n').slice(0, 3).join('\n   ')
      console.log(`   Error: ${lines}`)
    }

    results.push({
      tier: tier.name,
      passed,
      description: tier.description,
      fileCount,
      exitCode: result.code,
      output: result.stdout + result.stderr,
    })

    if (!passed) {
      allPassed = false
    }
  }

  // Summary
  console.log(`\n${'='.repeat(70)}`)
  console.log(`📊 Summary Report`)
  console.log(`${'='.repeat(70)}`)

  const passCount = results.filter((r) => r.passed).length
  const totalCount = results.length

  console.log(`\n✅ PASS: ${passCount}/${totalCount}`)
  console.log(`❌ FAIL: ${totalCount - passCount}/${totalCount}\n`)

  // Detailed results
  results.forEach((r) => {
    const icon = r.passed ? '✅' : '❌'
    console.log(`${icon} ${r.tier}`)
    console.log(`   ${r.description}`)
  })

  console.log(`\n${'='.repeat(70)}`)

  if (allPassed) {
    console.log(`\n🎉 All format validation tiers PASSED!`)
    process.exit(0)
  } else {
    console.log(
      `\n⚠️  Some format tiers FAILED. Run 'pnpm format' to auto-fix issues.`,
    )
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('❌ Fatal error:', err.message)
  process.exit(1)
})
