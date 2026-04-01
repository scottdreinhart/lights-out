/**
 * Tango Domain Types
 * Type definitions for the Tango slide puzzle game
 */

export type Board = number[][]
export type Position = { row: number; col: number }
export type Move = { from: Position; to: Position }
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export interface TangoState {
  board: Board
  emptyPosition: Position
  size: number
  isSolved: boolean
  moveCount: number
  startTime: number
  endTime?: number
  difficulty: Difficulty
}

export interface MoveResult {
  success: boolean
  newState: TangoState
  isSolved: boolean
}

export interface PuzzleConfig {
  size: number
  difficulty: Difficulty
  shuffleMoves: number
}

export interface SolutionStats {
  solvable: boolean
  minimumMoves: number
  parity: 'even' | 'odd'
}