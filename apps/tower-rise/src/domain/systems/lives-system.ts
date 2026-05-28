/**
 * TODO: PURPOSE
 * TODO: Convert player death markers into lives decrement + respawn/game-over transitions.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own life-cycle transitions only.
 *
 * TODO: INPUTS
 * TODO: Current game state snapshot.
 *
 * TODO: OUTPUTS
 * TODO: Next state with updated lives and screen state.
 *
 * TODO: DEPENDENCIES
 * TODO: Uses core constants for bonus reset and spawn data from level.
 *
 * TODO: EDGE CASES
 * TODO: Last life transitions to gameOver deterministically with no negative counters.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Single branch update path keeps hot-path overhead negligible.
 */
import { STARTING_BONUS_TIMER } from '../core/constants'
import type { GameState } from '../core/game-state'

export const applyLivesSystem = (state: GameState): GameState => {
  if (state.screen !== 'dead') {
    return state
  }

  const nextLives = state.lives - 1
  if (nextLives <= 0) {
    return {
      ...state,
      lives: 0,
      screen: 'gameOver',
    }
  }

  return {
    ...state,
    lives: nextLives,
    screen: 'playing',
    bonusTimer: Math.max(state.bonusTimer, STARTING_BONUS_TIMER / 2),
    player: {
      ...state.player,
      position: { ...state.level.playerSpawn },
      velocity: { x: 0, y: 0 },
      onGround: true,
      onLadder: false,
      isAlive: true,
    },
    barrels: [],
    collectibles: [],
    collectibleSpawnCooldown: Math.max(300, 720 - state.levelIndex * 60),
  }
}
