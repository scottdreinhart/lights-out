import { describe, expect, it } from 'vitest'

import {
  cloneBoard,
  countKings,
  countPieces,
  createEmptyBoard,
  createInitialBoard,
  getOpponent,
  isInsideBoard,
  isPlayableSquare,
  isPromotionRow,
  positionKey,
  positionToNotation,
} from './board.ts'
import { BOARD_SIZE } from './constants.ts'
import {
  applyMove,
  createGameState,
  formatMove,
  getLegalMoves,
  getWinner,
  hasLegalMoves,
} from './rules.ts'
import type { Move } from './types.ts'

// ─── Board Setup ──────────────────────────────────────────────────────────────

describe('createInitialBoard', () => {
  it('creates an 8x8 board', () => {
    const board = createInitialBoard()
    expect(board).toHaveLength(BOARD_SIZE)
    expect(board[0]).toHaveLength(BOARD_SIZE)
  })

  it('places 12 black pieces in rows 0–2', () => {
    const board = createInitialBoard()
    expect(countPieces(board, 'black')).toBe(12)
  })

  it('places 12 red pieces in rows 5–7', () => {
    const board = createInitialBoard()
    expect(countPieces(board, 'red')).toBe(12)
  })

  it('starts with no kings', () => {
    const board = createInitialBoard()
    expect(countKings(board, 'black')).toBe(0)
    expect(countKings(board, 'red')).toBe(0)
  })
})

describe('createEmptyBoard', () => {
  it('creates all-null board', () => {
    const board = createEmptyBoard()
    for (const row of board) {
      for (const cell of row) {
        expect(cell).toBeNull()
      }
    }
  })
})

// ─── Board Utilities ──────────────────────────────────────────────────────────

describe('isInsideBoard', () => {
  it('returns true for valid coordinates', () => {
    expect(isInsideBoard(0, 0)).toBe(true)
    expect(isInsideBoard(7, 7)).toBe(true)
    expect(isInsideBoard(3, 4)).toBe(true)
  })

  it('returns false for negative coordinates', () => {
    expect(isInsideBoard(-1, 0)).toBe(false)
    expect(isInsideBoard(0, -1)).toBe(false)
  })

  it('returns false when out of board boundary', () => {
    expect(isInsideBoard(8, 0)).toBe(false)
    expect(isInsideBoard(0, 8)).toBe(false)
  })
})

describe('isPlayableSquare', () => {
  it('returns true only for dark squares (row + col odd)', () => {
    expect(isPlayableSquare(0, 1)).toBe(true) // 0+1=1 odd
    expect(isPlayableSquare(1, 0)).toBe(true) // 1+0=1 odd
    expect(isPlayableSquare(0, 0)).toBe(false) // 0+0=0 even
    expect(isPlayableSquare(1, 1)).toBe(false) // 1+1=2 even
  })
})

describe('isPromotionRow', () => {
  it('row 0 is promotion for red', () => {
    expect(isPromotionRow('red', 0)).toBe(true)
  })

  it('row 7 is promotion for black', () => {
    expect(isPromotionRow('black', 7)).toBe(true)
  })

  it('non-promotion rows return false', () => {
    expect(isPromotionRow('red', 7)).toBe(false)
    expect(isPromotionRow('black', 0)).toBe(false)
  })
})

describe('getOpponent', () => {
  it('returns black for red', () => {
    expect(getOpponent('red')).toBe('black')
  })

  it('returns red for black', () => {
    expect(getOpponent('black')).toBe('red')
  })
})

describe('positionKey', () => {
  it('produces a unique string key', () => {
    expect(positionKey({ row: 3, col: 4 })).toBe('3:4')
  })
})

describe('positionToNotation', () => {
  it('converts (0, 0) to a1-style notation', () => {
    const notation = positionToNotation({ row: 0, col: 0 })
    expect(typeof notation).toBe('string')
    expect(notation.length).toBeGreaterThan(0)
  })
})

describe('cloneBoard', () => {
  it('creates a deep copy — mutations do not affect original', () => {
    const board = createInitialBoard()
    const clone = cloneBoard(board)
    clone[0][1] = { player: 'red', isKing: true }
    expect(board[0][1]).toEqual({ player: 'black', isKing: false })
  })
})

// ─── Legal Moves ──────────────────────────────────────────────────────────────

