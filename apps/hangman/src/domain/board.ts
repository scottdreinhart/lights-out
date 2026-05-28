/**
 * Hangman — Domain Board Operations
 * Pure functions for creating and manipulating game state.
 * No React, no DOM — purely functional transformations.
 */

import { MAX_WRONG_GUESSES, WORDS_BY_DIFFICULTY } from './constants'
import type { Difficulty, GameState } from './types'

/**
 * Pick a random word from the difficulty pool.
 */
export function pickWord(difficulty: Difficulty): string {
  const pool = WORDS_BY_DIFFICULTY[difficulty]
  return pool[Math.floor(Math.random() * pool.length)].toUpperCase()
}

/**
 * Create the initial game state for a new game.
 */
export function createInitialBoard(difficulty: Difficulty = 'medium'): GameState {
  return {
    word: pickWord(difficulty),
    guessedLetters: new Set<string>(),
    wrongGuesses: 0,
    maxWrongGuesses: MAX_WRONG_GUESSES,
    phase: 'playing',
  }
}

/**
 * Apply a letter guess to the current state.
 * Returns a new state — never mutates.
 */
export function applyGuess(state: GameState, letter: string): GameState {
  const upper = letter.toUpperCase()

  // Already guessed or not in playing phase — no-op
  if (state.phase !== 'playing' || state.guessedLetters.has(upper)) {
    return state
  }

  const newGuessed = new Set(state.guessedLetters)
  newGuessed.add(upper)

  const isCorrect = state.word.includes(upper)
  const newWrongGuesses = isCorrect ? state.wrongGuesses : state.wrongGuesses + 1

  // Check win: all letters in word have been guessed
  const isWon = [...state.word].every((ch) => newGuessed.has(ch))
  const isLost = newWrongGuesses >= state.maxWrongGuesses

  return {
    ...state,
    guessedLetters: newGuessed,
    wrongGuesses: newWrongGuesses,
    phase: isWon ? 'won' : isLost ? 'lost' : 'playing',
  }
}

/**
 * Return the revealed word pattern (e.g. "H _ N G M _ N").
 */
export function getRevealedWord(state: GameState): string {
  return [...state.word].map((ch) => (state.guessedLetters.has(ch) ? ch : '_')).join(' ')
}
