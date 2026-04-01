/**
 * Generic Sudoku Board Generator
 *
 * Creates valid sudoku boards of any size following standard sudoku rules:
 * - Each row contains unique digits
 * - Each column contains unique digits
 * - Each box (sub-region) contains unique digits
 *
 * Supports various board sizes: 4x4, 6x6, 9x9, 12x12, 16x16, etc.
 * Box size must be a divisor of board size (e.g., 9x9 with 3x3 boxes)
 */

import type { Cell, Digit } from './types'

export interface SudokuConfig {
  /** Size of the board (e.g., 4, 6, 9, 16) */
  boardSize: number
  /** Size of each box/sub-region (e.g., 2, 3, 4) */
  boxSize: number
  /** Empty cell value */
  emptyCell: 0
}

export interface SudokuBoard {
  grid: Cell[][]
  config: SudokuConfig
}

export interface SudokuPuzzle extends SudokuBoard {
  /** The complete solution */
  solution: SudokuBoard
  /** Number of clues (filled cells) */
  cluesCount: number
  /** Difficulty level */
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
}

/**
 * Create an empty sudoku board with the given configuration
 */
export const createEmptyBoard = (config: SudokuConfig): SudokuBoard => ({
  grid: Array.from({ length: config.boardSize }, () =>
    Array.from({ length: config.boardSize }, () => config.emptyCell as Cell),
  ),
  config,
})

/**
 * Check if a digit can be placed at the given position
 */
export const isValidPlacement = (
  grid: Cell[][],
  row: number,
  col: number,
  digit: Digit,
  config: SudokuConfig,
): boolean => {
  const { boardSize, boxSize } = config

  // Check row
  for (let c = 0; c < boardSize; c++) {
    if (grid[row][c] === digit) {
      return false
    }
  }

  // Check column
  for (let r = 0; r < boardSize; r++) {
    if (grid[r][col] === digit) {
      return false
    }
  }

  // Check box
  const boxRow = Math.floor(row / boxSize) * boxSize
  const boxCol = Math.floor(col / boxSize) * boxSize

  for (let r = boxRow; r < boxRow + boxSize; r++) {
    for (let c = boxCol; c < boxCol + boxSize; c++) {
      if (grid[r][c] === digit) {
        return false
      }
    }
  }

  return true
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Fill a sudoku board using backtracking algorithm
 */
const fillBoard = (grid: Cell[][], config: SudokuConfig): boolean => {
  const { boardSize, emptyCell } = config

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (grid[row][col] === emptyCell) {
        // Create shuffled digits 1 to boardSize
        const digits = shuffleArray(Array.from({ length: boardSize }, (_, i) => (i + 1) as Digit))

        for (const digit of digits) {
          if (isValidPlacement(grid, row, col, digit, config)) {
            grid[row][col] = digit

            if (fillBoard(grid, config)) {
              return true
            }

            grid[row][col] = emptyCell
          }
        }

        return false
      }
    }
  }

  return true
}

/**
 * Create a deep copy of a sudoku board
 */
export const copyBoard = (board: SudokuBoard): SudokuBoard => ({
  grid: board.grid.map((row) => [...row]),
  config: { ...board.config },
})

/**
 * Remove clues from a filled board to create a puzzle
 */
const removeClues = (grid: Cell[][], cluesCount: number, config: SudokuConfig): void => {
  const { boardSize, emptyCell } = config
  const totalCells = boardSize * boardSize
  let removed = 0

  while (removed < totalCells - cluesCount) {
    const row = Math.floor(Math.random() * boardSize)
    const col = Math.floor(Math.random() * boardSize)

    if (grid[row][col] !== emptyCell) {
      grid[row][col] = emptyCell
      removed++
    }
  }
}

/**
 * Generate a complete solved sudoku board
 */
export const generateSolvedBoard = (config: SudokuConfig): SudokuBoard => {
  const board = createEmptyBoard(config)

  // Validate configuration
  if (config.boardSize % config.boxSize !== 0) {
    throw new Error(
      `Invalid sudoku configuration: board size ${config.boardSize} must be divisible by box size ${config.boxSize}`,
    )
  }

  if (!fillBoard(board.grid, config)) {
    throw new Error('Failed to generate a valid sudoku board')
  }

  return board
}

/**
 * Generate a sudoku puzzle with the specified difficulty
 */
export const generateSudokuPuzzle = (
  config: SudokuConfig,
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' = 'medium',
): SudokuPuzzle => {
  // Generate the complete solution
  const solution = generateSolvedBoard(config)

  // Create a copy for the puzzle
  const puzzle = copyBoard(solution)

  // Calculate clues count based on difficulty
  const totalCells = config.boardSize * config.boardSize
  const cluesCounts = {
    easy: Math.floor(totalCells * 0.6), // 60% clues
    medium: Math.floor(totalCells * 0.5), // 50% clues
    hard: Math.floor(totalCells * 0.4), // 40% clues
    expert: Math.floor(totalCells * 0.3), // 30% clues
  }

  const cluesCount = cluesCounts[difficulty]

  // Remove clues to create the puzzle
  removeClues(puzzle.grid, cluesCount, config)

  return {
    ...puzzle,
    solution,
    cluesCount,
    difficulty,
  }
}

/**
 * Validate that a board follows sudoku rules
 */
export const validateBoard = (board: SudokuBoard): boolean => {
  const { grid, config } = board
  const { boardSize, boxSize, emptyCell } = config

  // Check rows and columns
  for (let i = 0; i < boardSize; i++) {
    const rowDigits = new Set<Digit>()
    const colDigits = new Set<Digit>()

    for (let j = 0; j < boardSize; j++) {
      const rowCell = grid[i][j]
      const colCell = grid[j][i]

      // Skip empty cells in validation
      if (rowCell !== emptyCell) {
        if (rowDigits.has(rowCell as Digit)) {
          return false
        }
        rowDigits.add(rowCell as Digit)
      }

      if (colCell !== emptyCell) {
        if (colDigits.has(colCell as Digit)) {
          return false
        }
        colDigits.add(colCell as Digit)
      }
    }
  }

  // Check boxes
  for (let boxRow = 0; boxRow < boardSize; boxRow += boxSize) {
    for (let boxCol = 0; boxCol < boardSize; boxCol += boxSize) {
      const boxDigits = new Set<Digit>()

      for (let r = boxRow; r < boxRow + boxSize; r++) {
        for (let c = boxCol; c < boxCol + boxSize; c++) {
          const cell = grid[r][c]
          if (cell !== emptyCell) {
            if (boxDigits.has(cell as Digit)) {
              return false
            }
            boxDigits.add(cell as Digit)
          }
        }
      }
    }
  }

  return true
}

/**
 * Check if a sudoku board is completely filled and valid
 */
export const isBoardComplete = (board: SudokuBoard): boolean => {
  const { grid, config } = board
  const { boardSize, emptyCell } = config

  // Check that no cells are empty
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (grid[row][col] === emptyCell) {
        return false
      }
    }
  }

  // Validate the completed board
  return validateBoard(board)
}
