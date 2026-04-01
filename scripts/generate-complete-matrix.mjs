#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const APPS_DIR = path.join(ROOT, 'apps')
const COMPLIANCE_DIR = path.join(ROOT, 'compliance')

// Get all games from apps/
async function getAllGames() {
  try {
    const entries = await fs.readdir(APPS_DIR, { withFileTypes: true })
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort()
  } catch (error) {
    console.error('Error reading apps directory:', error)
    return []
  }
}

// Generate matrix with correct structure
function generateMatrix(games) {
  const platforms = [
    'web',
    'meta',
    'ios',
    'android',
    'electron',
    'itch',
    'crazygames',
    'discord',
    'telegram',
    'steam',
  ]

  const matrix = {}
  const baseCell = {
    status: 'not-started',
    appExists: false,
    rulesVerified: false,
    platformAdapter: false,
    performanceCompliance: false,
    uiCompliance: false,
    blockersFree: false,
    completionPercentage: 0,
    notes: 'Pending implementation',
  }

  // Initialize matrix
  for (const game of games) {
    matrix[game] = {}
    for (const platform of platforms) {
      matrix[game][platform] = { ...baseCell }
    }
  }

  return {
    games,
    platforms,
    matrix,
  }
}

async function main() {
  try {
    console.log('Generating complete compliance matrix...')
    const games = await getAllGames()
    console.log(`Found ${games.length} games: ${games.join(', ')}`)

    const { games: gamesList, platforms, matrix } = generateMatrix(games)

    const totalCells = gamesList.length * platforms.length
    const completionPercentage = 0 // All start at 0

    const matrixData = {
      metadata: {
        version: '1.0.0',
        generatedAt: new Date().toISOString(),
        description: `Platform × Game Coverage Matrix - tracks deployment across ${platforms.length} platforms and ${gamesList.length} games`,
        totalCells,
        games: gamesList.length,
        platforms: platforms.length,
        completionPercentage,
      },
      games: gamesList,
      platforms,
      matrix,
    }

    // Write matrix.json
    const matrixPath = path.join(COMPLIANCE_DIR, 'matrix.json')
    await fs.writeFile(matrixPath, JSON.stringify(matrixData, null, 2))
    console.log(`✅ Updated ${matrixPath}`)
    console.log(`   - ${gamesList.length} games`)
    console.log(`   - ${platforms.length} platforms`)
    console.log(`   - ${totalCells} total cells`)

    // Also update dashboard header script text
    console.log('\n📊 Update dashboard.html:')
    console.log(`   Change: "7 CSP games and 10 platforms"`)
    console.log(`   To:     "${gamesList.length} games and ${platforms.length} platforms"`)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
