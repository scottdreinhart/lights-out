// Sources: https://tamagotchi.fandom.com/wiki/Care and
// https://tamagotchi.fandom.com/wiki/Training

import type { VariantCapabilities, VariantEventTuning, VariantId, VariantUiPage } from './types'

export const VARIANT_IDS: readonly VariantId[] = ['original', 'angel', 'ocean'] as const

export const DEFAULT_PET_NAME = 'Tama'

export const MAX_HEARTS = 4

export const MAX_DISCIPLINE = 100

export const MAX_WEIGHT = 99

export const REAL_WORLD_MINUTES_PER_DAY = 24 * 60

export const VARIANT_LIFE_EXPECTANCY_DAYS = {
  original: 7,
  angel: 6,
  ocean: 5,
} as const

export const INITIAL_METERS = {
  hunger: MAX_HEARTS,
  effort: MAX_HEARTS,
  happiness: MAX_HEARTS,
  discipline: 0,
  angelPower: 25,
  weight: 5,
}

export const STAGE_ORDER = ['egg', 'baby', 'child', 'teen', 'adult', 'special', 'departed'] as const

export const ORIGINAL_STAGE_MINUTES = {
  babyToChild: 65,
  childToTeen: 180,
  teenToAdult: 360,
}

export const ANGEL_STAGE_MINUTES = {
  babyToChild: 65,
  childToTeen: 120,
  teenToAdult: 180,
}

export const OCEAN_STAGE_MINUTES = {
  babyToChild: 90,
  childToTeen: 180,
  teenToAdult: 300,
}

export const ATTENTION_WINDOW_MINUTES = 15

export const DEFAULT_VARIANT_CAPABILITIES: VariantCapabilities = {
  supportsPraise: false,
  supportsSensorTap: false,
  supportsPredatorEvents: false,
  supportsInjury: false,
  supportsGenetics: false,
  supportsConnection: false,
  supportsNetworkContent: false,
  supportsDownloadTickets: false,
  supportsCamera: false,
  supportsTouchUi: false,
}

export const DEFAULT_VARIANT_UI_PAGES: readonly VariantUiPage[] = [
  { id: 'status', label: 'Status', isDefault: true },
  { id: 'care', label: 'Care' },
  { id: 'history', label: 'History' },
]

export const DEFAULT_VARIANT_EVENT_TUNING: VariantEventTuning = {
  attentionWindowMinutes: ATTENTION_WINDOW_MINUTES,
  decayMultiplier: 1,
  tickIntervalMinutes: 1,
}

export const DEFAULT_GENERATION = 1
