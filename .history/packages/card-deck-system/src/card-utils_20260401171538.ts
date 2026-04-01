/**
 * Card Utilities — Helper functions for working with cards
 *
 * Includes:
 * - Creating cards
 * - Validating cards
 * - Comparing cards
 * - Rendering/formatting cards
 */

import { CardRank, CardSuit, type Card } from './types'

/**
 * Create a standard card
 */
export const createCard = (suit: CardSuit, rank: CardRank, id: string): Card => {
  return { suit, rank, isJoker: false, id }
}

/**
 * Create a joker card
 */
export const createJoker = (id: string): Card => {
  return { isJoker: true, id }
}

/**
 * Check if a card is valid (has required properties)
 */
export const isValidCard = (card: Card): boolean => {
  if (card.isJoker) {
    return !!card.id && !card.suit && !card.rank
  }
  return !!(card.id && card.suit && card.rank && Object.values(CardSuit).includes(card.suit) && Object.values(CardRank).includes(card.rank))
}

/**
 * Check if two cards are the same (same suit and rank)
 */
export const isSameCard = (card1: Card, card2: Card): boolean => {
  if (card1.isJoker !== card2.isJoker) return false
  if (card1.isJoker) return card1.id === card2.id
  return card1.suit === card2.suit && card1.rank === card2.rank
}

/**
 * Check if two cards have the same rank (ignoring suit)
 */
export const isSameRank = (card1: Card, card2: Card): boolean => {
  if (card1.isJoker || card2.isJoker) return false
  return card1.rank === card2.rank
}

/**
 * Check if two cards have the same suit (ignoring rank)
 */
export const isSameSuit = (card1: Card, card2: Card): boolean => {
  if (card1.isJoker || card2.isJoker) return false
  return card1.suit === card2.suit
}

/**
 * Format a card for display
 *
 * Example: "Ace of Spades", "Queen of Hearts", "Joker"
 */
export const formatCard = (card: Card): string => {
  if (card.isJoker) return 'Joker'

  const rankNames: Record<CardRank, string> = {
    [CardRank.TWO]: 'Two',
    [CardRank.THREE]: 'Three',
    [CardRank.FOUR]: 'Four',
    [CardRank.FIVE]: 'Five',
    [CardRank.SIX]: 'Six',
    [CardRank.SEVEN]: 'Seven',
    [CardRank.EIGHT]: 'Eight',
    [CardRank.NINE]: 'Nine',
    [CardRank.TEN]: 'Ten',
    [CardRank.JACK]: 'Jack',
    [CardRank.QUEEN]: 'Queen',
    [CardRank.KING]: 'King',
    [CardRank.ACE]: 'Ace',
  }

  const suitNames: Record<CardSuit, string> = {
    [CardSuit.DIAMONDS]: 'Diamonds',
    [CardSuit.CLUBS]: 'Clubs',
    [CardSuit.SPADES]: 'Spades',
    [CardSuit.HEARTS]: 'Hearts',
  }

  return `${rankNames[card.rank!]} of ${suitNames[card.suit!]}`
}

/**
 * Get short notation for a card
 *
 * Example: "AS" (Ace of Spades), "QH" (Queen of Hearts), "J" (Joker)
 */
export const getCardNotation = (card: Card): string => {
  if (card.isJoker) return 'J'

  const suitNotation: Record<CardSuit, string> = {
    [CardSuit.DIAMONDS]: 'D',
    [CardSuit.CLUBS]: 'C',
    [CardSuit.SPADES]: 'S',
    [CardSuit.HEARTS]: 'H',
  }

  return `${card.rank}${suitNotation[card.suit!]}`
}

/**
 * Count cards by rank in an array
 *
 * Useful for hand analysis
 */
