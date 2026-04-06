import React from 'react'
import type { Grid } from '@/domain'
import styles from './BingoCard.module.css'

interface Props {
  grid: Grid
  drawnNumbers: number[]
  hints: Array<[number, number]>
}

export const BingoCard: React.FC<Props> = ({ grid, drawnNumbers, hints }) => {
  const hintSet = new Set(hints.map((h) => `${h[0]},${h[1]}`))
  const drawnSet = new Set(drawnNumbers)

  return (
    <div className={styles.card}>
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className={styles.row}>
          {row.map((cell, colIdx) => {
            const isHint = hintSet.has(`${rowIdx},${colIdx}`)
            const isDrawn = drawnSet.has(cell.number)
            const isMarked = cell.marked
            const isFree = cell.number === 0

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`${styles.cell} ${isMarked ? styles.marked : ''} ${
                  isHint ? styles.hint : ''
                }`}
                aria-label={
                  isFree ? 'Free' : `${cell.number}${isMarked ? ' marked' : ''}`
                }
              >
                {!isFree && <span className={styles.number}>{cell.number}</span>}
                {isFree && <span className={styles.free}>FREE</span>}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
