export {
  AIM_DEFAULT_ANGLE,
  AIM_DEFAULT_FORCE,
  ARENA_HEIGHT,
  ARENA_WIDTH,
  FIXED_TIMESTEP_MS,
  GAME_META,
  GROUND_Y,
  INITIAL_STATE,
  PLAYER_X,
  PLAYER_Y,
  TARGET_PROGRESS,
  WORLD_WIDTH,
} from './constants'
export type { GameMeta } from './constants'
export { createInitialState, reduceGameState, stepGameState } from './rules'
export type { GameAction } from './rules'
export { clampAimAngle, clampAimForce, createLaunchVelocity, sampleTrajectory } from './trajectory'
export type {
  AimState,
  ControlState,
  Enemy,
  EnemyKind,
  GamePhase,
  GameState,
  Objective,
  Projectile,
  Vector2,
} from './types'
