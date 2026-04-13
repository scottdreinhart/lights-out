/**
 * Bingo-Pattern Constants
 *
 * Configuration for pattern-based bingo variant.
 * Cards have custom winning patterns beyond traditional lines.
 * 5x5 grid with BINGO columns (75-ball standard bingo).
 */

/** Grid size: 5x5 = 25 numbers per card */
export const GRID_SIZE = 5 as const

/** Total cells per card */
export const CARD_SIZE = GRID_SIZE * GRID_SIZE

/** Maximum number in the pool (standard 75-ball bingo) */
export const MAX_NUMBER = 75 as const

/** All available numbers in the pool */
export const ALL_NUMBERS = Array.from({ length: MAX_NUMBER }, (_, i) => i + 1) as const

/** BINGO column ranges */
export const BINGO_COLUMNS = {
  B: { min: 1, max: 15 },
  I: { min: 16, max: 30 },
  N: { min: 31, max: 45 },
  G: { min: 46, max: 60 },
  O: { min: 61, max: 75 },
} as const
