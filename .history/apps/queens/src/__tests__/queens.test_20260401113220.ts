/**
 * Queens Game Tests
 */

import { describe, it, expect } from 'vitest'
import { createQueensGameState, isValidPlacement, solveNQueens } from '../domain'

describe('Queens Game Domain', () => {
  describe('createQueensGameState', () => {
    it('should create a valid initial game state', () => {
      const state = createQueensGameState(4)
      expect(state.size).toBe(4)
      expect(state.board).toHaveLength(4)
      expect(state.board.every(row => row === -1)).toBe(true)
      expect(state.isComplete).toBe(false)
      expect(state.isSolved).toBe(false)
      expect(state.moveCount).toBe(0)
      expect(state.mistakes).toBe(0)
      expect(state.hintCount).toBe(0)
    })
  })

  describe('isValidPlacement', () => {
    it('should allow valid queen placements', () => {
      const board = [-1, -1, -1, -1]
      expect(isValidPlacement(board, 0, 0)).toBe(true)
      board[0] = 0
      expect(isValidPlacement(board, 1, 2)).toBe(true) // Not in same column or diagonal
    })

    it('should reject invalid queen placements', () => {
      const board = [0, -1, -1, -1] // Queen at (0,0)
      expect(isValidPlacement(board, 1, 0)).toBe(false) // Same column
      expect(isValidPlacement(board, 1, 1)).toBe(false) // Same diagonal
    })
  })

  describe('solveNQueens', () => {
    it('should solve 4x4 board', () => {
      const solution = solveNQueens(4)
      expect(solution).toBeDefined()
      expect(solution!.length).toBe(4)
      // Verify it's a valid solution (no conflicts)
      const board = solution!
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (board[row] === col) {
            // Check no other queen attacks this position
            for (let otherRow = 0; otherRow < 4; otherRow++) {
              if (otherRow !== row) {
                const otherCol = board[otherRow]
                expect(otherCol).not.toBe(col) // Same column
                expect(Math.abs(otherRow - row)).not.toBe(Math.abs(otherCol - col)) // Same diagonal
              }
            }
          }
        }
      }
    })

    it('should return null for impossible sizes', () => {
      expect(solveNQueens(2)).toBeNull()
      expect(solveNQueens(3)).toBeNull()
    })
  })
})