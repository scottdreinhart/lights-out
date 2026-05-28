/**
 * TODO: PURPOSE
 * TODO: Define descending hazard state for rolling barrels.
 *
 * TODO: RESPONSIBILITY
 * TODO: Store runtime barrel kinematics and activity flags only.
 *
 * TODO: INPUTS
 * TODO: Spawn position, velocity, direction, bounds, active state.
 *
 * TODO: OUTPUTS
 * TODO: Barrel entity consumed by hazard/collision systems and renderer.
 *
 * TODO: DEPENDENCIES
 * TODO: Depends only on core primitive types.
 *
 * TODO: EDGE CASES
 * TODO: Inactive barrels must be pruned to avoid stale collision checks.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Keep mutable surface compact for per-frame hazard updates.
 */
import type { Bounds, Position, Velocity } from '../core/types'

export interface Barrel {
  id: string
  position: Position
  velocity: Velocity
  bounds: Bounds
  direction: 'left' | 'right'
  active: boolean
}
