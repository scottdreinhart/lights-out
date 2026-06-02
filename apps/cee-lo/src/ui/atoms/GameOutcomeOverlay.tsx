import { cx } from '@/ui/utils'
import styles from './GameOutcomeOverlay.module.css'

type Outcome = 'win' | 'loss' | 'draw'

interface GameOutcomeOverlayProps {
  outcome: Outcome
  label?: string
  onComplete: () => void
}

export function GameOutcomeOverlay({ outcome, label, onComplete }: GameOutcomeOverlayProps) {
  const outcomeLabels: Record<Outcome, string> = {
    win: 'YOU WIN!',
    loss: 'YOU LOSE!',
    draw: 'DRAW!',
  }

  return (
    <div
      className={cx(styles.root, styles[outcome])}
      onAnimationEnd={onComplete}
      role="status"
      aria-live="assertive"
    >
      <span className={styles.text}>{label ?? outcomeLabels[outcome]}</span>
    </div>
  )
}

export default GameOutcomeOverlay
