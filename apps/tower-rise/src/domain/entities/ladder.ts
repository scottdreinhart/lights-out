/**
 * TODO: PURPOSE
 * TODO: Describe climbable lanes between stacked platform rows.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own static ladder geometry/state only.
 *
 * TODO: INPUTS
 * TODO: Position, bounds, and broken-state marker.
 *
 * TODO: OUTPUTS
 * TODO: Ladder entity consumed by climbing system and renderer.
 *
 * TODO: DEPENDENCIES
 * TODO: Depends only on core primitive types.
 *
 * TODO: EDGE CASES
 * TODO: Broken ladders are non-traversable and must be ignored by climb logic.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Entity shape remains minimal for repeated overlap checks.
 */
import type { Bounds, Position } from '../core/types'

export interface Ladder {
  id: string
  position: Position
  bounds: Bounds
  broken: boolean
}
