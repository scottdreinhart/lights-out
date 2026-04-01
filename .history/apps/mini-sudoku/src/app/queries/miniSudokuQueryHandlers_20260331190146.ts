/**
 * Mini Sudoku CQRS Query Handlers
 * Answers questions about game state without modifying it
 */

import type { MiniSudokuState, CellValue } from '../domain'
import {
  isComplete,
  isSolved,
  getCellCandidates,
  countEmpty,
  estimateDifficulty,
  estimateSolveTime,
} from '../domain'

/**
 * Query: Get current board state
 */
export function handleGetBoardState(state: MiniSudokuState): MiniSudokuState['board'] {
  return state.board
}

/**
 * Query: Get cell value
 */
export function handleGetCellValue(state: MiniSudokuState, cellId: string): CellValue {
  const cell = state.board.get(cellId)
  return cell?.value ?? ''
}

/**
 * Query: Get cell candidates (possible values)
 */
export function handleGetCellCandidates(
  state: MiniSudokuState,
  cellId: string,
): Set<CellValue> {
  return getCellCandidates(state.board, cellId)
}

/**
 * Query: Is cell given/locked?
 */
export function handleIsCellGiven(state: MiniSudokuState, cellId: string): boolean {
  const cell = state.board.get(cellId)
  return cell?.isGiven ?? false
}

/**
 * Query: Get all cells in a region (row, col, or box)
 */
export function handleGetCellsInRegion(
  state: MiniSudokuState,
  regionType: 'row' | 'col' | 'box',
  index: number,
): Array<{ cellId: string; value: CellValue; isGiven: boolean }> {
  const cellIds: string[] = []

  if (regionType === 'row') {
    for (let col = 0; col < 4; col++) {
      cellIds.push(`r${index}c${col}`)
    }
  } else if (regionType === 'col') {
    for (let row = 0; row < 4; row++) {
      cellIds.push(`r${row}c${index}`)
    }
  } else if (regionType === 'box') {
    const startRow = Math.floor(index / 2) * 2
    const startCol = (index % 2) * 2
    for (let r = startRow; r < startRow + 2; r++) {
      for (let c = startCol; c < startCol + 2; c++) {
        cellIds.push(`r${r}c${c}`)
      }
    }
  }

  return cellIds.map(cellId => {
    const cell = state.board.get(cellId)!
    return {
      cellId,
      value: cell.value,
      isGiven: cell.isGiven,
    }
  })
}

/**
 * Query: Is puzzle complete (all cells filled)?
 */
export function handleIsComplete(state: MiniSudokuState): boolean {
  return isComplete(state.board)
}

/**
 * Query: Is puzzle solved (complete + valid)?
 */
export function handleIsSolved(state: MiniSudokuState): boolean {
  return isSolved(state.board)
}

/**
 * Query: Get game stats
 */
export function handleGetGameStats(
  state: MiniSudokuState,
): {
  moveCount: number
  hintCount: number
  mistakes: number
  elapsedSeconds: number
  emptyCount: number
  difficulty: string
} {
  const elapsedSeconds = Math.floor((Date.now() - state.startTime) / 1000)
  const emptyCount = countEmpty(state.board)
  const difficulty = state.difficulty

  return {
    moveCount: state.moveCount,
    hintCount: state.hintCount,
    mistakes: state.mistakes,
    elapsedSeconds,
    emptyCount,
    difficulty,
  }
}

/**
 * Query: Get hint for player
 */
export function handleGetNextHint(state: MiniSudokuState): {
  cellId: string
  hint: string
  value?: CellValue
} | null {
  // Simple hint: find first empty cell with only one candidate
  for (const cell of state.board.values()) {
    if (!cell.value && cell.candidates.size === 1) {
      const value = Array.from(cell.candidates)[0]
      return {
        cellId: cell.id,
        hint: `Cell ${cell.id} can only be ${value}`,
        value,
      }
    }
  }

  // Alternative: return candidates for first empty cell
  for (const cell of state.board.values()) {
    if (!cell.value && cell.candidates.size > 0) {
      return {
        cellId: cell.id,
        hint: `Cell ${cell.id} candidates: ${Array.from(cell.candidates).join(', ')}`,
      }
    }
  }

  return null
}

/**
 * Query: Estimate difficulty
 */
export function handleEstimateDifficulty(
  state: MiniSudokuState,
): {
  level: string
  constraintDensity: number
  estimateSolveTimeMs: number
} {
  const metrics = estimateDifficulty(state.board)
  const solveTimeMs = estimateSolveTime(state.board)

  return {
    level: metrics.estimatedLevel,
    constraintDensity: metrics.constraintDensity,
    estimateSolveTimeMs: solveTimeMs,
  }
}

/**
 * Query: Get conflicts for a cell (cells that would conflict)
 */
export function handleGetConflictingCells(
  state: MiniSudokuState,
  cellId: string,
  value: CellValue,
): string[] {
  if (!value) return []

  const conflicts: string[] = []
  const cell = state.board.get(cellId)
  if (!cell) return []

  const { row, col } = { row: cell.row, col: cell.col }
  const boxIndex = cell.box

  // Check row
  for (let tcol = 0; tcol < 4; tcol++) {
    const otherId = `r${row}c${tcol}`
    if (otherId !== cellId) {
      const other = state.board.get(otherId)
      if (other?.value === value) {
        conflicts.push(otherId)
      }
    }
  }

  // Check column
  for (let trow = 0; trow < 4; trow++) {
    const otherId = `r${trow}c${col}`
    if (otherId !== cellId) {
      const other = state.board.get(otherId)
      if (other?.value === value) {
        conflicts.push(otherId)
      }
    }
  }

  // Check box
  const startRow = Math.floor(boxIndex / 2) * 2
  const startCol = (boxIndex % 2) * 2
  for (let r = startRow; r < startRow + 2; r++) {
    for (let c = startCol; c < startCol + 2; c++) {
      const otherId = `r${r}c${c}`
      if (otherId !== cellId) {
        const other = state.board.get(otherId)
        if (other?.value === value) {
          conflicts.push(otherId)
        }
      }
    }
  }

  return conflicts
}

/**
 * Query: Get all empty cells
 */
export function handleGetEmptyCells(state: MiniSudokuState): string[] {
  const empty: string[] = []
  for (const cell of state.board.values()) {
    if (!cell.value) {
      empty.push(cell.id)
    }
  }
  return empty
}

/**
 * Query: Get all filled cells
 */
export function handleGetFilledCells(state: MiniSudokuState): string[] {
  const filled: string[] = []
  for (const cell of state.board.values()) {
    if (cell.value) {
      filled.push(cell.id)
    }
  }
  return filled
}

/**
 * Query: Can cell be filled with value?
 */
export function handleCanAssignValue(
  state: MiniSudokuState,
  cellId: string,
  value: CellValue,
): boolean {
  if (!value) return true

  const cell = state.board.get(cellId)
  if (!cell || cell.isGiven) return false

  // Quick check: is value in candidates?
  return cell.candidates.has(value)
}
