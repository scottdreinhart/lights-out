import React from 'react'

import type { Outcome } from '../../domain/types.ts'
import { cx } from '../utils/cssModules.ts'
import styles from './GameOutcomeOverlay.module.css'

interface GameOutcomeOverlayProps {
  outcome: Outcome
  onComplete: () => void
}

const GameOutcomeOverlay: React.FC<GameOutcomeOverlayProps> = ({ outcome, onComplete }) => {
  const outcomeLabels: Record<string, string> = {
    win: 'YOU WIN!',
    loss: 'YOU LOSE!',
    draw: 'DRAW!',
  }
  const text = outcomeLabels[outcome] ?? 'DRAW!'

  return (
    <div
      className={cx(styles.root, styles[outcome])}
      onAnimationEnd={onComplete}
      role="status"
      aria-live="assertive"
    >
      <span className={styles.text}>{text}</span>
    </div>
  )
}

GameOutcomeOverlay.displayName = 'GameOutcomeOverlay'

export default GameOutcomeOverlay
