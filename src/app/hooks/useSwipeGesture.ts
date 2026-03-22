import { useCallback, useRef } from 'react'

interface SwipeConfig {
  threshold?: number
  velocityThreshold?: number
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

export const useSwipeGesture = ({
  threshold = 50,
  velocityThreshold = 0.3,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}: SwipeConfig) => {
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 })

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    }
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y
      const deltaTime = Date.now() - touchStartRef.current.time

      if (deltaTime > 1000) {
        return
      }

      const velocityX = Math.abs(deltaX) / deltaTime
      const velocityY = Math.abs(deltaY) / deltaTime

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > threshold && velocityX > velocityThreshold) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight()
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft()
          }
        }
      } else {
        if (Math.abs(deltaY) > threshold && velocityY > velocityThreshold) {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown()
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp()
          }
        }
      }
    },
    [threshold, velocityThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown],
  )

  return { onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd }
}
