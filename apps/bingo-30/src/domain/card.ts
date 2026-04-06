/**
 * Mini Bingo card generation and validation.
 * Generates 3x3 cards with numbers 1-25.
 */

import type { BingoCard } from './types'

const GRID_SIZE = 3
const MAX_NUMBER = 25
const ALL_NUMBERS = Array.from({ length: MAX_NUMBER }, (_, i) => i + 1)

/**
 * Generate a single mini bingo card (3x3 grid with numbers 1-25)
 */
function generateCard(cardId: number): BingoCard {
  const numbers: number[][] = []
  const usedNumbers = new Set<number>()

  for (let row = 0; row < GRID_SIZE; row++) {
    const rowNumbers: number[] = []
    while (rowNumbers.length < GRID_SIZE) {
      const num = ALL_NUMBERS[Math.floor(Math.random() * ALL_NUMBERS.length)]
      if (!usedNumbers.has(num)) {
        rowNumbers.push(num)
        usedNumbers.add(num)
      }
    }
    numbers.push(rowNumbers)
  }

  return { id: cardId, numbers }
}

/**
 * Generate multiple mini bingo cards
 */
export function createBingoCards(count: number): BingoCard[] {
  return Array.from({ length: count }, (_, i) => generateCard(i))
}

/**
 * Mark a number on a card if present
 */
export function markNumber(card: BingoCard, number: number): boolean {
  for (const row of card.numbers) {
    const index = row.indexOf(number)
    if (index !== -1) {
      // Mark as marked by counting marked cells (or use a separate marked grid)
      return true
    }
  }
  return false
}

/**
 * Check if a card has won (any row, column, or diagonal)
 */
export function checkWinningPatterns(card: BingoCard, drawnNumbers: Set<number>): boolean {
  // Check rows
  for (let row = 0; row < GRID_SIZE; row++) {
    if (card.numbers[row].every((num) => drawnNumbers.has(num))) {
      return true
    }
  }

  // Check columns
  for (let col = 0; col < GRID_SIZE; col++) {
    if (card.numbers.every((row) => drawnNumbers.has(row[col]))) {
      return true
    }
  }

  // Check diagonals
  // Top-left to bottom-right
  if (card.numbers.every((row, i) => drawnNumbers.has(row[i]))) {
    return true
  }

  // Top-right to bottom-left
  if (card.numbers.every((row, i) => drawnNumbers.has(row[GRID_SIZE - 1 - i]))) {
    return true
  }

  return false
}

/**
 * Check if a player is a winner
 */
export function isWinner(card: BingoCard, drawnNumbers: Set<number>): boolean {
  return checkWinningPatterns(card, drawnNumbers)
}
