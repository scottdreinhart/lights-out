/**
 * Central type definitions — pure domain types, no framework dependencies.
 */

export type Tile = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface BoardState {
  tiles: Record<Tile, boolean> // true = open, false = closed
  diceSum: number
  selectedTiles: Tile[]
}

export interface Player {
  id: string
  name: string
  score: number
  isAI: boolean
}

export interface GameState {
  players: Player[]
  currentPlayerIndex: number
  board: BoardState
  gamePhase: 'setup' | 'rolling' | 'choosing' | 'gameOver'
  winner: Player | null
  history: GameAction[]
}

export type GameAction =
  | { type: 'INITIALIZE_GAME'; players: Player[] }
  | { type: 'ROLL_DICE'; dice1: number; dice2: number | null }
  | { type: 'SELECT_TILE'; tile: Tile }
  | { type: 'DESELECT_TILE'; tile: Tile }
  | { type: 'SUBMIT_MOVE'; selectedTiles: Tile[] }
  | { type: 'END_TURN' }
  | { type: 'START_NEW_ROUND' }
  | { type: 'RESET_GAME' }

/** Shared theme types — identical across all games */

export interface ColorTheme {
  readonly id: string
  readonly label: string
  readonly accent: string
}

export interface ColorblindMode {
  readonly id: string
  readonly label: string
  readonly description?: string
}

export interface ThemeSettings {
  colorTheme: string
  mode: string
  colorblind: string
}

export interface GameStats {
  wins: number
  losses: number
  streak: number
  bestStreak: number
}
