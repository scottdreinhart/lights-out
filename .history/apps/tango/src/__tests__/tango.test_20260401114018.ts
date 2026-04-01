/**
 * Tango Game Tests
 * Unit tests for Tango slide puzzle functionality
 */

import { describe, it, expect } from 'vitest'
import {
  createSolvedBoard,
  makeMove,
  isBoardSolved,
  shuffleBoard,
  solvePuzzleBFS,
  solvePuzzleAStar,
  isSolvable,
  calculateParity,
} from '../domain'

describe('Tango Domain Logic', () => {
  describe('Board Creation', () => {
    it('creates a solved 3x3 board', () => {
      const board = createSolvedBoard(3)
      expect(board).toHaveLength(3)
      expect(board[0]).toHaveLength(3)
      expect(board.flat()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 0])
    })

    it('creates a solved 4x4 board', () => {
      const board = createSolvedBoard(4)
      expect(board).toHaveLength(4)
      expect(board[0]).toHaveLength(4)
      expect(board.flat()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0])
    })
  })

  describe('Board Operations', () => {
    it('makes valid moves', () => {
      const board = [
        [1, 2, 3],
        [4, 5, 0],
        [7, 8, 6]
      ]
      const newBoard = makeMove(board, { row: 2, col: 2 })
      expect(newBoard).toEqual([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 0]
      ])
    })

    it('ignores invalid moves', () => {
      const board = [
        [1, 2, 3],
        [4, 5, 0],
        [7, 8, 6]
      ]
      const newBoard = makeMove(board, { row: 0, col: 0 })
      expect(newBoard).toEqual(board)
    })

    it('detects solved board', () => {
      const solvedBoard = createSolvedBoard(3)
      expect(isBoardSolved(solvedBoard)).toBe(true)

      const unsolvedBoard = [
        [1, 2, 3],
        [4, 5, 0],
        [7, 8, 6]
      ]
      expect(isBoardSolved(unsolvedBoard)).toBe(false)
    })
  })

  describe('Puzzle Solvability', () => {
    it('calculates parity correctly', () => {
      const board = [
        [1, 2, 3],
        [4, 5, 0],
        [7, 8, 6]
      ]
      const parity = calculateParity(board)
      expect(parity).toBe(1) // One inversion
    })

    it('determines solvability', () => {
      const solvableBoard = createSolvedBoard(3)
      expect(isSolvable(solvableBoard)).toBe(true)

      const shuffled = shuffleBoard(solvableBoard, 10)
      expect(isSolvable(shuffled)).toBe(true)
    })
  })

  describe('AI Solvers', () => {
    it('solves simple puzzles with BFS', () => {
      const board = [
        [1, 2, 3],
        [4, 5, 0],
        [7, 8, 6]
      ]
      const solution = solvePuzzleBFS(board)
      expect(solution).toBeDefined()
      expect(solution!.length).toBeGreaterThan(0)
    })

    it('solves puzzles with A*', () => {
      const board = [
        [1, 2, 3],
        [4, 5, 0],
        [7, 8, 6]
      ]
      const solution = solvePuzzleAStar(board)
      expect(solution).toBeDefined()
      expect(solution!.length).toBeGreaterThan(0)
    })
  })
})