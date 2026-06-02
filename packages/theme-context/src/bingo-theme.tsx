/**
 * Pre-configured Theme Provider for Bingo games.
 * 
 * Exports a ready-to-use ThemeProvider and useTheme hook
 * specifically configured for bingo with light/dark/colorblind mode support.
 * 
 * Supports themes:
 * - classic, dark, ocean, forest (standard)
 * - colorblind-protan, colorblind-deutan, colorblind-tritan, colorblind-achroma (accessible)
 */

import React, { createContext, useEffect, useMemo, useState } from 'react'

export type BingoTheme = 
  | 'classic' 
  | 'dark' 
  | 'ocean' 
  | 'forest'
  | 'colorblind-protan'
  | 'colorblind-deutan'
  | 'colorblind-tritan'
  | 'colorblind-achroma'

export interface BingoThemeContextType {
  theme: BingoTheme
  setTheme: (theme: BingoTheme) => void
}

const BingoThemeContext = createContext<BingoThemeContextType | undefined>(undefined)
const THEME_STORAGE_KEY = 'bingo-theme'
const DEFAULT_THEME: BingoTheme = 'dark'

/**
 * Theme Provider for Bingo applications.
 * Manages theme state including light/dark and colorblind-accessible modes.
 * Persists user selection to localStorage and applies CSS classes to document root.
 * 
 * @example
 * ```tsx
 * <BingoThemeProvider>
 *   <YourApp />
 * </BingoThemeProvider>
 * ```
 */
export function BingoThemeProvider({ children }: { children: React.ReactNode }) {
  // Load theme from localStorage or use default
  const [theme, setThemeState] = useState<BingoTheme>(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      return (stored as BingoTheme) || DEFAULT_THEME
    } catch {
      return DEFAULT_THEME
    }
  })

  // Helper to update theme and persist to localStorage
  const setTheme = (newTheme: BingoTheme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch {
      // Silently fail if localStorage is not available (e.g., private browsing)
    }
  }

  // Apply theme as CSS class to document root
  useEffect(() => {
    const root = document.documentElement
    // Remove all theme classes
    root.classList.remove(
      'theme-classic',
      'theme-dark',
      'theme-ocean',
      'theme-forest',
      'colorblind-protan',
      'colorblind-deutan',
      'colorblind-tritan',
      'colorblind-achroma',
    )
    // Add current theme class
    if (theme.startsWith('colorblind-')) {
      root.classList.add(theme)
    } else {
      root.classList.add(`theme-${theme}`)
    }
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme }), [theme])

  return <BingoThemeContext.Provider value={value}>{children}</BingoThemeContext.Provider>
}

/**
 * Hook to access bingo theme context.
 * 
 * @throws {Error} If called outside of BingoThemeProvider
 * @example
 * ```tsx
 * const { theme, setTheme } = useBingoTheme()
 * ```
 */
export function useBingoTheme() {
  const context = React.useContext(BingoThemeContext)
  if (!context) {
    throw new Error('useBingoTheme must be used within BingoThemeProvider')
  }
  return context
}

/**
 * Backward compatibility export for apps expecting 'useTheme' name.
 * This allows gradual migration of existing code.
 * 
 * @deprecated Use useBingoTheme instead
 */
export const useTheme = useBingoTheme
