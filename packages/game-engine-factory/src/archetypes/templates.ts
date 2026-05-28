import type { EngineConfig, EngineTemplate, GameState } from '../core/contracts'
import { runTick } from '../core/game-loop'
import { ARCHETYPE_MATRIX } from './matrix'
import { VARIANT_CATALOG } from '../variants/catalog'

const DEFAULT_SEED = 1337

const createInitialState = (config: EngineConfig): GameState => {
  const variants = VARIANT_CATALOG[config.archetypeId]
  const variant = variants[config.variantId]
  if (!variant) {
    throw new Error(`Unknown variant "${config.variantId}" for archetype "${config.archetypeId}"`)
  }
  return {
    archetypeId: config.archetypeId,
    variantId: config.variantId,
    status: 'running',
    tick: 0,
    seed: config.seed ?? DEFAULT_SEED,
    score: 0,
    progress: 0,
    threat: 0,
    health: variant.maxHealth,
    tickState: {
      tick: 0,
      dtMs: 0,
      command: null,
      events: ['state:initialized'],
    },
    data: {
      entityCount: 0,
      collisions: 0,
    },
  }
}

export const createTemplate = (config: EngineConfig): EngineTemplate => {
  const archetype = ARCHETYPE_MATRIX[config.archetypeId]
  if (!archetype) {
    throw new Error(`Unknown archetype "${config.archetypeId}"`)
  }
  const variant = VARIANT_CATALOG[config.archetypeId][config.variantId]
  if (!variant) {
    throw new Error(
      `Unknown variant "${config.variantId}" for archetype "${config.archetypeId}" (${archetype.title})`,
    )
  }

  const evaluateWin = (state: GameState): boolean => state.progress >= variant.winProgressTarget
  const evaluateLose = (state: GameState): boolean =>
    state.health <= 0 || state.threat >= variant.threatFailureThreshold * 2

  const update: EngineTemplate['update'] = (state, command, dtMs) => {
    if (state.status !== 'running') {
      return state
    }
    const next = runTick(state, variant, command, dtMs)
    if (evaluateLose(next)) {
      return { ...next, status: 'lose', tickState: { ...next.tickState, events: [...next.tickState.events, 'state:lose'] } }
    }
    if (evaluateWin(next)) {
      return { ...next, status: 'win', tickState: { ...next.tickState, events: [...next.tickState.events, 'state:win'] } }
    }
    return next
  }

  const reset: EngineTemplate['reset'] = (resetConfig) => createInitialState(resetConfig)

  return {
    archetypeId: config.archetypeId,
    variant,
    createInitialState,
    update,
    evaluateWin,
    evaluateLose,
    reset,
  }
}
