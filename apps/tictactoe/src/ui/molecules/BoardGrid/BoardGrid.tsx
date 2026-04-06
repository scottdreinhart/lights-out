import { useResponsiveState } from '@games/app-hook-utils'
import {
  BoardGrid as SharedBoardGrid,
  Tile,
  type Position,
  type TileContent,
  type TileState,
} from '@games/ui-board-core'
import React from 'react'
import styles from './BoardGrid.module.css'

export interface BoardGridProps {
  board: (string | null)[]
  onCellClick: (position: Position) => void
  selectedPosition?: Position | null
  validMoves?: Position[]
  disableInteraction?: boolean
  winLine?: Position[]
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
  const BOARD_SIZE = 3

  // Map TicTacToe cell state to TileContent format
  const getTileContent = (cellIndex: number): TileContent | undefined => {
    const value = board[cellIndex]
    if (!value) {
      return undefined
    }

    return {
      type: 'text',
      value,
    }
  }

  // Map TicTacToe cell state to TileState format
  const getTileState = (position: Position): TileState => {
    const cellIndex = position.row * BOARD_SIZE + position.col
    const isSelected =
      selectedPosition?.row === position.row && selectedPosition?.col === position.col
    const isWinCell = winLine.some((w) => w.row === position.row && w.col === position.col)
    const isValidMove = validMoves.some((m) => m.row === position.row && m.col === position.col)
    const isCellOccupied = board[cellIndex] !== null

    return {
      selected: isSelected,
      highlighted: isValidMove,
      error: isWinCell,
      disabled: disableInteraction || isCellOccupied,
    }
  }

  // Build cell data for SharedBoardGrid
  const cells = board.map((value, index) => ({
    position: {
      row: Math.floor(index / BOARD_SIZE),
      col: index % BOARD_SIZE,
    },
    isDarkSquare: false,
    isPlayable: !disableInteraction && value === null,
  }))

  return (
    <SharedBoardGrid
      rows={BOARD_SIZE}
      cols={BOARD_SIZE}
      cells={cells}
      className={styles.tictactoeBoard}
      responsive={responsive}
      keyboardFocus={selectedPosition || null}
      selectedPosition={selectedPosition || null}
      onCellClick={(position) => {
        const cellIndex = position.row * BOARD_SIZE + position.col
        if (!disableInteraction && board[cellIndex] === null) {
          onCellClick(position)
        }
      }}
      renderCell={(cell) => {
        const content = getTileContent(cell.position.row * BOARD_SIZE + cell.position.col)
        const state = getTileState(cell.position)

        return (
          <Tile
            key={`${cell.position.row}-${cell.position.col}`}
            position={cell.position}
            content={content}
            state={state}
            isDarkSquare={cell.isDarkSquare}
            isPlayable={cell.isPlayable}
          />
        )
      }}
    />
  )
}

export default BoardGrid
