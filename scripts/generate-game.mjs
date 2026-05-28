#!/usr/bin/env node

/**
 * Game Template Generator
 *
 * Generates complete game scaffolding for any of the 30 game platform apps.
 * Usage: node generate-game.mjs --game=<gameName> --simple|--complex
 *
 * Pattern: domain/ → app/ → ui/
 * Every game follows identical CLEAN + Atomic Design architecture
 */

import fs from 'fs/promises'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  BLUE: '\x1b[94m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const GAME_DEFINITIONS = {
  // Simple games (1-pass logic): war, memory, flip, snap
  war: {
    type: 'simple',
    deck: true,
    turns: true,
    winner: 'scoreComparison',
    description: 'Card comparison game',
  },
  memory: {
    type: 'simple',
    deck: true,
    turns: true,
    winner: 'matchCount',
    description: 'Matching pairs game',
  },
  snap: {
    type: 'simple',
    deck: true,
    turns: false,
    winner: 'sequenceMatch',
    description: 'Card sequence matching',
  },

  // Moderate games (2-3 rules): sudoku, minesweeper, hangman
  sudoku: {
    type: 'puzzle',
    board: [9, 9],
    rules: ['setCell', 'removeCell', 'validateRow', 'validateColumn', 'validateBox'],
    winner: 'allCellsValid',
    description: 'Number placement puzzle',
  },
  minesweeper: {
    type: 'puzzle',
    board: [10, 10],
    rules: ['revealCell', 'markCell', 'countAdjacent', 'cascadeReveal'],
    winner: 'allSafeRevealed',
    description: 'Mine avoidance game',
  },
  hangman: {
    type: 'guessing',
    rules: ['guessLetter', 'checkWord', 'trackMisses'],
    winner: 'wordGuessedOrHung',
    description: 'Letter guessing game',
  },

  // Complex games (4+ rules): chess, checkers
  chess: {
    type: 'strategy',
    board: [8, 8],
    pieces: 16,
    rules: [
      'isValidPawnMove',
      'isValidRookMove',
      'isValidKnightMove',
      'isValidBishopMove',
      'isValidQueenMove',
      'isValidKingMove',
      'isCheck',
      'isCheckmate',
    ],
    winner: 'checkmate',
    description: '8x8 strategy game',
  },
}

export async function generateGame(gameName, options = {}) {
  const gameDef = GAME_DEFINITIONS[gameName]
  if (!gameDef) {
    throw new Error(
      `Unknown game: ${gameName}. Available: ${Object.keys(GAME_DEFINITIONS).join(', ')}`,
    )
  }

  const appDir = `apps/${gameName}`

  console.log(`📦 Generating ${gameName} (${gameDef.description})...`)

  // Create directory structure
  const dirs = [
    `${appDir}/src/domain`,
    `${appDir}/src/app/hooks`,
    `${appDir}/src/ui/atoms`,
    `${appDir}/src/ui/molecules`,
    `${appDir}/src/ui/organisms`,
  ]

  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true })
  }

  // Generate domain layer
  const typesContent = generateTypes(gameName, gameDef)
  const constantsContent = generateConstants(gameName, gameDef)
  const rulesContent = generateRules(gameName, gameDef)
  const domainBarrel = generateDomainBarrel()

  // Generate app layer
  const hookContent = generateHook(gameName, gameDef)
  const appBarrel = generateAppBarrel(gameName, gameDef)

  // Generate UI layer
  const atomContent = generatePrimaryAtom(gameName, gameDef)
  const atomStyle = generateAtomStyle()
  const atomBarrel = generateAtomBarrel(gameName, gameDef)
  const boardContent = generateGameBoard(gameName, gameDef)
  const boardStyle = generateBoardStyle()

  // Write files
  await fs.writeFile(`${appDir}/src/domain/types.ts`, typesContent)
  await fs.writeFile(`${appDir}/src/domain/constants.ts`, constantsContent)
  await fs.writeFile(`${appDir}/src/domain/rules.ts`, rulesContent)
  await fs.writeFile(`${appDir}/src/domain/index.ts`, domainBarrel)

  await fs.writeFile(`${appDir}/src/app/hooks/use${pascalCase(gameName)}.ts`, hookContent)
  await fs.writeFile(`${appDir}/src/app/index.ts`, appBarrel)

  await fs.writeFile(`${appDir}/src/ui/atoms/GamePrimary.tsx`, atomContent)
  await fs.writeFile(`${appDir}/src/ui/atoms/GamePrimary.module.css`, atomStyle)
  await fs.writeFile(`${appDir}/src/ui/atoms/index.ts`, atomBarrel)

  await fs.writeFile(`${appDir}/src/ui/organisms/GameBoard.tsx`, boardContent(gameName, gameDef))
  await fs.writeFile(`${appDir}/src/ui/organisms/GameBoard.module.css`, boardStyle)

  console.log(`✅ ${gameName} generated successfully!`)
  return { gameName, appDir, files: 9 }
}

// Template generators
function generateTypes(gameName, def) {
  const camelGame = camelCase(gameName)
  return `// ${gameName} game types
export interface GameState {
  // Add your state structure here
}

export type GamePhase = 'setup' | 'playing' | 'finished'
`
}

function generateConstants(gameName, def) {
  return `// ${gameName} game constants
export const INITIAL_STATE = {}
`
}

function generateRules(gameName, def) {
  return `// ${gameName} game rules
import type { GameState } from './types'

export const isGameOver = (state: GameState): boolean => false
`
}

function generateDomainBarrel() {
  return `export * from './types'
export * from './constants'
export * from './rules'
`
}

function generateHook(gameName, def) {
  const camelGame = camelCase(gameName)
  const pascalGame = pascalCase(gameName)
  return `import { useState, useCallback } from 'react'
import { INITIAL_STATE, isGameOver } from '@/domain'

export const use${pascalGame} = () => {
  const [state, setState] = useState(INITIAL_STATE)

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  return {
    state,
    reset,
    isOver: isGameOver(state),
  }
}
`
}

function generateAppBarrel(gameName, def) {
  const pascalGame = pascalCase(gameName)
  return `export { use${pascalGame} } from './hooks/use${pascalGame}'
`
}

function generatePrimaryAtom(gameName, def) {
  return `// Primary game component (atoms)
export function GamePrimary() {
  return <div>Implement game primary component</div>
}
`
}

function generateAtomStyle() {
  return `.primary {
  /* Game primary styling */
}
`
}

function generateAtomBarrel(gameName, def) {
  return `export { GamePrimary } from './GamePrimary'
`
}

function generateGameBoard(gameName, def) {
  const pascalGame = pascalCase(gameName)
  return (name, d) => `import { use${pascalGame} } from '@/app'
import { GamePrimary } from '../atoms'
import styles from './GameBoard.module.css'

export function GameBoard() {
  const { state, reset, isOver } = use${pascalGame}()

  return (
    <div className={styles.board}>
      <h1>${gameName}</h1>
      <GamePrimary />
      {isOver && (
        <button onClick={reset} className={styles.button}>
          Play Again
        </button>
      )}
    </div>
  )
}
`
}

function generateBoardStyle() {
  return `.board {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.button {
  padding: 1rem 2rem;
  font-size: 1.1em;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.button:hover {
  transform: scale(1.05);
}
`
}

// Helpers
function camelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

function pascalCase(str) {
  const camel = camelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const gameName = process.argv[2]
  if (!gameName) {
    console.error('Usage: node generate-game.mjs <gameName>')
    process.exit(1)
  }
  generateGame(gameName).catch(console.error)
}
