/**
 * Power Bingo - Domain Layer Exports
 *
 * Power mode extends bingo-core with collectible power-ups and strategic abilities.
 */

// Export only the types and constants we need (NOT UI components with CSS)
export type { Board, Cell, Difficulty, GameState, Move, Theme } from '@games/bingo-core'

// Export power-specific constants
export * from './constants'
