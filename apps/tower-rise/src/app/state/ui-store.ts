/**
 * TODO: PURPOSE
 * TODO: Keep UI shell state separate from deterministic simulation state.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own start/pause/game-over screen routing only.
 *
 * TODO: INPUTS
 * TODO: Screen transition intents from runtime/hooks.
 *
 * TODO: OUTPUTS
 * TODO: Zustand selector-friendly screen state and mutators.
 *
 * TODO: DEPENDENCIES
 * TODO: Depends on Zustand + domain screen type only.
 *
 * TODO: EDGE CASES
 * TODO: Ensure screen transitions remain explicit and debuggable.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Small store slice limits rerenders to screen-aware components.
 */
import type { ScreenState } from '@/domain'
import { create } from 'zustand'

interface UiStore {
  screen: ScreenState
  setScreen: (screen: ScreenState) => void
}

export const useUiStore = create<UiStore>((set) => ({
  screen: 'start',
  setScreen: (screen) => set({ screen }),
}))
