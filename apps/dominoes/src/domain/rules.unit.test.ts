/**
 * dominoes — domain rules unit tests.
 */

import { describe, expect, it } from 'vitest'
import { INITIAL_HAND_SIZE, MAX_PIPS } from './constants'
import { createGameState, generateBoneyard } from './rules'

describe('dominoes rules', () => {
  describe('generateBoneyard', () => {
    const expectedCount = ((MAX_PIPS + 1) * (MAX_PIPS + 2)) / 2

    it('generates the correct number of tiles for a double-6 set', () => {
      const boneyard = generateBoneyard()
      expect(boneyard).toHaveLength(expectedCount)
    })

    it('every tile has left <= right (only unique pairs)', () => {
      const boneyard = generateBoneyard()
      for (const tile of boneyard) {
        expect(tile.left).toBeLessThanOrEqual(tile.right)
      }
    })

    it('all pip values are within 0..MAX_PIPS', () => {
      const boneyard = generateBoneyard()
      for (const tile of boneyard) {
        expect(tile.left).toBeGreaterThanOrEqual(0)
        expect(tile.left).toBeLessThanOrEqual(MAX_PIPS)
        expect(tile.right).toBeGreaterThanOrEqual(0)
        expect(tile.right).toBeLessThanOrEqual(MAX_PIPS)
      }
    })

    it('generates shuffled tiles (not in sorted order on successive calls)', () => {
      const a = generateBoneyard()
      const b = generateBoneyard()
      // With 28 tiles the probability of identical order is astronomically small
      const identical = a.every((t, i) => t.left === b[i].left && t.right === b[i].right)
      expect(identical).toBe(false)
    })
  })

  describe('createGameState', () => {
    it('creates a game state with two players', () => {
      const state = createGameState()
      expect(state.players).toHaveLength(2)
    })

    it('each player starts with the correct hand size', () => {
      const state = createGameState()
      for (const player of state.players) {
        expect(player.hand).toHaveLength(INITIAL_HAND_SIZE)
      }
    })

    it('boneyard has remaining tiles after dealing', () => {
      const state = createGameState()
      const totalDominos = ((MAX_PIPS + 1) * (MAX_PIPS + 2)) / 2
      const dealtCount = state.players.reduce((sum, p) => sum + p.hand.length, 0)
      expect(state.boneyard.length).toBe(totalDominos - dealtCount)
    })

    it('game starts in playing phase', () => {
      const state = createGameState()
      expect(state.phase).toBe('playing')
    })
  })
})
