import type { AnimationState, EntityAnimation } from '../core/animation'
import type { GameState } from '../core/game-state'

function nextAnimationState(state: GameState): AnimationState {
  if (!state.player.isAlive) {
    return 'hurt'
  }
  if (state.screen === 'start') {
    return 'idle'
  }
  if (state.player.onLadder) {
    return 'climb'
  }
  if (!state.player.onGround) {
    return 'jump'
  }
  if (state.player.velocity.x !== 0) {
    return 'run'
  }
  return 'idle'
}

function updateAnimation(animation: EntityAnimation, nextState: AnimationState): EntityAnimation {
  if (animation.state !== nextState) {
    return {
      state: nextState,
      frameIndex: 0,
      frameTimer: 0,
    }
  }

  return {
    ...animation,
    frameTimer: animation.frameTimer + 1,
  }
}

export function applyAnimationSystem(state: GameState): GameState {
  if (state.screen === 'start') {
    return state
  }

  return {
    ...state,
    playerAnimation: updateAnimation(state.playerAnimation, nextAnimationState(state)),
  }
}
