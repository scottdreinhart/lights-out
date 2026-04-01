/**
 * Mini Sudoku CSP Templates
 * Creates CSP (Constraint Satisfaction Problem) objects for solver & generator
 */

import type { Board, Cell, Difficulty } from './types'
import { BOARD_SIZE, DEFAULT_CANDIDATES, ALL_CELL_IDS } from './constants'
import { createAllConstraints } from './constraints'
import { generateSudokuPuzzle, type SudokuConfig } from '@games/domain-shared'

// Mini Sudoku 4x4 configuration
const MINI_SUDOKU_CONFIG: SudokuConfig = {
  boardSize: 4,
  boxSize: 2,
  emptyCell: 0,
}

/**
 * Create empty board (all cells blank, no candidates)
 */
export function createEmptyBoard(): Board {
  const board = new Map<string, Cell>()

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cellId = `r${row}c${col}`
      const box = Math.floor(row / 2) * 2 + Math.floor(col / 2)

      board.set(cellId, {
        id: cellId,
        row,
        col,
        box,
        value: '',
        candidates: new Set(DEFAULT_CANDIDATES),
        isGiven: false,
      })
    }
  }

  return board
}

/**
 * Convert generic sudoku board to mini-sudoku board format
 */
function convertToMiniSudokuBoard(genericBoard: number[][], difficulty: Difficulty): Board {
  const board = createEmptyBoard()
  const totalCells = BOARD_SIZE * BOARD_SIZE
  const cluesCounts = {
    [Difficulty.EASY]: Math.floor(totalCells * 0.6),   // 9-10 clues
    [Difficulty.MEDIUM]: Math.floor(totalCells * 0.5), // 7-8 clues
    [Difficulty.HARD]: Math.floor(totalCells * 0.4),   // 5-6 clues
  }

  let clueCount = 0
  const maxClues = cluesCounts[difficulty]

  // Fill cells from the generic board
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cellId = `r${row}c${col}`
      const value = genericBoard[row][col]

      if (value !== 0 && clueCount < maxClues) {
        const cell = board.get(cellId)!
        cell.value = value.toString() as CellValue
        cell.isGiven = true
        cell.candidates.clear()
        clueCount++
      }
    }
  }

  return board
}

/**
 * Create a puzzle board at the specified difficulty
 */
export function createPuzzleAtDifficulty(difficulty: Difficulty): Board {
  const puzzle = generateSudokuPuzzle(MINI_SUDOKU_CONFIG, difficulty === Difficulty.EASY ? 'easy' :
    difficulty === Difficulty.MEDIUM ? 'medium' : 'hard')

  return convertToMiniSudokuBoard(puzzle.grid, difficulty)
}

/**
 * Create a full valid solution board
 * Returns a generated valid 4×4 sudoku
 */
export function createSolvedBoard(): Board {
  const solution = generateSudokuPuzzle(MINI_SUDOKU_CONFIG, 'easy').solution

  const board = createEmptyBoard()

  // Fill all cells from the solution
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cellId = `r${row}c${col}`
      const value = solution.grid[row][col]

      const cell = board.get(cellId)!
      cell.value = value.toString() as CellValue
      cell.candidates.clear()
    }
  }

  return board
}

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cellId = `r${row}c${col}`
      const cell = board.get(cellId)
      if (!cell) {continue}
      cell.value = solution[row][col] as any
      cell.candidates.clear()
    }
  }

  return board
}

/**
 * Create puzzle from solved board by removing clues
 */
export function createPuzzleFromSolution(board: Board, clueCount: number): Board {
  const puzzle = new Map(board) // Deep copy behavior for Map

  // Create actual deep copy of cells
  const deepCopiedPuzzle = new Map<string, Cell>()
  for (const [cellId, cell] of puzzle) {
    deepCopiedPuzzle.set(cellId, { ...cell, candidates: new Set(cell.candidates) })
  }

  // Randomly select cells to keep as clues
  const cellsToRemove: string[] = []
  const allCells = Array.from(ALL_CELL_IDS)

  while (cellsToRemove.length < BOARD_SIZE * BOARD_SIZE - clueCount) {
    const randomIndex = Math.floor(Math.random() * allCells.length)
    const cellId = allCells[randomIndex]

    if (!cellsToRemove.includes(cellId)) {
      cellsToRemove.push(cellId)
    }
  }

  // Remove selected cells and mark remaining as given
  for (const cellId of cellsToRemove) {
    const cell = deepCopiedPuzzle.get(cellId)
    if (!cell) {continue}
    cell.value = ''
    cell.candidates = new Set(DEFAULT_CANDIDATES)
    cell.isGiven = false
  }

  // Mark remaining cells as given
  for (const cellId of allCells) {
    if (!cellsToRemove.includes(cellId)) {
      const cell = deepCopiedPuzzle.get(cellId)
      if (!cell) {continue}
      cell.isGiven = true
      cell.candidates.clear()
    }
  }

  return deepCopiedPuzzle
}

/**
 * Calculate clue count based on difficulty level
 */
function getClueCountForDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'EASY':
      return 9 + Math.floor(Math.random() * 2) // 9-10 clues
    case 'MEDIUM':
      return 7 + Math.floor(Math.random() * 2) // 7-8 clues
    case 'HARD':
    default:
      return 5 + Math.floor(Math.random() * 2) // 5-6 clues
  }
}

/**
 * Create puzzle at specific difficulty level
 */
export function createPuzzleAtDifficulty(difficulty: Difficulty): Board {
  const solved = createSolvedBoard()
  const clueCount = getClueCountForDifficulty(difficulty)
  return createPuzzleFromSolution(solved, clueCount)
}

/**
 * Create CSP representation: board with all constraints defined
 * Used by solver to work with puzzle
 */
export interface MiniSudokuCSP {
  board: Board
  constraints: ReturnType<typeof createAllConstraints>
  variables: string[] // Cell IDs
  domain: Map<string, Set<string>> // cellId -> possible values
}

/**
 * Create CSP from puzzle board
 */
export function createCSP(puzzle: Board): MiniSudokuCSP {
  const domain = new Map<string, Set<string>>()

  // Initialize domain for each cell
  for (const cellId of ALL_CELL_IDS) {
    const cell = puzzle.get(cellId)
    if (!cell) {continue}
    if (cell.value) {
      domain.set(cellId, new Set([cell.value]))
    } else {
      domain.set(cellId, new Set(DEFAULT_CANDIDATES))
    }
  }

  return {
    board: puzzle,
    constraints: createAllConstraints(),
    variables: [...ALL_CELL_IDS],
    domain,
  }
}

/**
 * Clone a puzzle board (deep copy)
 */
export function clonePuzzle(board: Board): Board {
  const cloned = new Map<string, Cell>()
  for (const [cellId, cell] of board) {
    cloned.set(cellId, {
      ...cell,
      candidates: new Set(cell.candidates),
    })
  }
  return cloned
}

/**
 * Count clues (given/locked cells)
 */
export function countClues(board: Board): number {
  let count = 0
  for (const cell of board.values()) {
    if (cell.isGiven) {count++}
  }
  return count
}

/**
 * Count filled cells
 */
export function countFilled(board: Board): number {
  let count = 0
  for (const cell of board.values()) {
    if (cell.value) {count++}
  }
  return count
}
