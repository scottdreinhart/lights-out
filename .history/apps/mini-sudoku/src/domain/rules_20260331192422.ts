/**
 * Mini Sudoku Validation Rules
 * Core game logic: move validation, conflict detection, completion checks
 */

import type { Board, CellValue, CellConflict } from './types'
import { parseCellId, getBoxIndex, getCellsInRow, getCellsInCol, getCellsInBox } from './constants'

/**
 * Check if value exists in any of the given cells (for uniqueness validation)
 */
function valueExistsInCells(board: Board, cellIds: string[], targetValue: CellValue, excludeCellId: string): boolean {
  for (const cellId of cellIds) {
    if (cellId !== excludeCellId) {
      const cell = board.get(cellId)
      if (cell?.value === targetValue) return true
    }
  }
  return false
}

/**
 * Find conflicting cells in a group (row, col, or box)
 */
function findConflictsInGroup(
  board: Board,
  cellIds: string[],
  cellId: string,
  value: CellValue,
  reason: 'row' | 'col' | 'box',
): CellConflict | null {
  const conflictingCellIds: string[] = []
  
  for (const otherId of cellIds) {
    if (otherId !== cellId) {
      const other = board.get(otherId)
      if (other?.value === value) {
        conflictingCellIds.push(otherId)
      }
    }
  }
  
  return conflictingCellIds.length > 0
    ? { cellId, conflictingCellIds, reason }
    : null
}

/**
 * Check if a value assignment is valid (no conflicts)
 */
export function isValidMove(board: Board, cellId: string, value: CellValue): boolean {
  if (!value) return true // Clearing is always valid

  const cell = board.get(cellId)
  if (!cell || cell.isGiven) return false // Can't move given cell

  const { row, col } = parseCellId(cellId)
  const boxIndex = getBoxIndex(row, col)

  // Check row, column, and box uniqueness
  return !(
    valueExistsInCells(board, getCellsInRow(row), value, cellId) ||
    valueExistsInCells(board, getCellsInCol(col), value, cellId) ||
    valueExistsInCells(board, getCellsInBox(boxIndex), value, cellId)
  )
}

/**
 * Get all cells that conflict with assigning value to cellId
 */
export function getConflictingCells(
  board: Board,
  cellId: string,
  value: CellValue,
): CellConflict[] {
  if (!value) return [] // No conflicts when clearing

  const { row, col } = parseCellId(cellId)
  const boxIndex = getBoxIndex(row, col)

  const conflicts: CellConflict[] = []
  
  // Check row conflicts
  const rowConflict = findConflictsInGroup(board, getCellsInRow(row), cellId, value, 'row')
  if (rowConflict) conflicts.push(rowConflict)
  
  // Check column conflicts
  const colConflict = findConflictsInGroup(board, getCellsInCol(col), cellId, value, 'col')
  if (colConflict) conflicts.push(colConflict)
  
  // Check box conflicts
  const boxConflict = findConflictsInGroup(board, getCellsInBox(boxIndex), cellId, value, 'box')
  if (boxConflict) conflicts.push(boxConflict)

  return conflicts
}

/**
 * Check if puzzle is complete (all cells filled)
 */
export function isComplete(board: Board): boolean {
  for (const cell of board.values()) {
    if (!cell.value) return false
  }
  return true
}

/**
 * Validate constraint on a group of cells (all must have unique values)
 */
function validateConstraint(board: Board, cellIds: string[]): boolean {
  const values = new Set<CellValue>()
  for (const cellId of cellIds) {
    const cell = board.get(cellId)
    if (!cell?.value) return false
    if (values.has(cell.value)) return false
    values.add(cell.value)
  }
  return values.size === 4
}

/**
 * Check if puzzle is solved (complete and valid)
 */
export function isSolved(board: Board): boolean {
  if (!isComplete(board)) return false

  // Verify all constraints
  for (let row = 0; row < 4; row++) {
    if (!validateConstraint(board, getCellsInRow(row))) return false
  }

  for (let col = 0; col < 4; col++) {
    if (!validateConstraint(board, getCellsInCol(col))) return false
  }

  for (let box = 0; box < 4; box++) {
    if (!validateConstraint(board, getCellsInBox(box))) return false
  }

  return true
}

/**
 * Count empty cells
 */
export function countEmpty(board: Board): number {
  let count = 0
  for (const cell of board.values()) {
    if (!cell.value) count++
  }
  return count
}

/**
 * Get all cells in a given region (row, col, or box)
 */
export function getCellsInRegion(
  regionType: 'row' | 'col' | 'box',
  index: number,
): string[] {
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
  if (!cell || cell.value || cell.isGiven) return

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
  if (!cell) return new Set()
  if (cell.value) return new Set()
  return new Set(cell.candidates)
}
