#!/usr/bin/env node

/**
 * Automated Lighthouse Accessibility Test (CI-Only / Optional)
 *
 * ⚠️ IMPORTANT: This is a CI-only fallback for accessibility auditing.
 * For LOCAL DEVELOPMENT: Use `pnpm test:a11y` (Playwright-based tests) instead.
 *
 * Lighthouse CLI is blocked in WSL headless environments (NO_FCP gate).
 * Use this script only in CI runners with:
 * - System Chrome or headless-shell with display backend (Xvfb)
 * - No WSL or with WSL display forwarding enabled
 *
 * Primary Local Test:
 *   pnpm test:a11y
 *   Location: tests/accessibility.a11y.spec.ts
 *   Coverage: WCAG AA keyboard nav, ARIA, focus, contrast, semantic HTML
 *
 * Secondary (CI-Only) Audit:
 *   pnpm test:lighthouse
 *   Location: apps/lights-out/scripts/test-lighthouse.js
 *   Coverage: Automated Lighthouse accessibility score
 *   Blocker: Requires display-backed browser (not WSL headless)
 *
 * Usage: pnpm test:lighthouse
 */

import { spawn } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'

const browserRoot =
  process.env.PLAYWRIGHT_BROWSERS_PATH?.trim() || path.join(os.homedir(), '.cache', 'ms-playwright')

function findLatestBrowserDir(prefix) {
  if (!fs.existsSync(browserRoot)) {
    return undefined
  }

  const matches = fs
    .readdirSync(browserRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name.startsWith(prefix))
    .sort((left, right) => right.localeCompare(left))

  return matches[0]
}

async function resolveChromePath() {
  if (process.env.CHROME_PATH) {
    return process.env.CHROME_PATH
  }

  const headlessShellDir = findLatestBrowserDir('chromium_headless_shell-')
  if (headlessShellDir) {
    const shellPath = path.join(browserRoot, headlessShellDir, 'chrome-headless-shell-linux64', 'chrome-headless-shell')
    if (fs.existsSync(shellPath)) {
      return shellPath
    }
  }

  try {
    const { chromium } = await import('playwright')
    const executablePath = chromium.executablePath()
    if (executablePath && fs.existsSync(executablePath)) {
      return executablePath
    }
  } catch {
    // No Playwright Chromium available; fallback to Lighthouse default browser discovery.
  }

  return undefined
}

async function isServerReady(url) {
  try {
    const response = await fetch(url)
    return response.ok
  } catch {
    return false
  }
}

async function waitForServer(url, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    if (await isServerReady(url)) {
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  throw new Error(`Timed out waiting for ${url}`)
}

async function runLighthouse() {
  const url = 'http://localhost:5173'
  const reportDir = path.join(process.cwd(), '.lighthouse-reports')
  const chromePath = await resolveChromePath()
  let devServer

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true })
  }

  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '') + '_' + Date.now()
  const jsonFile = path.join(reportDir, `lighthouse-${timestamp}.json`)

  console.log('🎯 Starting Lighthouse accessibility audit...')
  console.log(`📍 Testing URL: ${url}`)
  console.log(`📁 Reports will be saved to: ${reportDir}\n`)
  if (chromePath) {
    console.log(`🌐 Using Chrome executable: ${chromePath}\n`)
  }

  if (!(await isServerReady(url))) {
    devServer = spawn('pnpm', ['dev'], { stdio: ['ignore', 'pipe', 'pipe'] })
    devServer.stdout.on('data', (data) => process.stdout.write(data))
    devServer.stderr.on('data', (data) => process.stderr.write(data))
    await waitForServer(url)
  }

  if (!chromePath) {
    throw new Error('No Chrome executable found for Lighthouse')
  }

  try {
    await new Promise((resolve, reject) => {
      const lighthouse = spawn('pnpm', [
        'exec',
        'lighthouse',
        url,
        '--only-categories=accessibility',
        `--output-path=${jsonFile.replace(/\.json$/, '')}`,
        '--output=json,html',
        `--chrome-path=${chromePath}`,
        '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage --window-size=1920,1080 --disable-features=PaintHolding --disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-background-timer-throttling --run-all-compositor-stages-before-draw',
      ])

      lighthouse.stdout.on('data', (data) => {
        process.stdout.write(data)
      })

      lighthouse.stderr.on('data', (data) => {
        process.stderr.write(data)
      })

      lighthouse.on('close', (code) => {
        if (code === 0) {
          try {
            if (fs.existsSync(jsonFile)) {
              const report = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'))
              const score = Math.round(report.categories.accessibility.score * 100)

              console.log('\n✅ Audit Complete!\n')
              console.log(`📊 Accessibility Score: ${score}/100`)

              if (score >= 90) {
                console.log('🟢 PASS: Score meets WCAG AA threshold (90+)\n')
              } else {
                console.log('🟡 WARNING: Score below 90\n')
              }

              console.log('📄 Reports saved:')
              console.log(`   JSON: ${jsonFile}`)

              const htmlFileMatch = fs
                .readdirSync(reportDir)
                .find((name) => name.startsWith(`lighthouse-${timestamp}`) && name.endsWith('.html'))
              if (htmlFileMatch) {
                console.log(`   HTML: ${path.join(reportDir, htmlFileMatch)}`)
              }

              resolve(score)
            } else {
              reject(new Error('Report file not found'))
            }
          } catch (error) {
            reject(error)
          }
        } else {
          console.error(`❌ Lighthouse failed with code ${code}`)
          reject(new Error(`Lighthouse exited with code ${code}`))
        }
      })
    })
  } finally {
    if (devServer && !devServer.killed) {
      devServer.kill('SIGTERM')
    }
  }
}

runLighthouse()
  .then((score) => {
    process.exit(score >= 90 ? 0 : 1)
  })
  .catch((error) => {
    console.error('❌ Error:', error.message)
    process.exit(1)
  })