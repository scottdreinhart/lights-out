/**
 * Memory Game — Domain Rules
 * Win/loss detection and game state queries.
 * Pure functions operating on domain types only.
 */

import { TOTAL_PAIRS } from './board'
import type { GameState } from './types'

/**
 * Check if the game has been won.
 */
export function isWon(state: GameState): boolean {
  return state.phase === 'won'
}

/**
 * Check if the game is over (won — memory has no loss condition).
 */
export function isGameOver(state: GameState): boolean {
  return state.phase === 'won'
}

/**
 * Return the number of remaining unmatched pairs.
 */
export function remainingPairs(state: GameState): number {
  return TOTAL_PAIRS - state.matchedPairs
}

/**
 * Return whether a card is face-up (flipped or matched).
 */
export function isCardVisible(state: GameState, cardId: number): boolean {
  const card = state.cards.find((c) => c.id === cardId)
  return card ? card.isFlipped || card.isMatched : false
}

/**
 * Return the efficiency score (lower is better — fewer moves).
 */
export function efficiencyScore(state: GameState): number {
  if (state.moves === 0) {
    return 0
  }
  return Math.round((TOTAL_PAIRS / state.moves) * 100)
}
