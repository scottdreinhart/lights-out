import { SplashScreen } from '@/ui'
import { useState } from 'react'
import { GameBoard } from './GameBoard'

export function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [boardVisible, setBoardVisible] = useState(false)

  return (
    <div className="app">
      <div
        style={{
          width: '100%',
          height: '100%',
          opacity: boardVisible ? 1 : 0,
          pointerEvents: boardVisible ? 'auto' : 'none',
          transition: 'opacity 15s ease',
        }}
      >
        <GameBoard />
      </div>
      {showSplash && (
        <SplashScreen
          onFadeStart={() => setBoardVisible(true)}
          onComplete={() => setShowSplash(false)}
          title="WAR"
        />
      )}
    </div>
  )
}