export const countByRank = (cards: Card[]): Record<CardRank, number> => {
  const counts: Record<CardRank, number> = {
    [CardRank.TWO]: 0,
    [CardRank.THREE]: 0,
    [CardRank.FOUR]: 0,
    [CardRank.FIVE]: 0,
    [CardRank.SIX]: 0,
    [CardRank.SEVEN]: 0,
    [CardRank.EIGHT]: 0,
    [CardRank.NINE]: 0,
    [CardRank.TEN]: 0,
    [CardRank.JACK]: 0,
    [CardRank.QUEEN]: 0,
    [CardRank.KING]: 0,
    [CardRank.ACE]: 0,
  }

  for (const card of cards) {
    if (!card.isJoker && card.rank) {
      counts[card.rank]++
    }
  }

  return counts
}

/**
 * Count cards by suit in an array
 */
export const countBySuit = (cards: Card[]): Record<CardSuit, number> => {
  const counts: Record<CardSuit, number> = {
    [CardSuit.DIAMONDS]: 0,
    [CardSuit.CLUBS]: 0,
    [CardSuit.SPADES]: 0,
    [CardSuit.HEARTS]: 0,
  }

  for (const card of cards) {
    if (!card.isJoker && card.suit) {
      counts[card.suit]++
    }
  }

  return counts
}

/**
 * Check if array contains any jokers
 */
export const hasJoker = (cards: Card[]): boolean => {
  return cards.some((card) => card.isJoker)
}

/**
 * Filter cards by suit
 */
export const filterBySuit = (cards: Card[], suit: CardSuit): Card[] => {
  return cards.filter((card) => !card.isJoker && card.suit === suit)
}

/**
 * Filter cards by rank
 */
export const filterByRank = (cards: Card[], rank: CardRank): Card[] => {
  return cards.filter((card) => !card.isJoker && card.rank === rank)
}

/**
 * Sort cards by rank (ascending order: 2 → Ace)
 */
export const sortByRank = (cards: Card[]): Card[] => {
  const rankOrder: Record<CardRank, number> = {
    [CardRank.TWO]: 0,
    [CardRank.THREE]: 1,
    [CardRank.FOUR]: 2,
    [CardRank.FIVE]: 3,
    [CardRank.SIX]: 4,
    [CardRank.SEVEN]: 5,
    [CardRank.EIGHT]: 6,
    [CardRank.NINE]: 7,
    [CardRank.TEN]: 8,
    [CardRank.JACK]: 9,
    [CardRank.QUEEN]: 10,
    [CardRank.KING]: 11,
    [CardRank.ACE]: 12,
  }

  return [...cards].sort((a, b) => {
    if (a.isJoker && b.isJoker) return 0
    if (a.isJoker) return 1 // Jokers go to end
    if (b.isJoker) return -1
    return rankOrder[a.rank!] - rankOrder[b.rank!]
  })
}

/**
 * Sort cards by suit then rank
 */
export const sortBySuitThenRank = (cards: Card[]): Card[] => {
  const suitOrder: Record<CardSuit, number> = {
    [CardSuit.CLUBS]: 0,
    [CardSuit.DIAMONDS]: 1,
    [CardSuit.HEARTS]: 2,
    [CardSuit.SPADES]: 3,
  }

  const rankOrder: Record<CardRank, number> = {
    [CardRank.TWO]: 0,
    [CardRank.THREE]: 1,
    [CardRank.FOUR]: 2,
    [CardRank.FIVE]: 3,
    [CardRank.SIX]: 4,
    [CardRank.SEVEN]: 5,
    [CardRank.EIGHT]: 6,
    [CardRank.NINE]: 7,
    [CardRank.TEN]: 8,
    [CardRank.JACK]: 9,
    [CardRank.QUEEN]: 10,
    [CardRank.KING]: 11,
    [CardRank.ACE]: 12,
  }

  return [...cards].sort((a, b) => {
    if (a.isJoker && b.isJoker) return 0
    if (a.isJoker) return 1
    if (b.isJoker) return -1

    const suitCompare = suitOrder[a.suit!] - suitOrder[b.suit!]
    if (suitCompare !== 0) return suitCompare

    return rankOrder[a.rank!] - rankOrder[b.rank!]
  })
}
