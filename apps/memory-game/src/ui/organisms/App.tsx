import { SplashScreen } from '@/ui'
import { useCallback, useState } from 'react'

type AppPhase = 'splash' | 'playing' | 'help'

export default function App() {
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

  if (phase === 'splash') {
    return (
      <SplashScreen
        onComplete={handleSplashComplete}
        onHowToPlay={handleHowToPlay}
        onLetsPlay={handleLetsPlay}
      />
    )
  }

  if (phase === 'help') {
    return (
      <div className="help-screen">
        <h2>How to Play Memory</h2>
        <p>Flip cards to find matching pairs on a grid. Remember the positions!</p>
        <button onClick={handleLetsPlay}>Back to Game</button>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>Memory</h1>
      <p>Flip cards to find matching pairs on a grid</p>
    </div>
  )
}
