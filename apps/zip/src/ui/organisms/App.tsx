import { SplashScreen } from '@/ui'
import { useCallback, useState } from 'react'

type AppPhase = 'splash' | 'playing' | 'help'

export function App() {
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
      <div className="app">
        <h1>How to Play</h1>
        <p>Game rules would appear here.</p>
        <button onClick={() => setPhase('splash')}>Back</button>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>Zip</h1>
      <p>Coming soon...</p>
      <button onClick={() => setPhase('splash')}>Back to Splash</button>
    </div>
  )
}
