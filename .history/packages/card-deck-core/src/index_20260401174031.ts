/**
 * Card Deck Core
 * Shared card deck system for all card games on the platform
 *
 * Provides:
 * - Standard playing cards (52-card deck)
 * - Joker support (53-54 card decks)
 * - Card values and comparison
 * - Deck operations (shuffle, deal, burn, reset)
 * - Multi-deck shoe system for casino-style games
 *
 * Usage:
 * ```typescript
 * import {
 *   createDeck,
 *   shuffleDeck,
 *   dealCards,
 *   STANDARD_DECK,
 *   getCardValue
 * } from '@games/card-deck-core'
 *
 * const deck = createDeck(STANDARD_DECK)
 * shuffleDeck(deck)
 * const { cards } = dealCards(deck, 5)
 * ```
 */

// Types
export type { Card, CardValue, Deck, DeckConfig, DrawResult, CardShoe, DeckStatistics, Suit, Rank, JokerColor } from './types'

// Card value operations
export {
  getCardValue,
  getCardNumericValue,
  isSameRank,
  isSameSuit,
  compareRanks,
  formatCard,
  getSuitName,
  getSuitSymbol,
  getStandardRankOrder,
  getAllSuits,
} from './card-values'

// Deck operations
export {
  createDeck,
  shuffleDeck,
  dealCards,
  peekCards,
  burnCards,
  resetDeck,
  getDeckStatistics,
  cardExists,
  findCard,
  getCardsByRank,
  getCardsBySuit,
} from './deck'

// Shoe operations (multi-deck)
export {
  createShoe,
  getCurrentDeck,
  dealFromShoe,
  burnFromShoe,
  checkShocePenetration,
  getTotalRemainingCards,
  reshuffleCurrentDeck,
  resetShoe,
  getShoeStatistics,
  advanceIfPenetrationExceeded,
  getCurrentDeckPenetration,
} from './shoe'

// Standard configurations
export {
  STANDARD_DECK,
  DECK_WITH_2_JOKERS,
  DECK_WITH_4_JOKERS,
  BLACKJACK_SINGLE_DECK,
  BLACKJACK_DOUBLE_DECK,
  BLACKJACK_SIX_DECK,
  BLACKJACK_EIGHT_DECK,
  BACCARAT_SHOE,
  RUMMY_DECK,
  GIN_RUMMY_DECK,
  SOLITAIRE_DECK,
  WAR_DECK,
  GO_FISH_DECK,
  CRAZY_EIGHTS_DECK,
} from './constants'
