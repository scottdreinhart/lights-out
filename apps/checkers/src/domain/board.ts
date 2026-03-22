/**
 * Board operations — pure functions for creating and manipulating game state.
 * No React, no DOM — purely functional transformations.
 */

import { BOARD_SIZE } from './constants'
import type { Board, Piece, Player, Position } from './types'

export const createEmptyBoard = (): Board =>
  Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => null))

export const isInsideBoard = (row: number, col: number): boolean =>
  row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE

export const isPlayableSquare = (row: number, col: number): boolean =>
  isInsideBoard(row, col) && (row + col) % 2 === 1

export const cloneBoard = (board: Board): Board => board.map((row) => row.map((cell) => cell))

export const positionsEqual = (left: Position, right: Position): boolean =>
  left.row === right.row && left.col === right.col

export const positionKey = ({ row, col }: Position): string => `${row}:${col}`

export const positionToNotation = ({ row, col }: Position): string =>
  `${String.fromCharCode(97 + col)}${BOARD_SIZE - row}`

export const getPieceAt = (board: Board, position: Position): Piece | null =>
  board[position.row]?.[position.col] ?? null

export const getOpponent = (player: Player): Player => (player === 'red' ? 'black' : 'red')

export const isPromotionRow = (player: Player, row: number): boolean =>
  (player === 'red' && row === 0) || (player === 'black' && row === BOARD_SIZE - 1)

export const createInitialBoard = (): Board => {
  const board = createEmptyBoard()

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (!isPlayableSquare(row, col)) {
        continue
      }

      if (row < 3) {
        board[row][col] = { player: 'black', isKing: false }
      } else if (row > 4) {
        board[row][col] = { player: 'red', isKing: false }
      }
    }
  }

  return board
}

export const countPieces = (board: Board, player: Player): number => {
  let total = 0

  for (const row of board) {
    for (const piece of row) {
      if (piece?.player === player) {
        total += 1
      }
    }
  }

  return total
}

export const countKings = (board: Board, player: Player): number => {
  let total = 0

  for (const row of board) {
    for (const piece of row) {
      if (piece?.player === player && piece.isKing) {
        total += 1
      }
    }
  }

  return total
}
