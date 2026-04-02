/**
 * AI move selection — CPU player logic.
 * Pure functions: given a board state, return the best move.
 *
 * Uses @games/ai-framework for minimax + alpha-beta pruning.
 * Game-specific logic (move ordering, evaluation) remains here.
 *
 * Complexity decision:
 * - computeAiMove keeps a synchronous path for simple positions and fallback safety.
 * - The app layer can route computeAiMoveAsync through a worker so the UI remains responsive.
 */

import { minimax } from '@games/ai-framework'
import type { GameAI } from '@games/ai-framework'
import { countKings, countPieces, getOpponent } from './board'
import { applyMove, getLegalMoves, getWinner } from './rules'
import type { Board, Move, Player } from './types'

const CENTER_ROWS = new Set([2, 3, 4, 5])
const CENTER_COLS = new Set([2, 3, 4, 5])

const evaluateBoard = (board: Board, player: Player): number => {
  const opponent = getOpponent(player)
  const ownPieces = countPieces(board, player)
  const opponentPieces = countPieces(board, opponent)
  const ownKings = countKings(board, player)
  const opponentKings = countKings(board, opponent)
  const ownMoves = getLegalMoves(board, player).length
  const opponentMoves = getLegalMoves(board, opponent).length

  let centerScore = 0
  let advancementScore = 0

  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const piece = board[row][col]
      if (!piece) {
        continue
      }

      const direction = piece.player === 'red' ? 7 - row : row
      const positionalValue = CENTER_ROWS.has(row) && CENTER_COLS.has(col) ? 1 : 0

      if (piece.player === player) {
        centerScore += positionalValue
        advancementScore += piece.isKing ? 0 : direction * 0.35
      } else {
        centerScore -= positionalValue
        advancementScore -= piece.isKing ? 0 : direction * 0.35
      }
    }
  }

  return (
    (ownPieces - opponentPieces) * 100 +
    (ownKings - opponentKings) * 65 +
    (ownMoves - opponentMoves) * 7 +
    centerScore * 8 +
    advancementScore
  )
}

const scoreMoveOrder = (move: Move): number =>
  move.captures.length * 50 + (move.becomesKing ? 25 : 0)

/**
 * CheckersAI adapter for @games/ai-framework
 * Implements GameAI interface and provides game-specific logic
 */
class CheckersAI implements GameAI<Board, Move, Player> {
  evaluateBoard(board: Board, player: Player): number {
    return evaluateBoard(board, player)
  }

  getLegalMoves(board: Board, player: Player): Move[] {
    return getLegalMoves(board, player).sort(
      (left, right) => scoreMoveOrder(right) - scoreMoveOrder(left),
    )
  }

  applyMove(board: Board, move: Move): Board {
    const result = applyMove(board, move)
    return result.board
  }

  getWinner(board: Board): Player | null {
    return getWinner(board)
  }

  getOpponent(player: Player): Player {
    return getOpponent(player)
  }
}

export const chooseBestMove = (board: Board, player: Player): Move | null => {
  const moves = getLegalMoves(board, player)
  if (moves.length === 0) {
    return null
  }

  const game = new CheckersAI()
  // Adaptive depth: more pieces remaining = shallower search (endgame deeper)
  const searchDepth = countPieces(board, 'red') + countPieces(board, 'black') <= 10 ? 6 : 4

  const result = minimax(board, player, searchDepth, game, {
    alphaBetaPruning: true,
    moveOrdering: true,
  })

  return result.move ?? moves[0]
}

export const computeAiMove = chooseBestMove
