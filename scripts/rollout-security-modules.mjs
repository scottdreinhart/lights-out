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
const OUT_FILE = path.join(ROOT, 'compliance', 'security-module-adoption.json')

const REQUIRED_SECURITY_DEPS = [
  '@games/shared-validators',
  '@games/shared-sanitizers',
  '@games/shared-config',
  '@games/shared-api-client',
]
const SECURITY_MODULE_FILE = 'securityModules.ts'

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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

function collectAppNames() {
  return fs
    .readdirSync(APPS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !APP_DIR_EXCLUDE.has(name))
    .filter((name) => fs.existsSync(path.join(APPS_DIR, name, 'package.json')))
    .sort((a, b) => a.localeCompare(b))
}

function collectFilesRecursively(startDir) {
  const files = []
  const stack = [startDir]

  while (stack.length) {
    const current = stack.pop()
    const entries = fs.readdirSync(current, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        if (
          entry.name === 'node_modules' ||
          entry.name === 'dist' ||
          entry.name === 'release' ||
          entry.name === 'build' ||
          entry.name === '.git'
        ) {
          continue
        }
        stack.push(fullPath)
        continue
      }
      files.push(fullPath)
    }
  }

  return files
}

function sourceForApp(appRoot) {
  const files = collectFilesRecursively(path.join(appRoot, 'src')).filter((f) =>
    /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(path.basename(f)),
  )
  return files.map((f) => fs.readFileSync(f, 'utf8')).join('\n')
}

function ensureSecurityDeps(pkg) {
  let changed = false
  pkg.dependencies ??= {}

  for (const dep of REQUIRED_SECURITY_DEPS) {
    if (!pkg.dependencies[dep]) {
      pkg.dependencies[dep] = 'workspace:*'
      changed = true
    }
  }

  if (changed) {
    pkg.dependencies = Object.fromEntries(
      Object.entries(pkg.dependencies).sort(([a], [b]) => a.localeCompare(b)),
    )
  }

  return changed
}

function evaluateWiring(source) {
  return {
    validators: /@games\/shared-validators|securityModules/i.test(source),
    sanitizers: /@games\/shared-sanitizers|securityModules/i.test(source),
    config: /@games\/shared-config|securityModules/i.test(source),
    apiClient: /@games\/shared-api-client|securityModules/i.test(source),
  }
}

function ensureSecurityWiring(appRoot) {
  const appDir = path.join(appRoot, 'src', 'app')
  const modulePath = path.join(appDir, SECURITY_MODULE_FILE)
  fs.mkdirSync(appDir, { recursive: true })

  const moduleContents = `import * as sharedValidators from '@games/shared-validators'
import * as sharedSanitizers from '@games/shared-sanitizers'
import * as sharedConfig from '@games/shared-config'
import * as sharedApiClient from '@games/shared-api-client'

export const securityModules = {
  validators: sharedValidators,
  sanitizers: sharedSanitizers,
  config: sharedConfig,
  apiClient: sharedApiClient,
}

export const securityModulesReady = Boolean(
  securityModules.validators &&
    securityModules.sanitizers &&
    securityModules.config &&
    securityModules.apiClient,
)
`

  let changed = false
  if (!fs.existsSync(modulePath) || fs.readFileSync(modulePath, 'utf8') !== moduleContents) {
    fs.writeFileSync(modulePath, moduleContents)
    changed = true
  }

  const appIndexPath = path.join(appDir, 'index.ts')
  if (fs.existsSync(appIndexPath)) {
    const current = fs.readFileSync(appIndexPath, 'utf8')
    const exportLine = `export * from './securityModules'`
    if (!current.includes(exportLine)) {
      const next = `${current.trimEnd()}\n${exportLine}\n`
      fs.writeFileSync(appIndexPath, next)
      changed = true
    }
  }

  return changed
}

function run() {
  const apply = process.argv.includes('--apply')
  const wire = process.argv.includes('--wire') || apply
  const appNames = collectAppNames()
  const changedApps = []
  const adoptionRows = []

  for (const appName of appNames) {
    const appRoot = path.join(APPS_DIR, appName)
    const pkgPath = path.join(appRoot, 'package.json')
    const pkg = readJson(pkgPath)

    let updatedDeps = false
    let updatedWiring = false
    if (apply) {
      updatedDeps = ensureSecurityDeps(pkg)
      if (updatedDeps) {
        writeJson(pkgPath, pkg)
      }
    }
    if (wire) {
      updatedWiring = ensureSecurityWiring(appRoot)
    }
    if (updatedDeps || updatedWiring) {
      changedApps.push(appName)
    }

    const deps = { ...(readJson(pkgPath).dependencies ?? {}) }
    const presentDeps = REQUIRED_SECURITY_DEPS.filter((dep) => deps[dep])
    const missingDeps = REQUIRED_SECURITY_DEPS.filter((dep) => !deps[dep])
    const source = sourceForApp(appRoot)
    const wiring = evaluateWiring(source)

    adoptionRows.push({
      app: appName,
      presentDeps,
      missingDeps,
      wiring,
      dependencyCoverage: Number(((presentDeps.length / REQUIRED_SECURITY_DEPS.length) * 100).toFixed(2)),
      status:
        presentDeps.length === REQUIRED_SECURITY_DEPS.length
          ? wiring.validators || wiring.sanitizers || wiring.config || wiring.apiClient
            ? 'wired'
            : 'deps-only'
          : 'partial',
      updated: updatedDeps || updatedWiring,
    })
  }

  const totals = {
    totalApps: adoptionRows.length,
    fullyWiredApps: adoptionRows.filter((r) => r.status === 'wired').length,
    depsOnlyApps: adoptionRows.filter((r) => r.status === 'deps-only').length,
    partialApps: adoptionRows.filter((r) => r.status === 'partial').length,
    updatedApps: changedApps.length,
  }

  const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        applyMode: apply,
        wireMode: wire,
        requiredDependencies: REQUIRED_SECURITY_DEPS,
        criteria: [
          'wired = all required dependencies present + security module wiring evidence in source',
          'deps-only = all required dependencies present but no wiring evidence',
          'partial = one or more required dependencies missing',
        ],
      },
    totals,
    apps: adoptionRows,
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  writeJson(OUT_FILE, report)

  // eslint-disable-next-line no-console
  console.log(`Security module audit written: ${path.relative(ROOT, OUT_FILE)}`)
  if (apply) {
    // eslint-disable-next-line no-console
    console.log(`Updated apps: ${changedApps.length}`)
    if (changedApps.length > 0) {
      // eslint-disable-next-line no-console
      console.log(changedApps.join(', '))
    }
  }
}

run()
