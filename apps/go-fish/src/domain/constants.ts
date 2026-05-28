/**
 * Go Fish domain constants.
 */

/** All valid card ranks. */
export const CARD_RANKS = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
] as const

/** Number of cards dealt to each player. */
export const INITIAL_HAND_SIZE = 7

/** Number of suits per rank (for a standard 52-card deck). */
export const SUITS_PER_RANK = 4

/** Number of total books a player must collect to win. */
export const TOTAL_BOOKS = 13
