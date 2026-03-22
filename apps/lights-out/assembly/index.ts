// =======================================================================
// Lights Out Game Engine - WebAssembly (AssemblyScript)
//
// Optimized board operations:
// - Toggle cell + 4 neighbors
// - Win detection (all lights off)
// - Efficient board manipulation
//
// Compile: pnpm wasm:build
// =======================================================================

const GRID_SIZE = 5
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE

/**
 * Toggle a cell and its 4 cardinal neighbors
 * Board: flat u8 array, 0 = off, 1 = on
 * Returns: new board state (doesn't mutate input)
 */
export function toggleCell(board: Uint8Array, row: i32, col: i32): Uint8Array {
  const result = new Uint8Array(TOTAL_CELLS)
  
  // Copy board
  for (let i = 0; i < TOTAL_CELLS; i++) {
    result[i] = board[i]
  }
  
  // Toggle center cell
  const center = row * GRID_SIZE + col
  result[center] = result[center] ? 0 : 1
  
  // Toggle cardinal neighbors
  const neighbors: i32[] = [
    row - 1 >= 0 ? (row - 1) * GRID_SIZE + col : -1,  // up
    row + 1 < GRID_SIZE ? (row + 1) * GRID_SIZE + col : -1,  // down
    col - 1 >= 0 ? row * GRID_SIZE + (col - 1) : -1,  // left
    col + 1 < GRID_SIZE ? row * GRID_SIZE + (col + 1) : -1, // right
  ]
  
  for (let i = 0; i < neighbors.length; i++) {
    const idx = neighbors[i]
    if (idx >= 0) {
      result[idx] = result[idx] ? 0 : 1
    }
  }
  
  return result
}

/**
 * Check if all lights are off (puzzle solved)
 */
export function isSolved(board: Uint8Array): bool {
  for (let i = 0; i < TOTAL_CELLS; i++) {
    if (board[i] != 0) {
      return false
    }
  }
  return true
}

/**
 * Count lights that are on
 */
export function countLightsOn(board: Uint8Array): i32 {
  let count: i32 = 0
  for (let i = 0; i < TOTAL_CELLS; i++) {
    if (board[i] != 0) {
      count++
    }
  }
  return count
}

/**
 * Get cell state (0 = off, 1 = on)
 */
export function getCell(board: Uint8Array, row: i32, col: i32): i32 {
  if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
    return -1 // invalid
  }
  return board[row * GRID_SIZE + col]
}

/**
 * Create a flat board array from 2D boolean array
 * Used for interop between JS and WASM
 */
export function boardFromArray(data: StaticArray<StaticArray<i32>>): Uint8Array {
  const result = new Uint8Array(TOTAL_CELLS)
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      result[row * GRID_SIZE + col] = data[row][col] ? 1 : 0
    }
  }
  return result
}

/**
 * Convert flat board to 2D array format for JS
 */
export function boardToArray(board: Uint8Array): StaticArray<StaticArray<i32>> {
  let result = new StaticArray<StaticArray<i32>>(GRID_SIZE)
  for (let row = 0; row < GRID_SIZE; row++) {
    let rowArray = new StaticArray<i32>(GRID_SIZE)
    for (let col = 0; col < GRID_SIZE; col++) {
      rowArray[col] = board[row * GRID_SIZE + col]
    }
    result[row] = rowArray
  }
  return result
}
