import { BOARD_SIZE } from './constants.ts'
import type { Board, CellValue } from './types.ts'

export const createEmptyBoard = (): Board => Array(BOARD_SIZE * BOARD_SIZE).fill(null)

export const isCellEmpty = (board: Board, idx: number): boolean => {
  if (idx < 0 || idx >= board.length) {
    return false
  }
  return board[idx] === null
}

export const applyMove = (board: Board, idx: number, token: CellValue): Board => {
  if (!isCellEmpty(board, idx)) {
    throw new Error(`Cell ${idx} is not empty`)
  }
  const newBoard = [...board]
  newBoard[idx] = token
  return newBoard
}

export const getEmptyCells = (board: Board): number[] => {
  return board
    .map((cell, idx) => (cell === null ? idx : null))
    .filter((idx): idx is number => idx !== null)
}
