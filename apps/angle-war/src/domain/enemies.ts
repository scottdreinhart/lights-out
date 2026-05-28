import {
  ENEMY_RADIUS,
  GROUND_Y,
  OBJECTIVE_CAPTURE_RADIUS,
  OBJECTIVE_RADIUS,
  WORLD_WIDTH,
} from './constants'
import type { Enemy, EnemyKind, Objective, Vector2 } from './types'

const LCG_MODULUS = 2 ** 31
const LCG_MULTIPLIER = 1_103_515_245
const LCG_INCREMENT = 12_345

export const advanceSeed = (seed: number): number =>
  (LCG_MULTIPLIER * seed + LCG_INCREMENT) % LCG_MODULUS

export const seededUnit = (seed: number): { value: number; seed: number } => {
  const nextSeed = advanceSeed(seed)
  return { value: nextSeed / LCG_MODULUS, seed: nextSeed }
}

export const seededRange = (
  seed: number,
  min: number,
  max: number,
): { value: number; seed: number } => {
  const next = seededUnit(seed)
  return { value: min + (max - min) * next.value, seed: next.seed }
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

const unitDirection = (from: Vector2, to: Vector2): Vector2 => {
  const deltaX = to.x - from.x
  const deltaY = to.y - from.y
  const length = Math.hypot(deltaX, deltaY)
  if (length <= 0.0001) {
    return { x: 0, y: 0 }
  }
  return { x: deltaX / length, y: deltaY / length }
}

const nearestSafeObjective = (enemy: Enemy, objectives: Objective[]): Objective | null => {
  let nearest: Objective | null = null
  let nearestDistance = Number.POSITIVE_INFINITY

  for (const objective of objectives) {
    if (objective.status !== 'safe') {
      continue
    }
    const distance = Math.hypot(
      objective.position.x - enemy.position.x,
      objective.position.y - enemy.position.y,
    )
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearest = objective
    }
  }

  return nearest
}

const chooseEnemyKind = (seed: number, wave: number): { kind: EnemyKind; seed: number } => {
  const roll = seededUnit(seed)
  const waveBias = Math.min(0.25, wave * 0.015)
  if (roll.value < 0.36 - waveBias) {
    return { kind: 'skimmer', seed: roll.seed }
  }
  if (roll.value < 0.76) {
    return { kind: 'floater', seed: roll.seed }
  }
  return { kind: 'abductor', seed: roll.seed }
}

const spawnSide = (
  seed: number,
  cameraX: number,
): { x: number; direction: number; seed: number } => {
  const side = seededUnit(seed)
  const direction = side.value < 0.5 ? 1 : -1
  const x = wrapX(cameraX + (direction > 0 ? WORLD_WIDTH * 0.65 : WORLD_WIDTH * 0.35))
  return { x, direction, seed: side.seed }
}

export const spawnEnemy = (
  seed: number,
  wave: number,
  nextEnemyId: number,
  cameraX: number,
): { enemy: Enemy; seed: number; nextEnemyId: number } => {
  const kindPick = chooseEnemyKind(seed, wave)
  const side = spawnSide(kindPick.seed, cameraX)
  const speedScale = seededRange(side.seed, 1 + wave * 0.03, 1.85 + wave * 0.05)
  const drift = seededRange(speedScale.seed, 0, Math.PI * 2)
  const altitude = seededRange(drift.seed, 90, 360)

  const kind = kindPick.kind
  const horizontal = side.direction * speedScale.value
  const enemy: Enemy = {
    id: nextEnemyId,
    kind,
    radius: ENEMY_RADIUS[kind],
    driftPhase: drift.value,
    carryingObjectiveId: null,
    position: {
      x: side.x,
      y: kind === 'skimmer' ? GROUND_Y - 42 : altitude.value,
    },
    velocity: {
      x: kind === 'abductor' ? horizontal * 0.6 : horizontal,
      y: kind === 'skimmer' ? 0 : kind === 'floater' ? 0.15 : 0,
    },
  }

  return { enemy, seed: altitude.seed, nextEnemyId: nextEnemyId + 1 }
}

export const updateEnemy = (enemy: Enemy, tick: number, objectives: Objective[]): Enemy => {
  if (enemy.kind === 'floater') {
    const sway = Math.sin((tick + enemy.driftPhase) * 0.045) * 0.85
    return {
      ...enemy,
      position: {
        x: wrapX(enemy.position.x + enemy.velocity.x),
        y: Math.max(80, Math.min(GROUND_Y - 150, enemy.position.y + enemy.velocity.y + sway)),
      },
    }
  }

  if (enemy.kind === 'skimmer') {
    const sway = Math.sin((tick + enemy.driftPhase) * 0.09) * 5.8
    return {
      ...enemy,
      position: {
        x: wrapX(enemy.position.x + enemy.velocity.x),
        y: GROUND_Y - 36 + sway,
      },
    }
  }

  if (enemy.carryingObjectiveId !== null) {
    return {
      ...enemy,
      position: {
        x: wrapX(enemy.position.x + enemy.velocity.x * 0.55),
        y: enemy.position.y - 1.9,
      },
    }
  }

  const target = nearestSafeObjective(enemy, objectives)
  if (!target) {
    return {
      ...enemy,
      position: {
        x: wrapX(enemy.position.x + enemy.velocity.x),
        y: Math.max(90, enemy.position.y - 0.2),
      },
    }
  }

  const direction = unitDirection(enemy.position, target.position)
  const speed = Math.max(1.45, Math.abs(enemy.velocity.x))
  return {
    ...enemy,
    position: {
      x: wrapX(enemy.position.x + direction.x * speed),
      y: enemy.position.y + direction.y * speed,
    },
  }
}

export const canCaptureObjective = (enemy: Enemy, objective: Objective): boolean => {
  if (
    enemy.kind !== 'abductor' ||
    enemy.carryingObjectiveId !== null ||
    objective.status !== 'safe'
  ) {
    return false
  }
  const captureDistance = enemy.radius + OBJECTIVE_RADIUS + OBJECTIVE_CAPTURE_RADIUS
  return (
    Math.hypot(objective.position.x - enemy.position.x, objective.position.y - enemy.position.y) <=
    captureDistance
  )
}
