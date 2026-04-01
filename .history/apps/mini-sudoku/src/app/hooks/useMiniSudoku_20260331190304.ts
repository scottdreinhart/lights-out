/**
 * useMiniSudoku Hook
 * Main game orchestration hook: state management, CQRS integration, game lifecycle
 */

import { useState, useCallback, useEffect } from 'react'
import type { MiniSudokuState, CellValue, Difficulty } from '../domain'
import { createPuzzleAtDifficulty } from '../domain'
import * as Commands from './commands/miniSudokuCommandHandlers'
import * as Queries from './queries/miniSudokuQueryHandlers'

interface UseMiniSudokuOptions {
  difficulty?: Difficulty
  initialPuzzle?: MiniSudokuState
}

interface UseMiniSudokuReturn {
  state: MiniSudokuState
  // Commands
  assignValue: (cellId: string, value: CellValue) => boolean
  clearCell: (cellId: string) => void
  toggleCandidate: (cellId: string, value: CellValue) => void
  undo: () => void
  redo: () => void
  requestHint: () => void
  restartPuzzle: () => void
  newPuzzle: (difficulty: Difficulty) => void
  // Queries
  isComplete: () => boolean
  isSolved: () => boolean
  getCellCandidates: (cellId: string) => Set<CellValue>
  getGameStats: () => ReturnType<typeof Queries.handleGetGameStats>
  getNextHint: () => ReturnType<typeof Queries.handleGetNextHint>
  canAssignValue: (cellId: string, value: CellValue) => boolean
  getConflictingCells: (cellId: string, value: CellValue) => string[]
  getEmptyCells: () => string[]
}

/**
 * Mini Sudoku game hook
 */
export function useMiniSudoku(options: UseMiniSudokuOptions = {}): UseMiniSudokuReturn {
  const [state, setState] = useState<MiniSudokuState>(() => {
    if (options.initialPuzzle) {
      return options.initialPuzzle
    }

    const puzzle = createPuzzleAtDifficulty(options.difficulty ?? 'EASY')
    return {
      id: `puzzle-${Date.now()}`,
      board: puzzle,
      difficulty: options.difficulty ?? 'EASY',
      isComplete: false,
      isSolved: false,
      moveCount: 0,
      startTime: Date.now(),
      hintCount: 0,
      mistakes: 0,
    }
  })

  const [history, setHistory] = useState({
    states: [state],
    currentIndex: 0,
  })

  const [originalPuzzle] = useState(state)

  // ==================== Commands ====================

  const assignValue = useCallback(
    (cellId: string, value: CellValue): boolean => {
      const result = Commands.handleAssignValue(state, cellId, value)
      if (result.isValid) {
        setState(result.newState)
        setHistory({
          states: [...history.states.slice(0, history.currentIndex + 1), result.newState],
          currentIndex: history.currentIndex + 1,
        })
      }
      return result.isValid
    },
    [state, history],
  )

  const clearCell = useCallback(
    (cellId: string) => {
      const newState = Commands.handleClearCell(state, cellId)
      setState(newState)
      setHistory({
        states: [...history.states.slice(0, history.currentIndex + 1), newState],
        currentIndex: history.currentIndex + 1,
      })
    },
    [state, history],
  )

  const toggleCandidate = useCallback(
    (cellId: string, value: CellValue) => {
      const newState = Commands.handleToggleCandidate(state, cellId, value)
      setState(newState)
    },
    [state],
  )

  const undo = useCallback(() => {
    if (history.currentIndex > 0) {
      const newIndex = history.currentIndex - 1
      setState(history.states[newIndex])
      setHistory({
        ...history,
        currentIndex: newIndex,
      })
    }
  }, [history])

  const redo = useCallback(() => {
    if (history.currentIndex < history.states.length - 1) {
      const newIndex = history.currentIndex + 1
      setState(history.states[newIndex])
      setHistory({
        ...history,
        currentIndex: newIndex,
      })
    }
  }, [history])

  const requestHint = useCallback(() => {
    const result = Commands.handleRequestHint(state)
    setState(result.newState)
  }, [state])

  const restartPuzzle = useCallback(() => {
    const newState = Commands.handleRestartPuzzle(state, originalPuzzle)
    setState(newState)
    setHistory({
      states: [newState],
      currentIndex: 0,
    })
  }, [state, originalPuzzle])

  const newPuzzle = useCallback((difficulty: Difficulty) => {
    const puzzle = createPuzzleAtDifficulty(difficulty)
    const newState: MiniSudokuState = {
      id: `puzzle-${Date.now()}`,
      board: puzzle,
      difficulty,
      isComplete: false,
      isSolved: false,
      moveCount: 0,
      startTime: Date.now(),
      hintCount: 0,
      mistakes: 0,
    }
    setState(newState)
    setHistory({
      states: [newState],
      currentIndex: 0,
    })
  }, [])

  // ==================== Queries ====================

  const isComplete = useCallback(
    () => Queries.handleIsComplete(state),
    [state],
  )

  const isSolved = useCallback(
    () => Queries.handleIsSolved(state),
    [state],
  )

  const getCellCandidates = useCallback(
    (cellId: string) => Queries.handleGetCellCandidates(state, cellId),
    [state],
  )

  const getGameStats = useCallback(
    () => Queries.handleGetGameStats(state),
    [state],
  )

  const getNextHint = useCallback(
    () => Queries.handleGetNextHint(state),
    [state],
  )

  const canAssignValue = useCallback(
    (cellId: string, value: CellValue) => Queries.handleCanAssignValue(state, cellId, value),
    [state],
  )

  const getConflictingCells = useCallback(
    (cellId: string, value: CellValue) =>
      Queries.handleGetConflictingCells(state, cellId, value),
    [state],
  )

  const getEmptyCells = useCallback(() => Queries.handleGetEmptyCells(state), [state])

  return {
    state,
    // Commands
    assignValue,
    clearCell,
    toggleCandidate,
    undo,
    redo,
    requestHint,
    restartPuzzle,
    newPuzzle,
    // Queries
    isComplete,
    isSolved,
    getCellCandidates,
    getGameStats,
    getNextHint,
    canAssignValue,
    getConflictingCells,
    getEmptyCells,
  }
}
