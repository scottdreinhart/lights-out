/**
 * Central type definitions — pure domain types, no framework dependencies.
 */

export type Player = 'black' | 'white'
export type Cell = Player | null
export type Board = Cell[]

export interface Position {
  readonly row: number
  readonly col: number
}

export interface Move {
  readonly position: Position
  readonly flipped: readonly Position[]
}

export type Difficulty = 'easy' | 'medium' | 'hard'
export type GameMode = 'pvp' | 'pvc'

export type GameResult =
  | { readonly status: 'playing' }
  | {
      readonly status: 'win'
      readonly winner: Player
      readonly black: number
      readonly white: number
    }
  | { readonly status: 'draw'; readonly black: number; readonly white: number }

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
  draws: number
  gamesPlayed: number
  totalScore: number
  streak: number
  bestStreak: number
}
