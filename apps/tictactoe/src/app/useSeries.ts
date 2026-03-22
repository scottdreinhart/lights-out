import { useCallback, useEffect, useState } from 'react'

import { TOKENS } from '@/domain'
import type { GameState, SeriesScore, Token } from '@/domain'
import usePrevious from './usePrevious.ts'

interface UseSeriesReturn {
  seriesLength: number
  seriesScore: SeriesScore
  seriesWinner: Token | null
  gamesPlayed: number
  winsNeeded: number
  isSeriesActive: boolean
  isSeriesOver: boolean
  setSeriesLength: (length: number) => void
  resetSeries: () => void
}

const useSeries = (gameState: GameState): UseSeriesReturn => {
  const [seriesLength, setSeriesLengthRaw] = useState(0)
  const [seriesScore, setSeriesScore] = useState<SeriesScore>({ X: 0, O: 0 })
  const [seriesWinner, setSeriesWinner] = useState<Token | null>(null)
  const [gamesPlayed, setGamesPlayed] = useState(0)

  const prevGameOver = usePrevious(gameState.isOver)

  useEffect(() => {
    if (seriesLength === 0) {
      return
    }
    if (!gameState.isOver || prevGameOver) {
      return
    }
    if (seriesWinner) {
      return
    }

    setGamesPlayed((prev) => prev + 1)

    if (gameState.winner) {
      const { winner } = gameState
      setSeriesScore((prev) => {
        const next = {
          ...prev,
          [winner]: prev[winner] + 1,
        }
        const needed = Math.ceil(seriesLength / 2)
        if (next[TOKENS.HUMAN] >= needed) {
          setSeriesWinner(TOKENS.HUMAN)
        } else if (next[TOKENS.CPU] >= needed) {
          setSeriesWinner(TOKENS.CPU)
        }
        return next
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally tracking only .isOver and .winner, not the full gameState object
  }, [gameState.isOver, gameState.winner, prevGameOver, seriesLength, seriesWinner])

  const setSeriesLength = useCallback((length: number) => {
    setSeriesLengthRaw(length)
    setSeriesScore({ X: 0, O: 0 })
    setSeriesWinner(null)
    setGamesPlayed(0)
  }, [])

  const resetSeries = useCallback(() => {
    setSeriesScore({ X: 0, O: 0 })
    setSeriesWinner(null)
    setGamesPlayed(0)
  }, [])

  return {
    seriesLength,
    seriesScore,
    seriesWinner,
    gamesPlayed,
    winsNeeded: seriesLength > 0 ? Math.ceil(seriesLength / 2) : 0,
    isSeriesActive: seriesLength > 0,
    isSeriesOver: seriesWinner !== null,
    setSeriesLength,
    resetSeries,
  }
}

export default useSeries
