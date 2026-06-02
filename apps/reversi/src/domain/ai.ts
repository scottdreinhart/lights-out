/**
 * AI move selection — CPU player logic.
 * Pure functions: given a board state, return the best move.
 */

import { countPieces, otherPlayer } from './board'
import { CORNERS, HARD_DEPTH, MEDIUM_DEPTH } from './constants'
import { applyMove, canPlayerMove, evaluateGameResult, getValidMoves } from './rules'
import type { Board, Difficulty, Move, Player } from './types'

const cornerSet = new Set(CORNERS.map(([row, col]) => `${row}:${col}`))

function evaluateBoard(board: Board, perspective: Player): number {
  const counts = countPieces(board)
  const own = perspective === 'black' ? counts.black : counts.white
  const opp = perspective === 'black' ? counts.white : counts.black
  const pieceDelta = own - opp

  const ownMoves = getValidMoves(board, perspective).length
  const oppMoves = getValidMoves(board, otherPlayer(perspective)).length
  const mobility = ownMoves - oppMoves

  let ownCorners = 0
  let oppCorners = 0
  for (const [row, col] of CORNERS) {
    const key = `${row}:${col}`
    if (!cornerSet.has(key)) {
      continue
    }
    const cell = board[row * 8 + col]
    if (cell === perspective) {
      ownCorners++
    } else if (cell === otherPlayer(perspective)) {
      oppCorners++
    }
  }

  return pieceDelta + mobility * 3 + (ownCorners - oppCorners) * 25
}

function minimax(
  board: Board,
  turn: Player,
  perspective: Player,
  depth: number,
  alpha: number,
  beta: number,
): { score: number; move: Move | null } {
  const result = evaluateGameResult(board)
  if (depth === 0 || result.status !== 'playing') {
    if (result.status === 'win') {
      return {
        score: result.winner === perspective ? 10_000 : -10_000,
        move: null,
      }
    }
    if (result.status === 'draw') {
      return { score: 0, move: null }
    }
    return { score: evaluateBoard(board, perspective), move: null }
  }

  const moves = getValidMoves(board, turn)
  if (moves.length === 0) {
    if (!canPlayerMove(board, otherPlayer(turn))) {
      return { score: evaluateBoard(board, perspective), move: null }
    }
    return minimax(board, otherPlayer(turn), perspective, depth - 1, alpha, beta)
  }

  const maximizing = turn === perspective
  let bestMove: Move | null = null

  if (maximizing) {
    let bestScore = -Infinity
    for (const move of moves) {
      const next = applyMove(board, move, turn)
      const { score } = minimax(next, otherPlayer(turn), perspective, depth - 1, alpha, beta)
      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
      alpha = Math.max(alpha, score)
      if (beta <= alpha) {
        break
      }
    }
    return { score: bestScore, move: bestMove }
  }

  let bestScore = Infinity
  for (const move of moves) {
    const next = applyMove(board, move, turn)
    const { score } = minimax(next, otherPlayer(turn), perspective, depth - 1, alpha, beta)
    if (score < bestScore) {
      bestScore = score
      bestMove = move
    }
    beta = Math.min(beta, score)
    if (beta <= alpha) {
      break
    }
  }
  return { score: bestScore, move: bestMove }
}

function chooseMediumMove(board: Board, player: Player, moves: Move[]): Move {
  const corner = moves.find((move) => cornerSet.has(`${move.position.row}:${move.position.col}`))
  if (corner) {
    return corner
  }

  return moves.reduce((best, move) => {
    const next = applyMove(board, move, player)
    const score = evaluateBoard(next, player) + move.flipped.length * 2
    const bestScore =
      evaluateBoard(applyMove(board, best, player), player) + best.flipped.length * 2
    return score > bestScore ? move : best
  })
}

export function selectMove(board: Board, player: Player, difficulty: Difficulty): Move | null {
  const moves = getValidMoves(board, player)
  if (moves.length === 0) {
    return null
  }

  if (difficulty === 'easy') {
    return moves[Math.floor(Math.random() * moves.length)] ?? null
  }

  if (difficulty === 'medium') {
    return chooseMediumMove(board, player, moves)
  }

  const { move } = minimax(board, player, player, HARD_DEPTH, -Infinity, Infinity)
  if (move) {
    return move
  }

  const mediumFallback = minimax(board, player, player, MEDIUM_DEPTH, -Infinity, Infinity).move
  return mediumFallback ?? moves[0] ?? null
}
