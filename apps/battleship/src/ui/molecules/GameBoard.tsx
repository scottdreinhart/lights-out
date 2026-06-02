import { memo, useMemo } from 'react'

import type { Board } from '@/domain'

import { useResponsiveState } from '@games/app-hook-utils'
import {
  BoardGrid,
  describePosition,
  type BoardCell as BoardCellType,
  type Position,
} from '@games/ui-board-core'
import styles from './GameBoard.module.css'

interface GameBoardProps {
  readonly board: Board
  readonly showShips: boolean
  readonly onCellClick?: (row: number, col: number) => void
  readonly disabled?: boolean
  readonly label: string
  readonly blinkingCells?: Set<string>
  readonly keyboardFocus?: Position | null
}

/**
 * Map cell state to display content
 *
 * Battleship uses cell states to track board progress:
 * - empty: No interaction yet
 * - ship: Ship placed (shown only if showShips=true)
 * - playerHit: Player successfully hit opponent's ship
 * - playerMiss: Player missed
 * - cpuHit: CPU successfully hit player's ship
 * - cpuMiss: CPU missed
 */
function getCellContent(state: string, showShip: boolean): string {
  switch (state) {
    case 'ship':
      return showShip ? '🚢' : ''
    case 'playerHit':
      return '💥'
    case 'playerMiss':
      return '💧'
    case 'cpuHit':
      return '💥'
    case 'cpuMiss':
      return '💧'
    default:
      return ''
  }
}

function getCellDescription(state: string, showShip: boolean): string {
  switch (state) {
    case 'ship':
      return showShip ? 'ship' : 'unrevealed'
    case 'playerHit':
    case 'cpuHit':
      return 'hit'
    case 'playerMiss':
    case 'cpuMiss':
      return 'miss'
    default:
      return 'empty'
  }
}

/**
 * Check if a cell has been bombed (shot at)
 */
function isBombed(state: string): boolean {
  return (
    state === 'playerHit' || state === 'playerMiss' || state === 'cpuHit' || state === 'cpuMiss'
  )
}

function GameBoardComponent({
  board,
  showShips,
  onCellClick,
  disabled,
  label,
  blinkingCells,
  keyboardFocus,
}: GameBoardProps) {
  const responsive = useResponsiveState()

  // Build cells array for BoardGrid
  const cells: BoardCellType[] = useMemo(() => {
    const result: BoardCellType[] = []
    for (let row = 0; row < board.size; row++) {
      for (let col = 0; col < board.size; col++) {
        const cellState = board.grid[row]?.[col] || 'empty'
        const cellDisabled = isBombed(cellState)
        const isBlinking = blinkingCells?.has(`${row},${col}`)
        const position = { row, col }
        const cellDescription = getCellDescription(cellState, showShips)

        result.push({
          position,
          ariaLabel: describePosition({
            position,
            content: cellDescription,
            gameContext: label.toLowerCase(),
            squareColor: false,
          }),
          state: {
            disabled: cellDisabled || disabled,
            error: isBlinking,
          },
          content: {
            type: 'text',
            value: getCellContent(cellState, showShips),
          },
        })
      }
    }
    return result
  }, [board, showShips, disabled, blinkingCells])

  const handleCellClick = (position: Position) => {
    if (onCellClick && !disabled) {
      onCellClick(position.row, position.col)
    }
  }

  return (
    <div className={styles.wrapper}>
      {label && <h2 className={styles.label}>{label}</h2>}
      <BoardGrid
        rows={board.size}
        cols={board.size}
        cells={cells}
        keyboardFocus={keyboardFocus}
        onCellClick={handleCellClick}
        ariaLabel={label}
        responsive={{
          touchOptimized: responsive.touchOptimized,
          supportsHover: responsive.supportsHover,
          prefersReducedMotion: responsive.prefersReducedMotion,
        }}
      />
    </div>
  )
}

export const GameBoard = memo(GameBoardComponent)
