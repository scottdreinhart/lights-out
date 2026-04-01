import { BOARD_SIZE, BOX_SIZE, DIFFICULTY_CLUES, EMPTY_CELL } from './constants'
import type { Board, Cell, Difficulty, Digit, GameState } from './types'

export const createEmptyBoard = (): Board => ({
  grid: Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(EMPTY_CELL)),
})

export const createBoard = (difficulty: Difficulty): Board => {
  const board = createEmptyBoard()
  fillBoard(board.grid)
  removeClues(board.grid, DIFFICULTY_CLUES[difficulty])
  return board
}

const isValidPlacement = (grid: Cell[][], row: number, col: number, num: Digit): boolean => {
  if (grid[row].includes(num)) {
    return false
  }

  for (let i = 0; i < BOARD_SIZE; i++) {
    if (grid[i][col] === num) {
      return false
    }
  }

  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE
  for (let i = boxRow; i < boxRow + BOX_SIZE; i++) {
    for (let j = boxCol; j < boxCol + BOX_SIZE; j++) {
      if (grid[i][j] === num) {
        return false
      }
    }
  }

  return true
}

const fillBoard = (grid: Cell[][]): boolean => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (grid[row][col] === EMPTY_CELL) {
        const digits = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9] as Digit[])
        for (const num of digits) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num
            if (fillBoard(grid)) {
              return true
            }
            grid[row][col] = EMPTY_CELL
          }
        }
        return false
      }
    }
  }
  return true
}

const removeClues = (grid: Cell[][], cluesCount: number): void => {
  let removed = 0
  while (removed < BOARD_SIZE * BOARD_SIZE - cluesCount) {
    const row = Math.floor(Math.random() * BOARD_SIZE)
    const col = Math.floor(Math.random() * BOARD_SIZE)
    if (grid[row][col] !== EMPTY_CELL) {
      grid[row][col] = EMPTY_CELL
      removed++
    }
  }
}

export const createGameState = (difficulty: Difficulty): GameState => {
  const solution = createBoardCopy(createBoard(difficulty))
  const board = createBoardCopy(solution)

  return {
    board,
    solution,
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
    if (isValidPlacement(grid, row, col, num as Digit)) {
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
