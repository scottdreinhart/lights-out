/**
 * Pre-configured Theme Provider for Bingo games.
 * 
 * Exports a ready-to-use ThemeProvider and useTheme hook
 * specifically configured for bingo with light/dark mode support.
 */

import React, { createContext, useMemo, useState } from 'react'

export type BingoTheme = 'light' | 'dark'

export interface BingoThemeContextType {
  theme: BingoTheme
  setTheme: (theme: BingoTheme) => void
}

const BingoThemeContext = createContext<BingoThemeContextType | undefined>(undefined)

/**
 * Theme Provider for Bingo applications.
 * Manages light/dark theme state.
 * 
 * @example
 * ```tsx
 * <BingoThemeProvider>
 *   <YourApp />
 * </BingoThemeProvider>
 * ```
 */
export function BingoThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<BingoTheme>('dark')

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
