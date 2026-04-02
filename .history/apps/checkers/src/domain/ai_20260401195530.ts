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

const minimax = (
  board: Board,
  currentPlayer: Player,
  perspective: Player,
  depth: number,
  alpha: number,
  beta: number,
): number => {
  const winner = getWinner(board)
  if (winner === perspective) {
    return 100_000 + depth
  }

  if (winner && winner !== perspective) {
    return -100_000 - depth
  }

  if (depth === 0) {
    return evaluateBoard(board, perspective)
  }

  const moves = getLegalMoves(board, currentPlayer).sort(
    (left, right) => scoreMoveOrder(right) - scoreMoveOrder(left),
  )
  if (moves.length === 0) {
    return currentPlayer === perspective ? -100_000 - depth : 100_000 + depth
  }

  if (currentPlayer === perspective) {
    let bestScore = Number.NEGATIVE_INFINITY

    for (const move of moves) {
      const result = applyMove(board, move)
      const score = minimax(
        result.board,
        getOpponent(currentPlayer),
        perspective,
        depth - 1,
        alpha,
        beta,
      )
      bestScore = Math.max(bestScore, score)
      alpha = Math.max(alpha, score)
      if (beta <= alpha) {
        break
      }
    }

    return bestScore
  }

  let bestScore = Number.POSITIVE_INFINITY

  for (const move of moves) {
    const result = applyMove(board, move)
    const score = minimax(
      result.board,
      getOpponent(currentPlayer),
      perspective,
      depth - 1,
      alpha,
      beta,
    )
    bestScore = Math.min(bestScore, score)
    beta = Math.min(beta, score)
    if (beta <= alpha) {
      break
    }
  }

  return bestScore
}

export const chooseBestMove = (board: Board, player: Player): Move | null => {
  const moves = getLegalMoves(board, player)
  if (moves.length === 0) {
    return null
  }

  const searchDepth = countPieces(board, 'red') + countPieces(board, 'black') <= 10 ? 6 : 4

  let bestMove = moves[0]
  let bestScore = Number.NEGATIVE_INFINITY

  for (const move of moves.sort((left, right) => scoreMoveOrder(right) - scoreMoveOrder(left))) {
    const result = applyMove(board, move)
    const score = minimax(
      result.board,
      getOpponent(player),
      player,
      searchDepth - 1,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
    )

    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}

export const computeAiMove = chooseBestMove
