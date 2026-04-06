/**
 * Bingo game rules and state management.
 */

import { checkWinningPatterns, createBingoCards, isWinner, markNumber } from './card'
import type { BingoGameState, DrawResult } from './types'

const ALL_NUMBERS = Array.from({ length: 75 }, (_, i) => i + 1)

/**
 * Initialize a new game with specified number of cards.
 */
export function createGameState(cardCount: number = 1): BingoGameState {
  return {
    cards: createBingoCards(cardCount),
    drawnNumbers: new Set(),
    winners: [],
    gameActive: true,
    currentDrawn: null,
  }
}

/**
 * Draw the next random number from the pool.
 */
export function drawNumber(state: BingoGameState): DrawResult | null {
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

  // Mark number on all cards
  for (const card of state.cards) {
    markNumber(card, number)
  }

  // Check for winners
  const newWinners = state.cards
    .filter((card) => !state.winners.includes(card.id) && isWinner(card))
    .map((card) => card.id)

  state.winners.push(...newWinners)

  return {
    number,
    winners: newWinners,
  }
}

/**
 * Draw multiple numbers in sequence.
 */
export function drawNumbers(state: BingoGameState, count: number): (DrawResult | null)[] {
  const results: (DrawResult | null)[] = []
  for (let i = 0; i < count; i++) {
    const result = drawNumber(state)
    results.push(result)
    if (!result) {
      break
    }
  }
  return results
}

/**
 * Get the next number that would be drawn from the pool.
 */
export function peekNextNumber(state: BingoGameState): number | null {
  const availableNumbers = ALL_NUMBERS.filter((n) => !state.drawnNumbers.has(n))
  return availableNumbers.length > 0 ? availableNumbers[0] : null
}

/**
 * Get all remaining numbers in the draw pool.
 */
export function getRemainingNumbers(state: BingoGameState): number[] {
  return ALL_NUMBERS.filter((n) => !state.drawnNumbers.has(n))
}

/**
 * Check if a card is a winner.
 */
export function checkCardWin(state: BingoGameState, cardId: string): boolean {
  const card = state.cards.find((c) => c.id === cardId)
  return card ? isWinner(card) : false
}

/**
 * Get winning patterns for a card.
 */
export function getCardPatterns(state: BingoGameState, cardId: string): string[] {
  const card = state.cards.find((c) => c.id === cardId)
  return card ? checkWinningPatterns(card) : []
}

/**
 * Get hint for a card - returns positions of unmarked numbers that are still available.
 */
export function getCardHint(state: BingoGameState, cardId: string): { row: number; col: number }[] {
  const card = state.cards.find((c) => c.id === cardId)
  if (!card) {
    return []
  }

  const hintPositions: { row: number; col: number }[] = []

  for (let row = 0; row < card.grid.length; row++) {
    for (let col = 0; col < card.grid[row].length; col++) {
      const cell = card.grid[row][col]
      // Only hint for unmarked cells that have numbers and are still available
      if (!cell.marked && cell.number && !state.drawnNumbers.has(cell.number)) {
        hintPositions.push({ row, col })
      }
    }
  }

  return hintPositions
}

/**
 * Reset the game state (keep cards, reset draws).
 */
export function resetGame(state: BingoGameState): BingoGameState {
  return {
    ...state,
    drawnNumbers: new Set(),
    winners: [],
    gameActive: true,
    currentDrawn: null,
  }
}

/**
 * Get game statistics.
 */
export function getGameStats(state: BingoGameState) {
  return {
    totalCards: state.cards.length,
    numbersDrawn: state.drawnNumbers.size,
    numbersRemaining: ALL_NUMBERS.length - state.drawnNumbers.size,
    winners: state.winners,
    completion: (state.drawnNumbers.size / ALL_NUMBERS.length) * 100,
  }
}
