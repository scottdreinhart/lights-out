/**
 * Speed Bingo game rules and state management.
 * Features automatic rapid drawing for fast-paced gameplay.
 */

import { checkWinningPatterns, createBingoCards, isWinner, markNumber } from './card'
import type { DrawResult, SpeedBingoGameState } from './types'
import { DEFAULT_DRAW_SPEED } from './types'

const ALL_NUMBERS = Array.from({ length: 75 }, (_, i) => i + 1)

/**
 * Initialize a new speed bingo game with specified number of cards.
 */
export function createGameState(
  cardCount: number = 1,
  drawSpeed: number = DEFAULT_DRAW_SPEED,
): SpeedBingoGameState {
  return {
    cards: createBingoCards(cardCount),
    drawnNumbers: new Set(),
    winners: [],
    gameActive: true,
    currentDrawn: null,
    drawSpeed,
    isAutoDrawing: false,
  }
}

/**
 * Draw the next random number from the pool.
 */
export function drawNumber(state: SpeedBingoGameState): DrawResult | null {
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
 * Start automatic drawing at specified speed.
 */
export function startAutoDraw(state: SpeedBingoGameState): void {
  state.isAutoDrawing = true
}

/**
 * Stop automatic drawing.
 */
export function stopAutoDraw(state: SpeedBingoGameState): void {
  state.isAutoDrawing = false
}

/**
 * Update draw speed.
 */
export function setDrawSpeed(state: SpeedBingoGameState, speed: number): void {
  state.drawSpeed = speed
}

/**
 * Draw multiple numbers in sequence (for manual bulk drawing).
 */
export function drawNumbers(state: SpeedBingoGameState, count: number): (DrawResult | null)[] {
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
export function peekNextNumber(state: SpeedBingoGameState): number | null {
  const availableNumbers = ALL_NUMBERS.filter((n) => !state.drawnNumbers.has(n))
  return availableNumbers.length > 0 ? availableNumbers[0] : null
}

/**
 * Get all remaining numbers in the draw pool.
 */
export function getRemainingNumbers(state: SpeedBingoGameState): number[] {
  return ALL_NUMBERS.filter((n) => !state.drawnNumbers.has(n))
}

/**
 * Check if a card is a winner.
 */
export function checkCardWin(state: SpeedBingoGameState, cardId: string): boolean {
  const card = state.cards.find((c) => c.id === cardId)
  return card ? isWinner(card) : false
}

/**
 * Get winning patterns for a card.
 */
export function getCardPatterns(state: SpeedBingoGameState, cardId: string): string[] {
  const card = state.cards.find((c) => c.id === cardId)
  return card ? checkWinningPatterns(card) : []
}

/**
 * Reset the game state while keeping cards.
 */
export function resetGame(state: SpeedBingoGameState): void {
  state.drawnNumbers.clear()
  state.winners.length = 0
  state.gameActive = true
  state.currentDrawn = null
  state.isAutoDrawing = false

  // Reset all cards
  for (const card of state.cards) {
    for (const row of card.grid) {
      for (const cell of row) {
        cell.marked = cell.isFreeSpace
      }
    }
  }
}

/**
 * End the current game.
 */
export function endGame(state: SpeedBingoGameState): void {
  state.gameActive = false
  state.isAutoDrawing = false
}
