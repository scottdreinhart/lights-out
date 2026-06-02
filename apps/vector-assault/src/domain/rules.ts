import {
  ARENA_HEIGHT,
  ARENA_WIDTH,
  BURST_COOLDOWN_TICKS,
  BURST_DURATION_TICKS,
  FIRE_COOLDOWN_BURST,
  FIRE_COOLDOWN_TICKS,
  HAZARD_RADIUS,
  HAZARD_SCORE,
  INITIAL_STATE,
  PROJECTILE_CAP,
  PROJECTILE_CAP_BURST,
  PROJECTILE_SPEED,
  PROJECTILE_TTL,
  REPOSITION_COOLDOWN_TICKS,
  REPOSITION_DANGER_RADIUS,
  SHIP_DRAG,
  SHIP_MAX_SPEED,
  SHIP_RESPAWN_INVULNERABLE_TICKS,
  SHIP_ROTATION_SPEED,
  SHIP_THRUST_ACCELERATION,
  WAVE_BASE_HAZARDS,
  WAVE_CLEAR_SCORE_BONUS,
  WAVE_MAX_HAZARDS,
} from './constants'
import type { ControlState, GameState, Hazard, HazardSize, Vector2 } from './types'

export type GameAction = 'primary' | 'secondary' | 'tertiary' | 'reset'

const EMPTY_CONTROLS: ControlState = {
  rotateLeft: false,
  rotateRight: false,
  thrust: false,
  fire: false,
  reposition: false,
  burst: false,
}

const LCG_MODULUS = 2 ** 31
const LCG_MULTIPLIER = 1_103_515_245
const LCG_INCREMENT = 12_345
const HAZARD_MAX_SPEED = 3.9

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

const wrap = (value: number, max: number): number => {
  if (value < 0) {
    return value + max
  }
  if (value >= max) {
    return value - max
  }
  return value
}

const advanceSeed = (seed: number): number => (LCG_MULTIPLIER * seed + LCG_INCREMENT) % LCG_MODULUS

const seededUnit = (seed: number): { value: number; seed: number } => {
  const nextSeed = advanceSeed(seed)
  return { value: nextSeed / LCG_MODULUS, seed: nextSeed }
}

const seededRange = (seed: number, min: number, max: number): { value: number; seed: number } => {
  const unit = seededUnit(seed)
  return { value: min + (max - min) * unit.value, seed: unit.seed }
}

const magnitude = (vector: Vector2): number => Math.hypot(vector.x, vector.y)

const normalize = (vector: Vector2): Vector2 => {
  const size = magnitude(vector)
  if (size <= 0.0001) {
    return { x: 0, y: 0 }
  }
  return { x: vector.x / size, y: vector.y / size }
}

