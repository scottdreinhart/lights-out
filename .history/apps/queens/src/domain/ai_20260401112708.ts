/**
 * N-Queens AI Solver
 * Backtracking algorithm to solve N-Queens problem
 */

import type { Board, SolutionStats } from './types'
import { createEmptyBoard, isValidPlacement, isBoardSolved } from './rules'

/**
 * Solve N-Queens using backtracking
 */
export function solveNQueens(size: number): { solutions: Board[]; stats: SolutionStats } {
  const startTime = Date.now()
  const solutions: Board[] = []

  function backtrack(board: Board, row: number): void {
    if (row === size) {
      // Found a solution
      solutions.push([...board])
      return
    }

    for (let col = 0; col < size; col++) {
      if (isValidPlacement(board, row, col)) {
        board[row] = col
        backtrack(board, row + 1)
        board[row] = -1 // Backtrack
      }
    }
  }

  const board = createEmptyBoard(size)
  backtrack(board, 0)

  const endTime = Date.now()
  const stats: SolutionStats = {
    totalSolutions: solutions.length,
    timeToSolve: endTime - startTime,
    algorithm: 'backtracking'
  }

  return { solutions, stats }
}

/**
 * Find first solution using backtracking
 */
export function findFirstSolution(size: number): Board | null {
  function backtrack(board: Board, row: number): boolean {
    if (row === size) return true

    for (let col = 0; col < size; col++) {
      if (isValidPlacement(board, row, col)) {
        board[row] = col
        if (backtrack(board, row + 1)) return true
        board[row] = -1 // Backtrack
      }
    }
    return false
  }

  const board = createEmptyBoard(size)
  return backtrack(board, 0) ? board : null
}

/**
 * Check if a partial board can still lead to a solution
 */
export function isSolvable(board: Board): boolean {
  const size = board.length
  const placedQueens = board.filter(pos => pos !== -1).length

  // If board is complete, check if it's solved
  if (placedQueens === size) {
    return isBoardSolved(board)
  }

  // For partial boards, we need to check if there's a valid placement for remaining queens
  // This is a simplified check - in practice, we'd need to run backtracking
  for (let row = 0; row < size; row++) {
    if (board[row] === -1) {
      const validMoves = []
      for (let col = 0; col < size; col++) {
        if (isValidPlacement(board, row, col)) {
          validMoves.push(col)
        }
      }
      if (validMoves.length === 0) return false
    }
  }

  return true
}

/**
 * Generate a puzzle by solving and then removing some queens
 */
export function generatePuzzle(size: number, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Board {
  const solution = findFirstSolution(size)
  if (!solution) return createEmptyBoard(size)

  // Copy solution
  const puzzle = [...solution]

  // Remove queens based on difficulty
  const keepRatio = difficulty === 'easy' ? 0.7 : difficulty === 'medium' ? 0.5 : 0.3
  const queensToKeep = Math.floor(size * keepRatio)

  // Randomly remove queens
  const indices = Array.from({ length: size }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }

  // Keep only the specified number of queens
  for (let i = queensToKeep; i < size; i++) {
    puzzle[indices[i]] = -1
  }

  return puzzle
}