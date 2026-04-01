/**
 * N-Queens Rules & Validation
 * Core logic for N-Queens puzzle
 */

import type { Board, QueenPosition, MoveResult } from './types'

/**
 * Create empty board
 */
export function createEmptyBoard(size: number): Board {
  return new Array(size).fill(-1)
}

/**
 * Check if queen placement is valid
 */
export function isValidPlacement(board: Board, row: number, col: number): boolean {
  for (let i = 0; i < row; i++) {
    // Check same column
    if (board[i] === col) return false

    // Check diagonals
    if (Math.abs(board[i] - col) === Math.abs(i - row)) return false
  }
  return true
}

/**
 * Check if board is complete (all queens placed)
 */
export function isBoardComplete(board: Board): boolean {
  return board.every(pos => pos !== -1)
}

/**
 * Check if board is solved (complete and valid)
 */
export function isBoardSolved(board: Board): boolean {
  if (!isBoardComplete(board)) return false

  const size = board.length
  for (let row = 0; row < size; row++) {
    if (!isValidPlacement(board, row, board[row])) return false
  }
  return true
}

/**
 * Count conflicts on the board
 */
export function countConflicts(board: Board): number {
  let conflicts = 0
  const size = board.length

  for (let row = 0; row < size; row++) {
    const col = board[row]
    if (col === -1) continue

    for (let otherRow = row + 1; otherRow < size; otherRow++) {
      const otherCol = board[otherRow]
      if (otherCol === -1) continue

      // Same column
      if (col === otherCol) conflicts++

      // Same diagonal
      if (Math.abs(col - otherCol) === Math.abs(row - otherRow)) conflicts++
    }
  }

  return conflicts
}

/**
 * Place queen on board
 */
export function placeQueen(board: Board, row: number, col: number): MoveResult {
  if (row < 0 || row >= board.length || col < 0 || col >= board.length) {
    return { success: false, message: 'Invalid position' }
  }

  if (board[row] !== -1) {
    return { success: false, message: 'Queen already placed in this row' }
  }

  if (!isValidPlacement(board, row, col)) {
    return { success: false, message: 'Queen would be under attack' }
  }

  board[row] = col
  return { success: true, conflicts: countConflicts(board) }
}

/**
 * Remove queen from board
 */
export function removeQueen(board: Board, row: number): boolean {
  if (row < 0 || row >= board.length) return false

  board[row] = -1
  return true
}

/**
 * Get all valid moves for a row
 */
export function getValidMoves(board: Board, row: number): number[] {
  if (row < 0 || row >= board.length || board[row] !== -1) return []

  const validMoves: number[] = []
  for (let col = 0; col < board.length; col++) {
    if (isValidPlacement(board, row, col)) {
      validMoves.push(col)
    }
  }
  return validMoves
}

/**
 * Create initial game state
 */
export function createGameState(size: number = 8): Board {
  return createEmptyBoard(size)
}