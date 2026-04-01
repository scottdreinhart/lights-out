/**
 * Mini Sudoku Validation Rules
 * Core game logic: move validation, conflict detection, completion checks
 */

import { getBoxIndex, getCellsInBox, getCellsInCol, getCellsInRow, parseCellId } from './constants'
import type { Board, CellConflict, CellValue, Difficulty, MiniSudokuState } from './types'
import { createPuzzleAtDifficulty } from './templates'

/**
 * Check if a value assignment is valid (no conflicts)
 */
export function isValidMove(board: Board, cellId: string, value: CellValue): boolean {
  if (!value) {return true} // Clearing is always valid

  const cell = board.get(cellId)
  if (!cell || cell.isGiven) {return false} // Can't move given cell

  const { row, col } = parseCellId(cellId)
  const boxIndex = getBoxIndex(row, col)

  // Check row uniqueness
  for (const otherCellId of getCellsInRow(row)) {
    if (otherCellId !== cellId) {
      const other = board.get(otherCellId)
      if (other?.value === value) {return false}
    }
  }

  // Check column uniqueness
  for (const otherCellId of getCellsInCol(col)) {
    if (otherCellId !== cellId) {
      const other = board.get(otherCellId)
      if (other?.value === value) {return false}
    }
  }

  // Check box uniqueness
  for (const otherCellId of getCellsInBox(boxIndex)) {
    if (otherCellId !== cellId) {
      const other = board.get(otherCellId)
      if (other?.value === value) {return false}
    }
  }

  return true
}

/**
 * Get all cells that conflict with assigning value to cellId
 */
export function getConflictingCells(
  board: Board,
  cellId: string,
  value: CellValue,
): CellConflict[] {
  if (!value) {return []} // No conflicts when clearing

  const conflicts: CellConflict[] = []
  const { row, col } = parseCellId(cellId)
  const boxIndex = getBoxIndex(row, col)
  const conflictingCellIds: string[] = []

  // Row conflicts
  for (const otherId of getCellsInRow(row)) {
    if (otherId !== cellId) {
      const other = board.get(otherId)
      if (other?.value === value) {
        conflictingCellIds.push(otherId)
      }
    }
  }
  if (conflictingCellIds.length > 0) {
    conflicts.push({
      cellId,
      conflictingCellIds: [...conflictingCellIds],
      reason: 'row',
    })
    conflictingCellIds.length = 0
  }

  // Column conflicts
  for (const otherId of getCellsInCol(col)) {
    if (otherId !== cellId) {
      const other = board.get(otherId)
      if (other?.value === value) {
        conflictingCellIds.push(otherId)
      }
    }
  }
  if (conflictingCellIds.length > 0) {
    conflicts.push({
      cellId,
      conflictingCellIds: [...conflictingCellIds],
      reason: 'col',
    })
    conflictingCellIds.length = 0
  }

  // Box conflicts
  for (const otherId of getCellsInBox(boxIndex)) {
    if (otherId !== cellId) {
      const other = board.get(otherId)
      if (other?.value === value) {
        conflictingCellIds.push(otherId)
      }
    }
  }
  if (conflictingCellIds.length > 0) {
    conflicts.push({
      cellId,
      conflictingCellIds: [...conflictingCellIds],
      reason: 'box',
    })
  }

  return conflicts
}

/**
 * Check if puzzle is complete (all cells filled)
 */
export function isComplete(board: Board): boolean {
  for (const cell of board.values()) {
    if (!cell.value) {return false}
  }
  return true
}

/**
 * Check if puzzle is solved (complete and valid)
 */
export function isSolved(board: Board): boolean {
  if (!isComplete(board)) {return false}

  // Verify all constraints
  for (let row = 0; row < 4; row++) {
    const values = new Set<CellValue>()
    for (const cellId of getCellsInRow(row)) {
      const cell = board.get(cellId)
      if (!cell?.value) {return false}
      if (values.has(cell.value)) {return false}
      values.add(cell.value)
    }
    if (values.size !== 4) {return false}
  }

  for (let col = 0; col < 4; col++) {
    const values = new Set<CellValue>()
    for (const cellId of getCellsInCol(col)) {
      const cell = board.get(cellId)
      if (!cell?.value) {return false}
      if (values.has(cell.value)) {return false}
      values.add(cell.value)
    }
    if (values.size !== 4) {return false}
  }

  for (let box = 0; box < 4; box++) {
    const values = new Set<CellValue>()
    for (const cellId of getCellsInBox(box)) {
      const cell = board.get(cellId)
      if (!cell?.value) {return false}
      if (values.has(cell.value)) {return false}
      values.add(cell.value)
    }
    if (values.size !== 4) {return false}
  }

  return true
}

