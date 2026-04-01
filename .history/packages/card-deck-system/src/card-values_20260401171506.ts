/**
 * Card Numeric Values — Standard values for each rank
 *
 * Games can use these as base values and apply their own rules
 * (e.g., Blackjack: Ace = 1 or 11; Go-Fish: Ace = 14 for comparison)
 */

import { CardRank, type CardNumericValue } from './types'

/** Standard base numeric values per rank */
export const CARD_NUMERIC_VALUES: Record<CardRank, CardNumericValue> = {
  [CardRank.TWO]: { rank: CardRank.TWO, baseValue: 2 },
  [CardRank.THREE]: { rank: CardRank.THREE, baseValue: 3 },
  [CardRank.FOUR]: { rank: CardRank.FOUR, baseValue: 4 },
  [CardRank.FIVE]: { rank: CardRank.FIVE, baseValue: 5 },
  [CardRank.SIX]: { rank: CardRank.SIX, baseValue: 6 },
  [CardRank.SEVEN]: { rank: CardRank.SEVEN, baseValue: 7 },
  [CardRank.EIGHT]: { rank: CardRank.EIGHT, baseValue: 8 },
  [CardRank.NINE]: { rank: CardRank.NINE, baseValue: 9 },
  [CardRank.TEN]: { rank: CardRank.TEN, baseValue: 10 },
  [CardRank.JACK]: { rank: CardRank.JACK, baseValue: 11 },
  [CardRank.QUEEN]: { rank: CardRank.QUEEN, baseValue: 12 },
  [CardRank.KING]: { rank: CardRank.KING, baseValue: 13 },
  [CardRank.ACE]: {
    rank: CardRank.ACE,
    baseValue: 14,
    alternateValues: [1, 11], // Ace can be 1, 11, or 14 depending on game
  },
}

/**
 * Get numeric value for a rank
 *
 * @param rank The card rank
 * @returns The base numeric value
 */
export const getCardValue = (rank: CardRank): number => {
  return CARD_NUMERIC_VALUES[rank].baseValue
}

/**
 * Get all possible numeric values for a rank (for ranks with alternatives like Ace)
 *
 * @param rank The card rank
 * @returns Array of possible numeric values
 */
export const getCardAlternateValues = (rank: CardRank): number[] => {
  const config = CARD_NUMERIC_VALUES[rank]
  return config.alternateValues ? [config.baseValue, ...config.alternateValues] : [config.baseValue]
}

/**
 * Compare two card ranks by numeric value
 *
 * @returns -1 if rank1 < rank2, 0 if equal, 1 if rank1 > rank2
 */
export const compareCardRanks = (rank1: CardRank, rank2: CardRank): number => {
  const value1 = getCardValue(rank1)
  const value2 = getCardValue(rank2)
  return value1 < value2 ? -1 : value1 > value2 ? 1 : 0
}
