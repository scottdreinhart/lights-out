#!/usr/bin/env node

/**
 * MASS GAME GENERATOR
 *
 * Scaffolds all remaining 29 games using the War/Simon template pattern.
 * Usage: node generate-games.mjs [--dry-run] [--filter=pattern]
 *
 * Example:
 *   node generate-games.mjs                    # Generate ALL 29 games
 *   node generate-games.mjs --filter=sudoku   # Generate only sudoku variants
 *   node generate-games.mjs --dry-run          # Show what WOULD be created
 */

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
const appsDir = path.join(__dirname, 'apps')
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const filterArg = args.find((a) => a.startsWith('--filter='))?.split('=')[1]

// ============================================================================
// GAME DEFINITIONS: Remaining 29 games with metadata
// ============================================================================

const GAMES = [
  // DICE GAMES (5)
  { name: 'bunco', type: 'dice', template: 'war', mechanics: 'Dice rolling, scoring, turn-based' },
  {
    name: 'farkle',
    type: 'dice',
    template: 'war',
    mechanics: 'Dice rolling, risk/reward, push-your-luck',
  },
  { name: 'cee-lo', type: 'dice', template: 'war', mechanics: 'Three dice, simple comparison' },
  {
    name: 'liars-dice',
    type: 'dice',
    template: 'war',
    mechanics: 'Hidden dice, bluffing, deduction',
  },
  {
    name: 'chicago',
    type: 'dice',
    template: 'war',
    mechanics: 'Dice rolling, round-based, scoring',
  },

  // CARD GAMES: TRICK-TAKING (4)
  {
    name: 'go-fish',
    type: 'card',
    template: 'war',
    mechanics: 'Card collecting, asking for ranks, matching pairs',
  },
  {
    name: 'ship-captain-crew',
    type: 'card-dice',
    template: 'war',
    mechanics: 'Dice poker variant, rerolling',
  },
  {
    name: 'pig',
    type: 'card-dice',
    template: 'war',
    mechanics: 'Push-your-luck, accumulating score',
  },
  {
    name: 'mexico',
    type: 'card',
    template: 'war',
    mechanics: 'Dice game variant, comparing results',
  },

  // MATCHING/MEMORY (2)
  {
    name: 'memory-game',
    type: 'matching',
    template: 'memory',
    mechanics: 'Pattern matching, tile flipping',
  },
  {
    name: 'dominoes',
    type: 'matching',
    template: 'war',
    mechanics: 'Tile matching by number, strategy',
  },

  // STRATEGY/BOARD (6)
  {
    name: 'connect-four',
    type: 'strategy',
    template: 'war',
    mechanics: 'Grid placement, line-of-4 detection',
  },
  {
    name: 'checkers',
    type: 'strategy',
    template: 'war',
    mechanics: 'Grid-based, piece capturing, jumping',
  },
  {
    name: 'reversi',
    type: 'strategy',
    template: 'war',
    mechanics: 'Board flipping, majority control',
  },
  {
    name: 'battleship',
    type: 'strategy',
    template: 'war',
    mechanics: 'Hidden board, guessing, hit tracking',
  },
  {
    name: 'mancala',
    type: 'strategy',
    template: 'war',
    mechanics: 'Cup-based counting, token distribution',
  },
  {
    name: 'nim',
    type: 'strategy',
    template: 'war',
    mechanics: 'Take tokens, avoid last token, AI',
  },

  // CLASSIC/PUZZLE (6)
  {
    name: 'snake',
    type: 'action',
    template: 'simon-says',
    mechanics: 'Grid movement, self-collision, food eating',
  },
  {
    name: 'minesweeper',
    type: 'puzzle',
    template: 'memory',
    mechanics: 'Grid revealing, mine detection, flagging',
  },
  {
    name: 'hangman',
    type: 'word',
    template: 'war',
    mechanics: 'Letter guessing, word building, lives',
  },
  {
    name: 'pinpoint',
    type: 'action',
    template: 'simon-says',
    mechanics: 'Quick tap/click, precision, timing',
  },
  {
    name: 'crossclimb',
    type: 'logic',
    template: 'war',
    mechanics: 'Pattern building, turn-based sequences',
  },
  {
    name: 'lights-out',
    type: 'puzzle',
    template: 'war',
    mechanics: 'Grid toggling, light state, sequence solving',
  },

  // MISCELLANEOUS (6)
  {
    name: 'rock-paper-scissors',
    type: 'choice',
    template: 'war',
    mechanics: 'Simple comparison, best-of-N, AI',
  },
  {
    name: 'tictactoe',
    type: 'strategy',
    template: 'war',
    mechanics: '3x3 grid, turn-based, win condition',
  },
  {
    name: 'queens',
    type: 'puzzle',
    template: 'war',
    mechanics: 'N-queens placement, conflict detection',
  },
  {
    name: 'zip',
    type: 'word',
    template: 'simon-says',
    mechanics: 'Word guessing, letter revealing',
  },
  {
    name: 'snakes-and-ladders',
    type: 'board',
    template: 'war',
    mechanics: 'Dice rolling, position tracking',
  },
  {
    name: 'tango',
    type: 'matching',
    template: 'memory',
    mechanics: 'Pattern synchronization, pairs',
  },
]