const distanceSquared = (a: Vector2, b: Vector2): number => {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

const spawnWave = (
  wave: number,
  seed: number,
  startHazardId: number,
): { hazards: Hazard[]; nextSeed: number; nextHazardId: number } => {
  const hazardCount = clamp(WAVE_BASE_HAZARDS + wave - 1, WAVE_BASE_HAZARDS, WAVE_MAX_HAZARDS)
  const hazards: Hazard[] = []
  let nextSeed = seed
  let nextHazardId = startHazardId

  for (let index = 0; index < hazardCount; index += 1) {
    const positionX = seededRange(nextSeed, 0, ARENA_WIDTH)
    const positionY = seededRange(positionX.seed, 0, ARENA_HEIGHT)
    const angle = seededRange(positionY.seed, 0, Math.PI * 2)
    const speedScale = seededRange(angle.seed, 1.1, Math.min(HAZARD_MAX_SPEED, 1.65 + wave * 0.2))
    nextSeed = speedScale.seed

    hazards.push({
      id: nextHazardId,
      size: 'large',
      position: { x: positionX.value, y: positionY.value },
      velocity: {
        x: Math.cos(angle.value) * speedScale.value,
        y: Math.sin(angle.value) * speedScale.value,
      },
      radius: HAZARD_RADIUS.large,
    })
    nextHazardId += 1
  }

  return { hazards, nextSeed, nextHazardId }
}

const nextHazardSize = (size: HazardSize): HazardSize | null => {
  if (size === 'large') {
    return 'medium'
  }
  if (size === 'medium') {
    return 'small'
  }
  return null
}

const createFragmentHazards = (
  source: Hazard,
  nextSize: HazardSize,
  startId: number,
): { hazards: Hazard[]; nextHazardId: number } => {
  const baseDirection = normalize(source.velocity)
  const tangentA = { x: -baseDirection.y, y: baseDirection.x }
  const tangentB = { x: baseDirection.y, y: -baseDirection.x }
  const speedBase = Math.max(1.4, magnitude(source.velocity))
  const speed = clamp(speedBase * 1.15, 1.4, HAZARD_MAX_SPEED)
  const offset = HAZARD_RADIUS[nextSize] * 0.7

  return {
    hazards: [
      {
        id: startId,
        size: nextSize,
        position: {
          x: wrap(source.position.x + tangentA.x * offset, ARENA_WIDTH),
          y: wrap(source.position.y + tangentA.y * offset, ARENA_HEIGHT),
        },
        velocity: {
          x: tangentA.x * speed,
          y: tangentA.y * speed,
        },
        radius: HAZARD_RADIUS[nextSize],
      },
      {
        id: startId + 1,
        size: nextSize,
        position: {
          x: wrap(source.position.x + tangentB.x * offset, ARENA_WIDTH),
          y: wrap(source.position.y + tangentB.y * offset, ARENA_HEIGHT),
        },
        velocity: {
          x: tangentB.x * speed,
          y: tangentB.y * speed,
        },
        radius: HAZARD_RADIUS[nextSize],
      },
    ],
    nextHazardId: startId + 2,
  }
}

const applyWrap = (position: Vector2): Vector2 => ({
  x: wrap(position.x, ARENA_WIDTH),
  y: wrap(position.y, ARENA_HEIGHT),
})

const withDerivedMeters = (state: GameState): GameState => {
  const hazardsRemaining = state.hazards.length
  const cleared = clamp(state.initialWaveHazards - hazardsRemaining, 0, state.initialWaveHazards)
  const progress =
    state.initialWaveHazards > 0 ? Math.round((cleared / state.initialWaveHazards) * 100) : 100
  const burstReadyRatio = 1 - state.burstCooldownTicks / BURST_COOLDOWN_TICKS
  const focus = Math.round(clamp(burstReadyRatio, 0, 1) * 100)
  const intensity = clamp(
    Math.round(state.wave * 7 + hazardsRemaining * 6 + (state.burstTicksRemaining > 0 ? 12 : 0)),
    0,
    100,
  )

  return { ...state, progress, focus, intensity }
}

const withGameOverCheck = (state: GameState): GameState => {
  if (state.lives > 0) {
    return state
  }
  return {
    ...state,
    phase: 'gameOver',
    status: 'Ship destroyed: reset to restart run',
  }
}

const tryReposition = (state: GameState): GameState => {
  if (state.repositionCooldownTicks > 0) {
    return { ...state, status: 'Reposition cooling down' }
  }

  const targetX = seededRange(state.rngSeed, 0, ARENA_WIDTH)
  const targetY = seededRange(targetX.seed, 0, ARENA_HEIGHT)
  const target = { x: targetX.value, y: targetY.value }
  const dangerSquared = REPOSITION_DANGER_RADIUS * REPOSITION_DANGER_RADIUS
  const landedInDanger = state.hazards.some(
    (hazard) => distanceSquared(hazard.position, target) <= dangerSquared,
  )

  return {
    ...state,
    rngSeed: targetY.seed,
    repositionCooldownTicks: REPOSITION_COOLDOWN_TICKS,
    lives: landedInDanger ? state.lives - 1 : state.lives,
    shipInvulnerableTicks: SHIP_RESPAWN_INVULNERABLE_TICKS,
    ship: {
      ...state.ship,
      position: target,
      velocity: { x: 0, y: 0 },
    },
    status: landedInDanger ? 'Reposition failed: warped into hot zone' : 'Reposition successful',
  }
}

const tryBurst = (state: GameState): GameState => {
  if (state.burstCooldownTicks > 0 || state.burstTicksRemaining > 0) {
    return { ...state, status: 'Overdrive unavailable' }
  }
  return {
    ...state,
    burstTicksRemaining: BURST_DURATION_TICKS,
    burstCooldownTicks: BURST_COOLDOWN_TICKS,
    status: 'Overdrive Burst engaged',
  }
}

const tryFire = (state: GameState): GameState => {
  const projectileCap = state.burstTicksRemaining > 0 ? PROJECTILE_CAP_BURST : PROJECTILE_CAP
  if (state.fireCooldownTicks > 0 || state.projectiles.length >= projectileCap) {
    return state
  }

  const direction = {
    x: Math.cos(state.ship.heading),
    y: Math.sin(state.ship.heading),
  }

  const projectile = {
    id: state.nextProjectileId,
    position: {
      x: state.ship.position.x + direction.x * (state.ship.radius + 4),
      y: state.ship.position.y + direction.y * (state.ship.radius + 4),
    },
    velocity: {
      x: direction.x * PROJECTILE_SPEED + state.ship.velocity.x * 0.35,
      y: direction.y * PROJECTILE_SPEED + state.ship.velocity.y * 0.35,
    },
    ttl: PROJECTILE_TTL,
    radius: 2.5,
  }

  return {
    ...state,
    projectiles: [...state.projectiles, projectile],
    nextProjectileId: state.nextProjectileId + 1,
    fireCooldownTicks: state.burstTicksRemaining > 0 ? FIRE_COOLDOWN_BURST : FIRE_COOLDOWN_TICKS,
  }
}

const stepMotion = (state: GameState, input: ControlState): GameState => {
  const rotation =
    (input.rotateLeft ? -SHIP_ROTATION_SPEED : 0) + (input.rotateRight ? SHIP_ROTATION_SPEED : 0)
  const heading = state.ship.heading + rotation
  const thrust = input.thrust ? SHIP_THRUST_ACCELERATION : 0
  const acceleration = {
    x: Math.cos(heading) * thrust,
    y: Math.sin(heading) * thrust,
  }
  const velocity = {
    x: (state.ship.velocity.x + acceleration.x) * SHIP_DRAG,
    y: (state.ship.velocity.y + acceleration.y) * SHIP_DRAG,
  }
  const speed = magnitude(velocity)
  const limitedVelocity =
    speed > SHIP_MAX_SPEED
      ? {
          x: (velocity.x / speed) * SHIP_MAX_SPEED,
          y: (velocity.y / speed) * SHIP_MAX_SPEED,
        }
      : velocity

  const ship = {
    ...state.ship,
    heading,
    velocity: limitedVelocity,
    position: applyWrap({
      x: state.ship.position.x + limitedVelocity.x,
      y: state.ship.position.y + limitedVelocity.y,
    }),
  }

  const hazards = state.hazards.map((hazard) => ({
    ...hazard,
    position: applyWrap({
      x: hazard.position.x + hazard.velocity.x,
      y: hazard.position.y + hazard.velocity.y,
    }),
  }))

  const projectiles = state.projectiles
    .map((projectile) => ({
      ...projectile,
      ttl: projectile.ttl - 1,
      position: applyWrap({
        x: projectile.position.x + projectile.velocity.x,
        y: projectile.position.y + projectile.velocity.y,
      }),
    }))
    .filter((projectile) => projectile.ttl > 0)

  return { ...state, ship, hazards, projectiles }
}

const resolveProjectileHits = (state: GameState): GameState => {
  const remainingProjectiles = [...state.projectiles]
  const remainingHazards: Hazard[] = []
  const spawnedHazards: Hazard[] = []
  let score = state.score
  let nextHazardId = state.nextHazardId

  for (const hazard of state.hazards) {
    let hitIndex = -1
    for (let index = 0; index < remainingProjectiles.length; index += 1) {
      const projectile = remainingProjectiles[index]
      const radius = projectile.radius + hazard.radius
      if (distanceSquared(projectile.position, hazard.position) <= radius * radius) {
        hitIndex = index
        break
      }
    }

    if (hitIndex < 0) {
      remainingHazards.push(hazard)
      continue
    }

    remainingProjectiles.splice(hitIndex, 1)
    score += HAZARD_SCORE[hazard.size]

    const fragmentSize = nextHazardSize(hazard.size)
    if (fragmentSize) {
      const fragments = createFragmentHazards(hazard, fragmentSize, nextHazardId)
      spawnedHazards.push(...fragments.hazards)
      nextHazardId = fragments.nextHazardId
    }
  }

  return {
    ...state,
    score,
    projectiles: remainingProjectiles,
    hazards: [...remainingHazards, ...spawnedHazards],
    nextHazardId,
  }
}

const resolveShipCollision = (state: GameState): GameState => {
  if (state.shipInvulnerableTicks > 0) {
    return state
  }

  const collided = state.hazards.some((hazard) => {
    const radius = state.ship.radius + hazard.radius
    return distanceSquared(hazard.position, state.ship.position) <= radius * radius
  })

  if (!collided) {
    return state
  }

  return {
    ...state,
    lives: state.lives - 1,
    shipInvulnerableTicks: SHIP_RESPAWN_INVULNERABLE_TICKS,
    ship: {
      ...state.ship,
      position: { x: ARENA_WIDTH * 0.5, y: ARENA_HEIGHT * 0.5 },
      velocity: { x: 0, y: 0 },
      heading: -Math.PI / 2,
    },
    status: 'Hull breach: lost one life',
  }
}

const maybeAdvanceWave = (state: GameState): GameState => {
  if (state.hazards.length > 0) {
    return state
  }

  const nextWave = state.wave + 1
  const spawned = spawnWave(nextWave, state.rngSeed, state.nextHazardId)
  return {
    ...state,
    wave: nextWave,
    score: state.score + WAVE_CLEAR_SCORE_BONUS,
    hazards: spawned.hazards,
    initialWaveHazards: spawned.hazards.length,
    nextHazardId: spawned.nextHazardId,
    rngSeed: spawned.nextSeed,
    status: `Wave ${nextWave} incoming`,
  }
}

const decrementCooldown = (value: number): number => (value > 0 ? value - 1 : 0)

export const createInitialState = (seed = INITIAL_STATE.rngSeed): GameState => {
  const base = {
    ...INITIAL_STATE,
    rngSeed: seed,
  }
  const spawned = spawnWave(base.wave, base.rngSeed, base.nextHazardId)
  return withDerivedMeters({
    ...base,
    hazards: spawned.hazards,
    initialWaveHazards: spawned.hazards.length,
    nextHazardId: spawned.nextHazardId,
    rngSeed: spawned.nextSeed,
  })
}

export const stepGameState = (state: GameState, input: ControlState): GameState => {
  if (state.phase === 'gameOver') {
    return state
  }

  let next = { ...state, tick: state.tick + 1 }

  if (input.reposition) {
    next = tryReposition(next)
  }
  if (input.burst) {
    next = tryBurst(next)
  }
  if (input.fire) {
    next = tryFire(next)
  }

  next = {
    ...next,
    burstTicksRemaining: decrementCooldown(next.burstTicksRemaining),
    burstCooldownTicks: decrementCooldown(next.burstCooldownTicks),
    repositionCooldownTicks: decrementCooldown(next.repositionCooldownTicks),
    fireCooldownTicks: decrementCooldown(next.fireCooldownTicks),
    shipInvulnerableTicks: decrementCooldown(next.shipInvulnerableTicks),
  }

  next = stepMotion(next, input)
  next = resolveProjectileHits(next)
  next = resolveShipCollision(next)
  next = maybeAdvanceWave(next)
  next = withDerivedMeters(next)
  next = withGameOverCheck(next)

  return next
}

export const reduceGameState = (state: GameState, action: GameAction): GameState => {
  if (action === 'reset') {
    return createInitialState()
  }
  if (state.phase === 'gameOver') {
    return state
  }

  if (action === 'primary') {
    return stepGameState(state, { ...EMPTY_CONTROLS, fire: true })
  }
  if (action === 'secondary') {
    return stepGameState(state, { ...EMPTY_CONTROLS, reposition: true })
  }
  return stepGameState(state, { ...EMPTY_CONTROLS, burst: true })
}
