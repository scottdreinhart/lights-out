import type { Card } from '@/domain'
import styles from './Card.module.css'

interface CardProps {
  card: Card | null
  faceDown?: boolean
}

const RANK_DISPLAY: Record<string, string> = {
  A: 'A',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  J: 'J',
  Q: 'Q',
  K: 'K',
}

const SUIT_SYMBOL: Record<string, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

const SUIT_COLOR: Record<string, string> = {
  hearts: '#e74c3c',
  diamonds: '#e74c3c',
  clubs: '#2c3e50',
  spades: '#2c3e50',
}

export function Card({ card, faceDown }: CardProps) {
  if (faceDown || !card) {
    return <div className={styles.card} data-facedown="true"></div>
  }

  const color = SUIT_COLOR[card.suit]

  return (
    <div className={styles.card} style={{ borderColor: color }}>
      <div className={styles.rank}>{RANK_DISPLAY[card.rank]}</div>
      <div className={styles.suit} style={{ color }}>
        {SUIT_SYMBOL[card.suit]}
      </div>
    </div>
  )
}
