/**
 * Game rules — win/loss/draw detection.
 * Uses WASM for performance when available, falls back to pure JS.
 */

import { determineGameWinnerWasm, getRoundWinnerWasm, isGameOverWasm } from '@/wasm/ai-wasm'
import type { Move, RoundResult } from './types'

/**
 * Determine the result of a single round.
 * Rules:
 * - Rock crushes Scissors
 * - Scissors cuts Paper
 * - Paper covers Rock
 * Uses WASM if available for better performance.
 */
export function determineRoundWinner(playerMove: Move, cpuMove: Move): RoundResult {
  // Try WASM first
  try {
    const moveMap: Record<Move, number> = { rock: 0, paper: 1, scissors: 2 }
    const resultMap = ['draw' as RoundResult, 'win' as RoundResult, 'loss' as RoundResult]

    const wasmResult = getRoundWinnerWasm(moveMap[playerMove], moveMap[cpuMove])
    if (wasmResult !== null && wasmResult >= 0 && wasmResult < 3) {
      return resultMap[wasmResult]
    }
  } catch (err) {
    console.debug('WASM rule calculation failed, using JS fallback')
  }

  // JS fallback
  if (playerMove === cpuMove) {
    return 'draw'
  }

  if (
    (playerMove === 'rock' && cpuMove === 'scissors') ||
    (playerMove === 'scissors' && cpuMove === 'paper') ||
    (playerMove === 'paper' && cpuMove === 'rock')
  ) {
    return 'win'
  }

  return 'loss'
}

/**
 * Check if game is over based on best-of-N format.
 * A player needs to win > (bestOf / 2) rounds.
 * Uses WASM if available for better performance.
 */
export function isGameOver(playerScore: number, cpuScore: number, bestOf: number): boolean {
  // Try WASM first
  try {
    const wasmResult = isGameOverWasm(playerScore, cpuScore, bestOf)
    if (wasmResult !== null) {
      return wasmResult
    }
  } catch (err) {
    console.debug('WASM game-over check failed, using JS fallback')
  }

  // JS fallback
  const winsNeeded = Math.floor(bestOf / 2) + 1
  return playerScore >= winsNeeded || cpuScore >= winsNeeded
}

/**
 * Determine the overall game winner.
 * Uses WASM if available for better performance.
 */
export function determineGameWinner(
  playerScore: number,
  cpuScore: number,
  bestOf: number,
): 'player' | 'cpu' | null {
  // Try WASM first
  try {
    const wasmResult = determineGameWinnerWasm(playerScore, cpuScore, bestOf)
    if (wasmResult !== null) {
      return wasmResult
    }
  } catch (err) {
    console.debug('WASM game-winner determination failed, using JS fallback')
  }

  // JS fallback
  if (!isGameOver(playerScore, cpuScore, bestOf)) {
    return null
  }

  if (playerScore > cpuScore) {
    return 'player'
  }

  return 'cpu'
}
