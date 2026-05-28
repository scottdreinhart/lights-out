/**
 * crossclimb — domain rules unit tests.
 * Crossclimb is a graph search puzzle game.
 */

import { describe, expect, it } from 'vitest'
import { DIFFICULTY_CONFIGS } from './constants'
import { generateRandomPosition } from './rules'
import type { Position } from './types'

describe('crossclimb rules', () => {
  describe('generateRandomPosition', () => {
    const width = 800
    const height = 600

    it('returns a position within canvas bounds', () => {
      const pos = generateRandomPosition(width, height, [])
      expect(pos.x).toBeGreaterThanOrEqual(0)
      expect(pos.x).toBeLessThanOrEqual(width)
      expect(pos.y).toBeGreaterThanOrEqual(0)
      expect(pos.y).toBeLessThanOrEqual(height)
    })

    it('returns a position with x and y properties', () => {
      const pos = generateRandomPosition(width, height, [])
      expect(pos).toHaveProperty('x')
      expect(pos).toHaveProperty('y')
    })

    it('generated positions avoid minimum distance from existing ones', () => {
      const existing: Position[] = [{ x: 100, y: 100 }]
      const minDistance = 50
      const pos = generateRandomPosition(width, height, existing, minDistance)
      const dx = pos.x - 100
      const dy = pos.y - 100
      const dist = Math.sqrt(dx * dx + dy * dy)
      expect(dist).toBeGreaterThanOrEqual(minDistance)
    })
  })

  describe('DIFFICULTY_CONFIGS', () => {
    it('contains easy, medium, and hard configurations', () => {
      expect(DIFFICULTY_CONFIGS).toHaveProperty('easy')
      expect(DIFFICULTY_CONFIGS).toHaveProperty('medium')
      expect(DIFFICULTY_CONFIGS).toHaveProperty('hard')
    })

    it('easy config has fewer nodes than hard', () => {
      expect(DIFFICULTY_CONFIGS.easy.nodeCount).toBeLessThan(DIFFICULTY_CONFIGS.hard.nodeCount)
    })

    it('all configs have required fields', () => {
      for (const config of Object.values(DIFFICULTY_CONFIGS)) {
        expect(config).toHaveProperty('nodeCount')
        expect(config).toHaveProperty('edgeDensity')
        expect(config).toHaveProperty('maxWeight')
      }
    })
  })
})
