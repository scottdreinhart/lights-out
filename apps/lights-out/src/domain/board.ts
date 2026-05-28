/**
 * Board operations — pure functions for creating and manipulating game state.
 * No React, no DOM — purely functional transformations.
 */

import { getWasmModule } from '@/wasm/wasm-loader'
import { Board, Position } from './types'

const GRID_SIZE = 5

/**
 * Create a new board with random light pattern.
 * About 25-50% of lights randomly on.
 */
export function createBoard(): Board {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => Math.random() > 0.5),
  )
}

/**
 * Toggle a cell and its 4 cardinal neighbors (up, down, left, right).
 * Creates new board without mutating original.
 */
export function toggleCell(board: Board, row: number, col: number): Board {
  const newBoard = board.map((r) => [...r])

  // Toggle the cell itself
  // eslint-disable-next-line security/detect-object-injection
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
      // eslint-disable-next-line security/detect-object-injection
      newBoard[r][c] = !newBoard[r][c]
    }
  })

  return newBoard
}

/**
 * Check if all lights are off (solved).
 */
export function isSolved(board: Board): boolean {
  return board.every((row) => row.every((light) => !light))
}

/**
 * Initialize WASM module once so worker/runtime paths are warmed up.
 */
export async function initBoardWasm(): Promise<void> {
  await getWasmModule()
}

/**
 * Get grid size
 */
export function getGridSize(): number {
  return GRID_SIZE
}
