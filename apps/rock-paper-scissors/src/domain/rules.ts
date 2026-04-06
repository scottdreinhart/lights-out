/**
 * Game rules — win/loss/draw detection.
 * Uses WASM for performance when available, falls back to pure JS.
 */

import { rockPaperScissorsWasm } from '@/infrastructure'
import type { Move, RoundResult } from './types'

/**
 * Determine the result of a single round.
 * Rules:
 * - Rock crushes Scissors
 * - Scissors cuts Paper
 * - Paper covers Rock
 * Uses WASM if available for better performance.
 */
export async function determineRoundWinner(playerMove: Move, cpuMove: Move): Promise<RoundResult> {
  // Try WASM first
  const moveMap: Record<Move, number> = { rock: 0, paper: 1, scissors: 2 }
  const resultMap = ['draw' as RoundResult, 'win' as RoundResult, 'loss' as RoundResult]

  const wasmResult = await rockPaperScissorsWasm.getRoundWinner(moveMap[playerMove], moveMap[cpuMove])
  if (wasmResult !== null && wasmResult >= 0 && wasmResult < 3) {
    return resultMap[wasmResult]
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
export async function isGameOver(playerScore: number, cpuScore: number, bestOf: number): Promise<boolean> {
  // Try WASM first
  const wasmResult = await rockPaperScissorsWasm.isGameOver([playerScore, cpuScore], bestOf)
  if (wasmResult !== null) {
    return wasmResult
  }

  // JS fallback
  const winsNeeded = Math.floor(bestOf / 2) + 1
  return playerScore >= winsNeeded || cpuScore >= winsNeeded
}

/**
 * Determine the overall game winner.
 * Uses WASM if available for better performance.
 */
export async function determineGameWinner(
  playerScore: number,
  cpuScore: number,
  bestOf: number,
): Promise<'player' | 'cpu' | null> {
  // Try WASM first
  const wasmResult = await rockPaperScissorsWasm.isGameOver([playerScore, cpuScore], bestOf)
  if (wasmResult !== null) {
    if (playerScore > cpuScore) return 'player'
    if (cpuScore > playerScore) return 'cpu'
    return null // This shouldn't happen if game is over
  }

  // JS fallback
  const winsNeeded = Math.floor(bestOf / 2) + 1
  if (playerScore >= winsNeeded) return 'player'
  if (cpuScore >= winsNeeded) return 'cpu'
  return null
}
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
