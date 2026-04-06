/**
 * Progressive Bingo game rules and state management
 * Standard 5x5 grid (75 balls) with progressive jackpot levels
 */

import { createBingoCards, isWinner, markNumber } from './card'
import type { DrawResult, GameState } from './types'

const ALL_NUMBERS = Array.from({ length: 75 }, (_, i) => i + 1)
const BASE_JACKPOT = 100
const LEVEL_MULTIPLIER = 2

/**
 * Initialize a new progressive bingo game
 */
export function createGameState(cardCount: number = 1): GameState {
  return {
    cards: createBingoCards(cardCount),
    drawnNumbers: new Set(),
    winners: [],
    gameActive: true,
    currentDrawn: null,
    level: 1,
    jackpot: BASE_JACKPOT
  }
}

/**
 * Draw the next random number
 */
export function drawNumber(state: GameState): DrawResult | null {
  if (!state.gameActive || state.drawnNumbers.size >= ALL_NUMBERS.length) {
    return null
  }

  let number: number
  do {
    number = ALL_NUMBERS[Math.floor(Math.random() * ALL_NUMBERS.length)]
  } while (state.drawnNumbers.has(number))

  const newDrawnNumbers = new Set(state.drawnNumbers)
  newDrawnNumbers.add(number)

  const markedCards = markNumber(state.cards, number)
  const newWinners: string[] = []

  markedCards.forEach((card, idx) => {
    if (!state.winners.includes(card.id) && isWinner(card)) {
      newWinners.push(card.id)
    }
  })

  state.drawnNumbers = newDrawnNumbers
  state.cards = markedCards
  state.winners = [...state.winners, ...newWinners]
  state.currentDrawn = number

  // Update level and jackpot based on winners
  if (newWinners.length > 0) {
    state.level += newWinners.length
    state.jackpot = BASE_JACKPOT * Math.pow(LEVEL_MULTIPLIER, state.level - 1)
  }

  state.gameActive = newWinners.length === 0 || state.winners.length < state.cards.length

  return {
    number,
    drawnCount: newDrawnNumbers.size,
    totalNumbers: ALL_NUMBERS.length
  }
}

/**
 * Reset the current game
 */
export function resetGame(state: GameState): GameState {
  return createGameState(state.cards.length)
}

/**
 * Get winning card IDs
 */
export function getWinners(state: GameState): string[] {
  return state.winners
}

/**
 * Get current level
 */
export function getLevel(state: GameState): number {
  return state.level
}

/**
 * Get current jackpot
 */
export function getJackpot(state: GameState): number {
  return state.jackpot
}

/**
 * Get hint positions for the last drawn number
 */
export function getHints(state: GameState): number[] {
  if (!state.currentDrawn) return []
  const positions: number[] = []
  state.cards.forEach(card => {
    card.squares.forEach((square, idx) => {
      if (square === state.currentDrawn) {
        positions.push(idx)
      }
    })
  })
  return positions
}
