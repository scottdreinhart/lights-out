import { ReactNode } from 'react'

import { Board } from '@/domain'
import { Cell } from '@/ui/atoms'
import './GameBoard.css'

interface GameBoardProps {
  board: Board
  onCellClick: (row: number, col: number) => void
  selectedRow?: number
  selectedCol?: number
  headerContent?: ReactNode
  footerContent?: ReactNode
}

export function GameBoard({
  board,
  onCellClick,
  selectedRow,
  selectedCol,
  headerContent,
  footerContent,
}: GameBoardProps) {
  const boardRows = board.map((row, rowIndex) => (
    <div key={`row-${rowIndex}`} className="board-row">
      {row.map((isLit, colIndex) => (
        <Cell
          key={`cell-${rowIndex}-${colIndex}`}
          isLit={isLit}
          onClick={() => onCellClick(rowIndex, colIndex)}
          row={rowIndex}
          col={colIndex}
          isSelected={selectedRow === rowIndex && selectedCol === colIndex}
        />
      ))}
    </div>
  ))

  return (
    <div className="game-board">
      {headerContent ? <div className="game-board-header">{headerContent}</div> : null}
      <div className="game-board-grid">{boardRows}</div>
      {footerContent ? <div className="game-board-footer">{footerContent}</div> : null}
    </div>
  )
}
