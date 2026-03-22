import { createContext, type ReactNode, useContext } from 'react'

import useTheme from '../hooks/useTheme.ts'

type UseThemeReturn = ReturnType<typeof useTheme>

const ThemeContext = createContext<UseThemeReturn | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useTheme()
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export function useThemeContext(): UseThemeReturn {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useThemeContext must be used within a <ThemeProvider>')
  }
  return ctx
}
