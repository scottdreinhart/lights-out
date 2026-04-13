/**
 * Pattern Bingo - Domain Layer Exports
 * 
 * Pattern mode extends bingo-core with multiple pattern objectives and multiplier system.
 */

// Export only the types and constants we need (NOT UI components with CSS)
export type { Board, Cell, GameState, Move, Difficulty, Theme } from '@games/bingo-core'

// Export pattern-specific constants
export * from './constants'
