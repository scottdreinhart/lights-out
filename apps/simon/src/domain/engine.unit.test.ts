/**
 * simon — domain engine unit tests.
 * Simon is a sequence memory game — watch and repeat the color pattern.
 */

import type { SimonRuleConfig } from '@games/simon-engine'
import { describe, expect, it } from 'vitest'
import { startGame } from './engine'
import { DEFAULT_RULES } from './rules'
import type { SimonGameState } from './types'

function makeInitialState(): SimonGameState {
  return {
    sequence: [],
    playerInput: [],
    currentRound: 0,
    sequenceIndex: 0,
    phase: 'idle',
    gameOver: false,
    gameOverReason: null,
    winner: null,
    score: 0,
    highScore: 0,
    roundsCompleted: 0,
    timeElapsed: 0,
    startTime: null,
    currentPlayer: 1,
    playersActive: [true],
    playerScores: { 1: 0 },
    activeColor: null,
    colorFlashDuration: 500,
    message: '',
    error: null,
  }
}

function makeDefaultRules(): SimonRuleConfig {
  return {
    ...DEFAULT_RULES,
    maxSequenceLength: 20,
  }
}

describe('simon engine', () => {
  describe('startGame', () => {
    it('sets phase to deviceTurn when playerAddsMode is false', () => {
      const state = startGame(makeInitialState(), makeDefaultRules())
      expect(state.phase).toBe('deviceTurn')
    })

    it('sets phase to playerTurn when playerAddsMode is true', () => {
      const rules = { ...makeDefaultRules(), playerAddsMode: true }
      const state = startGame(makeInitialState(), rules)
      expect(state.phase).toBe('playerTurn')
    })

    it('resets gameOver to false', () => {
      const initial = { ...makeInitialState(), gameOver: true }
      const state = startGame(initial, makeDefaultRules())
      expect(state.gameOver).toBe(false)
    })

    it('resets winner to null', () => {
      const initial = { ...makeInitialState(), winner: 'player' as const }
      const state = startGame(initial, makeDefaultRules())
      expect(state.winner).toBeNull()
    })

    it('resets gameOverReason to null', () => {
      const initial = { ...makeInitialState(), gameOverReason: 'timeout' as const }
      const state = startGame(initial, makeDefaultRules())
      expect(state.gameOverReason).toBeNull()
    })

    it('sets a startTime', () => {
      const state = startGame(makeInitialState(), makeDefaultRules())
      expect(state.startTime).toBeTypeOf('number')
    })
  })
})
