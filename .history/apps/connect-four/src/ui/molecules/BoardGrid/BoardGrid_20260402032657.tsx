import React from 'react'
import { BoardGrid as SharedBoardGrid, Tile } from '@games/ui-board-core'
import { useResponsiveState } from '@games/common'
import styles from './BoardGrid.module.css'

export interface BoardGridProps {
  rows: number
  cols: number
  cells: (string | null)[][]
  onCellClick: (row: number, col: number) => void
  selectedPosition?: { row: number; col: number } | null
  validMoves?: { row: number; col: number }[]
  disableInteraction?: boolean
}

export const BoardGrid: React.FC<BoardGridProps> = ({
  rows,
  cols,
  cells,
  onCellClick,
  selectedPosition,
  validMoves = [],
  disableInteraction = false,
}) => {
  const responsive = useResponsiveState()

  // Map Connect-Four cell state to visual properties
  const getTileContent = (value: string | null, row: number, col: number) => {
    if (!value) return null

    const isSelected = selectedPosition?.row === row && selectedPosition?.col === col
    const isValidMove = validMoves.some((m) => m.row === row && m.col === col)

    return {
      icon: value === 'R' ? '🔴' : value === 'Y' ? '🟡' : undefined,
      state: isSelected ? 'selected' : isValidMove ? 'highlighted' : 'default',
    }
  }

  return (
    <SharedBoardGrid
      rows={rows}
      cols={cols}
      className={styles.connectFourBoard}
      responsive={responsive}
      onCellClick={(row, col) => {
        if (!disableInteraction) {
          onCellClick(row, col)
        }
      }}
    >
      {cells.map((row, rowIdx) =>
        row.map((cellValue, colIdx) => (
          <Tile
            key={`${rowIdx}-${colIdx}`}
            row={rowIdx}
            col={colIdx}
            content={getTileContent(cellValue, rowIdx, colIdx)}
            disabled={disableInteraction}
          />
        )),
      )}
    </SharedBoardGrid>
  )
}

export default BoardGrid
