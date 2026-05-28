/**
 * Theme / mode / colorblind persistence + DOM sync.
 */

import { createSharedThemeLoaders } from '@games/assets-shared'
import { SHARED_THEME_COLORS } from '@games/domain-shared'
import { createUseThemeHook } from '@games/ui-hooks'

import {
  COLOR_THEMES,
  DEFAULT_SETTINGS,
  getBackgroundCssValue,
  getGameboardCssVars,
  getLayerStack,
  layerStackToCssVars,
  preloadAllSprites,
} from '@/domain'
import type { ThemeSettings } from '@/domain'

import { load, save } from '../storageService'

const STORAGE_KEY = 'battleship-theme-settings'

const useTheme = createUseThemeHook<ThemeSettings>({
  storageKey: STORAGE_KEY,
  defaultSettings: DEFAULT_SETTINGS,
  colorThemes: COLOR_THEMES,
  themeColors: SHARED_THEME_COLORS,
  createThemeLoaders: createSharedThemeLoaders,
  load,
  save,
  getLayerStack,
  layerStackToCssVars,
  getBackgroundCssValue,
  preloadAllSprites,
  gameboardCssVars: getGameboardCssVars(),
})

export type UseThemeReturn = ReturnType<typeof useTheme>

export default useTheme