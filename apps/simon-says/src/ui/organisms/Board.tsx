/**
 * Simon Says: Game Board organism
 */

import type { Color } from '@/domain'
import { ColorButton } from '@/ui/atoms'
import { useSimonSays } from '@/app'
import styles from './Board.module.css'

export function Board() {
  const { state, handleColorClick, reset, animatingColor, showSequence } = useSimonSays()

  const colors: readonly Color[] = ['red', 'green', 'blue', 'yellow']
  const isDisabled = showSequence || state.gameOver || state.gamePhase !== 'userTurn'

  return (
    <div className={styles.board}>
      <div className={styles.header}>
        <h1>Simon Says</h1>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>Level:</span>
            <strong>{state.level}</strong>
          </div>
          <div className={styles.stat}>
            <span>Score:</span>
            <strong>{state.score}</strong>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {colors.map((color) => (
          <ColorButton
            key={color}
            color={color}
            isAnimating={animatingColor === color}
            isDisabled={isDisabled}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>

      <div className={styles.status}>
        {showSequence && <p>Watch the pattern...</p>}
        {!showSequence && !state.gameOver && state.gamePhase === 'userTurn' && <p>Your turn!</p>}
        {state.gameOver && (
          <div className={styles.gameOver}>
            <p>Game Over!</p>
            <p>Final Score: {state.score}</p>
            <p>Level Reached: {state.level}</p>
            <button className={styles.resetBtn} onClick={reset} type="button">
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
