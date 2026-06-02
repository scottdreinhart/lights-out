import {
  BONUS_DRAIN_PER_TICK,
  EMPTY_INPUT,
  INITIAL_LEVEL_INDEX,
  INITIAL_STATE,
  JUMP_ARC,
  JUMP_SCORE_REWARD,
  LEVEL_CLEAR_REWARD,
  STARTING_LIVES,
} from './constants'
import { createLevel } from './level'
import type { Barrel, Enemy, GameState, InputPort, Ladder, Platform, Player } from './types'

export type GameAction = { type: 'tick'; input: InputPort } | { type: 'reset' }

const isOnPlatform = (platforms: Platform[], row: number, col: number): boolean =>
  platforms.some(
    (platform) => platform.row === row && col >= platform.startCol && col <= platform.endCol,
  )

const findLadder = (ladders: Ladder[], row: number, col: number): Ladder | null =>
  ladders.find(
    (ladder) => ladder.col === col && (ladder.fromRow === row || ladder.toRow === row),
  ) ?? null

const nextSeed = (seed: number): { seed: number; value: number } => {
  const updated = (1664525 * seed + 1013904223) >>> 0
  return { seed: updated, value: updated / 0x100000000 }
}

const respawnPlayer = (state: GameState): GameState => ({
  ...state,
  lives: state.lives - 1,
  player: {
    ...state.player,
    row: state.level.spawn.y,
    col: state.level.spawn.x,
    jumpTick: -1,
    climbDirection: 0,
    climbProgressTicks: 0,
  },
  status: 'Hit by hazard. Respawned at base.',
})

const stepPlayer = (state: GameState, input: InputPort): GameState => {
  const { level } = state
  const nextPlayer: Player = { ...state.player }
  const horizontal = input.left ? -1 : input.right ? 1 : 0

  if (nextPlayer.jumpTick >= 0) {
    nextPlayer.jumpTick += 1
    if (nextPlayer.jumpTick >= JUMP_ARC.length) {
      nextPlayer.jumpTick = -1
    }
  }

  if (nextPlayer.climbDirection !== 0) {
    nextPlayer.climbProgressTicks += 1
    if (nextPlayer.climbProgressTicks >= 4) {
      nextPlayer.row += nextPlayer.climbDirection
      nextPlayer.climbDirection = 0
      nextPlayer.climbProgressTicks = 0
    }
    return { ...state, player: nextPlayer }
  }

  if (
    nextPlayer.jumpTick === -1 &&
    input.jump &&
    isOnPlatform(level.platforms, nextPlayer.row, nextPlayer.col)
  ) {
    nextPlayer.jumpTick = 0
  }

  if (nextPlayer.jumpTick === -1 && (input.climbUp || input.climbDown)) {
    const ladder = findLadder(level.ladders, nextPlayer.row, nextPlayer.col)
    if (ladder && !ladder.broken) {
      if (input.climbUp && ladder.fromRow === nextPlayer.row) {
        nextPlayer.climbDirection = -1
      } else if (input.climbDown && ladder.toRow === nextPlayer.row) {
        nextPlayer.climbDirection = 1
      }
    }
  }

  if (horizontal !== 0 && nextPlayer.jumpTick === -1) {
    const targetCol = nextPlayer.col + horizontal
    if (targetCol >= 0 && targetCol < level.width) {
      nextPlayer.col = targetCol
      nextPlayer.facing = horizontal < 0 ? 'left' : 'right'
    }
  }

  if (
    nextPlayer.jumpTick === -1 &&
    nextPlayer.climbDirection === 0 &&
    !isOnPlatform(level.platforms, nextPlayer.row, nextPlayer.col)
  ) {
    const landingRow = level.platforms
      .filter((platform) => platform.row > nextPlayer.row && nextPlayer.col >= platform.startCol)
      .find((platform) => nextPlayer.col <= platform.endCol)?.row
    if (landingRow !== undefined) {
      nextPlayer.row = landingRow
    } else {
      return respawnPlayer({ ...state, player: nextPlayer, status: 'Fell through a gap.' })
    }
  }

  return { ...state, player: nextPlayer }
}

