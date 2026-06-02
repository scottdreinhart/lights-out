import { useCallback, useEffect, useRef } from 'react'

import {
  isWasmActive,
  useGame,
  useKeyboardControls,
  useSoundEffects,
  useStats,
  useSwipe,
} from '@/app'
import { createDirectionalKeyboardBindings } from '@games/app-hook-utils'

export interface UseSnakeAppReturn {
  backToMenu: ReturnType<typeof useGame>['backToMenu']
  pause: ReturnType<typeof useGame>['pause']
  restart: ReturnType<typeof useGame>['restart']
  resume: ReturnType<typeof useGame>['resume']
  setBoardSize: ReturnType<typeof useGame>['setBoardSize']
  setDifficulty: ReturnType<typeof useGame>['setDifficulty']
  setMode: ReturnType<typeof useGame>['setMode']
  setPhase: ReturnType<typeof useGame>['setPhase']
  state: ReturnType<typeof useGame>['state']
  startGame: ReturnType<typeof useGame>['startGame']
  stats: ReturnType<typeof useStats>['stats']
  toggleWrap: ReturnType<typeof useGame>['toggleWrap']
  turn: ReturnType<typeof useGame>['turn']
  isWasmActive: boolean
}

export const useSnakeApp = (): UseSnakeAppReturn => {
  const {
    state,
    turn,
    startGame,
    pause,
    resume,
    restart,
    backToMenu,
    setMode,
    setDifficulty,
    setBoardSize,
    toggleWrap,
    setPhase,
  } = useGame()

  const sfx = useSoundEffects()
  const { stats, recordWin, recordLoss, resetStats } = useStats()

  const togglePause = useCallback(() => {
    if (state.phase === 'playing') {
      pause()
      sfx.onPause()
    } else if (state.phase === 'paused') {
      resume()
      sfx.onResume()
    }
  }, [state.phase, pause, resume, sfx])

  const closeOverlayToMenu = useCallback(() => {
    if (
      state.phase === 'settings' ||
      state.phase === 'help' ||
      state.phase === 'stats' ||
      state.phase === 'game-over'
    ) {
      backToMenu()
      sfx.onClick()
    }
  }, [state.phase, backToMenu, sfx])

  const keyboardBindings = createDirectionalKeyboardBindings(
    {
      up: () => turn('up'),
      down: () => turn('down'),
      left: () => turn('left'),
      right: () => turn('right'),
    },
    togglePause,
    () => {
      if (state.phase === 'playing' || state.phase === 'paused') {
        togglePause()
        return
      }

      closeOverlayToMenu()
    },
    {
      enabled: () => state.phase === 'playing' || state.phase === 'paused',
      confirmKeys: ['Space'],
      cancelKeys: ['Escape'],
      actionNames: {
        up: 'move-up',
        down: 'move-down',
        left: 'move-left',
        right: 'move-right',
        upAlt: 'move-up-alt',
        downAlt: 'move-down-alt',
        leftAlt: 'move-left-alt',
        rightAlt: 'move-right-alt',
        confirm: 'toggle-pause',
        cancel: 'escape',
      },
    },
  )

  useKeyboardControls(keyboardBindings)
  useSwipe(turn, state.phase === 'playing')

  const prevOutcomeRef = useRef(state.run?.outcome ?? null)

  useEffect(() => {
    const outcome = state.run?.outcome
    if (outcome && !prevOutcomeRef.current) {
      if (outcome.kind === 'win') {
        sfx.onWin()
        recordWin()
      } else {
        sfx.onLose()
        recordLoss()
      }
    }

    prevOutcomeRef.current = outcome ?? null
  }, [state.run?.outcome, sfx, recordWin, recordLoss])

  return {
    backToMenu,
    pause,
    restart,
    resume,
    setBoardSize,
    setDifficulty,
    setMode,
    setPhase,
    state,
    startGame,
    stats,
    toggleWrap,
    turn,
    isWasmActive: isWasmActive(),
  }
}
