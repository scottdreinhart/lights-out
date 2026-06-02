/**
 * Mini Bingo (3x3 variant) - Constants
 *
 * Configuration values for 30-ball bingo variant with 3x3 grid.
 */

/** Grid dimensions (3x3 = 9 cells per card) */
export const GRID_SIZE = 3 as const

/** Maximum number in the bingo pool (1-25 for mini bingo) */
export const MAX_NUMBER = 25 as const

/** All available numbers in the bingo pool */
export const ALL_NUMBERS = Array.from({ length: MAX_NUMBER }, (_, i) => i + 1)
