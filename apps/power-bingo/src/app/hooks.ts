/**
 * React hooks for Power Bingo
 * Power-up management and strategic abilities
 */

import type { DifficultyConfig } from '@games/bingo-core'
import { useCallback, useState } from 'react'
import { POWER_UP_EARNING_RATES, POWER_UP_EFFECTS, POWER_UP_INVENTORY_MAX } from '../domain'

/**
 * Types of power-ups available in Power Bingo
 */
export type PowerUpType =
  | 'AUTO_MARK'
  | 'INSTANT_PATTERN'
  | 'DOUBLE_POINTS'
  | 'SHIELD'
  | 'TIME_EXTEND'

/**
 * Represents a single power-up in inventory
 */
export interface PowerUp {
  type: PowerUpType
  usageCount: number
  maxUsages: number
  isActive: boolean
}

/**
 * Hook for managing power-up inventory and activation
 * Strategic ability system with earning and spending mechanics
 *
 * Power-ups:
 * - AUTO_MARK: Auto-marks next 3 called numbers
 * - INSTANT_PATTERN: Completes any one pattern immediately
 * - DOUBLE_POINTS: Next pattern worth 2x points
 * - SHIELD: Prevents next penalty from being applied
 * - TIME_EXTEND: Extends round by X seconds (varies by variant)
 *
 * Earning Rates:
 * - easy: 1 power-up per pattern
 * - medium: 1 power-up per 1.5 patterns (0.67)
 * - hard: 1 power-up per 2 patterns (0.5)
 * - expert: 1 power-up per 3 patterns (0.33)
 */
