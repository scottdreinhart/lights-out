/**
 * TODO: PURPOSE
 * TODO: Define the domain-safe input and primitive value objects used by the simulation.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own shared scalar/shape contracts only; no gameplay mutation logic.
 *
 * TODO: INPUTS
 * TODO: N/A (type-only module).
 *
 * TODO: OUTPUTS
 * TODO: Type exports consumed by entities, systems, hooks, and rendering adapters.
 *
 * TODO: DEPENDENCIES
 * TODO: No imports allowed; this module is the domain leaf type surface.
 *
 * TODO: EDGE CASES
 * TODO: Keep screen/input enums explicit to avoid invalid string states.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Type-only surface keeps hot-path systems allocation-light and deterministic.
 */
export type ScreenState = 'start' | 'playing' | 'paused' | 'dead' | 'gameOver'

export interface Position {
  x: number
  y: number
}

export interface Velocity {
  x: number
  y: number
}

export interface Bounds {
  width: number
  height: number
}

export interface InputState {
  left: boolean
  right: boolean
  jump: boolean
  climbUp: boolean
  climbDown: boolean
  start: boolean
  pause: boolean
}
