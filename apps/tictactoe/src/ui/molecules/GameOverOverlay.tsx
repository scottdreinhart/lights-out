/**
 * GameOverOverlay — shown when a game (or series) ends.
 */

import type { GameOutcome } from '@/domain'
import styles from './Overlay.module.css'

interface GameOverOverlayProps {
  outcome: GameOutcome
  timeToWin?: number
  streak?: number
  seriesWinner?: string | null
  seriesScore?: [number, number]
  onPlayAgain: () => void
  onMenu: () => void
}

export function GameOverOverlay({
  outcome,
  timeToWin,
  streak,
  seriesWinner,
  seriesScore,
  onPlayAgain,
  onMenu,
}: GameOverOverlayProps) {
  const heading =
    outcome.result === 'human-win' ? 'You Win!' : outcome.result === 'draw' ? 'Draw!' : 'Game Over'
  const isWin = outcome.result === 'human-win'

  return (
    <div className={styles.overlay}>
      <h1 className={styles.title}>{heading}</h1>

      {timeToWin && isWin && <p className={styles.subtitle}>{timeToWin.toFixed(1)} seconds</p>}

      {streak && isWin && streak > 1 && (
        <div className={styles.scoreDisplay} style={{ fontSize: '2rem', marginTop: '1rem' }}>
          {streak} Game{streak > 1 ? 's' : ''} ✓
        </div>
      )}

      {seriesWinner && seriesScore && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center', opacity: 0.8 }}>
          <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Series Result</div>
          <div className={styles.scoreDisplay} style={{ fontSize: '2rem' }}>
            {seriesScore[0]} - {seriesScore[1]}
          </div>
          <div style={{ opacity: 0.7 }}>
            {seriesWinner === 'human' ? 'You won the series!' : 'AI won the series'}
          </div>
        </div>
      )}

      <div className={styles.menu} style={{ marginTop: '2rem' }}>
        <button className={styles.menuBtnPrimary} onClick={onPlayAgain} autoFocus>
          {seriesWinner ? 'New Series' : 'Play Again'}
        </button>
        <button className={styles.menuBtn} onClick={onMenu}>
          Main Menu
        </button>
      </div>
    </div>
  )
}
