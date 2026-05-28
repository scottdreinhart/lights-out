import {
  cloneGameState,
  createGameState,
  DEFAULT_DRAW_SPEED,
  drawNumber,
  getCardHint,
  getWinnerCheck,
  resetGame,
  setDrawSpeed,
  startAutoDraw,
  stopAutoDraw,
  type BlackoutBingoGameState,
} from '@/domain'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useGame(cardCount: number = 1) {
  const [gameState, setGameState] = useState<BlackoutBingoGameState>(() =>
    createGameState(cardCount, DEFAULT_DRAW_SPEED),
  )
  const autoDrawRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (gameState.isAutoDrawing && gameState.gameActive) {
      autoDrawRef.current = setInterval(() => {
        setGameState((previous) => {
          const next = cloneGameState(previous)
          drawNumber(next)
          return next
        })
      }, gameState.drawSpeed)
    } else if (autoDrawRef.current) {
      clearInterval(autoDrawRef.current)
      autoDrawRef.current = null
    }

    return () => {
      if (autoDrawRef.current) {
        clearInterval(autoDrawRef.current)
        autoDrawRef.current = null
      }
    }
  }, [gameState.isAutoDrawing, gameState.gameActive, gameState.drawSpeed])

  const drawSingleNumber = useCallback(() => {
    setGameState((previous) => {
      const next = cloneGameState(previous)
      drawNumber(next)
      return next
    })
  }, [])

  const handleReset = useCallback(() => {
    setGameState((previous) => {
      const next = cloneGameState(previous)
      resetGame(next)
      return next
    })
  }, [])

  const handleNewGame = useCallback(
    (newCardCount: number = cardCount) => {
      setGameState(createGameState(newCardCount, gameState.drawSpeed))
    },
    [cardCount, gameState.drawSpeed],
  )

  const toggleAutoDraw = useCallback(() => {
    setGameState((previous) => {
      const next = cloneGameState(previous)
      if (next.isAutoDrawing) {
        stopAutoDraw(next)
      } else {
        startAutoDraw(next)
      }
      return next
    })
  }, [])

  const changeDrawSpeed = useCallback((speed: number) => {
    setGameState((previous) => {
      const next = cloneGameState(previous)
      setDrawSpeed(next, speed)
      return next
    })
  }, [])

  const getWinnerChecks = useCallback(
    (cardId: string) => getWinnerCheck(gameState, cardId),
    [gameState],
  )
  const getHintPositions = useCallback(
    (cardId: string) => getCardHint(gameState, cardId),
    [gameState],
  )

  return {
    gameState,
    drawSingleNumber,
    handleReset,
    handleNewGame,
    toggleAutoDraw,
    changeDrawSpeed,
    getWinnerChecks,
    getHintPositions,
  }
}

export default useGame
