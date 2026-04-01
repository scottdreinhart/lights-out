/**
 * Mini Sudoku Constants & Configuration
 */

export const BOARD_SIZE = 4
export const BOX_SIZE = 2
export const CELL_COUNT = BOARD_SIZE * BOARD_SIZE // 16

/**
 * Cell ID helper: create cell ID from row/col
 */
export const getCellId = (row: number, col: number): string => `r${row}c${col}`

/**
 * Parse cell ID to extract row/col
 */
export const parseCellId = (id: string): { row: number; col: number } => {
  const match = id.match(/r(\d)c(\d)/)
  if (!match) throw new Error(`Invalid cell ID: ${id}`)
  return { row: parseInt(match[1], 10), col: parseInt(match[2], 10) }
}

/**
 * Calculate box index from row/col
 * Top-left=0, top-right=1, bottom-left=2, bottom-right=3
 */
export const getBoxIndex = (row: number, col: number): number => {
  const boxRow = Math.floor(row / BOX_SIZE)
  const boxCol = Math.floor(col / BOX_SIZE)
  return boxRow * BOX_SIZE + boxCol
}

/**
 * Get all cells in a specific row
 */
export const getCellsInRow = (row: number): string[] => {
  const cells: string[] = []
  for (let col = 0; col < BOARD_SIZE; col++) {
    cells.push(getCellId(row, col))
  }
  return cells
}

/**
 * Get all cells in a specific column
 */
export const getCellsInCol = (col: number): string[] => {
  const cells: string[] = []
  for (let row = 0; row < BOARD_SIZE; row++) {
    cells.push(getCellId(row, col))
  }
  return cells
}

/**
 * Get all cells in a specific box
 */
export const getCellsInBox = (boxIndex: number): string[] => {
  const cells: string[] = []
  const startRow = Math.floor(boxIndex / BOX_SIZE) * BOX_SIZE
  const startCol = (boxIndex % BOX_SIZE) * BOX_SIZE

  for (let r = startRow; r < startRow + BOX_SIZE; r++) {
    for (let c = startCol; c < startCol + BOX_SIZE; c++) {
      cells.push(getCellId(r, c))
    }
  }
  return cells
}

/**
 * Difficulty configuration: affects clue count
 */
export const DIFFICULTY_CONFIG = {
  EASY: {
    minClues: 9,
    maxClues: 10,
  },
  MEDIUM: {
    minClues: 7,
    maxClues: 8,
  },
  HARD: {
    minClues: 5,
    maxClues: 6,
  },
}

/**
 * Valid cell values
 */
export const VALID_VALUES = ['1', '2', '3', '4'] as const

/**
 * All cell IDs in grid order
 */
export const ALL_CELL_IDS = Array.from({ length: CELL_COUNT }, (_, i) => {
  const row = Math.floor(i / BOARD_SIZE)
  const col = i % BOARD_SIZE
  return getCellId(row, col)
})

/**
 * Default candidates for empty cells (all values possible initially)
 */
export const DEFAULT_CANDIDATES = new Set(VALID_VALUES)
