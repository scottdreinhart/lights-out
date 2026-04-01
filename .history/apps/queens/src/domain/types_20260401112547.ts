/**
 * N-Queens Domain Types
 * Types for the N-Queens puzzle solver
 */

export type QueenPosition = number // Column index (0-7 for 8x8)

/**
 * Chessboard representation: array of queen positions
 * Index = row, value = column where queen is placed
 */
export type Board = QueenPosition[]

/**
 * Game state for N-Queens
 */
export interface QueensState {
  id: string
  board: Board
  size: number // N (typically 8)
  isComplete: boolean
  isSolved: boolean
  moveCount: number
  startTime: number
  hintCount: number
  mistakes: number
}

/**
 * Difficulty levels for N-Queens
 */
export enum Difficulty {
  EASY = 'EASY',     // 4x4 board
  MEDIUM = 'MEDIUM', // 6x6 board
  HARD = 'HARD',     // 8x8 board
  EXPERT = 'EXPERT'  // 10x10 board
}

/**
 * Move result
 */
export interface MoveResult {
  success: boolean
  conflicts?: number
  message?: string
}

/**
 * Solution statistics
 */
export interface SolutionStats {
  totalSolutions: number
  timeToSolve: number
  algorithm: string
}