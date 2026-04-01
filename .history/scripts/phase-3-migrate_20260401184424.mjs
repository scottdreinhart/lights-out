#!/usr/bin/env node
/**
 * Phase 3: Context Consolidation Migration
 * 
 * ✅ Step 1: Add @games/sound-context and @games/theme-context path mappings to all 25 app tsconfigs
 * ✅ Step 2: Migrate 25 apps to use shared sound-context
 * ✅ Step 3: Migrate 25 apps to use shared theme-context factory
 */

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const APPS_DIR = path.join(ROOT, 'apps')

const SOUND_CONTEXT_TEMPLATE = `import type { ReactNode } from 'react'
import { SoundProvider, useSoundContext } from '@games/sound-context'

export { useSoundContext }
export { SoundProvider }
`

const THEME_CONTEXT_TEMPLATE = (appName) => `import { createThemeContext } from '@games/theme-context'
import useTheme from './useTheme'

const { ThemeProvider, useThemeContext } = createThemeContext(useTheme)

export { ThemeProvider, useThemeContext }
`

async function getAppDirs() {
  const entries = await fs.readdir(APPS_DIR, { withFileTypes: true })
  return entries.filter((e) => e.isDirectory() && e.name !== 'ui').map((e) => e.name)
}

async function updateTsConfig(appName) {
  const tsconfigPath = path.join(APPS_DIR, appName, 'tsconfig.json')

  try {
    const content = await fs.readFile(tsconfigPath, 'utf8')
    const config = JSON.parse(content)

    // Add path mappings if not present
    if (!config.compilerOptions.paths) {
      config.compilerOptions.paths = {}
    }

    const addedPaths = []

    if (!config.compilerOptions.paths['@games/sound-context']) {
      config.compilerOptions.paths['@games/sound-context'] = ['../../packages/sound-context/src']
      addedPaths.push('sound-context')
    }

    if (!config.compilerOptions.paths['@games/theme-context']) {
      config.compilerOptions.paths['@games/theme-context'] = ['../../packages/theme-context/src']
      addedPaths.push('theme-context')
    }

    if (addedPaths.length > 0) {
      await fs.writeFile(tsconfigPath, JSON.stringify(config, null, 2) + '\n')
      return { success: true, paths: addedPaths }
    }
    return { success: true, paths: [] }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

async function migrateContext(appName, contextType) {
  const srcDir = path.join(APPS_DIR, appName, 'src', 'app')
  const contextPath = path.join(srcDir, `${contextType}Context.tsx`)

  // Check if file exists
  try {
    await fs.access(contextPath)
  } catch {
    return { success: false, reason: 'not_found' }
  }

  try {
    if (contextType === 'Sound') {
      await fs.writeFile(contextPath, SOUND_CONTEXT_TEMPLATE)
    } else if (contextType === 'Theme') {
      await fs.writeFile(contextPath, THEME_CONTEXT_TEMPLATE(appName))
    }
    return { success: true }
  } catch (e) {
    return { success: false, reason: e.message }
  }
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════════════╗
║ PHASE 3: Context Consolidation Migration                          ║
║                                                                    ║
║ Creating shared @games/sound-context and @games/theme-context    ║
│ and migrating 25 apps to use them                                  ║
╚════════════════════════════════════════════════════════════════════╝
`)

  const apps = await getAppDirs()
  console.log(`\nDiscovered ${apps.length} apps\n`)

  // STEP 1: Update tsconfig.json files
  console.log('STEP 1: Update tsconfig.json files with new package path mappings')
  console.log('━'.repeat(70))

  let updatedCount = 0
  for (const app of apps) {
    const result = await updateTsConfig(app)
    if (result.success && result.paths.length > 0) {
      console.log(`  ✅ ${app}: Added paths for ${result.paths.join(', ')}`)
      updatedCount++
    }
  }
  console.log(`\nSummary: ${updatedCount}/${apps.length} apps updated\n`)

  // STEP 2: Migrate Sound context
  console.log('STEP 2: Migrate SoundContext to use @games/sound-context')
  console.log('━'.repeat(70))

  let migratedSound = 0
  for (const app of apps) {
    const result = await migrateContext(app, 'Sound')
    if (result.success) {
      console.log(`  ✅ ${app}: Migrated SoundContext`)
      migratedSound++
    }
  }
  console.log(`\nSummary: ${migratedSound}/${apps.length} apps migrated\n`)

  // STEP 3: Migrate Theme context
  console.log('STEP 3: Migrate ThemeContext to use @games/theme-context factory')
  console.log('━'.repeat(70))

  let migratedTheme = 0
  for (const app of apps) {
    const result = await migrateContext(app, 'Theme')
    if (result.success) {
      console.log(`  ✅ ${app}: Migrated ThemeContext`)
      migratedTheme++
    }
  }
  console.log(`\nSummary: ${migratedTheme}/${apps.length} apps migrated\n`)

  console.log(`╔════════════════════════════════════════════════════════════════════╗`)
  console.log(`║ PHASE 3 BATCH MIGRATION: COMPLETE                                 ║`)
  console.log(`║                                                                    ║`)
  console.log(`║ ✅ Updated: ${updatedCount}/${apps.length} apps' tsconfig.json                     ║`)
  console.log(`║ ✅ Migrated: ${migratedSound}/${apps.length} apps' SoundContext                   ║`)
  console.log(`║ ✅ Migrated: ${migratedTheme}/${apps.length} apps' ThemeContext                   ║`)
  console.log(`║                                                                    ║`)
  console.log(`║ NEXT STEPS:                                                        ║`)
  console.log(`║ 1. Run: pnpm typecheck (verify all types resolve)                 ║`)
  console.log(`║ 2. Run: pnpm lint (check code style)                              ║`)
  console.log(`║ 3. Commit: "refactor(apps): Migrate to shared context packages"   ║`)
  console.log(`╚════════════════════════════════════════════════════════════════════╝`)
}

main().catch(console.error)
