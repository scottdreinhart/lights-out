export type AnimationState =
  | 'idle'
  | 'run'
  | 'jump'
  | 'climb'
  | 'hurt'
  | 'goal'
  | 'enemyPatrol'
  | 'enemyClimb'
  | 'barrelRoll'

export interface EntityAnimation {
  state: AnimationState
  frameIndex: number
  frameTimer: number
}
