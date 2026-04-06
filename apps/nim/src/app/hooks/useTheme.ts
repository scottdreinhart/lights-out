/**
 * Theme Hook — manages theme state and persistence.
 * UI synchronization is handled by the UI theme service.
 */

import { useCallback, useEffect, useState } from 'react'

import { load, save } from '@/infrastructure/storage'
import { DEFAULT_SETTINGS } from '@/domain'

import type { ThemeSettings } from '@/domain'

const STORAGE_KEY = 'nim-theme-settings'

const loadSettings = (): ThemeSettings => {
  const parsed = load<ThemeSettings>(STORAGE_KEY, DEFAULT_SETTINGS)
  return { ...DEFAULT_SETTINGS, ...parsed }
}

const saveSettings = (settings: ThemeSettings): void => {
  save(STORAGE_KEY, settings)
}

export interface UseThemeReturn {
  settings: ThemeSettings
  setColorTheme: (id: string) => void
  setMode: (mode: string) => void
  setColorblind: (id: string) => void
}

const useTheme = (): UseThemeReturn => {
  const [settings, setSettings] = useState<ThemeSettings>(loadSettings)

  // Save settings whenever they change
  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const setColorTheme = useCallback((id: string) => {
    setSettings((prev) => ({ ...prev, colorTheme: id }))
  }, [])

  const setMode = useCallback((mode: string) => {
    setSettings((prev) => ({ ...prev, mode }))
  }, [])

  const setColorblind = useCallback((id: string) => {
    setSettings((prev) => ({ ...prev, colorblind: id }))
  }, [])

  return { settings, setColorTheme, setMode, setColorblind }
}

/**
 * Get the color palette for the star explosion effect based on theme ID.
 * Returns primary, secondary, and accent colors from the theme.
 */
const getThemeColorPalette = (themeId: string): string[] => {
  // This function needs to be moved to UI layer or use a service
  // For now, keeping it here but it should be refactored
  const themeColors = {
    '--theme-primary': '#007acc',
    '--theme-secondary': '#005a9e',
    '--theme-accent': '#0099cc',
  }
  return [
    themeColors['--theme-primary'],
    themeColors['--theme-secondary'],
    themeColors['--theme-accent'],
  ].filter(Boolean)
}

export { useTheme, getThemeColorPalette }

export default useTheme

