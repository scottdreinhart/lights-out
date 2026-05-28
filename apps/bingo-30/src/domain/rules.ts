/**
 * Mini Bingo (3x3 variant) - core game state transitions.
 */

import { createBingoCards, isWinner } from './card'
import { ALL_NUMBERS, MAX_NUMBER } from './constants'
import type { DrawResult, GameState } from './types'

/**
 * Create a fresh game state.
 */
export function createGameState(cardCount: number = 1): GameState {
  const safeCardCount = Math.max(1, cardCount)

  return {
    cards: createBingoCards(safeCardCount),
    drawnNumbers: new Set<number>(),
    winners: [],
    gameActive: true,
    currentDrawn: null,
  }
}

/**
 * Start a new game.
 */
export function newGame(cardCount: number = 1): GameState {
  return createGameState(cardCount)
}

/**
 * Draw a new number and update mutable state.
 */
export function drawNumber(state: GameState): DrawResult | null {
  if (!state.gameActive || state.drawnNumbers.size >= MAX_NUMBER) {
    return null
  }

  const availableNumbers = ALL_NUMBERS.filter((num) => !state.drawnNumbers.has(num))
  if (availableNumbers.length === 0) {
    state.gameActive = false
    return null
  }

  const drawn = availableNumbers[Math.floor(Math.random() * availableNumbers.length)]
  state.drawnNumbers.add(drawn)
  state.currentDrawn = drawn

  const winners = state.cards
    .filter((card) => isWinner(card, state.drawnNumbers))
    .map((card) => card.id)

  state.winners = winners
  if (winners.length > 0 || state.drawnNumbers.size >= MAX_NUMBER) {
    state.gameActive = false
  }

  return { number: drawn, winners }
}

/**
 * Reset the current game state in place while keeping the same cards.
 */
export function resetGame(state: GameState): void {
  state.drawnNumbers.clear()
  state.winners = []
  state.currentDrawn = null
  state.gameActive = true
}

/**
 * Return card numbers that are closest to winning.
 */
export function getHintPositions(state: GameState, cardId: number, count: number = 1): number[] {
  const card = state.cards.find((item) => item.id === cardId)
  if (!card) {
    return []
  }

  const remaining = card.numbers.flat().filter((num) => !state.drawnNumbers.has(num))

  if (remaining.length === 0) {
    return []
  }

  return remaining.slice(0, Math.max(1, count))
}
