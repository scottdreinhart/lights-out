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

const scriptScaffold = {
  'platform:meta:build': 'pnpm run build',
  'platform:twitch:build': 'pnpm run build',
  'platform:crazygames:build': 'pnpm run build',
  'platform:discord:build': 'pnpm run build',
  'platform:telegram:build': 'pnpm run build',
  'platform:steam:build': 'pnpm run build',
}

function listApps() {
  return fs
    .readdirSync(appsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name !== 'ui')
    .filter((name) => fs.existsSync(path.join(appsDir, name, 'package.json')))
    .sort((a, b) => a.localeCompare(b))
}

function ensureJsonFile(filePath, content) {
  if (fs.existsSync(filePath)) return false
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`)
  return true
}

function ensureDir(dirPath) {
  if (fs.existsSync(dirPath)) return false
  fs.mkdirSync(dirPath, { recursive: true })
  return true
}

function run() {
  const apps = listApps()
  const summary = []

  for (const appName of apps) {
    const appDir = path.join(appsDir, appName)
    const pkgPath = path.join(appDir, 'package.json')
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    if (!pkg.scripts || typeof pkg.scripts !== 'object') pkg.scripts = {}

    const addedScripts = []
    for (const [scriptName, command] of Object.entries(scriptScaffold)) {
      if (!pkg.scripts[scriptName]) {
        pkg.scripts[scriptName] = command
        addedScripts.push(scriptName)
      }
    }

    if (addedScripts.length > 0) {
      fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
    }

    const created = []

    if (ensureJsonFile(path.join(appDir, 'platform/meta/manifest.json'), { app: appName, platform: 'meta' })) {
      created.push('platform/meta/manifest.json')
    }
    if (ensureDir(path.join(appDir, 'platform/meta/assets'))) {
      created.push('platform/meta/assets/')
    }
    if (
      ensureJsonFile(path.join(appDir, 'platform/meta/assets/index.json'), {
        app: appName,
        note: 'Asset manifest placeholder for inspection contract.',
      })
    ) {
      created.push('platform/meta/assets/index.json')
    }

    if (
      ensureJsonFile(path.join(appDir, 'platform/twitch/metadata.json'), {
        app: appName,
        platform: 'twitch',
      })
    ) {
      created.push('platform/twitch/metadata.json')
    }
    if (
      ensureJsonFile(path.join(appDir, 'platform/twitch/manifest.json'), {
        app: appName,
        platform: 'twitch',
      })
    ) {
      created.push('platform/twitch/manifest.json')
    }

    if (
      ensureJsonFile(path.join(appDir, 'platform/crazygames/manifest.json'), {
        app: appName,
        platform: 'crazygames',
      })
    ) {
      created.push('platform/crazygames/manifest.json')
    }
    if (
      ensureJsonFile(path.join(appDir, 'platform/crazygames/sdk.json'), {
        app: appName,
        sdk: 'crazygames',
        mode: 'placeholder',
      })
    ) {
      created.push('platform/crazygames/sdk.json')
    }

    if (
      ensureJsonFile(path.join(appDir, 'platform/discord/activity.json'), {
        app: appName,
        platform: 'discord',
      })
    ) {
      created.push('platform/discord/activity.json')
    }
    if (
      ensureJsonFile(path.join(appDir, 'platform/discord/sdk.json'), {
        app: appName,
        sdk: 'discord-embedded-app',
        mode: 'placeholder',
      })
    ) {
      created.push('platform/discord/sdk.json')
    }

    if (
      ensureJsonFile(path.join(appDir, 'platform/telegram/manifest.json'), {
        app: appName,
        platform: 'telegram',
      })
    ) {
      created.push('platform/telegram/manifest.json')
    }
    if (
      ensureJsonFile(path.join(appDir, 'platform/telegram/sdk.json'), {
        app: appName,
        sdk: 'telegram-mini-app',
        mode: 'placeholder',
      })
    ) {
      created.push('platform/telegram/sdk.json')
    }

    if (
      ensureJsonFile(path.join(appDir, 'platform/steam/manifest.json'), {
        app: appName,
        platform: 'steam',
      })
    ) {
      created.push('platform/steam/manifest.json')
    }
    if (
      ensureJsonFile(path.join(appDir, 'platform/steam/store.json'), {
        app: appName,
        platform: 'steam',
      })
    ) {
      created.push('platform/steam/store.json')
    }

    summary.push({ app: appName, addedScripts, created })
  }

  const changedPackages = summary.filter((item) => item.addedScripts.length > 0).length
  const createdFiles = summary.reduce((sum, item) => sum + item.created.length, 0)

  console.log(
    JSON.stringify(
      {
        appsProcessed: apps.length,
        packageJsonUpdated: changedPackages,
        filesAndDirsCreated: createdFiles,
      },
      null,
      2,
    ),
  )
}

run()
