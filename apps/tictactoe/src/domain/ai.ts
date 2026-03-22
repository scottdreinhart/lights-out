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

export const chooseCpuMoveUnbeatable = (
  _board: Board,
  _cpuToken: Token,
  _humanToken: Token,
): number => {
  throw new Error('chooseCpuMoveUnbeatable runs via WASM in aiEngine.ts, not in domain layer')
}
