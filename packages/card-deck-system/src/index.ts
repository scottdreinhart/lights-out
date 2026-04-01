/**
 * Card Deck System — Shared card deck implementation for all card games
 *
 * This package provides a complete, reusable card deck system for all card games
 * in the platform, ensuring consistency in how cards are created, shuffled, dealt,
 * and tracked across player hands, shoe penetration, and multi-deck games.
 *
 * @module @games/card-deck-system
 *
 * ## Exports
 *
 * ### Types
 * - Card, CardSuit, CardRank, DeckConfig, ShoeConfig, ShoeState, CardNumericValue
 *
 * ### Classes
 * - Deck: Single standard deck of cards
 * - Shoe: Multiple decks combined (for multi-deck games like Blackjack)
 *
 * ### Constants
 * - CARD_NUMERIC_VALUES: Card value mappings
 *
 * ### Utilities
 * - Card creation: createCard, createJoker
 * - Card validation: isValidCard
 * - Card comparison: isSameCard, isSameRank, isSameSuit
 * - Card formatting: formatCard, getCardNotation
 * - Hand analysis: countByRank, countBySuit, hasJoker
 * - Filtering: filterBySuit, filterByRank
 * - Sorting: sortByRank, sortBySuitThenRank
 * - Card value: getCardValue, getCardAlternateValues, compareCardRanks
 *
 * ## Examples
 *
 * ### Single Deck (Go-Fish, War, Memory)
 * ```typescript
 * import { Deck } from '@games/card-deck-system'
 *
 * const deck = new Deck()
 * deck.shuffle()
 * const card = deck.dealCard()
 * ```
 *
 * ### Multi-Deck Shoe (Blackjack)
 * ```typescript
 * import { Shoe } from '@games/card-deck-system'
 *
 * const shoe = new Shoe({ deckCount: 6, withJokers: false })
 * shoe.shuffle()
 *
 * while (!shoe.shouldReshuffle()) {
 *   const card = shoe.dealCard()
 * }
 *
 * shoe.reshuffle()
 * ```
 *
 * ### Card Analysis
 * ```typescript
 * import {
 *   formatCard,
 *   countByRank,
 *   getCardValue,
 * } from '@games/card-deck-system'
 *
 * const hand = [/* cards */]
 * const rankCounts = countByRank(hand)
 * console.log(formatCard(hand[0])) // "Ace of Spades"
 * ```
 */

// Types
export { CardSuit, CardRank, type Card, type DeckConfig, type ShoeConfig, type ShoeState, type CardNumericValue } from './types'

// Classes
export { Deck } from './deck'
export { Shoe } from './shoe'

// Card value utilities
export { CARD_NUMERIC_VALUES, getCardValue, getCardAlternateValues, compareCardRanks } from './card-values'

// Card utilities
export {
  createCard,
  createJoker,
  isValidCard,
  isSameCard,
  isSameRank,
  isSameSuit,
  formatCard,
  getCardNotation,
  countByRank,
  countBySuit,
  hasJoker,
  filterBySuit,
  filterByRank,
  sortByRank,
  sortBySuitThenRank,
} from './card-utils'
