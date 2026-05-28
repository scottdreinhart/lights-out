/**
 * mexico — domain rules unit tests.
 * Mexico is a dice game variant using Nim-style pile mechanics.
 */

import { describe, expect, it } from 'vitest'
import { checkGameOver, getWinner } from './rules'
import type { GameState } from './types'

function makeState(
  piles: number[],
  currentPlayer: 'human' | 'cpu' = 'human',
  mode: 'normal' | 'misere' = 'normal',
): GameState {
  return {
    piles: piles.map((count, id) => ({ id, count })),
    currentPlayer,
    winner: null,
    isGameOver: false,
    mode,
  }
}

describe('mexico rules', () => {
  describe('checkGameOver', () => {
    it('returns false when piles still have objects', () => {
      expect(checkGameOver(makeState([1, 2, 3]))).toBe(false)
    })

    it('returns true when all piles are empty', () => {
      expect(checkGameOver(makeState([0, 0, 0]))).toBe(true)
    })

    it('returns true with a single empty pile', () => {
      expect(checkGameOver(makeState([0]))).toBe(true)
    })

    it('returns false if at least one pile has objects', () => {
      expect(checkGameOver(makeState([0, 0, 1]))).toBe(false)
    })
  })

  describe('getWinner', () => {
    it('returns null when game is not over', () => {
      expect(getWinner(makeState([3, 2, 1]))).toBeNull()
    })

    it('normal mode: human turn + empty piles → cpu wins (human cannot move)', () => {
      const state = makeState([0, 0], 'human', 'normal')
      expect(getWinner(state)).toBe('cpu')
    })

    it('normal mode: cpu turn + empty piles → human wins', () => {
      const state = makeState([0, 0], 'cpu', 'normal')
      expect(getWinner(state)).toBe('human')
    })

    it('misere mode: human turn + empty piles → human wins (cpu took last object)', () => {
      const state = makeState([0, 0], 'human', 'misere')
      expect(getWinner(state)).toBe('human')
    })

    it('misere mode: cpu turn + empty piles → cpu wins (human took last object)', () => {
      const state = makeState([0, 0], 'cpu', 'misere')
      expect(getWinner(state)).toBe('cpu')
    })
  })
})
