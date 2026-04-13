/**
 * Blackjack Domain Rules
 * Pure functions for game logic, independent of React/UI frameworks
 */

import type { Card, GameAction, GameState, Hand, HandStatus, SettlementResult } from './types'
import { RULES_VEGAS_STRIP } from './constants'

// ┌─────────────────────────────────────────────────────────┐
// │ HAND VALUE CALCULATION                                  │
// └─────────────────────────────────────────────────────────┘

/**
 * Calculate the numeric value of a hand, considering aces.
 * Returns the highest valid value without busting, if possible.
 */
export function calculateHandValue(hand: Hand | Card[]): number {
  const cards = Array.isArray(hand) ? hand : hand.cards
  let value = 0
  let aces = 0

  for (const card of cards) {
    const rank = card.rank.toLowerCase()
    if (rank === 'ace') {
      aces += 1
      value += 11
    } else if (['jack', 'queen', 'king'].includes(rank)) {
      value += 10
    } else {
      value += parseInt(rank, 10)
    }
  }

  // Adjust for aces if needed to avoid bust
  while (value > 21 && aces > 0) {
    value -= 10
    aces -= 1
  }

  return value
}

/**
 * Get both soft and hard values of a hand for decision-making
 */
export function getHandValues(hand: Hand | Card[]): { hard: number; soft?: number } {
  const cards = Array.isArray(hand) ? hand : hand.cards
  let hardValue = 0
  let aces = 0

  for (const card of cards) {
    const rank = card.rank.toLowerCase()
    if (rank === 'ace') {
      aces += 1
      hardValue += 1
    } else if (['jack', 'queen', 'king'].includes(rank)) {
      hardValue += 10
    } else {
      hardValue += parseInt(rank, 10)
    }
  }

  const softValue = aces > 0 ? hardValue + 10 : undefined
  return {
    hard: hardValue,
    soft: softValue && softValue <= 21 ? softValue : undefined,
  }
}

/**
 * Get the best valid hand value (highest without busting)
 */
export function getBestHandValue(hand: Hand | Card[]): number {
  const values = getHandValues(hand)
  return values.soft || values.hard
}

// ┌─────────────────────────────────────────────────────────┐
// │ HAND STATUS CHECKS                                      │
// └─────────────────────────────────────────────────────────┘

/**
 * Check if a hand is bust (over 21)
 */
export function isBust(hand: Hand | Card[]): boolean {
  return calculateHandValue(hand) > 21
}

/**
 * Check if a hand is a natural blackjack (21 with 2 cards)
 */
export function isNaturalBlackjack(hand: Hand | Card[]): boolean {
  const cards = Array.isArray(hand) ? hand : hand.cards
  return cards.length === 2 && calculateHandValue(hand) === 21
}

/**
 * Check if a hand is a push (21)
 */
export function isTwentyOne(hand: Hand | Card[]): boolean {
  return calculateHandValue(hand) === 21
}

// ┌─────────────────────────────────────────────────────────┐
// │ VALID ACTIONS                                           │
// └─────────────────────────────────────────────────────────┘

/**
 * Check if player can hit
 */
export function canHit(hand: Hand | Card[]): boolean {
  const cards = Array.isArray(hand) ? hand : hand.cards
  return cards.length < 21 && !isBust(hand) // Arbitrary limit to prevent infinite loops
}

/**
 * Check if player can stand
 */
export function canStand(hand: Hand | Card[]): boolean {
  return !isBust(hand)
}

/**
 * Check if player can double down
 */
export function canDoubleDown(hand: Hand | Card[]): boolean {
  const cards = Array.isArray(hand) ? hand : hand.cards
  return cards.length === 2 && calculateHandValue(hand) >= 9 && calculateHandValue(hand) <= 11
}

/**
 * Check if player can split
 */
export function canSplit(hand: Hand | Card[]): boolean {
  const cards = Array.isArray(hand) ? hand : hand.cards
  if (cards.length !== 2) {
    return false
  }
  // Can split if both cards have same rank or same value (e.g., 10, J, Q, K)
  const cardsOfValue = cards.filter((c) => ['10', 'J', 'Q', 'K'].includes(c.rank)).length
  return cards[0].rank === cards[1].rank || (cardsOfValue === 2 && calculateHandValue(hand) === 20)
}

// ┌─────────────────────────────────────────────────────────┐
// │ SETTLEMENT LOGIC                                        │
// └─────────────────────────────────────────────────────────┘

/**
 * Determine the outcome of a hand against dealer hand
 */
export function determineOutcome(
  playerHand: Hand | Card[],
  dealerHand: Hand | Card[],
): SettlementResult {
  const playerValue = calculateHandValue(playerHand)
  const dealerValue = calculateHandValue(dealerHand)

  // Player bust
  if (playerValue > 21) {
    return 'loss'
  }

  // Dealer bust
  if (dealerValue > 21) {
    return 'win'
  }

  // Compare values
  if (playerValue > dealerValue) {
    return 'win'
  }
  if (playerValue < dealerValue) {
    return 'loss'
  }
  return 'push'
}

