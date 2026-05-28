import { useCallback, useEffect, useState } from 'react'

import type { ColorTheme } from '@/domain/themes'
import { DEFAULT_SETTINGS } from '@/domain/themes'

import { load, save } from './storageService'

const STORAGE_KEY = 'snake-theme-settings'

interface PersistedThemeSettings {
  colorTheme: ColorTheme
}

const loadThemeSettings = (): PersistedThemeSettings => {
  const parsed = load<Partial<PersistedThemeSettings>>(STORAGE_KEY, {})
  return {
    colorTheme: parsed.colorTheme ?? DEFAULT_SETTINGS.colorTheme,
  }
}

const saveThemeSettings = (settings: PersistedThemeSettings): void => {
  save(STORAGE_KEY, settings)
}

const useTheme = () => {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(
    () => loadThemeSettings().colorTheme,
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme)
    saveThemeSettings({ colorTheme })
  }, [colorTheme])

  const setColorTheme = useCallback((nextTheme: ColorTheme) => {
    setColorThemeState(nextTheme)
  }, [])

  return {
    colorTheme,
    setColorTheme,
  }
}

export default useTheme
