/**
 * Game rules — win/loss/draw detection.
 * Pure functions operating on domain types only.
 */

import {
  cloneBoard,
  getPieceAt,
  isInsideBoard,
  isPromotionRow,
  positionKey,
  positionToNotation,
} from './board'
import type { Board, Move, MoveResult, Piece, Player, Position, Winner } from './types'

const RED_DIRECTIONS: readonly Position[] = [
  { row: -1, col: -1 },
  { row: -1, col: 1 },
]

const BLACK_DIRECTIONS: readonly Position[] = [
  { row: 1, col: -1 },
  { row: 1, col: 1 },
]

const KING_DIRECTIONS: readonly Position[] = [...RED_DIRECTIONS, ...BLACK_DIRECTIONS]

const getDirectionsForPiece = (piece: Piece): readonly Position[] => {
  if (piece.isKing) {
    return KING_DIRECTIONS
  }

  return piece.player === 'red' ? RED_DIRECTIONS : BLACK_DIRECTIONS
}

const getAllPlayerPositions = (board: Board, player: Player): Position[] => {
  const positions: Position[] = []

  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      if (board[row][col]?.player === player) {
        positions.push({ row, col })
      }
    }
  }

  return positions
}

const exploreCaptureMoves = (
  board: Board,
  start: Position,
  current: Position,
  piece: Piece,
  path: Position[],
  captures: Position[],
  becameKing: boolean,
): Move[] => {
  const moves: Move[] = []

  for (const direction of getDirectionsForPiece(piece)) {
    const jumped = { row: current.row + direction.row, col: current.col + direction.col }
    const landing = { row: current.row + direction.row * 2, col: current.col + direction.col * 2 }

    if (!isInsideBoard(jumped.row, jumped.col) || !isInsideBoard(landing.row, landing.col)) {
      continue
    }

    const jumpedPiece = board[jumped.row][jumped.col]
    const landingPiece = board[landing.row][landing.col]

    if (!jumpedPiece || jumpedPiece.player === piece.player || landingPiece) {
      continue
    }

    const nextBoard = cloneBoard(board)
    nextBoard[current.row][current.col] = null
    nextBoard[jumped.row][jumped.col] = null

    const nextPiece: Piece = { ...piece }
    const promoted = !nextPiece.isKing && isPromotionRow(nextPiece.player, landing.row)
    if (promoted) {
      nextPiece.isKing = true
    }

    nextBoard[landing.row][landing.col] = nextPiece

    const nextMoves = exploreCaptureMoves(
      nextBoard,
      start,
      landing,
      nextPiece,
      [...path, landing],
      [...captures, jumped],
      becameKing || promoted,
    )

    if (nextMoves.length > 0) {
      moves.push(...nextMoves)
      continue
    }

    moves.push({
      from: start,
      to: landing,
      path: [...path, landing],
      captures: [...captures, jumped],
      becomesKing: becameKing || promoted,
    })
  }

  return moves
}

const getSimpleMovesForPiece = (board: Board, position: Position, piece: Piece): Move[] => {
  const moves: Move[] = []

  for (const direction of getDirectionsForPiece(piece)) {
    const destination = { row: position.row + direction.row, col: position.col + direction.col }

    if (
      !isInsideBoard(destination.row, destination.col) ||
      board[destination.row][destination.col]
    ) {
      continue
    }

    moves.push({
      from: position,
      to: destination,
      path: [position, destination],
      captures: [],
      becomesKing: !piece.isKing && isPromotionRow(piece.player, destination.row),
    })
  }

  return moves
}

export const getLegalMoves = (board: Board, player: Player): Move[] => {
  const positions = getAllPlayerPositions(board, player)
  const captureMoves = positions.flatMap((position) => {
    const piece = getPieceAt(board, position)
    return piece ? exploreCaptureMoves(board, position, position, piece, [position], [], false) : []
  })

  if (captureMoves.length > 0) {
    return captureMoves
  }

  return positions.flatMap((position) => {
    const piece = getPieceAt(board, position)
    return piece ? getSimpleMovesForPiece(board, position, piece) : []
  })
}

export const applyMove = (board: Board, move: Move): MoveResult => {
  const nextBoard = cloneBoard(board)
  const piece = nextBoard[move.from.row][move.from.col]

  if (!piece) {
    throw new Error('Cannot apply a move from an empty square.')
  }

  nextBoard[move.from.row][move.from.col] = null

  for (const capture of move.captures) {
    nextBoard[capture.row][capture.col] = null
  }

  nextBoard[move.to.row][move.to.col] = {
    player: piece.player,
    isKing: piece.isKing || move.becomesKing,
  }

  return { board: nextBoard, move }
}

export const hasLegalMoves = (board: Board, player: Player): boolean =>
  getLegalMoves(board, player).length > 0

export const getWinner = (board: Board): Winner => {
  const redHasMoves = hasLegalMoves(board, 'red')
  const blackHasMoves = hasLegalMoves(board, 'black')

  if (!redHasMoves) {
    return 'black'
  }

  if (!blackHasMoves) {
    return 'red'
  }

  return null
}

export const formatMove = (move: Move): string => {
  const separator = move.captures.length > 0 ? 'x' : '-'
  return move.path.map((position) => positionToNotation(position)).join(separator)
}

export const isMoveForPosition = (move: Move, position: Position): boolean =>
  move.from.row === position.row && move.from.col === position.col

export const isMoveTarget = (move: Move, position: Position): boolean =>
  move.to.row === position.row && move.to.col === position.col

export const uniqueMoveStarts = (moves: readonly Move[]): Position[] => {
  const seen = new Set<string>()

  return moves.reduce<Position[]>((positions, move) => {
    const key = positionKey(move.from)
    if (!seen.has(key)) {
      seen.add(key)
      positions.push(move.from)
    }
    return positions
  }, [])
}
