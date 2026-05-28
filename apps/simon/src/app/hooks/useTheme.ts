import { useCallback, useEffect, useState } from 'react'

import { SIMON_THEME_PRESETS } from '@/domain'
import {
  COLORBLIND_MODES,
  COLOR_THEMES,
  DEFAULT_SETTINGS,
  MODES,
  type ThemeSettings,
} from '@games/theme-contract'

const STORAGE_KEY = 'simon-theme-settings'

const LIGHT_MODE_OVERRIDES = {
  backgroundStart: '#f4f7fb',
  backgroundEnd: '#dbeafe',
  panel: 'rgba(255, 255, 255, 0.74)',
  panelBorder: 'rgba(15, 23, 42, 0.12)',
  text: '#102033',
  textMuted: 'rgba(16, 32, 51, 0.72)',
  surface: 'rgba(16, 32, 51, 0.06)',
  surfaceStrong: 'rgba(16, 32, 51, 0.12)',
} as const

function loadThemeSettings(): ThemeSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      return DEFAULT_SETTINGS
    }

    const parsed = JSON.parse(saved) as Partial<ThemeSettings>
    return {
      colorTheme: parsed.colorTheme ?? DEFAULT_SETTINGS.colorTheme,
      mode: parsed.mode ?? DEFAULT_SETTINGS.mode,
      colorblind: parsed.colorblind ?? DEFAULT_SETTINGS.colorblind,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function persistThemeSettings(settings: ThemeSettings): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    return
  }
}

function applyThemeToDocument(settings: ThemeSettings): void {
  if (typeof document === 'undefined') {
    return
  }

  const palette = SIMON_THEME_PRESETS[settings.colorTheme] ?? SIMON_THEME_PRESETS['neon-core']
  const modePalette = settings.mode === 'light' ? { ...palette, ...LIGHT_MODE_OVERRIDES } : palette
  const root = document.documentElement

  root.setAttribute('data-theme', settings.colorTheme)
  root.setAttribute('data-mode', settings.mode)

  if (settings.colorblind === 'none') {
    root.removeAttribute('data-colorblind')
  } else {
    root.setAttribute('data-colorblind', settings.colorblind)
  }

  root.style.setProperty(
    '--simon-shell-bg',
    `linear-gradient(135deg, ${modePalette.backgroundStart}, ${modePalette.backgroundEnd})`,
  )
  root.style.setProperty('--simon-shell-panel', modePalette.panel)
  root.style.setProperty('--simon-shell-panel-border', modePalette.panelBorder)
  root.style.setProperty('--simon-shell-text', modePalette.text)
  root.style.setProperty('--simon-shell-text-muted', modePalette.textMuted)
  root.style.setProperty('--simon-shell-accent', palette.accent)
  root.style.setProperty('--simon-shell-accent-soft', palette.accentSoft)
  root.style.setProperty('--simon-shell-surface', modePalette.surface)
  root.style.setProperty('--simon-shell-surface-strong', modePalette.surfaceStrong)
  root.style.setProperty('--simon-pad-base', palette.padBase)
  root.style.setProperty('--simon-pad-border', palette.padBorder)
  root.style.setProperty('--simon-pad-shadow', palette.padShadow)
}

export function useTheme() {
  const [settings, setSettings] = useState<ThemeSettings>(loadThemeSettings)

  useEffect(() => {
    applyThemeToDocument(settings)
    persistThemeSettings(settings)
  }, [settings])

  const setColorTheme = useCallback((colorTheme: string) => {
    setSettings((current: ThemeSettings) => ({ ...current, colorTheme }))
  }, [])

  const setMode = useCallback((mode: string) => {
    if (!MODES.includes(mode as (typeof MODES)[number])) {
      return
    }

    setSettings((current: ThemeSettings) => ({ ...current, mode }))
  }, [])

  const setColorblind = useCallback((colorblind: string) => {
    if (!COLORBLIND_MODES.some((entry: { id: string }) => entry.id === colorblind)) {
      return
    }

    setSettings((current: ThemeSettings) => ({ ...current, colorblind }))
  }, [])

  return {
    settings,
    setColorTheme,
    setMode,
    setColorblind,
    availableThemes: COLOR_THEMES,
    availableModes: MODES,
    availableColorblindModes: COLORBLIND_MODES,
  }
}
