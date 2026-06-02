import styles from './GameOutcomeOverlay.module.css'
import type { CSSProperties } from 'react'

export type GameOutcome = 'win' | 'loss' | 'draw'

interface GameOutcomeOverlayProps {
  outcome: GameOutcome
  durationMs?: number
  onComplete?: () => void
}

const OUTCOME_LABELS: Record<GameOutcome, string> = {
  win: 'YOU WIN!',
  loss: 'YOU LOSE!',
  draw: 'DRAW!',
}

export function GameOutcomeOverlay({ outcome, durationMs = 3000, onComplete }: GameOutcomeOverlayProps) {
  const style = {
    '--outcome-duration': `${durationMs}ms`,
  } as CSSProperties

  return (
    <div
      className={`${styles.root} ${styles[outcome]}`}
      style={style}
      onAnimationEnd={onComplete}
      role="status"
      aria-live="assertive"
    >
      <span className={styles.text}>{OUTCOME_LABELS[outcome]}</span>
    </div>
  )
}

export type { GameOutcomeOverlayProps }

