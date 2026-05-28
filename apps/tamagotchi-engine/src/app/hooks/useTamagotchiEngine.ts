// Sources: https://patents.google.com/patent/US5966526A/en and
// https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  createInitialPetState,
  dispatchPetAction,
  getVariantProfile,
  type PetActionType,
  type PetRuntime,
  type PetState,
  type VariantId,
} from '@/domain'
import { createPetRuntime, primePetWasm } from '@/wasm'

import { loadTamagotchiSession, saveTamagotchiSession } from '../persistence'
import type { EngineSnapshot } from '../types'

const DEFAULT_VARIANT: VariantId = 'original'
const REAL_WORLD_MINUTE_MS = 60_000

function createSnapshot(
  state: PetState,
  paused: boolean,
  variant: ReturnType<typeof getVariantProfile>,
  onDispatch: (action: PetActionType, payload?: { won?: boolean }) => void,
  onTick: (elapsedMinutes?: number) => void,
  onReset: (variantId?: VariantId) => void,
  onResurrect: () => void,
  onSetVariant: (variantId: VariantId) => void,
): EngineSnapshot {
  return {
    state,
    paused,
    variant,
    controls: {
      dispatch: onDispatch,
      tick: onTick,
      reset: onReset,
      resurrect: onResurrect,
      setVariant: onSetVariant,
    },
  }
}

export function useTamagotchiEngine(initialVariantId: VariantId = DEFAULT_VARIANT): EngineSnapshot {
  const runtime = useMemo<PetRuntime>(() => createPetRuntime(), [])
  const initialSession = useMemo(
    () => loadTamagotchiSession(initialVariantId, runtime),
    [initialVariantId, runtime],
  )
  const [variantId, setVariantId] = useState<VariantId>(() => initialSession.state.variantId)
  const [state, setState] = useState<PetState>(() => initialSession.state)
  const [paused, setPaused] = useState(false)
  const stateRef = useRef(state)
  const lastSyncedAtRef = useRef(initialSession.savedAtMs)
  const variant = getVariantProfile(variantId)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    void primePetWasm()

    const handle = window.setInterval(() => {
      setState((current) =>
        dispatchPetAction(
          current,
          {
            type: 'tick',
            minute: current.lifecycle.ageMinutes + 1,
            elapsedMinutes: 1,
          },
          runtime,
        ),
      )
    }, REAL_WORLD_MINUTE_MS)

    return () => window.clearInterval(handle)
  }, [runtime])

  useEffect(() => {
    const savedAtMs = Date.now()
    lastSyncedAtRef.current = savedAtMs
    saveTamagotchiSession(state, savedAtMs)
  }, [state])

  const syncOfflineProgress = useCallback(() => {
    const elapsedMinutes = Math.floor((Date.now() - lastSyncedAtRef.current) / 60_000)

    if (elapsedMinutes <= 0) {
      return
    }

    setState((current) =>
      dispatchPetAction(
        current,
        {
          type: 'tick',
          minute: current.lifecycle.ageMinutes + elapsedMinutes,
          elapsedMinutes,
        },
        runtime,
      ),
    )
    lastSyncedAtRef.current = Date.now()
  }, [runtime])

  useEffect(() => {
    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'hidden') {
        saveTamagotchiSession(stateRef.current, Date.now())
        return
      }

      syncOfflineProgress()
    }

    const handlePageHide = (): void => {
      saveTamagotchiSession(stateRef.current, Date.now())
    }

    window.addEventListener('focus', syncOfflineProgress)
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('beforeunload', handlePageHide)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', syncOfflineProgress)
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('beforeunload', handlePageHide)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [syncOfflineProgress])

  const controls = useMemo(() => {
    const dispatch = (action: PetActionType, payload?: { won?: boolean }): void => {
      setState((current) =>
        dispatchPetAction(
          current,
          { type: action, minute: current.lifecycle.ageMinutes, payload },
          runtime,
        ),
      )
    }

    const tick = (elapsedMinutes: number = 1): void => {
      setState((current) =>
        dispatchPetAction(
          current,
          {
            type: 'tick',
            minute: current.lifecycle.ageMinutes + elapsedMinutes,
            elapsedMinutes,
          },
          runtime,
        ),
      )
    }

    const reset = (nextVariantId: VariantId = variantId): void => {
      setVariantId(nextVariantId)
      setState(createInitialPetState(nextVariantId))
      setPaused(false)
    }

    const resurrect = (): void => {
      setState((current) =>
        dispatchPetAction(
          current,
          { type: 'resurrect', minute: current.lifecycle.ageMinutes },
          runtime,
        ),
      )
    }

    const setVariant = (nextVariantId: VariantId): void => {
      setVariantId(nextVariantId)
      setState(createInitialPetState(nextVariantId))
    }

    return { dispatch, tick, reset, resurrect, setVariant }
  }, [runtime, variantId])

  return useMemo(
    () =>
      createSnapshot(
        state,
        paused,
        variant,
        controls.dispatch,
        controls.tick,
        controls.reset,
        controls.resurrect,
        controls.setVariant,
      ),
    [
      controls.dispatch,
      controls.reset,
      controls.resurrect,
      controls.setVariant,
      controls.tick,
      paused,
      state,
      variant,
    ],
  )
}
