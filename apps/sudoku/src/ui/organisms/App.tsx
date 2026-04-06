import { SudokuGame } from '@/ui/organisms'
import { SplashScreen } from '@games/common'
import React, { useCallback, useState } from 'react'
import styles from '../../styles.module.css'

type AppPhase = 'splash' | 'playing' | 'help'

const App: React.FC = () => {
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
        title="SUDOKU"
      />
    )
  }

  if (phase === 'help') {
    return (
      <div className={styles.helpScreen}>
        <h2>How to Play Sudoku</h2>
        <p>
          Fill the 9×9 grid with digits 1 through 9 so that each row, column, and 3×3 box contains
          all digits 1–9.
        </p>
        <button onClick={handleLetsPlay} className={styles.actionButton}>
          Let's Play
        </button>
      </div>
    )
  }

  return (
    <div className={styles.appContainer}>
      <SudokuGame />
    </div>
  )
}

export default App
