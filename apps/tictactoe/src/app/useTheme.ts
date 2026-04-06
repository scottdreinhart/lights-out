import { useCallback, useEffect, useState } from 'react'

/**
 * TicTacToe theme hook - manages theme settings for the app
 *
 * Returns an object with:
 *  - settings: current theme configuration
 *  - setColorTheme: set the color theme (light/dark/system)
 *  - setMode: set the display mode
 *  - setColorblind: set colorblind accessibility mode
 */
export interface ThemeSettings {
  colorTheme: 'light' | 'dark' | 'system'
  mode: 'light' | 'dark'
  colorblind: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
}

export default function useTheme() {
  const [settings, setSettings] = useState<ThemeSettings>({
    colorTheme: 'system',
    mode: 'light',
    colorblind: 'none',
  })

  // Update mode based on system preference if colorTheme is 'system'
  useEffect(() => {
    if (settings.colorTheme !== 'system') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSettings((s) => ({ ...s, mode: e.matches ? 'dark' : 'light' }))
    }

    // Set initial value
    setSettings((s) => ({ ...s, mode: mediaQuery.matches ? 'dark' : 'light' }))

    // Listen to changes
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [settings.colorTheme])

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', settings.mode)
    root.setAttribute('data-colorblind', settings.colorblind)
  }, [settings.mode, settings.colorblind])

  const setColorTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    setSettings((s) => ({ ...s, colorTheme: theme }))
  }, [])

  const setMode = useCallback((mode: 'light' | 'dark') => {
    setSettings((s) => ({ ...s, mode, colorTheme: 'light' }))
  }, [])

  const setColorblind = useCallback((cb: typeof settings.colorblind) => {
    setSettings((s) => ({ ...s, colorblind: cb }))
  }, [])

  return {
    settings,
    setColorTheme,
    setMode,
    setColorblind,
  }
}
