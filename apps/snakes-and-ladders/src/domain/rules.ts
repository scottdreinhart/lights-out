import { BOARD_SIZE, DEFAULT_PLAYERS, DICE_MAX, DICE_MIN, LADDERS, SNAKES } from './constants'
import type { BoardEffect, GameState, PlayerState } from './types'

export function createInitialState(players: readonly PlayerState[] = DEFAULT_PLAYERS): GameState {
  return {
    phase: 'playing',
    players: players.map((p) => ({ ...p })),
    currentPlayerIndex: 0,
    winnerId: null,
    winnerName: null,
    turnCount: 0,
    lastTurn: null,
  }
}

export function rollDie(rng: () => number = Math.random): number {
  return Math.floor(rng() * DICE_MAX) + DICE_MIN
}

export function validateRoll(roll: number): void {
  if (!Number.isInteger(roll) || roll < DICE_MIN || roll > DICE_MAX) {
    throw new RangeError(
      `Invalid roll ${roll}. Roll must be an integer from ${DICE_MIN} to ${DICE_MAX}.`,
    )
  }
}

export function resolveBoardEffect(position: number): BoardEffect | null {
  const ladderTo = LADDERS[position]
  if (ladderTo) {
    return { type: 'ladder', from: position, to: ladderTo }
  }

  const snakeTo = SNAKES[position]
  if (snakeTo) {
    return { type: 'snake', from: position, to: snakeTo }
  }

  return null
}

export function applyTurn(state: GameState, roll: number): GameState {
  validateRoll(roll)

  if (state.phase === 'game-over') {
    return state
  }

  const currentPlayer = state.players[state.currentPlayerIndex]
  const tentative = currentPlayer.position + roll
  const overshotFinish = tentative > BOARD_SIZE
  const landedPosition = overshotFinish ? currentPlayer.position : tentative
  const effect = overshotFinish ? null : resolveBoardEffect(landedPosition)
  const finalPosition = effect ? effect.to : landedPosition

  const nextPlayers = state.players.map((player, index) =>
    index === state.currentPlayerIndex ? { ...player, position: finalPosition } : player,
  )

  const won = finalPosition === BOARD_SIZE

  return {
    phase: won ? 'game-over' : 'playing',
    players: nextPlayers,
    currentPlayerIndex: won
      ? state.currentPlayerIndex
      : (state.currentPlayerIndex + 1) % state.players.length,
    winnerId: won ? currentPlayer.id : null,
    winnerName: won ? currentPlayer.name : null,
    turnCount: state.turnCount + 1,
    lastTurn: {
      playerId: currentPlayer.id,
      roll,
      startPosition: currentPlayer.position,
      endPosition: finalPosition,
      overshotFinish,
      effect,
    },
  }
}
