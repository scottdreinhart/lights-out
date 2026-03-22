/**
 * AI move selection — CPU player logic.
 * Pure functions: given a board bitmask and dice sum, return the best move.
 *
 * This module provides the JS fallback. The WASM engine in `assembly/index.ts`
 * mirrors these algorithms. The Web Worker tries WASM first, falling back here.
 */

import { calculateScore, getValidMoves } from './board'
import type { BoardState, Tile } from './types'

// ── Bitmask helpers (shared encoding with WASM) ───────────────────────────

/** Convert a BoardState to a 9-bit bitmask (bit 0 = tile 1, ..., bit 8 = tile 9). */
export function boardToBitmask(board: BoardState): number {
  let mask = 0
  for (let i = 0; i < 9; i++) {
    if (board.tiles[(i + 1) as Tile]) {
      mask |= 1 << i
    }
  }
  return mask
}

/** Convert a bitmask back to an array of Tile values. */
export function bitmaskToTiles(mask: number): Tile[] {
  const tiles: Tile[] = []
  for (let i = 0; i < 9; i++) {
    if ((mask >> i) & 1) {
      tiles.push((i + 1) as Tile)
    }
  }
  return tiles
}

// ── JS fallback AI ───────────────────────────────────────────────────────

/**
 * Pick the best move from all valid combinations for the given dice sum.
 *
 * Strategy: choose the move that leaves the lowest remaining score.
 * Tie-break: prefer fewer tiles (keeps more flexibility for future rolls).
 */
export function getBestMove(board: BoardState, diceSum: number): Tile[] | null {
  const moves = getValidMoves(board, diceSum)
  if (moves.length === 0) {
    return null
  }

  let bestMove = moves[0]
  let bestRemainingScore = Infinity
  let bestTileCount = Infinity

  for (const move of moves) {
    const closedSum = move.reduce((a, t) => a + t, 0)
    const remainingScore = calculateScore(board) - closedSum
    const tileCount = move.length

    if (
      remainingScore < bestRemainingScore ||
      (remainingScore === bestRemainingScore && tileCount < bestTileCount)
    ) {
      bestMove = move
      bestRemainingScore = remainingScore
      bestTileCount = tileCount
    }
  }

  return bestMove
}
