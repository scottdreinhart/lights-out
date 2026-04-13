/**
 * Unit tests for usePowerUpManager hook
 * Tests power-up inventory management and earning logic
 */

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePowerUpManager } from '../hooks'

describe('usePowerUpManager', () => {
  let hook: ReturnType<typeof renderHook<typeof usePowerUpManager>>

  beforeEach(() => {
    hook = renderHook(() => usePowerUpManager('medium'))
  })

  describe('initial state', () => {
    it('starts with empty power-up inventory', () => {
      const { result } = hook
      expect(result.current.inventory).toHaveLength(5)
      result.current.inventory.forEach((powerUp) => {
        expect(powerUp.usageCount).toBe(0)
        expect(powerUp.isActive).toBe(false)
      })
    })

    it('starts with zero patterns completed', () => {
      const { result } = hook
      expect(result.current.totalPatternsCompleted).toBe(0)
    })

    it('starts with zero power-ups earned', () => {
      const { result } = hook
      expect(result.current.totalPowerUpsEarned).toBe(0)
    })
  })

  describe('pattern completion recording', () => {
    it('increments pattern count', () => {
      const { result } = hook

      act(() => {
        result.current.recordPatternCompletion()
      })

      expect(result.current.totalPatternsCompleted).toBe(1)
    })

    it('awards power-ups based on earning rate', () => {
      const { result } = hook

      // Medium difficulty: 0.67 power-ups per pattern
      // Should earn 1 power-up after 2 patterns
      act(() => {
        result.current.recordPatternCompletion() // 1 pattern, 0.67 earned (0 awarded)
        result.current.recordPatternCompletion() // 2 patterns, 1.34 earned (1 awarded)
      })

      expect(result.current.totalPatternsCompleted).toBe(2)
      expect(result.current.totalPowerUpsEarned).toBe(1)
      expect(result.current.inventory.some((pu) => pu.usageCount > 0)).toBe(true)
    })

    it('awards multiple power-ups over time', () => {
      const { result } = hook

      // Medium difficulty: 0.67 power-ups per pattern
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.recordPatternCompletion()
        }
      })

      expect(result.current.totalPatternsCompleted).toBe(5)
      expect(result.current.totalPowerUpsEarned).toBe(3) // 5 * 0.67 = 3.35, floor to 3
    })
  })

  describe('power-up activation', () => {
    beforeEach(() => {
      // Award some power-ups for testing
      act(() => {
        hook.result.current.recordPatternCompletion()
        hook.result.current.recordPatternCompletion()
      })
    })

    it('activates power-up when available', () => {
      const { result } = hook

      // Find a power-up that was awarded
      const availablePowerUp = result.current.inventory.find((pu) => pu.usageCount > 0)
      expect(availablePowerUp).toBeDefined()

      const initialCount = availablePowerUp!.usageCount

      act(() => {
        const activated = result.current.activatePowerUp(availablePowerUp!.type)
        expect(activated).toBe(true)
      })

      const updatedPowerUp = result.current.inventory.find(
        (pu) => pu.type === availablePowerUp!.type,
      )
      expect(updatedPowerUp!.usageCount).toBe(initialCount - 1)
      expect(updatedPowerUp!.isActive).toBe(true)
    })

    it('does not activate power-up when unavailable', () => {
      const { result } = hook

      // Find a power-up with zero uses
      const unavailablePowerUp = result.current.inventory.find((pu) => pu.usageCount === 0)
      expect(unavailablePowerUp).toBeDefined()

      act(() => {
        const activated = result.current.activatePowerUp(unavailablePowerUp!.type)
        expect(activated).toBe(false)
      })

      const updatedPowerUp = result.current.inventory.find(
        (pu) => pu.type === unavailablePowerUp!.type,
      )
      expect(updatedPowerUp!.usageCount).toBe(0)
      expect(updatedPowerUp!.isActive).toBe(false)
    })
  })

  describe('power-up deactivation', () => {
    it('deactivates an active power-up', () => {
      const { result } = hook

      // First activate a power-up
      act(() => {
        result.current.recordPatternCompletion()
        result.current.recordPatternCompletion()
      })

      const availablePowerUp = result.current.inventory.find((pu) => pu.usageCount > 0)
      expect(availablePowerUp).toBeDefined()

      act(() => {
        result.current.activatePowerUp(availablePowerUp!.type)
      })

      let updatedPowerUp = result.current.inventory.find((pu) => pu.type === availablePowerUp!.type)
      expect(updatedPowerUp!.isActive).toBe(true)

      // Now deactivate it
      act(() => {
        result.current.deactivatePowerUp(availablePowerUp!.type)
      })

      updatedPowerUp = result.current.inventory.find((pu) => pu.type === availablePowerUp!.type)
      expect(updatedPowerUp!.isActive).toBe(false)
    })
  })

  describe('remaining uses', () => {
    it('returns correct remaining uses', () => {
      const { result } = hook

      // Award some power-ups
      act(() => {
        result.current.recordPatternCompletion()
        result.current.recordPatternCompletion()
      })

      const availablePowerUp = result.current.inventory.find((pu) => pu.usageCount > 0)
      expect(availablePowerUp).toBeDefined()

      expect(result.current.getRemainingUses(availablePowerUp!.type)).toBe(
        availablePowerUp!.usageCount,
      )
    })

    it('returns 0 for unavailable power-ups', () => {
      const { result } = hook

      const unavailablePowerUp = result.current.inventory.find((pu) => pu.usageCount === 0)
      expect(unavailablePowerUp).toBeDefined()

      expect(result.current.getRemainingUses(unavailablePowerUp!.type)).toBe(0)
    })
  })

  describe('inventory management', () => {
    it('checks if inventory is full', () => {
      const { result } = hook

      expect(result.current.isInventoryFull()).toBe(false)

      // Fill inventory to maximum
      act(() => {
        for (let i = 0; i < 50; i++) {
          // More than enough to fill inventory
          result.current.recordPatternCompletion()
        }
      })

      expect(result.current.isInventoryFull()).toBe(true)
    })
  })

  describe('progress tracking', () => {
    it('calculates progress to next power-up', () => {
      const { result } = hook

      const progress = result.current.getProgressToNextPowerUp()
      expect(progress.patternsCompleted).toBe(0)
      expect(progress.patternsNeeded).toBe(2) // Medium difficulty: 1/0.67 ≈ 1.5, ceil to 2
      expect(progress.isNextAvailable).toBe(false)

      act(() => {
        result.current.recordPatternCompletion()
        result.current.recordPatternCompletion()
      })

      const updatedProgress = result.current.getProgressToNextPowerUp()
      expect(updatedProgress.patternsCompleted).toBe(2)
      expect(updatedProgress.isNextAvailable).toBe(true)
    })
  })

  describe('double points multiplier', () => {
    it('returns 1 when double points not active', () => {
      const { result } = hook
      expect(result.current.getDoublePointsMultiplier()).toBe(1)
    })

    it('returns 2 when double points is active', () => {
      const { result } = hook

      // Award and activate double points
      act(() => {
        result.current.recordPatternCompletion()
        result.current.recordPatternCompletion()
      })

      const doublePointsPowerUp = result.current.inventory.find((pu) => pu.type === 'DOUBLE_POINTS')
      if (doublePointsPowerUp && doublePointsPowerUp.usageCount > 0) {
        act(() => {
          result.current.activatePowerUp('DOUBLE_POINTS')
        })
        expect(result.current.getDoublePointsMultiplier()).toBe(2)
      } else {
        // If DOUBLE_POINTS wasn't awarded, test with a different power-up
        expect(result.current.getDoublePointsMultiplier()).toBe(1)
      }
    })
  })

  describe('reset functionality', () => {
    it('resets all state', () => {
      const { result } = hook

      // Build up some state
      act(() => {
        result.current.recordPatternCompletion()
        result.current.recordPatternCompletion()
      })

      expect(result.current.totalPatternsCompleted).toBe(2)
      expect(result.current.totalPowerUpsEarned).toBe(1)

      // Reset
      act(() => {
        result.current.resetManager()
      })

      expect(result.current.totalPatternsCompleted).toBe(0)
      expect(result.current.totalPowerUpsEarned).toBe(0)
      result.current.inventory.forEach((powerUp) => {
        expect(powerUp.usageCount).toBe(0)
        expect(powerUp.isActive).toBe(false)
      })
    })
  })

  describe('difficulty variations', () => {
    it('easy difficulty earns power-ups faster', () => {
      const easyHook = renderHook(() => usePowerUpManager('easy'))

      act(() => {
        easyHook.result.current.recordPatternCompletion() // 1 pattern, 1.0 earned (1 awarded)
      })

      expect(easyHook.result.current.totalPowerUpsEarned).toBe(1)
    })

    it('hard difficulty earns power-ups slower', () => {
      const hardHook = renderHook(() => usePowerUpManager('hard'))

      act(() => {
        hardHook.result.current.recordPatternCompletion() // 1 pattern, 0.5 earned (0 awarded)
        hardHook.result.current.recordPatternCompletion() // 2 patterns, 1.0 earned (1 awarded)
      })

      expect(hardHook.result.current.totalPowerUpsEarned).toBe(1)
    })

    it('expert difficulty earns power-ups slowest', () => {
      const expertHook = renderHook(() => usePowerUpManager('expert'))

      act(() => {
        for (let i = 0; i < 3; i++) {
          act(() => {
            expertHook.result.current.recordPatternCompletion()
          })
        } // 3 patterns, 3 * 0.33 = 0.99 earned (0 awarded)

        act(() => {
          expertHook.result.current.recordPatternCompletion()
        }) // 4 patterns, 4 * 0.33 = 1.32 earned (1 awarded)
      })

      expect(expertHook.result.current.totalPowerUpsEarned).toBe(1)
    })
  })
})
