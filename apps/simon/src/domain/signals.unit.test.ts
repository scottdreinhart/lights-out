import type { SimonRuleConfig } from '@games/simon-engine'
import { describe, expect, it } from 'vitest'

import { DEFAULT_RULES } from './rules'
import { buildSimonSignalProfile } from './signals'
import type { SimonGameState } from './types'

function makeState(overrides: Partial<SimonGameState> = {}): SimonGameState {
  return {
    sequence: ['red'],
    playerInput: [],
    currentRound: 1,
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
    ...overrides,
  }
}

function makeRules(): SimonRuleConfig {
  return {
    ...DEFAULT_RULES,
    maxSequenceLength: 20,
    difficultyLevel: 3,
    inputTimeoutMs: 4000,
    speedIncreaseEnabled: true,
  }
}

describe('buildSimonSignalProfile', () => {
  it('returns zeroed signals before the game starts', () => {
    const signals = buildSimonSignalProfile(makeState(), makeRules(), 4000)

    expect(signals).toEqual({
      pressure: 0,
      intensity: 0,
      focus: 0,
      progress: 0,
    })
  })

  it('increases pressure as the timer drains', () => {
    const running = makeState({
      phase: 'playerTurn',
      startTime: Date.now(),
      currentRound: 10,
      sequence: [
        'red',
        'blue',
        'green',
        'yellow',
        'orange',
        'purple',
        'cyan',
        'pink',
        'red',
        'blue',
      ],
    })

    const calm = buildSimonSignalProfile(running, makeRules(), 3500)
    const tense = buildSimonSignalProfile(running, makeRules(), 500)

    expect(tense.pressure).toBeGreaterThan(calm.pressure)
  })

  it('increases intensity with faster tempo and later rounds', () => {
    const earlyRound = buildSimonSignalProfile(
      makeState({ phase: 'deviceTurn', startTime: Date.now(), currentRound: 2 }),
      makeRules(),
      4000,
    )
    const lateRound = buildSimonSignalProfile(
      makeState({ phase: 'deviceTurn', startTime: Date.now(), currentRound: 18 }),
      makeRules(),
      4000,
    )

    expect(lateRound.intensity).toBeGreaterThan(earlyRound.intensity)
  })

  it('tracks progress against the configured sequence ceiling', () => {
    const signals = buildSimonSignalProfile(
      makeState({ phase: 'deviceTurn', startTime: Date.now(), currentRound: 15 }),
      makeRules(),
      4000,
    )

    expect(signals.progress).toBeGreaterThan(0)
    expect(signals.progress).toBeLessThanOrEqual(100)
  })
})
