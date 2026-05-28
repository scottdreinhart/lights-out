import {
  CENTER_LANE,
  COLLISION_DISTANCE,
  DASH_DURATION_TICKS,
  DESPAWN_OBSTACLE_DISTANCE,
  DIFFICULTY_CURVE,
  LANE_COUNT,
  OBSTACLE_PATTERNS,
  PROGRESS_TARGET,
  START_OBSTACLE_DISTANCE,
  TICK_INTERVAL_MS,
} from './constants'
import type { GameState, LaneIndex, Obstacle } from './types'

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

const toLaneIndex = (lane: number): LaneIndex => {
  const clamped = clamp(lane, 0, LANE_COUNT - 1)
  return clamped as LaneIndex
}

const nextPattern = (state: GameState) =>
  OBSTACLE_PATTERNS[state.nextObstacleId % OBSTACLE_PATTERNS.length]

const spawnObstacles = (state: GameState): GameState => {
  if (state.spawnCooldownMs > 0) {
    return state
  }

  const pattern = nextPattern(state)
  const spawned: Obstacle[] = pattern.lanes.map((lane, offset) => ({
    id: state.nextObstacleId + offset,
    kind: 'blocker',
    lane,
    distance: START_OBSTACLE_DISTANCE + offset * 6,
    spawnTick: state.tick,
  }))

  return {
    ...state,
    nextObstacleId: state.nextObstacleId + spawned.length,
    spawnCooldownMs: state.spawnIntervalMs,
    obstacles: [...state.obstacles, ...spawned],
    status: `Obstacle cadence rising: lane threat at ${pattern.lanes.join('/')}`,
  }
}

const moveObstaclesAndResolveCollisions = (state: GameState, deltaSeconds: number): GameState => {
  const speedScale = 1 + state.intensity / 220
  const moved = state.obstacles.map((obstacle) => ({
    ...obstacle,
    distance: obstacle.distance - state.speed * deltaSeconds * speedScale,
  }))

  let collisions = 0
  let dodged = 0

  const active = moved.filter((obstacle) => {
    if (obstacle.distance < DESPAWN_OBSTACLE_DISTANCE) {
      dodged += 1
      return false
    }

    const collides =
      obstacle.lane === state.runner.lane &&
      obstacle.distance <= COLLISION_DISTANCE &&
      obstacle.distance >= -COLLISION_DISTANCE
    if (!collides) {
      return true
    }

    if (state.dashTicksRemaining > 0) {
      return false
    }

    collisions += 1
    return false
  })

  const lifeLoss = Math.min(collisions, state.lives)
  const scoreGain = dodged * 6 + (collisions === 0 ? 0 : -3 * collisions)

  const status =
    collisions > 0
      ? 'Collision registered. System integrity degraded.'
      : dodged > 0
        ? 'Clean dodge. Maintain lane rhythm.'
        : state.status

  return {
    ...state,
    lives: state.lives - lifeLoss,
    score: Math.max(0, state.score + scoreGain),
    obstacles: active,
    status,
  }
}

const withGameOverCheck = (state: GameState): GameState => {
  if (state.lives <= 0) {
    return {
      ...state,
      phase: 'gameOver',
      focus: 0,
      status: 'System collapse: retry run',
    }
  }
  return state
}

export const stepRunnerSimulation = (
  state: GameState,
  deltaMs: number = TICK_INTERVAL_MS,
): GameState => {
  const deltaSeconds = deltaMs / 1000
  const speed = clamp(
    state.speed + DIFFICULTY_CURVE.speedRampPerSecond * deltaSeconds,
    DIFFICULTY_CURVE.baseSpeed,
    DIFFICULTY_CURVE.maxSpeed,
  )
  const spawnIntervalMs = clamp(
    state.spawnIntervalMs - DIFFICULTY_CURVE.spawnRampPerSecond * deltaSeconds,
    DIFFICULTY_CURVE.minSpawnIntervalMs,
    DIFFICULTY_CURVE.baseSpawnIntervalMs,
  )
  const distance = state.distance + speed * deltaSeconds
  const intensity = clamp(
    state.intensity +
      DIFFICULTY_CURVE.intensityRampPerSecond * deltaSeconds +
      (speed / DIFFICULTY_CURVE.maxSpeed) * 1.5,
    0,
    100,
  )
  const focus = clamp(state.focus - deltaSeconds * 2.5 - intensity * 0.005, 0, 100)
  const runScoreGain = Math.round(speed * deltaSeconds * (1 + intensity / 125))
  const progress = clamp((distance / PROGRESS_TARGET) * 100, 0, 100)

  const baseNext: GameState = {
    ...state,
    tick: state.tick + 1,
    runTimeMs: state.runTimeMs + deltaMs,
    speed,
    spawnIntervalMs,
    spawnCooldownMs: state.spawnCooldownMs - deltaMs,
    distance,
    progress,
    intensity,
    focus,
    dashTicksRemaining: Math.max(0, state.dashTicksRemaining - 1),
    score: state.score + runScoreGain,
    status: 'Forward velocity increasing. Read lane cadence.',
  }

  const spawned = spawnObstacles(baseNext)
  const resolved = moveObstaclesAndResolveCollisions(spawned, deltaSeconds)
  return withGameOverCheck(resolved)
}

export const applyRunnerCommand = (
  state: GameState,
  action: 'laneLeft' | 'laneRight' | 'primary' | 'secondary' | 'tertiary',
): GameState => {
  if (action === 'laneLeft') {
    return {
      ...state,
      runner: { lane: toLaneIndex(state.runner.lane - 1) },
      status: 'Lane shift left.',
    }
  }

  if (action === 'laneRight') {
    return {
      ...state,
      runner: { lane: toLaneIndex(state.runner.lane + 1) },
      status: 'Lane shift right.',
    }
  }

  if (action === 'primary') {
    return {
      ...state,
      speed: clamp(state.speed + 1.4, DIFFICULTY_CURVE.baseSpeed, DIFFICULTY_CURVE.maxSpeed),
      score: state.score + 8,
      focus: clamp(state.focus + 3, 0, 100),
      status: 'Forward push engaged.',
    }
  }

  if (action === 'secondary') {
    return {
      ...state,
      runner: { lane: CENTER_LANE as LaneIndex },
      intensity: clamp(state.intensity - 8, 0, 100),
      focus: clamp(state.focus + 12, 0, 100),
      score: state.score + 2,
      status: 'Lane reset stabilized trajectory.',
    }
  }

  return {
    ...state,
    dashTicksRemaining: Math.max(state.dashTicksRemaining, DASH_DURATION_TICKS),
    intensity: clamp(state.intensity + 6, 0, 100),
    focus: clamp(state.focus - 4, 0, 100),
    score: state.score + 5,
    status: 'Dash surge armed. Collision bypass active.',
  }
}
