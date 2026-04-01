/**
 * Standard Deck Configurations
 * Pre-defined common deck setups for various card games
 */

import type { DeckConfig } from './types'

/**
 * Standard 52-card deck (no jokers)
 * Used in: Poker, Bridge, most traditional card games
 */
export const STANDARD_DECK: DeckConfig = {
  deckCount: 1,
  includeJokers: false,
}

/**
 * 53-card deck with 2 jokers
 * Used in: Some rummy variants, certain regional games
 */
export const DECK_WITH_2_JOKERS: DeckConfig = {
  deckCount: 1,
  includeJokers: true,
  jokerCount: 2,
}

/**
 * 54-card deck with 4 jokers
 * Used in: Some Chinese card games, special variants
 */
export const DECK_WITH_4_JOKERS: DeckConfig = {
  deckCount: 1,
  includeJokers: true,
  jokerCount: 4,
}

/**
 * Single-deck blackjack (52 cards, no jokers)
 */
export const BLACKJACK_SINGLE_DECK: DeckConfig = {
  deckCount: 1,
  includeJokers: false,
}

/**
 * Double-deck blackjack (104 cards, no jokers)
 * Common in casinos
 */
export const BLACKJACK_DOUBLE_DECK: DeckConfig = {
  deckCount: 2,
  includeJokers: false,
}

/**
 * Six-deck shoe (312 cards, no jokers)
 * Standard in most casinos
 */
export const BLACKJACK_SIX_DECK: DeckConfig = {
  deckCount: 6,
  includeJokers: false,
}

/**
 * Eight-deck shoe (416 cards, no jokers)
 * Used in high-stakes casino games
 */
export const BLACKJACK_EIGHT_DECK: DeckConfig = {
  deckCount: 8,
  includeJokers: false,
}

/**
 * Baccarat shoe (8 decks, no jokers)
 */
export const BACCARAT_SHOE: DeckConfig = {
  deckCount: 8,
  includeJokers: false,
}

/**
 * Standard Rummy deck (1 deck, 2 jokers)
 */
export const RUMMY_DECK: DeckConfig = {
  deckCount: 1,
  includeJokers: true,
  jokerCount: 2,
}

/**
 * Gin Rummy (standard 52-card deck, no jokers)
 */
export const GIN_RUMMY_DECK: DeckConfig = {
  deckCount: 1,
  includeJokers: false,
}

/**
 * Solitaire deck (standard 52 cards, no jokers)
 */
export const SOLITAIRE_DECK: DeckConfig = {
  deckCount: 1,
  includeJokers: false,
}

/**
 * War game (standard 52 cards, no jokers, divided between players)
 */
export const WAR_DECK: DeckConfig = {
  deckCount: 1,
  includeJokers: false,
}

/**
 * Go Fish (standard 52 cards, no jokers)
 */
export const GO_FISH_DECK: DeckConfig = {
  deckCount: 1,
  includeJokers: false,
}

/**
 * Crazy Eights (standard 52 cards, no jokers)
 */
export const CRAZY_EIGHTS_DECK: DeckConfig = {
  deckCount: 1,
  includeJokers: false,
}
