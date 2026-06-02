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
const APP_DIR_EXCLUDE = new Set([
  'templates',
  'shared',
  'common',
  'core',
  'platform',
  'ui',
  'docs',
  '__tests__',
  '.cache',
])

const PRETTIER_WRITE = 'pnpm exec prettier --write src/'
const PRETTIER_CHECK = 'pnpm exec prettier --check src/'
const DEFAULT_TEST = 'pnpm exec vitest run --passWithNoTests'

function getAppNames() {
  return fs
    .readdirSync(APPS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !APP_DIR_EXCLUDE.has(name))
    .filter((name) => fs.existsSync(path.join(APPS_DIR, name, 'package.json')))
    .sort((a, b) => a.localeCompare(b))
}

function normalizeScripts(appName, scripts) {
  const next = { ...(scripts ?? {}) }
  const changes = []

  if (!next.typecheck && next['type-check']) {
    next.typecheck = 'pnpm type-check'
    changes.push('added typecheck alias')
  }

  if (!next.format) {
    next.format = PRETTIER_WRITE
    changes.push('added format')
  }

  if (!next['format:check']) {
    next['format:check'] = PRETTIER_CHECK
    changes.push('added format:check')
  }

  if (!next.check) {
    const typeCmd = next.typecheck ? 'pnpm typecheck' : next['type-check'] ? 'pnpm type-check' : null
    const parts = ['pnpm lint', 'pnpm format:check']
    if (typeCmd) parts.push(typeCmd)
    next.check = parts.join(' && ')
    changes.push('added check')
  }

  if (!next.test) {
    next.test = DEFAULT_TEST
    changes.push('added test')
  }

  const namesScript = `pnpm -C ../.. exec node scripts/validate-test-names-segmented.mjs --scope=apps/${appName}/src --chunk=200`
  if (next['test:names'] !== namesScript) {
    next['test:names'] = namesScript
    changes.push('set app-scoped test:names')
  }

  const gatedScript = `pnpm -C ../.. exec node scripts/validate-gated.mjs --nameScope=apps/${appName}/src --workspaceScope=apps/${appName} --testScope=apps/${appName}/src --buildScope=apps/${appName}`
  if (next['validate:gated'] !== gatedScript) {
    next['validate:gated'] = gatedScript
    changes.push('set app-scoped validate:gated')
  }

  if (next.validate !== 'pnpm validate:gated') {
    next.validate = 'pnpm validate:gated'
    changes.push('set validate to validate:gated')
  }

  const dashboardScript = 'pnpm -C ../.. dashboard'
  if (next.dashboard !== dashboardScript) {
    next.dashboard = dashboardScript
    changes.push('set app-scoped dashboard')
  }

  const dashboardServeScript = 'pnpm -C ../.. dashboard:serve'
  if (next['dashboard:serve'] !== dashboardServeScript) {
    next['dashboard:serve'] = dashboardServeScript
    changes.push('set app-scoped dashboard:serve')
  }

  return { scripts: next, changes }
}

function run() {
  const appNames = getAppNames()
  const changedApps = []

  for (const appName of appNames) {
    const pkgPath = path.join(APPS_DIR, appName, 'package.json')
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    const { scripts, changes } = normalizeScripts(appName, pkg.scripts)
    if (changes.length === 0) continue

    pkg.scripts = scripts
    fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
    changedApps.push({ appName, changes })
  }

  // eslint-disable-next-line no-console
  console.log(`Normalized script contract in ${changedApps.length} app(s).`)
  for (const app of changedApps) {
    // eslint-disable-next-line no-console
    console.log(`- ${app.appName}: ${app.changes.join(', ')}`)
  }
}

run()
