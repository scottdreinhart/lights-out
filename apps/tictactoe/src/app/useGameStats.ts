import { useEffect, useState } from 'react'

import { TOKENS } from '@/domain'
import type { GameState, Score } from '@/domain'
import usePrevious from './usePrevious.ts'

interface UseGameStatsReturn {
  score: Score
  streak: number
  bestTime: number | null
}

const useGameStats = (
  gameState: GameState,
  historyIndex: number,
  gameStartTime: number | null,
): UseGameStatsReturn => {
  const [score, setScore] = useState<Score>({ X: 0, O: 0, draws: 0 })
  const [streak, setStreak] = useState(0)
  const [bestTime, setBestTime] = useState<number | null>(null)

  const prevGameOver = usePrevious(gameState.isOver)
  const prevHistoryIndex = usePrevious(historyIndex)

  useEffect(() => {
    const justEnded = gameState.isOver && !prevGameOver

    if (!justEnded) {
      return
    }

    const undoHappened = prevHistoryIndex !== undefined && historyIndex < prevHistoryIndex

    if (undoHappened && gameState.winner === TOKENS.HUMAN) {
      setStreak(0)
    }

    setScore((prev) => {
      const newScore = { ...prev }
      if (gameState.winner) {
        newScore[gameState.winner] = prev[gameState.winner] + 1

        if (gameState.winner === TOKENS.HUMAN && !undoHappened) {
          setStreak((s) => s + 1)
        } else if (gameState.winner === TOKENS.HUMAN && undoHappened) {
          setStreak(0)
        } else if (gameState.winner === TOKENS.CPU) {
          setStreak(0)
        }

        if (gameState.winner === TOKENS.HUMAN && gameStartTime !== null) {
          const winTime = (Date.now() - gameStartTime) / 1000
          setBestTime((currentBest) =>
            currentBest === null || winTime < currentBest ? winTime : currentBest,
          )
        }
      } else {
        newScore.draws = prev.draws + 1
        setStreak(0)
      }
      return newScore
    })
  }, [
    gameState.isOver,
    gameState.winner,
    historyIndex,
    gameStartTime,
    prevGameOver,
    prevHistoryIndex,
  ])

  return { score, streak, bestTime }
}

export default useGameStats
