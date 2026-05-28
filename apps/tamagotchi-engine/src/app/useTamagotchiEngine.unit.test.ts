// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createInitialPetState } from '@/domain'

import { loadTamagotchiSession } from './persistence'
import { useTamagotchiEngine } from './useTamagotchiEngine'

vi.mock('@/wasm', () => ({
  createPetRuntime: () => ({}),
  primePetWasm: vi.fn(),
}))

const STORAGE_KEY = 'tamagotchi-engine-session'
const NOW = new Date('2026-04-25T12:00:00Z')

describe('useTamagotchiEngine persistence', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
    window.localStorage.clear()
  })

  it('fast-forwards a stored pet by the offline gap when the app reloads', () => {
    const persistedState = createInitialPetState('original')
    const savedAtMs = NOW.getTime() - 3 * 24 * 60 * 60 * 1000

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        savedAtMs,
        state: persistedState,
      }),
    )

    const loaded = loadTamagotchiSession('original')

    expect(loaded.offlineCatchUpMinutes).toBe(3 * 24 * 60)
    expect(loaded.state.lifecycle.ageMinutes).toBe(3 * 24 * 60)
    expect(loaded.state.history.some((event) => event.type === 'tick')).toBe(true)
  })

  it('persists the current state after actions', async () => {
    const { result, unmount } = renderHook(() => useTamagotchiEngine('original'))

    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull()

    act(() => {
      result.current.controls.tick(5)
    })

    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as {
      state?: { lifecycle?: { ageMinutes?: number } }
      version?: number
    }

    expect(persisted.version).toBe(1)
    expect(persisted.state?.lifecycle?.ageMinutes).toBe(5)

    unmount()
  })
})
