/**
 * Central type definitions — pure domain types, no framework dependencies.
 */

import type {
  ColorblindMode as SharedColorblindMode,
  ColorTheme as SharedColorTheme,
  GameStats as SharedGameStats,
  ThemeSettings as SharedThemeSettings,
} from '@games/theme-contract'

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

/** Shared theme types — sourced from workspace contract */
export type ColorTheme = SharedColorTheme
export type ColorblindMode = SharedColorblindMode
export type ThemeSettings = SharedThemeSettings

export type GameStats = SharedGameStats
