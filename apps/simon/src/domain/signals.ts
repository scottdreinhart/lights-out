import type { SimonRuleConfig } from '@games/simon-engine'

import { getSpeedMultiplier } from './constants'
import type { SimonGameState } from './types'

export interface SimonSignalProfile {
  pressure: number
  intensity: number
  focus: number
  progress: number
}

export function buildSimonSignalProfile(
  state: SimonGameState,
  rules: SimonRuleConfig,
  timeRemainingMs: number,
): SimonSignalProfile {
  if (state.startTime === null || state.phase === 'idle') {
    return { pressure: 0, intensity: 0, focus: 0, progress: 0 }
  }

  const maxSequenceLength = Math.max(1, rules.maxSequenceLength)
  const roundLoad = clamp01(state.currentRound / maxSequenceLength)
  const sequenceLoad = clamp01(state.sequence.length / maxSequenceLength)
  const speedMultiplier = getSpeedMultiplier(
    rules.difficultyLevel,
    state.currentRound,
    rules.speedIncreaseEnabled,
  )
  const tempoLoad = clamp01((speedMultiplier - 0.8) / 0.7)
  const inputLoad =
    state.phase === 'playerTurn' && state.sequence.length > 0
      ? clamp01(state.playerInput.length / state.sequence.length)
      : 0
  const timerLoad =
    state.phase === 'playerTurn' && rules.inputTimeoutMs > 0
      ? clamp01(1 - timeRemainingMs / rules.inputTimeoutMs)
      : state.phase === 'deviceTurn'
        ? 0.35
        : 0.15

  return {
    pressure: toPercentage(timerLoad * 0.65 + roundLoad * 0.35),
    intensity: toPercentage(tempoLoad * 0.7 + roundLoad * 0.3),
    focus: toPercentage(sequenceLoad * 0.65 + inputLoad * 0.35),
    progress: toPercentage(roundLoad),
  }
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function toPercentage(value: number): number {
  return Math.round(clamp01(value) * 100)
}
