import { getGameWinner } from './rules'
import type { DieValue, GameState, RollResult, RoundResult } from './types'

/**
 * Creates the initial game state for a new Bunco game.
 */
export function createInitialState(): GameState {
  return {
    round: 1,
    target: 1 as DieValue,
    humanScore: 0,
    cpuScore: 0,
    currentPlayer: 'human',
    dice: null,
    lastRoll: null,
    isRolling: false,
    roundOver: false,
    roundWinner: null,
    completedRounds: [],
    humanRoundWins: 0,
    cpuRoundWins: 0,
    humanTotalScore: 0,
    cpuTotalScore: 0,
    humanBuncos: 0,
    cpuBuncos: 0,
    isGameOver: false,
    gameWinner: null,
  }
}

/**
 * Applies a dice roll result to the current game state.
 */
export function applyRoll(state: GameState, result: RollResult): GameState {
  const isHuman = state.currentPlayer === 'human'
  const humanScore = isHuman ? state.humanScore + result.points : state.humanScore
  const cpuScore = isHuman ? state.cpuScore : state.cpuScore + result.points
  const humanBuncos = isHuman && result.isBunco ? state.humanBuncos + 1 : state.humanBuncos
  const cpuBuncos = !isHuman && result.isBunco ? state.cpuBuncos + 1 : state.cpuBuncos

  const roundOver = humanScore >= 21 || cpuScore >= 21
  const roundWinner = roundOver ? (humanScore >= 21 ? 'human' : 'cpu') : null
  const nextPlayer = roundOver
    ? state.currentPlayer
    : result.points > 0
      ? state.currentPlayer
      : state.currentPlayer === 'human'
        ? 'cpu'
        : 'human'

  return {
    ...state,
    humanScore,
    cpuScore,
    humanBuncos,
    cpuBuncos,
    dice: result.dice,
    lastRoll: result,
    isRolling: false,
    roundOver,
    roundWinner,
    currentPlayer: nextPlayer,
  }
}

/**
 * Advances to the next round (or ends the game after round 6).
 */
export function advanceRound(state: GameState): GameState {
  const roundResult: RoundResult = {
    round: state.round,
    humanScore: state.humanScore,
    cpuScore: state.cpuScore,
    winner: state.roundWinner!,
  }

  const completedRounds = [...state.completedRounds, roundResult]
  const humanRoundWins = state.humanRoundWins + (state.roundWinner === 'human' ? 1 : 0)
  const cpuRoundWins = state.cpuRoundWins + (state.roundWinner === 'cpu' ? 1 : 0)
  const humanTotalScore = state.humanTotalScore + state.humanScore
  const cpuTotalScore = state.cpuTotalScore + state.cpuScore
  const nextRound = state.round + 1
  const isGameOver = nextRound > 6

  if (isGameOver) {
    return {
      ...state,
      completedRounds,
      humanRoundWins,
      cpuRoundWins,
      humanTotalScore,
      cpuTotalScore,
      isGameOver: true,
      gameWinner: getGameWinner(humanRoundWins, cpuRoundWins, humanTotalScore, cpuTotalScore),
    }
  }

  return {
    ...state,
    round: nextRound,
    target: nextRound as DieValue,
    humanScore: 0,
    cpuScore: 0,
    currentPlayer: 'human',
    dice: null,
    lastRoll: null,
    isRolling: false,
    roundOver: false,
    roundWinner: null,
    completedRounds,
    humanRoundWins,
    cpuRoundWins,
    humanTotalScore,
    cpuTotalScore,
  }
}
