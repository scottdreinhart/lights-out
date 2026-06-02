/**
 * Bingo-80 (Swedish Bingo) Constants
 *
 * Configuration for 4x4 cards with 80-ball pool.
 * Commonly played in Sweden and other Nordic countries.
 */

/** Grid size: 4x4 = 16 numbers per card */
export const GRID_SIZE = 4 as const

/** Total cells per card */
export const CARD_SIZE = GRID_SIZE * GRID_SIZE

/** Maximum number in the pool (1-80 for Swedish Bingo) */
export const MAX_NUMBER = 80 as const

/** All available numbers in the pool */
export const ALL_NUMBERS = Array.from({ length: MAX_NUMBER }, (_, i) => i + 1)
