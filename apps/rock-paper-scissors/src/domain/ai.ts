/**
 * AI move selection — CPU player logic.
 * Uses WASM for performance when available, falls back to pure JS.
 * Pure functions: given a board state, return the best move.
 */

import { selectCPUMoveWasm } from '@/wasm/ai-wasm'
import type { Move, Round } from './types'

/**
 * Adaptive AI strategy based on game history.
 * Implements counter-intuitive strategy and pattern recognition.
 * Pure JS fallback implementation.
 */
function selectCPUMoveFallback(rounds: Round[]): Move {
  const moves: Move[] = ['rock', 'paper', 'scissors']

  // Early game: play randomly
  if (rounds.length < 2) {
    return moves[Math.floor(Math.random() * moves.length)]
  }

  const lastRound = rounds[rounds.length - 1]
  const lastPlayerMove = lastRound.playerMove

  // If CPU won last round, tend to repeat (70% chance)
  if (lastRound.result === 'loss' && Math.random() < 0.7) {
    return lastRound.cpuMove
  }

  // If CPU lost, counter what the player might use
  // Players tend to switch to the move that beats what we just played
  const countermove: Record<Move, Move> = {
    rock: 'paper', // Paper beats rock
    paper: 'scissors', // Scissors beats paper
    scissors: 'rock', // Rock beats scissors
  }

  // 60% chance to counter the opponent's last move
  if (Math.random() < 0.6) {
    return countermove[lastPlayerMove]
  }

  // Otherwise play randomly to avoid being predictable
  return moves[Math.floor(Math.random() * moves.length)]
}

/**
 * Select CPU move using WASM if available, falls back to pure JS.
 * This hybrid approach ensures the game works everywhere while
 * getting performance boost when WASM is available.
 */
export function selectCPUMove(rounds: Round[]): Move {
  const seed = Math.floor(Math.random() * 0x7fffffff)

  // Try WASM first
  try {
    const wasmResult = selectCPUMoveWasm(
      rounds.map((r) => ({
        playerMove: r.playerMove,
        cpuMove: r.cpuMove,
        result: r.result,
      })),
      seed,
    )

    if (wasmResult !== null) {
      const moveNames: Array<'rock' | 'paper' | 'scissors'> = ['rock', 'paper', 'scissors']
      return moveNames[wasmResult]
    }
  } catch (err) {
    // WASM failed, fall through to JS
    console.debug('WASM AI failed, using JS fallback')
  }

  // Fall back to pure JavaScript
  return selectCPUMoveFallback(rounds)
}
