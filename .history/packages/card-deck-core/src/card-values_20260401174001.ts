/**
 * Card Value System
 * Calculates numeric values for cards used in scoring and comparison
 * Different games may treat values differently (e.g., Ace = 1 or 11)
 */

import type { Card, CardValue, Rank } from './types'

/**
 * Get the standard numeric value(s) for a card rank
 * Used in most traditional card games
 * - Ranks 2-10: Face value
 * - Jack, Queen, King: 10
 * - Ace: 1 (or 11 in blackjack-like games)
 * - Joker: 0 (or game-specific value)
 */
export function getCardNumericValue(rank: Rank): { primary: number; alternate?: number } {
  switch (rank) {
    case 'A':
      return { primary: 1, alternate: 11 } // Ace is 1 or 11
    case '2':
      return { primary: 2 }
    case '3':
      return { primary: 3 }
    case '4':
      return { primary: 4 }
    case '5':
      return { primary: 5 }
    case '6':
      return { primary: 6 }
    case '7':
      return { primary: 7 }
    case '8':
      return { primary: 8 }
    case '9':
      return { primary: 9 }
    case '10':
      return { primary: 10 }
    case 'J':
      return { primary: 10 } // Jack is 10
    case 'Q':
      return { primary: 10 } // Queen is 10
    case 'K':
      return { primary: 10 } // King is 10
    case 'joker':
      return { primary: 0 } // Joker default is 0 (game-specific)
    default:
      // TypeScript exhaustiveness check
      const _exhaustive: never = rank
      return _exhaustive
  }
}

/**
 * Get the full CardValue object for a card
 * Includes primary/alternate values, type flags
 */
export function getCardValue(card: Card): CardValue {
  const isJoker = card.rank === 'joker'
  const isFaceCard = card.rank === 'J' || card.rank === 'Q' || card.rank === 'K'
  const numericValue = getCardNumericValue(card.rank)

  return {
    card,
    primaryValue: numericValue.primary,
    alternateValue: numericValue.alternate,
    isJoker,
    isFaceCard,
  }
}

/**
 * Check if two cards have the same rank
 * Useful for matching games, pairs, etc.
 */
export function isSameRank(card1: Card, card2: Card): boolean {
  return card1.rank === card2.rank
}

/**
 * Check if two cards have the same suit
 * Jokers have no suit (suit = null)
 */
export function isSameSuit(card1: Card, card2: Card): boolean {
  if (card1.suit === null || card2.suit === null) {
    return false
  }
  return card1.suit === card2.suit
}

/**
 * Get all ranks in standard order (A, 2-10, J, Q, K)
 */
export function getStandardRankOrder(): Rank[] {
  return ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
}

/**
 * Get all suits
 */
export function getAllSuits() {
  return ['diamonds', 'clubs', 'spades', 'hearts'] as const
}

/**
 * Rank comparison: which rank is "higher"?
 * Useful for trick-taking games, poker, etc.
 * Returns: -1 if rank1 < rank2, 0 if equal, 1 if rank1 > rank2
 * Treats Ace as highest
 */
export function compareRanks(rank1: Rank, rank2: Rank, aceLow: boolean = false): -1 | 0 | 1 {
  const order = getStandardRankOrder()

  if (rank1 === rank2) return 0

  // Handle jokers
  if (rank1 === 'joker' && rank2 === 'joker') return 0
  if (rank1 === 'joker') return 1 // Joker is always highest
  if (rank2 === 'joker') return -1

  const idx1 = order.indexOf(rank1)
  const idx2 = order.indexOf(rank2)

  if (aceLow && rank1 === 'A') return -1
  if (aceLow && rank2 === 'A') return 1

  if (idx1 < idx2) return -1
  return 1
}

/**
 * Get human-readable name for a card suit
 */
export function getSuitName(suit: string | null): string {
  switch (suit) {
    case 'diamonds':
      return '♦ Diamonds'
    case 'clubs':
      return '♣ Clubs'
    case 'spades':
      return '♠ Spades'
    case 'hearts':
      return '♥ Hearts'
    default:
      return 'No Suit'
  }
}

/**
 * Format a card as a human-readable string
 * Examples: "5♦", "K♣", "Red Joker"
 */
export function formatCard(card: Card): string {
  if (card.rank === 'joker') {
    return card.color
      ? `${card.color.charAt(0).toUpperCase()}${card.color.slice(1)} Joker`
      : 'Joker'
  }

  const suitSymbol = getSuitSymbol(card.suit)
  return `${card.rank}${suitSymbol}`
}

/**
 * Get the symbol for a suit
 */
export function getSuitSymbol(suit: string | null): string {
  switch (suit) {
    case 'diamonds':
      return '♦'
    case 'clubs':
      return '♣'
    case 'spades':
      return '♠'
    case 'hearts':
      return '♥'
    default:
      return '?'
  }
}
