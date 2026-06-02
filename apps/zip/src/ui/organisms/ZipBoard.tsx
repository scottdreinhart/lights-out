/**
 * Zip Board Component
 * Visual representation of the maze navigation board
 */

import type { Maze, Move, Position } from '@/domain'
import { CELL_SYMBOLS } from '@/domain'
import { BoardGrid, Tile, type BoardCell } from '@games/ui-board-core'
import type React from 'react'
import styles from './ZipBoard.module.css'

interface ZipBoardProps {
  maze: Maze
  playerPosition: Position
  collectedItems: Position[]
  totalItems: number
  playerPathMoves?: Move[]
  aiPathMoves?: Move[]
  highlightedPosition?: Position | null
  onCellClick?: (position: Position) => void
}

const positionKey = (position: Position): string => `${position.row},${position.col}`

const buildVisitCounts = (moves: Move[] = []): Map<string, number> => {
  const counts = new Map<string, number>()
  if (moves.length === 0) {
    return counts
  }

  const startKey = positionKey(moves[0].from)
  counts.set(startKey, 1)

  for (const move of moves) {
    const key = positionKey(move.to)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return counts
}

const pushRepeatIntensityClass = (
  classNames: string[],
  visits: number,
  tier2Class: string,
  tier3Class: string,
  tier4PlusClass: string,
): void => {
  if (visits <= 1) {
    return
  }

  if (visits === 2) {
    classNames.push(tier2Class)
    return
  }

  if (visits === 3) {
    classNames.push(tier3Class)
    return
  }

  classNames.push(tier4PlusClass)
}

export const ZipBoard = ({
  maze,
  playerPosition,
  collectedItems,
  totalItems,
  playerPathMoves = [],
  aiPathMoves = [],
  highlightedPosition,
  onCellClick,
}: ZipBoardProps) => {
  const areAllItemsCollected = collectedItems.length >= totalItems
  const rows = maze.length
  const cols = maze[0]?.length ?? 0

  const boardCells: BoardCell[] = maze.flatMap((row, rowIndex) =>
    row.map(
      (cell, colIndex): BoardCell => ({
        position: { row: rowIndex, col: colIndex },
        isPlayable: cell.type !== 'wall',
      }),
    ),
  )

  const playerVisitCounts = buildVisitCounts(playerPathMoves)
  const aiVisitCounts = buildVisitCounts(aiPathMoves)

  const getDisplayCellType = (row: number, col: number) => {
    const cell = maze[row][col]
    const isPlayer = row === playerPosition.row && col === playerPosition.col
    const shouldHideGoal = cell.type === 'goal' && !areAllItemsCollected && !isPlayer

    if (isPlayer) {
      return 'player'
    }

    if (shouldHideGoal) {
      return 'empty'
    }

    return cell.type
  }

  const renderCell = (cell: BoardCell) => {
    const row = cell.position.row
    const col = cell.position.col
    const displayCellType = getDisplayCellType(row, col)
    const isHighlighted =
      !!highlightedPosition && row === highlightedPosition.row && col === highlightedPosition.col
    const isCollected =
      maze[row][col].type === 'item' &&
      collectedItems.some((item) => item.row === row && item.col === col)
    const key = positionKey({ row, col })
    const playerVisits = playerVisitCounts.get(key) ?? 0
    const aiVisits = aiVisitCounts.get(key) ?? 0
    const hasPlayerTrail = playerVisits > 0
    const hasAiTrail = aiVisits > 0

    const cellClassNames = [styles.cell]
    if (displayCellType === 'wall') {
      cellClassNames.push(styles.wall)
    }
    if (displayCellType === 'start') {
      cellClassNames.push(styles.start)
    }
    if (displayCellType === 'goal') {
      cellClassNames.push(styles.goal)
    }
    if (displayCellType === 'item') {
      cellClassNames.push(styles.item)
    }
    if (displayCellType === 'player') {
      cellClassNames.push(styles.player)
    }
    if (hasPlayerTrail) {
      cellClassNames.push(styles.playerTrail)
    }
    if (hasAiTrail) {
      cellClassNames.push(styles.aiTrail)
    }
    if (hasPlayerTrail && hasAiTrail) {
      cellClassNames.push(styles.sharedTrail)
    }
    pushRepeatIntensityClass(
      cellClassNames,
      playerVisits,
      styles.playerTrailRepeat2,
      styles.playerTrailRepeat3,
      styles.playerTrailRepeat4Plus,
    )
    pushRepeatIntensityClass(
      cellClassNames,
      aiVisits,
      styles.aiTrailRepeat2,
      styles.aiTrailRepeat3,
      styles.aiTrailRepeat4Plus,
    )
    if (isHighlighted) {
      cellClassNames.push(styles.highlighted)
    }

    return (
      <Tile
        key={`${row}-${col}`}
        position={{ row, col }}
        className={cellClassNames.join(' ')}
        isPlayable={displayCellType !== 'wall'}
        aria-label={`${displayCellType} at row ${row + 1}, column ${col + 1}`}
        onClick={() => onCellClick?.({ row, col })}
        onKeyDown={(event: React.KeyboardEvent) => {
          if (displayCellType !== 'wall' && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault()
            onCellClick?.({ row, col })
          }
        }}
      >
        {!isCollected && CELL_SYMBOLS[displayCellType]}
      </Tile>
    )
  }

  return (
    <BoardGrid
      rows={rows}
      cols={cols}
      cells={boardCells}
      className={styles.board}
      ariaLabel="Zip maze board"
      renderCell={(boardCell) => renderCell(boardCell)}
    />
  )
}
