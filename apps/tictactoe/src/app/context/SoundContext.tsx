import { createContext, type ReactNode, useContext } from 'react'

import useSoundEffects from '../useSoundEffects.ts'

export interface UseSoundEffectsReturn {
  soundEnabled: boolean
  toggleSound: () => void
  playMove: () => void
  playNav: () => void
  playTap: () => void
  playWin: () => void
  playLoss: () => void
  playDraw: () => void
}

const SoundContext = createContext<UseSoundEffectsReturn | null>(null)

/**
 * SoundProvider — provides sound state and play functions via React Context,
 * wrapping the existing useSoundEffects hook. Place at the top of the tree.
 *
 * Usage:
 *   <SoundProvider><App /></SoundProvider>
 *
 *   const { playMove, toggleSound, soundEnabled } = useSoundContext()
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const sound = useSoundEffects()
  return <SoundContext.Provider value={sound}>{children}</SoundContext.Provider>
}

/**
 * useSoundContext — access sound state anywhere in the tree.
 * Must be called inside a <SoundProvider>.
 */
export function useSoundContext(): UseSoundEffectsReturn {
  const ctx = useContext(SoundContext)
  if (!ctx) {
    throw new Error('useSoundContext must be used within a <SoundProvider>')
  }
  return ctx
}
