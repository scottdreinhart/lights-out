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
  slug: 'vector-assault',
  title: 'Vector Assault',
  family: 'Arena Shooter',
  summary: 'Survive escalating vector waves with thrust-and-drift control and burst timing.',
  primaryLabel: 'Strafe Fire',
  secondaryLabel: 'Reposition',
  tertiaryLabel: 'Overdrive Burst',
}

export const ARENA_WIDTH = 1000
export const ARENA_HEIGHT = 700
export const FIXED_TIMESTEP_MS = 1000 / 60

export const SHIP_RADIUS = 12
export const SHIP_ROTATION_SPEED = 0.09
export const SHIP_THRUST_ACCELERATION = 0.22
export const SHIP_DRAG = 0.992
export const SHIP_MAX_SPEED = 8

export const PROJECTILE_TTL = 78
export const PROJECTILE_SPEED = 11
export const FIRE_COOLDOWN_TICKS = 7
export const FIRE_COOLDOWN_BURST = 3
export const PROJECTILE_CAP = 4
export const PROJECTILE_CAP_BURST = 8

export const BURST_DURATION_TICKS = 48
export const BURST_COOLDOWN_TICKS = 210
export const REPOSITION_COOLDOWN_TICKS = 165
export const REPOSITION_DANGER_RADIUS = 105
export const SHIP_RESPAWN_INVULNERABLE_TICKS = 48

export const WAVE_BASE_HAZARDS = 3
export const WAVE_MAX_HAZARDS = 13
export const WAVE_CLEAR_SCORE_BONUS = 40

export const HAZARD_RADIUS: Record<'large' | 'medium' | 'small', number> = {
  large: 40,
  medium: 24,
  small: 14,
}

export const HAZARD_SCORE: Record<'large' | 'medium' | 'small', number> = {
  large: 20,
  medium: 50,
  small: 100,
}

export const INITIAL_SEED = 731_245_913

export const PROGRESS_TARGET = 100

export const INITIAL_STATE: GameState = {
  phase: 'playing',
  tick: 0,
  score: 0,
  lives: 3,
  intensity: 8,
  progress: 0,
  focus: 0,
  status: 'Vector arena online',
  wave: 1,
  ship: {
    position: { x: ARENA_WIDTH * 0.5, y: ARENA_HEIGHT * 0.5 },
    velocity: { x: 0, y: 0 },
    heading: -Math.PI / 2,
    radius: SHIP_RADIUS,
  },
  hazards: [],
  projectiles: [],
  burstTicksRemaining: 0,
  burstCooldownTicks: 0,
  repositionCooldownTicks: 0,
  fireCooldownTicks: 0,
  shipInvulnerableTicks: SHIP_RESPAWN_INVULNERABLE_TICKS,
  initialWaveHazards: WAVE_BASE_HAZARDS,
  nextHazardId: 1,
  nextProjectileId: 1,
  rngSeed: INITIAL_SEED,
}
