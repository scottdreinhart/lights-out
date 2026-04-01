/**
 * Mini Sudoku AI & Hint System
 * Provides hints and estimates puzzle difficulty
 */

import type { Board, Hint, Difficulty, DifficultyMetrics } from './types'
import { getCellsInRow, getCellsInCol, getCellsInBox, parseCellId, getBoxIndex } from './constants'
import { getCellCandidates, countEmpty, updateAllCandidates } from './rules'

/**
 * Hint type: candidates
 * Returns all candidates for a cell
 */
function getHint_Candidates(board: Board, cellId: string): Hint | null {
  const cell = board.get(cellId)
  if (!cell || cell.value || cell.isGiven) return null

  const candidates = new Set(cell.candidates)
  if (candidates.size === 0) return null

  return {
    type: 'candidates',
    cellId,
    candidates,
    reason: `Cell ${cellId} can be: ${Array.from(candidates).join(', ')}`,
  }
}

/**
 * Hint type: naked_single
 * Cell has exactly one candidate
 */
function getHint_NakedSingle(board: Board): Hint | null {
  for (const cell of board.values()) {
    if (cell.value || cell.isGiven) continue
    if (cell.candidates.size === 1) {
      const value = Array.from(cell.candidates)[0]
      return {
        type: 'naked_single',
        cellId: cell.id,
        value,
        reason: `Cell ${cell.id} has only one candidate: ${value}`,
      }
    }
  }
  return null
}

/**
 * Hint type: hidden_single
 * Value appears in only one cell's candidates in a region
 */
function getHint_HiddenSingle(board: Board): Hint | null {
  // Check rows
  for (let row = 0; row < 4; row++) {
    for (const value of ['1', '2', '3', '4'] as const) {
      let count = 0
      let candidateCell: string | null = null

      for (const cellId of getCellsInRow(row)) {
        const cell = board.get(cellId)
        if (cell && !cell.value && cell.candidates.has(value)) {
          count++
          candidateCell = cellId
        }
      }

      if (count === 1 && candidateCell) {
        return {
          type: 'hidden_single',
          cellId: candidateCell,
          value,
          reason: `Value ${value} can only go in ${candidateCell} in row ${row}`,
        }
      }
    }
  }

  // Check columns
  for (let col = 0; col < 4; col++) {
    for (const value of ['1', '2', '3', '4'] as const) {
      let count = 0
      let candidateCell: string | null = null

      for (const cellId of getCellsInCol(col)) {
        const cell = board.get(cellId)
        if (cell && !cell.value && cell.candidates.has(value)) {
          count++
          candidateCell = cellId
        }
      }

      if (count === 1 && candidateCell) {
        return {
          type: 'hidden_single',
          cellId: candidateCell,
          value,
          reason: `Value ${value} can only go in ${candidateCell} in column ${col}`,
        }
      }
    }
  }

  // Check boxes
  for (let box = 0; box < 4; box++) {
    for (const value of ['1', '2', '3', '4'] as const) {
      let count = 0
      let candidateCell: string | null = null

      for (const cellId of getCellsInBox(box)) {
        const cell = board.get(cellId)
        if (cell && !cell.value && cell.candidates.has(value)) {
          count++
          candidateCell = cellId
        }
      }

      if (count === 1 && candidateCell) {
        return {
          type: 'hidden_single',
          cellId: candidateCell,
          value,
          reason: `Value ${value} can only go in ${candidateCell} in box ${box}`,
        }
      }
    }
  }

  return null
}

/**
 * Get next hint for player
 * Uses simple techniques: candidates → naked single → hidden single
 */
export function provideHint(board: Board, cellId?: string): Hint | null {
  const boardCopy = new Map(board)
  for (const [key, cell] of boardCopy) {
    boardCopy.set(key, { ...cell, candidates: new Set(cell.candidates) })
  }
  updateAllCandidates(boardCopy)

  // If specific cell requested, return candidates for that cell
  if (cellId) {
    return getHint_Candidates(boardCopy, cellId)
  }

  // Try techniques in order of complexity
  let hint = getHint_NakedSingle(boardCopy)
  if (hint) return hint

  hint = getHint_HiddenSingle(boardCopy)
  if (hint) return hint

  // Last resort: return first cell with candidates
  for (const cell of boardCopy.values()) {
    if (!cell.value && !cell.isGiven && cell.candidates.size > 0) {
      return getHint_Candidates(boardCopy, cell.id)
    }
  }

  return null
}

/**
 * Estimate puzzle difficulty metrics
 */
export function estimateDifficulty(board: Board): DifficultyMetrics {
  const boardCopy = new Map(board)
  for (const [key, cell] of boardCopy) {
    boardCopy.set(key, { ...cell, candidates: new Set(cell.candidates) })
  }
  updateAllCandidates(boardCopy)

  // Count clues
  let clueCount = 0
  for (const cell of boardCopy.values()) {
    if (cell.isGiven) clueCount++
  }

  // Calculate constraint density (how constrained is the puzzle)
  let totalCandidates = 0
  let emptyCount = 0
  for (const cell of boardCopy.values()) {
    if (!cell.value) {
      totalCandidates += cell.candidates.size
      emptyCount++
    }
  }
  const averageCandidates = emptyCount > 0 ? totalCandidates / emptyCount : 0
  const constraintDensity = 1 - averageCandidates / 4 // Higher = more constrained

  // Estimate level based on clue count and constraint density
  let estimatedLevel: Difficulty = 'EASY'
  if (clueCount <= 6) {
    estimatedLevel = 'HARD'
  } else if (clueCount <= 8) {
    estimatedLevel = 'MEDIUM'
  } else {
    estimatedLevel = 'EASY'
  }

  return {
    estimatedLevel,
    clueCount,
    constraintDensity,
    averageCandidates,
  }
}

/**
 * Estimate solve time in milliseconds
 */
export function estimateSolveTime(board: Board): number {
  const metrics = estimateDifficulty(board)

  // Base time: 5s per clue
  let baseTime = (10 - metrics.clueCount) * 5000

  // Adjust for constraint density
  baseTime *= 1 + metrics.constraintDensity

  // Adjust for average candidates (more candidates = harder)
  baseTime *= 1 + (4 - metrics.averageCandidates) / 4

  return Math.max(5000, Math.min(120000, baseTime)) // Clamp 5-120 seconds
}

/**
 * Count how many steps of simple logic can solve
 * Useful for difficulty estimation
 */
export function countSolvableByLogic(board: Board): number {
  const boardCopy = new Map(board)
  for (const [key, cell] of boardCopy) {
    boardCopy.set(key, { ...cell, candidates: new Set(cell.candidates) })
  }

  let stepsSolved = 0

  while (true) {
    let foundHint = false

    // Try naked singles
    for (const cell of boardCopy.values()) {
      if (!cell.value && cell.candidates.size === 1) {
        const value = Array.from(cell.candidates)[0]
        cell.value = value
        cell.candidates.clear()
        foundHint = true
        stepsSolved++
        break
      }
    }

    if (!foundHint) break
  }

  return stepsSolved
}
