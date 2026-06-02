#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { spawnSync } from 'child_process'

const COLORS = {
  BLUE: '\x1b[94m',
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  WHITE: '\x1b[97m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const appDirs = [
  'bingo-30',
  'bingo-80',
  'bingo-90',
  'bingo-blackout',
  'bingo-bonus',
  'bingo-pattern',
  'bingo-progressive',
  'bingo-rush',
  'bingo-survival',
  'memory-game',
  'pattern-bingo',
  'power-bingo',
  'simon',
  'crossclimb',
  'hangman',
  'minesweeper',
  'mini-sudoku',
  'monchola',
  'nim',
  'zip',
]

console.log(`${COLORS.BLUE}${COLORS.BOLD}🧪 ZIP rollout validation: ${appDirs.length} apps${COLORS.RESET}\n`)

const results = []
mkdirSync('reports', { recursive: true })
for (const app of appDirs) {
  const pkg = JSON.parse(readFileSync(`apps/${app}/package.json`, 'utf8'))
  const pkgName = pkg.name
  const run = spawnSync('pnpm', ['--filter', pkgName, 'validate'], {
    encoding: 'utf8',
    timeout: 300000,
    maxBuffer: 16 * 1024 * 1024,
  })
  const combined = `${run.stdout || ''}\n${run.stderr || ''}`
  const firstError =
    combined
      .split('\n')
      .find((l) => /\berror\b|ELIFECYCLE|ERR_PNPM|Command failed/i.test(l))
      ?.trim() || ''

  results.push({
    app,
    pkgName,
    code: run.status ?? 999,
    status: run.status === 0 ? 'PASS' : 'FAIL',
    firstError,
  })

  writeFileSync(`reports/zip-rollout-validate-${app}.log`, combined)
}

const pass = results.filter((r) => r.status === 'PASS').length
const fail = results.length - pass
console.log(`${COLORS.WHITE}\n${'═'.repeat(70)}${COLORS.RESET}`)
console.log(`${COLORS.CYAN}📊 Results: ${results.length} apps${COLORS.RESET}`)
console.log(`${COLORS.WHITE}${'═'.repeat(70)}${COLORS.RESET}`)
for (const r of results) {
  const statusIcon = r.status === 'PASS' ? `${COLORS.GREEN}✅${COLORS.RESET}` : `${COLORS.RED}❌${COLORS.RESET}`
  console.log(`  ${statusIcon} ${r.app}${r.firstError ? ` ${COLORS.YELLOW}⚠️  ${r.firstError}${COLORS.RESET}` : ''}`)
}
