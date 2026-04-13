/**
 * React hooks for Bingo Rush
 * Global timer management with extensions
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { EXTENSION_SECONDS, GLOBAL_TIMERS, MAX_EXTENSIONS } from '../domain'

// Difficulty config based on available timer configurations
type DifficultyConfig = keyof typeof GLOBAL_TIMERS

/**
 * Hook for managing global timer in Bingo Rush
 * Countdown-based race mechanic with extension system
 *
 * Features:
 * - Difficulty-based time limits (easy: 5min → expert: 45sec)
 * - Pattern-completion grants extensions (+20s each, max 3)
 * - Stopwatch countdown with millisecond precision
 *
 * Time Limits by Difficulty:
 * - easy: 300 seconds (5 minutes)
 * - medium: 180 seconds (3 minutes)
 * - hard: 90 seconds (1.5 minutes)
 * - expert: 45 seconds (45 seconds)
 *
 * Extension System:
 * - Complete a pattern = +20 seconds
 * - Maximum 3 extensions = +60 seconds total
 * - Once maxed, no more extensions available
 */
export const useGlobalTimer = (difficulty: DifficultyConfig) => {
  const [startTime, setStartTime] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [totalExtensionsGranted, setTotalExtensionsGranted] = useState(0)
  const [countdownMs, setCountdownMs] = useState(0)

  const getInitialDuration = useCallback(() => {
    const baseDuration =
      GLOBAL_TIMERS[difficulty as keyof typeof GLOBAL_TIMERS] || GLOBAL_TIMERS.medium
    return baseDuration * 1000 // Convert to milliseconds
  }, [difficulty])

  // Timer countdown effect
  useEffect(() => {
    if (!isRunning || !startTime) return

    const initialDuration = getInitialDuration()
    const totalExtensionMs = totalExtensionsGranted * EXTENSION_SECONDS * 1000

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const totalDuration = initialDuration + totalExtensionMs
      const remaining = Math.max(0, totalDuration - elapsed)

      setCountdownMs(remaining)

      if (remaining === 0) {
        setIsRunning(false)
      }
    }, 50) // Update every 50ms for smooth countdown

    return () => clearInterval(interval)
  }, [isRunning, startTime, getInitialDuration, totalExtensionsGranted])

  const startTimer = useCallback(() => {
    setStartTime(Date.now())
    setIsRunning(true)
  }, [])

  const stopTimer = useCallback(() => {
    setIsRunning(false)
  }, [])

  const resetTimer = useCallback(() => {
    setStartTime(null)
    setIsRunning(false)
    setTotalExtensionsGranted(0)
    setCountdownMs(0)
  }, [])

  const canGrantExtension = useCallback(() => {
    return totalExtensionsGranted < MAX_EXTENSIONS
  }, [totalExtensionsGranted])

  const grantExtension = useCallback(() => {
    if (!canGrantExtension()) return false

    setTotalExtensionsGranted((prev) => prev + 1)
    return true
  }, [canGrantExtension])

  const getCountdownDisplay = useCallback(() => {
    const totalSeconds = Math.ceil(countdownMs / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return {
      totalSeconds,
      minutes,
      seconds,
      formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`,
    }
  }, [countdownMs])

  const getExtensionInfo = useCallback(() => {
    return {
      granted: totalExtensionsGranted,
      remaining: MAX_EXTENSIONS - totalExtensionsGranted,
      maxed: totalExtensionsGranted >= MAX_EXTENSIONS,
      totalExtensionSeconds: totalExtensionsGranted * EXTENSION_SECONDS,
    }
  }, [totalExtensionsGranted])

  const isTimeExpired = useCallback(() => {
    return countdownMs <= 0 && isRunning === false
  }, [countdownMs, isRunning])

  // Computed properties for components
  const timeRemaining = useMemo(() => Math.ceil(countdownMs / 1000), [countdownMs])
  const canExtend = useMemo(() => canGrantExtension(), [canGrantExtension])
  const extensionsGranted = useMemo(() => getExtensionInfo().granted, [getExtensionInfo])
  const extensionsRemaining = useMemo(() => getExtensionInfo().remaining, [getExtensionInfo])
  const maxExtensions = useMemo(() => MAX_EXTENSIONS, [])

  return {
    countdownMs,
    isRunning,
    timeRemaining,
    canExtend,
    extensionsGranted,
    extensionsRemaining,
    maxExtensions,
    startTimer,
    stopTimer,
    resetTimer,
    canGrantExtension,
    grantExtension,
    getCountdownDisplay,
    getExtensionInfo,
    isTimeExpired,
  }
}
