#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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
const rootDir = path.resolve(__dirname, '..')
const appsDir = path.join(rootDir, 'apps')
const reportPath = path.join(rootDir, 'compliance', 'platform-approval-report.json')
const matrixPath = path.join(rootDir, 'compliance', 'matrix.json')

const electronScripts = {
  'electron:dev': 'pnpm run build && electron .',
  'electron:preview': 'pnpm run build && electron .',
  'electron:build': 'pnpm run build && pnpm exec electron-builder --publish never',
  'electron:build:win': 'pnpm run build && pnpm exec electron-builder --win --publish never',
  'electron:build:linux': 'pnpm run build && pnpm exec electron-builder --linux --publish never',
  'electron:build:mac': 'pnpm run build && pnpm exec electron-builder --mac --publish never',
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

function ensureFile(filePath, content) {
  if (fs.existsSync(filePath)) return false
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
  return true
}

function mainJsContent() {
  return `import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  })

  const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'
  if (!app.isPackaged) {
    win.loadURL(devUrl)
    return
  }

  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
`
}

function preloadJsContent() {
  return `import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {})
`
}

function run() {
  let targetApps = []
  if (fs.existsSync(reportPath)) {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
    targetApps = Object.entries(report.results || {})
      .filter(([, platforms]) => platforms?.electron?.verdict === 'FAIL')
      .filter(([, platforms]) =>
        (platforms.electron.automatedChecks || []).some(
          (check) => check.id === 'requirements-coverage' && check.status === 'FAIL',
        ),
      )
      .map(([appId]) => appId)
  }

  // Fallback to current matrix if approval report did not yield targets.
  if (targetApps.length === 0 && fs.existsSync(matrixPath)) {
    const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'))
    targetApps = Object.entries(matrix?.matrix || {})
      .filter(([, platforms]) => platforms?.electron?.status !== 'complete')
      .map(([appId]) => appId)
  }

  const changed = []
  for (const appName of targetApps) {
    const pkgPath = path.join(appsDir, appName, 'package.json')
    if (!fs.existsSync(pkgPath)) continue
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

    let pkgChanged = false
    if (!pkg.scripts || typeof pkg.scripts !== 'object') pkg.scripts = {}
    for (const [script, command] of Object.entries(electronScripts)) {
      if (!pkg.scripts[script]) {
        pkg.scripts[script] = command
        pkgChanged = true
      }
    }

    if (!pkg.main) {
      pkg.main = 'electron/main.js'
      pkgChanged = true
    }
    if (!pkg.build || typeof pkg.build !== 'object') {
      pkg.build = {}
      pkgChanged = true
    }
    if (!pkg.build.appId) {
      pkg.build.appId = `com.scottreinhart.${toAppIdSegment(appName)}`
      pkgChanged = true
    }
    if (!pkg.build.productName) {
      pkg.build.productName = toTitleCase(appName)
      pkgChanged = true
    }

    if (pkgChanged) {
      fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
    }

    const mainCreated = ensureFile(path.join(appsDir, appName, 'electron', 'main.js'), mainJsContent())
    const preloadCreated = ensureFile(
      path.join(appsDir, appName, 'electron', 'preload.js'),
      preloadJsContent(),
    )

    changed.push({
      appName,
      packageUpdated: pkgChanged,
      mainCreated,
      preloadCreated,
    })
  }

  console.log(JSON.stringify({ targeted: targetApps.length, changed }, null, 2))
}

run()
