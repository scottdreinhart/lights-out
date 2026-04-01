/**
 * Mini Sudoku CQRS Command Handlers
 * Handles game commands: assign, clear, undo, redo, pause, hint, etc.
 */

import type { MiniSudokuState, CellValue } from '../domain'
import {
  isValidMove,
  getConflictingCells,
  isComplete,
  isSolved,
  updateAllCandidates,
  clonePuzzle,
} from '../domain'

/**
 * Internal state for undo/redo
 */
interface CommandHistory {
  states: MiniSudokuState[]
  currentIndex: number
}

/**
 * Command: Create/initialize puzzle
 */
export function handleCreatePuzzle(
  _previousState: MiniSudokuState | null,
  puzzle: MiniSudokuState,
): MiniSudokuState {
  return {
    ...puzzle,
    moveCount: 0,
    hintCount: 0,
    mistakes: 0,
    startTime: Date.now(),
    isComplete: false,
    isSolved: false,
  }
}

/**
 * Command: Assign value to cell
 */
export function handleAssignValue(
  state: MiniSudokuState,
  cellId: string,
  value: CellValue,
): { newState: MiniSudokuState; isValid: boolean; conflict?: boolean } {
  if (!value) return { newState: state, isValid: true }

  const cell = state.board.get(cellId)
  if (!cell || cell.isGiven) {
    return { newState: state, isValid: false }
  }

  // Validate move
  const isValid = isValidMove(state.board, cellId, value)

  if (!isValid) {
    return {
      newState: {
        ...state,
        mistakes: state.mistakes + 1,
      },
      isValid: false,
      conflict: true,
    }
  }

  // Apply move
  const newBoard = clonePuzzle(state.board)
  const updatedCell = newBoard.get(cellId)!
  updatedCell.value = value
  updatedCell.candidates.clear()

  // Update candidates for affected cells
  updateAllCandidates(newBoard)

  // Check completion
  const isComplete = isCompleteCheck(newBoard)
  const isSolved = isComplete && isSolvedCheck(newBoard)

  return {
    newState: {
      ...state,
      board: newBoard,
      moveCount: state.moveCount + 1,
      isComplete,
      isSolved,
    },
    isValid: true,
  }
}

/**
 * Command: Clear cell value
 */
export function handleClearCell(state: MiniSudokuState, cellId: string): MiniSudokuState {
  const cell = state.board.get(cellId)
  if (!cell || cell.isGiven) return state

  const newBoard = clonePuzzle(state.board)
  const updatedCell = newBoard.get(cellId)!
  updatedCell.value = ''
  updatedCell.candidates = new Set(['1', '2', '3', '4'])

  // Update candidates
  updateAllCandidates(newBoard)

  return {
    ...state,
    board: newBoard,
    isComplete: false,
    isSolved: false,
  }
}

/**
 * Command: Toggle candidate value for a cell
 */
export function handleToggleCandidate(
  state: MiniSudokuState,
  cellId: string,
  value: CellValue,
): MiniSudokuState {
  if (!value) return state

  const cell = state.board.get(cellId)
  if (!cell || cell.value || cell.isGiven) return state

  const newBoard = clonePuzzle(state.board)
  const updatedCell = newBoard.get(cellId)!

  if (updatedCell.candidates.has(value)) {
    updatedCell.candidates.delete(value)
  } else {
    updatedCell.candidates.add(value)
  }

  return {
    ...state,
    board: newBoard,
  }
}

/**
 * Command: Undo last move
 */
export function handleUndo(state: MiniSudokuState, history: CommandHistory): MiniSudokuState {
  if (history.currentIndex <= 0) return state
  history.currentIndex--
  return history.states[history.currentIndex]
}

/**
 * Command: Redo last undone move
 */
export function handleRedo(state: MiniSudokuState, history: CommandHistory): MiniSudokuState {
  if (history.currentIndex >= history.states.length - 1) return state
  history.currentIndex++
  return history.states[history.currentIndex]
}

/**
 * Command: Pause game
 */
export function handlePauseGame(state: MiniSudokuState): MiniSudokuState {
  return {
    ...state,
    // Pause state could be stored in extended state
  }
}

/**
 * Command: Resume game
 */
export function handleResumeGame(state: MiniSudokuState): MiniSudokuState {
  return state
}

/**
 * Command: Request hint
 */
export function handleRequestHint(state: MiniSudokuState): { newState: MiniSudokuState } {
  return {
    newState: {
      ...state,
      hintCount: state.hintCount + 1,
    },
  }
}

/**
 * Command: Record stats at end of game
 */
export function handleRecordStats(state: MiniSudokuState): MiniSudokuState {
  const elapsedSeconds = (Date.now() - state.startTime) / 1000
  return {
    ...state,
    // Stats recorded externally via event
  }
}

/**
 * Command: Restart puzzle
 */
export function handleRestartPuzzle(
  state: MiniSudokuState,
  originalPuzzle: MiniSudokuState,
): MiniSudokuState {
  return {
    ...originalPuzzle,
    startTime: Date.now(),
    moveCount: 0,
    hintCount: 0,
    mistakes: 0,
  }
}

/**
 * Helper: Check if board is complete
 */
function isCompleteCheck(board: ReturnType<typeof clonePuzzle>): boolean {
  for (const cell of board.values()) {
    if (!cell.value) return false
  }
  return true
}

/**
 * Helper: Check if board is solved (complete + valid)
 */
function isSolvedCheck(board: ReturnType<typeof clonePuzzle>): boolean {
  return isComplete(board) && isSolved(board)
}
