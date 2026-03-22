import { GameProvider, useGameContext } from '@/app'
import { useEffect, useState } from 'react'
import styles from './App.module.css'
import { GameOver, GamePlayBoard, GameSetup } from './index'

function GameContent() {
  const { state } = useGameContext()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="stb-splash">
        <div className="stb-splash__orb"></div>
        <div className="stb-splash__grid"></div>
        <div className="stb-splash__content">
          <div className="stb-splash__badge">
            <div className="stb-splash__emoji">🛦</div>
          </div>
          <div className="stb-splash__eyebrow">Roll. Choose. Close.</div>
          <h1 className="stb-splash__title">Shut the Box</h1>
          <p className="stb-splash__subtitle">Close all box numbers before running out of moves</p>
          <div className="stb-splash__loading">
            <span className="stb-splash__dot"></span>
            <span className="stb-splash__dot"></span>
            <span className="stb-splash__dot"></span>
          </div>
        </div>
      </div>
    )
  }

  if (state.gamePhase === 'setup') {
    return <GameSetup />
  }

  if (state.gamePhase === 'gameOver') {
    return <GameOver winner={state.winner} players={state.players} />
  }

  return <GamePlayBoard />
}

export function App() {
  return (
    <GameProvider>
      <div className={styles.app}>
        <GameContent />
      </div>
    </GameProvider>
  )
}
