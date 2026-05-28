/**
 * TODO: PURPOSE
 * TODO: Trigger fixed jump launch when jump input is valid.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own jump start event; no gravity/collision resolution here.
 *
 * TODO: INPUTS
 * TODO: Current game state and input snapshot.
 *
 * TODO: OUTPUTS
 * TODO: Next state with jump velocity and airborne state toggled.
 *
 * TODO: DEPENDENCIES
 * TODO: Core jump velocity constant.
 *
 * TODO: EDGE CASES
 * TODO: Prevent jump while airborne, dead, paused, or climbing.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Single branching path prevents extra allocations on no-op ticks.
 */
import { PLAYER_JUMP_VELOCITY } from '../core/constants'
import type { GameState } from '../core/game-state'
import type { InputState } from '../core/types'

export const applyJumpSystem = (state: GameState, input: InputState): GameState => {
  if (
    state.screen !== 'playing' ||
    !input.jump ||
    !state.player.onGround ||
    state.player.onLadder
  ) {
    return state
  }

  return {
    ...state,
    player: {
      ...state.player,
      onGround: false,
      velocity: { ...state.player.velocity, y: PLAYER_JUMP_VELOCITY },
      position: { ...state.player.position, y: state.player.position.y + PLAYER_JUMP_VELOCITY },
    },
  }
}
