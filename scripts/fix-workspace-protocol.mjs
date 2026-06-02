#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const APPS_DIR = path.join(ROOT, 'apps')

const apps = fs
  .readdirSync(APPS_DIR)
  .filter((name) => fs.statSync(path.join(APPS_DIR, name)).isDirectory() && name !== 'ui')

console.log(`${COLORS.CYAN}🔧 Fixing workspace protocol in ${apps.length} apps...${COLORS.RESET}\n`)

apps.forEach((appName) => {
  const pkgPath = path.join(APPS_DIR, appName, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  
  if (pkg.dependencies) {
    Object.keys(pkg.dependencies).forEach((dep) => {
      if (dep.startsWith('@games/') && pkg.dependencies[dep] === '*') {
        pkg.dependencies[dep] = 'workspace:*'
      }
    })
  }
  
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  console.log(`${COLORS.GREEN}✅ ${appName}${COLORS.RESET}`)
})

console.log(`\n✨ Fixed workspace protocol in ${apps.length} apps!`)
