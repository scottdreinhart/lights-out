/**
 * Memory Card Atom Component
 */

import type { Card } from '@/domain'
import styles from './Card.module.css'

interface CardProps {
  card: Card
  onClick: () => void
  isSelectable: boolean
}

const SUIT_COLORS: Record<string, string> = {
  '♥': '#e74c3c',
  '♦': '#e74c3c',
  '♣': '#2c3e50',
  '♠': '#2c3e50',
}

export function MemoryCard({ card, onClick, isSelectable }: CardProps) {
  if (!card.revealed && !card.matched) {
    return (
      <button
        type="button"
        className={styles.card}
        onClick={onClick}
        disabled={!isSelectable}
        data-state="hidden"
      >
        ?
      </button>
    )
  }

  if (card.matched) {
    return (
      <div className={styles.card} data-state="matched">
        <span className={styles.suit} style={{ color: SUIT_COLORS[card.suit] }}>
          {card.suit}
        </span>
        <span className={styles.value}>{card.value}</span>
      </div>
    )
  }

  const color = SUIT_COLORS[card.suit]

  return (
    <div className={styles.card} data-state="revealed" style={{ borderColor: color }}>
      <span className={styles.suit} style={{ color }}>
        {card.suit}
      </span>
      <span className={styles.value}>{card.value}</span>
    </div>
  )
}
