/**
 * zip — domain rules unit tests.
 * Zip is a maze navigation puzzle game.
 */

import { describe, expect, it } from 'vitest'
import { createEmptyMaze, isPassable, isValidPosition } from './rules'
import type { Cell } from './types'

function makeCell(type: 'empty' | 'wall' | 'start' | 'goal' | 'item'): Cell {
  return { type }
}

describe('zip rules', () => {
  describe('createEmptyMaze', () => {
    it('creates a maze with the correct height', () => {
      const maze = createEmptyMaze(8, 6)
      expect(maze).toHaveLength(6)
    })

    it('creates a maze with the correct width', () => {
      const maze = createEmptyMaze(8, 6)
      maze.forEach((row) => expect(row).toHaveLength(8))
    })

    it('all cells start as empty type', () => {
      const maze = createEmptyMaze(4, 3)
      for (const row of maze) {
        for (const cell of row) {
          expect(cell.type).toBe('empty')
        }
      }
    })
  })

  describe('isValidPosition', () => {
    const maze = createEmptyMaze(5, 4)

    it('returns true for a position within bounds', () => {
      expect(isValidPosition({ row: 0, col: 0 }, maze)).toBe(true)
      expect(isValidPosition({ row: 3, col: 4 }, maze)).toBe(true)
    })

    it('returns false for negative row', () => {
      expect(isValidPosition({ row: -1, col: 0 }, maze)).toBe(false)
    })

    it('returns false for negative col', () => {
      expect(isValidPosition({ row: 0, col: -1 }, maze)).toBe(false)
    })

    it('returns false for row >= height', () => {
      expect(isValidPosition({ row: 4, col: 0 }, maze)).toBe(false)
    })

    it('returns false for col >= width', () => {
      expect(isValidPosition({ row: 0, col: 5 }, maze)).toBe(false)
    })
  })

  describe('isPassable', () => {
    it('returns true for empty cell', () => {
      expect(isPassable(makeCell('empty'))).toBe(true)
    })

    it('returns false for wall cell', () => {
      expect(isPassable(makeCell('wall'))).toBe(false)
    })

    it('returns true for start cell', () => {
      expect(isPassable(makeCell('start'))).toBe(true)
    })

    it('returns true for goal cell', () => {
      expect(isPassable(makeCell('goal'))).toBe(true)
    })

    it('returns true for item cell', () => {
      expect(isPassable(makeCell('item'))).toBe(true)
    })
  })
})
