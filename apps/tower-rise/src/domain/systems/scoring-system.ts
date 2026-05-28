/**
 * TODO: PURPOSE
 * TODO: Update score and bonus timer based on survival and objective progress.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own non-life scoring concerns only.
 *
 * TODO: INPUTS
 * TODO: Current game state snapshot.
 *
 * TODO: OUTPUTS
 * TODO: Next state with adjusted score/bonus and level transition rewards.
 *
 * TODO: DEPENDENCIES
 * TODO: Bonus drain and initial bonus constants.
 *
 * TODO: EDGE CASES
 * TODO: Bonus timer must never drop below zero.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Constant-time arithmetic; no collection traversal.
 */
import { BONUS_DRAIN_PER_TICK, STARTING_BONUS_TIMER, TILE_SIZE } from '../core/constants'
import type { GameState } from '../core/game-state'
import { createLevel } from '../entities/level'

export const applyScoringSystem = (state: GameState): GameState => {
  if (state.screen !== 'playing') {
    return state
  }

  const reachedGoal =
    Math.abs(state.player.position.x - state.level.goal.x) <= TILE_SIZE / 2 &&
    Math.abs(state.player.position.y - state.level.goal.y) <= TILE_SIZE / 2

  if (reachedGoal) {
    const nextLevelIndex = state.levelIndex + 1
    const level = createLevel(nextLevelIndex)
    return {
      ...state,
      levelIndex: nextLevelIndex,
      level,
      goal: {
        position: { ...level.goal },
        bounds: { width: TILE_SIZE, height: TILE_SIZE },
      },
      barrelSpawnPoint: { ...level.barrelSpawn },
      platforms: level.platforms,
      ladders: level.ladders,
      barrels: [],
      collectibles: [],
      collectibleSpawnCooldown: Math.max(300, 720 - nextLevelIndex * 60),
      score: state.score + 1_000 + Math.floor(state.bonusTimer / 5),
      bonusTimer: STARTING_BONUS_TIMER,
      player: {
        ...state.player,
        position: { ...level.playerSpawn },
        velocity: { x: 0, y: 0 },
        onGround: true,
        onLadder: false,
      },
    }
  }

  return {
    ...state,
    score: state.score + 1,
    bonusTimer: Math.max(0, state.bonusTimer - BONUS_DRAIN_PER_TICK),
  }
}
