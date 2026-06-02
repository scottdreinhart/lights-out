/**
 * TODO: PURPOSE
 * TODO: Define autonomous enemy hazard state for tower patrols.
 *
 * TODO: RESPONSIBILITY
 * TODO: Keep enemy runtime data; no behavior decisions.
 *
 * TODO: INPUTS
 * TODO: Position, velocity, bounds, patrol/climb mode, active flag.
 *
 * TODO: OUTPUTS
 * TODO: Enemy entity consumed by hazard and rendering systems.
 *
 * TODO: DEPENDENCIES
 * TODO: Depends only on core primitive types.
 *
 * TODO: EDGE CASES
 * TODO: Inactive enemies should no longer produce collisions.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Flat object structure reduces GC churn in movement loops.
 */
import type { Bounds, Position, Velocity } from '../core/types'

export interface Enemy {
  id: string
  position: Position
  velocity: Velocity
  bounds: Bounds
  mode: 'patrol' | 'climb'
  active: boolean
}
