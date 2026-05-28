import { GRID_SIZE } from './constants'
import type { BingoCard, BingoCell, BingoColumn, WinningPattern } from './types'
import { COLUMNS, COLUMN_RANGES } from './types'

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

function createRowCell(number: number | null, marked = false): BingoCell {
  return {
    number,
    marked,
    isFreeSpace: number === null,
  }
}

function generateCardGrid(): BingoCell[][] {
  const grid = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => createRowCell(null)),
  )

  COLUMNS.forEach((column: BingoColumn, columnIndex) => {
    const [min, max] = COLUMN_RANGES[column]
    const numbers = pickUniqueInRange(min, max, GRID_SIZE)
    numbers.forEach((value, rowIndex) => {
      grid[rowIndex][columnIndex] = createRowCell(value)
    })
  })

  const center = Math.floor(GRID_SIZE / 2)
  grid[center][center] = createRowCell(null, true)

  return grid
}

function isLineMarked(cells: BingoCell[]): boolean {
  return cells.every((cell) => cell.marked || cell.isFreeSpace)
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
  const patterns: WinningPattern[] = []

  for (let row = 0; row < GRID_SIZE; row++) {
    if (isLineMarked(card.grid[row])) {
      if (row === 0) {
        patterns.push('horizontal-top')
      }
      if (row === 2) {
        patterns.push('horizontal-middle')
      }
      if (row === GRID_SIZE - 1) {
        patterns.push('horizontal-bottom')
      }
    }
  }

  for (let col = 0; col < GRID_SIZE; col++) {
    const column = card.grid.map((row) => row[col])
    if (isLineMarked(column)) {
      if (col === 0) {
        patterns.push('vertical-left')
      }
      if (col === 2) {
        patterns.push('vertical-center')
      }
      if (col === GRID_SIZE - 1) {
        patterns.push('vertical-right')
      }
    }
  }

  const mainDiagonal = card.grid.map((row, index) => row[index])
  if (isLineMarked(mainDiagonal)) {
    patterns.push('diagonal-main')
  }

  const antiDiagonal = card.grid.map((row, index) => row[GRID_SIZE - 1 - index])
  if (isLineMarked(antiDiagonal)) {
    patterns.push('diagonal-anti')
  }

  const isFullHouse = card.grid.flat().every((cell) => cell.marked || cell.isFreeSpace)
  if (isFullHouse) {
    patterns.push('full-house')
  }

  return patterns
}

export function isWinner(card: BingoCard): boolean {
  return checkWinningPatterns(card).length > 0
}
