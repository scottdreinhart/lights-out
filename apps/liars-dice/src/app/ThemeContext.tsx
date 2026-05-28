import { createThemeContext } from '@games/theme-context'
import { useTheme } from './hooks'

const { ThemeProvider, useThemeContext } = createThemeContext(useTheme)

export { ThemeProvider, useThemeContext }