// Filter if requested
const gamesToGenerate = filterArg ? GAMES.filter((g) => g.name.includes(filterArg)) : GAMES

console.log(`\n📋 GAME GENERATION PLAN`)
console.log(`=======================\n`)
console.log(`Games to generate: ${gamesToGenerate.length}`)
console.log(`Mode: ${isDryRun ? '🔍 DRY RUN (no files created)' : '⚙️  LIVE GENERATION'}\n`)

// ============================================================================
// TEMPLATE SOURCES
// ============================================================================

const templates = {
  war: {
    domain: {
      'types.ts': generateDomainTypes,
      'constants.ts': generateDomainConstants,
      'rules.ts': generateDomainRules,
      'index.ts': generateDomainIndex,
    },
    app: {
      'hooks/useGame.ts': generateAppHook,
      'index.ts': generateAppIndex,
    },
    ui: {
      'atoms/GamePiece.tsx': generateGamePiece,
      'atoms/GamePiece.module.css': generateGamePieceCSS,
      'atoms/index.ts': generateAtomsIndex,
      'organisms/Board.tsx': generateBoard,
      'organisms/Board.module.css': generateBoardCSS,
      'organisms/App.tsx': generateAppComponent,
      'organisms/index.ts': generateOrganismsIndex,
      'index.ts': generateUIIndex,
    },
    root: {
      'index.tsx': generateIndexTSX,
      'styles.css': generateStylesCSS,
    },
    public: {
      'icon.svg': generateIcon,
      'manifest.json': generateManifest,
    },
    config: {
      'index.html': generateIndexHTML,
      'package.json': copyPackageJSON,
      'tsconfig.json': copyTSConfig,
      'vite.config.js': copyViteConfig,
    },
  },
  'simon-says': {
    /* Similar structure */
  },
  memory: {
    /* Similar structure */
  },
}

// ============================================================================
// FILE GENERATORS (Templates)
// ============================================================================

function generateDomainTypes(gameName) {
  return `/**
 * Domain types for ${gameName}.
 * Framework-agnostic type definitions only.
 */

export type GamePhase = 'playing' | 'results' | 'gameOver'

export interface GameState {
  phase: GamePhase
  score: number
  gameOver: boolean
  // Extend with ${gameName}-specific game state fields as needed.
}
`
}

function generateDomainConstants(gameName) {
  return `import type { GameState } from './types'

export const INITIAL_SCORE = 0
export const WINNING_SCORE = 100

export function createInitialGameState(): GameState {
  return {
    phase: 'playing',
    score: INITIAL_SCORE,
    gameOver: false,
  }
}

// Extend with ${gameName}-specific constants (deck, board, rules, etc.).
`
}

