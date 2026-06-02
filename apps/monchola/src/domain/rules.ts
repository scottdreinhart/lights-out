/**
 * Monchola — Domain Rules
 * Win/loss/draw detection and game state queries.
 * Pure functions operating on domain types only.
 */

import { getEmptyCells } from './board'
import type { GameState, MoncholaBoard, Player } from './types'

/**
 * Check if the board is completely filled.
 */
export function isBoardFull(board: MoncholaBoard): boolean {
  return board.cells.every((c) => c !== 0)
}

/**
 * Determine the winner when the board is full.
 * The player with the most claimed cells wins.
 */
export function getWinner(state: GameState): Player | 'draw' | null {
  if (!isBoardFull(state.board)) {
    return null
  }

  if (state.humanScore > state.cpuScore) {
    return 'human'
  }
  if (state.cpuScore > state.humanScore) {
    return 'cpu'
  }
  return 'draw'
}

/**
 * Check if the game is over.
 */
export function isGameOver(state: GameState): boolean {
  return state.phase === 'game-over' || isBoardFull(state.board)
}

/**
 * Pick a random CPU move (basic AI).
 */
export function selectCpuMove(state: GameState): number | null {
  const empty = getEmptyCells(state.board)
  if (empty.length === 0) {
    return null
  }
  return empty[Math.floor(Math.random() * empty.length)]
}

/**
 * Return the lead margin (positive = human leading, negative = cpu leading).
 */
export function getLeadMargin(state: GameState): number {
  return state.humanScore - state.cpuScore
}
