import type { GameState } from '@/domain'
import styles from './GameOverlay.module.css'

interface GameOverlayProps {
  state: GameState
  onRestart: () => void
}

export const GameOverlay = ({ state, onRestart }: GameOverlayProps) => {
  if (state.status === 'playing') {
    return null
  }

  const heading = 'System Collapse'
  const detail =
    state.lossReason === 'bounds'
      ? 'You crossed corridor bounds. Re-center your burst cadence.'
      : 'Obstacle impact detected. Tighten burst timing through the gap.'

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={heading}>
      <div className={styles.card}>
        <h2>{heading}</h2>
        <p>{detail}</p>
        <p className={styles.score}>Score: {state.score}</p>
        <button type="button" className={styles.restart} onClick={onRestart}>
          Retry Run
        </button>
      </div>
    </div>
  )
}
