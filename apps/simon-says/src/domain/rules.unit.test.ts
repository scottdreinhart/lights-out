/**
 * simon-says — domain rules unit tests.
 * Simon Says is a color/sequence memory game with player-adds mode.
 */

import { describe, expect, it } from 'vitest'
import { startGame } from './rules'
import type { SimonRuleConfig } from './rules/simon.rules'
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
    message: '',
    error: null,
  }
}

function makeDefaultRules(): SimonRuleConfig {
  return {
    playerAddsMode: false,
    maxSequenceLength: 20,
    speedIncreasePerRound: 0.05,
    baseFlashDuration: 800,
    minFlashDuration: 200,
  }
}

describe('simon-says rules', () => {
  describe('startGame', () => {
    it('starts in deviceTurn phase when playerAddsMode is false', () => {
      const state = startGame(makeInitialState(), makeDefaultRules())
      expect(state.phase).toBe('deviceTurn')
    })

    it('starts in playerTurn phase when playerAddsMode is true', () => {
      const rules = { ...makeDefaultRules(), playerAddsMode: true }
      const state = startGame(makeInitialState(), rules)
      expect(state.phase).toBe('playerTurn')
    })

    it('clears gameOver flag on new game', () => {
      const initial = { ...makeInitialState(), gameOver: true }
      const state = startGame(initial, makeDefaultRules())
      expect(state.gameOver).toBe(false)
    })

    it('clears winner on new game', () => {
      const initial = { ...makeInitialState(), winner: 'computer' as const }
      const state = startGame(initial, makeDefaultRules())
      expect(state.winner).toBeNull()
    })

    it('sets a numeric startTime', () => {
      const state = startGame(makeInitialState(), makeDefaultRules())
      expect(typeof state.startTime).toBe('number')
    })

    it('clears gameOverReason on new game', () => {
      const initial = { ...makeInitialState(), gameOverReason: 'mismatch' as const }
      const state = startGame(initial, makeDefaultRules())
      expect(state.gameOverReason).toBeNull()
    })
  })
})
