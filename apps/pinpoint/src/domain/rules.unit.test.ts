/**
 * pinpoint — domain rules unit tests.
 * Pinpoint is a Mastermind-style code-breaking game.
 */

import { describe, expect, it } from 'vitest'
import { COLORS, DIFFICULTY_CONFIGS } from './constants'
import { createInitialState, generateSecretCode } from './rules'
import type { Difficulty } from './types'

describe('pinpoint rules', () => {
  describe('generateSecretCode', () => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

    for (const diff of difficulties) {
      it(`generates a code of correct length for ${diff}`, () => {
        const config = DIFFICULTY_CONFIGS[diff]
        const code = generateSecretCode(diff)
        expect(code).toHaveLength(config.codeLength)
      })

      it(`all pegs in ${diff} code are valid colors`, () => {
        const config = DIFFICULTY_CONFIGS[diff]
        const availableColors = COLORS.slice(0, config.numColors)
        const code = generateSecretCode(diff)
        for (const peg of code) {
          expect(availableColors).toContain(peg)
        }
      })
    }

    it('produces different codes on successive calls (randomness)', () => {
      const codes = Array.from({ length: 10 }, () => generateSecretCode('medium').join(','))
      const unique = new Set(codes)
      expect(unique.size).toBeGreaterThan(1)
    })
  })

  describe('createInitialState', () => {
    it('creates a game state with no guesses', () => {
      const state = createInitialState('easy')
      expect(state.guesses).toHaveLength(0)
    })

    it('game is not over at start', () => {
      const state = createInitialState('medium')
      expect(state.gameOver).toBe(false)
    })

    it('no winner at game start', () => {
      const state = createInitialState('hard')
      expect(state.winner).toBeNull()
    })

    it('has a secret code of correct length', () => {
      const state = createInitialState('easy')
      const config = DIFFICULTY_CONFIGS['easy']
      expect(state.secretCode).toHaveLength(config.codeLength)
    })
  })
})
