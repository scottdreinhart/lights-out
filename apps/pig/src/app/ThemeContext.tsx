import { createThemeContext } from '@games/theme-context'
import useTheme from './useTheme'

const { ThemeProvider, useThemeContext } = createThemeContext(useTheme)

export { ThemeProvider, useThemeContext }
