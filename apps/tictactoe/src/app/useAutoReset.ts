import { useCallback, useEffect, useRef, useState } from 'react'

const AUTO_RESET_SECONDS = 15

interface UseAutoResetReturn {
  secondsLeft: number | null
  resetNow: () => void
}

const useAutoReset = (isGameOver: boolean, onReset: () => void): UseAutoResetReturn => {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setSecondsLeft(null)
  }, [])

  const resetNow = useCallback(() => {
    clearTimer()
    onReset()
  }, [clearTimer, onReset])

  useEffect(() => {
    if (isGameOver) {
      setSecondsLeft(AUTO_RESET_SECONDS)

      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === null || prev <= 1) {
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearTimer()
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isGameOver, clearTimer])

  useEffect(() => {
    if (secondsLeft === 0) {
      resetNow()
    }
  }, [secondsLeft, resetNow])

  return { secondsLeft, resetNow }
}

export default useAutoReset
