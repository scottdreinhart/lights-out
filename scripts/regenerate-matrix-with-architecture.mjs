#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const COMPLIANCE_DIR = path.join(ROOT, 'compliance')
const BASELINE_FILE = path.join(COMPLIANCE_DIR, 'baseline.json')
const MATRIX_FILE = path.join(COMPLIANCE_DIR, 'matrix.json')

// Read baseline.json with game assessments
async function readBaseline() {
  try {
    const data = await fs.readFile(BASELINE_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading baseline.json:', error)
    throw error
  }
}

// Read existing matrix.json to preserve platform info
async function readExistingMatrix() {
  try {
    const data = await fs.readFile(MATRIX_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading matrix.json:', error)
    return null
  }
}

// Regenerate matrix with new architectural metrics from baseline
async function regenerateMatrix() {
  console.log('📊 Regenerating matrix.json with architectural metrics...')

  const baseline = await readBaseline()
  const existingMatrix = await readExistingMatrix()

  const platforms = existingMatrix?.platforms || [
    'web',
    'electron-win',
    'electron-mac',
    'electron-linux',
    'ios',
    'android',
    'wasm',
    'docker',
    'cli',
    'games-hub',
  ]

  const newMatrix = {
    metadata: {
      version: '2.0.0',
      generatedAt: new Date().toISOString(),
      description:
        'Platform readiness matrix for 27 existing games across 10 platforms, now with CLEAN architecture and Atomic design metrics',
      totalGames: Object.keys(baseline.games).length,
      totalPlatforms: platforms.length,
      totalCells: Object.keys(baseline.games).length * platforms.length,
      architectureMetricsAdded: '2026-04-01',
      notes:
        'Includes cleanArchitecture %, atomicDesign %, and lastEvaluationDate from baseline.json audit',
    },
    platforms,
    games: {},
  }

  // Build enhanced game entries with metrics from baseline
  for (const [gameName, gameData] of Object.entries(baseline.games)) {
    // Find platform data from existing matrix
    const existingGameData = existingMatrix?.games?.[gameName] || {}

    newMatrix.games[gameName] = {
      maturityLevel: gameData.maturityLevel || 'developing',
      completion: gameData.estimatedCompletion || 80,
      cleanArchitecture: gameData.cleanArchitecture || 100,
      atomicDesign: gameData.atomicDesign || 90,
      lastEvaluationDate: gameData.lastEvaluationDate || '2026-03-31',
      platforms: existingGameData.platforms || getPlatformDefaults(gameData, platforms),
    }
  }

  // Write regenerated matrix.json
  await fs.writeFile(MATRIX_FILE, JSON.stringify(newMatrix, null, 2))
  console.log(`✅ Matrix regenerated: ${MATRIX_FILE}`)
  console.log(`   - ${newMatrix.metadata.totalGames} games`)
  console.log(`   - ${newMatrix.metadata.totalPlatforms} platforms`)
  console.log(`   - ${newMatrix.metadata.totalCells} total cells`)
  console.log(`   - Now includes: cleanArchitecture %, atomicDesign %, lastEvaluationDate`)
}

// Create default platform entries based on game maturity
function getPlatformDefaults(game, platforms) {
  const platformData = {}
  const isComplete = game.maturityLevel === 'reference' || game.maturityLevel === 'mature'
  const status = isComplete ? 'complete' : 'partial'
  const completion = game.estimatedCompletion || 80

  for (const platform of platforms) {
    platformData[platform] = {
      status,
      completion,
    }
  }

  return platformData
}

// Main
try {
  await regenerateMatrix()
  console.log('\n✨ Architectural metrics propagated to matrix.json!')
  console.log('   Dashboard will now display CLEAN % and Atomic % alongside platform readiness.')
} catch (error) {
  console.error('❌ Failed to regenerate matrix:', error.message)
  process.exit(1)
}
