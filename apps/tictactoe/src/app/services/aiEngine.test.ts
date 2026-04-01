import type { Board } from '@/domain'
import { createEmptyBoard, TOKENS } from '@/domain'
import { describe, expect, it } from 'vitest'
import { computeAiMove } from './aiEngine.ts'

describe('aiEngine', () => {
  describe('computeAiMove', () => {
    it('should return a valid index', () => {
      const board = createEmptyBoard()
      const result = computeAiMove(board, 'easy', TOKENS.CPU, TOKENS.HUMAN)
      expect(result.index).toBeGreaterThanOrEqual(0)
      expect(result.index).toBeLessThan(9)
    })

    it('should avoid occupied cells', () => {
      const board: Board = [
        TOKENS.HUMAN,
        TOKENS.CPU,
        TOKENS.HUMAN,
        null,
        null,
        null,
        null,
        null,
        null,
      ]

      const result = computeAiMove(board, 'medium', TOKENS.CPU, TOKENS.HUMAN)
      expect(result.index).not.toBe(0)
      expect(result.index).not.toBe(1)
      expect(result.index).not.toBe(2)
    })

    it('should work with all difficulty levels', () => {
      const board = createEmptyBoard()
      const difficulties = ['easy', 'medium', 'hard'] as const

      difficulties.forEach((difficulty) => {
        const result = computeAiMove(board, difficulty, TOKENS.CPU, TOKENS.HUMAN)
        expect(result).toHaveProperty('index')
        expect(result).toHaveProperty('engine')
        expect(['wasm', 'js']).toContain(result.engine)
      })
    })

    it('should block opponent from winning', () => {
      const board: Board = [TOKENS.HUMAN, TOKENS.HUMAN, null, null, null, null, null, null, null]

      const result = computeAiMove(board, 'hard', TOKENS.CPU, TOKENS.HUMAN)
      // Hard difficulty (medium strategy) should block the win
      expect(result.index).toBe(2)
    })
  })
})
