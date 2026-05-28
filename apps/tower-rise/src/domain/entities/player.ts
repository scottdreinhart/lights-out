/**
 * TODO: PURPOSE
 * TODO: Define player runtime shape independent from simulation flow.
 *
 * TODO: RESPONSIBILITY
 * TODO: Store player physics and status flags only.
 *
 * TODO: INPUTS
 * TODO: Position/velocity/bounds and movement state markers.
 *
 * TODO: OUTPUTS
 * TODO: Player entity used by all simulation systems.
 *
 * TODO: DEPENDENCIES
 * TODO: Depends only on core primitive types.
 *
 * TODO: EDGE CASES
 * TODO: `isAlive` drives lives/death transitions and must never be ambiguous.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Stable entity shape improves deterministic tick replay consistency.
 */
import type { Bounds, Position, Velocity } from '../core/types'

export interface Player {
  id: string
  position: Position
  velocity: Velocity
  bounds: Bounds
  facing: 'left' | 'right'
  onGround: boolean
  onLadder: boolean
  isAlive: boolean
}
