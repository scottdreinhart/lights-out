/**
 * Theme / mode / colorblind persistence + DOM sync.
 * Configured via shared factory with app-specific storage key.
 */

import { createSharedThemeLoaders } from '@games/assets-shared'
import { createUseThemeHook } from '@games/app-hook-utils'
import { SHARED_THEME_COLORS } from '@games/domain-shared'

import { getBackgroundCssValue, getLayerStack, layerStackToCssVars, preloadAllSprites } from '@/domain'
import {
  COLORBLIND_MODES,
  COLOR_THEMES,
  DEFAULT_SETTINGS,
  MODES,
  type ColorblindMode,
  type ColorTheme,
  type Mode,
} from '@/domain'
import { load, save } from './storageService.ts'

const STORAGE_KEY = 'checkers-theme-settings'

/**
 * Theme color palettes — maps theme ID to color definitions.
 * Used to set CSS custom properties for coordinated theming across all UI.
 */
const THEME_COLORS = SHARED_THEME_COLORS

export interface UseThemeReturn {
  settings: ThemeSettings
  colorTheme: ColorTheme
  mode: Mode
  colorblind: ColorblindMode
  colorThemes: readonly ColorTheme[]
  modes: readonly Mode[]
  colorblindModes: readonly ColorblindMode[]
  setColorTheme: (id: string) => void
  setMode: (mode: string) => void
  setColorblind: (id: string) => void
}

interface ThemeSettings {
  colorTheme: ColorTheme
  mode: Mode
  colorblind: ColorblindMode
}

const useThemeBase = createUseThemeHook<ThemeSettings>({
  storageKey: STORAGE_KEY,
  defaultSettings: DEFAULT_SETTINGS,
  colorThemes: COLOR_THEMES.map((id) => ({ id })),
  themeColors: THEME_COLORS,
  createThemeLoaders: createSharedThemeLoaders,
  load,
  save,
  getLayerStack,
  layerStackToCssVars,
  getBackgroundCssValue,
  preloadAllSprites,
})

const useTheme = (): UseThemeReturn => {
  const { settings, setColorTheme, setMode, setColorblind } = useThemeBase()

  return {
    settings,
    colorTheme: settings.colorTheme,
    mode: settings.mode,
    colorblind: settings.colorblind,
    colorThemes: COLOR_THEMES,
    modes: MODES,
    colorblindModes: COLORBLIND_MODES,
    setColorTheme,
    setMode,
    setColorblind,
  }
}

export default useTheme
