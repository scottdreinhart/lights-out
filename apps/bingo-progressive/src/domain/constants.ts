/**
 * Bingo-Progressive Constants
 *
 * Configuration for progressive bingo variant.
 * Cards increase in complexity as the game progresses.
 * Standard 75-ball bingo with 5x5 grid and free center.
 */

/** Grid size: 5x5 = 25 numbers per card (with free center) */
export const GRID_SIZE = 5 as const

/** Total cells per card */
export const CARD_SIZE = GRID_SIZE * GRID_SIZE

/** Center cell index (for free tile) */
export const CENTER_INDEX = Math.floor(GRID_SIZE / 2) * GRID_SIZE + Math.floor(GRID_SIZE / 2)

/** Maximum number in the pool (standard 75-ball bingo) */
export const MAX_NUMBER = 75 as const

/** All available numbers in the pool */
export const ALL_NUMBERS: readonly number[] = Array.from({ length: MAX_NUMBER }, (_, i) => i + 1)

/** Difficulty levels for progressive gameplay */
export const DIFFICULTY_LEVELS = {
  easy: 1,
  medium: 2,
  hard: 3,
} as const
