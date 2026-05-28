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

  const heading = state.status === 'won' ? 'Extraction Complete' : 'Run Failed'
  const detail =
    state.status === 'won'
      ? 'You destabilized the grid and escaped.'
      : state.lossReason === 'lockdown'
        ? 'Lockdown timer expired before extraction.'
        : 'Sentinel interception detected your route.'

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={heading}>
      <div className={styles.card}>
        <h2>{heading}</h2>
        <p>{detail}</p>
        <p className={styles.score}>Score: {state.score}</p>
        <button type="button" className={styles.restart} onClick={onRestart}>
          Retry Intrusion
        </button>
      </div>
    </div>
  )
}
