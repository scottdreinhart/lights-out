export type GamePhase = 'playing' | 'gameOver'

export interface GameState {
  phase: GamePhase
  tick: number
  score: number
  lives: number
  intensity: number
  progress: number
  focus: number
  status: string
}
