/**
 * React hooks for Bingo Survival
 * Level progression and difficulty scaling
 */

import { useCallback, useMemo, useState } from 'react'
import { LEVEL_BONUS_MULTIPLIERS, LEVEL_TIME_LIMITS, SURVIVAL_BASE_POINTS } from '../domain'

/**
 * Hook for managing level progression in Bingo Survival
 * Tracks current level, time limits, and difficulty scaling
 *
 * Features:
 * - 10 levels with decreasing time limits (120s → 45s)
 * - Bonus multiplier increases by 5% per level
 * - Level-based score scaling
 *
 * Progression:
 * - Levels 1-3: 120 seconds (calm phase)
 * - Levels 4-6: 90 seconds (acceleration phase)
 * - Levels 7-9: 60 seconds (intense phase)
 * - Level 10: 45 seconds (expert phase)
 */
export const useLevelProgression = (maxLevel: number = 10) => {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [isGameOver, setIsGameOver] = useState(false)

  const getLevelTimeLimit = useCallback(() => {
    if (currentLevel > maxLevel || currentLevel < 1) return 0
    return LEVEL_TIME_LIMITS[currentLevel - 1] // 0-indexed
  }, [currentLevel, maxLevel])

  const getLevelMultiplier = useCallback(() => {
    if (currentLevel > maxLevel || currentLevel < 1) return 1
    return Math.pow(LEVEL_BONUS_MULTIPLIERS, currentLevel - 1)
  }, [currentLevel, maxLevel])

  const getLevelScore = useCallback(() => {
    const baseScore = SURVIVAL_BASE_POINTS
    const multiplier = getLevelMultiplier()
    return Math.floor(baseScore * multiplier)
  }, [getLevelMultiplier])

  const advanceLevel = useCallback(() => {
    setCurrentLevel((prev) => {
      if (prev >= maxLevel) {
        // Game over - reached final level (level 10 complete means game over)
        setIsGameOver(true)
        return prev
      }
      return prev + 1
    })
  }, [maxLevel])

  const getProgressPercentage = useCallback(() => {
    return (currentLevel / maxLevel) * 100
  }, [currentLevel, maxLevel])

  const getPhaseLabel = useCallback((): string => {
    if (currentLevel <= 3) return 'Calm'
    if (currentLevel <= 6) return 'Acceleration'
    if (currentLevel <= 9) return 'Intense'
    return 'Expert'
  }, [currentLevel])

  const resetProgression = useCallback(() => {
    setCurrentLevel(1)
    setIsGameOver(false)
  }, [])

  // Computed properties for components
  const totalLevels = useMemo(() => maxLevel, [maxLevel])
  const phaseLabel = useMemo(() => getPhaseLabel(), [getPhaseLabel])
  const progressPercentage = useMemo(() => getProgressPercentage(), [getProgressPercentage])

  return {
    currentLevel,
    isGameOver,
    totalLevels,
    phaseLabel,
    progressPercentage,
    getLevelTimeLimit,
    getLevelMultiplier,
    getLevelScore,
    advanceLevel,
    getProgressPercentage,
    getPhaseLabel,
    resetProgression,
  }
}
