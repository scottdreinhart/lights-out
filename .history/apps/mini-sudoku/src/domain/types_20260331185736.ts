/**
 * Mini Sudoku (4×4) Type Definitions
 * Domain-only types; no React, no framework dependencies
 */

/**
 * Cell value: 1-4 for filled cells, empty string for blanks
 */
export type CellValue = '1' | '2' | '3' | '4' | ''

/**
 * Cell state: value + candidates + conflicts
 */
export interface Cell {
  id: string // "r0c0", "r0c1", etc.
  row: number // 0-3
  col: number // 0-3
  box: number // 0-3 (top-left=0, top-right=1, bottom-left=2, bottom-right=3)
  value: CellValue
  candidates: Set<'1' | '2' | '3' | '4'> // Possible values
  isGiven: boolean // Clue/given (locked)
}

/**
 * 4×4 board representation: 16 cells
 */
export type Board = Map<string, Cell>

/**
 * Difficulty level: affects number of clues and constraint patterns
 */
export enum Difficulty {
  EASY = 'EASY', // 9-10 clues
  MEDIUM = 'MEDIUM', // 7-8 clues
  HARD = 'HARD', // 5-6 clues
}

/**
 * Game state: board + metadata
 */
export interface MiniSudokuState {
  id: string // Puzzle instance ID
  board: Board
  difficulty: Difficulty
  isComplete: boolean
  isSolved: boolean // By user
  moveCount: number // Number of non-clue value assignments
  startTime: number // Timestamp when puzzle started
  hintCount: number // Hints used
  mistakes: number // Invalid moves attempted
}

/**
 * Hint data for UI display
 */
export interface Hint {
  type: 'candidates' | 'naked_single' | 'hidden_single' | 'eliminate'
  cellId: string
  value?: CellValue
  candidates?: Set<CellValue>
  reason: string
}

/**
 * Difficulty estimation metrics
 */
export interface DifficultyMetrics {
  estimatedLevel: Difficulty
  clueCount: number
  constraintDensity: number // 0-1, how constrained the puzzle is
  averageCandidates: number
}

/**
 * Move/action type
 */
export interface Move {
  type: 'assign' | 'clear' | 'candidate_toggle'
  cellId: string
  value?: CellValue
}

/**
 * Cell conflict info for UI feedback
 */
export interface CellConflict {
  cellId: string
  conflictingCellIds: string[]
  reason: 'row' | 'col' | 'box'
}
