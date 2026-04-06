/**
 * Mini Bingo Card Component (3x3)
 * Displays a single mini bingo card with 3x3 grid
 */

import { useMemo } from 'react'
import styles from './BingoCard.module.css'

interface BingoCardProps {
  cardNumber: number
  numbers: number[][] // 3x3 grid
  drawnNumbers: Set<number>
  isWinner?: boolean
  hintNumbers?: number[]
}

export function BingoCard({
  cardNumber,
  numbers,
  drawnNumbers,
  isWinner = false,
  hintNumbers = [],
}: BingoCardProps) {
  const hints = useMemo(() => new Set(hintNumbers), [hintNumbers])

  return (
    <div className={`${styles.bingoCard} ${isWinner ? styles.winner : ''}`}>
      <div className={styles.cardNumber}>Card {cardNumber + 1}</div>
      <div className={styles.grid}>
        {numbers.map((row, rowIndex) =>
          row.map((num, colIndex) => {
            const isMarked = drawnNumbers.has(num)
            const isHint = hints.has(num)

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`${styles.cell} ${
                  isMarked ? styles.marked : ''
                } ${isHint ? styles.hint : ''}`}
              >
                <span className={styles.number}>{num}</span>
              </div>
            )
          }),
        )}
      </div>
    </div>
  )
}
