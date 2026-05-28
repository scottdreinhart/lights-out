/**
 * TODO: PURPOSE
 * TODO: Provide axis-aligned bounding-box collision helpers for domain systems.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own geometry overlap predicates only.
 *
 * TODO: INPUTS
 * TODO: Position + bounds payloads for two entities.
 *
 * TODO: OUTPUTS
 * TODO: Boolean overlap and helper predicates for vertical landing checks.
 *
 * TODO: DEPENDENCIES
 * TODO: Depends on core primitive types only.
 *
 * TODO: EDGE CASES
 * TODO: Treat touching edges as collision to avoid tunneling on fixed timestep.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Hot-path math functions remain branch-light and allocation-free.
 */
import type { Bounds, Position } from '../core/types'

interface BoxLike {
  position: Position
  bounds: Bounds
}

export const isIntersecting = (a: BoxLike, b: BoxLike): boolean =>
  a.position.x <= b.position.x + b.bounds.width &&
  a.position.x + a.bounds.width >= b.position.x &&
  a.position.y <= b.position.y + b.bounds.height &&
  a.position.y + a.bounds.height >= b.position.y

export const isLandingOnTop = (a: BoxLike, b: BoxLike, previousBottom: number): boolean => {
  const currentBottom = a.position.y + a.bounds.height
  const platformTop = b.position.y
  const horizontalOverlap =
    a.position.x < b.position.x + b.bounds.width && a.position.x + a.bounds.width > b.position.x
  return horizontalOverlap && previousBottom <= platformTop && currentBottom >= platformTop
}
