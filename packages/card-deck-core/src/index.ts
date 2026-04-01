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
export type {
  Card,
  CardShoe,
  CardValue,
  Deck,
  DeckConfig,
  DeckStatistics,
  DrawResult,
  JokerColor,
  Rank,
  Suit,
} from './types'

// Card value operations
export {
  compareRanks,
  formatCard,
  getAllSuits,
  getCardNumericValue,
  getCardValue,
  getStandardRankOrder,
  getSuitName,
  getSuitSymbol,
  isSameRank,
  isSameSuit,
} from './card-values'

// Deck operations
export {
  burnCards,
  cardExists,
  createDeck,
  dealCards,
  findCard,
  getCardsByRank,
  getCardsBySuit,
  getDeckStatistics,
  peekCards,
  resetDeck,
  shuffleDeck,
} from './deck'

// Shoe operations (multi-deck)
export {
  advanceIfPenetrationExceeded,
  burnFromShoe,
  checkShocePenetration,
  createShoe,
  dealFromShoe,
  getCurrentDeck,
  getCurrentDeckPenetration,
  getShoeStatistics,
  getTotalRemainingCards,
  resetShoe,
  reshuffleCurrentDeck,
} from './shoe'

// Standard configurations
export {
  BACCARAT_SHOE,
  BLACKJACK_DOUBLE_DECK,
  BLACKJACK_EIGHT_DECK,
  BLACKJACK_SINGLE_DECK,
  BLACKJACK_SIX_DECK,
  CRAZY_EIGHTS_DECK,
  DECK_WITH_2_JOKERS,
  DECK_WITH_4_JOKERS,
  GIN_RUMMY_DECK,
  GO_FISH_DECK,
  RUMMY_DECK,
  SOLITAIRE_DECK,
  STANDARD_DECK,
  WAR_DECK,
} from './constants'
