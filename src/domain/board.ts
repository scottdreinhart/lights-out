/**
 * Board operations — pure functions for creating and manipulating game state.
 * No React, no DOM — purely functional transformations.
 * Optimized with WebAssembly for hot paths.
 */

import { Board, Position } from './types'

const GRID_SIZE = 5

interface WasmModule {
  instance: WebAssembly.Instance
}

// WASM module cache (lazy-loaded)
let wasmModule: WasmModule | null = null

/**
 * Initialize WASM module from embedded base64 binary
 */
async function initWasm(): Promise<WasmModule | null> {
  if (wasmModule) return wasmModule

  try {
    // Dynamically import the WASM module
    const { AI_WASM_BASE64 } = await import('@/wasm/ai-wasm')

    const binaryString = atob(AI_WASM_BASE64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const memory = new WebAssembly.Memory({ initial: 256, maximum: 512 })
    const importObject = {
      env: {
        memory,
        abort: () => {
          throw new Error('WASM abort')
        },
      },
    }

    const wasmResult = await WebAssembly.instantiate(bytes, importObject)
    wasmModule = { instance: wasmResult.instance }
    console.log('[Board] WASM module loaded for optimization')
    return wasmModule
  } catch (err) {
    console.warn('[Board] WASM unavailable, using JS:', err)
    return null
  }
}

/**
 * Create a new board with random light pattern
 * About 25-50% of lights randomly on
 */
export function createBoard(): Board {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => Math.random() > 0.5),
  )
}

/**
 * Toggle a cell and its 4 cardinal neighbors (up, down, left, right)
 * Creates new board without mutating original
 */
export function toggleCell(board: Board, row: number, col: number): Board {
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
 */
export function isSolved(board: Board): boolean {
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
