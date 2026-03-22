import { createContext, type ReactNode, useContext, useState } from 'react'

export interface UseSoundEffectsReturn {
  play: (soundName: string) => void
  isMuted: boolean
  toggleMute: () => void
  sounds: Record<string, { play?: () => void }>
}

export function createSoundContext() {
  const SoundContext = createContext<UseSoundEffectsReturn | null>(null)

  function SoundProvider({ children }: { children: ReactNode }) {
    const [isMuted, setIsMuted] = useState(false)
    const sounds: Record<string, { play?: () => void }> = {}

    const toggleMute = () => setIsMuted((prev) => !prev)
    const play = (soundName: string) => {
      if (isMuted) return
      sounds[soundName]?.play?.()
    }

    return (
      <SoundContext.Provider value={{ play, isMuted, toggleMute, sounds }}>
        {children}
      </SoundContext.Provider>
    )
  }

  function useSoundContext(): UseSoundEffectsReturn {
    const ctx = useContext(SoundContext)
    if (!ctx) {
      throw new Error('useSoundContext must be used within a <SoundProvider>')
    }
    return ctx
  }

  return { SoundProvider, useSoundContext }
}
