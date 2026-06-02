#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const ROOT = process.cwd()
const APPS_DIR = path.join(ROOT, 'apps')
const TIMEOUT = '600000'

function listApps() {
  if (!fs.existsSync(APPS_DIR)) {
    return []
  }

  return fs
    .readdirSync(APPS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))
}

function buildCommand(appName, scriptName) {
  return `pnpm -C ../.. exec node scripts/validate-workspace-segmented.mjs --script=${scriptName} --scope=apps/${appName} --timeoutMs=${TIMEOUT}`
}

let updatedCount = 0

for (const appName of listApps()) {
  const pkgJsonPath = path.join(APPS_DIR, appName, 'package.json')
  if (!fs.existsSync(pkgJsonPath)) {
    continue
  }

  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
  const scripts = pkg.scripts ?? {}
  const hasFormat = typeof scripts.format === 'string'
  const hasFormatCheck = typeof scripts['format:check'] === 'string'

  if (!hasFormat && !hasFormatCheck) {
    continue
  }

  let changed = false
  if (hasFormat && scripts['format:segment'] !== buildCommand(appName, 'format')) {
    scripts['format:segment'] = buildCommand(appName, 'format')
    changed = true
  }

  if (
    hasFormatCheck &&
    scripts['format:check:segment'] !== buildCommand(appName, 'format:check')
  ) {
    scripts['format:check:segment'] = buildCommand(appName, 'format:check')
    changed = true
  }

  if (!changed) {
    continue
  }

  pkg.scripts = scripts
  fs.writeFileSync(pkgJsonPath, `${JSON.stringify(pkg, null, 2)}\n`)
  updatedCount += 1
  // eslint-disable-next-line no-console
  console.log(`Updated ${path.relative(ROOT, pkgJsonPath)}`)
}

// eslint-disable-next-line no-console
console.log(`Updated ${updatedCount} app package.json files.`)