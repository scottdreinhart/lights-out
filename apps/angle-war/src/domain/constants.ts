import type { GameState } from './types'

export interface GameMeta {
  slug: string
  title: string
  family: string
  summary: string
  primaryLabel: string
  secondaryLabel: string
  tertiaryLabel: string
}

export const GAME_META: GameMeta = {
  slug: 'angle-war',
  title: 'Angle War',
  family: 'Artillery / Ballistics',
  summary:
    'Defender-style scrolling pressure meets artillery commitment: angle, force, and decisive arcs.',
  primaryLabel: 'Standard Shot',
  secondaryLabel: 'Re-aim',
  tertiaryLabel: 'Full Salvo',
}

export const WORLD_WIDTH = 2_400
export const ARENA_WIDTH = 1_000
export const ARENA_HEIGHT = 700
export const GROUND_Y = 628
export const FIXED_TIMESTEP_MS = 1000 / 60
export const TARGET_PROGRESS = 100

export const AIM_DEFAULT_ANGLE = -1.12
export const AIM_DEFAULT_FORCE = 12.5
export const AIM_MIN_ANGLE = -2.7
export const AIM_MAX_ANGLE = -0.2
export const AIM_ANGLE_STEP = 0.032
export const AIM_FORCE_STEP = 0.45
export const AIM_MIN_FORCE = 6
export const AIM_MAX_FORCE = 18

export const GRAVITY_PER_TICK = 0.2
export const PROJECTILE_RADIUS = 3.5
export const PROJECTILE_TTL = 170
export const FIRE_COOLDOWN_TICKS = 12
export const SALVO_COOLDOWN_TICKS = 110
export const SALVO_SPREAD = 0.13

export const CAMERA_SCROLL_BASE = 2.4
export const CAMERA_SCROLL_WAVE_STEP = 0.2
export const WAVE_TICKS = 700
export const SPAWN_INTERVAL_START = 78
export const SPAWN_INTERVAL_MIN = 20
export const SPAWN_INTERVAL_STEP = 5

export const OBJECTIVE_COUNT = 5
export const OBJECTIVE_RADIUS = 12
export const OBJECTIVE_CAPTURE_RADIUS = 24
export const OBJECTIVE_LOST_LIFE_PENALTY = 1

export const PLAYER_HIT_RADIUS = 22
export const PLAYER_HIT_LIFE_PENALTY = 1
export const PLAYER_X = 160
export const PLAYER_Y = GROUND_Y - 38

export const ENEMY_RADIUS: Record<'skimmer' | 'floater' | 'abductor', number> = {
  skimmer: 14,
  floater: 18,
  abductor: 16,
}

export const ENEMY_SCORE: Record<'skimmer' | 'floater' | 'abductor', number> = {
  skimmer: 14,
  floater: 22,
  abductor: 35,
}

export const RESCUE_BONUS = 45
export const SURVIVAL_SCORE_PER_TICK = 0.08
export const WAVE_BONUS = 30

export const INITIAL_SEED = 993_221_117

export const INITIAL_STATE: GameState = {
  phase: 'playing',
  tick: 0,
  score: 0,
  lives: 4,
  intensity: 9,
  progress: 0,
  focus: 62,
  status: 'Angle War online: hold the line and shape every shot',
  wave: 1,
  cameraX: 0,
  aim: {
    angle: AIM_DEFAULT_ANGLE,
    force: AIM_DEFAULT_FORCE,
  },
  projectiles: [],
  enemies: [],
  objectives: [],
  fireCooldownTicks: 0,
  salvoCooldownTicks: 0,
  nextEnemyId: 1,
  nextProjectileId: 1,
  rngSeed: INITIAL_SEED,
}
