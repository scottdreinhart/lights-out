/**
 * Game rules — win/loss/draw detection.
 * Pure functions operating on domain types only.
 */

import { Board } from './types'

/**
 * Check if puzzle is solved (all lights off)
 */
export function checkWin(board: Board): boolean {
  return board.every((row) => row.every((light) => !light))
}

/**
 * Calculate optimal solution hint (informational)
 */
export function getMoveCount(board: Board): number {
  // Count number of lights currently on
  const lightsOn = board.reduce((count, row) => count + row.filter((light) => light).length, 0)
  // Very rough heuristic estimate
  return Math.ceil(lightsOn / 2)
}
