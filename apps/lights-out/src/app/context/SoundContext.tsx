import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useRef, useState } from 'react'

import { load, save } from '../services/storageService.ts'

interface SoundContextValue {
  soundEnabled: boolean
  toggleSound: () => void
  setSoundEnabled: (enabled: boolean) => void
  playSound: (fn: () => void) => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

const STORAGE_KEY = 'sound-enabled'

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => load(STORAGE_KEY, true))
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled)
    save(STORAGE_KEY, enabled)
  }, [])

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev
      save(STORAGE_KEY, next)
      return next
    })
  }, [])

  const playSound = useCallback(
    (fn: () => void) => {
      if (soundEnabled && !prefersReducedMotion.current) {
        fn()
      }
    },
    [soundEnabled],
  )

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, setSoundEnabled, playSound }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSoundContext(): SoundContextValue {
  const ctx = useContext(SoundContext)
  if (!ctx) {
    throw new Error('useSoundContext must be used within a <SoundProvider>')
  }
  return ctx
}
