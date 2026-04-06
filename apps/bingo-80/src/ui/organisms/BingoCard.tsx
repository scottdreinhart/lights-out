/**
 * Swedish Bingo (Bingo-80) - BingoCard component (4x4 grid)
 */

import type { Card } from '@/domain'
import './BingoCard.module.css'

const GRID_SIZE = 4

interface BingoCardProps {
  card: Card
  isWinner?: boolean
  showHints?: boolean
  hintPositions?: number[]
}

export function BingoCard({
  card,
  isWinner = false,
  showHints = false,
  hintPositions = [],
}: BingoCardProps) {
  return (
    <div
      className={`bingo-card ${isWinner ? 'winner' : ''}`}
      role="table"
      aria-label={`Bingo card ${card.id}`}
    >
      {Array.from({ length: GRID_SIZE }).map((_, row) => (
        <div key={`row-${row}`} className="card-row" role="row">
          {Array.from({ length: GRID_SIZE }).map((_, col) => {
            const idx = row * GRID_SIZE + col
            const number = card.squares[idx]
            const isMarked = card.marked[idx]
            const isHint = showHints && hintPositions.includes(idx)

            return (
              <div
                key={`cell-${idx}`}
                className={`card-cell ${isMarked ? 'marked' : ''} ${isHint ? 'hint' : ''}`}
                role="gridcell"
                aria-label={`Cell ${number}`}
              >
                {number}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