export const usePowerUpManager = (difficulty: DifficultyConfig) => {
  const [inventory, setInventory] = useState<PowerUp[]>([
    { type: 'AUTO_MARK', usageCount: 0, maxUsages: POWER_UP_EFFECTS.AUTO_MARK, isActive: false },
    {
      type: 'INSTANT_PATTERN',
      usageCount: 0,
      maxUsages: POWER_UP_EFFECTS.INSTANT_PATTERN,
      isActive: false,
    },
    {
      type: 'DOUBLE_POINTS',
      usageCount: 0,
      maxUsages: POWER_UP_EFFECTS.DOUBLE_POINTS,
      isActive: false,
    },
    { type: 'SHIELD', usageCount: 0, maxUsages: POWER_UP_EFFECTS.SHIELD, isActive: false },
    {
      type: 'TIME_EXTEND',
      usageCount: 0,
      maxUsages: POWER_UP_EFFECTS.TIME_EXTEND,
      isActive: false,
    },
  ])

  const [totalPatternsCompleted, setTotalPatternsCompleted] = useState(0)
  const [totalPowerUpsEarned, setTotalPowerUpsEarned] = useState(0)

  /**
   * Gets the earning rate for current difficulty
   */
  const getEarningRate = useCallback(() => {
    return (
      POWER_UP_EARNING_RATES[difficulty as keyof typeof POWER_UP_EARNING_RATES] ||
      POWER_UP_EARNING_RATES.medium
    )
  }, [difficulty])

  /**
   * Records pattern completion and awards power-ups
   */
  const recordPatternCompletion = useCallback(() => {
    setTotalPatternsCompleted((prev) => {
      const newCount = prev + 1
      const earningRate = getEarningRate()

      // Calculate how many power-ups should be earned
      const newEarned = Math.floor(newCount * earningRate)
      const previousEarned = Math.floor(prev * earningRate)
      const powerupsToAward = newEarned - previousEarned

      if (powerupsToAward > 0) {
        setTotalPowerUpsEarned((prevEarned) => prevEarned + powerupsToAward)
        awardRandomPowerUp(powerupsToAward)
      }

      return newCount
    })
  }, [getEarningRate])

  /**
   * Awards random power-ups to reach the target count
   */
  const awardRandomPowerUp = useCallback((count: number) => {
    setInventory((prev) => {
      const updated = [...prev]
      let awarded = 0

      for (let i = 0; i < count && awarded < POWER_UP_INVENTORY_MAX; i++) {
        // Find power-ups that can still be earned
        const availablePowerUps = updated.filter((pu) => pu.usageCount < pu.maxUsages)

        if (availablePowerUps.length === 0) break // Inventory full

        // Random selection from available
        const randomIndex = Math.floor(Math.random() * availablePowerUps.length)
        const selectedPowerUp = availablePowerUps[randomIndex]

        // Find and increment in original array
        const originalIndex = updated.findIndex((pu) => pu.type === selectedPowerUp.type)
        if (originalIndex !== -1) {
          updated[originalIndex] = {
            ...updated[originalIndex],
            usageCount: updated[originalIndex].usageCount + 1,
          }
          awarded++
        }
      }

      return updated
    })
  }, [])

  /**
   * Activates a power-up by type
   */
  const activatePowerUp = useCallback((type: PowerUpType): boolean => {
    setInventory((prev) => {
      const powerUpIndex = prev.findIndex((pu) => pu.type === type)

      if (powerUpIndex === -1 || prev[powerUpIndex].usageCount === 0) {
        return prev // Can't activate - not found or no uses left
      }

      const updated = [...prev]
      updated[powerUpIndex] = {
        ...updated[powerUpIndex],
        usageCount: updated[powerUpIndex].usageCount - 1,
        isActive: true,
      }

      return updated
    })

    return true
  }, [])

  /**
   * Deactivates a power-up (after use)
   */
  const deactivatePowerUp = useCallback((type: PowerUpType) => {
    setInventory((prev) => prev.map((pu) => (pu.type === type ? { ...pu, isActive: false } : pu)))
  }, [])

  /**
   * Gets count of remaining uses for a power-up
   */
  const getRemainingUses = useCallback(
    (type: PowerUpType): number => {
      const powerUp = inventory.find((pu) => pu.type === type)
      return powerUp?.usageCount || 0
    },
    [inventory],
  )

  /**
   * Checks if inventory is full
   */
  const isInventoryFull = useCallback(() => {
    const totalUses = inventory.reduce((sum, pu) => sum + pu.usageCount, 0)
    return totalUses >= POWER_UP_INVENTORY_MAX
  }, [inventory])

  /**
   * Gets next power-up to earn based on pattern progress
   */
  const getProgressToNextPowerUp = useCallback(() => {
    const rate = getEarningRate()
    const nextMilestone = (totalPowerUpsEarned + 1) / rate

    return {
      patternsNeeded: Math.ceil(nextMilestone - totalPatternsCompleted),
      patternsCompleted: totalPatternsCompleted,
      isNextAvailable: nextMilestone <= totalPatternsCompleted,
    }
  }, [totalPatternsCompleted, totalPowerUpsEarned, getEarningRate])

  /**
   * Gets multiplier for double points power-up
   */
  const getDoublePointsMultiplier = useCallback(() => {
    const doublePointsPowerUp = inventory.find((pu) => pu.type === 'DOUBLE_POINTS')
    return doublePointsPowerUp?.isActive ? 2 : 1
  }, [inventory])

  /**
   * Resets power-up manager for new game
   */
  const resetManager = useCallback(() => {
    setInventory([
      { type: 'AUTO_MARK', usageCount: 0, maxUsages: POWER_UP_EFFECTS.AUTO_MARK, isActive: false },
      {
        type: 'INSTANT_PATTERN',
        usageCount: 0,
        maxUsages: POWER_UP_EFFECTS.INSTANT_PATTERN,
        isActive: false,
      },
      {
        type: 'DOUBLE_POINTS',
        usageCount: 0,
        maxUsages: POWER_UP_EFFECTS.DOUBLE_POINTS,
        isActive: false,
      },
      { type: 'SHIELD', usageCount: 0, maxUsages: POWER_UP_EFFECTS.SHIELD, isActive: false },
      {
        type: 'TIME_EXTEND',
        usageCount: 0,
        maxUsages: POWER_UP_EFFECTS.TIME_EXTEND,
        isActive: false,
      },
    ])
    setTotalPatternsCompleted(0)
    setTotalPowerUpsEarned(0)
  }, [])

  /**
   * Computed progress to next power-up (0-1)
   */
  const progressToNextPowerUp = useMemo(() => {
    const progress = getProgressToNextPowerUp()
    return progress.patternsCompleted / progress.patternsNeeded
  }, [getProgressToNextPowerUp])

  /**
   * Next power-up type that will be earned
   */
  const nextPowerUpType = useMemo(() => {
    const progress = getProgressToNextPowerUp()
    if (progress.isNextAvailable) {
      // Determine next power-up based on earning rate
      const nextIndex = totalPowerUpsEarned % POWER_UP_TYPES.length
      return POWER_UP_TYPES[nextIndex]
    }
    return POWER_UP_TYPES[0] // Default to first type
  }, [getProgressToNextPowerUp, totalPowerUpsEarned])

  return {
    inventory,
    totalPatternsCompleted,
    totalPowerUpsEarned,
    recordPatternCompletion,
    activatePowerUp,
    deactivatePowerUp,
    getRemainingUses,
    isInventoryFull,
    getProgressToNextPowerUp,
    progressToNextPowerUp,
    nextPowerUpType,
    getDoublePointsMultiplier,
    resetManager,
  }
}
