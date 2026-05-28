/**
 * liars-dice — domain rules unit tests.
 * Liars Dice uses Nim-style pile mechanics.
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

describe('liars-dice rules', () => {
  describe('checkGameOver', () => {
    it('returns false when piles have objects', () => {
      expect(checkGameOver(makeState([3, 2, 1]))).toBe(false)
    })

    it('returns true when all piles are empty', () => {
      expect(checkGameOver(makeState([0, 0, 0]))).toBe(true)
    })

    it('returns false if one pile still has objects', () => {
      expect(checkGameOver(makeState([0, 0, 1]))).toBe(false)
    })
  })

  describe('getWinner', () => {
    it('returns null when game is not over', () => {
      expect(getWinner(makeState([3, 2]))).toBeNull()
    })

    it('normal mode: human turn with empty piles → cpu wins', () => {
      expect(getWinner(makeState([0], 'human', 'normal'))).toBe('cpu')
    })

    it('normal mode: cpu turn with empty piles → human wins', () => {
      expect(getWinner(makeState([0], 'cpu', 'normal'))).toBe('human')
    })

    it('misere mode: human turn with empty piles → human wins', () => {
      expect(getWinner(makeState([0], 'human', 'misere'))).toBe('human')
    })

    it('misere mode: cpu turn with empty piles → cpu wins', () => {
      expect(getWinner(makeState([0], 'cpu', 'misere'))).toBe('cpu')
    })
  })
})