/**
 * Calculate payout based on outcome and hand type
 */
export function calculatePayout(
  bet: number,
  outcome: SettlementResult,
  isBlackjack: boolean,
): number {
  if (outcome === 'push') {
    return 0
  }
  if (outcome === 'loss') {
    return -bet
  }
  // Win: 1:1 payout, except blackjack which is 3:2
  return isBlackjack ? bet * 1.5 : bet
}

// ┌─────────────────────────────────────────────────────────┐
// │ GAME STATE MANAGEMENT                                   │
// └─────────────────────────────────────────────────────────┘

/**
 * Create initial game state
 */
export function createGameState(playerBalance: number = 1000): GameState {
  return {
    id: `game-${Date.now()}`,
    phase: 'betting',
    players: [
      {
        id: 'player-1',
        balance: playerBalance,
        currentHand: {
          id: 'hand-1',
          cards: [],
          bet: 0,
          status: 'initial',
        },
        splitHands: [],
      },
    ],
    dealer: {
      hand: [],
      status: 'initial',
    },
    deck: [],
    discardPile: [],
    decksRemaining: 8,
    rules: RULES_VEGAS_STRIP,
    timestamp: new Date(),
    history: [],
  }
}

/**
 * Deal initial hands (2 cards each)
 */
export function dealInitialHands(
  gameState: GameState,
  playerCards: Card[],
  dealerCards: Card[],
): GameState {
  if (playerCards.length < 2 || dealerCards.length < 2) {
    throw new Error('Must deal at least 2 cards per hand')
  }

  const player = gameState.players[0]
  if (!player) {
    throw new Error('No active player in game state')
  }

  return {
    ...gameState,
    phase: 'playing',
    players: [
      {
        ...player,
        currentHand: {
          ...player.currentHand,
          cards: playerCards.slice(0, 2),
          status: isNaturalBlackjack(playerCards) ? 'blackjack' : 'playing',
        },
      },
      ...gameState.players.slice(1),
    ],
    dealer: {
      hand: dealerCards.slice(0, 2),
      status: 'playing',
    },
  }
}

/**
 * Process a player action (hit, stand, etc.)
 */
export function processPlayerAction(gameState: GameState, action: GameAction): GameState {
  const player = gameState.players[0]
  if (!player) return gameState

  switch (action) {
    case 'hit': {
      // Note: Card dealing is now handled in the app layer
      // This function assumes the card has already been added to the hand
      const updatedCards = player.currentHand.cards
      return {
        ...gameState,
        players: [
          {
            ...player,
            currentHand: {
              ...player.currentHand,
              cards: updatedCards,
              status: isBust(updatedCards) ? 'bust' : 'playing',
            },
          },
          ...gameState.players.slice(1),
        ],
      }
    }

    case 'stand':
      return {
        ...gameState,
        players: [
          {
            ...player,
            currentHand: {
              ...player.currentHand,
              status: 'stand',
            },
          },
          ...gameState.players.slice(1),
        ],
      }

    case 'double': {
      // Note: Card dealing is now handled in the app layer
      // This function assumes the card has already been added to the hand
      const updatedCards = player.currentHand.cards
      return {
        ...gameState,
        players: [
          {
            ...player,
            currentHand: {
              ...player.currentHand,
              cards: updatedCards,
              bet: player.currentHand.bet * 2,
              status: isBust(updatedCards) ? 'bust' : 'stand',
            },
          },
          ...gameState.players.slice(1),
        ],
      }
    }

    case 'split': {
      // Create two hands from the original pair
      const [card1, card2] = player.currentHand.cards
      const splitHand1 = { ...player.currentHand, cards: [card1] }
      const splitHand2 = {
        ...player.currentHand,
        id: `hand-split-${Date.now()}`,
        cards: [card2],
      }
      return {
        ...gameState,
        players: [
          {
            ...player,
            currentHand: splitHand1,
            splitHands: [splitHand2],
          },
          ...gameState.players.slice(1),
        ],
      }
    }

    case 'surrender':
      return {
        ...gameState,
        players: [
          {
            ...player,
            currentHand: {
              ...player.currentHand,
              status: 'settled',
            },
          },
          ...gameState.players.slice(1),
        ],
        phase: 'settling',
      }

    default:
      return gameState
  }
}

/**
 * Play out dealer's hand
 */
export function playDealerTurn(gameState: GameState): GameState {
  // Note: Card dealing is now handled in the app layer
  // This function assumes cards have already been added to dealer's hand
  const dealerHand = gameState.dealer.hand
  let dealerStatus: HandStatus = 'stand'

  // Dealer hits on soft 17 (typical Vegas rule)
  if (calculateHandValue(dealerHand) < 17) {
    dealerStatus = 'playing'
  } else if (isBust(dealerHand)) {
    dealerStatus = 'bust'
  }

  return {
    ...gameState,
    dealer: {
      hand: dealerHand,
      status: dealerStatus,
    },
  }
}
