import { SplashScreen } from '@/ui'
import { useCallback, useState } from 'react'
import { TangoGame } from '../TangoGame'

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
        <h1>Tango Rules</h1>
        <p>Slide tiles into the empty space until numbers are in ascending order.</p>
        <p>Use hint and auto-move if you get stuck, and reset at any time.</p>
        <button onClick={() => setPhase('playing')}>Start Puzzle</button>
      </div>
    )
  }

  return (
    <div className="app">
      <TangoGame />
    </div>
  )
}
