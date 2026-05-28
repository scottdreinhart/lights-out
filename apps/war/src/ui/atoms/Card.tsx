import type { Card as PlayingCardType } from '@/domain'
import { useState } from 'react'
import styles from './Card.module.css'

interface CardProps {
  card: PlayingCardType | null
  faceDown?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const RANK_TO_ASSET: Record<string, string> = {
  A: 'A',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': 'T',
  J: 'J',
  Q: 'Q',
  K: 'K',
  joker: '1J',
}

const SUIT_TO_ASSET: Record<string, string> = {
  hearts: 'H',
  diamonds: 'D',
  clubs: 'C',
  spades: 'S',
}

const RANK_TO_NAME: Record<string, string> = {
  A: 'Ace',
  '2': 'Two',
  '3': 'Three',
  '4': 'Four',
  '5': 'Five',
  '6': 'Six',
  '7': 'Seven',
  '8': 'Eight',
  '9': 'Nine',
  '10': 'Ten',
  J: 'Jack',
  Q: 'Queen',
  K: 'King',
  joker: 'Joker',
}

const SUIT_TO_NAME: Record<string, string> = {
  hearts: 'Hearts',
  diamonds: 'Diamonds',
  clubs: 'Clubs',
  spades: 'Spades',
}

function getCardAssetPath(card: PlayingCardType | null, faceDown: boolean): string {
  if (faceDown || !card) {
    return '/cards/1B.svg'
  }

  if (card.rank === 'joker') {
    return '/cards/1J.svg'
  }

  const rank = RANK_TO_ASSET[card.rank]
  const suit = card.suit ? SUIT_TO_ASSET[card.suit] : ''

  return `/cards/${rank}${suit}.svg`
}

function getAriaLabel(card: PlayingCardType | null, faceDown: boolean): string {
  if (faceDown || !card) {
    return 'Card back (hidden)'
  }

  if (card.rank === 'joker') {
    return 'Joker'
  }

  const rankName = RANK_TO_NAME[card.rank]
  const suitName = card.suit ? SUIT_TO_NAME[card.suit] : 'Unknown Suit'

  return `${rankName} of ${suitName}`
}

export function Card({ card, faceDown = false, size = 'md' }: CardProps) {
  const src = getCardAssetPath(card, faceDown)
  const ariaLabel = getAriaLabel(card, faceDown)
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className={`${styles.card} ${styles[size]}`} aria-label={ariaLabel}>
      {!imageFailed ? (
        <img
          src={src}
          alt={ariaLabel}
          className={styles.cardImage}
          draggable={false}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className={styles.fallbackCard} aria-hidden="true">
          <span className={styles.fallbackTop}>{faceDown || !card ? 'BACK' : card.rank}</span>
          <span className={styles.fallbackBottom}>{faceDown || !card ? 'CARD' : card.suit}</span>
        </div>
      )}
    </div>
  )
}
