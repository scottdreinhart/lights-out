import type { ResponsiveContentDensity } from '@/app'
import {
  getPieceAt,
  isPlayableSquare,
  positionsEqual,
  type Board,
  type Move,
  type Position,
} from '@/domain'

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
  disabled,
  compactViewport,
  shortViewport,
  touchOptimized,
  supportsHover,
  prefersReducedMotion,
  contentDensity,
  onSquarePress,
}: BoardViewProps) {
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
      aria-label="Game board"
    >
      <div className={styles.board} role="grid" aria-label="Checkers board">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const position = { row: rowIndex, col: colIndex }
            const selectable = legalMoves.some((move) => positionsEqual(move.from, position))
            const target = selected
              ? legalMoves.some(
                  (move) =>
                    positionsEqual(move.from, selected) && positionsEqual(move.to, position),
                )
              : false
            const isSelected = selected ? positionsEqual(selected, position) : false
            const isLastFrom = lastMove ? positionsEqual(lastMove.from, position) : false
            const isLastTo = lastMove ? positionsEqual(lastMove.to, position) : false
            const darkSquare = isPlayableSquare(rowIndex, colIndex)

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                role="gridcell"
                aria-label={describeSquare(board, position, selected, legalMoves)}
                className={[
                  styles.cell,
                  darkSquare ? styles.dark : styles.light,
                  supportsHover ? styles.hoverable : '',
                  selectable ? styles.selectable : '',
                  isSelected ? styles.selected : '',
                  target ? styles.target : '',
                  isLastFrom ? styles.lastFrom : '',
                  isLastTo ? styles.lastTo : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                disabled={disabled || !darkSquare}
                onClick={() => onSquarePress(position)}
              >
                {piece ? (
                  <span
                    className={[
                      styles.piece,
                      piece.player === 'red' ? styles.redPiece : styles.blackPiece,
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    {piece.isKing ? <span className={styles.kingMark}>K</span> : null}
                  </span>
                ) : null}
              </button>
            )
          }),
        )}
      </div>
      <div className={styles.caption}>
        <span>Red moves first. If a jump exists, you must take it.</span>
        <span>
          {touchOptimized
            ? 'Tap a red piece, then tap a highlighted destination.'
            : 'Select a red piece, then choose its destination.'}
        </span>
      </div>
    </section>
  )
}
