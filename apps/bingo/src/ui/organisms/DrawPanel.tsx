/**
 * Draw Panel Component - Bingo App Adapter
 * Wraps the shared DrawPanel component and adapts it to the bingo app's interface.
 *
 * This adapter bridges the bingo app's state management with the generic
 * shared DrawPanel component, maintaining backward compatibility while
 * leveraging the shared component's functionality.
 */

import type { BingoCard } from '@games/bingo-domain'
import { DrawPanel as SharedDrawPanel } from '@games/bingo-ui-components/organisms'
import React, { useCallback, useMemo } from 'react'

interface DrawPanelProps {
  currentNumber: number | null
  numbersDrawn: number
  drawnNumbers?: number[]
  totalNumbers: number
  onDraw: () => void
  onReset: () => void
  disabled?: boolean
  winners?: string[]
  card?: BingoCard
}

export const DrawPanel: React.FC<DrawPanelProps> = ({
  currentNumber,
  numbersDrawn,
  drawnNumbers,
  totalNumbers,
  onDraw,
  onReset,
  disabled = false,
  winners: _winners,
  card,
}) => {
  // Determine game state based on remaining numbers
  const remaining = totalNumbers - numbersDrawn
  const gameState =
    remaining === 0 ? ('won' as const) : disabled ? ('idle' as const) : ('playing' as const)

  const resolvedDrawnNumbers = useMemo(() => {
    if (drawnNumbers && drawnNumbers.length > 0) {
      return drawnNumbers
    }
    if (currentNumber !== null) {
      return [currentNumber]
    }
    return []
  }, [drawnNumbers, currentNumber])

  // Wrap the onDraw callback with validation
  const handleDraw = useCallback(() => {
    if (disabled || remaining === 0) {
      return
    }

    onDraw()
    // Result is handled by the onDraw callback
  }, [disabled, remaining, onDraw])

  // Handle new game (same as reset for now)
  const handleNewGame = useCallback(() => {
    onReset()
  }, [onReset])

  return (
    <SharedDrawPanel
      card={card as BingoCard | undefined}
      drawnNumbers={resolvedDrawnNumbers}
      gameState={gameState}
      onDraw={handleDraw}
      onReset={onReset}
      onNewGame={handleNewGame}
      canDraw={!disabled && remaining > 0}
      remainingCount={remaining}
      totalCount={totalNumbers}
    />
  )
}
