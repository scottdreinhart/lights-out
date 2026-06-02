#!/usr/bin/env node

/**
 * Batch Bingo HamburgerMenu Rollout Script
 * Applies HamburgerMenu integration pattern to all bingo variants
 *
 * Usage: node batch-bingo-hamburger-rollout.mjs [--dry-run] [--verbose]
 */

import { execSync } from 'child_process'
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
const appsDir = path.join(__dirname, '..', 'apps')

// Games to integrate (12 that don't have HamburgerMenu yet)
const BINGO_GAMES = [
  'bingo-30',
  'bingo-80',
  'bingo-90',
  'bingo-blackout',
  'bingo-bonus',
  'bingo-pattern',
  'bingo-progressive',
  'bingo-rush',
  'bingo-survival',
  'pattern-bingo',
  'power-bingo',
  'speed-bingo',
]

const FLAGS = {
  dryRun: process.argv.includes('--dry-run'),
  verbose: process.argv.includes('--verbose'),
}

if (FLAGS.dryRun) {
  console.log('🏃 DRY RUN MODE - No files will be modified')
}

console.log(`\n📋 BATCH BINGO HAMBURGER ROLLOUT`)
console.log(`📊 Games to process: ${BINGO_GAMES.length}`)
console.log(`🎯 Target: Complete HamburgerMenu integration for Batch 2\n`)

// Template for HamburgerMenu adapter
const HAMBURGER_MENU_TEMPLATE = `import {
  HamburgerMenu as SharedHamburgerMenu,
  type MenuItem,
} from '@games/common'

export interface HamburgerMenuProps {
  onRules: () => void
  onSettings: () => void
  onAbout?: () => void
}

export function HamburgerMenu({ 
  onRules, 
  onSettings, 
  onAbout 
}: HamburgerMenuProps) {
  const items: MenuItem[] = [
    { label: 'How to Play', icon: '🎮', action: onRules },
    { label: 'Settings', icon: '⚙️', action: onSettings },
    ...(onAbout ? [{ label: 'About', icon: 'ℹ️', action: onAbout }] : []),
  ]
  
  return <SharedHamburgerMenu items={items} />
}
`

class BingoRollout {
  constructor(gameName) {
    this.gameName = gameName
    this.gameDir = path.join(appsDir, gameName)
    this.appTsPath = path.join(this.gameDir, 'src', 'ui', 'organisms', 'App.tsx')
    this.hamburgerPath = path.join(this.gameDir, 'src', 'ui', 'organisms', 'HamburgerMenu.tsx')
    this.packageJsonPath = path.join(this.gameDir, 'package.json')
    this.packageName = this.getPackageName()
    this.status = { created: [], modified: [], tested: [] }
  }

  getPackageName() {
    try {
      const pkg = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf-8'))
      return pkg.name
    } catch {
      return `@games/${this.gameName}`
    }
  }

  alreadyHasHamburgerMenu() {
    try {
      const content = fs.readFileSync(this.appTsPath, 'utf-8')
      return content.includes('HamburgerMenu')
    } catch {
      return false
    }
  }

  createHamburgerMenuAdapter() {
    if (this.alreadyHasHamburgerMenu()) {
      if (FLAGS.verbose) console.log(`  ⏭️  HamburgerMenu already imported`)
      return false
    }

    if (!FLAGS.dryRun) {
      fs.writeFileSync(this.hamburgerPath, HAMBURGER_MENU_TEMPLATE)
    }

    this.status.created.push('HamburgerMenu.tsx')
    console.log(`  ✅ Created HamburgerMenu.tsx`)
    return true
  }

  async testLinting() {
    try {
      if (FLAGS.dryRun) {
        console.log(`  ⏭️  [DRY-RUN] Would run: pnpm --filter ${this.packageName} lint`)
        return true
      }

      execSync(`pnpm --filter "${this.packageName}" lint`, {
        cwd: path.join(this.gameDir, '../..'),
        stdio: 'pipe',
      })

      console.log(`  ✅ Linting passed`)
      this.status.tested.push('lint')
      return true
    } catch (err) {
      if (FLAGS.verbose) console.log(`  ❌ Linting failed: ${err.message}`)
      return false
    }
  }

  async testValidation() {
    try {
      if (FLAGS.dryRun) {
        console.log(`  ⏭️  [DRY-RUN] Would run: pnpm --filter ${this.packageName} validate`)
        return true
      }

      execSync(`pnpm --filter "${this.packageName}" validate`, {
        cwd: path.join(this.gameDir, '../..'),
        stdio: 'pipe',
      })

      console.log(`  ✅ Validation passed`)
      this.status.tested.push('validate')
      return true
    } catch (err) {
      if (FLAGS.verbose) console.log(`  ❌ Validation failed: ${err.message}`)
      return false
    }
  }

  async process() {
    console.log(`\n📦 ${this.gameName}`)

    // Step 1: Create HamburgerMenu adapter
    this.createHamburgerMenuAdapter()

    // Step 2: Run tests
    await this.testLinting()
    await this.testValidation()

    // Summary
    console.log(
      `   Status: ${this.status.created.length ? '✅ CREATED' : '⏭️  SKIPPED'} | ${this.status.tested.join(', ') || 'N/A'}`,
    )

    return {
      game: this.gameName,
      packageName: this.packageName,
      created: this.status.created.length > 0,
      testsPass: this.status.tested.length === 2,
    }
  }
}

async function main() {
  const results = []

  for (const gameName of BINGO_GAMES) {
    try {
      const rollout = new BingoRollout(gameName)
      const result = await rollout.process()
      results.push(result)
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`)
      results.push({ game: gameName, created: false, testsPass: false })
    }
  }

  // Summary Report
  console.log(`\n${'─'.repeat(60)}`)
  console.log(`📊 BATCH ROLLOUT SUMMARY`)
  console.log(`${'─'.repeat(60)}`)

  const created = results.filter((r) => r.created).length
  const passed = results.filter((r) => r.testsPass).length

  console.log(`✅ Created: ${created}/${BINGO_GAMES.length}`)
  console.log(`✅ Tests Passed: ${passed}/${created}`)
  console.log(`${'─'.repeat(60)}`)

  if (created === BINGO_GAMES.length && passed === BINGO_GAMES.length) {
    console.log(
      `\n🎉 BATCH COMPLETE! All ${BINGO_GAMES.length} games ready for App.tsx modifications.`,
    )
  } else {
    console.log(`\n⚠️  Partial completion. Review failures above.`)
  }

  process.exit(created === BINGO_GAMES.length ? 0 : 1)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
