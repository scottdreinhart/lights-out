/**
 * Speed-Bingo Constants
 *
 * Configuration for rapid-draw speed bingo variant.
 * Features auto-draw capability and adjustable draw speed.
 * 5x5 grid with standard 75-ball bingo.
 */

/** Grid size: 5x5 = 25 numbers per card (BINGO columns) */
export const GRID_SIZE = 5 as const

/** Total cells per card */
export const CARD_SIZE = GRID_SIZE * GRID_SIZE

/** Maximum number in the pool (standard 75-ball bingo) */
export const MAX_NUMBER = 75 as const

/** All available numbers in the pool */
export const ALL_NUMBERS = Array.from({ length: MAX_NUMBER }, (_, i) => i + 1)

/** Default speed for auto-draw (milliseconds between draws) */
export const DEFAULT_DRAW_SPEED = 2000 as const

/** Fast speed for auto-draw (1 per second) */
export const FAST_DRAW_SPEED = 1000 as const

/** Slow speed for auto-draw (1 per 3 seconds) */
export const SLOW_DRAW_SPEED = 3000 as const