const spawnBarrel = (state: GameState): GameState => {
  if (state.barrelSpawnTimer + 1 < state.level.barrelSpawnIntervalTicks) {
    return { ...state, barrelSpawnTimer: state.barrelSpawnTimer + 1 }
  }

  const barrel: Barrel = {
    id: state.nextBarrelId,
    row: state.level.barrelSpawn.y,
    col: state.level.barrelSpawn.x,
    direction: 1,
    moveProgressTicks: 0,
  }
  return {
    ...state,
    barrels: [...state.barrels, barrel],
    nextBarrelId: state.nextBarrelId + 1,
    barrelSpawnTimer: 0,
  }
}

const stepBarrels = (state: GameState): GameState => {
  let seed = state.seed
  const nextBarrels: Barrel[] = []

  for (const barrel of state.barrels) {
    const nextBarrel = { ...barrel, moveProgressTicks: barrel.moveProgressTicks + 1 }
    if (nextBarrel.moveProgressTicks < state.level.barrelMoveTicks) {
      nextBarrels.push(nextBarrel)
      continue
    }

    nextBarrel.moveProgressTicks = 0
    const targetCol = nextBarrel.col + nextBarrel.direction
    if (isOnPlatform(state.level.platforms, nextBarrel.row, targetCol)) {
      nextBarrel.col = targetCol
    } else {
      nextBarrel.direction = nextBarrel.direction === 1 ? -1 : 1
      nextBarrel.col += nextBarrel.direction
    }

    const ladder = state.level.ladders.find(
      (item) => item.col === nextBarrel.col && item.fromRow === nextBarrel.row && !item.broken,
    )
    if (ladder) {
      const random = nextSeed(seed)
      seed = random.seed
      if (random.value < state.level.barrelLadderDropChance) {
        nextBarrel.row = ladder.toRow
        nextBarrel.direction = nextBarrel.direction === 1 ? -1 : 1
      }
    }

    if (nextBarrel.row < state.level.height - 1) {
      nextBarrels.push(nextBarrel)
    }
  }

  return { ...state, seed, barrels: nextBarrels }
}

const stepEnemies = (state: GameState): GameState => {
  let seed = state.seed
  const nextEnemies: Enemy[] = []
  for (const enemy of state.enemies) {
    const nextEnemy = { ...enemy, moveProgressTicks: enemy.moveProgressTicks + 1 }
    if (nextEnemy.moveProgressTicks < state.level.enemyMoveTicks) {
      nextEnemies.push(nextEnemy)
      continue
    }

    nextEnemy.moveProgressTicks = 0
    const ladder = findLadder(state.level.ladders, nextEnemy.row, nextEnemy.col)
    if (ladder && !ladder.broken) {
      const random = nextSeed(seed)
      seed = random.seed
      if (random.value < 0.18) {
        if (ladder.fromRow === nextEnemy.row) {
          nextEnemy.row = ladder.toRow
        } else if (ladder.toRow === nextEnemy.row) {
          nextEnemy.row = ladder.fromRow
        }
      }
    }

    const targetCol = nextEnemy.col + nextEnemy.direction
    if (isOnPlatform(state.level.platforms, nextEnemy.row, targetCol)) {
      nextEnemy.col = targetCol
    } else {
      nextEnemy.direction = nextEnemy.direction === 1 ? -1 : 1
      nextEnemy.col += nextEnemy.direction
    }
    nextEnemies.push(nextEnemy)
  }
  return { ...state, seed, enemies: nextEnemies }
}

const scoreJumpOvers = (state: GameState): GameState => {
  if (state.player.jumpTick < 0 || state.player.lastJumpScoreTick === state.tick) {
    return state
  }
  const hazardUnderPlayer = [...state.barrels, ...state.enemies].some(
    (hazard) => hazard.row === state.player.row && Math.abs(hazard.col - state.player.col) <= 1,
  )
  if (!hazardUnderPlayer) {
    return state
  }

  return {
    ...state,
    score: state.score + JUMP_SCORE_REWARD,
    player: { ...state.player, lastJumpScoreTick: state.tick },
    status: 'Barrel jump bonus!',
  }
}

