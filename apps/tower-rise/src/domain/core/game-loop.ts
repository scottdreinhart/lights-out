/**
 * TODO: PURPOSE
 * TODO: Orchestrate deterministic system order for a single fixed timestep tick.
 *
 * TODO: RESPONSIBILITY
 * TODO: Compose systems; no feature logic should live here.
 *
 * TODO: INPUTS
 * TODO: Current game state and canonical input snapshot.
 *
 * TODO: OUTPUTS
 * TODO: Next game state produced by ordered system transformations.
 *
 * TODO: DEPENDENCIES
 * TODO: Depends on domain systems only.
 *
 * TODO: EDGE CASES
 * TODO: Preserve ordering to avoid non-deterministic collision or scoring artifacts.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Linear immutable transformations preserve deterministic replay.
 */
import { applyAnimationSystem } from '../systems/animation-system'
import { applyCollectibleSystem } from '../systems/collectible-system'
import { applyCollisionSystem } from '../systems/collision-system'
import { applyGravitySystem } from '../systems/gravity-system'
import { applyHazardSystem } from '../systems/hazard-system'
import { applyJumpSystem } from '../systems/jump-system'
import { applyLadderSystem } from '../systems/ladder-system'
import { applyLivesSystem } from '../systems/lives-system'
import { applyMovementSystem } from '../systems/movement-system'
import { applyScoringSystem } from '../systems/scoring-system'
import {
  emitDeathSoundIfNeeded,
  emitJumpSoundIfNeeded,
  emitLevelCompleteSoundIfNeeded,
  emitScoreSoundIfNeeded,
} from '../systems/sound-event-system'
import type { GameState } from './game-state'
import type { InputState } from './types'

export const tick = (state: GameState, input: InputState): GameState => {
  if (state.screen === 'start') {
    return {
      ...state,
      pausePressedLastFrame: input.pause,
    }
  }

  if (state.screen === 'paused' || state.screen === 'gameOver') {
    return {
      ...state,
      pausePressedLastFrame: input.pause,
    }
  }

  let next = { ...state, tickCount: state.tickCount + 1 }
  const previous = next

  next = applyMovementSystem(next, input)
  next = applyJumpSystem(next, input)
  next = applyLadderSystem(next, input)
  next = applyGravitySystem(next)
  next = applyCollisionSystem(next)
  next = applyHazardSystem(next)
  next = applyCollectibleSystem(next)
  next = applyScoringSystem(next)
  next = applyAnimationSystem(next)
  next = emitJumpSoundIfNeeded(previous, next)
  next = emitDeathSoundIfNeeded(previous, next)
  next = emitLevelCompleteSoundIfNeeded(previous, next)
  next = emitScoreSoundIfNeeded(previous, next)
  next = applyLivesSystem(next)

  return {
    ...next,
    pausePressedLastFrame: input.pause,
  }
}
