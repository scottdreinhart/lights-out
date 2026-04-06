/**
 * Atoms barrel export — smallest UI building blocks.
 * Sourced from @games/common and local components.
 */

export { ErrorBoundary, OfflineIndicator, SplashScreen } from '@games/common'

// Local atom components
export { Button } from './Button'
export { default as DifficultyToggle } from './DifficultyToggle'
// GlitchText requires react-vfx which is not in devDependencies — skip for web build
// export { GlitchText } from './GlitchText'
// IonicButton requires @ionic/react — skip for web-only build
// export { IonicButton } from './IonicButton'
export { LoadingScreen } from './LoadingScreen'
export { NimObject } from './NimObject'
export { default as RulesToggle } from './RulesToggle'
export { default as StarExplosion } from './StarExplosion'