const checkCollisions = (state: GameState): GameState => {
  if (state.player.jumpTick >= 0) {
    return state
  }
  const collision = [...state.barrels, ...state.enemies].some(
    (hazard) => hazard.row === state.player.row && hazard.col === state.player.col,
  )
  if (!collision) {
    return state
  }
  return respawnPlayer(state)
}

const checkGoal = (state: GameState): GameState => {
  if (state.player.row !== state.level.goal.row || state.player.col !== state.level.goal.col) {
    return state
  }
  const nextLevelIndex = state.levelIndex + 1
  const nextLevel = createLevel(nextLevelIndex)
  const enemies: Enemy[] = nextLevel.enemySpawns.map((spawn, index) => ({
    id: state.nextEnemyId + index,
    row: spawn.y,
    col: spawn.x,
    direction: index % 2 === 0 ? 1 : -1,
    moveProgressTicks: 0,
  }))

  return {
    ...state,
    levelIndex: nextLevelIndex,
    level: nextLevel,
    player: {
      ...state.player,
      row: nextLevel.spawn.y,
      col: nextLevel.spawn.x,
      jumpTick: -1,
      climbDirection: 0,
      climbProgressTicks: 0,
    },
    barrels: [],
    enemies,
    nextEnemyId: state.nextEnemyId + enemies.length,
    barrelSpawnTimer: 0,
    score: state.score + LEVEL_CLEAR_REWARD + state.bonus,
    bonus: 5000,
    status: `Level ${nextLevel.id} reached. Hazards accelerated.`,
  }
}

const withGameOverCheck = (state: GameState): GameState => {
  if (state.lives > 0) {
    return state
  }
  return {
    ...state,
    phase: 'gameOver',
    status: `Game over on level ${state.level.id}. Press reset to retry.`,
  }
}

const initializeEnemies = (state: GameState): GameState => {
  if (state.enemies.length > 0) {
    return state
  }
  const enemies: Enemy[] = state.level.enemySpawns.map((spawn, index) => ({
    id: state.nextEnemyId + index,
    row: spawn.y,
    col: spawn.x,
    direction: index % 2 === 0 ? 1 : -1,
    moveProgressTicks: 0,
  }))
  return {
    ...state,
    enemies,
    nextEnemyId: state.nextEnemyId + enemies.length,
  }
}

const tick = (state: GameState, input: InputPort): GameState => {
  const initialized = initializeEnemies(state)
  let next = {
    ...initialized,
    tick: initialized.tick + 1,
    bonus: Math.max(0, initialized.bonus - BONUS_DRAIN_PER_TICK),
  }
  next = stepPlayer(next, input)
  next = spawnBarrel(next)
  next = stepBarrels(next)
  next = stepEnemies(next)
  next = scoreJumpOvers(next)
  next = checkCollisions(next)
  next = checkGoal(next)
  next = withGameOverCheck(next)
  if (next.phase === 'playing' && next.status === initialized.status) {
    return { ...next, status: `Level ${next.level.id} in progress` }
  }
  return next
}

export const reduceGameState = (state: GameState, action: GameAction): GameState => {
  if (action.type === 'reset') {
    const level = createLevel(INITIAL_LEVEL_INDEX)
    return {
      ...INITIAL_STATE,
      level,
      lives: STARTING_LIVES,
      player: { ...INITIAL_STATE.player, row: level.spawn.y, col: level.spawn.x },
      barrels: [],
      enemies: level.enemySpawns.map((spawn, index) => ({
        id: index + 1,
        row: spawn.y,
        col: spawn.x,
        direction: index % 2 === 0 ? 1 : -1,
        moveProgressTicks: 0,
      })),
      nextEnemyId: level.enemySpawns.length + 1,
      status: 'New run started. Climb to the top.',
    }
  }
  if (state.phase === 'gameOver') {
    return state
  }
  return tick(state, action.input ?? EMPTY_INPUT)
}
