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
const SRC_DIR = path.join(ROOT, 'src')

const FORBIDDEN_IMPORTS = [
  'react',
  '@pixi/react',
  'pixi.js',
  'zustand',
  'howler',
  '@/ui',
  '@/app',
]

const files = []
const stack = [SRC_DIR]

while (stack.length > 0) {
  const current = stack.pop()
  if (!current) continue
  const entries = fs.readdirSync(current, { withFileTypes: true })
  for (const entry of entries) {
    const target = path.join(current, entry.name)
    if (entry.isDirectory()) {
      stack.push(target)
      continue
    }
    if (entry.isFile() && target.endsWith('.ts')) {
      files.push(target)
    }
  }
}

const violations = []
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  for (const forbidden of FORBIDDEN_IMPORTS) {
    const matcher = new RegExp(`from\\s+['"]${forbidden.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`)
    if (matcher.test(content)) {
      violations.push(`${path.relative(ROOT, file)} imports forbidden module "${forbidden}"`)
    }
  }
}

if (violations.length > 0) {
  console.error('Domain purity validation failed:')
  for (const violation of violations) {
    console.error(`- ${violation}`)
  }
  process.exit(1)
}

console.log(`Domain purity validation passed (${files.length} files checked).`)
