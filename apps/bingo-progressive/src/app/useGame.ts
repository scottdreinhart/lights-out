/**
 * Progressive Bingo game state management hook
 */

import { useCallback, useMemo, useState } from 'react'
import {
  createGameState,
  drawNumber,
  getHints,
  getJackpot,
  getLevel,
  getWinners,
  resetGame
} from '@/domain'
import type { GameState } from '@/domain'

export function useGame(cardCount: number = 1) {
  const [gameState, setGameState] = useState<GameState>(() =>
    createGameState(cardCount)
  )

  const drawSingleNumber = useCallback(() => {
    const result = drawNumber(gameState)
    if (result) {
      setGameState({ ...gameState })
    }
  }, [gameState])

  const handleReset = useCallback(() => {
    setGameState(createGameState(gameState.cards.length))
  }, [gameState.cards.length])

  const handleNewGame = useCallback((newCardCount: number) => {
    setGameState(createGameState(newCardCount))
  }, [])

  const winners = useMemo(() => getWinners(gameState), [gameState])
  const level = useMemo(() => getLevel(gameState), [gameState])
  const jackpot = useMemo(() => getJackpot(gameState), [gameState])
  const hints = useMemo(() => getHints(gameState), [gameState])

  return {
    gameState,
    drawSingleNumber,
    handleReset,
    handleNewGame,
    getWinnerChecks: () => gameState.winners,
    getHintPositions: () => hints,
    level,
    jackpot
  }
}
