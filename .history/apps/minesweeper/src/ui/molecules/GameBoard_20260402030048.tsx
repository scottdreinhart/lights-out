import type { ReactNode } from 'react'
import type { Board, Cell } from '@/domain'
import { BoardGrid, type BoardCell as SharedBoardCell } from '@games/ui-board-core'
import { BoardCell } from '@/ui'

interface GameBoardProps {
  board: Board
  cols: number
  hint: { row: number; col: number } | null
  selected: { row: number; col: number }
  disabled: boolean
  onReveal: (row: number, col: number) => void
  onToggleFlag: (event: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => void
  onChord: (event: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => void
}

export function GameBoard({
  board,
  cols,
  hint,
  selected,
  disabled,
  onReveal,
  onToggleFlag,
  onChord,
}: GameBoardProps) {
  // Calculate rows from board
  const rows = board.length

  // Build cells array for BoardGrid
  const cells: SharedBoardCell[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = board[row]?.[col]
      if (!cell) continue

      cells.push({
        position: { row, col },
        isDarkSquare: true,
        isPlayable: true,
        content: {
          type: 'custom',
          customRender: () => (
            <span className="ms-cell-content" aria-hidden="true">
              {cell.state === 'revealed' ? (
                cell.mine ? (
                  <span className="ms-mine">💣</span>
                ) : cell.adjacentMines > 0 ? (
                  <span className="ms-number">{cell.adjacentMines}</span>
                ) : null
              ) : cell.state === 'flagged' ? (
                <span className="ms-flag">🚩</span>
              ) : null}
            </span>
          ),
        },
        state: {
          selected: selected.row === row && selected.col === col,
          hint: hint ? hint.row === row && hint.col === col : false,
        },
      })
    }
  }

  // Custom cell renderer for minesweeper
  const renderCell = (
    cell: SharedBoardCell,
    isSelected: boolean,
    isFocused: boolean,
  ): ReactNode => {
    const minesweeperCell = board[cell.position.row]?.[cell.position.col]
    if (!minesweeperCell) return null

    return (
      <BoardCell
        cell={minesweeperCell}
        highlighted={cell.state?.hint ?? false}
        selected={isSelected}
        disabled={disabled}
        onReveal={onReveal}
        onToggleFlag={onToggleFlag}
        onChord={onChord}
      />
    )
  }

  return (
    <section className="ms-board">
      <BoardGrid
        rows={rows}
        cols={cols}
        cells={cells}
        selectedPosition={selected}
        renderCell={renderCell}
        ariaLabel="Minesweeper board"
      />
    </section>
  )
}