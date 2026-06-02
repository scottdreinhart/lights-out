import { LEVEL_ONE, MAX_INTENSITY } from './constants'
import type {
  GameState,
  GameStatus,
  IntensityState,
  LevelDefinition,
  LossReason,
  Obstacle,
  Position,
  ScoreState,
  SessionState,
  TickState,
  Velocity,
} from './types'

export type GameAction = { type: 'burst' } | { type: 'tick' } | { type: 'restart' }

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

const roundTo2 = (value: number): number => Math.round(value * 100) / 100

const buildIntensity = (tick: number, level: LevelDefinition): number =>
  clamp(roundTo2(tick * level.difficulty.intensityPerTick), 0, MAX_INTENSITY)

const buildSpeed = (intensity: number, level: LevelDefinition): number =>
  clamp(
    roundTo2(level.difficulty.baseSpeed + intensity * level.difficulty.speedPerIntensity),
    level.difficulty.baseSpeed,
    level.difficulty.maxSpeed,
  )

const buildGapSize = (intensity: number, level: LevelDefinition): number =>
  clamp(
    roundTo2(level.spawnRule.baseGapSize - intensity * level.spawnRule.gapShrinkPerIntensity),
    level.spawnRule.minGapSize,
    level.spawnRule.baseGapSize,
  )

const buildSpawnInterval = (intensity: number, level: LevelDefinition): number =>
  Math.max(
    level.spawnRule.minIntervalTicks,
    Math.round(level.spawnRule.baseIntervalTicks - intensity * 0.11),
  )

const buildGapCenter = (
  level: LevelDefinition,
  spawnIndex: number,
  gapSize: number,
  intensity: number,
): number => {
  const dynamicAmplitude = Math.min(
    level.spawnRule.maxGapOffset,
    level.spawnRule.baseGapOffset + intensity * 0.12,
  )
  const base = level.worldHeight / 2
  const y = base + Math.sin((spawnIndex + 1) * 1.37) * dynamicAmplitude
  const minCenter = level.ceilingY + gapSize / 2 + 2
  const maxCenter = level.floorY - gapSize / 2 - 2
  return clamp(roundTo2(y), minCenter, maxCenter)
}

const buildObstacle = (
  level: LevelDefinition,
  nextObstacleId: number,
  gapSize: number,
  intensity: number,
): Obstacle => ({
  id: nextObstacleId,
  x: level.worldWidth + 8,
  width: level.spawnRule.obstacleWidth,
  gap: {
    centerY: buildGapCenter(level, nextObstacleId, gapSize, intensity),
    size: gapSize,
  },
  passed: false,
})

const hasBoundsFailure = (state: GameState): boolean => {
  const top = state.runner.y - state.runner.radius
  const bottom = state.runner.y + state.runner.radius
  return top <= state.level.ceilingY || bottom >= state.level.floorY
}

const hasObstacleCollision = (state: GameState): boolean => {
  const playerLeft = state.runner.x - state.runner.radius
  const playerRight = state.runner.x + state.runner.radius
  const playerTop = state.runner.y - state.runner.radius
  const playerBottom = state.runner.y + state.runner.radius

  return state.obstacles.some((obstacle) => {
    const obstacleLeft = obstacle.x
    const obstacleRight = obstacle.x + obstacle.width
    const overlapsHorizontally = playerRight >= obstacleLeft && playerLeft <= obstacleRight
    if (!overlapsHorizontally) {
      return false
    }

    const gapTop = obstacle.gap.centerY - obstacle.gap.size / 2
    const gapBottom = obstacle.gap.centerY + obstacle.gap.size / 2
    return playerTop < gapTop || playerBottom > gapBottom
  })
}

const withPhysicsStep = (state: GameState, burstTriggered: boolean): GameState => {
  const velocityAfterGravity = state.runner.velocityY + state.level.physics.gravity
  const velocityAfterBurst = burstTriggered
    ? velocityAfterGravity + state.level.physics.burstImpulse
    : velocityAfterGravity
  const velocityY = clamp(
    roundTo2(velocityAfterBurst),
    state.level.physics.maxRiseVelocity,
    state.level.physics.maxFallVelocity,
  )
  const y = roundTo2(state.runner.y + velocityY)

  return {
    ...state,
    runner: {
      ...state.runner,
      y,
      velocityY,
    },
  }
}

const withFailure = (state: GameState, reason: LossReason): GameState => ({
  ...state,
  status: 'lost',
  lossReason: reason,
  statusMessage:
    reason === 'bounds' ? 'System collapse: boundary breach.' : 'System collapse: obstacle impact.',
})

