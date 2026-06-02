/**
 * Dominoes domain constants.
 */

/** All possible domino tiles in a standard double-6 set. */
export const MAX_PIPS = 6

/** Number of tiles in a standard double-6 set (28 tiles). */
export const TOTAL_TILES = ((MAX_PIPS + 1) * (MAX_PIPS + 2)) / 2

/** Number of tiles each player draws at the start. */
export const INITIAL_HAND_SIZE = 7

/** Score threshold for winning a round. */
export const WIN_SCORE_THRESHOLD = 100
