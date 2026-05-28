#!/usr/bin/env node

/**
 * Bulk Apply SharedSplashScreen Pattern to All Games
 *
 * This script:
 * 1. Iterates through all games in apps/
 * 2. For each game, creates/updates atoms/SplashScreen.tsx to wrap SharedSplashScreen
 * 3. Updates atoms/index.ts to export SplashScreen
 * 4. Updates organisms/App.tsx to use callback-based lifecycle
 *
 * Pattern:
 * - atoms/SplashScreen.tsx: Simple wrapper around SharedSplashScreen with game-specific visuals
 * - atoms/index.ts: Barrel export of SplashScreen
 * - organisms/App.tsx: Add handleSplashComplete callback, wire to <SplashScreen>
 */

import fs from 'fs-extra'
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
const APPS_DIR = path.join(__dirname, '..', 'apps')

// Games to skip (already properly wired or have structural issues)
const SKIP_GAMES = ['ui', 'lights-out'] // ui is shared, lights-out is Electron app

// Games with pre-existing structural issues (missing index.html, etc.)
const STRUCTURAL_ISSUES = [
  'blackjack',
  'war',
  'crossclimb',
  'dominoes',
  'snakes-and-ladders',
  'tango',
  'go-fish',
  'zip',
]

const SKIP_GAMES_SET = new Set([...SKIP_GAMES, ...STRUCTURAL_ISSUES])

/**
 * Get all game directories
 */
function getGameDirs() {
  const entries = fs.readdirSync(APPS_DIR, { withFileTypes: true })
  return entries
    .filter((e) => e.isDirectory() && !SKIP_GAMES_SET.has(e.name))
    .map((e) => ({ name: e.name, path: path.join(APPS_DIR, e.name) }))
}

/**
 * Check if a game is properly structured (has package.json, src/, etc.)
 */
function isProperlyStructured(gamePath) {
  return (
    fs.existsSync(path.join(gamePath, 'package.json')) &&
    fs.existsSync(path.join(gamePath, 'src')) &&
    fs.existsSync(path.join(gamePath, 'tsconfig.json'))
  )
}

/**
 * Create a generic atoms/SplashScreen.tsx that wraps SharedSplashScreen
 * Uses a simple animated container as the visual
 */
function createGenericSplashScreen(gameName) {
  const titleCase = gameName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return `/**
 * SplashScreen — Animated splash screen wrapper using SharedSplashScreen.
 * Provides game-specific visuals while managing lifecycle via shared component.
 */

import { SplashScreen as SharedSplashScreen } from '@games/common'

interface SplashScreenProps {
  onComplete?: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <SharedSplashScreen
      onComplete={onComplete}
      minimumDuration={1500}
      title="${titleCase.toUpperCase()}"
    >
      <div className="splash-content">
        <div className="splash-logo">
          <div className="splash-logo-inner" />
        </div>
      </div>
    </SharedSplashScreen>
  )
}
`
}

/**
 * Update atoms/index.ts to export SplashScreen if not already there
 */
function updateAtomsBarrel(gamePath, gameName) {
  const indexPath = path.join(gamePath, 'src', 'ui', 'atoms', 'index.ts')

  if (!fs.existsSync(indexPath)) {
    // Create minimal barrel if it doesn't exist
    fs.writeFileSync(
      indexPath,
      `export { ErrorBoundary, OfflineIndicator } from '@games/common'\nexport { SplashScreen } from './SplashScreen'\n`,
      'utf-8',
    )
    return 'created'
  }

  let content = fs.readFileSync(indexPath, 'utf-8')

  // Check if SplashScreen is already exported
  if (
    content.includes('export { SplashScreen }') ||
    content.includes("export { SplashScreen } from './SplashScreen'")
  ) {
    return 'already-exported'
  }

  // Add SplashScreen export
  if (!content.includes('export { SplashScreen }')) {
    if (content.includes('export {')) {
      // Append to end if other exports exist
      content += "\nexport { SplashScreen } from './SplashScreen'\n"
    } else {
      // Create new export section
      content = `export { ErrorBoundary, OfflineIndicator } from '@games/common'\nexport { SplashScreen } from './SplashScreen'\n`
    }
    fs.writeFileSync(indexPath, content, 'utf-8')
    return 'updated'
  }

  return 'no-change'
}