const withBurst = (state: GameState): GameState => {
  const next = withPhysicsStep(state, true)
  if (hasBoundsFailure(next)) {
    return withFailure(next, 'bounds')
  }
  if (hasObstacleCollision(next)) {
    return withFailure(next, 'collision')
  }
  return {
    ...next,
    statusMessage: 'Burst injected. Hold rhythm.',
  }
}

const withTick = (state: GameState): GameState => {
  const tick = state.tick + 1
  const intensity = buildIntensity(tick, state.level)
  const speed = buildSpeed(intensity, state.level)
  const gapSize = buildGapSize(intensity, state.level)
  const spawnIntervalTicks = buildSpawnInterval(intensity, state.level)

  let next = withPhysicsStep(state, false)
  if (hasBoundsFailure(next)) {
    return withFailure(
      {
        ...next,
        tick,
        intensity,
        speed,
        gapSize,
      },
      'bounds',
    )
  }

  const movedObstacles = next.obstacles
    .map((obstacle) => ({ ...obstacle, x: roundTo2(obstacle.x - speed) }))
    .filter((obstacle) => obstacle.x + obstacle.width >= 0)

  let passBonus = 0
  const obstacles = movedObstacles.map((obstacle) => {
    const hasPassed = !obstacle.passed && obstacle.x + obstacle.width < state.level.playerX
    if (hasPassed) {
      passBonus += 100
    }
    return hasPassed ? { ...obstacle, passed: true } : obstacle
  })

  const nextSpawnInTicks = state.nextSpawnInTicks - 1
  let finalObstacles = obstacles
  let finalSpawnInTicks = nextSpawnInTicks
  let nextObstacleId = state.nextObstacleId

  if (nextSpawnInTicks <= 0) {
    finalObstacles = [
      ...obstacles,
      buildObstacle(state.level, state.nextObstacleId, gapSize, intensity),
    ]
    finalSpawnInTicks = spawnIntervalTicks
    nextObstacleId += 1
  }

  next = {
    ...next,
    tick,
    intensity,
    speed,
    gapSize,
    obstacles: finalObstacles,
    nextSpawnInTicks: finalSpawnInTicks,
    nextObstacleId,
    score: state.score + Math.max(1, Math.round(speed * 3)) + passBonus,
    distance: roundTo2(state.distance + speed),
    statusMessage:
      intensity >= 75
        ? 'Critical tempo. Gap windows collapsing.'
        : intensity >= 40
          ? 'Tempo rising. Keep burst timing steady.'
          : 'Stabilize cadence and hold line.',
  }

  if (hasObstacleCollision(next)) {
    return withFailure(next, 'collision')
  }

  return next
}

export const createInitialGameState = (level: LevelDefinition = LEVEL_ONE): GameState => ({
  status: 'playing',
  lossReason: null,
  tick: 0,
  score: 0,
  distance: 0,
  intensity: 0,
  speed: level.difficulty.baseSpeed,
  gapSize: level.spawnRule.baseGapSize,
  runner: {
    x: level.playerX,
    y: level.worldHeight / 2,
    velocityY: 0,
    radius: 2.2,
  },
  obstacles: [],
  nextObstacleId: 1,
  nextSpawnInTicks: Math.round(level.spawnRule.baseIntervalTicks * 0.75),
  level,
  statusMessage: 'Inject bursts to stay inside the corridor.',
})

export const reduceGameState = (state: GameState, action: GameAction): GameState => {
  if (action.type === 'restart') {
    return createInitialGameState(state.level)
  }
  if (state.status !== 'playing') {
    return state
  }
  if (action.type === 'burst') {
    return withBurst(state)
  }
  return withTick(state)
}

export const getIntensityTier = (intensity: number): 'low' | 'medium' | 'high' => {
  if (intensity >= 75) {
    return 'high'
  }
  if (intensity >= 40) {
    return 'medium'
  }
  return 'low'
}

export const projectSessionState = (state: GameState): SessionState => ({
  status: state.status as GameStatus,
  lossReason: state.lossReason,
  tick: { tick: state.tick } as TickState,
  score: { score: state.score, distance: state.distance } as ScoreState,
  intensity: { value: state.intensity } as IntensityState,
})

export const getGapRange = (obstacle: Obstacle): { top: Position; bottom: Position } => ({
  top: obstacle.gap.centerY - obstacle.gap.size / 2,
  bottom: obstacle.gap.centerY + obstacle.gap.size / 2,
})

export const getRunnerVelocity = (state: GameState): Velocity => state.runner.velocityY
