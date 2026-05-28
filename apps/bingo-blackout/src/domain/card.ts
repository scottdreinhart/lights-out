import { GRID_SIZE } from './constants'
import type { BingoCard, BingoCell, BingoColumn, WinningPattern } from './types'
import { COLUMNS, COLUMN_RANGES } from './types'

function createCell(number: number | null, marked = false): BingoCell {
  return {
    number,
    marked,
    isFreeSpace: number === null,
  }
}

function pickUniqueInRange(min: number, max: number, count: number): number[] {
  const available = Array.from({ length: max - min + 1 }, (_, i) => i + min)
  const selected: number[] = []

  while (selected.length < count && available.length > 0) {
    const index = Math.floor(Math.random() * available.length)
    const [value] = available.splice(index, 1)
    selected.push(value)
  }

  return selected
}

function generateCardGrid(): BingoCell[][] {
  const grid = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => createCell(null)),
  )

  COLUMNS.forEach((column: BingoColumn, columnIndex) => {
    const [min, max] = COLUMN_RANGES[column]
    const values = pickUniqueInRange(min, max, GRID_SIZE)
    values.forEach((value, rowIndex) => {
      grid[rowIndex][columnIndex] = createCell(value)
    })
  })

  const center = Math.floor(GRID_SIZE / 2)
  grid[center][center] = createCell(null, true)
  return grid
}

export function createBingoCard(): BingoCard {
  return {
    id: crypto.randomUUID(),
    grid: generateCardGrid(),
  }
}

export function createBingoCards(count: number): BingoCard[] {
  return Array.from({ length: count }, () => createBingoCard())
}

export function markNumber(card: BingoCard, number: number): void {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = card.grid[row][col]
      if (cell.number === number) {
        cell.marked = true
      }
    }
  }
}

export function checkWinningPatterns(card: BingoCard): WinningPattern[] {
  const isBlackout = card.grid.flat().every((cell) => cell.marked || cell.isFreeSpace)
  return isBlackout ? ['blackout'] : []
}

export function isWinner(card: BingoCard): boolean {
  return checkWinningPatterns(card).length > 0
}
