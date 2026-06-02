/**
 * TODO: PURPOSE
 * TODO: Apply deterministic gravity to the player while airborne.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own vertical acceleration/fall-speed clamping only.
 *
 * TODO: INPUTS
 * TODO: Current game state snapshot.
 *
 * TODO: OUTPUTS
 * TODO: Next state with updated vertical velocity/position.
 *
 * TODO: DEPENDENCIES
 * TODO: Core physics constants.
 *
 * TODO: EDGE CASES
 * TODO: Skip gravity while on ladder, on ground, or non-playing states.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Constant-time arithmetic suitable for fixed timestep loop.
 */
import { GRAVITY, MAX_FALL_SPEED } from '../core/constants'
import type { GameState } from '../core/game-state'

export const applyGravitySystem = (state: GameState): GameState => {
  if (
    state.screen !== 'playing' ||
    state.player.onLadder ||
    state.player.onGround ||
    !state.player.isAlive
  ) {
    return state
  }

  const nextVy = Math.min(state.player.velocity.y + GRAVITY, MAX_FALL_SPEED)

  return {
    ...state,
    player: {
      ...state.player,
      velocity: { ...state.player.velocity, y: nextVy },
      position: { ...state.player.position, y: state.player.position.y + nextVy },
    },
  }
}
