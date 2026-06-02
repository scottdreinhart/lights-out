import type { GameState, Move } from '@/domain'
import { createGame, playRound, resetGame } from '@/domain'
import { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_BEST_OF = 3

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(() => createGame(DEFAULT_BEST_OF))
  const gameStateRef = useRef(gameState)

  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  const makeMove = useCallback(async (move: Move, cpuMove?: Move) => {
    const nextState = await playRound(gameStateRef.current, move, cpuMove)
    setGameState(nextState)
  }, [])

  const newGame = useCallback((bestOf: number = DEFAULT_BEST_OF) => {
    setGameState(resetGame(bestOf))
  }, [])

  return {
    gameState,
    makeMove,
    newGame,
  }
}
