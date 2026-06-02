#!/usr/bin/env node

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

const chunkSize = Math.max(1, Number.parseInt(getArg('--chunk', '200'), 10))
const scopeArg = getArg('--scope', '.')
const failFast = !args.includes('--no-fail-fast')
const scopeDir = path.resolve(ROOT, scopeArg)

if (!fs.existsSync(scopeDir)) {
  // eslint-disable-next-line no-console
  console.error(`Scope path does not exist: ${scopeArg}`)
  process.exit(2)
}

const VALID_PATTERNS = [
  /^[a-z0-9._-]+\.unit\.test\.tsx?$/i,
  /^[a-z0-9._-]+\.integration\.test\.tsx?$/i,
  /^[a-z0-9._-]+\.component\.test\.tsx?$/i,
  /^[a-z0-9._-]+\.api\.test\.tsx?$/i,
  /^[a-z0-9._-]+\.e2e\.spec\.tsx?$/i,
  /^[a-z0-9._-]+\.a11y\.spec\.tsx?$/i,
  /^[a-z0-9._-]+\.visual\.spec\.tsx?$/i,
  /^[a-z0-9._-]+\.(perf|load|stress|soak|spike)\.js$/i,
]

const IGNORE_DIRS = new Set([
  'node_modules',
  'dist',
  'release',
  '.next',
  '.turbo',
  '.git',
  'coverage',
  'playwright-report',
  'test-results',
  '.cache',
  '.pnpm-store',
])

function resolveWorkspaceRoot(targetDir) {
  const rel = path.relative(ROOT, targetDir)
  const parts = rel.split(path.sep)

  if (parts[0] === 'apps' && parts[1]) return path.join(ROOT, 'apps', parts[1])
  if (parts[0] === 'packages' && parts[1]) return path.join(ROOT, 'packages', parts[1])
  if (parts[0] === 'tooling' && parts[1]) return path.join(ROOT, 'tooling', parts[1])
  return ROOT
}

function isCandidateTestFile(filePath) {
  const basename = path.basename(filePath)
  return (
    /\.test\.tsx?$/i.test(basename) ||
    /\.spec\.tsx?$/i.test(basename) ||
    /\.(perf|load|stress|soak|spike)\.js$/i.test(basename)
  )
}

function collectCandidateFiles(startDir) {
  const files = []
  const stack = [startDir]

  while (stack.length) {
    const current = stack.pop()
    const entries = fs.readdirSync(current, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        if (IGNORE_DIRS.has(entry.name)) continue
        stack.push(fullPath)
        continue
      }
      if (!isCandidateTestFile(fullPath)) continue
      files.push(fullPath)
    }
  }

  return files.sort((a, b) => a.localeCompare(b))
}

function getFeatureName(filePath) {
  const basename = path.basename(filePath)
  const parts = basename.split('.')
  return parts[0]
}

function isValidTestName(filePath) {
  const basename = path.basename(filePath)
  return VALID_PATTERNS.some((pattern) => pattern.test(basename))
}

function isValidFilename(filePath) {
  const basename = path.basename(filePath)
  if (/^test[.-]/.test(basename)) return false
  if (/test\.[a-z]+\.ts/.test(basename)) return false
  if (/spec\.[a-z]+\.ts/.test(basename)) return false
  if (basename === 'test.ts' || basename === 'test.tsx') return false
  if (basename === 'index.test.ts' || basename === 'index.spec.ts') return false
  if (basename === 'app.test.ts' || basename === 'app.spec.ts') return false
  if (basename === 'main.test.ts' || basename === 'main.spec.ts') return false
  return isValidTestName(filePath)
}

function determineErrorReason(filePath) {
  const basename = path.basename(filePath)
  if (/^test[.-]/.test(basename)) return 'Feature name must come first (test.* is reversed)'
  if (/\.test\.[a-z]+\./.test(basename))
    return 'Test type must follow feature name (feature.type.test.ts)'
  if (/^[a-z.]+\.(spec|test)\.ts$/.test(basename))
    return 'Missing explicit test type (unit/integration/component/api/e2e/a11y/visual/perf)'
  return 'Does not match approved test naming patterns'
}

function getSuggestions(filePath) {
  const feature = getFeatureName(filePath)
  return [`${feature}.unit.test.ts`, `${feature}.integration.test.tsx`, `${feature}.e2e.spec.ts`]
}

