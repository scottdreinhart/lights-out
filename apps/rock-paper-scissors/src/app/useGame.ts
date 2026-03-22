import type { GameState, Move } from '@/domain'
import { createGame, playRound, resetGame } from '@/domain'
import { useCallback, useState } from 'react'

const DEFAULT_BEST_OF = 3

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(() => createGame(DEFAULT_BEST_OF))

  const makeMove = useCallback((move: Move, cpuMove?: Move) => {
    setGameState((prevState) => playRound(prevState, move, cpuMove))
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
