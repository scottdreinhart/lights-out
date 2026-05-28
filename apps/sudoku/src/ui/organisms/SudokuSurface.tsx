import { SplashScreen } from '@games/common'

import { SudokuGame } from './SudokuGame/SudokuGame'

import styles from '../../styles.module.css'

import type { UseSudokuAppReturn } from '@/app'

export function SudokuSurface({ app }: { app: UseSudokuAppReturn }) {
  if (app.phase === 'splash') {
    return (
      <SplashScreen
        onComplete={app.handleSplashComplete}
        onHowToPlay={app.handleHowToPlay}
        onLetsPlay={app.handleLetsPlay}
        title="SUDOKU"
      />
    )
  }

  if (app.phase === 'help') {
    return (
      <div className={styles.helpScreen}>
        <h2>How to Play Sudoku</h2>
        <p>
          Fill the 9×9 grid with digits 1 through 9 so that each row, column, and 3×3 box contains
          all digits 1–9.
        </p>
        <button onClick={app.handleLetsPlay} className={styles.actionButton}>
          Let's Play
        </button>
      </div>
    )
  }

  return <SudokuGame />
}
