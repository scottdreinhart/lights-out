/**
 * Board operations — pure functions for creating and manipulating game state.
 * No React, no DOM — purely functional transformations.
 * Optimized with WebAssembly for hot paths.
 */

import { lightsOutWasm } from '@/infrastructure'
import { Board, Position } from './types'

const GRID_SIZE = 5

/**
 * Create a new board with random light pattern
 * About 25-50% of lights randomly on
 * Uses WASM optimization when available
 */
export async function createBoard(): Promise<Board> {
  // Try WASM first for performance
  const wasmBoard = await lightsOutWasm.createBoard()
  if (wasmBoard) {
    return wasmBoard
  }

  // JS fallback
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => Math.random() > 0.5),
  )
}

/**
 * Toggle a cell and its 4 cardinal neighbors (up, down, left, right)
 * Creates new board without mutating original
 * Uses WASM optimization when available
 */
export async function toggleCell(board: Board, row: number, col: number): Promise<Board> {
  // Try WASM first for performance
  const wasmBoard = await lightsOutWasm.toggleCell(board, row, col)
  if (wasmBoard) {
    return wasmBoard
  }

  // JS fallback
  const newBoard = board.map((r) => [...r])

  // Toggle the cell itself
  newBoard[row][col] = !newBoard[row][col]

  // Toggle neighbors: up, down, left, right
  const neighbors: Position[] = [
    { row: row - 1, col }, // up
    { row: row + 1, col }, // down
    { row, col: col - 1 }, // left
    { row, col: col + 1 }, // right
  ]

  neighbors.forEach(({ row: r, col: c }) => {
    // Only toggle if neighbor is within bounds
    if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
      newBoard[r][c] = !newBoard[r][c]
    }
  })

  return newBoard
}

/**
 * Check if all lights are off (solved)
 * Uses WASM optimization when available
 */
export async function isSolved(board: Board): Promise<boolean> {
  // Try WASM first for performance
  const wasmResult = await lightsOutWasm.isSolved(board)
  if (wasmResult !== null) {
    return wasmResult
  }

  // JS fallback
  return board.every((row) => row.every((light) => !light))
}

/**
 * Initialize WASM module for board optimization
 * Call this once at app startup for best performance
 */
export async function initBoardWasm(): Promise<void> {
  await initWasm()
}

/**
 * Get grid size
 */
export function getGridSize(): number {
  return GRID_SIZE
}
