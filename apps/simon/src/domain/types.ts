import type { SimonColor } from '@games/simon-engine'

export type GamePhase = 'idle' | 'playing' | 'deviceTurn' | 'playerTurn' | 'gameOver'

export interface SimonGameState {
  // Sequence tracking
  sequence: SimonColor[]
  playerInput: SimonColor[]
  currentRound: number
  sequenceIndex: number

  // Game state
  phase: GamePhase
  gameOver: boolean
  gameOverReason: 'timeout' | 'mismatch' | 'maxSequence' | 'userReset' | null
  winner: 'player' | 'computer' | null

  // Score & stats
  score: number
  highScore: number
  roundsCompleted: number
  timeElapsed: number
  startTime: number | null

  // Multiplayer state
  currentPlayer: 1 | 2 | 3 | 4 // For multiplayer elimination
  playersActive: boolean[] // Tracks which players are still playing
  playerScores: Record<number, number> // Score per player

  // UI state
  activeColor: SimonColor | null // Currently playing color
  colorFlashDuration: number // How long color stays flashed
  message: string

  // Error state
  error: string | null
}

export interface SimonAudioConfig {
  enabled: boolean
  volume: number // 0-1
  frequencies: Record<SimonColor, number>
}

export interface SimonUIState {
  showRules: boolean
}
