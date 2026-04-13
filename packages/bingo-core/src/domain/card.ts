/**
 * Card generation and manipulation
 * Pure functions for creating and managing bingo cards
 */

import type { Card, Cell, CardPattern } from './types'

/**
 * Generate a random number array for a bingo card column
 * Bingo uses specific ranges per column to ensure variety
 */
export const generateColumnNumbers = (
  min: number,
  max: number,
  columnSize: number,
  excludeNumbers: Set<number> = new Set(),
): number[] => {
  const numbers: number[] = []
  const available = Array.from({ length: max - min + 1 }, (_, i) => min + i).filter(
    (n) => !excludeNumbers.has(n),
  )

  while (numbers.length < columnSize && available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length)
    numbers.push(available[randomIndex])
    available.splice(randomIndex, 1)
  }

  return numbers.sort((a, b) => a - b)
}

/**
 * Create a new bingo card with random numbers
 */
export const createCard = (
  cardId: string,
  playerId: string,
  dimensions: { rows: number; cols: number } = { rows: 5, cols: 5 },
  columnBounds: [number, number][] = [
    [1, 15],
    [16, 30],
    [31, 45],
    [46, 60],
    [61, 75],
  ],
  freeCenterSpace = true,
): Card => {
  const grid: Cell[][] = []
  const markedAt: Record<string, number> = {}
  const usedNumbers = new Set<number>()

  // Generate grid with random numbers
  for (let row = 0; row < dimensions.rows; row++) {
    const rowCells: Cell[] = []
    for (let col = 0; col < dimensions.cols; col++) {
      // Free center space in classic 5×5 bingo
      if (freeCenterSpace && row === 2 && col === 2 && dimensions.rows === 5) {
        rowCells.push({ number: 0, marked: true, markedAt: 0 })
        markedAt[`${row},${col}`] = 0
      } else {
        const [min, max] = columnBounds[col]
        const columnNumbers = generateColumnNumbers(min, max, 5, usedNumbers)
        const number = columnNumbers[0]
        usedNumbers.add(number)
        rowCells.push({ number, marked: false })
      }
    }
    grid.push(rowCells)
  }

  return {
    id: cardId,
    playerId,
    grid,
    dimensions,
    columnBounds,
    pattern: 'line-horizontal',
    markedAt,
  }
}

/**
 * Mark a number on the card if it exists
 */
export const markNumber = (card: Card, number: number, timestamp: number): Card => {
  const updated = { ...card }
  let found = false

  for (let row = 0; row < updated.grid.length; row++) {
    for (let col = 0; col < updated.grid[row].length; col++) {
      if (updated.grid[row][col].number === number) {
        updated.grid[row][col].marked = true
        updated.grid[row][col].markedAt = timestamp
        updated.markedAt[`${row},${col}`] = timestamp
        found = true
        break
      }
    }
    if (found) break
  }

  return updated
}

/**
 * Unmark a number on the card
 */
export const unmarkNumber = (card: Card, number: number): Card => {
  const updated = { ...card }

  for (let row = 0; row < updated.grid.length; row++) {
    for (let col = 0; col < updated.grid[row].length; col++) {
      if (updated.grid[row][col].number === number) {
        updated.grid[row][col].marked = false
        updated.grid[row][col].markedAt = undefined
        delete updated.markedAt[`${row},${col}`]
        return updated
      }
    }
  }

  return updated
}

/**
 * Get all marked cells
 */
export const getMarkedCells = (card: Card): Array<{ row: number; col: number }> => {
  const marked: Array<{ row: number; col: number }> = []

  for (let row = 0; row < card.grid.length; row++) {
    for (let col = 0; col < card.grid[row].length; col++) {
      if (card.grid[row][col].marked) {
        marked.push({ row, col })
      }
    }
  }

  return marked
}

/**
 * Reset card (unmark all cells except free center space)
 */
export const resetCard = (card: Card, keepFreeSpace = true): Card => {
  const updated = { ...card }

  for (let row = 0; row < updated.grid.length; row++) {
    for (let col = 0; col < updated.grid[row].length; col++) {
      const cell = updated.grid[row][col]
      if (keepFreeSpace && cell.number === 0) {
        // Keep free space marked
        continue
      }
      cell.marked = false
      cell.markedAt = undefined
      delete updated.markedAt[`${row},${col}`]
    }
  }

  return updated
}

/**
 * Check if a card has won with specific pattern
 */
export const checkWin = (card: Card, pattern: CardPattern = 'line-horizontal'): boolean => {
  switch (pattern) {
    case 'line-horizontal':
      return checkHorizontalLine(card)
    case 'line-vertical':
      return checkVerticalLine(card)
    case 'line-diagonal':
      return checkDiagonalLine(card)
    case 'corners':
      return checkCorners(card)
    case 'frame':
      return checkFrame(card)
    case 'full-house':
      return checkFullHouse(card)
    default:
      return false
  }
}

const checkHorizontalLine = (card: Card): boolean => {
  for (let row = 0; row < card.grid.length; row++) {
    if (card.grid[row].every((cell) => cell.marked)) {
      return true
    }
  }
  return false
}

const checkVerticalLine = (card: Card): boolean => {
  for (let col = 0; col < card.grid[0].length; col++) {
    if (card.grid.every((row) => row[col].marked)) {
      return true
    }
  }
  return false
}

const checkDiagonalLine = (card: Card): boolean => {
  // Top-left to bottom-right
  const diagonal1 = Array.from({ length: card.grid.length }, (_, i) => card.grid[i][i]).every(
    (cell) => cell.marked,
  )
  // Top-right to bottom-left
  const diagonal2 = Array.from({ length: card.grid.length }, (_, i) =>
    card.grid[i][card.grid[0].length - 1 - i],
  ).every((cell) => cell.marked)

  return diagonal1 || diagonal2
}

const checkCorners = (card: Card): boolean => {
  const { length: rows } = card.grid
  const cols = card.grid[0].length
  return (
    card.grid[0][0].marked &&
    card.grid[0][cols - 1].marked &&
    card.grid[rows - 1][0].marked &&
    card.grid[rows - 1][cols - 1].marked
  )
}

const checkFrame = (card: Card): boolean => {
  const { length: rows } = card.grid
  const cols = card.grid[0].length

  // Check top and bottom rows
  const topRow = card.grid[0].every((cell) => cell.marked)
  const bottomRow = card.grid[rows - 1].every((cell) => cell.marked)

  // Check left and right columns
  const leftCol = card.grid.every((row) => row[0].marked)
  const rightCol = card.grid.every((row) => row[cols - 1].marked)

  return topRow && bottomRow && leftCol && rightCol
}

const checkFullHouse = (card: Card): boolean => {
  return card.grid.every((row) => row.every((cell) => cell.marked))
}
