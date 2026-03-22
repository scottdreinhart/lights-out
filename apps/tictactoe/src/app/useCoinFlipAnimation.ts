import { useCallback, useEffect, useRef, useState } from 'react'

import type { Token } from '@/domain'

interface UseCoinFlipConfig {
  onComplete: (isXFirst: boolean) => void
  autoStopMs?: number
  revealMs?: number
}

interface UseCoinFlipReturn {
  isFlipping: boolean
  result: Token | null
  ready: boolean
  stopFlip: () => void
}

const useCoinFlipAnimation = ({
  onComplete,
  autoStopMs = 3500,
  revealMs = 1200,
}: UseCoinFlipConfig): UseCoinFlipReturn => {
  const [isFlipping, setIsFlipping] = useState(true)
  const [result, setResult] = useState<Token | null>(null)
  const [ready, setReady] = useState(false)

  const callbackRef = useRef(onComplete)
  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFlippingRef = useRef(true)

  callbackRef.current = onComplete

  const stopFlip = useCallback(() => {
    if (!isFlippingRef.current) {
      return
    }
    isFlippingRef.current = false

    if (flipTimerRef.current) {
      clearTimeout(flipTimerRef.current)
    }
    setIsFlipping(false)

    const isXFirst = Math.random() > 0.5
    setResult(isXFirst ? 'X' : 'O')

    resultTimerRef.current = setTimeout(() => {
      callbackRef.current(isXFirst)
    }, revealMs)
  }, [revealMs])

  useEffect(() => {
    const rafId = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => {
    if (!ready) {
      return
    }

    flipTimerRef.current = setTimeout(() => {
      stopFlip()
    }, autoStopMs)

    return () => {
      if (flipTimerRef.current) {
        clearTimeout(flipTimerRef.current)
      }
      if (resultTimerRef.current) {
        clearTimeout(resultTimerRef.current)
      }
    }
  }, [ready, autoStopMs, stopFlip])

  return { isFlipping, result, ready, stopFlip }
}

export default useCoinFlipAnimation
