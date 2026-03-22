/**
 * Theme / mode / colorblind persistence + DOM sync.
 */

import { createSharedThemeLoaders } from '@games/assets-shared'
import { createUseThemeHook } from '@games/app-hook-utils'
import { SHARED_THEME_COLORS } from '@games/domain-shared'

import {
  COLOR_THEMES,
  DEFAULT_SETTINGS,
  getBackgroundCssValue,
  getLayerStack,
  layerStackToCssVars,
  preloadAllSprites,
} from '@/domain'
import type { ThemeSettings } from '@/domain'
import { load, save } from './storageService.ts'

const STORAGE_KEY = 'mexico-theme-settings'

const THEME_COLORS = SHARED_THEME_COLORS

export interface UseThemeReturn {
  settings: ThemeSettings
  setColorTheme: (id: string) => void
  setMode: (mode: string) => void
  setColorblind: (id: string) => void
}

const useTheme = createUseThemeHook<ThemeSettings>({
  storageKey: STORAGE_KEY,
  defaultSettings: DEFAULT_SETTINGS,
  colorThemes: COLOR_THEMES,
  themeColors: THEME_COLORS,
  createThemeLoaders: createSharedThemeLoaders,
  load,
  save,
  getLayerStack,
  layerStackToCssVars,
  getBackgroundCssValue,
  preloadAllSprites,
})

export default useTheme
