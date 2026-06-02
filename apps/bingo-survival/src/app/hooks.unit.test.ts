/**
 * Unit tests for bingo-survival hooks.
 */

import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useLevelProgression } from './hooks'

describe('useLevelProgression', () => {
  it('starts at level 1 with calm phase and 10% progress', () => {
    const { result } = renderHook(() => useLevelProgression())

    expect(result.current.currentLevel).toBe(1)
    expect(result.current.isGameOver).toBe(false)
    expect(result.current.getPhaseLabel()).toBe('Calm')
    expect(result.current.getProgressPercentage()).toBe(10)
  })

  it('advances levels until capped at level 10', () => {
    const { result } = renderHook(() => useLevelProgression())

    for (let i = 0; i < 12; i++) {
      act(() => {
        result.current.advanceLevel()
      })
    }

    expect(result.current.currentLevel).toBe(10)
  })

  it('marks game over when advancing beyond max level', () => {
    const { result } = renderHook(() => useLevelProgression())

    for (let i = 0; i < 9; i++) {
      act(() => {
        result.current.advanceLevel()
      })
    }
    expect(result.current.currentLevel).toBe(10)
    expect(result.current.isGameOver).toBe(false)

    act(() => {
      result.current.advanceLevel()
    })
    expect(result.current.isGameOver).toBe(true)
  })

  it('resets progression to initial state', () => {
    const { result } = renderHook(() => useLevelProgression())

    for (let i = 0; i < 9; i++) {
      act(() => {
        result.current.advanceLevel()
      })
    }
    act(() => {
      result.current.advanceLevel()
    })
    expect(result.current.isGameOver).toBe(true)

    act(() => {
      result.current.resetProgression()
    })
    expect(result.current.currentLevel).toBe(1)
    expect(result.current.isGameOver).toBe(false)
    expect(result.current.getPhaseLabel()).toBe('Calm')
  })

  it('returns expected time limit for current level phase', () => {
    const { result } = renderHook(() => useLevelProgression())
    expect(result.current.getLevelTimeLimit()).toBe(120)

    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.advanceLevel()
      })
    }
    expect(result.current.currentLevel).toBe(4)
    expect(result.current.getLevelTimeLimit()).toBe(90)

    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.advanceLevel()
      })
    }
    expect(result.current.currentLevel).toBe(7)
    expect(result.current.getLevelTimeLimit()).toBe(60)
  })

  it('returns expected phase labels across progression', () => {
    const { result } = renderHook(() => useLevelProgression())
    expect(result.current.getPhaseLabel()).toBe('Calm')

    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.advanceLevel()
      })
    }
    expect(result.current.getPhaseLabel()).toBe('Acceleration')

    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.advanceLevel()
      })
    }
    expect(result.current.getPhaseLabel()).toBe('Intense')

    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.advanceLevel()
      })
    }
    expect(result.current.getPhaseLabel()).toBe('Expert')
  })

  it('multiplier increases as level increases', () => {
    const { result } = renderHook(() => useLevelProgression())
    const level1 = result.current.getLevelMultiplier()

    act(() => {
      result.current.advanceLevel()
    })
    const level2 = result.current.getLevelMultiplier()

    act(() => {
      result.current.advanceLevel()
    })
    const level3 = result.current.getLevelMultiplier()

    expect(level2).toBeGreaterThan(level1)
    expect(level3).toBeGreaterThan(level2)
  })

  it('score increases as level increases', () => {
    const { result } = renderHook(() => useLevelProgression())
    const level1 = result.current.getLevelScore()

    act(() => {
      result.current.advanceLevel()
    })
    const level2 = result.current.getLevelScore()

    act(() => {
      result.current.advanceLevel()
    })
    const level3 = result.current.getLevelScore()

    expect(level2).toBeGreaterThan(level1)
    expect(level3).toBeGreaterThan(level2)
  })

  it('progress reaches 100% at level 10', () => {
    const { result } = renderHook(() => useLevelProgression())

    for (let i = 0; i < 9; i++) {
      act(() => {
        result.current.advanceLevel()
      })
    }

    expect(result.current.currentLevel).toBe(10)
    expect(result.current.getProgressPercentage()).toBe(100)
  })
})
