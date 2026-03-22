/**
 * useDarkMode — Convenience hook for dark mode toggling.
 *
 * Wraps useTheme to provide a simpler API for apps that just need light/dark mode.
 *
 * Usage:
 *   const [isDarkMode, setDarkMode] = useDarkMode()
 *
 *   <button onClick={() => setDarkMode(!isDarkMode)}>Toggle Dark</button>
 */

import { useCallback } from 'react'

import { useTheme } from './useTheme'

export function useDarkMode(): [boolean, (isDark: boolean) => void] {
  const theme = useTheme()

  const isDarkMode = theme.settings.mode === 'dark'

  const setDarkMode = useCallback(
    (isDark: boolean) => {
      theme.setMode(isDark ? 'dark' : 'light')
    },
    [theme],
  )

  return [isDarkMode, setDarkMode]
}
