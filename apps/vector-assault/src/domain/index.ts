export {
  ARENA_HEIGHT,
  ARENA_WIDTH,
  BURST_COOLDOWN_TICKS,
  BURST_DURATION_TICKS,
  FIXED_TIMESTEP_MS,
  GAME_META,
  INITIAL_STATE,
  PROGRESS_TARGET,
  PROJECTILE_CAP,
  PROJECTILE_CAP_BURST,
  REPOSITION_COOLDOWN_TICKS,
} from './constants'
export type { GameMeta } from './constants'
export { createInitialState, reduceGameState, stepGameState } from './rules'
export type { GameAction } from './rules'
export { SOUND_PROFILE } from './soundProfile'
export type {
  ControlState,
  GamePhase,
  GameState,
  Hazard,
  HazardSize,
  Projectile,
  Ship,
} from './types'
