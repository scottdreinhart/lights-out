#!/usr/bin/env node
/**
 * Phase 1 Migration: Convert all app-local useStats.ts to use shared factory
 * Usage: node scripts/phase-1-migrate-stats.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { execSync } from 'child_process'

const PROJECT_ROOT = resolve(process.cwd())
const APPS_DIR = resolve(PROJECT_ROOT, 'apps')

// Get all useStats.ts files
const output = execSync(`find ${APPS_DIR} -name "useStats.ts" -type f`, {
  encoding: 'utf-8',
})
const statsFiles = output.split('\n').filter(Boolean).sort()

console.log(`Found ${statsFiles.length} useStats.ts files to migrate\n`)

const results = {
  success: [],
  error: [],
}

for (const filepath of statsFiles) {
  try {
    // Extract app name from path
    const match = filepath.match(/\/apps\/([^/]+)\//)
    if (!match) {
      throw new Error(`Could not extract app name from path: ${filepath}`)
    }
    const appName = match[1]

    // Skip if already converted (check for 'createUseStatsHook')
    const content = readFileSync(filepath, 'utf-8')
    if (content.includes('createUseStatsHook')) {
      console.log(`✓ SKIPPED: ${appName} (already migrated)`)
      continue
    }

    // Generate new content using factory pattern
    const newContent = `/**
 * useStats — win/loss/streak tracking persisted to localStorage.
 * Configured via shared factory with app-specific storage key.
 */

import { createUseStatsHook } from '@games/app-hook-utils'

import { DEFAULT_STATS } from '@/domain/constants'

import { load, save } from './storageService'

export const useStats = createUseStatsHook({
  storageKey: '${appName}-stats',
  defaultStats: DEFAULT_STATS,
  load,
  save,
})
`

    // Write the new file
    writeFileSync(filepath, newContent, 'utf-8')
    console.log(`✓ CONVERTED: ${appName}`)
    results.success.push(appName)
  } catch (error) {
    console.error(`✗ ERROR: ${filepath} - ${error.message}`)
    results.error.push({ filepath, error: error.message })
  }
}

console.log(`\n${'='.repeat(60)}`)
console.log(`Success: ${results.success.length} apps converted`)
console.log(`Errors: ${results.error.length}`)

if (results.error.length > 0) {
  console.log('\nFailed apps:')
  results.error.forEach(({ filepath, error }) => {
    console.log(`  - ${filepath}: ${error}`)
  })
  process.exit(1)
}

console.log(`\nApps migrated:`)
results.success.forEach((app) => console.log(`  - ${app}`))
console.log(`\n✓ Phase 1: useStats migration complete!`)
