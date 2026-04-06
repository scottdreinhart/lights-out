/**
 * Bingo Card Component
 * Displays a 5x5 bingo card grid with marked cells and win indicators.
 * 
 * Shared component for all bingo variants.
 * Extracted from apps/bingo/src/ui/organisms/BingoCard.tsx
 */

import type { BingoCard as BingoCardType } from '@games/bingo-core'
import { useResponsiveState } from '@games/app-hook-utils'
import {
  BoardGrid,
  useKeyboardBoardNavigation,
  type BoardCell,
  type Position,
} from '@games/ui-board-core'
import React, { useMemo, useState } from 'react'
import styles from './BingoCard.module.css'

export interface BingoCardProps {
  card: BingoCardType
  patterns?: string[]
  disabled?: boolean
  onCardClick?: (cardId: string) => void
  onCellClick?: (position: Position) => void
  hintPositions?: { row: number; col: number }[]
  showHints?: boolean
}

/**
 * BingoCard - Display and interaction component for bingo cards
 * 
 * Features:
 * - 5x5 grid with BINGO column headers
 * - Keyboard navigation (arrow keys + Enter to mark)
 * - Mouse click to mark cells
 * - FREE space center cell
 * - Win indicator with pattern names
 * - Responsive sizing for mobile/tablet/desktop
 * - Accessibility features (ARIA labels, semantic structure)
 * 
 * @example
 * ```tsx
 * <BingoCard
 *   card={bingoCard}
 *   onCellClick={(pos) => markCell(pos)}
 *   onCardClick={() => selectCard()}
 *   patterns={winningPatterns}
 * />
 * ```
 */
export const BingoCard: React.FC<BingoCardProps> = ({
  card,
  patterns,
  disabled,
  onCardClick,
  onCellClick,
  hintPositions = [],
  showHints = false,
}) => {
  const responsive = useResponsiveState()
  const [keyboardFocus, setKeyboardFocus] = useState<Position | null>(null)

  const handleCardClick = () => {
    if (!disabled && onCardClick) {
      onCardClick(card.id)
    }
  }

  const handleCellClick = (position: Position) => {
    if (onCellClick) {
      onCellClick(position)
    }
  }

  const getColumnLetter = (colIndex: number): string => {
    return ['B', 'I', 'N', 'G', 'O'][colIndex] || ''
  }

  // Keyboard navigation for the bingo card
  useKeyboardBoardNavigation({
    rows: 5,
    cols: 5,
    keyboardFocus,
    onFocusChange: setKeyboardFocus,
    onAction: () => {
      if (keyboardFocus) {
        handleCellClick(keyboardFocus)
      }
    },
    enabled: !disabled,
  })

  // Convert bingo card data to BoardGrid cells
  const cells: BoardCell[] = useMemo(() => {
    return card.grid.flatMap((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const isHinted =
          showHints && hintPositions.some((pos) => pos.row === rowIndex && pos.col === colIndex)
        return {
          position: { row: rowIndex, col: colIndex },
          content: cell.isFreeSpace
            ? { type: 'text' as const, value: 'FREE' }
            : { type: 'number' as const, value: cell.number },
          state: {
            selected: cell.marked,
            highlighted: isHinted,
          },
          isDarkSquare: (rowIndex + colIndex) % 2 === 0,
          isPlayable: !disabled,
          ariaLabel: cell.isFreeSpace
            ? `Free space, ${cell.marked ? 'marked' : 'unmarked'}${isHinted ? ', hinted' : ''}`
            : `${cell.number}, column ${getColumnLetter(colIndex)}, ${cell.marked ? 'marked' : 'unmarked'}${isHinted ? ', hinted' : ''}`,
        }
      }),
    )
  }, [card.grid, disabled, hintPositions, showHints])

  return (
    <div
      className={`${styles.root} ${patterns && patterns.length > 0 ? styles.winner : ''} ${disabled ? styles.disabled : ''}`}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Bingo card ${card.id}`}
    >
      {/* Headers */}
      <div className={styles.headers}>
        {['B', 'I', 'N', 'G', 'O'].map((letter) => (
          <div key={letter} className={styles.header}>
            {letter}
          </div>
        ))}
      </div>

      {/* Grid using shared BoardGrid component */}
      <BoardGrid
        rows={5}
        cols={5}
        cells={cells}
        keyboardFocus={keyboardFocus}
        onCellClick={handleCellClick}
        className={styles.grid}
        ariaLabel={`Bingo card ${card.id} grid`}
        responsive={{
          touchOptimized: responsive.isMobile,
          supportsHover: responsive.supportsHover,
          compactViewport: responsive.compactViewport,
        }}
      />

      {/* Win Indicator */}
      {patterns && patterns.length > 0 && (
        <div className={styles.winIndicator}>
          <div className={styles.winLabel}>BINGO!</div>
          <div className={styles.patterns}>{patterns.join(', ')}</div>
        </div>
      )}
    </div>
  )
}
