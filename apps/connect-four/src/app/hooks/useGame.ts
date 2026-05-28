import type { Column, Difficulty, GameMode, GameState } from '@/domain'
import { applyMove, checkGameResult, createInitialState, isColumnPlayable } from '@/domain'
import { useCallback, useEffect, useState } from 'react'

import {
  computeMoveAsync,
  ensureAsyncWorkerReady,
  terminateAsyncWorker,
} from '../connectFourAiService'
import { load, save } from '../storageService'

const MODE_KEY = 'connect-four-mode'
const DIFFICULTY_KEY = 'connect-four-difficulty'
const GAME_KEY = 'connect-four-state'

export const useGame = () => {
  const [state, setState] = useState<GameState>(() => {
    const mode = load<GameMode>(MODE_KEY, 'pvc')
    const difficulty = load<Difficulty>(DIFFICULTY_KEY, 'medium')
    return load<GameState>(GAME_KEY, createInitialState(mode, difficulty))
  })
  const [isThinking, setIsThinking] = useState(false)

  useEffect(() => {
    ensureAsyncWorkerReady()
    return () => {
      terminateAsyncWorker()
    }
  }, [])

  const playColumn = useCallback(
    (column: number) => {
      if (state.result.status !== 'playing' || !isColumnPlayable(state.board, column)) {
        return
      }

      const next = applyMove(state, column as Column, checkGameResult)
      if (!next) {
        return
      }

      setState(next)
      save(GAME_KEY, next)
    },
    [state],
  )

  useEffect(() => {
    if (state.mode !== 'pvc' || state.currentPlayer !== 2 || state.result.status !== 'playing') {
      return
    }

    let active = true
    setIsThinking(true)

    void computeMoveAsync(state.board, 2, state.difficulty).then((result) => {
      if (!active) {
        return
      }
      const next = applyMove(state, result.move as Column, checkGameResult)
      if (next) {
        setState(next)
        save(GAME_KEY, next)
      }
      setIsThinking(false)
    })

    return () => {
      active = false
      setIsThinking(false)
    }
  }, [state])

  const newGame = useCallback(
    (mode: GameMode = state.mode, difficulty: Difficulty = state.difficulty) => {
      const next = createInitialState(mode, difficulty)
      setState(next)
      setIsThinking(false)
      save(MODE_KEY, mode)
      save(DIFFICULTY_KEY, difficulty)
      save(GAME_KEY, next)
    },
    [state.difficulty, state.mode],
  )

  const setMode = useCallback(
    (mode: GameMode) => {
      newGame(mode, state.difficulty)
    },
    [newGame, state.difficulty],
  )

  const setDifficulty = useCallback(
    (difficulty: Difficulty) => {
      newGame(state.mode, difficulty)
    },
    [newGame, state.mode],
  )

  const undo = useCallback(() => {
    if (state.moveHistory.length === 0) {
      return
    }

    const stepsBack = state.mode === 'pvc' && state.moveHistory.length >= 2 ? 2 : 1
    let nextState = createInitialState(state.mode, state.difficulty)
    const moves = state.moveHistory.slice(0, -stepsBack)

    for (const column of moves) {
      const next = applyMove(nextState, column, checkGameResult)
      if (next) {
        nextState = next
      }
    }

    setState(nextState)
    setIsThinking(false)
    save(GAME_KEY, nextState)
  }, [state])

  return {
    state,
    isThinking,
    playColumn,
    newGame,
    setMode,
    setDifficulty,
    undo,
  }
}
