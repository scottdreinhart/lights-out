export type GamePhase = 'playing' | 'gameOver'
export type EnemyKind = 'skimmer' | 'floater' | 'abductor'

export interface Vector2 {
  x: number
  y: number
}

export interface AimState {
  angle: number
  force: number
}

export interface Projectile {
  id: number
  position: Vector2
  velocity: Vector2
  ttl: number
  radius: number
}

export interface Enemy {
  id: number
  kind: EnemyKind
  position: Vector2
  velocity: Vector2
  radius: number
  driftPhase: number
  carryingObjectiveId: number | null
}

export type ObjectiveStatus = 'safe' | 'captured' | 'lost'

export interface Objective {
  id: number
  position: Vector2
  status: ObjectiveStatus
  carrierEnemyId: number | null
}

export interface ControlState {
  aimUp: boolean
  aimDown: boolean
  forceUp: boolean
  forceDown: boolean
  fire: boolean
  reaim: boolean
  salvo: boolean
}

export interface GameState {
  phase: GamePhase
  tick: number
  score: number
  lives: number
  intensity: number
  progress: number
  focus: number
  status: string
  wave: number
  cameraX: number
  aim: AimState
  projectiles: Projectile[]
  enemies: Enemy[]
  objectives: Objective[]
  fireCooldownTicks: number
  salvoCooldownTicks: number
  nextEnemyId: number
  nextProjectileId: number
  rngSeed: number
}
