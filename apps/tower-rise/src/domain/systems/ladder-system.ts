/**
 * TODO: PURPOSE
 * TODO: Align and move player on ladder lanes using climb input.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own ladder overlap detection and climb displacement.
 *
 * TODO: INPUTS
 * TODO: Current game state and normalized input snapshot.
 *
 * TODO: OUTPUTS
 * TODO: Next state with ladder flags and vertical climbing movement.
 *
 * TODO: DEPENDENCIES
 * TODO: Climb speed constant and collision helpers.
 *
 * TODO: EDGE CASES
 * TODO: Broken ladders remain non-interactive; leaving ladder clears climb mode.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Iterates ladder list once per tick with cheap AABB checks.
 */
import { PLAYER_CLIMB_SPEED } from '../core/constants'
import type { GameState } from '../core/game-state'
import type { InputState } from '../core/types'
import { isIntersecting } from '../utils/collision'

const LADDER_GRAB_MARGIN_PX = 10

export const applyLadderSystem = (state: GameState, input: InputState): GameState => {
  if (state.screen !== 'playing') {
    return state
  }

  const climbIntent = input.climbUp || input.climbDown
  const dismountIntent = input.left || input.right || input.jump

  const playerBox = { position: state.player.position, bounds: state.player.bounds }
  const nearLadderBox = {
    position: {
      x: state.player.position.x - LADDER_GRAB_MARGIN_PX,
      y: state.player.position.y,
    },
    bounds: {
      width: state.player.bounds.width + LADDER_GRAB_MARGIN_PX * 2,
      height: state.player.bounds.height,
    },
  }

  const touchingLadder = state.ladders.find(
    (ladder) =>
      !ladder.broken &&
      isIntersecting(playerBox, { position: ladder.position, bounds: ladder.bounds }),
  )
  const nearbyLadder = state.ladders.find(
    (ladder) =>
      !ladder.broken &&
      isIntersecting(nearLadderBox, { position: ladder.position, bounds: ladder.bounds }),
  )

  if (state.player.onLadder && dismountIntent) {
    return {
      ...state,
      player: { ...state.player, onLadder: false, velocity: { ...state.player.velocity, y: 0 } },
    }
  }

  const activeLadder = touchingLadder ?? (climbIntent ? nearbyLadder : undefined)

  if (!activeLadder) {
    if (!state.player.onLadder) {
      return state
    }
    return {
      ...state,
      player: { ...state.player, onLadder: false },
    }
  }

  if (!state.player.onLadder && !climbIntent) {
    return state
  }

  const verticalIntent = input.climbUp
    ? -PLAYER_CLIMB_SPEED
    : input.climbDown
      ? PLAYER_CLIMB_SPEED
      : 0
  if (verticalIntent === 0) {
    return {
      ...state,
      player: { ...state.player, onLadder: true, velocity: { x: 0, y: 0 } },
    }
  }

  return {
    ...state,
    player: {
      ...state.player,
      onLadder: true,
      onGround: false,
      velocity: { x: 0, y: 0 },
      position: {
        x: activeLadder.position.x + (activeLadder.bounds.width - state.player.bounds.width) / 2,
        y: state.player.position.y + verticalIntent,
      },
    },
  }
}