/**
 * Check if App.tsx already has handleSplashComplete callback
 */
function hasCallback(content) {
  return content.includes('handleSplashComplete') || content.includes('onComplete={')
}

/**
 * Extract the phase/screen type name from App.tsx
 */
function getScreenPhaseType(content) {
  // Try to find type definition like: type AppScreen = '...' | '...' | ...
  const typeMatch = content.match(/type\s+(\w+)\s*=\s*['"]([^'"]+)['"]/)
  if (typeMatch) return typeMatch[1]

  // Try to find type definition with multiple options
  const multiMatch = content.match(/type\s+(\w+)\s*=\s*['"]splash['"]/)
  if (multiMatch) return multiMatch[1]

  // Default fallback
  return 'screen' // or 'phase', 'AppScreen', etc. - we'll use this as generic
}

/**
 * Extract the initial state screen/phase from App.tsx
 */
function getInitialStateValue(content) {
  const stateMatch = content.match(/useState<\w+>\(['"]([^'"]+)['"]\)/)
  return stateMatch ? stateMatch[1] : 'splash'
}

/**
 * Extract the setState function name from App.tsx
 */
function getSetStateName(content) {
  const match = content.match(/const\s+\[\w+,\s+(\w+)\]\s*=\s*useState/)
  return match ? match[1] : 'setScreen'
}

/**
 * Extract next screen/phase after splash from App.tsx
 */
function getNextPhaseValue(content) {
  // Look for transition from splash phase (e.g., setPhase('menu'), setScreen('game'))
  const match = content.match(/setTimeout\(\s*\(\)\s*=>.*?set\w+\(['"](\w+)['"]\)/)
  if (match) return match[1]

  // Try looking at useState with different initial value
  const stateMatches = content.match(/useState<\w+>\s*=\s*['"](\w+)['"]/g)
  if (stateMatches && stateMatches.length > 1) {
    // Get second match (after splash)
    const secondMatch = content.match(/useState[^}]*['"]([^'"]+)['"][^}]*\)[^}]*\[[^,]+,\s*(\w+)\]/)
    if (secondMatch) return secondMatch[1]
  }

  // Default fallback based on common patterns
  if (content.includes("'menu'")) return 'menu'
  if (content.includes("'game'")) return 'game'
  if (content.includes("'landing'")) return 'landing'

  return 'game' // Default
}

/**
 * Update organisms/App.tsx to add callback pattern
 */
function updateAppTsx(gamePath, gameName) {
  const appPath = path.join(gamePath, 'src', 'ui', 'organisms', 'App.tsx')

  if (!fs.existsSync(appPath)) {
    console.log(`  ⚠️  App.tsx not found at ${appPath}`)
    return 'not-found'
  }

  let content = fs.readFileSync(appPath, 'utf-8')

  // Already wired
  if (hasCallback(content)) {
    return 'already-wired'
  }

  const setStateName = getSetStateName(content)
  const nextPhase = getNextPhaseValue(content)

  // Step 1: Add useCallback import if not present
  if (!content.includes('useCallback')) {
    content = content.replace(/import\s*{([^}]+)}\s*from\s*['"]react['"]/, (match) => {
      const imports = match.match(/[{]([^}]+)[}]/)[1]
      if (!imports.includes('useCallback')) {
        return match.replace(/[{]([^}]+)[}]/, `{ $1, useCallback }`)
      }
      return match
    })
  }

  // Step 2: Find where to insert callback (after useState declarations)
  const callbackCode = `\n  const handleSplashComplete = useCallback(() => {\n    ${setStateName}('${nextPhase}')\n  }, [])\n`

  // Insert after state declarations
  const statePattern = /const\s+\[[\w,\s]+\]\s*=\s*useState[^}]*[}\n]/
  const lastStateMatch = [...content.matchAll(statePattern)].pop()

  if (lastStateMatch) {
    const insertPos = lastStateMatch.index + lastStateMatch[0].length
    content = content.slice(0, insertPos) + callbackCode + content.slice(insertPos)
  } else {
    // Fallback: insert before first useEffect
    const effectIndex = content.indexOf('useEffect')
    if (effectIndex > 0) {
      content = content.slice(0, effectIndex) + callbackCode + content.slice(effectIndex)
    }
  }

  // Step 3: Remove hardcoded timeout for splash phase
  content = content.replace(
    /\s*useEffect\(\s*\(\)\s*=>\s*{\s*const\s+\w+\s*=\s*setTimeout\s*\(\s*\(\)\s*=>\s*\w+\(['"](?:splash|loading)['"],?\s*['"](\w+)['"]\)\s*,\s*\d+\s*\)[^}]*\}\s*,\s*\[\]\s*\)/,
    '',
  )

  // Step 4: Update SplashScreen render to include callback
  content = content.replace(
    /if\s*\(\s*\w+\s*===\s*['"]splash['"]\s*\)\s*{\s*return\s+<SplashScreen\s*\/>/,
    (match) => {
      if (match.includes('onComplete')) {
        return match // Already has callback
      }
      return match.replace(
        /<SplashScreen\s*\/>/,
        `<SplashScreen onComplete={handleSplashComplete} />`,
      )
    },
  )

  // Final fallback: if above regex didn't work, try simpler pattern
  if (!content.includes('onComplete={handleSplashComplete}')) {
    content = content.replace(
      /<SplashScreen\s*\/>/g,
      '<SplashScreen onComplete={handleSplashComplete} />',
    )
  }

  fs.writeFileSync(appPath, content, 'utf-8')
  return 'updated'
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Bulk Applying SharedSplashScreen Pattern...\n')

  const games = getGameDirs()
  console.log(`Found ${games.length} games to process\n`)

  let stats = {
    processed: 0,
    skipped: 0,
    errors: 0,
    created: 0,
    updated: 0,
  }

  for (const game of games) {
    console.log(`📦 ${game.name}`)

    if (!isProperlyStructured(game.path)) {
      console.log(`  ⚠️  Skipped (structural issues)\n`)
      stats.skipped++
      continue
    }

    try {
      // Step 1: Create/update atoms/SplashScreen.tsx
      const splashPath = path.join(game.path, 'src', 'ui', 'atoms', 'SplashScreen.tsx')
      const splashExists = fs.existsSync(splashPath)

      let splashStatus = 'skipped'
      if (!splashExists) {
        // Create it
        const splashCode = createGenericSplashScreen(game.name)
        fs.ensureDirSync(path.dirname(splashPath))
        fs.writeFileSync(splashPath, splashCode, 'utf-8')
        splashStatus = 'created'
        stats.created++
      }

      // Step 2: Update atoms/index.ts
      const barrelStatus = updateAtomsBarrel(game.path, game.name)
      if (barrelStatus === 'updated') stats.updated++

      // Step 3: Update organisms/App.tsx
      const appStatus = updateAppTsx(game.path, game.name)
      if (appStatus === 'updated') stats.updated++

      const statusStr = [splashStatus, barrelStatus, appStatus]
        .filter((s) => s !== 'no-change' && s !== 'already-exported' && s !== 'already-wired')
        .map((s) => `${s}`)
        .join(', ')

      console.log(`  ✅ ${statusStr || 'verified'}\n`)
      stats.processed++
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}\n`)
      stats.errors++
    }
  }

  // Summary
  console.log('📊 Summary')
  console.log(`  Processed: ${stats.processed}`)
  console.log(`  Created: ${stats.created}`)
  console.log(`  Updated: ${stats.updated}`)
  console.log(`  Skipped: ${stats.skipped}`)
  console.log(`  Errors: ${stats.errors}`)
  console.log()

  if (stats.errors === 0) {
    console.log('✨ All games updated successfully!')
  } else {
    console.log(`⚠️  ${stats.errors} errors encountered. Review above.`)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
