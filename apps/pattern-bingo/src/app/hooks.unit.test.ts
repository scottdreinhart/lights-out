/**
 * Unit tests for usePatternDetection hook
 * Tests pattern detection logic and multiplier scoring
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePatternDetection } from '../hooks'

describe('usePatternDetection', () => {
  let hook: ReturnType<typeof renderHook<typeof usePatternDetection>>

  beforeEach(() => {
    hook = renderHook(() => usePatternDetection())
  })

  describe('initial state', () => {
    it('starts with empty marked squares', () => {
      const { result } = hook
      expect(result.current.markedSquares.size).toBe(0)
    })

    it('starts with no detected patterns', () => {
      const { result } = hook
      expect(result.current.detectedPatterns).toEqual([])
    })

    it('starts with multiplier 1.0', () => {
      const { result } = hook
      expect(result.current.getNextMultiplier()).toBe(1.0)
    })

    it('starts with total score 0', () => {
      const { result } = hook
      expect(result.current.getTotalScore()).toBe(0)
    })
  })

  describe('square marking', () => {
    it('marks a square correctly', () => {
      const { result } = hook

      act(() => {
        result.current.markSquare(0)
      })

      expect(result.current.markedSquares.has(0)).toBe(true)
      expect(result.current.markedSquares.size).toBe(1)
    })

    it('unmarks a square correctly', () => {
      const { result } = hook

      act(() => {
        result.current.markSquare(0)
        result.current.unmarkSquare(0)
      })

      expect(result.current.markedSquares.has(0)).toBe(false)
      expect(result.current.markedSquares.size).toBe(0)
    })

    it('handles multiple marks and unmarks', () => {
      const { result } = hook

      act(() => {
        result.current.markSquare(0)
        result.current.markSquare(1)
        result.current.markSquare(2)
        result.current.unmarkSquare(1)
      })

      expect(result.current.markedSquares.has(0)).toBe(true)
      expect(result.current.markedSquares.has(1)).toBe(false)
      expect(result.current.markedSquares.has(2)).toBe(true)
      expect(result.current.markedSquares.size).toBe(2)
    })
  })

  describe('pattern detection - LINE', () => {
    it('detects horizontal line (first row)', () => {
      const { result } = hook

      // Mark first row (indices 0-4)
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.markSquare(i)
        }
      })

      act(() => {
        const pattern = result.current.recordPattern()
        expect(pattern).not.toBeNull()
        expect(pattern?.type).toBe('LINE')
        expect(pattern?.coordinates).toEqual([
          [0, 0], [0, 1], [0, 2], [0, 3], [0, 4]
        ])
        expect(pattern?.score).toBe(100)
        expect(pattern?.multiplier).toBe(1.0)
      })

      expect(result.current.detectedPatterns.length).toBe(1)
    })

    it('detects vertical line (first column)', () => {
      const { result } = hook

      // Mark first column (indices 0, 5, 10, 15, 20)
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.markSquare(i * 5)
        }
      })

      act(() => {
        const pattern = result.current.recordPattern()
        expect(pattern).not.toBeNull()
        expect(pattern?.type).toBe('LINE')
        expect(pattern?.coordinates).toEqual([
          [0, 0], [1, 0], [2, 0], [3, 0], [4, 0]
        ])
      })

      expect(result.current.detectedPatterns.length).toBe(1)
    })

    it('does not detect incomplete line', () => {
      const { result } = hook

      // Mark only 4 squares in first row
      act(() => {
        for (let i = 0; i < 4; i++) {
          result.current.markSquare(i)
        }
      })

      act(() => {
        const pattern = result.current.recordPattern()
        expect(pattern).toBeNull()
      })

      expect(result.current.detectedPatterns.length).toBe(0)
    })
  })

  describe('pattern detection - CORNERS', () => {
    it('detects corners pattern', () => {
      const { result } = hook

      // Mark corners: 0, 4, 20, 24
      act(() => {
        result.current.markSquare(0)   // [0,0]
        result.current.markSquare(4)   // [0,4]
        result.current.markSquare(20)  // [4,0]
        result.current.markSquare(24)  // [4,4]
      })

      act(() => {
        const pattern = result.current.recordPattern()
        expect(pattern).not.toBeNull()
        expect(pattern?.type).toBe('CORNERS')
        expect(pattern?.coordinates).toEqual([
          [0, 0], [0, 4], [4, 0], [4, 4]
        ])
        expect(pattern?.score).toBe(150)
      })
    })

    it('does not detect corners with missing square', () => {
      const { result } = hook

      // Mark 3 corners, miss one
      act(() => {
        result.current.markSquare(0)   // [0,0]
        result.current.markSquare(4)   // [0,4]
        result.current.markSquare(20)  // [4,0]
        // Missing [4,4]
      })

      act(() => {
        const pattern = result.current.recordPattern()
        expect(pattern).toBeNull()
      })
    })
  })

  describe('pattern detection - FRAME', () => {
    it('detects frame pattern', () => {
      const { result } = hook

      // Mark all border squares (16 total)
      const frameIndices = [
        // Top row
        0, 1, 2, 3, 4,
        // Bottom row
        20, 21, 22, 23, 24,
        // Left column (excluding corners)
        5, 10, 15,
        // Right column (excluding corners)
        9, 14, 19
      ]

      act(() => {
        frameIndices.forEach(index => result.current.markSquare(index))
      })

      act(() => {
        const pattern = result.current.recordPattern()
        expect(pattern).not.toBeNull()
        expect(pattern?.type).toBe('FRAME')
        expect(pattern?.coordinates.length).toBe(16)
        expect(pattern?.score).toBe(200)
      })
    })
  })

  describe('pattern detection - PLUS', () => {
    it('detects plus pattern', () => {
      const { result } = hook

      // Mark center and cardinal directions: 12(center), 7(top), 17(bottom), 11(left), 13(right)
      act(() => {
        result.current.markSquare(12) // [2,2] center
        result.current.markSquare(7)  // [1,2] top
        result.current.markSquare(17) // [3,2] bottom
        result.current.markSquare(11) // [2,1] left
        result.current.markSquare(13) // [2,3] right
      })

      act(() => {
        const pattern = result.current.recordPattern()
        expect(pattern).not.toBeNull()
        expect(pattern?.type).toBe('PLUS')
        expect(pattern?.coordinates).toEqual([
          [2, 2], [1, 2], [3, 2], [2, 1], [2, 3]
        ])
        expect(pattern?.score).toBe(175)
      })
    })
  })

  describe('pattern detection - FULL_HOUSE', () => {
    it('detects full house pattern', () => {
      const { result } = hook

      // Mark all 25 squares
      act(() => {
        for (let i = 0; i < 25; i++) {
          result.current.markSquare(i)
        }
      })

      act(() => {
        const pattern = result.current.recordPattern()
        expect(pattern).not.toBeNull()
        expect(pattern?.type).toBe('FULL_HOUSE')
        expect(pattern?.coordinates.length).toBe(25)
        expect(pattern?.score).toBe(500)
      })
    })
  })

  describe('multipliers', () => {
    it('applies correct multipliers for multiple patterns', () => {
      const { result } = hook

      // First pattern (1.0x)
      act(() => {
        // Mark corners
        result.current.markSquare(0)
        result.current.markSquare(4)
        result.current.markSquare(20)
        result.current.markSquare(24)
      })

      act(() => {
        result.current.recordPattern()
      })

      expect(result.current.getNextMultiplier()).toBe(1.5) // Next will be 1.5x

      // Second pattern (1.5x)
      act(() => {
        // Mark horizontal line (first row, but corners already marked)
        result.current.markSquare(1)
        result.current.markSquare(2)
        result.current.markSquare(3)
      })

      act(() => {
        result.current.recordPattern()
      })

      expect(result.current.detectedPatterns.length).toBe(2)
      expect(result.current.detectedPatterns[0].multiplier).toBe(1.0)
      expect(result.current.detectedPatterns[1].multiplier).toBe(1.5)
      expect(result.current.getNextMultiplier()).toBe(2.0) // Next will be 2.0x
    })

    it('caps multiplier at maximum', () => {
      const { result } = hook

      // Create 5 patterns to test multiplier capping
      for (let i = 0; i < 5; i++) {
        act(() => {
          // Mark corners for each pattern (reset between)
          result.current.reset()
          result.current.markSquare(0)
          result.current.markSquare(4)
          result.current.markSquare(20)
          result.current.markSquare(24)
          result.current.recordPattern()
        })
      }

      expect(result.current.detectedPatterns.length).toBe(5)
      expect(result.current.detectedPatterns[4].multiplier).toBe(2.5) // Max multiplier
      expect(result.current.getNextMultiplier()).toBe(2.5) // Stays at max
    })
  })

  describe('scoring', () => {
    it('calculates total score correctly', () => {
      const { result } = hook

      // First pattern: CORNERS (150) * 1.0 = 150
      act(() => {
        result.current.markSquare(0)
        result.current.markSquare(4)
        result.current.markSquare(20)
        result.current.markSquare(24)
        result.current.recordPattern()
      })

      expect(result.current.getTotalScore()).toBe(150)

      // Second pattern: LINE (100) * 1.5 = 150, total = 300
      act(() => {
        result.current.reset()
        for (let i = 0; i < 5; i++) {
          result.current.markSquare(i)
        }
        result.current.recordPattern()
      })

      expect(result.current.getTotalScore()).toBe(300)
    })
  })

  describe('reset functionality', () => {
    it('resets all state', () => {
      const { result } = hook

      act(() => {
        result.current.markSquare(0)
        result.current.markSquare(1)
        // Mark corners for pattern
        result.current.markSquare(4)
        result.current.markSquare(20)
        result.current.markSquare(24)
        result.current.recordPattern()
      })

      expect(result.current.markedSquares.size).toBeGreaterThan(0)
      expect(result.current.detectedPatterns.length).toBeGreaterThan(0)

      act(() => {
        result.current.reset()
      })

      expect(result.current.markedSquares.size).toBe(0)
      expect(result.current.detectedPatterns.length).toBe(0)
      expect(result.current.getTotalScore()).toBe(0)
      expect(result.current.getNextMultiplier()).toBe(1.0)
    })
  })

  describe('duplicate pattern prevention', () => {
    it('does not record the same pattern twice', () => {
      const { result } = hook

      // Mark corners
      act(() => {
        result.current.markSquare(0)
        result.current.markSquare(4)
        result.current.markSquare(20)
        result.current.markSquare(24)
        result.current.recordPattern()
      })

      expect(result.current.detectedPatterns.length).toBe(1)

      // Try to record same pattern again
      act(() => {
        const pattern = result.current.recordPattern()
        expect(pattern).toBeNull()
      })

      expect(result.current.detectedPatterns.length).toBe(1)
    })
  })
})