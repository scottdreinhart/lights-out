/**
 * TODO: PURPOSE
 * TODO: Apply horizontal player intent when the simulation is in active gameplay.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own horizontal movement and facing updates only.
 *
 * TODO: INPUTS
 * TODO: Current game state and normalized input snapshot.
 *
 * TODO: OUTPUTS
 * TODO: Next immutable state with updated horizontal velocity/position.
 *
 * TODO: DEPENDENCIES
 * TODO: Core constants and math clamp utility.
 *
 * TODO: EDGE CASES
 * TODO: Ignore movement while climbing ladders or outside playing state.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Hot-path mutation uses primitive math and single spread boundaries.
 */
import { GAME_WIDTH, PLAYER_MOVE_SPEED } from '../core/constants'
import type { GameState } from '../core/game-state'
import type { InputState } from '../core/types'
import { clamp } from '../utils/math'

export const applyMovementSystem = (state: GameState, input: InputState): GameState => {
  if (state.screen !== 'playing' || state.player.onLadder || !state.player.isAlive) {
    return state
  }

  let vx = 0
  let facing = state.player.facing

  if (input.left) {
    vx = -PLAYER_MOVE_SPEED
    facing = 'left'
  } else if (input.right) {
    vx = PLAYER_MOVE_SPEED
    facing = 'right'
  }

  const nextX = clamp(state.player.position.x + vx, 0, GAME_WIDTH - state.player.bounds.width)

  return {
    ...state,
    player: {
      ...state.player,
      velocity: { ...state.player.velocity, x: vx },
      facing,
      position: { ...state.player.position, x: nextX },
    },
  }
}
