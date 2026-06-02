/**
 * hangman — domain unit tests.
 * Tests word selection, guess application, and game over detection.
 */

import { describe, expect, it } from 'vitest'
import { applyGuess, createInitialBoard, getRevealedWord, pickWord } from './board'
import { MAX_WRONG_GUESSES, WORDS_BY_DIFFICULTY } from './constants'
import {
  completionPercent,
  getCorrectGuesses,
  hasLost,
  hasWon,
  isGameOver,
  remainingLives,
} from './rules'

describe('hangman domain', () => {
  describe('pickWord', () => {
    it('picks a word from the easy pool', () => {
      const word = pickWord('easy')
      expect(WORDS_BY_DIFFICULTY.easy).toContain(word)
    })

    it('returns an uppercase word', () => {
      const word = pickWord('medium')
      expect(word).toBe(word.toUpperCase())
    })
  })

  describe('createInitialBoard', () => {
    it('starts in playing phase', () => {
      const state = createInitialBoard('medium')
      expect(state.phase).toBe('playing')
    })

    it('starts with no guessed letters', () => {
      const state = createInitialBoard()
      expect(state.guessedLetters.size).toBe(0)
    })

    it('starts with 0 wrong guesses', () => {
      const state = createInitialBoard()
      expect(state.wrongGuesses).toBe(0)
    })

    it('sets maxWrongGuesses to the constant', () => {
      const state = createInitialBoard()
      expect(state.maxWrongGuesses).toBe(MAX_WRONG_GUESSES)
    })
  })

  describe('applyGuess', () => {
    it('adds a correct letter to guessedLetters', () => {
      const state = { ...createInitialBoard(), word: 'CAT' }
      const next = applyGuess(state, 'C')
      expect(next.guessedLetters.has('C')).toBe(true)
    })

    it('does not increment wrongGuesses for correct letter', () => {
      const state = { ...createInitialBoard(), word: 'CAT' }
      const next = applyGuess(state, 'C')
      expect(next.wrongGuesses).toBe(0)
    })

    it('increments wrongGuesses for incorrect letter', () => {
      const state = { ...createInitialBoard(), word: 'CAT' }
      const next = applyGuess(state, 'Z')
      expect(next.wrongGuesses).toBe(1)
    })

    it('ignores already-guessed letter', () => {
      let state = { ...createInitialBoard(), word: 'CAT' }
      state = applyGuess(state, 'C')
      const next = applyGuess(state, 'C')
      expect(next.wrongGuesses).toBe(0)
      expect(next.guessedLetters.size).toBe(1)
    })

    it('transitions to won when all letters guessed', () => {
      let state = { ...createInitialBoard(), word: 'HI' }
      state = applyGuess(state, 'H')
      state = applyGuess(state, 'I')
      expect(state.phase).toBe('won')
    })

    it('transitions to lost after max wrong guesses', () => {
      let state = { ...createInitialBoard(), word: 'A' }
      for (const letter of ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']) {
        if (state.phase !== 'playing') {
          break
        }
        state = applyGuess(state, letter)
      }
      expect(state.phase).toBe('lost')
    })
  })

  describe('getRevealedWord', () => {
    it('hides all letters initially', () => {
      const state = { ...createInitialBoard(), word: 'CAT', guessedLetters: new Set<string>() }
      expect(getRevealedWord(state)).toBe('_ _ _')
    })

    it('reveals guessed letters', () => {
      const state = { ...createInitialBoard(), word: 'CAT', guessedLetters: new Set(['C']) }
      expect(getRevealedWord(state)).toContain('C')
    })
  })

  describe('rules', () => {
    it('isGameOver returns false when playing', () => {
      expect(isGameOver(createInitialBoard())).toBe(false)
    })

    it('hasWon returns true when phase is won', () => {
      const state = { ...createInitialBoard(), phase: 'won' as const }
      expect(hasWon(state)).toBe(true)
    })

    it('hasLost returns true when phase is lost', () => {
      const state = { ...createInitialBoard(), phase: 'lost' as const }
      expect(hasLost(state)).toBe(true)
    })

    it('remainingLives returns max - wrong', () => {
      const state = { ...createInitialBoard(), wrongGuesses: 2 }
      expect(remainingLives(state)).toBe(MAX_WRONG_GUESSES - 2)
    })

    it('getCorrectGuesses returns only letters in the word', () => {
      const state = { ...createInitialBoard(), word: 'CAT', guessedLetters: new Set(['C', 'Z']) }
      expect(getCorrectGuesses(state)).toContain('C')
      expect(getCorrectGuesses(state)).not.toContain('Z')
    })

    it('completionPercent is 0 with no guesses', () => {
      const state = { ...createInitialBoard(), word: 'CAT', guessedLetters: new Set<string>() }
      expect(completionPercent(state)).toBe(0)
    })
  })
})
