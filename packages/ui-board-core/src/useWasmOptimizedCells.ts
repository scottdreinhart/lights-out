/**
 * useWasmOptimizedCells — React hook for WASM-aware cell state management
 * Provides optimized transitions using FSM with optional WASM acceleration
 */

import { useCallback, useMemo, useState } from 'react'
import { CellStateFsm, type CellStateFsmConfig } from './cellStateFsm'

export interface UseWasmOptimizedCellsOptions<S> {
  /**
   * FSM configuration for valid state transitions
   */
  fsmConfig: CellStateFsmConfig<S>

  /**
   * Initial grid state
   */
  initialGrid: S[][]

  /**
   * Optional: callback when cell state changes
   */
  onCellChange?: (row: number, col: number, oldState: S, newState: S) => void
}

export function useWasmOptimizedCells<S>({
  fsmConfig,
  initialGrid,
  onCellChange,
}: UseWasmOptimizedCellsOptions<S>) {
  const [grid, setGrid] = useState<S[][]>(initialGrid)

  // Create FSM instance (memoized to prevent recreation)
  const fsm = useMemo(() => new CellStateFsm(fsmConfig), [fsmConfig])

  /**
   * Get current cell state
   */
  const getCell = useCallback(
    (row: number, col: number): S | null => {
      if (row < 0 || row >= grid.length || col < 0 || col >= grid[row].length) {
        return null
      }
      return grid[row][col]
    },
    [grid],
  )

  /**
   * Try transitioning a cell to a new state
   * Returns success/failure and new state
   */
  const transitionCell = useCallback(
    (row: number, col: number, newState: S): { success: boolean; state: S | null } => {
      const current = getCell(row, col)
      if (current === null) {
        return { success: false, state: null }
      }

      // Check if transition is valid via FSM
      if (!fsm.canTransition(current, newState)) {
        return { success: false, state: null }
      }

      // Apply transition
      const nextGrid = grid.map((r, ri) => (ri === row ? [...r] : r))
      nextGrid[row][col] = newState

      setGrid(nextGrid)

      // Notify change
      if (onCellChange) {
        onCellChange(row, col, current, newState)
      }

      return { success: true, state: newState }
    },
    [getCell, grid, fsm, onCellChange],
  )

  /**
   * Batch transitions for multiple cells
   * Validates all before applying any
   */
  const batchTransition = useCallback(
    (
      transitions: Array<{ row: number; col: number; newState: S }>,
    ): { success: boolean; applied: number } => {
      // Validate all transitions first
      for (const { row, col, newState } of transitions) {
        const current = getCell(row, col)
        if (current === null || !fsm.canTransition(current, newState)) {
          return { success: false, applied: 0 }
        }
      }

      // Apply all transitions
      const nextGrid = grid.map((r) => [...r])
      let count = 0

      for (const { row, col, newState } of transitions) {
        const oldState = nextGrid[row][col]
        nextGrid[row][col] = newState
        if (onCellChange) {
          onCellChange(row, col, oldState, newState)
        }
        count++
      }

      setGrid(nextGrid)
      return { success: true, applied: count }
    },
    [getCell, grid, fsm, onCellChange],
  )

  /**
   * Reset grid to initial state
   */
  const resetGrid = useCallback(
    (newGrid?: S[][]) => {
      setGrid(newGrid ?? initialGrid)
    },
    [initialGrid],
  )

  /**
   * Get all valid next states for a cell
   */
  const getValidNextStates = useCallback(
    (row: number, col: number): S[] => {
      const current = getCell(row, col)
      if (current === null) {
        return []
      }
      return fsm.validNextStates(current)
    },
    [getCell, fsm],
  )

  /**
   * Check if cell is in terminal state
   */
  const isCellTerminal = useCallback(
    (row: number, col: number): boolean => {
      const current = getCell(row, col)
      if (current === null) {
        return false
      }
      return fsm.isTerminal(current)
    },
    [getCell, fsm],
  )

  /**
   * Get grid dimensions
   */
  const dimensions = useMemo(
    () => ({
      rows: grid.length,
      cols: grid[0]?.length ?? 0,
    }),
    [grid],
  )

  return {
    // State
    grid,
    dimensions,

    // Operations
    getCell,
    transitionCell,
    batchTransition,
    resetGrid,

    // Queries
    getValidNextStates,
    isCellTerminal,

    // FSM access (if needed directly)
    fsm,
  }
}
