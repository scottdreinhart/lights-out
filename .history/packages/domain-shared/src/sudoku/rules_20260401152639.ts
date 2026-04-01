import { BOARD_SIZE, BOX_SIZE, EMPTY_CELL } from './constants'
import { generateSudokuPuzzle, type SudokuConfig } from './generator'
import type { Board, Cell, Difficulty, Digit, GameState } from './types'

// Legacy 9x9 sudoku configuration for backward compatibility
const SUDOKU_9x9_CONFIG: SudokuConfig = {
  boardSize: BOARD_SIZE,
  boxSize: BOX_SIZE,
  emptyCell: EMPTY_CELL,
}

// Legacy functions for backward compatibility
export const createEmptyBoard9x9 = (): Board => ({
  grid: new Array(BOARD_SIZE).fill(null).map(() => new Array(BOARD_SIZE).fill(EMPTY_CELL)),
})

export const createBoard = (difficulty: Difficulty): Board => {
  const puzzle = generateSudokuPuzzle(SUDOKU_9x9_CONFIG, difficulty)
  return puzzle
}

export const createGameState = (difficulty: Difficulty): GameState => {
  const puzzle = generateSudokuPuzzle(SUDOKU_9x9_CONFIG, difficulty)

  return {
    board: puzzle,
    solution: puzzle.solution,
    difficulty,
    startedAt: Date.now(),
    moves: [],
  }
}

export const makeMove = (state: GameState, row: number, col: number, value: Cell): GameState => {
  return {
    ...state,
    board: {
      grid: state.board.grid.map((r, i) =>
        i === row ? r.map((c, j) => (j === col ? value : c)) : r,
      ),
    },
    moves: [
      ...state.moves,
      {
        row,
        col,
        value,
        timestamp: Date.now(),
      },
    ],
  }
}

export const isValidMove = (state: GameState, row: number, col: number, value: Cell): boolean => {
  const grid = state.board.grid
  const currentValue = grid[row][col]

  if (currentValue !== EMPTY_CELL) {
    return false // Cell is already filled
  }

  return state.solution.grid[row][col] === value
}

export const isGameComplete = (state: GameState): boolean => {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (state.board.grid[i][j] !== state.solution.grid[i][j]) {
        return false
      }
    }
  }
  return true
}

export const getValidMoves = (state: GameState, row: number, col: number): Digit[] => {
  if (state.solution.grid[row][col] !== EMPTY_CELL) {
    return []
  }

  const grid = state.board.grid
  const validMoves: Digit[] = []

  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, row, col, num as Digit, SUDOKU_9x9_CONFIG)) {
      validMoves.push(num as Digit)
    }
  }

  return validMoves
}

const createBoardCopy = (board: Board): Board => ({
  grid: board.grid.map((row) => [...row]),
})

const shuffleArray = <T>(arr: T[]): T[] => {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const calculateGameTime = (startedAt: number): number => {
  return Math.floor((Date.now() - startedAt) / 1000)
}

// Import the generic validation function
import { isValidPlacement } from './generator'
