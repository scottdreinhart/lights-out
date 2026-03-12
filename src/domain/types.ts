/**
 * Central type definitions — pure domain types, no framework dependencies.
 */

export type Board = boolean[][] // true = light on, false = light off

export interface GameState {
  board: Board
  moves: number
  isSolved: boolean
}

export interface Position {
  row: number
  col: number
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
