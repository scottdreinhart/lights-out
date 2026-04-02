import React from 'react'
import { BoardGrid as SharedBoardGrid, Tile } from '@games/ui-board-core'
import { useResponsiveState } from '@games/common'
import styles from './BoardGrid.module.css'

export interface BoardGridProps {
  board: (string | null)[][]
  onCellClick: (row: number, col: number) => void
  selectedPosition?: { row: number; col: number } | null
  validMoves?: { row: number; col: number }[]
  disableInteraction?: boolean
  winLine?: { row: number; col: number }[]
}

export const BoardGrid: React.FC<BoardGridProps> = ({
  board,
  onCellClick,
  selectedPosition,
  validMoves = [],
  disableInteraction = false,
  winLine = [],
}) => {
  const responsive = useResponsiveState()

  // Map TicTacToe cell state to visual properties
  const getTileContent = (value: string | null, row: number, col: number) => {
    if (!value) return null

    const isSelected = selectedPosition?.row === row && selectedPosition?.col === col
    const isWinCell = winLine.some((w) => w.row === row && w.col === col)
    const isValidMove = validMoves.some((m) => m.row === row && m.col === col)

    return {
      text: value,
      state: isWinCell ? 'win' : isSelected ? 'selected' : isValidMove ? 'highlighted' : 'default',
    }
  }

  return (
    <SharedBoardGrid
      rows={3}
      cols={3}
      className={styles.tictactoeBoard}
      responsive={responsive}
      onCellClick={(row, col) => {
        if (!disableInteraction && board[row][col] === null) {
          onCellClick(row, col)
        }
      }}
    >
      {board.map((row, rowIdx) =>
        row.map((cellValue, colIdx) => (
          <Tile
            key={`${rowIdx}-${colIdx}`}
            row={rowIdx}
            col={colIdx}
            content={getTileContent(cellValue, rowIdx, colIdx)}
            disabled={disableInteraction || cellValue !== null}
          />
        )),
      )}
    </SharedBoardGrid>
  )
}

export default BoardGrid
