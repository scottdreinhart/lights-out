#!/usr/bin/env node

import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

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
const outputPath = path.join(rootDir, 'compliance', 'shareable-components-audit.json')

const componentExtensions = new Set(['.ts', '.tsx', '.css', '.module.css'])
const ignoredDirs = new Set(['node_modules', 'dist', 'build', 'release', 'coverage', '.turbo'])

const normalizeContent = (raw) => raw.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim()

const hashContent = (content) => crypto.createHash('sha256').update(content).digest('hex')

const collectComponentFiles = (dir) => {
  if (!fs.existsSync(dir)) return []
  const stack = [dir]
  const files = []

  while (stack.length > 0) {
    const current = stack.pop()
    const entries = fs.readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        if (!ignoredDirs.has(entry.name)) {
          stack.push(fullPath)
        }
        continue
      }

      const ext = entry.name.endsWith('.module.css')
        ? '.module.css'
        : path.extname(entry.name).toLowerCase()
      if (!componentExtensions.has(ext)) continue
      files.push(fullPath)
    }
  }

  return files
}

const apps = fs
  .readdirSync(appsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== 'ui')
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b))

const duplicatesByHash = new Map()
const candidatesByName = new Map()

for (const app of apps) {
  const uiDir = path.join(appsDir, app, 'src', 'ui')
  const files = collectComponentFiles(uiDir)
  for (const filePath of files) {
    const relative = path.relative(path.join(appsDir, app), filePath)
    const name = path.basename(filePath)
    const content = normalizeContent(fs.readFileSync(filePath, 'utf8'))
    if (content.length === 0) continue
    const hash = hashContent(content)

    if (!duplicatesByHash.has(hash)) {
      duplicatesByHash.set(hash, {
        hash,
        name,
        size: content.length,
        matches: [],
      })
    }
    duplicatesByHash.get(hash).matches.push({ app, file: relative })

    if (!candidatesByName.has(name)) {
      candidatesByName.set(name, {
        name,
        usages: [],
      })
    }
    candidatesByName.get(name).usages.push({ app, file: relative, hash })
  }
}

const identicalClusters = [...duplicatesByHash.values()]
  .filter((entry) => entry.matches.length >= 2)
  .sort((a, b) => b.matches.length - a.matches.length || a.name.localeCompare(b.name))
  .slice(0, 200)

const reusableByName = [...candidatesByName.values()]
  .map((entry) => {
    const uniqueApps = new Set(entry.usages.map((u) => u.app))
    const uniqueHashes = new Set(entry.usages.map((u) => u.hash))
    return {
      name: entry.name,
      appsUsing: uniqueApps.size,
      variantCount: uniqueHashes.size,
      canonicalizationPotential: uniqueApps.size >= 3 && uniqueHashes.size <= 3 ? 'high' : 'medium',
      usages: entry.usages,
    }
  })
  .filter((entry) => entry.appsUsing >= 3)
  .sort((a, b) => b.appsUsing - a.appsUsing || a.variantCount - b.variantCount)
  .slice(0, 200)

const report = {
  metadata: {
    generatedAt: new Date().toISOString(),
    totalAppsScanned: apps.length,
    scope: 'apps/*/src/ui/**',
    method: 'normalized content hash + shared component filename clustering',
  },
  summary: {
    identicalComponentClusters: identicalClusters.length,
    reusableComponentNameClusters: reusableByName.length,
  },
  identicalClusters,
  reusableByName,
}

fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n', 'utf8')
console.log(`Shareable component audit written to ${path.relative(rootDir, outputPath)}`)
console.log(
  `Found ${report.summary.identicalComponentClusters} identical clusters and ${report.summary.reusableComponentNameClusters} reusable name clusters.`,
)
