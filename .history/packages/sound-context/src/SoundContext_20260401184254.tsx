import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { loadWithFallback, saveJson } from '@games/storage-utils'

interface SoundContextValue {
  /** Whether sound effects are enabled */
  soundEnabled: boolean
  /** Toggle sound on/off */
  toggleSound: () => void
  /** Set sound state directly */
  setSoundEnabled: (enabled: boolean) => void
  /** Play a sound if enabled and reduced-motion is not preferred */
  playSound: (fn: () => void) => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

/**
 * SoundProvider — provides sound-enabled state and a guarded playSound function.
 * Respects `prefers-reduced-motion` — sounds are suppressed when motion is reduced.
 *
 * Uses @games/storage-utils for persistence.
 *
 * Usage:
 *   <SoundProvider storageKey="myapp-sound"><App /></SoundProvider>
 *
 *   const { playSound } = useSoundContext()
 *   playSound(() => playMoveSound())
 */
export function SoundProvider({
  children,
  storageKey = 'sound-enabled',
}: {
  children: ReactNode
  storageKey?: string
}) {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() =>
    loadWithFallback(storageKey, true),
  )
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )

  const setSoundEnabled = useCallback(
    (enabled: boolean) => {
      setSoundEnabledState(enabled)
      saveJson(storageKey, enabled)
    },
    [storageKey],
  )

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev
      saveJson(storageKey, next)
      return next
    })
  }, [storageKey])

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

/**
 * useSoundContext — access sound state anywhere in the tree.
 * Must be called inside a <SoundProvider>.
 */
export function useSoundContext(): SoundContextValue {
  const ctx = useContext(SoundContext)
  if (!ctx) {
    throw new Error('useSoundContext must be used within a <SoundProvider>')
  }
  return ctx
}
