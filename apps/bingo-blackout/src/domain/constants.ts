/**
 * Bingo Blackout constants.
 *
 * Variant objective: mark every playable cell on card(s).
 * Uses 90-ball draw pool for blackout progression.
 */

export const GRID_SIZE = 5 as const
export const CARD_SIZE = GRID_SIZE * GRID_SIZE
export const MAX_NUMBER = 90 as const
export const ALL_NUMBERS = Array.from({ length: MAX_NUMBER }, (_, i) => i + 1)

export const DEFAULT_DRAW_SPEED = 2000 as const
export const FAST_DRAW_SPEED = 1000 as const
export const SLOW_DRAW_SPEED = 3000 as const
