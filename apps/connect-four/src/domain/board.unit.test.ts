/**
 * Board Logic Unit Tests
 *
 * Tests all board manipulation functions:
 * - createBoard, getCell, setCell
 * - getLowestEmptyRow, isColumnPlayable, getPlayableColumns
 * - dropDisc, otherPlayer
 * - createInitialState, applyMove
 *
 * Validates:
 * ✓ Board initialization and state
 * ✓ Cell operations and boundary conditions
 * ✓ Column playability logic
 * ✓ Move application and state transitions
 */

import { describe, expect, it } from 'vitest'
import {
  applyMove,
  createBoard,
  createInitialState,
  dropDisc,
  getCell,
  getLowestEmptyRow,
  getPlayableColumns,
  isColumnPlayable,
  otherPlayer,
  setCell,
} from './board'
import { ROWS, TOTAL_CELLS } from './constants'
import { checkGameResult } from './rules'

describe('board.ts', () => {
  // ── Board Creation ────────────────────────────────────────

  describe('createBoard()', () => {
    it('should create a board with correct dimensions', () => {
      const board = createBoard()
      expect(board).toHaveLength(TOTAL_CELLS)
      expect(board).toHaveLength(42) // 7 cols × 6 rows
    })

    it('should initialize all cells as empty (0)', () => {
      const board = createBoard()
      expect(board.every((cell) => cell === 0)).toBe(true)
    })

    it('should be a new array each call (no sharing)', () => {
      const board1 = createBoard()
      const board2 = createBoard()
      expect(board1).not.toBe(board2) // Different references
      expect(board1).toEqual(board2) // Same values
    })
  })

  // ── Cell Access ───────────────────────────────────────────

  describe('getCell()', () => {
    it('should return 0 for empty cells', () => {
      const board = createBoard()
      expect(getCell(board, 0, 0)).toBe(0)
      expect(getCell(board, 6, 5)).toBe(0)
    })

    it('should retrieve cell value at (col, row)', () => {
      const board = createBoard()
      board[0 * ROWS + 0] = 1
      board[3 * ROWS + 2] = 2
      expect(getCell(board, 0, 0)).toBe(1)
      expect(getCell(board, 3, 2)).toBe(2)
    })

    it('should return 0 for out-of-bounds access', () => {
      const board = createBoard()
      expect(getCell(board, -1, 0)).toBe(0)
      expect(getCell(board, 10, 0)).toBe(0)
      expect(getCell(board, 0, -1)).toBe(0)
      expect(getCell(board, 0, 10)).toBe(0)
    })

    it('should use column-major indexing (col * ROWS + row)', () => {
      const board = createBoard()
      // Set a value at column 2, row 3
      board[2 * ROWS + 3] = 1
      expect(getCell(board, 2, 3)).toBe(1)
    })
  })

  describe('setCell()', () => {
    it('should return new board without mutation', () => {
      const board1 = createBoard()
      const board2 = setCell(board1, 0, 0, 1)
      expect(board1).not.toBe(board2)
      expect(getCell(board1, 0, 0)).toBe(0)
      expect(getCell(board2, 0, 0)).toBe(1)
    })

    it('should set cell to player 1 or 2', () => {
      const board = setCell(createBoard(), 3, 2, 1)
      const board2 = setCell(board, 3, 2, 2)
      expect(getCell(board, 3, 2)).toBe(1)
      expect(getCell(board2, 3, 2)).toBe(2)
    })

    it('should preserve other cells', () => {
      let board = createBoard()
      board[0 * ROWS + 0] = 1
      board[1 * ROWS + 0] = 2
      board = setCell(board, 2, 0, 1)
      expect(getCell(board, 0, 0)).toBe(1)
      expect(getCell(board, 1, 0)).toBe(2)
      expect(getCell(board, 2, 0)).toBe(1)
    })
  })

  // ── Column Operations ──────────────────────────────────────

  describe('getLowestEmptyRow()', () => {
    it('should return 0 for empty column', () => {
      const board = createBoard()
      expect(getLowestEmptyRow(board, 0)).toBe(0)
      expect(getLowestEmptyRow(board, 3)).toBe(0)
    })

    it('should return row above topmost disc', () => {
      const board = createBoard()
      board[3 * ROWS + 0] = 1
      board[3 * ROWS + 1] = 2
      expect(getLowestEmptyRow(board, 3)).toBe(2)
    })

    it('should return -1 for full column', () => {
      const board = createBoard()
      for (let row = 0; row < ROWS; row++) {
        board[3 * ROWS + row] = row % 2 === 0 ? 1 : 2
      }
      expect(getLowestEmptyRow(board, 3)).toBe(-1)
    })

    it('should handle all columns independently', () => {
      const board = createBoard()
      board[0 * ROWS + 0] = 1
      board[1 * ROWS + 1] = 1
      board[2 * ROWS + 2] = 1
      expect(getLowestEmptyRow(board, 0)).toBe(1)
      expect(getLowestEmptyRow(board, 1)).toBe(0) // Col 1 still empty at row 0
      expect(getLowestEmptyRow(board, 2)).toBe(0)
      expect(getLowestEmptyRow(board, 3)).toBe(0)
    })
  })

  describe('isColumnPlayable()', () => {
    it('should return true for empty column', () => {
      const board = createBoard()
      expect(isColumnPlayable(board, 0)).toBe(true)
      expect(isColumnPlayable(board, 3)).toBe(true)
      expect(isColumnPlayable(board, 6)).toBe(true)
    })

    it('should return false for full column', () => {
      const board = createBoard()
      for (let row = 0; row < ROWS; row++) {
        board[3 * ROWS + row] = 1
      }
      expect(isColumnPlayable(board, 3)).toBe(false)
    })

    it('should return true for partially filled column', () => {
      const board = createBoard()
      board[3 * ROWS + 0] = 1
      board[3 * ROWS + 1] = 2
      expect(isColumnPlayable(board, 3)).toBe(true)
    })
  })

  describe('getPlayableColumns()', () => {
    it('should return all columns for empty board', () => {
      const board = createBoard()
      const playable = getPlayableColumns(board)
      expect(playable).toEqual([0, 1, 2, 3, 4, 5, 6])
    })

    it('should exclude full columns', () => {
      const board = createBoard()
      // Fill column 3
      for (let row = 0; row < ROWS; row++) {
        board[3 * ROWS + row] = 1
      }
      const playable = getPlayableColumns(board)
      expect(playable).toEqual([0, 1, 2, 4, 5, 6])
    })

    it('should handle partially filled columns', () => {
      const board = createBoard()
      board[0 * ROWS + 0] = 1
      board[3 * ROWS + 1] = 1
      const playable = getPlayableColumns(board)
      expect(playable).toEqual([0, 1, 2, 3, 4, 5, 6])
    })
  })

  // ── Move Operations ───────────────────────────────────────

  describe('dropDisc()', () => {
    it('should place disc in empty column at row 0', () => {
      const board = createBoard()
      const result = dropDisc(board, 3, 1)
      expect(result).not.toBeNull()
      if (result) {
        const [newBoard, row] = result
        expect(getCell(newBoard, 3, row)).toBe(1)
        expect(row).toBe(0)
      }
    })

    it('should stack discs in same column', () => {
      const board = createBoard()
      let result = dropDisc(board, 3, 1)
      if (!result) {
        throw new Error('First drop failed')
      }
      const [newBoard, row1] = result

      result = dropDisc(newBoard, 3, 2)
      if (!result) {
        throw new Error('Second drop failed')
      }
      const [board2, row2] = result

      expect(getCell(board2, 3, row1)).toBe(1)
      expect(getCell(board2, 3, row2)).toBe(2)
      expect(row2).toBe(row1 + 1)
    })

    it('should return null for full column', () => {
      const board = createBoard()
      for (let row = 0; row < ROWS; row++) {
        board[3 * ROWS + row] = 1
      }
      expect(dropDisc(board, 3, 1)).toBeNull()
    })

    it('should not mutate original board', () => {
      const board = createBoard()
      dropDisc(board, 3, 1)
      expect(getCell(board, 3, 0)).toBe(0)
    })
  })

  // ── Player Switching ───────────────────────────────────────

  describe('otherPlayer()', () => {
    it('should return 2 when given 1', () => {
      expect(otherPlayer(1)).toBe(2)
    })

    it('should return 1 when given 2', () => {
      expect(otherPlayer(2)).toBe(1)
    })
  })

  // ── Game State ─────────────────────────────────────────────

  describe('createInitialState()', () => {
    it('should create initial game state for PvC', () => {
      const state = createInitialState('pvc', 'medium')
      expect(state.mode).toBe('pvc')
      expect(state.difficulty).toBe('medium')
      expect(state.currentPlayer).toBe(1)
      expect(state.result.status).toBe('playing')
      expect(state.moveHistory).toEqual([])
      expect(state.board).toHaveLength(42)
      expect(state.board.every((c) => c === 0)).toBe(true)
    })

    it('should create initial game state for PvP', () => {
      const state = createInitialState('pvp', 'hard')
      expect(state.mode).toBe('pvp')
      expect(state.difficulty).toBe('hard')
    })

    it('should default to PvC, medium', () => {
      const state = createInitialState()
      expect(state.mode).toBe('pvc')
      expect(state.difficulty).toBe('medium')
    })
  })

  describe('applyMove()', () => {
    it('should apply valid move and return new state', () => {
      const state = createInitialState('pvc', 'easy')
      const result = applyMove(state, 3 as any, checkGameResult)
      expect(result).not.toBeNull()
      if (result) {
        expect(getCell(result.board, 3, 0)).toBe(1)
        expect(result.currentPlayer).toBe(2)
        expect(result.moveHistory).toEqual([3])
      }
    })

    it('should return null for move on full column', () => {
      let state = createInitialState('pvc', 'easy')
      const origBoard = state.board
      // Fill column 3
      for (let row = 0; row < ROWS; row++) {
        origBoard[3 * ROWS + row] = row % 2 === 0 ? 1 : 2
      }
      state = { ...state, board: origBoard }
      const result = applyMove(state, 3 as any, checkGameResult)
      expect(result).toBeNull()
    })

    it('should return null if game is already over', () => {
      let state = createInitialState('pvc', 'easy')
      state = { ...state, result: { status: 'draw' } }
      const result = applyMove(state, 3 as any, checkGameResult)
      expect(result).toBeNull()
    })

    it('should track move history', () => {
      const state = createInitialState('pvc', 'easy')
      const move1 = applyMove(state, 3 as any, checkGameResult)
      if (!move1) {
        throw new Error('Move 1 failed')
      }
      const move2 = applyMove(move1, 4 as any, checkGameResult)
      if (!move2) {
        throw new Error('Move 2 failed')
      }
      expect(move2.moveHistory).toEqual([3, 4])
    })

    it('should alternate players correctly', () => {
      const state = createInitialState('pvc', 'easy')
      const result = applyMove(state, 0 as any, checkGameResult)
      if (!result) {
        throw new Error('Move failed')
      }
      expect(result.currentPlayer).toBe(2)
    })
  })
})
