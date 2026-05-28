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

function isElectronApp(pkg) {
  const scripts = pkg?.scripts || {}
  return Object.entries(scripts).some(([name, value]) => {
    const cmd = String(value || '')
    return (
      name.startsWith('electron:') || cmd.includes('electron-builder') || cmd.includes(' electron .')
    )
  })
}

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

function run() {
  const appNames = fs
    .readdirSync(appsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))

  const changed = []
  for (const appName of appNames) {
    const pkgPath = path.join(appsDir, appName, 'package.json')
    if (!fs.existsSync(pkgPath)) continue

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    if (!isElectronApp(pkg)) continue

    const beforeAppId = pkg?.build?.appId
    const beforeProductName = pkg?.build?.productName
    if (beforeAppId && beforeProductName) continue

    if (!pkg.build || typeof pkg.build !== 'object') {
      pkg.build = {}
    }
    if (!pkg.build.appId) {
      pkg.build.appId = `com.scottreinhart.${toAppIdSegment(appName)}`
    }
    if (!pkg.build.productName) {
      pkg.build.productName = toTitleCase(appName)
    }

    fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
    changed.push({
      appName,
      appId: pkg.build.appId,
      productName: pkg.build.productName,
    })
  }

  console.log(
    JSON.stringify(
      {
        changed: changed.length,
        apps: changed,
      },
      null,
      2,
    ),
  )
}

run()
