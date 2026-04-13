/**
 * Bingo Bonus - Domain Layer Exports
 * 
 * Bingo Bonus uses standard bingo-core rules with bonus multiplier mechanics.
 * All domain logic reuses bingo-core types, rules, and base constants.
 */

// Export only the types and constants we need (NOT UI components)
export type { Board, Cell, GameState, Move, Difficulty, Theme } from '@games/bingo-core'
export { BINGO_PATTERNS, BONUS_MULTIPLIER } from '@games/bingo-core'