/**
 * Count empty cells
 */
export function countEmpty(board: Board): number {
  let count = 0
  for (const cell of board.values()) {
    if (!cell.value) {count++}
  }
  return count
}

/**
 * Get all cells in a given region (row, col, or box)
 */
export function getCellsInRegion(regionType: 'row' | 'col' | 'box', index: number): string[] {
  switch (regionType) {
    case 'row':
      return getCellsInRow(index)
    case 'col':
      return getCellsInCol(index)
    case 'box':
      return getCellsInBox(index)
  }
}

/**
 * Update cell candidates based on current board state
 */
export function updateCellCandidates(board: Board, cellId: string): void {
  const cell = board.get(cellId)
  if (!cell || cell.value || cell.isGiven) {return}

  const { row, col } = parseCellId(cellId)
  const boxIndex = getBoxIndex(row, col)

  // Start with all values possible
  cell.candidates = new Set(['1', '2', '3', '4'])

  // Remove values that appear in same row
  for (const otherId of getCellsInRow(row)) {
    const other = board.get(otherId)
    if (other?.value) {
      cell.candidates.delete(other.value)
    }
  }

  // Remove values that appear in same column
  for (const otherId of getCellsInCol(col)) {
    const other = board.get(otherId)
    if (other?.value) {
      cell.candidates.delete(other.value)
    }
  }

  // Remove values that appear in same box
  for (const otherId of getCellsInBox(boxIndex)) {
    const other = board.get(otherId)
    if (other?.value) {
      cell.candidates.delete(other.value)
    }
  }
}

/**
 * Update all cell candidates in the board
 */
export function updateAllCandidates(board: Board): void {
  for (const cellId of board.keys()) {
    updateCellCandidates(board, cellId)
  }
}

/**
 * Get candidates for a specific cell
 */
export function getCellCandidates(board: Board, cellId: string): Set<CellValue> {
  const cell = board.get(cellId)
  if (!cell) {return new Set()}
  if (cell.value) {return new Set()}
  return new Set(cell.candidates)
}

/**
 * Calculate elapsed game time in seconds
 */
export function calculateGameTime(startTime: number): number {
  return Math.floor((Date.now() - startTime) / 1000)
}

/**
 * Create a new game state for the given difficulty
 */
export function createGameState(difficulty: Difficulty): MiniSudokuState {
  const board = createPuzzleAtDifficulty(difficulty)
  return {
    id: `puzzle-${Date.now()}`,
    board,
    difficulty,
    isComplete: false,
    isSolved: false,
    moveCount: 0,
    startTime: Date.now(),
    hintCount: 0,
    mistakes: 0,
  }
}

/**
 * Check if the game is complete (all cells filled)
 */
export function isGameComplete(gameState: MiniSudokuState): boolean {
  return isComplete(gameState.board)
}

/**
 * Make a move on the game state
 */
export function makeMove(gameState: MiniSudokuState, row: number, col: number, value: CellValue): MiniSudokuState {
  const cellId = `r${row}c${col}`
  const cell = gameState.board.get(cellId)

  if (!cell || cell.isGiven) {
    return gameState // Invalid move, return unchanged state
  }

  // Create new board with the move
  const newBoard = new Map(gameState.board)
  const newCell = { ...cell, value }
  newBoard.set(cellId, newCell)

  // Update candidates for affected cells
  updateAllCandidates(newBoard)

  return {
    ...gameState,
    board: newBoard,
    moveCount: gameState.moveCount + (value ? 1 : 0), // Only count non-empty moves
    isComplete: isComplete(newBoard),
    isSolved: isSolved(newBoard),
  }
}
