/**
 * Application layer barrel export.
 * Re-exports all React hooks and context providers.
 *
 * Usage: import { useTheme, useSoundEffects } from '@/app'
 */

// Context providers
export { SoundProvider, useSoundContext } from './SoundContext'
export { ThemeProvider, useThemeContext } from './ThemeContext'
export { I18nProvider, useI18nContext } from './context'

// Hooks
export * from './hooks'

// Services
export * from './services'
