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

const rootDir = process.cwd()
const appsDir = path.join(rootDir, 'apps')

function toAppIdSegment(appName) {
  return appName.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function toTitleCase(value) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const requiredScripts = {
  'cap:sync': 'pnpm run build && pnpm exec cap sync',
  'cap:init:android': 'pnpm exec cap add android',
  'cap:init:ios': 'pnpm exec cap add ios',
  'cap:open:android': 'pnpm exec cap open android',
  'cap:open:ios': 'pnpm exec cap open ios',
  'cap:run:android': 'pnpm exec cap run android',
  'cap:run:ios': 'pnpm exec cap run ios',
}

function createCapConfig(appName) {
  const appId = `com.scottreinhart.${toAppIdSegment(appName)}`
  const appTitle = toTitleCase(appName)
  return `import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: '${appId}',
  appName: '${appTitle}',
  webDir: 'dist',
}

export default config
`
}

function run() {
  const appNames = fs
    .readdirSync(appsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))

  const changedPackages = []
  const createdConfigs = []

  for (const appName of appNames) {
    const pkgPath = path.join(appsDir, appName, 'package.json')
    if (!fs.existsSync(pkgPath)) continue

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    const scripts = pkg.scripts || {}
    let packageChanged = false

    for (const [scriptName, scriptValue] of Object.entries(requiredScripts)) {
      if (!scripts[scriptName]) {
        scripts[scriptName] = scriptValue
        packageChanged = true
      }
    }

    if (packageChanged) {
      pkg.scripts = scripts
      fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
      changedPackages.push(appName)
    }

    const capConfigPath = path.join(appsDir, appName, 'capacitor.config.ts')
    if (!fs.existsSync(capConfigPath)) {
      fs.writeFileSync(capConfigPath, createCapConfig(appName))
      createdConfigs.push(appName)
    }
  }

  console.log(
    JSON.stringify(
      {
        updatedPackageJson: changedPackages.length,
        createdCapacitorConfig: createdConfigs.length,
        packageApps: changedPackages,
        configApps: createdConfigs,
      },
      null,
      2,
    ),
  )
}

run()