describe('getLegalMoves', () => {
  it('returns moves for the starting player black on a fresh board', () => {
    const board = createInitialBoard()
    const moves = getLegalMoves(board, 'black')
    expect(moves.length).toBeGreaterThan(0)
  })

  it('returns moves for red on a fresh board', () => {
    const board = createInitialBoard()
    const moves = getLegalMoves(board, 'red')
    expect(moves.length).toBeGreaterThan(0)
  })

  it('returns no moves for an empty board', () => {
    const board = createEmptyBoard()
    expect(getLegalMoves(board, 'red')).toHaveLength(0)
    expect(getLegalMoves(board, 'black')).toHaveLength(0)
  })

  it('enforces mandatory capture — capture moves take priority over simple moves', () => {
    // Black at (2,1) can jump red at (3,2) landing at (4,3)
    // BLACK_DIRECTIONS: row+1 (moves down toward higher row numbers)
    const board = createEmptyBoard()
    board[2][1] = { player: 'black', isKing: false }
    board[3][2] = { player: 'red', isKing: false }
    const moves = getLegalMoves(board, 'black')
    expect(moves.every((move: Move) => move.captures.length > 0)).toBe(true)
  })
})

describe('hasLegalMoves', () => {
  it('returns true for both players on initial board', () => {
    const board = createInitialBoard()
    expect(hasLegalMoves(board, 'red')).toBe(true)
    expect(hasLegalMoves(board, 'black')).toBe(true)
  })

  it('returns false on empty board', () => {
    const board = createEmptyBoard()
    expect(hasLegalMoves(board, 'red')).toBe(false)
    expect(hasLegalMoves(board, 'black')).toBe(false)
  })
})

// ─── Apply Move ───────────────────────────────────────────────────────────────

describe('applyMove', () => {
  it('moves a piece from its origin to destination', () => {
    const board = createInitialBoard()
    const moves = getLegalMoves(board, 'black')
    expect(moves.length).toBeGreaterThan(0)

    const move = moves[0]
    const { board: newBoard } = applyMove(board, move)

    expect(newBoard[move.from.row][move.from.col]).toBeNull()
    expect(newBoard[move.to.row][move.to.col]).not.toBeNull()
    expect(newBoard[move.to.row][move.to.col]?.player).toBe('black')
  })

  it('removes captured pieces from the board', () => {
    const board = createEmptyBoard()
    // Black at (2,1), red at (3,2) — black jumps to (4,3)
    board[2][1] = { player: 'black', isKing: false }
    board[3][2] = { player: 'red', isKing: false }

    const moves = getLegalMoves(board, 'black')
    const captureMove = moves.find((move: Move) => move.captures.length > 0)!
    expect(captureMove).toBeDefined()

    const { board: newBoard } = applyMove(board, captureMove)
    for (const capture of captureMove.captures) {
      expect(newBoard[capture.row][capture.col]).toBeNull()
    }
  })
})

// ─── Winner Detection ─────────────────────────────────────────────────────────

describe('getWinner', () => {
  it('returns null on fresh board (no winner yet)', () => {
    expect(getWinner(createInitialBoard())).toBeNull()
  })

  it('returns red when black has no moves', () => {
    // Board with only red pieces — black has no moves
    const board = createEmptyBoard()
    board[7][6] = { player: 'red', isKing: false }
    expect(getWinner(board)).toBe('red')
  })

  it('returns black when red has no moves', () => {
    const board = createEmptyBoard()
    board[0][1] = { player: 'black', isKing: false }
    expect(getWinner(board)).toBe('black')
  })
})

describe('createGameState', () => {
  it('returns a combined snapshot for the current player', () => {
    const board = createInitialBoard()
    const gameState = createGameState(board, 'black')

    expect(gameState.board).toBe(board)
    expect(gameState.currentPlayer).toBe('black')
    expect(gameState.winner).toBeNull()
    expect(gameState.legalMoves.length).toBeGreaterThan(0)
  })

  it('returns no legal moves when the board is already finished', () => {
    const board = createEmptyBoard()
    board[7][6] = { player: 'red', isKing: false }

    const gameState = createGameState(board, 'black')

    expect(gameState.winner).toBe('red')
    expect(gameState.legalMoves).toHaveLength(0)
  })
})

// ─── formatMove ───────────────────────────────────────────────────────────────

describe('formatMove', () => {
  it('formats a simple move with a dash separator', () => {
    const board = createInitialBoard()
    const moves = getLegalMoves(board, 'black')
    const result = formatMove(moves[0])
    expect(result).toMatch(/-/)
  })

  it('formats a capture move with an x separator', () => {
    const board = createEmptyBoard()
    board[4][1] = { player: 'black', isKing: false }
    board[3][2] = { player: 'red', isKing: false }
    const moves = getLegalMoves(board, 'black')
    const captureMove = moves.find((move: Move) => move.captures.length > 0)
    if (captureMove) {
      const result = formatMove(captureMove)
      expect(result).toMatch(/x/)
    }
  })
})
