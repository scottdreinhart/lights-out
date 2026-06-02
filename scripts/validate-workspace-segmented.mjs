#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  YELLOW: '\x1b[93m',
  RED: '\x1b[91m',
  GRAY: '\x1b[90m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const ROOT = process.cwd()

const args = process.argv.slice(2)
const getArg = (name, fallback) => {
  const hit = args.find((arg) => arg.startsWith(`${name}=`))
  return hit ? hit.slice(name.length + 1) : fallback
}

const scriptName = getArg('--script', '')
const scopeArg = getArg('--scope', 'apps')
const timeoutMs = Number.parseInt(getArg('--timeoutMs', '300000'), 10)
const forwardArgs = args
  .filter((arg) => arg.startsWith('--forward='))
  .map((arg) => arg.slice('--forward='.length))

if (!scriptName) {
  // eslint-disable-next-line no-console
  console.error('Missing required --script argument')
  process.exit(2)
}

const scopeDir = path.resolve(ROOT, scopeArg)
if (!fs.existsSync(scopeDir)) {
  // eslint-disable-next-line no-console
  console.error(`Scope path does not exist: ${scopeArg}`)
  process.exit(2)
}

function discoverWorkspacePackages(baseDir) {
  const packages = []
  if (fs.existsSync(path.join(baseDir, 'package.json'))) {
    packages.push(baseDir)
  }

  const entries = fs.readdirSync(baseDir, { withFileTypes: true })
  const childPackages = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(baseDir, entry.name))
    .filter((dir) => fs.existsSync(path.join(dir, 'package.json')))
    .sort((a, b) => a.localeCompare(b))

  return [...packages, ...childPackages]
}

function formatRemaining(count) {
  return count === 1 ? '1 more' : `${count} more`
}

const packages = discoverWorkspacePackages(scopeDir)
if (packages.length === 0) {
  // eslint-disable-next-line no-console
  console.log(`No workspace packages found under: ${scopeArg}`)
  process.exit(0)
}

// eslint-disable-next-line no-console
console.log(
  `${COLORS.BLUE}  🧪 workspace gate start: metric=${scriptName}, scope=${scopeArg}, workspaces=${packages.length} (each segment is one workspace package/app)${COLORS.RESET}`,
)

for (const [index, pkgDir] of packages.entries()) {
  const pkgJsonPath = path.join(pkgDir, 'package.json')
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
  const pkgName = pkgJson.name || path.basename(pkgDir)
  const bracket = `${index + 1}/${packages.length}`
  const remaining = packages.length - index - 1

  // eslint-disable-next-line no-console
  console.log(
    `${COLORS.MAGENTA}\n  📚 [${bracket}] workspace segment: ${pkgName} (${formatRemaining(remaining)}; segment = one workspace package/app)${COLORS.RESET}`,
  )

  if (!pkgJson.scripts || !pkgJson.scripts[scriptName]) {
    // eslint-disable-next-line no-console
    console.error(`${COLORS.RED}  ❌ Missing script '${scriptName}' in ${path.relative(ROOT, pkgJsonPath)}${COLORS.RESET}`)
    process.exit(1)
  }

  const started = Date.now()
  const commandArgs = ['-C', pkgDir, scriptName]
  if (forwardArgs.length > 0) {
    commandArgs.push('--', ...forwardArgs)
  }

  const result = spawnSync('pnpm', commandArgs, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    timeout: timeoutMs,
  })
  const elapsedMs = Date.now() - started

  if (result.status === null && result.error && result.error.code === 'ETIMEDOUT') {
    // eslint-disable-next-line no-console
    console.error(
      `${COLORS.RED}  ⏳ Timeout: workspace ${pkgName} exceeded ${Math.round(timeoutMs / 1000)}s${COLORS.RESET}`,
    )
    process.exit(124)
  }

  if (result.status !== 0) {
    // eslint-disable-next-line no-console
    console.error(
      `${COLORS.RED}  ❌ Failed: workspace ${pkgName} [${bracket}] (${elapsedMs}ms)${COLORS.RESET}`,
    )
    process.exit(result.status ?? 1)
  }

  // eslint-disable-next-line no-console
  console.log(
    `${COLORS.GREEN}  ✅ Passed: workspace ${pkgName} [${bracket}] (${elapsedMs}ms)${COLORS.RESET}`,
  )
}

// eslint-disable-next-line no-console
console.log(`${COLORS.BLUE}  ✅ workspace gate complete.${COLORS.RESET}`)
