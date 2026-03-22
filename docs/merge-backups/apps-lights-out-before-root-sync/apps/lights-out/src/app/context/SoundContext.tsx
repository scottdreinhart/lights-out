import type { ReactNode } from 'react'
import { createContext, useCallback, useContext } from 'react'
import { useSoundController } from '@games/app-hook-utils'

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
  const { soundEnabled, toggleSound, setSoundEnabled, runIfPlayable } = useSoundController({
    loadEnabled: () => load(STORAGE_KEY, true),
    persistEnabled: (enabled) => save(STORAGE_KEY, enabled),
  })

  const playSound = useCallback(
    (fn: () => void) => {
      runIfPlayable(fn)
    },
    [runIfPlayable],
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
