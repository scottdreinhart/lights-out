import {
  enemyEscapedWithObjective,
  enemyHitsPlayer,
  projectileHitsEnemy,
  releaseObjectiveAtGround,
} from './collisions'
import {
  AIM_ANGLE_STEP,
  AIM_DEFAULT_ANGLE,
  AIM_DEFAULT_FORCE,
  AIM_FORCE_STEP,
  ARENA_HEIGHT,
  ENEMY_SCORE,
  FIRE_COOLDOWN_TICKS,
  GROUND_Y,
  INITIAL_STATE,
  OBJECTIVE_COUNT,
  OBJECTIVE_LOST_LIFE_PENALTY,
  OBJECTIVE_RADIUS,
  PLAYER_HIT_LIFE_PENALTY,
  PLAYER_HIT_RADIUS,
  PLAYER_X,
  PLAYER_Y,
  PROJECTILE_RADIUS,
  PROJECTILE_TTL,
  RESCUE_BONUS,
  SALVO_COOLDOWN_TICKS,
  SALVO_SPREAD,
  SURVIVAL_SCORE_PER_TICK,
  TARGET_PROGRESS,
  WAVE_BONUS,
  WORLD_WIDTH,
} from './constants'
import { canCaptureObjective, spawnEnemy, updateEnemy } from './enemies'
import { clampAimAngle, clampAimForce, createLaunchVelocity, projectStep } from './trajectory'
import type { ControlState, Enemy, GameState, Objective, Projectile, Vector2 } from './types'
import { computeWave, nextCameraX, shouldSpawnEnemy, waveAdvanced } from './waves'

export type GameAction = 'primary' | 'secondary' | 'tertiary' | 'reset'

const EMPTY_CONTROLS: ControlState = {
  aimUp: false,
  aimDown: false,
  forceUp: false,
  forceDown: false,
  fire: false,
  reaim: false,
  salvo: false,
}

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

const wrapX = (x: number): number => {
  if (x < 0) {
    return x + WORLD_WIDTH
  }
  if (x >= WORLD_WIDTH) {
    return x - WORLD_WIDTH
  }
  return x
}

const groundObjectives = (): Objective[] =>
  Array.from({ length: OBJECTIVE_COUNT }, (_, index) => ({
    id: index + 1,
    position: {
      x: 520 + index * 260,
      y: GROUND_Y - OBJECTIVE_RADIUS,
    },
    status: 'safe',
    carrierEnemyId: null,
  }))

const decrementCooldown = (ticks: number): number => (ticks > 0 ? ticks - 1 : 0)

const withDerivedMeters = (state: GameState): GameState => {
  const safeObjectives = state.objectives.filter((objective) => objective.status === 'safe').length
  const capturedObjectives = state.objectives.filter(
    (objective) => objective.status === 'captured',
  ).length
  const dangerBudget = state.enemies.length + capturedObjectives * 5 + state.wave * 4
  const intensity = clamp(Math.round(8 + dangerBudget), 0, 100)
  const aimPenalty = Math.abs(state.aim.angle - AIM_DEFAULT_ANGLE) * 20
  const cooldownPenalty = state.fireCooldownTicks * 1.5 + state.salvoCooldownTicks * 0.3
  const focus = clamp(Math.round(100 - aimPenalty - cooldownPenalty), 0, 100)
  const progress = clamp(
    Math.round((state.tick / (TARGET_PROGRESS * 60)) * 100 + safeObjectives * 3),
    0,
    TARGET_PROGRESS,
  )

  return {
    ...state,
    intensity,
    focus,
    progress,
  }
}

const launchProjectile = (
  state: GameState,
  angleOffset = 0,
): { projectile: Projectile; nextProjectileId: number } => {
  const launchPosition = {
    x: PLAYER_X + Math.cos(state.aim.angle + angleOffset) * 24,
    y: PLAYER_Y + Math.sin(state.aim.angle + angleOffset) * 24,
  }
  return {
    projectile: {
      id: state.nextProjectileId,
      position: launchPosition,
      velocity: createLaunchVelocity(state.aim.angle + angleOffset, state.aim.force),
      ttl: PROJECTILE_TTL,
      radius: PROJECTILE_RADIUS,
    },
    nextProjectileId: state.nextProjectileId + 1,
  }
}

const applyAimControls = (state: GameState, controls: ControlState): GameState => {
  const angleDelta =
    (controls.aimUp ? -AIM_ANGLE_STEP : 0) + (controls.aimDown ? AIM_ANGLE_STEP : 0)
  const forceDelta =
    (controls.forceUp ? AIM_FORCE_STEP : 0) + (controls.forceDown ? -AIM_FORCE_STEP : 0)

  const aim = {
    angle: clampAimAngle(state.aim.angle + angleDelta),
    force: clampAimForce(state.aim.force + forceDelta),
  }

  if (controls.reaim) {
    return {
      ...state,
      aim: { angle: AIM_DEFAULT_ANGLE, force: AIM_DEFAULT_FORCE },
      status: 'Re-aim locked neutral artillery profile',
    }
  }

  return { ...state, aim }
}

