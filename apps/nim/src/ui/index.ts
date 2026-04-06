/**
 * UI layer barrel export.
 * Re-exports atoms, molecules, organisms, utilities, and theme.
 *
 * Usage: import { App, SplashScreen, COLOR_THEMES, cx } from '@/ui'
 */

export { default as cx } from 'clsx'
export * from './atoms'
export * from './molecules'
export { default as App } from './organisms/App'
export * from './theme'

// Layer stack utilities for theme CSS variable application
export function getLayerStack(_themeId: string): Record<string, number> {
  return {
    '--z-base': '0',
    '--z-overlay': '100',
    '--z-modal': '1000',
    '--z-tooltip': '10000',
  }
}

export function layerStackToCssVars(stack: Record<string, number>): Record<string, string> {
  return Object.entries(stack).reduce(
    (acc, [key, value]) => {
      acc[key] = String(value)
      return acc
    },
    {} as Record<string, string>,
  )
}
