import type { GameAction, GamePhase } from '@/domain'
import { useMemo } from 'react'

import { useKeyboardControls } from '@games/app-hook-utils'

interface UseRunnerInputOptions {
  phase: GamePhase
  dispatch: (action: GameAction) => void
  reset: () => void
}

export const useRunnerInput = ({ phase, dispatch, reset }: UseRunnerInputOptions): void => {
  const keyboardBindings = useMemo(
    () => [
      { action: 'lane-left', keys: ['ArrowLeft', 'KeyA'], onTrigger: () => dispatch('laneLeft'), enabled: phase !== 'gameOver' },
      { action: 'lane-right', keys: ['ArrowRight', 'KeyD'], onTrigger: () => dispatch('laneRight'), enabled: phase !== 'gameOver' },
      { action: 'primary', keys: ['Space', 'Enter'], onTrigger: () => dispatch('primary'), enabled: phase !== 'gameOver' },
      { action: 'secondary', keys: ['KeyS', 'ArrowDown'], onTrigger: () => dispatch('secondary'), enabled: phase !== 'gameOver' },
      { action: 'tertiary', keys: ['ShiftLeft', 'ShiftRight'], onTrigger: () => dispatch('tertiary'), enabled: phase !== 'gameOver' },
      { action: 'reset', keys: ['KeyR'], onTrigger: reset },
      { action: 'game-over-reset', keys: ['Enter', 'Space'], onTrigger: reset, enabled: phase === 'gameOver' },
    ],
    [dispatch, phase, reset],
  )

  useKeyboardControls(keyboardBindings)
}
