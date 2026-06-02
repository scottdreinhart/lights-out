import { countPieces } from './board'
import type { Board, Difficulty, GameMode, GameResult, Move, Player } from './types'

export interface ReversiSignalProfile {
  pressure: number
  intensity: number
  focus: number
  progress: number
}

export interface ReversiSignalInputs {
  board: Board
  currentPlayer: Player
  validMoves: readonly Move[]
  mode: GameMode
  difficulty: Difficulty
  cpuThinking: boolean
  result: GameResult
  moveCount: number
}

export function buildReversiSignalProfile(inputs: ReversiSignalInputs): ReversiSignalProfile {
  const counts = countPieces(inputs.board)
  const occupied = counts.black + counts.white
  const occupancy = occupied / inputs.board.length
  const mobility = inputs.validMoves.length
  const moveScarcity = mobility === 0 ? 1 : clamp01(1 - mobility / 12)
  const flipAverage =
    mobility > 0
      ? inputs.validMoves.reduce((sum, move) => sum + move.flipped.length, 0) / mobility
      : 0
  const flipLoad = clamp01(flipAverage / 8)
  const difficultyLoad = difficultyToLoad(inputs.difficulty)
  const turnLoad =
    inputs.mode === 'pvc' && inputs.currentPlayer === 'white'
      ? 0.75
      : inputs.cpuThinking
        ? 0.9
        : 0.45
  const endgameLoad = inputs.result.status === 'playing' ? occupancy : 1

  return {
    pressure: toPercent(occupancy * 0.4 + moveScarcity * 0.35 + turnLoad * 0.25),
    intensity: toPercent(
      clamp01(inputs.moveCount / 60) * 0.35 +
        difficultyLoad * 0.35 +
        (inputs.cpuThinking ? 1 : 0.25) * 0.2 +
        occupancy * 0.1,
    ),
    focus: toPercent(moveScarcity * 0.45 + flipLoad * 0.35 + (inputs.cpuThinking ? 1 : 0.35) * 0.2),
    progress: toPercent(endgameLoad),
  }
}

function difficultyToLoad(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return 0.25
    case 'medium':
      return 0.6
    case 'hard':
      return 1
  }
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function toPercent(value: number): number {
  return Math.round(clamp01(value) * 100)
}
