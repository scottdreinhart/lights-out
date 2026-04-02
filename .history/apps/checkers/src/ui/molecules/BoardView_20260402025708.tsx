import type { ReactNode } from 'react'
import type { ResponsiveContentDensity } from '@/app'
import {
  getPieceAt,
  isPlayableSquare,
  positionsEqual,
  type Board,
  type Move,
  type Position,
} from '@/domain'
import { BoardGrid, type BoardCell } from '@games/ui-board-core'

import styles from './BoardView.module.css'

interface BoardViewProps {
  board: Board
  legalMoves: readonly Move[]
  selected: Position | null
  lastMove: Move | null
  keyboardFocus: Position | null
  disabled: boolean
  compactViewport: boolean
  shortViewport: boolean
  touchOptimized: boolean
  supportsHover: boolean
  prefersReducedMotion: boolean
  contentDensity: ResponsiveContentDensity
  onSquarePress: (position: Position) => void
}

const describeSquare = (
  board: Board,
  position: Position,
  selected: Position | null,
  keyboardFocus: Position | null,
  legalMoves: readonly Move[],
): string => {
  const piece = getPieceAt(board, position)
  const selectable = legalMoves.some((move) => positionsEqual(move.from, position))
  const selectedLabel = selected && positionsEqual(selected, position) ? ', selected' : ''
  const focusedLabel = keyboardFocus && positionsEqual(keyboardFocus, position) ? ', keyboard focus' : ''

  if (!isPlayableSquare(position.row, position.col)) {
    return `Light square ${position.row + 1}, ${position.col + 1}${focusedLabel}`
  }

  if (!piece) {
    const target = selected
      ? legalMoves.some(
          (move) => positionsEqual(move.from, selected) && positionsEqual(move.to, position),
        )
      : false
    return `Dark square ${position.row + 1}, ${position.col + 1}${target ? ', legal destination' : ''}${focusedLabel}`
  }

  const owner = piece.player === 'red' ? 'red checker' : 'black checker'
  const rank = piece.isKing ? ' king' : ''
  const action = selectable ? ', movable' : ''
  return `${owner}${rank} on ${position.row + 1}, ${position.col + 1}${action}${selectedLabel}${focusedLabel}`
}

export function BoardView({
  board,
  legalMoves,
  selected,
  lastMove,
  keyboardFocus,
  disabled,
  compactViewport,
  shortViewport,
  touchOptimized,
  supportsHover,
  prefersReducedMotion,
  contentDensity,
  onSquarePress,
}: BoardViewProps) {
  // Build cells array with state for BoardGrid
  const cells: BoardCell[] = []
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const position = { row, col }
      const piece = getPieceAt(board, position)
      const isDarkSquare = isPlayableSquare(row, col)
      const isSelected = selected ? positionsEqual(selected, position) : false
      const isFocused = keyboardFocus ? positionsEqual(keyboardFocus, position) : false
      const isTarget = selected
        ? legalMoves.some(
            (move) => positionsEqual(move.from, selected) && positionsEqual(move.to, position),
          )
        : false
      const isSelectable = legalMoves.some((move) => positionsEqual(move.from, position))
      const isLastFrom = lastMove ? positionsEqual(lastMove.from, position) : false
      const isLastTo = lastMove ? positionsEqual(lastMove.to, position) : false

      cells.push({
        position,
        isDarkSquare,
        isPlayable: isDarkSquare,
        ariaLabel: describeSquare(board, position, selected, keyboardFocus, legalMoves),
        state: {
          selected: isSelected,
          target: isTarget,
          focused: isFocused,
          lastFrom: isLastFrom,
          lastTo: isLastTo,
        },
        content: piece
          ? {
              type: 'custom',
              customRender: () => (
                <span
                  className={[
                    styles.piece,
                    piece.player === 'red' ? styles.redPiece : styles.blackPiece,
                  ].join(' ')}
                  aria-hidden="true"
                >
                  {piece.isKing ? <span className={styles.kingMark}>K</span> : null}
                </span>
              ),
            }
          : undefined,
      })
    }
  }

  // Custom cell renderer for checkers-specific styling
  const renderCell = (cell: BoardCell, isSelected: boolean, isFocused: boolean): ReactNode => {
    const position = cell.position
    const isTarget = cell.state?.target ?? false
    const isSelectable = legalMoves.some((move) => positionsEqual(move.from, position))
    const isLastFrom = cell.state?.lastFrom ?? false
    const isLastTo = cell.state?.lastTo ?? false

    return (
      <button
        type="button"
        aria-label={cell.ariaLabel}
        className={[
          styles.cell,
          cell.isDarkSquare ? styles.dark : styles.light,
          supportsHover ? styles.hoverable : '',
          isSelectable ? styles.selectable : '',
          isSelected ? styles.selected : '',
          isFocused ? styles.keyboardFocus : '',
          isTarget ? styles.target : '',
          isLastFrom ? styles.lastFrom : '',
          isLastTo ? styles.lastTo : '',
        ]
          .filter(Boolean)
          .join(' ')}
        disabled={disabled || !cell.isDarkSquare}
        onClick={() => onSquarePress(position)}
      >
        {cell.content?.type === 'custom' && cell.content.customRender
          ? cell.content.customRender()
          : null}
      </button>
    )
  }

  return (
    <section
      className={[
        styles.shell,
        compactViewport ? styles.compact : '',
        shortViewport ? styles.short : '',
        touchOptimized ? styles.touchOptimized : '',
        contentDensity === 'compact' ? styles.dense : '',
        prefersReducedMotion ? styles.reducedMotion : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Game board (use arrow keys or WASD to navigate, Space/Enter to select, Escape to cancel)"
    >
      <div className={styles.board}>
        <BoardGrid
          rows={8}
          cols={8}
          cells={cells}
          keyboardFocus={keyboardFocus}
          selectedPosition={selected}
          onCellClick={onSquarePress}
          renderCell={renderCell}
          responsive={{
            touchOptimized,
            supportsHover,
            prefersReducedMotion,
            compactViewport,
          }}
          ariaLabel="Checkers board"
        />
      </div>
      <div className={styles.caption}>
        <span>Red moves first. If a jump exists, you must take it.</span>
        <span>
          {touchOptimized
            ? 'Tap a red piece, then tap a highlighted destination. Use arrow keys to navigate.'
            : 'Select a red piece, then choose its destination. Use arrow keys or WASD to navigate.'}
        </span>
      </div>
    </section>
  )
}
