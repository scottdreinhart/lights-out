import { Card as CardType } from '@/domain'
import { Card } from '@/ui/atoms'
import React from 'react'
import styles from './Dealer.module.css'

export interface DealerProps {
  /** The dealer's upcard (always visible) */
  upcard: CardType
  /** The dealer's hole card (hidden until revealed) */
  holeCard: CardType | null
  /** Whether the hole card is revealed */
  revealed?: boolean
  /** Display size */
  size?: 'sm' | 'md' | 'lg'
  /** Label for accessibility */
  ariaLabel?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * Dealer Molecule — Displays dealer's cards
 *
 * Shows upcard always visible, hole card with hidden/revealed state.
 * Composes two Card atoms with state visibility control.
 */
export const Dealer = React.memo<DealerProps>(
  ({
    upcard,
    holeCard,
    revealed = false,
    size = 'md',
    ariaLabel = 'Dealer hand',
    className = '',
  }) => {
    return (
      <div className={`${styles.root} ${className}`} role="group" aria-label={ariaLabel}>
        {/* Upcard: always visible */}
        <div className={styles.cardSlot}>
          <Card
            card={upcard}
            size={size}
            aria-label={`Dealer upcard: ${upcard.rank} of ${upcard.suit}`}
          />
        </div>

        {/* Hole card: visible if revealed, hidden otherwise */}
        {holeCard && (
          <div className={styles.cardSlot}>
            <Card
              card={holeCard}
              size={size}
              hidden={!revealed}
              aria-label={
                revealed
                  ? `Dealer hole card: ${holeCard.rank} of ${holeCard.suit}`
                  : 'Dealer hole card (hidden)'
              }
            />
          </div>
        )}
      </div>
    )
  },
)

Dealer.displayName = 'Dealer'
