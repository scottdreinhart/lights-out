export type GamePhase = 'playing' | 'gameOver'

export interface Vector2 {
  x: number
  y: number
}

export type HazardSize = 'large' | 'medium' | 'small'

export interface Ship {
  position: Vector2
  velocity: Vector2
  heading: number
  radius: number
}

export interface Hazard {
  id: number
  size: HazardSize
  position: Vector2
  velocity: Vector2
  radius: number
}

export interface Projectile {
  id: number
  position: Vector2
  velocity: Vector2
  ttl: number
  radius: number
}

export interface ControlState {
  rotateLeft: boolean
  rotateRight: boolean
  thrust: boolean
  fire: boolean
  reposition: boolean
  burst: boolean
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
  ship: Ship
  hazards: Hazard[]
  projectiles: Projectile[]
  burstTicksRemaining: number
  burstCooldownTicks: number
  repositionCooldownTicks: number
  fireCooldownTicks: number
  shipInvulnerableTicks: number
  initialWaveHazards: number
  nextHazardId: number
  nextProjectileId: number
  rngSeed: number
}
