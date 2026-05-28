import type { Difficulty, GamePhase, GameState } from '@/domain'
import { applyGuess, createInitialBoard } from '@/domain'
import { useCallback, useState } from 'react'

import { load, save } from '../storageService'

const DIFFICULTY_KEY = 'hangman-difficulty'
const GAME_STATE_KEY = 'hangman-state'

interface PersistedGameState {
  word: string
  guessedLetters: string[]
  wrongGuesses: number
  maxWrongGuesses: number
  phase: GamePhase
}

const toPersisted = (state: GameState): PersistedGameState => ({
  word: state.word,
  guessedLetters: [...state.guessedLetters],
  wrongGuesses: state.wrongGuesses,
  maxWrongGuesses: state.maxWrongGuesses,
  phase: state.phase,
})

const fromPersisted = (raw: PersistedGameState | null): GameState | null => {
  if (!raw) {
    return null
  }

  return {
    word: raw.word,
    guessedLetters: new Set(raw.guessedLetters),
    wrongGuesses: raw.wrongGuesses,
    maxWrongGuesses: raw.maxWrongGuesses,
    phase: raw.phase,
  }
}

export const useGame = () => {
  const [difficulty, setDifficultyState] = useState<Difficulty>(() =>
    load(DIFFICULTY_KEY, 'medium'),
  )
  const [state, setState] = useState<GameState>(() => {
    const restored = fromPersisted(load<PersistedGameState | null>(GAME_STATE_KEY, null))
    return restored ?? createInitialBoard(load(DIFFICULTY_KEY, 'medium'))
  })

  const setDifficulty = useCallback((nextDifficulty: Difficulty) => {
    setDifficultyState(nextDifficulty)
    save(DIFFICULTY_KEY, nextDifficulty)

    const nextState = createInitialBoard(nextDifficulty)
    setState(nextState)
    save(GAME_STATE_KEY, toPersisted(nextState))
  }, [])

  const guessLetter = useCallback((letter: string) => {
    if (!/^[a-z]$/i.test(letter)) {
      return
    }

    setState((prev) => {
      const next = applyGuess(prev, letter)
      if (next !== prev) {
        save(GAME_STATE_KEY, toPersisted(next))
      }
      return next
    })
  }, [])

  const resetGame = useCallback(() => {
    const next = createInitialBoard(difficulty)
    setState(next)
    save(GAME_STATE_KEY, toPersisted(next))
  }, [difficulty])

  const guessedLettersArray = [...state.guessedLetters]

  return {
    state,
    difficulty,
    guessedLettersArray,
    setDifficulty,
    guessLetter,
    resetGame,
  }
}
