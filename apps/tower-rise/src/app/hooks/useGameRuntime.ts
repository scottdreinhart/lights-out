/**
 * TODO: PURPOSE
 * TODO: Orchestrate fixed-timestep simulation loop and UI screen transitions.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own runtime tick scheduling, start/pause controls, and event-driven SFX hooks.
 *
 * TODO: INPUTS
 * TODO: Keyboard input state from useKeyboardInput.
 *
 * TODO: OUTPUTS
 * TODO: Current game state plus runtime control callbacks.
 *
 * TODO: DEPENDENCIES
 * TODO: Domain tick pipeline, UI store, and infrastructure audio manager.
 *
 * TODO: EDGE CASES
 * TODO: Pause/start key toggles are edge-detected to avoid repeat spam.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Fixed timestep with accumulator keeps deterministic updates independent of render FPS.
 */
import {
  FIXED_TIMESTEP_MS,
  applySoundQueueDrainSystem,
  createInitialGameState,
  tick,
  type GameState,
} from '@/domain'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useUiStore } from '../state/ui-store'
import { useKeyboardInput } from './useKeyboardInput'
import { useSoundEvents } from './useSoundEvents'

export interface UseGameRuntimeResult {
  gameState: GameState
  startGame: () => void
  resetGame: () => void
}

export const useGameRuntime = (): UseGameRuntimeResult => {
  const input = useKeyboardInput()
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState(0))
  const setScreen = useUiStore((state) => state.setScreen)

  const accumulatorRef = useRef(0)
  const lastFrameRef = useRef(0)
  const pauseHeldRef = useRef(false)
  useSoundEvents(gameState.soundEvents)

  const startGame = useCallback(() => {
    const next = createInitialGameState(0)
    next.screen = 'playing'
    next.soundEvents = [{ id: 0, type: 'start' }]
    setGameState(next)
    setScreen('playing')
  }, [setScreen])

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState(0))
    setScreen('start')
  }, [setScreen])

  useEffect(() => {
    if (!input.start) {
      return
    }
    if (gameState.screen === 'start' || gameState.screen === 'gameOver') {
      startGame()
    }
  }, [gameState.screen, input.start, startGame])

  useEffect(() => {
    if (input.pause && !pauseHeldRef.current) {
      pauseHeldRef.current = true
      setGameState((prev) => {
        if (prev.screen === 'playing') {
          setScreen('paused')
          return { ...prev, screen: 'paused' }
        }
        if (prev.screen === 'paused') {
          setScreen('playing')
          return { ...prev, screen: 'playing' }
        }
        return prev
      })
    } else if (!input.pause) {
      pauseHeldRef.current = false
    }
  }, [input.pause, setScreen])

  useEffect(() => {
    let frameId = 0

    const frame = (timestamp: number): void => {
      if (lastFrameRef.current === 0) {
        lastFrameRef.current = timestamp
      }
      const delta = timestamp - lastFrameRef.current
      lastFrameRef.current = timestamp
      accumulatorRef.current += delta

      while (accumulatorRef.current >= FIXED_TIMESTEP_MS) {
        setGameState((prev) => {
          if (prev.screen !== 'playing') {
            return prev
          }
          return tick(prev, input)
        })
        accumulatorRef.current -= FIXED_TIMESTEP_MS
      }

      frameId = window.requestAnimationFrame(frame)
    }

    frameId = window.requestAnimationFrame(frame)
    return () => {
      window.cancelAnimationFrame(frameId)
      lastFrameRef.current = 0
      accumulatorRef.current = 0
    }
  }, [input])

  useEffect(() => {
    if (gameState.soundEvents.length === 0) {
      return
    }
    setGameState((prev) => applySoundQueueDrainSystem(prev))
  }, [gameState.soundEvents])

  useEffect(() => {
    setScreen(gameState.screen)
  }, [gameState.screen, setScreen])

  return { gameState, startGame, resetGame }
}
