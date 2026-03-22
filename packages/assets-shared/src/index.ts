/**
 * @games/assets-shared — Centralized shared resources across all games.
 *
 * Exports:
 * - Hooks: useResponsiveState (responsive UI), useSwipeGesture, useDropdownBehavior
 * - Components: Reusable atoms (Button, Icon, Card) and molecules (FormGroup, Separator)
 * - Sprites: Theme-based sprite management for standard game types
 * - Themes: CSS loaders for 7+ theme variants
 *
 * Game-specific overrides remain in local domain/ and ui/ directories.
 */

// Hooks
export {
  useResponsiveState,
  useSwipeGesture,
  useDropdownBehavior,
  type ResponsiveState,
  type ResponsiveCapabilities,
} from './hooks'

// Components
export {
  // Atoms
  Button,
  Icon,
  Card,
  // Molecules
  FormGroup,
  Separator,
  type ButtonProps,
  type IconProps,
  type CardProps,
  type FormGroupProps,
  type SeparatorProps,
} from './components'

// Sprites & Themes
export {
  getThemeSprites,
  getBackgroundCssValue,
  getAllSpriteSources,
  preloadSprite,
  preloadAllSprites,
  type SpriteAsset,
  type ThemeSpriteSet,
} from './sprites'

export { createSharedThemeLoaders } from './themeCss'
