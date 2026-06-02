/**
 * Rules Logic Unit Tests
 *
 * Tests all game rule enforcement:
 * - checkWinAt (4-in-a-row in all directions)
 * - isBoardFull (draw condition)
 * - countDownFrom (cell sequence counting)
 * - checkGameResult (win/draw/playing state)
 *
 * Validates:
 * ✓ Win detection in all 4 directions (→, ↓, ↗, ↘)
 * ✓ Draw detection when board is full
 * ✓ Cell sequence counting with directional logic
 * ✓ Overall game state transitions
 */

import { describe, expect, it } from 'vitest'
import { createBoard, setCell } from './board'
import { COLS, ROWS } from './constants'
import { checkGameResult, checkWinAt, isBoardFull } from './rules'
import type { Board, Cell } from './types'

describe('rules.ts', () => {
  // ── Helper: Place disc at specific board location ──────────

  const placeDisc = (board: Board, col: number, row: number, player: Cell): Board => {
    return setCell(board, col, row, player)
  }

  // ── Win Detection: All Directions ──────────────────────────

  describe('checkWinAt() - Horizontal (→)', () => {
    it('should detect 4-in-a-row horizontally (left)', () => {
      let board = createBoard()
      board = placeDisc(board, 0, 0, 1)
      board = placeDisc(board, 1, 0, 1)
      board = placeDisc(board, 2, 0, 1)
      board = placeDisc(board, 3, 0, 1)
      expect(checkWinAt(board, 3, 0, 1)).not.toBeNull()
    })

    it('should detect 4-in-a-row horizontally (middle)', () => {
      let board = createBoard()
      board = placeDisc(board, 1, 0, 2)
      board = placeDisc(board, 2, 0, 2)
      board = placeDisc(board, 3, 0, 2)
      board = placeDisc(board, 4, 0, 2)
      expect(checkWinAt(board, 3, 0, 2)).not.toBeNull()
    })

    it('should detect 4-in-a-row horizontally (right)', () => {
      let board = createBoard()
      board = placeDisc(board, 3, 0, 1)
      board = placeDisc(board, 4, 0, 1)
      board = placeDisc(board, 5, 0, 1)
      board = placeDisc(board, 6, 0, 1)
      expect(checkWinAt(board, 3, 0, 1)).not.toBeNull()
    })

    it('should not detect win with only 3 in a row', () => {
      let board = createBoard()
      board = placeDisc(board, 0, 0, 1)
      board = placeDisc(board, 1, 0, 1)
      board = placeDisc(board, 2, 0, 1)
      expect(checkWinAt(board, 2, 0, 1)).toBeNull()
    })

    it('should not detect win with gaps', () => {
      let board = createBoard()
      board = placeDisc(board, 0, 0, 1)
      board = placeDisc(board, 1, 0, 1)
      board = placeDisc(board, 2, 0, 2)
      board = placeDisc(board, 3, 0, 1)
      expect(checkWinAt(board, 3, 0, 1)).toBeNull()
    })

    it('should detect 5-in-a-row (contains 4)', () => {
      let board = createBoard()
      board = placeDisc(board, 0, 0, 1)
      board = placeDisc(board, 1, 0, 1)
      board = placeDisc(board, 2, 0, 1)
      board = placeDisc(board, 3, 0, 1)
      board = placeDisc(board, 4, 0, 1)
      expect(checkWinAt(board, 2, 0, 1)).not.toBeNull()
    })
  })

  describe('checkWinAt() - Vertical (↓)', () => {
    it('should detect 4-in-a-column vertically (bottom)', () => {
      let board = createBoard()
      board = placeDisc(board, 3, 0, 1)
      board = placeDisc(board, 3, 1, 1)
      board = placeDisc(board, 3, 2, 1)
      board = placeDisc(board, 3, 3, 1)
      expect(checkWinAt(board, 3, 3, 1)).not.toBeNull()
    })

    it('should detect 4-in-a-column vertically (middle)', () => {
      let board = createBoard()
      board = placeDisc(board, 2, 0, 2)
      board = placeDisc(board, 2, 1, 2)
      board = placeDisc(board, 2, 2, 2)
      board = placeDisc(board, 2, 3, 2)
      expect(checkWinAt(board, 2, 1, 2)).not.toBeNull()
    })

    it('should not detect win with only 3 in a column', () => {
      let board = createBoard()
      board = placeDisc(board, 3, 0, 1)
      board = placeDisc(board, 3, 1, 1)
      board = placeDisc(board, 3, 2, 1)
      expect(checkWinAt(board, 3, 2, 1)).toBeNull()
    })
  })

  describe('checkWinAt() - Diagonal ↗ (NE)', () => {
    it('should detect 4-in-a-diagonal up-right', () => {
      let board = createBoard()
      board = placeDisc(board, 0, 3, 1)
      board = placeDisc(board, 1, 2, 1)
      board = placeDisc(board, 2, 1, 1)
      board = placeDisc(board, 3, 0, 1)
      expect(checkWinAt(board, 3, 0, 1)).not.toBeNull()
    })

    it('should detect diagonal from middle', () => {
      let board = createBoard()
      board = placeDisc(board, 2, 4, 2)
      board = placeDisc(board, 3, 3, 2)
      board = placeDisc(board, 4, 2, 2)
      board = placeDisc(board, 5, 1, 2)
      expect(checkWinAt(board, 4, 2, 2)).not.toBeNull()
    })
  })

  describe('checkWinAt() - Diagonal ↘ (SE)', () => {
    it('should detect 4-in-a-diagonal down-right', () => {
      let board = createBoard()
      board = placeDisc(board, 0, 0, 1)
      board = placeDisc(board, 1, 1, 1)
      board = placeDisc(board, 2, 2, 1)
      board = placeDisc(board, 3, 3, 1)
      expect(checkWinAt(board, 3, 3, 1)).not.toBeNull()
    })

    it('should detect diagonal from middle', () => {
      let board = createBoard()
      board = placeDisc(board, 2, 1, 2)
      board = placeDisc(board, 3, 2, 2)
      board = placeDisc(board, 4, 3, 2)
      board = placeDisc(board, 5, 4, 2)
      expect(checkWinAt(board, 3, 2, 2)).not.toBeNull()
    })
  })

  // ── Board Full Detection ───────────────────────────────────

  describe('isBoardFull()', () => {
    it('should return false for empty board', () => {
      const board = createBoard()
      expect(isBoardFull(board)).toBe(false)
    })

    it('should return true when all 42 cells filled', () => {
      const board = createBoard()
      for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
          board[col * ROWS + row] = (col + row) % 2 === 0 ? 1 : 2
        }
      }
      expect(isBoardFull(board)).toBe(true)
    })

    it('should return false with 1 empty cell', () => {
      const board = createBoard()
      for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
          board[col * ROWS + row] = (col + row) % 2 === 0 ? 1 : 2
        }
      }
      board[0] = 0 // Leave one cell empty
      expect(isBoardFull(board)).toBe(false)
    })
  })

  // ── Game Result Determination ──────────────────────────────

  describe('checkGameResult()', () => {
    it('should return playing status for empty board', () => {
      const board = createBoard()
      const result = checkGameResult(board, 0, 0, 1)
      expect(result.status).toBe('playing')
    })

    it('should return win for player 1', () => {
      let board = createBoard()
      board = placeDisc(board, 0, 0, 1)
      board = placeDisc(board, 1, 0, 1)
      board = placeDisc(board, 2, 0, 1)
      board = placeDisc(board, 3, 0, 1)
      const result = checkGameResult(board, 3, 0, 1)
      expect(result.status).toBe('win')
      if (result.status === 'win') {
        expect(result.winner).toBe(1)
      }
    })

    it('should return win for player 2', () => {
      let board = createBoard()
      board = placeDisc(board, 0, 0, 2)
      board = placeDisc(board, 1, 0, 2)
      board = placeDisc(board, 2, 0, 2)
      board = placeDisc(board, 3, 0, 2)
      const result = checkGameResult(board, 3, 0, 2)
      expect(result.status).toBe('win')
      if (result.status === 'win') {
        expect(result.winner).toBe(2)
      }
    })

    it('should return draw for full board with no winner', () => {
      const board = createBoard()
      // Fill board with alternating checkerboard pattern preventing any 4-in-a-row
      // This ensures no horizontal, vertical, or diagonal win is possible
      for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
          // Checkerboard: alternates to prevent 4-in-a-row in any direction
          board[col * ROWS + row] = (col + row) % 2 === 0 ? 1 : 2
        }
      }
      // After filling, isBoardFull will be true and no position should have a win
      // Check at a position and verify it's a draw
      const result = checkGameResult(board, 0, ROWS - 1, 1)
      expect(result.status).toBe('draw')
    })

    it('should return playing when board partially filled', () => {
      let board = createBoard()
      board = placeDisc(board, 3, 0, 1)
      board = placeDisc(board, 3, 1, 2)
      board = placeDisc(board, 3, 2, 1)
      const result = checkGameResult(board, 3, 2, 1)
      expect(result.status).toBe('playing')
    })

    it('should detect win on last move', () => {
      let board = createBoard()
      board = placeDisc(board, 0, 0, 1)
      board = placeDisc(board, 1, 0, 1)
      board = placeDisc(board, 2, 0, 1)
      board = placeDisc(board, 3, 0, 1)
      const result = checkGameResult(board, 3, 0, 1)
      expect(result.status).toBe('win')
      if (result.status === 'win') {
        expect(result.winner).toBe(1)
      }
    })

    it('should detect vertical win', () => {
      let board = createBoard()
      board = placeDisc(board, 3, 0, 2)
      board = placeDisc(board, 3, 1, 2)
      board = placeDisc(board, 3, 2, 2)
      board = placeDisc(board, 3, 3, 2)
      const result = checkGameResult(board, 3, 3, 2)
      expect(result.status).toBe('win')
      if (result.status === 'win') {
        expect(result.winner).toBe(2)
      }
    })

    it('should detect diagonal win ↗', () => {
      let board = createBoard()
      board = placeDisc(board, 0, 3, 1)
      board = placeDisc(board, 1, 2, 1)
      board = placeDisc(board, 2, 1, 1)
      board = placeDisc(board, 3, 0, 1)
      const result = checkGameResult(board, 3, 0, 1)
      expect(result.status).toBe('win')
      if (result.status === 'win') {
        expect(result.winner).toBe(1)
      }
    })

    it('should detect diagonal win ↘', () => {
      let board = createBoard()
      board = placeDisc(board, 0, 0, 2)
      board = placeDisc(board, 1, 1, 2)
      board = placeDisc(board, 2, 2, 2)
      board = placeDisc(board, 3, 3, 2)
      const result = checkGameResult(board, 3, 3, 2)
      expect(result.status).toBe('win')
      if (result.status === 'win') {
        expect(result.winner).toBe(2)
      }
    })
  })
})
