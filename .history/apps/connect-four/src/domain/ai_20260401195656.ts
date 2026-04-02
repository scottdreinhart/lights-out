/**
 * AI move selection — CPU player logic.
 * Pure functions: given a board state, return the best move.
 *
 * Uses @games/ai-framework for minimax + alpha-beta pruning.
 * Game-specific logic (window evaluation, move ordering) remains here.
 * Difficulty modes handled via depth parameter.
 *
 * Move representation: column index (0-6)
 */

import { minimax } from '@games/ai-framework'
import type { GameAI } from '@games/ai-framework'
import { dropDisc, getCell, getPlayableColumns, otherPlayer } from './board'
import { AI_DEPTH, COLS, ROWS, WIN_LENGTH } from './constants'
import { checkWinAt, isBoardFull } from './rules'
import type { Board, Difficulty, Player } from './types'

/** Scoring constants for the evaluation function */
const SCORE_WIN = 1_000_000
const SCORE_THREE = 50
const SCORE_TWO = 10
const SCORE_CENTER = 3

/** Evaluate a window of `WIN_LENGTH` cells for a given player. */
function evaluateWindow(window: number[], player: Player): number {
  const opponent = otherPlayer(player)
  const playerCount = window.filter((c) => c === player).length
  const opponentCount = window.filter((c) => c === opponent).length
  const emptyCount = window.filter((c) => c === 0).length

  if (playerCount === 4) {
    return SCORE_WIN
  }
  if (opponentCount === 4) {
    return -SCORE_WIN
  }
  if (playerCount === 3 && emptyCount === 1) {
    return SCORE_THREE
  }
  if (opponentCount === 3 && emptyCount === 1) {
    return -SCORE_THREE
  }
  if (playerCount === 2 && emptyCount === 2) {
    return SCORE_TWO
  }
  if (opponentCount === 2 && emptyCount === 2) {
    return -SCORE_TWO
  }
  return 0
}

/** Heuristic board evaluation for minimax. */
function evaluateBoard(board: Board, player: Player): number {
  let score = 0

  // Center column preference
  const centerCol = Math.floor(COLS / 2)
  for (let row = 0; row < ROWS; row++) {
    if (getCell(board, centerCol, row) === player) {
      score += SCORE_CENTER
    }
  }

  // Horizontal windows
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      const window: number[] = []
      for (let i = 0; i < WIN_LENGTH; i++) {
        window.push(getCell(board, col + i, row))
      }
      score += evaluateWindow(window, player)
    }
  }

  // Vertical windows
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
      const window: number[] = []
      for (let i = 0; i < WIN_LENGTH; i++) {
        window.push(getCell(board, col, row + i))
      }
      score += evaluateWindow(window, player)
    }
  }

  // Diagonal ↗ windows
  for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
    for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
      const window: number[] = []
      for (let i = 0; i < WIN_LENGTH; i++) {
        window.push(getCell(board, col + i, row + i))
      }
      score += evaluateWindow(window, player)
    }
  }

  // Diagonal ↘ windows
  for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
    for (let row = WIN_LENGTH - 1; row < ROWS; row++) {
      const window: number[] = []
      for (let i = 0; i < WIN_LENGTH; i++) {
        window.push(getCell(board, col + i, row - i))
      }
      score += evaluateWindow(window, player)
    }
  }

  return score
}

/** Check if a move results in an immediate win. */
function isWinningMove(board: Board, col: number, player: Player): boolean {
  const result = dropDisc(board, col, player)
  if (!result) {
    return false
  }
  const [newBoard, row] = result
  return checkWinAt(newBoard, col, row, player) !== null
}

/**
 * Minimax with alpha-beta pruning — handled by @games/ai-framework
 * This class adapts Connect-Four to the GameAI interface
 */
class ConnectFourAI implements GameAI<Board, number, Player> {
  private aiPlayer: Player

  constructor(aiPlayer: Player) {
    this.aiPlayer = aiPlayer
  }

  evaluateBoard(board: Board, _player: Player): number {
    return evaluateBoard(board, this.aiPlayer)
  }

  getLegalMoves(board: Board, _player: Player): number[] {
    const playable = getPlayableColumns(board)
    // Order columns for better pruning effectiveness
    const center = Math.floor(COLS / 2)
    return [...playable].sort((a, b) => Math.abs(a - center) - Math.abs(b - center))
  }

  applyMove(board: Board, col: number): Board {
    const result = dropDisc(board, col, this.aiPlayer)
    if (!result) {
      throw new Error(`Cannot drop disc in column ${col}`)
    }
    const [newBoard] = result
    return newBoard
  }

  getWinner(board: Board): Player | null {
    // Check all positions for a win
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const cell = getCell(board, col, row)
        if (cell !== 0) {
          if ((checkWinAt(board, col, row, cell as Player)) !== null) {
            return cell as Player
          }
        }
      }
    }
    return null
  }

  getOpponent(player: Player): Player {
    return otherPlayer(player)
  }
}

/**
 * Select the best move for the AI player.
 * Returns a column index.
 * Difficulty handled via depth parameter to minimax.
 */
export function selectMove(board: Board, player: Player, difficulty: Difficulty): number {
  const playable = getPlayableColumns(board)
  if (playable.length === 0) {
    return -1
  }

  // Easy: random move (with chance to block obvious wins)
  if (difficulty === 'easy') {
    // Still block immediate opponent wins 50% of the time
    const opponent = otherPlayer(player)
    for (const col of playable) {
      if (isWinningMove(board, col, opponent) && Math.random() < 0.5) {
        return col
      }
    }
    // Take immediate wins always
    for (const col of playable) {
      if (isWinningMove(board, col, player)) {
        return col
      }
    }
    // playable is guaranteed non-empty (checked at function entry)
    return playable[Math.floor(Math.random() * playable.length)] as number
  }

  const depth = AI_DEPTH[difficulty] ?? 4
  const ordered = playable.slice().sort((a, b) => Math.abs(a - Math.floor(COLS / 2)) - Math.abs(b - Math.floor(COLS / 2)))

  // Check for immediate winning move
  for (const col of ordered) {
    if (isWinningMove(board, col, player)) {
      return col
    }
  }

  // Check for immediate opponent threat
  const opponent = otherPlayer(player)
  for (const col of ordered) {
    if (isWinningMove(board, col, opponent)) {
      return col
    }
  }

  // Use minimax from framework
  const game = new ConnectFourAI(player)
  const result = minimax(board, player, depth, game, {
    alphaBetaPruning: true,
    moveOrdering: true,
  })

  return result.move ?? (ordered[0] as number)
}