function generateDomainRules(gameName) {
  return `import type { GameState } from './types'
import { createInitialGameState } from './constants'

export function playRound(state: GameState): GameState {
  // Replace with ${gameName}-specific round logic.
  return state
}

export function isGameOver(state: GameState): boolean {
  return state.score >= 100 || state.gameOver
}

export function resetGame(): GameState {
  return createInitialGameState()
}
`
}

function generateDomainIndex(gameName) {
  return `export type { GamePhase, GameState } from './types'
export { INITIAL_SCORE, WINNING_SCORE, createInitialGameState } from './constants'
export { isGameOver, playRound, resetGame } from './rules'
`
}

function generateAppHook(gameName) {
  return `import type { GameState } from '@/domain'
import { createInitialGameState, playRound, isGameOver, resetGame } from '@/domain'
import { useCallback, useState } from 'react'

export function useGame() {
  const [state, setState] = useState<GameState>(createInitialGameState())

  const nextRound = useCallback(() => {
    setState((prev) => playRound(prev))
  }, [])

  const reset = useCallback(() => {
    setState(resetGame())
  }, [])

  return {
    state,
    nextRound,
    reset,
    isOver: isGameOver(state),
  }
}
`
}

function generateAppIndex(gameName) {
  return `export { useGame } from './hooks/useGame'
`
}

function generateGamePiece(gameName) {
  return `import styles from './GamePiece.module.css'

interface GamePieceProps {
  value: string
  disabled?: boolean
  onClick?: () => void
}

export function GamePiece({ value, disabled, onClick }: GamePieceProps) {
  return (
    <button
      className={styles.piece}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {value}
    </button>
  )
}
`
}

function generateGamePieceCSS(gameName) {
  return `.piece {
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f0f0f0;
  border: 1px solid #ddd;
}

.piece:hover:not(:disabled) {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.piece:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`
}

function generateAtomsIndex(gameName) {
  return `export { GamePiece } from './GamePiece'
`
}

function generateBoard(gameName) {
  return `import { useGame } from '@/app'
import { GamePiece } from '@/ui/atoms'
import styles from './Board.module.css'

export function Board() {
  const { state, nextRound, reset, isOver } = useGame()

  return (
    <div className={styles.board}>
      <div className={styles.header}>
        <h1>${gameName.charAt(0).toUpperCase() + gameName.slice(1)}</h1>
        <div className={styles.stats}>
          <span>Score: {state.score}</span>
        </div>
      </div>

      <div className={styles.playArea}>
        {/* Replace with ${gameName}-specific gameplay UI. */}
        <GamePiece value="Play" onClick={nextRound} />
      </div>

      {isOver && (
        <div className={styles.results}>
          <h2>Game Over!</h2>
          <p>Final Score: {state.score}</p>
          <button onClick={reset} className={styles.button}>
            Play Again
          </button>
        </div>
      )}

      {!isOver && (
        <button onClick={nextRound} className={styles.button}>
          Next Round
        </button>
      )}
    </div>
  )
}
`
}

function generateBoardCSS(gameName) {
  return `.board {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: sans-serif;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
}

.playArea {
  margin-bottom: 2rem;
}

.button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}
`
}

function generateAppComponent(gameName) {
  return `import { Board } from './Board'

export function App() {
  return <Board />
}
`
}

function generateOrganismsIndex(gameName) {
  return `export { App } from './App'
export { Board } from './Board'
`
}

function generateUIIndex(gameName) {
  return `export * from './atoms'
export * from './organisms'
`
}

function generateIndexTSX(gameName) {
  return `import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import { App } from './ui/organisms/App'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`
}

function generateStylesCSS(gameName) {
  return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}

#root {
  min-height: 100vh;
}
`
}

function generateIcon(gameName) {
  return `<svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="96" cy="96" r="96" fill="url(#bgGrad)"/>
  <text x="96" y="110" font-size="48" font-weight="bold" text-anchor="middle" fill="white">${gameName.charAt(0).toUpperCase()}</text>
