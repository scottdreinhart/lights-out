/**
 * Central type definitions — pure domain types, no framework dependencies.
 */

export type Player = 'human' | 'cpu'
export type GameMode = 'normal' | 'misere'

export interface Pile {
  id: number
  count: number
}

export interface Move {
  pileId: number
  removeCount: number
}

export interface GameState {
  piles: Pile[]
  currentPlayer: Player
  winner: Player | null
  isGameOver: boolean
  mode: GameMode
}

export interface GameSetup {
  name: string
  initialCounts: number[]
}

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
