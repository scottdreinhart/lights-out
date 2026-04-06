import type { GameAI } from '@games/ai-framework'
import { minimax } from '@games/ai-framework'
import { getEmptyCells } from './board.ts'
import { getWinnerToken } from './rules.ts'
import type { Board, Token } from './types.ts'

export const chooseCpuMoveRandom = (board: Board): number => {
  const empty = getEmptyCells(board)
  if (empty.length === 0) {
    throw new Error('No empty cells available for CPU move')
  }
  const randomIdx = Math.floor(Math.random() * empty.length)
  const move = empty[randomIdx]
  if (move === undefined) {
    throw new Error('Index out of bounds')
  }
  return move
}

const findWinningMove = (board: Board, token: Token): number | null => {
  const empty = getEmptyCells(board)
  for (const idx of empty) {
    const testBoard = [...board]
    testBoard[idx] = token
    if (getWinnerToken(testBoard) === token) {
      return idx
    }
  }
  return null
}

export const chooseCpuMoveSmart = (board: Board, cpuToken: Token, humanToken: Token): number => {
  const empty = getEmptyCells(board)
  if (empty.length === 0) {
    throw new Error('No empty cells available for CPU move')
  }

  const winMove = findWinningMove(board, cpuToken)
  if (winMove !== null) {
    return winMove
  }

  const blockMove = findWinningMove(board, humanToken)
  if (blockMove !== null) {
    return blockMove
  }

  if (empty.includes(4)) {
    return 4
  }

  const corners = [0, 2, 6, 8]
  const availableCorner = corners.find((idx) => empty.includes(idx))
  if (availableCorner !== undefined) {
    return availableCorner
  }

  const firstEmpty = empty[0]
  if (firstEmpty === undefined) {
    throw new Error('No empty cells')
  }
  return firstEmpty
}

export const chooseCpuMoveMedium = (board: Board, cpuToken: Token, humanToken: Token): number => {
  const empty = getEmptyCells(board)
  if (empty.length === 0) {
    throw new Error('No empty cells available for CPU move')
  }

  const winMove = findWinningMove(board, cpuToken)
  if (winMove !== null) {
    return winMove
  }

  const blockMove = findWinningMove(board, humanToken)
  if (blockMove !== null) {
    return blockMove
  }

  const randomIdx = Math.floor(Math.random() * empty.length)
  const move = empty[randomIdx]
  if (move === undefined) {
    throw new Error('Index out of bounds')
  }
  return move
}

/**
 * Hard difficulty: use minimax from @games/ai-framework
 * Implements GameAI interface for tic-tac-toe and delegates to framework
 */
class TicTacToeMinimaxAI implements GameAI<Board, number, Token> {
  private cpuToken: Token
  private humanToken: Token

  constructor(cpuToken: Token, humanToken: Token) {
    this.cpuToken = cpuToken
    this.humanToken = humanToken
  }

  evaluateBoard(board: Board, _player: Token): number {
    const winner = getWinnerToken(board)
    if (winner === this.cpuToken) {
      return 10
    }
    if (winner === this.humanToken) {
      return -10
    }
    return 0
  }

  getLegalMoves(board: Board, _player: Token): number[] {
    return getEmptyCells(board)
  }

  applyMove(board: Board, move: number): Board {
    const newBoard = [...board]
    newBoard[move] = this.cpuToken
    return newBoard
  }

  getWinner(board: Board): Token | null {
    return getWinnerToken(board)
  }

  getOpponent(player: Token): Token {
    return player === 'X' ? 'O' : 'X'
  }
}

export const chooseCpuMoveUnbeatable = (
  board: Board,
  cpuToken: Token,
  humanToken: Token,
): number => {
  const game = new TicTacToeMinimaxAI(cpuToken, humanToken)
  // Depth 9 guarantees exhaustive search on 3x3 board (max ~4500 nodes)
  const result = minimax(board, cpuToken, 9, game)
  if (result.move === undefined) {
    // Fallback to smart heuristic if minimax fails
    return chooseCpuMoveSmart(board, cpuToken, humanToken)
  }
  return result.move as number
}
