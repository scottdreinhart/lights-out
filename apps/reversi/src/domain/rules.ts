/**
 * Game rules — win/loss/draw detection.
 * Pure functions operating on domain types only.
 */

import { countPieces, getCell, isOnBoard, otherPlayer, setCell } from './board'
import { BOARD_SIZE, DIRECTIONS } from './constants'
import type { Board, GameResult, Move, Player, Position } from './types'

export function getFlippedPieces(board: Board, position: Position, player: Player): Position[] {
  if (
    !isOnBoard(position.row, position.col) ||
    getCell(board, position.row, position.col) !== null
  ) {
    return []
  }

  const opponent = otherPlayer(player)
  const flipped: Position[] = []

  for (const [dRow, dCol] of DIRECTIONS) {
    const line: Position[] = []
    let row = position.row + dRow
    let col = position.col + dCol

    while (isOnBoard(row, col)) {
      const cell = getCell(board, row, col)
      if (cell === opponent) {
        line.push({ row, col })
        row += dRow
        col += dCol
        continue
      }

      if (cell === player && line.length > 0) {
        flipped.push(...line)
      }
      break
    }
  }

  return flipped
}

export function isValidMove(board: Board, position: Position, player: Player): boolean {
  return getFlippedPieces(board, position, player).length > 0
}

export function getValidMoves(board: Board, player: Player): Move[] {
  const moves: Move[] = []
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const position = { row, col }
      const flipped = getFlippedPieces(board, position, player)
      if (flipped.length > 0) {
        moves.push({ position, flipped })
      }
    }
  }
  return moves
}

export function applyMove(board: Board, move: Move, player: Player): Board {
  let next = setCell(board, move.position.row, move.position.col, player)
  for (const flipped of move.flipped) {
    next = setCell(next, flipped.row, flipped.col, player)
  }
  return next
}

export function canPlayerMove(board: Board, player: Player): boolean {
  return getValidMoves(board, player).length > 0
}

export function isBoardFull(board: Board): boolean {
  return countPieces(board).empty === 0
}

export function evaluateGameResult(board: Board): GameResult {
  const counts = countPieces(board)
  const blackCanMove = canPlayerMove(board, 'black')
  const whiteCanMove = canPlayerMove(board, 'white')

  if (!isBoardFull(board) && (blackCanMove || whiteCanMove)) {
    return { status: 'playing' }
  }

  if (counts.black === counts.white) {
    return {
      status: 'draw',
      black: counts.black,
      white: counts.white,
    }
  }

  return {
    status: 'win',
    winner: counts.black > counts.white ? 'black' : 'white',
    black: counts.black,
    white: counts.white,
  }
}
