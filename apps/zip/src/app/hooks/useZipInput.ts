import { useCallback } from 'react'

import { useGridNavigationInput } from '@games/app-hook-utils'
import type { Direction, Position } from '@/domain'

interface UseZipInputParams {
  isComplete: boolean
  playerPosition: Position
  canMove: (direction: Direction) => boolean
  makePlayerMove: (direction: Direction) => void
  clearHint: () => void
}

interface UseZipInputResult {
  handleCellClick: (position: Position) => void
}

const getDirectionToPosition = (from: Position, target: Position): Direction | null => {
  const deltaRow = target.row - from.row
  const deltaCol = target.col - from.col

  if (Math.abs(deltaRow) + Math.abs(deltaCol) !== 1) {
    return null
  }

  if (deltaRow === -1) {
    return 'up'
  }
  if (deltaRow === 1) {
    return 'down'
  }
  if (deltaCol === -1) {
    return 'left'
  }
  if (deltaCol === 1) {
    return 'right'
  }

  return null
}

export const useZipInput = ({
  isComplete,
  playerPosition,
  canMove,
  makePlayerMove,
  clearHint,
}: UseZipInputParams): UseZipInputResult => {
  const handleCellClick = useCallback(
    (position: Position) => {
      if (isComplete) {
        return
      }

      const direction = getDirectionToPosition(playerPosition, position)
      if (!direction) {
        return
      }

      if (!canMove(direction)) {
        return
      }

      makePlayerMove(direction)
      clearHint()
    },
    [isComplete, playerPosition, canMove, makePlayerMove, clearHint],
  )

  useGridNavigationInput(
    {
      onMove: (direction) => {
        if (isComplete || !canMove(direction)) {
          return
        }
        makePlayerMove(direction)
        clearHint()
      },
      onHint: isComplete ? undefined : clearHint,
    },
    { enabled: !isComplete, includeWasd: true, allowRepeat: false },
  )

  return {
    handleCellClick,
  }
}
