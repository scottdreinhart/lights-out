/**
 * Board operations — pure functions for creating and manipulating game state.
 * No React, no DOM — purely functional transformations.
 */

import { BOARD_SIZE, TOTAL_CELLS } from './constants'
import type { Board, Cell, Player, Position } from './types'

const toIndex = (row: number, col: number): number => row * BOARD_SIZE + col

export function isOnBoard(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
}

export function createBoard(): Board {
  return new Array<Cell>(TOTAL_CELLS).fill(null)
}

export function getCell(board: Board, row: number, col: number): Cell {
  if (!isOnBoard(row, col)) {
    return null
  }
  return board[toIndex(row, col)] ?? null
}

export function setCell(board: Board, row: number, col: number, value: Cell): Board {
  if (!isOnBoard(row, col)) {
    return board
  }
  const next = [...board]
  next[toIndex(row, col)] = value
  return next
}

export function createInitialBoard(): Board {
  const board = createBoard()
  const mid = BOARD_SIZE / 2
  let next = setCell(board, mid - 1, mid - 1, 'white')
  next = setCell(next, mid, mid, 'white')
  next = setCell(next, mid - 1, mid, 'black')
  next = setCell(next, mid, mid - 1, 'black')
  return next
}

export function countPieces(board: Board): { black: number; white: number; empty: number } {
  let black = 0
  let white = 0
  let empty = 0
  for (const cell of board) {
    if (cell === 'black') {
      black++
    } else if (cell === 'white') {
      white++
    } else {
      empty++
    }
  }
  return { black, white, empty }
}

export function otherPlayer(player: Player): Player {
  return player === 'black' ? 'white' : 'black'
}

export function positionsEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col
}
