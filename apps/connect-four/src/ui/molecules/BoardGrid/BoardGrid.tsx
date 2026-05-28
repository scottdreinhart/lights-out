import { useResponsiveState } from '@games/common'
import { BoardGrid as SharedBoardGrid } from '@games/ui-board-core'
import React from 'react'
import styles from './BoardGrid.module.css'

export interface BoardGridProps {
  rows: number
  cols: number
  cells: (string | null)[][]
  onCellClick: (col: number) => void
  selectedColumn?: number | null
  disableInteraction?: boolean
}

export const BoardGrid: React.FC<BoardGridProps> = ({
  rows,
  cols,
  cells,
  onCellClick,
  selectedColumn,
  disableInteraction = false,
}) => {
  const responsive = useResponsiveState()

  const getTileContent = (cellIdx: number) => {
    const col = cellIdx % cols
    const row = Math.floor(cellIdx / cols)
    const value = cells[row]?.[col]

    let iconName: string | undefined
    if (value === 'R') {
      iconName = 'red-disc'
    } else if (value === 'Y') {
      iconName = 'yellow-disc'
    } else {
      iconName = undefined
    }

    return {
      type: 'icon' as const,
      iconName,
    }
  }

  return (
    <div>
      {/* Column selection indicator */}
      {selectedColumn !== null && selectedColumn !== undefined && (
        <div
          className={styles.columnIndicator}
          style={
            {
              '--indicator-position': `calc((100% / ${cols}) * ${selectedColumn} + (100% / ${cols}) / 2)`,
            } as React.CSSProperties
          }
          aria-label={`Column ${selectedColumn + 1} selected`}
        />
      )}

      <SharedBoardGrid
        rows={rows}
        cols={cols}
        cells={Array.from({ length: rows * cols }, (_, idx) => ({
          position: { row: Math.floor(idx / cols), col: idx % cols },
          content: getTileContent(idx),
        }))}
        className={styles.connectFourBoard}
        responsive={responsive}
        onCellClick={(position) => {
          if (!disableInteraction) {
            onCellClick(position.col)
          }
        }}
      />
    </div>
  )
}

export default BoardGrid
