import { useCallback, useRef, useState } from 'react'

import type * as SoundsModule from './sounds'

let soundsPromise: Promise<typeof SoundsModule> | null = null
const getSounds = () => {
  if (!soundsPromise) {
    soundsPromise = import('./sounds.ts')
  }
  return soundsPromise
}

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface UseSoundEffectsReturn {
  soundEnabled: boolean
  toggleSound: () => void
  playMove: () => void
  playNav: () => void
  playTap: () => void
  playWin: () => void
  playLoss: () => void
  playDraw: () => void
}

const useSoundEffects = (): UseSoundEffectsReturn => {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const soundEnabledRef = useRef(soundEnabled)
  soundEnabledRef.current = soundEnabled

  const shouldPlay = useCallback(() => {
    return soundEnabledRef.current && !prefersReducedMotion()
  }, [])

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev)
  }, [])

  const playMove = useCallback(() => {
    if (shouldPlay()) {
      getSounds().then((m) => m.playMoveSound())
    }
  }, [shouldPlay])

  const playNav = useCallback(() => {
    if (shouldPlay()) {
      getSounds().then((m) => m.playNavSound())
    }
  }, [shouldPlay])

  const playTap = useCallback(() => {
    if (shouldPlay()) {
      getSounds().then((m) => m.playTapSound())
    }
  }, [shouldPlay])

  const playWin = useCallback(() => {
    if (shouldPlay()) {
      getSounds().then((m) => m.playWinMusic())
    }
  }, [shouldPlay])

  const playLoss = useCallback(() => {
    if (shouldPlay()) {
      getSounds().then((m) => m.playLossMusic())
    }
  }, [shouldPlay])

  const playDraw = useCallback(() => {
    if (shouldPlay()) {
      getSounds().then((m) => m.playDrawSound())
    }
  }, [shouldPlay])

  return { soundEnabled, toggleSound, playMove, playNav, playTap, playWin, playLoss, playDraw }
}

export default useSoundEffects
