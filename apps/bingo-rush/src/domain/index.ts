/**
 * Bingo Rush - Domain Layer Exports
 *
 * Rush mode extends bingo-core with global timer and time extension mechanics.
 */

// Export only the types we need from bingo-core
export type { BingoCard, BingoGameState, BingoNumber, BingoPattern } from '@games/bingo-core'

// Export rush-specific constants
export * from './constants'