const applyWeaponActions = (state: GameState, controls: ControlState): GameState => {
  const withCooldowns = {
    ...state,
    fireCooldownTicks: decrementCooldown(state.fireCooldownTicks),
    salvoCooldownTicks: decrementCooldown(state.salvoCooldownTicks),
  }

  if (controls.salvo && withCooldowns.salvoCooldownTicks === 0) {
    const first = launchProjectile(withCooldowns, -SALVO_SPREAD)
    const second = launchProjectile(
      { ...withCooldowns, nextProjectileId: first.nextProjectileId },
      0,
    )
    const third = launchProjectile(
      { ...withCooldowns, nextProjectileId: second.nextProjectileId },
      SALVO_SPREAD,
    )
    return {
      ...withCooldowns,
      projectiles: [
        ...withCooldowns.projectiles,
        first.projectile,
        second.projectile,
        third.projectile,
      ],
      nextProjectileId: third.nextProjectileId,
      fireCooldownTicks: FIRE_COOLDOWN_TICKS,
      salvoCooldownTicks: SALVO_COOLDOWN_TICKS,
      status: 'Full Salvo deployed: three-arc burst',
    }
  }

  if (controls.fire && withCooldowns.fireCooldownTicks === 0) {
    const fired = launchProjectile(withCooldowns)
    return {
      ...withCooldowns,
      projectiles: [...withCooldowns.projectiles, fired.projectile],
      nextProjectileId: fired.nextProjectileId,
      fireCooldownTicks: FIRE_COOLDOWN_TICKS,
      status: 'Standard Shot committed to trajectory',
    }
  }

  return withCooldowns
}

const stepProjectiles = (projectiles: Projectile[]): Projectile[] =>
  projectiles
    .map((projectile) => {
      const stepped = projectStep(projectile.position, projectile.velocity)
      return {
        ...projectile,
        position: {
          x: wrapX(stepped.position.x),
          y: stepped.position.y,
        },
        velocity: stepped.velocity,
        ttl: projectile.ttl - 1,
      }
    })
    .filter(
      (projectile) =>
        projectile.ttl > 0 &&
        projectile.position.y >= -80 &&
        projectile.position.y <= ARENA_HEIGHT + 120,
    )

const stepEnemiesAndObjectives = (
  state: GameState,
): { enemies: Enemy[]; objectives: Objective[]; livesLost: number } => {
  const updatedEnemies = state.enemies.map((enemy) =>
    updateEnemy(enemy, state.tick, state.objectives),
  )
  const objectives = state.objectives.map((objective) => ({ ...objective }))
  let livesLost = 0

  for (const enemy of updatedEnemies) {
    if (enemy.kind !== 'abductor') {
      continue
    }

    if (enemy.carryingObjectiveId === null) {
      const candidate = objectives.find((objective) => canCaptureObjective(enemy, objective))
      if (!candidate) {
        continue
      }
      candidate.status = 'captured'
      candidate.carrierEnemyId = enemy.id
      enemy.carryingObjectiveId = candidate.id
      continue
    }

    const carried = objectives.find((objective) => objective.id === enemy.carryingObjectiveId)
    if (!carried) {
      enemy.carryingObjectiveId = null
      continue
    }
    carried.position = { ...enemy.position }
    carried.carrierEnemyId = enemy.id

    if (enemyEscapedWithObjective(enemy)) {
      carried.status = 'lost'
      carried.carrierEnemyId = null
      enemy.carryingObjectiveId = null
      livesLost += OBJECTIVE_LOST_LIFE_PENALTY
    }
  }

  return { enemies: updatedEnemies, objectives, livesLost }
}

const resolveProjectileEnemyCollisions = (
  state: GameState,
): { enemies: Enemy[]; objectives: Objective[]; projectiles: Projectile[]; scoreDelta: number } => {
  const remainingProjectiles = [...state.projectiles]
  const remainingEnemies: Enemy[] = []
  const objectives = state.objectives.map((objective) => ({ ...objective }))
  let scoreDelta = 0

  for (const enemy of state.enemies) {
    let projectileIndex = -1
    for (let index = 0; index < remainingProjectiles.length; index += 1) {
      if (projectileHitsEnemy(remainingProjectiles[index], enemy)) {
        projectileIndex = index
        break
      }
    }

    if (projectileIndex < 0) {
      remainingEnemies.push(enemy)
      continue
    }

    remainingProjectiles.splice(projectileIndex, 1)
    scoreDelta += ENEMY_SCORE[enemy.kind]

    if (enemy.carryingObjectiveId !== null) {
      const rescued = objectives.find((objective) => objective.id === enemy.carryingObjectiveId)
      if (rescued) {
        rescued.position = {
          x: rescued.position.x,
          y: GROUND_Y - OBJECTIVE_RADIUS,
        }
        const released = releaseObjectiveAtGround(rescued)
        Object.assign(rescued, released)
      }
      scoreDelta += RESCUE_BONUS
    }
  }

  return { enemies: remainingEnemies, objectives, projectiles: remainingProjectiles, scoreDelta }
}

