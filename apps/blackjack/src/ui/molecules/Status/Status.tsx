import type { GamePhase, HandStatus } from '@/domain'
import React from 'react'
import styles from './Status.module.css'

export interface StatusProps {
  /** Current game phase */
  phase: GamePhase
  /** Player hand status */
  playerStatus?: HandStatus
  /** Dealer hand status */
  dealerStatus?: HandStatus
  /** Game result */
  result?: 'win' | 'loss' | 'push' | 'blackjack' | 'bust'
  /** Additional CSS classes */
  className?: string
}

/**
 * Status Molecule — Game state and phase indicator
 *
 * Displays current phase, player status, and result messages.
 */
export const Status = React.memo<StatusProps>(
  ({ phase, playerStatus, dealerStatus, result, className = '' }) => {
    const getStatusMessage = (): string => {
      if (result === 'blackjack') {
        return '🎉 Blackjack! You win!'
      }
      if (result === 'bust') {
        return '💥 Bust! You lose.'
      }
      if (result === 'win') {
        return '✓ You win!'
      }
      if (result === 'loss') {
        return '✗ Dealer wins.'
      }
      if (result === 'push') {
        return '= Push!'
      }

      if (phase === 'dealing') {
        return 'Dealing...'
      }
      if (phase === 'playing') {
        return 'Your turn'
      }
      if (phase === 'settling') {
        return 'Dealer playing...'
      }
      if (phase === 'completed') {
        return 'Round complete'
      }

      return ''
    }

    const getMessageClass = (): string => {
      if (result === 'blackjack' || result === 'win') {
        return styles.win
      }
      if (result === 'bust' || result === 'loss') {
        return styles.loss
      }
      if (result === 'push') {
        return styles.push
      }
      return styles.neutral
    }

    return (
      <div className={`${styles.root} ${className}`} role="status" aria-live="polite">
        <div className={`${styles.message} ${getMessageClass()}`}>{getStatusMessage()}</div>

        {playerStatus && (
          <div className={styles.detail}>
            <span className={styles.label}>Status:</span>
            <span className={styles.value}>{playerStatus}</span>
          </div>
        )}
      </div>
    )
  },
)

Status.displayName = 'Status'
