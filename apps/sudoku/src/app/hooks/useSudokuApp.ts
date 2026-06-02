import { useCallback, useState } from 'react'

type AppPhase = 'splash' | 'playing' | 'help'

export interface UseSudokuAppReturn {
  handleHowToPlay: () => void
  handleLetsPlay: () => void
  handleSplashComplete: () => void
  phase: AppPhase
}

export const useSudokuApp = (): UseSudokuAppReturn => {
  const [phase, setPhase] = useState<AppPhase>('splash')

  const handleSplashComplete = useCallback(() => {
    setPhase('playing')
  }, [])

  const handleHowToPlay = useCallback(() => {
    setPhase('help')
  }, [])

  const handleLetsPlay = useCallback(() => {
    setPhase('playing')
  }, [])

  return {
    handleHowToPlay,
    handleLetsPlay,
    handleSplashComplete,
    phase,
  }
}
