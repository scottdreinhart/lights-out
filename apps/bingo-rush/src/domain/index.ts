/**
 * Bingo Rush - Domain Layer Exports
 * 
 * Rush mode extends bingo-core with global timer and time extension mechanics.
 */

// Export only the types and constants we need
export type { Board, Cell, GameState, Move, Difficulty, Theme } from '@games/bingo-core'

// Export rush-specific constants
export * from './constants'
