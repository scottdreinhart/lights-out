/**
 * TODO: PURPOSE
 * TODO: Represent a collision surface segment in the tower.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own structural platform data only; no collision math.
 *
 * TODO: INPUTS
 * TODO: Platform coordinates, bounds, and variant.
 *
 * TODO: OUTPUTS
 * TODO: Platform entity consumed by collision and rendering systems.
 *
 * TODO: DEPENDENCIES
 * TODO: Depends only on core primitive types.
 *
 * TODO: EDGE CASES
 * TODO: Broken platforms are rendered distinctly but still avoid phantom collisions.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Flat entity shape keeps array iteration cheap in simulation tick.
 */
import type { Bounds, Position } from '../core/types'

export interface Platform {
  id: string
  position: Position
  bounds: Bounds
  kind: 'solid' | 'broken'
}
