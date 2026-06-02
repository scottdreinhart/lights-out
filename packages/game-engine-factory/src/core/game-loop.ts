import type { EngineVariantConfig, GameState, InputCommand } from './contracts'

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value))

const nextSeed = (seed: number): number => (seed * 1664525 + 1013904223) >>> 0

const shouldSpawnEntity = (state: GameState, variant: EngineVariantConfig): boolean => {
  if (state.data.entityCount >= variant.entityCap) {
    return false
  }
  if (variant.entitySpawnIntervalTicks <= 0) {
    return false
  }
  return state.tick > 0 && state.tick % variant.entitySpawnIntervalTicks === 0
}

const resolveInput = (
  variant: EngineVariantConfig,
  command: InputCommand | null,
): {
  progressDelta: number
  threatDelta: number
  scoreDelta: number
  healthDelta: number
  event?: string
} => {
  if (!command) {
    return { progressDelta: 0, threatDelta: 0, scoreDelta: 0, healthDelta: 0 }
  }
  const effect = variant.commandEffects[command.id]
  if (!effect) {
    return {
      progressDelta: 0,
      threatDelta: 0,
      scoreDelta: 0,
      healthDelta: 0,
      event: `unknown-command:${command.id}`,
    }
  }
  return {
    progressDelta: effect.progressDelta ?? 0,
    threatDelta: effect.threatDelta ?? 0,
    scoreDelta: effect.scoreDelta ?? 0,
    healthDelta: effect.healthDelta ?? 0,
    event: `command:${command.id}`,
  }
}

const applyMechanics = (
  state: GameState,
  variant: EngineVariantConfig,
  effects: {
    progressDelta: number
    threatDelta: number
    scoreDelta: number
    healthDelta: number
    event?: string
  },
  dtSeconds: number,
) => {
  const passiveThreat = variant.threatPerSecond * dtSeconds
  const passiveProgress = variant.progressPerSecond * dtSeconds
  const threat = clamp(state.threat + passiveThreat + effects.threatDelta, 0, 999999)
  const progress = clamp(state.progress + passiveProgress + effects.progressDelta, 0, 999999)
  const damageFromThreat = threat >= variant.threatFailureThreshold ? dtSeconds : 0
  const health = clamp(state.health - damageFromThreat + effects.healthDelta, 0, variant.maxHealth)
  const score = clamp(
    state.score + progress * variant.scorePerProgress * dtSeconds + effects.scoreDelta,
    0,
    Number.MAX_SAFE_INTEGER,
  )

  return {
    threat: Number(threat.toFixed(3)),
    progress: Number(progress.toFixed(3)),
    health: Number(health.toFixed(3)),
    score: Number(score.toFixed(3)),
  }
}

export const runTick = (
  state: GameState,
  variant: EngineVariantConfig,
  command: InputCommand | null,
  dtMs: number,
): GameState => {
  const dtSeconds = Math.max(0, dtMs) / 1000
  const effects = resolveInput(variant, command)
  const metrics = applyMechanics(state, variant, effects, dtSeconds)
  const spawned = shouldSpawnEntity(state, variant)
  const seed = nextSeed(state.seed)
  const deterministicCollision = spawned && seed % 7 === 0 ? 1 : 0
  const nextEntityCount = clamp(
    state.data.entityCount + (spawned ? 1 : 0) - deterministicCollision,
    0,
    variant.entityCap,
  )

  const events: string[] = [
    'step:resolve-input',
    'step:apply-mechanics',
    'step:update-entities',
    'step:detect-collisions',
    'step:apply-rules',
  ]
  if (effects.event) {
    events.push(effects.event)
  }
  if (spawned) {
    events.push('entity:spawned')
  }
  if (deterministicCollision > 0) {
    events.push('entity:collision-resolved')
  }

  return {
    ...state,
    tick: state.tick + 1,
    seed,
    score: metrics.score,
    progress: metrics.progress,
    threat: metrics.threat,
    health: metrics.health,
    tickState: {
      tick: state.tick + 1,
      dtMs,
      command,
      events,
    },
    data: {
      entityCount: nextEntityCount,
      collisions: state.data.collisions + deterministicCollision,
    },
  }
}
