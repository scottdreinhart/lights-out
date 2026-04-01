/**
 * Tango Domain Rules
 * Core game logic for the Tango slide puzzle
 */

import type { Board, Position, TangoState, MoveResult, Difficulty } from './types'
import { BOARD_SIZES, PUZZLE_CONFIGS } from './constants'

export const createEmptyBoard = (size: number): Board => {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0)
  )
}

export const createSolvedBoard = (size: number): Board => {
  const board = createEmptyBoard(size)
  let number = 1

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (row === size - 1 && col === size - 1) {
        board[row][col] = 0 // Empty space
      } else {
        board[row][col] = number++
      }
    }
  }

  return board
}

export const findEmptyPosition = (board: Board): Position => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) {
        return { row, col }
      }
    }
  }
  throw new Error('No empty position found on board')
}

export const isValidMove = (board: Board, from: Position, to: Position): boolean => {
  const size = board.length

  // Check bounds
  if (from.row < 0 || from.row >= size || from.col < 0 || from.col >= size) return false
  if (to.row < 0 || to.row >= size || to.col < 0 || to.col >= size) return false

  // Must move to adjacent cell
  const rowDiff = Math.abs(from.row - to.row)
  const colDiff = Math.abs(from.col - to.col)

  // Must be exactly one step in one direction (up, down, left, right)
  if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
    return board[to.row][to.col] === 0 // Target must be empty
  }

  return false
}

export const makeMove = (board: Board, from: Position): Board => {
  const emptyPos = findEmptyPosition(board)

  if (!isValidMove(board, from, emptyPos)) {
    return board // Invalid move, return unchanged board
  }

  // Create new board with swapped positions
  const newBoard = board.map(row => [...row])
  const tileValue = newBoard[from.row][from.col]

  newBoard[from.row][from.col] = 0
  newBoard[emptyPos.row][emptyPos.col] = tileValue

  return newBoard
}

export const isBoardSolved = (board: Board): boolean => {
  const size = board.length
  let expectedNumber = 1

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (row === size - 1 && col === size - 1) {
        // Last position should be empty
        if (board[row][col] !== 0) return false
      } else {
        // Other positions should have sequential numbers
        if (board[row][col] !== expectedNumber) return false
        expectedNumber++
      }
    }
  }

  return true
}

export const getValidMoves = (board: Board): Position[] => {
  const emptyPos = findEmptyPosition(board)
  const size = board.length
  const moves: Position[] = []

  // Check all adjacent positions
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 },  // right
  ]

  for (const dir of directions) {
    const newRow = emptyPos.row + dir.row
    const newCol = emptyPos.col + dir.col

    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
      moves.push({ row: newRow, col: newCol })
    }
  }

  return moves
}

export const shuffleBoard = (board: Board, moves: number): Board => {
  let currentBoard = board.map(row => [...row])
  let emptyPos = findEmptyPosition(currentBoard)

  for (let i = 0; i < moves; i++) {
    const validMoves = getValidMoves(currentBoard)

    if (validMoves.length === 0) break

    // Choose random valid move
    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
    currentBoard = makeMove(currentBoard, randomMove)
    emptyPos = findEmptyPosition(currentBoard)
  }

  return currentBoard
}

export const createTangoGameState = (difficulty: Difficulty): TangoState => {
  const config = PUZZLE_CONFIGS[difficulty]
  const solvedBoard = createSolvedBoard(config.size)
  const shuffledBoard = shuffleBoard(solvedBoard, config.shuffleMoves)

  return {
    board: shuffledBoard,
    emptyPosition: findEmptyPosition(shuffledBoard),
    size: config.size,
    isSolved: false,
    moveCount: 0,
    startTime: Date.now(),
    difficulty,
  }
}

export const updateGameState = (
  state: TangoState,
  newBoard: Board,
  moveCount: number
): TangoState => {
  const isSolved = isBoardSolved(newBoard)

  return {
    ...state,
    board: newBoard,
    emptyPosition: findEmptyPosition(newBoard),
    isSolved,
    moveCount,
    endTime: isSolved ? Date.now() : undefined,
  }
}