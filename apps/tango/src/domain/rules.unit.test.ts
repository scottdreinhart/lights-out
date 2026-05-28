/**
 * tango — domain rules unit tests.
 * Tango is a slide puzzle game.
 */

import { describe, expect, it } from 'vitest'
import { createEmptyBoard, createSolvedBoard } from './rules'

describe('tango rules', () => {
  describe('createEmptyBoard', () => {
    it('creates a board with the given size', () => {
      const board = createEmptyBoard(3)
      expect(board).toHaveLength(3)
      board.forEach((row) => expect(row).toHaveLength(3))
    })

    it('all cells are initialized to 0', () => {
      const board = createEmptyBoard(4)
      for (const row of board) {
        for (const cell of row) {
          expect(cell).toBe(0)
        }
      }
    })

    it('creates a 5x5 board with correct dimensions', () => {
      const board = createEmptyBoard(5)
      expect(board).toHaveLength(5)
      expect(board[0]).toHaveLength(5)
    })
  })

  describe('createSolvedBoard', () => {
    it('creates a board of the given size', () => {
      const board = createSolvedBoard(3)
      expect(board).toHaveLength(3)
      board.forEach((row) => expect(row).toHaveLength(3))
    })

    it('filled board has no zero cells', () => {
      const board = createSolvedBoard(3)
      for (const row of board) {
        for (const cell of row) {
          expect(cell).toBeGreaterThan(0)
        }
      }
    })

    it('contains sequential numbers starting from 1', () => {
      const size = 3
      const board = createSolvedBoard(size)
      const flat = board.flat()
      const expected = Array.from({ length: size * size }, (_, i) => i + 1)
      expect(flat).toEqual(expected)
    })
  })
})
