import {
  AIM_MAX_ANGLE,
  AIM_MAX_FORCE,
  AIM_MIN_ANGLE,
  AIM_MIN_FORCE,
  GRAVITY_PER_TICK,
  PROJECTILE_TTL,
} from './constants'
import type { Vector2 } from './types'

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

export const clampAimAngle = (angle: number): number => clamp(angle, AIM_MIN_ANGLE, AIM_MAX_ANGLE)

export const clampAimForce = (force: number): number => clamp(force, AIM_MIN_FORCE, AIM_MAX_FORCE)

export const createLaunchVelocity = (angle: number, force: number): Vector2 => ({
  x: Math.cos(clampAimAngle(angle)) * clampAimForce(force),
  y: Math.sin(clampAimAngle(angle)) * clampAimForce(force),
})

export const projectStep = (
  position: Vector2,
  velocity: Vector2,
): { position: Vector2; velocity: Vector2 } => {
  const nextVelocity = {
    x: velocity.x,
    y: velocity.y + GRAVITY_PER_TICK,
  }
  return {
    position: {
      x: position.x + nextVelocity.x,
      y: position.y + nextVelocity.y,
    },
    velocity: nextVelocity,
  }
}

export const sampleTrajectory = (
  origin: Vector2,
  angle: number,
  force: number,
  maxSteps = 54,
): Vector2[] => {
  const points: Vector2[] = []
  let position = { ...origin }
  let velocity = createLaunchVelocity(angle, force)
  const steps = Math.min(maxSteps, PROJECTILE_TTL)

  for (let index = 0; index < steps; index += 1) {
    const next = projectStep(position, velocity)
    position = next.position
    velocity = next.velocity
    points.push(position)
  }

  return points
}
