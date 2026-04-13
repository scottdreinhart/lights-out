/**
 * Bingo Survival - Domain Layer Exports
 *
 * Survival mode extends bingo-core with per-level difficulty progression.
 */

// Export only the types and constants we need
export type { Board, Cell, Difficulty, GameState, Move, Theme } from '@games/bingo-core'

// Export survival-specific constants
export * from './constants'
