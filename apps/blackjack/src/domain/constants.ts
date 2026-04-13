/**
 * Blackjack Domain Constants
 * Game configuration, rules, and default values
 */

import type { GameRules } from './types'

// ┌─────────────────────────────────────────────────────────┐
// │ GAME RULES & CONFIGURATION                              │
// └─────────────────────────────────────────────────────────┘

/**
 * Vegas Strip Blackjack Rules (most common variant)
 */
export const RULES_VEGAS_STRIP: GameRules = {
  deckCount: 8,
  dealerHitsSoft17: true,
  doubleDownOn: 'any', // Can double on any initial two cards
  canSurrender: true,
  maxSplits: 4,
  canResplitAces: false,
  aces1CardOnly: true,
  blackjackPayoutRatio: 1.5 as const,
  houseEdgePercent: 0.48,
  minBet: 10,
  maxBet: 500,
}

/**
 * Single Deck Blackjack Rules
 */
export const RULES_SINGLE_DECK: GameRules = {
  deckCount: 1,
  dealerHitsSoft17: true,
  doubleDownOn: 'any',
  canSurrender: false,
  maxSplits: 4,
  canResplitAces: false,
  aces1CardOnly: true,
  blackjackPayoutRatio: 1.5 as const,
  houseEdgePercent: 0.42,
  minBet: 5,
  maxBet: 500,
}

/**
 * Hard Rock Blackjack Rules (restrictive)
 */
export const RULES_HARD_ROCK: GameRules = {
  deckCount: 6,
  dealerHitsSoft17: false, // Stand on soft 17 (S17)
  doubleDownOn: '10-11', // Only 10 or 11
  canSurrender: false,
  maxSplits: 3,
  canResplitAces: false,
  aces1CardOnly: true,
  blackjackPayoutRatio: 1.5 as const,
  houseEdgePercent: 0.62,
  minBet: 15,
  maxBet: 1000,
}

// ┌─────────────────────────────────────────────────────────┐
// │ CHIP DENOMINATIONS                                      │
// └─────────────────────────────────────────────────────────┘

/**
 * Standard casino chip denominations (lowest to highest)
 * Used for betting UI and chip-based banking system
 */
export const CHIP_DENOMINATIONS = [1, 5, 10, 25, 50, 100, 500, 1000] as const
export type ChipDenomination = (typeof CHIP_DENOMINATIONS)[number]

// ┌─────────────────────────────────────────────────────────┐
// │ GAME LIMITS                                             │
// └─────────────────────────────────────────────────────────┘

export const MIN_BET = 5
export const MAX_BET = 1000
export const DEFAULT_BET = 50
export const DEFAULT_STARTING_BALANCE = 1000

// ┌─────────────────────────────────────────────────────────┐
// │ GAME PHASES                                             │
// └─────────────────────────────────────────────────────────┘

export const HAND_STATUSES = [
  'initial',
  'playing',
  'stand',
  'bust',
  'blackjack',
  'settled',
] as const
export const GAME_PHASES = [
  'betting',
  'dealing',
  'playing',
  'dealer-turn',
  'settlement',
  'game-over',
] as const

// ┌─────────────────────────────────────────────────────────┐
// │ CARD PROPERTIES                                         │
// └─────────────────────────────────────────────────────────┘

export const CARD_SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const
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

export const CARD_VALUES: Record<string, number> = {
  A: 11,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 10,
  Q: 10,
  K: 10,
}

// ┌─────────────────────────────────────────────────────────┐
// │ ANIMATION & TIMING                                      │
// └─────────────────────────────────────────────────────────┘

export const DEAL_ANIMATION_MS = 300
export const CARD_FLIP_MS = 200
export const DEALER_THINK_MS = 500
export const SETTLEMENT_DELAY_MS = 1000
