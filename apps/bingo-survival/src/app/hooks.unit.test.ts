/**
 * Unit tests for bingo-survival hooks
 * Tests useLevelProgression hook functionality
 */

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLevelProgression } from '../hooks'

describe('useLevelProgression', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts at level 1', () => {
      const { result } = renderHook(() => useLevelProgression())

      expect(result.current.currentLevel).toBe(1)
    })

    it('is not game over initially', () => {
      const { result } = renderHook(() => useLevelProgression())

      expect(result.current.isGameOver).toBe(false)
    })

    it('has correct initial phase label', () => {
      const { result } = renderHook(() => useLevelProgression())

      expect(result.current.getPhaseLabel()).toBe('Phase 1')
    })
  })

  describe('level progression', () => {
    it('advances to next level when advanceLevel is called', () => {
      const { result } = renderHook(() => useLevelProgression())

      act(() => {
        result.current.advanceLevel()
      })

      expect(result.current.currentLevel).toBe(2)
    })

    it('does not advance beyond level 10', () => {
      const { result } = renderHook(() => useLevelProgression())

      // Advance to level 10
      for (let i = 1; i < 10; i++) {
        act(() => {
          result.current.advanceLevel()
        })
      }

      expect(result.current.currentLevel).toBe(10)

      // Try to advance further
      act(() => {
        result.current.advanceLevel()
      })

      expect(result.current.currentLevel).toBe(10)
      expect(result.current.isGameOver).toBe(true)
    })

    it('resets to level 1 when resetProgression is called', () => {
      const { result } = renderHook(() => useLevelProgression())

      act(() => {
        result.current.advanceLevel()
        result.current.advanceLevel()
      })

      expect(result.current.currentLevel).toBe(3)

      act(() => {
        result.current.resetProgression()
      })

      expect(result.current.currentLevel).toBe(1)
      expect(result.current.isGameOver).toBe(false)
    })
  })

  describe('level time limits', () => {
    it('returns correct time limits for each level', () => {
      const { result } = renderHook(() => useLevelProgression())

      // Level 1-3: 120 seconds
      expect(result.current.getLevelTimeLimit(1)).toBe(120)
      expect(result.current.getLevelTimeLimit(2)).toBe(120)
      expect(result.current.getLevelTimeLimit(3)).toBe(120)

      // Level 4-6: 90 seconds
      expect(result.current.getLevelTimeLimit(4)).toBe(90)
      expect(result.current.getLevelTimeLimit(5)).toBe(90)
      expect(result.current.getLevelTimeLimit(6)).toBe(90)

      // Level 7-9: 60 seconds
      expect(result.current.getLevelTimeLimit(7)).toBe(60)
      expect(result.current.getLevelTimeLimit(8)).toBe(60)
      expect(result.current.getLevelTimeLimit(9)).toBe(60)

      // Level 10: 45 seconds
      expect(result.current.getLevelTimeLimit(10)).toBe(45)
    })

    it('returns 120 seconds for invalid level numbers', () => {
      const { result } = renderHook(() => useLevelProgression())

      expect(result.current.getLevelTimeLimit(0)).toBe(120)
      expect(result.current.getLevelTimeLimit(11)).toBe(120)
      expect(result.current.getLevelTimeLimit(-1)).toBe(120)
    })
  })

  describe('level multipliers', () => {
    it('returns correct multipliers for each level', () => {
      const { result } = renderHook(() => useLevelProgression())

      expect(result.current.getLevelMultiplier(1)).toBe(1.05)
      expect(result.current.getLevelMultiplier(2)).toBe(1.05)
      expect(result.current.getLevelMultiplier(3)).toBe(1.05)
      expect(result.current.getLevelMultiplier(4)).toBe(1.05)
      expect(result.current.getLevelMultiplier(5)).toBe(1.05)
      expect(result.current.getLevelMultiplier(6)).toBe(1.05)
      expect(result.current.getLevelMultiplier(7)).toBe(1.05)
      expect(result.current.getLevelMultiplier(8)).toBe(1.05)
      expect(result.current.getLevelMultiplier(9)).toBe(1.05)
      expect(result.current.getLevelMultiplier(10)).toBe(1.05)
    })

    it('returns 1.05 for invalid level numbers', () => {
      const { result } = renderHook(() => useLevelProgression())

      expect(result.current.getLevelMultiplier(0)).toBe(1.05)
      expect(result.current.getLevelMultiplier(11)).toBe(1.05)
    })
  })

  describe('level scoring', () => {
    it('calculates correct base score for each level', () => {
      const { result } = renderHook(() => useLevelProgression())

      expect(result.current.getLevelScore(1)).toBe(100)
      expect(result.current.getLevelScore(2)).toBe(200)
      expect(result.current.getLevelScore(3)).toBe(300)
      expect(result.current.getLevelScore(4)).toBe(400)
      expect(result.current.getLevelScore(5)).toBe(500)
      expect(result.current.getLevelScore(6)).toBe(600)
      expect(result.current.getLevelScore(7)).toBe(700)
      expect(result.current.getLevelScore(8)).toBe(800)
      expect(result.current.getLevelScore(9)).toBe(900)
      expect(result.current.getLevelScore(10)).toBe(1000)
    })

    it('returns 100 for invalid level numbers', () => {
      const { result } = renderHook(() => useLevelProgression())

      expect(result.current.getLevelScore(0)).toBe(100)
      expect(result.current.getLevelScore(11)).toBe(100)
    })
  })

  describe('progress percentage', () => {
    it('returns 0% at level 1', () => {
      const { result } = renderHook(() => useLevelProgression())

      expect(result.current.getProgressPercentage()).toBe(0)
    })

    it('returns 10% at level 2', () => {
      const { result } = renderHook(() => useLevelProgression())

      act(() => {
        result.current.advanceLevel()
      })

      expect(result.current.getProgressPercentage()).toBe(10)
    })

    it('returns 100% at level 10', () => {
      const { result } = renderHook(() => useLevelProgression())

      for (let i = 1; i < 10; i++) {
        act(() => {
          result.current.advanceLevel()
        })
      }

      expect(result.current.getProgressPercentage()).toBe(100)
    })
  })

  describe('phase labels', () => {
    it('returns correct phase labels', () => {
      const { result } = renderHook(() => useLevelProgression())

      expect(result.current.getPhaseLabel()).toBe('Phase 1')

      act(() => {
        result.current.advanceLevel()
        result.current.advanceLevel()
        result.current.advanceLevel()
      })

      expect(result.current.getPhaseLabel()).toBe('Phase 2')

      act(() => {
        result.current.advanceLevel()
        result.current.advanceLevel()
        result.current.advanceLevel()
      })

      expect(result.current.getPhaseLabel()).toBe('Phase 3')

      act(() => {
        result.current.advanceLevel()
        result.current.advanceLevel()
        result.current.advanceLevel()
        result.current.advanceLevel()
      })

      expect(result.current.getPhaseLabel()).toBe('Phase 4')
    })
  })

  describe('game over state', () => {
    it('is not game over until level 10 is reached', () => {
      const { result } = renderHook(() => useLevelProgression())

      for (let i = 1; i < 10; i++) {
        expect(result.current.isGameOver).toBe(false)
        act(() => {
          result.current.advanceLevel()
        })
      }

      expect(result.current.isGameOver).toBe(true)
    })

    it('remains game over after reaching level 10', () => {
      const { result } = renderHook(() => useLevelProgression())

      // Reach level 10
      for (let i = 1; i < 10; i++) {
        act(() => {
          result.current.advanceLevel()
        })
      }

      expect(result.current.isGameOver).toBe(true)

      // Try to advance further
      act(() => {
        result.current.advanceLevel()
      })

      expect(result.current.isGameOver).toBe(true)
    })

    it('resets game over state when reset is called', () => {
      const { result } = renderHook(() => useLevelProgression())

      // Reach level 10
      for (let i = 1; i < 10; i++) {
        act(() => {
          result.current.advanceLevel()
        })
      }

      expect(result.current.isGameOver).toBe(true)

      act(() => {
        result.current.resetProgression()
      })

      expect(result.current.isGameOver).toBe(false)
    })
  })
})