</svg>
`
}

function generateManifest(gameName) {
  const displayName = gameName
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return JSON.stringify(
    {
      name: `${displayName} Game`,
      short_name: displayName,
      description: `Play ${displayName}`,
      start_url: '/',
      display: 'standalone',
      theme_color: '#667eea',
      background_color: '#ffffff',
      icons: [
        {
          src: '/icon.svg',
          sizes: '192x192',
          type: 'image/svg+xml',
        },
      ],
    },
    null,
    2,
  )
}

function generateIndexHTML(gameName) {
  const displayName = gameName
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Play ${displayName} - A fun online game" />
    <meta name="theme-color" content="#667eea" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <link rel="manifest" href="/manifest.json" />
    <title>${displayName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
`
}

function copyPackageJSON(gameDir) {
  const warPackage = JSON.parse(fs.readFileSync(path.join(appsDir, 'war', 'package.json'), 'utf-8'))
  return JSON.stringify(warPackage, null, 2)
}

function copyTSConfig(gameDir) {
  return fs.readFileSync(path.join(appsDir, 'war', 'tsconfig.json'), 'utf-8')
}

function copyViteConfig(gameDir) {
  return fs.readFileSync(path.join(appsDir, 'war', 'vite.config.js'), 'utf-8')
}

// ============================================================================
// GENERATION LOGIC
// ============================================================================

function createGameStructure(game) {
  const gameDir = path.join(appsDir, game.name)
  const template = templates[game.template]

  const filesToCreate = {}

  // Domain layer
  Object.entries(template.domain).forEach(([filename, generator]) => {
    filesToCreate[`src/domain/${filename}`] = generator(game.name)
  })

  // App layer
  Object.entries(template.app).forEach(([filename, generator]) => {
    filesToCreate[`src/app/${filename}`] = generator(game.name)
  })

  // UI layer
  Object.entries(template.ui).forEach(([filename, generator]) => {
    filesToCreate[`src/ui/${filename}`] = generator(game.name)
  })

  // Root
  Object.entries(template.root).forEach(([filename, generator]) => {
    filesToCreate[`src/${filename}`] = generator(game.name)
  })

  // Public
  Object.entries(template.public).forEach(([filename, generator]) => {
    filesToCreate[`public/${filename}`] = generator(game.name)
  })

  // Config
  Object.entries(template.config).forEach(([filename, generator]) => {
    filesToCreate[filename] = generator(gameDir)
  })

  return filesToCreate
}

function writeGame(game) {
  const files = createGameStructure(game)
  let count = 0

  Object.entries(files).forEach(([relativePath, content]) => {
    const fullPath = path.join(appsDir, game.name, relativePath)
    const dir = path.dirname(fullPath)

    if (isDryRun) {
      console.log(`  📄 ${relativePath}`)
    } else {
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(fullPath, content)
    }

    count++
  })

  return count
}

// ============================================================================
// EXECUTION
// ============================================================================

console.log(`Games to scaffold:\n`)

let totalFiles = 0
gamesToGenerate.forEach((game) => {
  const fileCount = Object.keys(createGameStructure(game)).length
  console.log(`  ✓ ${game.name.padEnd(20)} (${game.type.padEnd(15)} | ${fileCount} files)`)
  totalFiles += fileCount

  if (!isDryRun) {
    writeGame(game)
  }
})

console.log(
  `\n${isDryRun ? '🔍 DRY RUN' : '✅ GENERATED'}: ${gamesToGenerate.length} games, ${totalFiles} files total\n`,
)
console.log(`Next steps:`)
console.log(`  1. Edit domain/rules.ts in each game with actual game logic`)
console.log(`  2. Update ui/organisms/Board.tsx with game-specific UI`)
console.log(`  3. Run: pnpm install`)
console.log(`  4. Run: pnpm validate\n`)