function chunk(items, size) {
  const chunks = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

function groupByWorkspace(files) {
  const groups = new Map()
  for (const file of files) {
    const workspace = resolveWorkspaceRoot(path.dirname(file))
    if (!groups.has(workspace)) groups.set(workspace, [])
    groups.get(workspace).push(file)
  }
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))
}

function formatRemaining(count) {
  return count === 1 ? '1 more' : `${count} more`
}

// eslint-disable-next-line no-console
console.log(`${COLORS.BLUE}  🔍 test name gate start (segments are workspace/file batches of test files)...${COLORS.RESET}`)
// eslint-disable-next-line no-console
console.log(
  `${COLORS.WHITE}  Scope=${path.relative(ROOT, scopeDir) || '.'}, chunk=${chunkSize}, failFast=${String(failFast)}, metric=test names${COLORS.RESET}`,
)

const files = collectCandidateFiles(scopeDir)
if (files.length === 0) {
  // eslint-disable-next-line no-console
  console.log(`${COLORS.YELLOW}  ℹ️  No test files found.${COLORS.RESET}`)
  process.exit(0)
}

const grouped = groupByWorkspace(files)
const totalBrackets = grouped.reduce(
  (sum, [, groupFiles]) => sum + chunk(groupFiles, chunkSize).length,
  0,
)

let bracketIndex = 0
let validCount = 0
let invalidCount = 0
const invalidFiles = []

for (const [workspaceDir, workspaceFiles] of grouped) {
  const batches = chunk(workspaceFiles, chunkSize)
  for (const batch of batches) {
    const label = `${bracketIndex + 1}/${totalBrackets}`
    const workspaceLabel = path.relative(ROOT, workspaceDir) || '.'
    const remaining = totalBrackets - bracketIndex - 1
    // eslint-disable-next-line no-console
    console.log(
      `${COLORS.MAGENTA}\n  📚 [${label}] test-name segment for ${workspaceLabel} (${formatRemaining(remaining)}; segment = a batch of test files within one workspace)${COLORS.RESET}`,
    )
    // eslint-disable-next-line no-console
    console.log(`${COLORS.WHITE}  Files: ${batch.length}${COLORS.RESET}`)

    for (const file of batch) {
      if (isValidFilename(file)) {
        validCount += 1
        continue
      }

      invalidCount += 1
      invalidFiles.push(file)
      // eslint-disable-next-line no-console
      console.error(`${COLORS.RED}\n  ❌ INVALID TEST NAME (metric=test names): ${path.relative(ROOT, file)}${COLORS.RESET}`)
      // eslint-disable-next-line no-console
      console.error(`${COLORS.RED}     Reason: ${determineErrorReason(file)}${COLORS.RESET}`)
      // eslint-disable-next-line no-console
      console.error(`${COLORS.RED}     Suggested: ${getSuggestions(file).join(' | ')}${COLORS.RESET}`)

      if (failFast) {
        // eslint-disable-next-line no-console
        console.error(`${COLORS.RED}  ❌ TEST NAME GATE FAILED (fail-fast)${COLORS.RESET}`)
        process.exit(1)
      }
    }

    // eslint-disable-next-line no-console
    console.log(
      `${COLORS.YELLOW}  ✅ Passed: metric=test names for ${workspaceLabel} [${label}]${COLORS.RESET}`,
    )
    bracketIndex += 1
  }
}

// eslint-disable-next-line no-console
console.log(`${COLORS.WHITE}  ${'='.repeat(70)}${COLORS.RESET}`)
// eslint-disable-next-line no-console
console.log(`${COLORS.WHITE}  📚 Summary: ${validCount} valid, ${invalidCount} invalid (metric=test names)${COLORS.RESET}`)
// eslint-disable-next-line no-console
console.log(`${COLORS.WHITE}  ${'='.repeat(70)}${COLORS.RESET}\n`)

if (invalidCount > 0) {
  // eslint-disable-next-line no-console
  console.error(`${COLORS.RED}  ❌ TEST NAME GATE FAILED${COLORS.RESET}`)
  // eslint-disable-next-line no-console
  console.error(`${COLORS.RED}  See docs/TEST_NAMING_CONVENTION.md for complete rules.${COLORS.RESET}`)
  process.exit(1)
}

// eslint-disable-next-line no-console
console.log(`${COLORS.GREEN}  ✅ test name gate complete.${COLORS.RESET}`)
