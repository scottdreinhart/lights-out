import type { ControlState, GameAction, GameState } from '@/domain'
import {
  FIXED_TIMESTEP_MS,
  GAME_META,
  createInitialState,
  reduceGameState,
  stepGameState,
} from '@/domain'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useKeyboardControls } from '@games/app-hook-utils'

export interface UseGameResult {
  state: GameState
  meta: typeof GAME_META
  dispatch: (action: GameAction) => void
  reset: () => void
}

const INITIAL_CONTROLS: ControlState = {
  aimUp: false,
  aimDown: false,
  forceUp: false,
  forceDown: false,
  fire: false,
  reaim: false,
  salvo: false,
}

const isTypingElement = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

export const useGame = (): UseGameResult => {
  const [state, setState] = useState<GameState>(() => createInitialState())
  const controlsRef = useRef<ControlState>(INITIAL_CONTROLS)

  const dispatch = useCallback((action: GameAction) => {
    setState((previous) => reduceGameState(previous, action))
  }, [])

  const reset = useCallback(() => {
    setState(createInitialState())
  }, [])

  const keyboardBindings = useMemo(
    () => [
      { action: 'aim-up-down', keys: ['ArrowUp', 'KeyW'], phase: 'keydown' as const, onTrigger: () => { controlsRef.current = { ...controlsRef.current, aimUp: true } } },
      { action: 'aim-up-up', keys: ['ArrowUp', 'KeyW'], phase: 'keyup' as const, onTrigger: () => { controlsRef.current = { ...controlsRef.current, aimUp: false } } },
      { action: 'aim-down-down', keys: ['ArrowDown', 'KeyS'], phase: 'keydown' as const, onTrigger: () => { controlsRef.current = { ...controlsRef.current, aimDown: true } } },
      { action: 'aim-down-up', keys: ['ArrowDown', 'KeyS'], phase: 'keyup' as const, onTrigger: () => { controlsRef.current = { ...controlsRef.current, aimDown: false } } },
      { action: 'force-up-down', keys: ['ArrowRight', 'KeyD'], phase: 'keydown' as const, onTrigger: () => { controlsRef.current = { ...controlsRef.current, forceUp: true } } },
      { action: 'force-up-up', keys: ['ArrowRight', 'KeyD'], phase: 'keyup' as const, onTrigger: () => { controlsRef.current = { ...controlsRef.current, forceUp: false } } },
      { action: 'force-down-down', keys: ['ArrowLeft', 'KeyA'], phase: 'keydown' as const, onTrigger: () => { controlsRef.current = { ...controlsRef.current, forceDown: true } } },
      { action: 'force-down-up', keys: ['ArrowLeft', 'KeyA'], phase: 'keyup' as const, onTrigger: () => { controlsRef.current = { ...controlsRef.current, forceDown: false } } },
      { action: 'fire-down', keys: ['Space', 'KeyJ'], phase: 'keydown' as const, onTrigger: () => { controlsRef.current = { ...controlsRef.current, fire: true } } },
      { action: 'fire-up', keys: ['Space', 'KeyJ'], phase: 'keyup' as const, onTrigger: () => { controlsRef.current = { ...controlsRef.current, fire: false } } },
      { action: 'reaim', keys: ['KeyR'], onTrigger: () => { controlsRef.current = { ...controlsRef.current, reaim: true } } },
      { action: 'salvo-down', keys: ['KeyF', 'KeyK'], phase: 'keydown' as const, onTrigger: () => { controlsRef.current = { ...controlsRef.current, salvo: true } } },
      { action: 'salvo-up', keys: ['KeyF', 'KeyK'], phase: 'keyup' as const, onTrigger: () => { controlsRef.current = { ...controlsRef.current, salvo: false } } },
      { action: 'reset', keys: ['Escape'], onTrigger: reset },
    ],
    [reset],
  )

  useKeyboardControls(keyboardBindings)

  useEffect(() => {
    const timer = window.setInterval(() => {
      const controls = controlsRef.current
      setState((previous) => stepGameState(previous, controls))

      // one-shot controls are consumed every tick
      if (controls.fire || controls.reaim || controls.salvo) {
        controlsRef.current = {
          ...controlsRef.current,
          fire: false,
          reaim: false,
          salvo: false,
        }
      }
    }, FIXED_TIMESTEP_MS)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  return { state, meta: GAME_META, dispatch, reset }
}
