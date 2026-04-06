import type { BingoCard as BingoCardType } from '@games/bingo-core'
import { BoardGrid, Tile } from '@games/ui-board-core'
import React from 'react'
import styles from './BingoCard.module.css'

interface BingoCardProps {
  card: BingoCardType
  markedNumbers: Set<number>
  onNumberClick?: (number: number) => void
  disabled?: boolean
}

export const BingoCard: React.FC<BingoCardProps> = ({
  card,
  markedNumbers,
  onNumberClick,
  disabled = false,
}) => {
  const handleTileClick = (row: number, col: number) => {
    if (disabled) return
    const number = card[row][col]
    if (number && onNumberClick) {
      onNumberClick(number)
    }
  }

  const renderTile = (row: number, col: number) => {
    const number = card[row][col]
    const isMarked = number ? markedNumbers.has(number) : false

    return (
      <Tile
        key={`${row}-${col}`}
        state={isMarked ? 'selected' : 'default'}
        onClick={() => handleTileClick(row, col)}
        disabled={disabled}
        className={styles.tile}
      >
        {number || ''}
      </Tile>
    )
  }

  return (
    <div className={styles.bingoCard}>
      <BoardGrid
        rows={card.length}
        cols={card[0]?.length || 0}
        renderCell={renderTile}
        className={styles.grid}
      />
    </div>
  )
}
