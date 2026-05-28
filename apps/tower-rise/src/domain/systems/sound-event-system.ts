import type { GameState } from '../core/game-state'

const withSound = (
  state: GameState,
  type: 'jump' | 'death' | 'score' | 'levelComplete',
): GameState => ({
  ...state,
  soundEvents: [...state.soundEvents, { id: state.nextSoundEventId, type }],
  nextSoundEventId: state.nextSoundEventId + 1,
})

export const emitJumpSoundIfNeeded = (previous: GameState, next: GameState): GameState => {
  const wasJumping = previous.player.velocity.y < 0
  const isJumping = next.player.velocity.y < 0
  if (!wasJumping && isJumping) {
    return withSound(next, 'jump')
  }
  return next
}

export const emitDeathSoundIfNeeded = (previous: GameState, next: GameState): GameState => {
  if (previous.player.isAlive && !next.player.isAlive) {
    return withSound(next, 'death')
  }
  return next
}

export const emitLevelCompleteSoundIfNeeded = (previous: GameState, next: GameState): GameState => {
  if (previous.levelIndex !== next.levelIndex && next.levelIndex > previous.levelIndex) {
    return withSound(next, 'levelComplete')
  }
  return next
}

export const emitScoreSoundIfNeeded = (previous: GameState, next: GameState): GameState => {
  if (next.score > previous.score) {
    return withSound(next, 'score')
  }
  return next
}
