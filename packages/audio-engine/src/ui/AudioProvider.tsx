import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { AudioState } from '../domain/audioTypes'

interface AudioContextValue extends AudioState {
  setMasterVolume: (v: number) => void
  toggleMute: () => void
}

const AudioContext = createContext<AudioContextValue | null>(null)

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AudioState>({
    masterVolume: 1.0,
    musicVolume: 0.6,
    sfxVolume: 0.8,
    muted: false,
    activeMusicId: null,
  })

  const setMasterVolume = useCallback((v: number) => {
    setState(prev => ({ ...prev, masterVolume: v }))
    // Howler.volume is global
    import('howler').then(({ Howler }) => Howler.volume(v))
  }, [])

  const toggleMute = useCallback(() => {
    setState(prev => {
      const nextMuted = !prev.muted
      import('howler').then(({ Howler }) => Howler.mute(nextMuted))
      return { ...prev, muted: nextMuted }
    })
  }, [])

  const value = useMemo(() => ({
    ...state,
    setMasterVolume,
    toggleMute,
  }), [state, setMasterVolume, toggleMute])

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

export const useAudioContext = () => {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudioContext must be used within AudioProvider')
  return ctx
}
