import type { GameState } from './types'

export interface GameMeta {
  slug: string
  title: string
  family: string
  summary: string
  primaryLabel: string
  secondaryLabel: string
  tertiaryLabel: string
}

export interface RunnerFlowProfile {
  scrollDirection: 'horizontal_right' | 'vertical_up' | 'forward'
  cameraMode: 'side_view' | 'third_person_behind' | 'first_person' | 'isometric'
  laneModel: 'lane_based' | 'free_movement' | 'physics_based'
  primaryInput: 'jump' | 'swipe' | 'tap' | 'tilt'
  corePattern: 'obstacle' | 'rhythm' | 'terrain' | 'combat'
}

export const GAME_META: GameMeta = {
  slug: 'sky-blitz',
  title: 'Sky Blitz',
  family: 'Side Scroller',
  summary: 'Push forward through scrolling hazard waves and keep flight momentum alive.',
  primaryLabel: 'Boost Forward',
  secondaryLabel: 'Stabilize',
  tertiaryLabel: 'Barrel Roll',
}

export const RUNNER_FLOW_PROFILE: RunnerFlowProfile = {
  scrollDirection: 'horizontal_right',
  cameraMode: 'side_view',
  laneModel: 'physics_based',
  primaryInput: 'tap',
  corePattern: 'obstacle',
}

export const PROGRESS_TARGET = 120

export const INITIAL_STATE: GameState = {
  phase: 'playing',
  tick: 0,
  score: 0,
  lives: 3,
  intensity: 10,
  progress: 0,
  focus: 50,
  status: 'Ready for side scroller loop',
}
