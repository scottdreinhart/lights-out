import { useState, useCallback } from 'react'
import type { GameState } from '@/domain'
import {
  createGameState,
  drawNumber,
  resetGame,
  getHintPositions,
  getWinningPatterns,
} from '@/domain'

interface UserGameState {
  card: GameState['card']
  drawnNumbers: number[]
  currentNumber: number | null
  winners: string[]
  gameActive: boolean
  cardCount: number
  showHints: boolean
  hints: Array<[number, number]>
  patternNames: string[]
}

interface UserGameActions {
  draw: () => void
  reset: () => void
  setCardCount: (count: number) => void
  toggleHints: () => void
}

/**
 * Game hook for Pattern Bingo
 */
export const useGame = (): UserGameState & UserGameActions => {
  const [gameState, setGameState] = useState<GameState>(createGameState())
  const [cardCount, setCardCount] = useState(1)
  const [showHints, setShowHints] = useState(false)

  const draw = useCallback(() => {
    setGameState((prev) => drawNumber(prev))
  }, [])

  const reset = useCallback(() => {
    setGameState(resetGame())
  }, [])

  const toggleHints = useCallback(() => {
    setShowHints((prev) => !prev)
  }, [])

  const hints = showHints ? getHintPositions(gameState) : []
  const patterns = getWinningPatterns(gameState)
  const patternNames = patterns.length > 0 ? patterns : []

  return {
    card: gameState.card,
    drawnNumbers: Array.from(gameState.drawnNumbers),
    currentNumber: gameState.currentNumber,
    winners: patternNames as string[],
    gameActive: gameState.gameActive,
    cardCount,
    showHints,
    hints,
    patternNames: patternNames as string[],
    draw,
    reset,
    setCardCount,
    toggleHints,
  }
}
