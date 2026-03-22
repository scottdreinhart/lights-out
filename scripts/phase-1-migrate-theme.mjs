#!/usr/bin/env node
/**
 * Phase 1 Migration: Convert all app-local useTheme.ts to use shared factory
 * Usage: node scripts/phase-1-migrate-theme.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { execSync } from 'child_process'

const PROJECT_ROOT = resolve(process.cwd())
const APPS_DIR = resolve(PROJECT_ROOT, 'apps')

// Get all useTheme.ts files
const output = execSync(
  `find ${APPS_DIR} -name "useTheme.ts" -type f ! -path "*/node_modules/*"`,
  {
    encoding: 'utf-8',
  }
)
const themeFiles = output.split('\n').filter(Boolean).sort()

console.log(`Found ${themeFiles.length} useTheme.ts files to migrate\n`)

const results = {
  success: [],
  skipped: [],
  error: [],
}

for (const filepath of themeFiles) {
  try {
    // Extract app name from path
    const match = filepath.match(/\/apps\/([^/]+)\//)
    if (!match) {
      throw new Error(`Could not extract app name from path: ${filepath}`)
    }
    const appName = match[1]

    // Skip if already converted (check for 'createUseThemeHook')
    const content = readFileSync(filepath, 'utf-8')
    if (content.includes('createUseThemeHook')) {
      console.log(`✓ SKIPPED: ${appName} (already migrated)`)
      results.skipped.push(appName)
      continue
    }

    // Generate new content using factory pattern
    const newContent = `/**
 * useTheme — Theme switching and persistence.
 * Configured via shared factory with app-specific storage key.
 */

import { createUseThemeHook } from '@games/app-hook-utils'

import { DEFAULT_SETTINGS } from '@/domain/themes'

import { load, save } from './storageService'

export const useTheme = createUseThemeHook({
  storageKey: '${appName}-theme-settings',
  defaultSettings: DEFAULT_SETTINGS,
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
console.log(`Skipped: ${results.skipped.length} (already migrated)`)
console.log(`Errors: ${results.error.length}`)

if (results.error.length > 0) {
  console.log('\nFailed apps:')
  results.error.forEach(({ filepath, error }) => {
    console.log(`  - ${filepath}: ${error}`)
  })
  process.exit(1)
}

if (results.success.length > 0) {
  console.log(`\nApps migrated:`)
  results.success.forEach((app) => console.log(`  - ${app}`))
}

console.log(`\n✓ Phase 1: useTheme migration complete!`)
