/**
 * Hangman — Domain Rules
 * Win/loss detection, guess validation, letter frequency hints.
 * Pure functions operating on domain types only.
 */

import type { GameState } from './types'

/**
 * Check if the current game is over (won or lost).
 */
export function isGameOver(state: GameState): boolean {
  return state.phase === 'won' || state.phase === 'lost'
}

/**
 * Check if the player has won.
 */
export function hasWon(state: GameState): boolean {
  return state.phase === 'won'
}

/**
 * Check if the player has lost.
 */
export function hasLost(state: GameState): boolean {
  return state.phase === 'lost'
}

/**
 * Check if a letter has already been guessed.
 */
export function isGuessed(state: GameState, letter: string): boolean {
  return state.guessedLetters.has(letter.toUpperCase())
}

/**
 * Return the remaining number of wrong guesses allowed.
 */
export function remainingLives(state: GameState): number {
  return Math.max(0, state.maxWrongGuesses - state.wrongGuesses)
}

/**
 * Return all letters that are correct (in the word).
 */
export function getCorrectGuesses(state: GameState): string[] {
  return [...state.guessedLetters].filter((l) => state.word.includes(l))
}

/**
 * Return all letters that are wrong (not in the word).
 */
export function getWrongGuesses(state: GameState): string[] {
  return [...state.guessedLetters].filter((l) => !state.word.includes(l))
}

/**
 * Return a percentage completion of the word revealed.
 */
export function completionPercent(state: GameState): number {
  const uniqueLetters = new Set([...state.word])
  const guessedFromWord = [...uniqueLetters].filter((l) => state.guessedLetters.has(l))
  return Math.round((guessedFromWord.length / uniqueLetters.size) * 100)
}
