/**
 * Bingo card generation and manipulation.
 */

import type { BingoCard, BingoCell } from './types'
import { COLUMN_RANGES, GRID_SIZE } from './types'

/**
 * Generate random numbers for a bingo column.
 * Ensures no duplicates within the card.
 */
function generateColumnNumbers(column: 'B' | 'I' | 'N' | 'G' | 'O', count: number = 5): number[] {
  const [min, max] = COLUMN_RANGES[column]
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  const shuffled = range.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

/**
 * Create a new bingo card with random numbers.
 * Center cell is always a free space.
 */
export function createBingoCard(id: string = crypto.randomUUID()): BingoCard {
  const grid: BingoCell[][] = []

  for (let row = 0; row < GRID_SIZE; row++) {
    const gridRow: BingoCell[] = []

    for (let col = 0; col < GRID_SIZE; col++) {
      const columnKey = ['B', 'I', 'N', 'G', 'O'][col] as 'B' | 'I' | 'N' | 'G' | 'O'
      const isFreeSpace = row === 2 && col === 2

      if (isFreeSpace) {
        gridRow.push({
          number: null,
          marked: true, // Free space is always marked
          isFreeSpace: true,
        })
      } else {
        let number: number | null = null
        try {
          const numbers = generateColumnNumbers(columnKey)
          number = numbers[row] || null
        } catch (e) {
          console.error(`Error generating number for ${columnKey}${row}:`, e)
        }

        gridRow.push({
          number,
          marked: false,
          isFreeSpace: false,
        })
      }
    }

    grid.push(gridRow)
  }

  return { id, grid }
}

/**
 * Create multiple bingo cards.
 */
export function createBingoCards(count: number): BingoCard[] {
  return Array.from({ length: count }, (_, i) => createBingoCard(`card-${i}`))
}

/**
 * Mark a number on a card if it exists.
 * Returns true if number was found and marked.
 */
export function markNumber(card: BingoCard, number: number): boolean {
  for (const row of card.grid) {
    for (const cell of row) {
      if (cell.number === number && !cell.marked) {
        cell.marked = true
        return true
      }
    }
  }
  return false
}

/**
 * Get all marked cells for a card.
 */
export function getMarkedCells(card: BingoCard): BingoCell[] {
  return card.grid.flat().filter((cell) => cell.marked)
}

/**
 * Check if a card has a complete row.
 */
export function hasCompleteRow(card: BingoCard): boolean {
  return card.grid.some((row) => row.every((cell) => cell.marked))
}

/**
 * Check if a card has a complete column.
 */
export function hasCompleteColumn(card: BingoCard): boolean {
  for (let col = 0; col < GRID_SIZE; col++) {
    if (card.grid.every((row) => row[col].marked)) {
      return true
    }
  }
  return false
}

/**
 * Check if a card has a complete diagonal (top-left to bottom-right).
 */
export function hasCompleteDiagonalLeft(card: BingoCard): boolean {
  for (let i = 0; i < GRID_SIZE; i++) {
    if (!card.grid[i][i].marked) {
      return false
    }
  }
  return true
}

/**
 * Check if a card has a complete diagonal (top-right to bottom-left).
 */
export function hasCompleteDiagonalRight(card: BingoCard): boolean {
  for (let i = 0; i < GRID_SIZE; i++) {
    if (!card.grid[i][GRID_SIZE - 1 - i].marked) {
      return false
    }
  }
  return true
}

/**
 * Check if a card has all four corners marked.
 */
export function hasFourCorners(card: BingoCard): boolean {
  const corners = [
    card.grid[0][0],
    card.grid[0][GRID_SIZE - 1],
    card.grid[GRID_SIZE - 1][0],
    card.grid[GRID_SIZE - 1][GRID_SIZE - 1],
  ]
  return corners.every((cell) => cell.marked)
}

/**
 * Check if a card has all cells marked (blackout/full card).
 */
export function isBlackout(card: BingoCard): boolean {
  return card.grid.every((row) => row.every((cell) => cell.marked))
}

/**
 * Check if a card is a winner (standard 5-in-a-row).
 */
export function isWinner(card: BingoCard): boolean {
  return (
    hasCompleteRow(card) ||
    hasCompleteColumn(card) ||
    hasCompleteDiagonalLeft(card) ||
    hasCompleteDiagonalRight(card)
  )
}

/**
 * Check for all possible winning patterns.
 */
export function checkWinningPatterns(card: BingoCard): string[] {
  const patterns: string[] = []

  if (hasCompleteRow(card)) {
    patterns.push('horizontal')
  }
  if (hasCompleteColumn(card)) {
    patterns.push('vertical')
  }
  if (hasCompleteDiagonalLeft(card)) {
    patterns.push('diagonal-left')
  }
  if (hasCompleteDiagonalRight(card)) {
    patterns.push('diagonal-right')
  }
  if (hasFourCorners(card)) {
    patterns.push('four-corners')
  }
  if (isBlackout(card)) {
    patterns.push('blackout')
  }

  return patterns
}