const resolvePlayerHits = (state: GameState): { enemies: Enemy[]; livesLost: number } => {
  const playerPosition: Vector2 = { x: PLAYER_X, y: PLAYER_Y }
  const survivors: Enemy[] = []
  let hits = 0

  for (const enemy of state.enemies) {
    if (enemyHitsPlayer(enemy, playerPosition, PLAYER_HIT_RADIUS)) {
      hits += 1
      continue
    }
    survivors.push(enemy)
  }

  return { enemies: survivors, livesLost: hits * PLAYER_HIT_LIFE_PENALTY }
}

const evaluateWin = (state: GameState): boolean =>
  state.progress >= TARGET_PROGRESS &&
  state.wave >= 8 &&
  state.objectives.some((objective) => objective.status === 'safe')

const evaluateLose = (state: GameState): boolean =>
  state.lives <= 0 || state.objectives.every((objective) => objective.status === 'lost')

const evaluateStatus = (state: GameState, prevWave: number): string => {
  if (state.phase === 'gameOver') {
    return state.status
  }
  if (waveAdvanced(state.tick, prevWave)) {
    return `Wave ${state.wave} escalation: incoming vectors intensifying`
  }
  if (state.objectives.some((objective) => objective.status === 'captured')) {
    return 'Objective under abduction: prioritize arc interception'
  }
  return state.status
}

const spawnPressureEnemy = (state: GameState): GameState => {
  if (!shouldSpawnEnemy(state.tick, state.wave)) {
    return state
  }

  const spawned = spawnEnemy(state.rngSeed, state.wave, state.nextEnemyId, state.cameraX)
  return {
    ...state,
    enemies: [...state.enemies, spawned.enemy],
    rngSeed: spawned.seed,
    nextEnemyId: spawned.nextEnemyId,
  }
}

export const createInitialState = (seed = INITIAL_STATE.rngSeed): GameState => ({
  ...INITIAL_STATE,
  rngSeed: seed,
  objectives: groundObjectives(),
})

export const stepGameState = (state: GameState, controls: ControlState): GameState => {
  if (state.phase === 'gameOver') {
    return state
  }

  const previousWave = state.wave
  let next = {
    ...state,
    tick: state.tick + 1,
    wave: computeWave(state.tick + 1),
    cameraX: nextCameraX(state.cameraX, state.wave),
    score: state.score + SURVIVAL_SCORE_PER_TICK,
  }

  next = applyAimControls(next, controls)
  next = applyWeaponActions(next, controls)
  next = spawnPressureEnemy(next)

  next = {
    ...next,
    projectiles: stepProjectiles(next.projectiles),
  }

  const enemyStep = stepEnemiesAndObjectives(next)
  next = {
    ...next,
    enemies: enemyStep.enemies,
    objectives: enemyStep.objectives,
    lives: next.lives - enemyStep.livesLost,
  }

  const collisions = resolveProjectileEnemyCollisions(next)
  next = {
    ...next,
    enemies: collisions.enemies,
    objectives: collisions.objectives,
    projectiles: collisions.projectiles,
    score: next.score + collisions.scoreDelta,
  }

  const playerHits = resolvePlayerHits(next)
  next = {
    ...next,
    enemies: playerHits.enemies,
    lives: next.lives - playerHits.livesLost,
  }

  if (waveAdvanced(next.tick, previousWave)) {
    next = {
      ...next,
      score: next.score + WAVE_BONUS,
    }
  }

  next = withDerivedMeters(next)
  next = {
    ...next,
    status: evaluateStatus(next, previousWave),
  }

  if (evaluateLose(next)) {
    return {
      ...next,
      phase: 'gameOver',
      status: 'Defensive line collapsed: reset to restart',
    }
  }

  if (evaluateWin(next)) {
    return {
      ...next,
      phase: 'gameOver',
      score: next.score + 250,
      status: 'Angle War survived: ballistic command achieved',
    }
  }

  return next
}

const controlForAction = (action: GameAction): ControlState => {
  if (action === 'primary') {
    return { ...EMPTY_CONTROLS, fire: true }
  }
  if (action === 'secondary') {
    return { ...EMPTY_CONTROLS, reaim: true }
  }
  if (action === 'tertiary') {
    return { ...EMPTY_CONTROLS, salvo: true }
  }
  return EMPTY_CONTROLS
}

export const reduceGameState = (state: GameState, action: GameAction): GameState => {
  if (action === 'reset') {
    return createInitialState()
  }
  if (state.phase === 'gameOver') {
    return state
  }
  return stepGameState(state, controlForAction(action))
}
