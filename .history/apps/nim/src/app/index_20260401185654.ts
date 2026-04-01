/**
 * Application layer barrel export.
 * Re-exports all React hooks and context providers.
 *
 * Usage: import { useTheme, useSoundEffects } from '@/app'
 */

// Context providers
export { I18nProvider, useI18nContext } from './context'
export { SoundProvider, useSoundContext } from './SoundContext'
export { ThemeProvider, useThemeContext } from './ThemeContext'

// Hooks
export * from './hooks'

// Services
export * from './services'
