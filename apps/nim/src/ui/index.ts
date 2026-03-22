/**
 * UI layer barrel export.
 * Re-exports atoms, molecules, organisms, and utilities.
 *
 * Usage: import { ErrorBoundary, cx } from '@/ui'
 */

export { BREAKPOINTS } from './ui-constants'
export { cx } from './utils/cssModules'

// Atoms
export {
	DifficultyToggle,
	IonicButton,
	LoadingScreen,
	NimObject,
	OfflineIndicator,
	RulesToggle,
	SplashScreen,
	StarExplosion,
} from './atoms'

// Molecules
export {
	HamburgerMenu,
	HamburgerLanguageSection,
	HamburgerPilesSection,
	IonicAlertDialog,
	IonicModalContainer,
	MainMenu,
	PileToggle,
	QuickGameSettings,
	QuickThemePicker,
} from './molecules'

// Organisms
export { App, AppWithProviders, GameBoard, ShellApp } from './organisms'
export { ErrorBoundary } from './organisms'

// Theme
export * from './theme'
