import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Configuration for inactivity detection
 */
export interface InactivityConfig {
  /**
   * Timeout duration in milliseconds (default: 300,000 = 5 minutes)
   */
  timeoutMs?: number

  /**
   * Grace period before timeout (default: 30,000 = 30 seconds)
   * Shows warning, can be dismissed by activity
   */
  gracePeriodMs?: number

  /**
   * Callback when timeout warning should be shown
   */
  onWarning?: () => void

  /**
   * Callback when timeout occurs (after grace period expires)
   */
  onTimeout: () => void

  /**
   * Callback when activity resets the timer
   */
  onActivityReset?: () => void

  /**
   * Keys that should NOT reset the timer (e.g., 'Escape', 'Tab')
   */
  excludeKeys?: string[]

  /**
   * Whether to track mouse movement (can be noisy)
   */
  trackMouseMove?: boolean

  /**
   * Pause monitoring (useful during modals/menus)
   */
  isPaused?: boolean
}

/**
 * Hook to detect user inactivity and trigger timeout
 *
 * Tracks: keyboard, mouse click/down, touch, scroll
 * Resets timer on any tracked activity
 *
 * @example
 * const { isWarningVisible, dismissWarning } = useInactivityTimeout({
 *   timeoutMs: 300000,
 *   gracePeriodMs: 30000,
 *   onTimeout: () => navigate('/'),
 *   excludeKeys: ['Escape', 'Tab']
 * })
 */
export function useInactivityTimeout(config: InactivityConfig) {
  const {
    timeoutMs = 300000, // 5 minutes
    gracePeriodMs = 30000, // 30 seconds
    onWarning,
    onTimeout,
    onActivityReset,
    excludeKeys = [],
    trackMouseMove = false,
    isPaused = false,
  } = config

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const gracePeriodRef = useRef<NodeJS.Timeout | null>(null)
  const [isWarningVisible, setIsWarningVisible] = useState(false)

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (gracePeriodRef.current) {
      clearTimeout(gracePeriodRef.current)
      gracePeriodRef.current = null
    }
  }, [])

  // Reset the inactivity timer
  const resetTimer = useCallback(() => {
    if (isPaused) return

    clearTimers()
    setIsWarningVisible(false)

    onActivityReset?.()

    // Start grace period first
    gracePeriodRef.current = setTimeout(() => {
      setIsWarningVisible(true)
      onWarning?.()

      // Then timeout after grace period
      timeoutRef.current = setTimeout(() => {
        setIsWarningVisible(false)
        onTimeout()
      }, timeoutMs - gracePeriodMs)
    }, gracePeriodMs)
  }, [clearTimers, isPaused, onActivityReset, onWarning, onTimeout, timeoutMs, gracePeriodMs])

  // Dismiss warning (e.g., user clicked in warning)
  const dismissWarning = useCallback(() => {
    setIsWarningVisible(false)
    resetTimer()
  }, [resetTimer])

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (excludeKeys.includes(event.key)) return
      resetTimer()
    },
    [resetTimer, excludeKeys],
  )

  // Handle mouse events
  const handleMouseEvent = useCallback(() => {
    resetTimer()
  }, [resetTimer])

  // Handle touch events
  const handleTouchEvent = useCallback(() => {
    resetTimer()
  }, [resetTimer])

  // Handle scroll
  const handleScroll = useCallback(() => {
    resetTimer()
  }, [resetTimer])

  // Setup event listeners
  useEffect(() => {
    if (isPaused) {
      clearTimers()
      return
    }

    // Start initial timer
    resetTimer()

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseEvent)
    document.addEventListener('click', handleMouseEvent)
    document.addEventListener('touchstart', handleTouchEvent)
    document.addEventListener('touchmove', handleTouchEvent)
    document.addEventListener('scroll', handleScroll, { passive: true })

    if (trackMouseMove) {
      document.addEventListener('mousemove', handleMouseEvent)
    }

    // Cleanup
    return () => {
      clearTimers()
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseEvent)
      document.removeEventListener('click', handleMouseEvent)
      document.removeEventListener('touchstart', handleTouchEvent)
      document.removeEventListener('touchmove', handleTouchEvent)
      document.removeEventListener('scroll', handleScroll)
      if (trackMouseMove) {
        document.removeEventListener('mousemove', handleMouseEvent)
      }
    }
  }, [
    isPaused,
    resetTimer,
    clearTimers,
    handleKeyDown,
    handleMouseEvent,
    handleTouchEvent,
    handleScroll,
    trackMouseMove,
  ])

  return {
    isWarningVisible,
    dismissWarning,
    resetTimer,
  }
}
