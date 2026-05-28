/**
 * TODO: PURPOSE
 * TODO: Centralize deterministic simulation constants and world dimensions.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own scalar tuning values only; no imperative logic.
 *
 * TODO: INPUTS
 * TODO: N/A (constant module).
 *
 * TODO: OUTPUTS
 * TODO: Numeric constants shared by core loop, systems, and rendering adapters.
 *
 * TODO: DEPENDENCIES
 * TODO: No imports allowed.
 *
 * TODO: EDGE CASES
 * TODO: Keep tile and world sizes coherent to prevent impossible collision states.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Primitive constants avoid runtime recomputation in hot paths.
 */
import type { InputState } from './types'

export const GAME_WIDTH = 768
export const GAME_HEIGHT = 1024
export const TILE_SIZE = 32
export const FIXED_TIMESTEP_MS = 1000 / 60

export const PLAYER_MOVE_SPEED = 3
export const PLAYER_CLIMB_SPEED = 2
export const PLAYER_JUMP_VELOCITY = -9
export const JUMP_ARC = [0, 1, 2, 2, 1, 0] as const
export const GRAVITY = 0.45
export const MAX_FALL_SPEED = 10

export const BARREL_SPEED = 1.8
export const ENEMY_SPEED = 1.25
export const BARREL_SPAWN_COOLDOWN_TICKS = 110
export const BONUS_DRAIN_PER_TICK = 1

export const STARTING_LIVES = 3
export const STARTING_BONUS_TIMER = 5_000

export const EMPTY_INPUT: InputState = {
  left: false,
  right: false,
  jump: false,
  climbUp: false,
  climbDown: false,
  start: false,
  pause: false,
}
