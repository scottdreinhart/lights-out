import { createContext, type ReactNode, useContext, useState, useEffect } from 'react'
import type { ThemeContextType } from '../types'

export function createThemeContext(
  storageKey: string,
  defaultSettings: { colorTheme: string; mode: 'light' | 'dark' | 'system'; colorblindMode: string }
) {
  const ThemeContext = createContext<ThemeContextType | null>(null)

  function ThemeProvider({ children }: { children: ReactNode }) {
    const [colorTheme, setColorTheme] = useState(defaultSettings.colorTheme)
    const [mode, setMode] = useState<'light' | 'dark' | 'system'>(defaultSettings.mode)
    const [colorblindMode, setColorblindMode] = useState(defaultSettings.colorblindMode)

    // Load from storage on mount
    useEffect(() => {
      if (typeof window === 'undefined') return
      try {
        const saved = window.localStorage.getItem(storageKey)
        if (saved) {
          const parsed = JSON.parse(saved)
          setColorTheme(parsed.colorTheme ?? defaultSettings.colorTheme)
          setMode(parsed.mode ?? defaultSettings.mode)
          setColorblindMode(parsed.colorblindMode ?? defaultSettings.colorblindMode)
        }
      } catch (error) {
        console.warn('Failed to load theme settings:', error)
      }
    }, [])

    // Save to storage on change
    useEffect(() => {
      if (typeof window === 'undefined') return
      try {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({ colorTheme, mode, colorblindMode })
        )
      } catch (error) {
        console.warn('Failed to save theme settings:', error)
      }
    }, [colorTheme, mode, colorblindMode])

    return (
      <ThemeContext.Provider value={{ colorTheme, mode, colorblindMode, setColorTheme, setMode, setColorblindMode }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  function useThemeContext(): ThemeContextType {
    const ctx = useContext(ThemeContext)
    if (!ctx) {
      throw new Error('useThemeContext must be used within a <ThemeProvider>')
    }
    return ctx
  }

  return { ThemeProvider, useThemeContext }
}
