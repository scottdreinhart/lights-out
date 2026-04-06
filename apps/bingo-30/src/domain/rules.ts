/**
 * Mini Bingo game rules and state management (3x3 variant).
 */

import { createBingoCards, isWinner, markNumber } from './card'
import type { DrawResult, GameState } from './types'

const ALL_NUMBERS = Array.from({ length: 25 }, (_, i) => i + 1)

/**
 * Initialize a new mini bingo game
 */
export function createGameState(cardCount: number = 1): GameState {
  return {
    cards: createBingoCards(cardCount),
    drawnNumbers: new Set(),
    winners: [],
    gameActive: true,
    currentDrawn: null,
  }
}

/**
 * Draw the next random number
 */
export function drawNumber(state: GameState): DrawResult | null {
  if (!state.gameActive || state.drawnNumbers.size >= ALL_NUMBERS.length) {
    return null
  }

  const availableNumbers = ALL_NUMBERS.filter((n) => !state.drawnNumbers.has(n))
  if (availableNumbers.length === 0) {
    return null
  }

  const number = availableNumbers[Math.floor(Math.random() * availableNumbers.length)]
  state.drawnNumbers.add(number)
  state.currentDrawn = number

  // Mark number on all cards and check for winners
  const newWinners: number[] = []
  for (const card of state.cards) {
    markNumber(card, number)
    if (isWinner(card, state.drawnNumbers) && !state.winners.includes(card.id)) {
      newWinners.push(card.id)
      state.winners.push(card.id)
    }
  }

  return {
    number,
    winners: newWinners,
  }
}

/**
 * Reset the game
 */
export function resetGame(state: GameState): void {
  state.drawnNumbers.clear()
  state.currentDrawn = null
  state.gameActive = true
  state.winners = []
}

/**
 * Start a new game
 */
export function newGame(cardCount: number): GameState {
  return createGameState(cardCount)
}

/**
 * Check if a number has been drawn
 */
export function isNumberDrawn(state: GameState, number: number): boolean {
  return state.drawnNumbers.has(number)
}

/**
 * Get hint positions (random unmarked numbers)
 */
export function getHintPositions(state: GameState, cardId: number, count: number = 3): number[] {
  const card = state.cards.find((c) => c.id === cardId)
  if (!card) return []

  const unmarked: number[] = []
  for (const row of card.numbers) {
    for (const num of row) {
      if (!state.drawnNumbers.has(num)) {
        unmarked.push(num)
      }
    }
  }

  // Return random hints
  const hints: number[] = []
  for (let i = 0; i < Math.min(count, unmarked.length); i++) {
    const randomIndex = Math.floor(Math.random() * unmarked.length)
    hints.push(unmarked[randomIndex])
    unmarked.splice(randomIndex, 1)
  }

  return hints
}
