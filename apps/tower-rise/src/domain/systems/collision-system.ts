/**
 * TODO: PURPOSE
 * TODO: Resolve player collisions against platforms and world floor.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own broadphase platform checks and landing resolution only.
 *
 * TODO: INPUTS
 * TODO: Current game state.
 *
 * TODO: OUTPUTS
 * TODO: Next state with corrected player position and grounded flag.
 *
 * TODO: DEPENDENCIES
 * TODO: World constants and collision helper predicates.
 *
 * TODO: EDGE CASES
 * TODO: Handle descending-through-gap fall by marking player dead below floor.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Linear platform scan over small static arrays keeps tick deterministic.
 */
import { GAME_HEIGHT } from '../core/constants'
import type { GameState } from '../core/game-state'
import { isIntersecting, isLandingOnTop } from '../utils/collision'

export const applyCollisionSystem = (state: GameState): GameState => {
  if (state.screen !== 'playing' || state.player.onLadder || !state.player.isAlive) {
    return state
  }

  const previousBottom =
    state.player.position.y + state.player.bounds.height - state.player.velocity.y
  let grounded = false
  let resolvedY = state.player.position.y

  for (const platform of state.platforms) {
    if (platform.kind !== 'solid') {
      continue
    }
    const playerBox = {
      position: { ...state.player.position, y: resolvedY },
      bounds: state.player.bounds,
    }
    const platformBox = { position: platform.position, bounds: platform.bounds }
    if (!isIntersecting(playerBox, platformBox)) {
      continue
    }
    if (isLandingOnTop(playerBox, platformBox, previousBottom)) {
      grounded = true
      resolvedY = platform.position.y - state.player.bounds.height
      break
    }
  }

  const fellOut = resolvedY > GAME_HEIGHT + state.player.bounds.height
  if (fellOut) {
    return {
      ...state,
      player: { ...state.player, isAlive: false, onGround: false, onLadder: false },
      screen: 'dead',
    }
  }

  return {
    ...state,
    player: {
      ...state.player,
      onGround: grounded,
      velocity: { ...state.player.velocity, y: grounded ? 0 : state.player.velocity.y },
      position: { ...state.player.position, y: resolvedY },
    },
  }
}
