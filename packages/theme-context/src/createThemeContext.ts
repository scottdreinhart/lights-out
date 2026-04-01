import { createContext, type ReactNode, useContext } from 'react'

/**
 * createThemeContext — Factory function to create a theme context and provider.
 * 
 * Since each app has a different useTheme hook (due to app-specific theming),
 * this factory creates the context wrapper for any useTheme hook.
 * 
 * Usage:
 *   const { ThemeProvider, useThemeContext } = createThemeContext(useTheme)
 *   
 *   // In App.tsx:
 *   <ThemeProvider><App /></ThemeProvider>
 *   
 *   // In any child component:
 *   const { settings, setColorTheme } = useThemeContext()
 */
export function createThemeContext<T extends object>(useThemeHook: () => T) {
  const ThemeContext = createContext<T | null>(null)

  /**
   * ThemeProvider — provides theme settings via React Context, wrapping
   * the given useTheme hook. Place at the top of the component tree.
   */
  function ThemeProvider({ children }: { children: ReactNode }) {
    const theme = useThemeHook()
    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  }

  /**
   * useThemeContext — access theme settings anywhere in the tree.
   * Must be called inside a <ThemeProvider>.
   */
  function useThemeContext(): T {
    const ctx = useContext(ThemeContext)
    if (!ctx) {
      throw new Error('useThemeContext must be used within a <ThemeProvider>')
    }
    return ctx
  }

  return { ThemeProvider, useThemeContext }
}
