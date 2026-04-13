import type { GameState } from './types'
import {
  generateCard,
  markNumber,
  hasWon,
  getWinningPatterns,
} from './card'
import { ALL_NUMBERS } from './constants'

/**
 * Create initial game state
 */
export const createGameState = (): GameState => ({
  card: generateCard(),
  drawnNumbers: new Set(),
  currentNumber: null,
  winners: [],
  gameActive: true,
})

/**
 * Draw a number (from available pool)
 */
export const drawNumber = (state: GameState): GameState => {
  if (!state.gameActive) return state

  const available = ALL_NUMBERS.filter(
    (n) => !state.drawnNumbers.has(n),
  )

  if (available.length === 0) {
    return { ...state, gameActive: false }
  }

  const number = available[Math.floor(Math.random() * available.length)]
  const newDrawn = new Set(state.drawnNumbers)
  newDrawn.add(number)

  // Mark the number on the card
  const newCard = markNumber(state.card, number)

  // Check for winners
  const winners = getWinningPatterns(newCard)

  return {
    ...state,
    card: newCard,
    drawnNumbers: newDrawn,
    currentNumber: number,
    winners: winners as string[],
    gameActive: !hasWon(newCard),
  }
}

/**
 * Get valid moves based on current card
 */
export const getHintPositions = (state: GameState): Array<[number, number]> => {
  const hints: Array<[number, number]> = []
  state.card.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      if (!cell.marked && state.drawnNumbers.has(cell.number)) {
        hints.push([rowIdx, colIdx])
      }
    })
  })
  return hints
}

/**
 * Reset the game
 */
export const resetGame = (): GameState => createGameState()

/**
 * Start a new game
 */
export const newGame = (): GameState => createGameState()
