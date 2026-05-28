#!/usr/bin/env node

import fs from 'node:fs'
import os from 'node:os'
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

const browserRoot =
  process.env.PLAYWRIGHT_BROWSERS_PATH?.trim() || path.join(os.homedir(), '.cache', 'ms-playwright')

const requiredBrowsers = ['chromium', 'firefox', 'webkit']

function findMatchingDirs(browserName) {
  if (!fs.existsSync(browserRoot)) return []
  return fs
    .readdirSync(browserRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name.startsWith(`${browserName}-`))
    .sort((a, b) => a.localeCompare(b))
}

// eslint-disable-next-line no-console
console.log(`${COLORS.CYAN}👮 Playwright browser cache: ${browserRoot}${COLORS.RESET}`)

const missing = []
for (const browserName of requiredBrowsers) {
  const matches = findMatchingDirs(browserName)
  if (matches.length === 0) {
    missing.push(browserName)
    // eslint-disable-next-line no-console
    console.error(`${COLORS.RED}  ❌ Missing: ${browserName}${COLORS.RESET}`)
    continue
  }

  // eslint-disable-next-line no-console
  console.log(`${COLORS.GREEN}  ✅ ${browserName}: ${matches[0]}${COLORS.RESET}`)
}

if (missing.length > 0) {
  // eslint-disable-next-line no-console
  console.error(
    `\nInstall the shared browser set with: pnpm playwright:install (or pnpm exec playwright install chromium firefox webkit)`,
  )
  process.exit(1)
}

// eslint-disable-next-line no-console
console.log('All required Playwright browsers are installed.')
