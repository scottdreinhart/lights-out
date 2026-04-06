/**
 * Memory Game: App Hook to manage game state
 */

import type { GameState } from '@/domain'
import { createInitialGameState, getElapsedTime, revealCard } from '@/domain'
import { useCallback, useEffect, useState } from 'react'

export function useMemory() {
  const [state, setState] = useState<GameState>(createInitialGameState())
  const [elapsedTime, setElapsedTime] = useState(0)

  // Timer
  useEffect(() => {
    if (state.gameOver) return

    const interval = setInterval(() => {
      setElapsedTime(getElapsedTime(state))
    }, 1000)

    return () => clearInterval(interval)
  }, [state.gameOver, state.startTime])

  // Handle mismatch flip-back
  useEffect(() => {
    if (!state.mismatchPair || state.isProcessing === false) return

    const timer = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        cards: prev.cards.map((c) =>
          prev.mismatchPair && prev.mismatchPair.includes(c.id) ? { ...c, revealed: false } : c,
        ),
        selectedCards: [],
        isProcessing: false,
        mismatchPair: undefined,
      }))
    }, 1000)

    return () => clearTimeout(timer)
  }, [state.mismatchPair])

  const selectCard = useCallback((cardId: string) => {
    setState((prev) => revealCard(prev, cardId))
  }, [])

  const reset = useCallback(() => {
    setState(createInitialGameState())
    setElapsedTime(0)
  }, [])

  return {
    state,
    selectCard,
    reset,
    elapsedTime,
    isWon: state.gameOver && state.matches === state.cards.length / 2,
  }
}
