// Re-export sprite utilities from @games/assets-shared
export {
  getThemeSprites,
  getBackgroundCssValue,
  getAllSpriteSources,
  preloadSprite,
  preloadAllSprites,
  type SpriteAsset,
  type ThemeSpriteSet,
} from '@games/assets-shared'

// Re-export shared domain constants from @games/domain-shared
export {
  RESPONSIVE_BREAKPOINTS,
  HEIGHT_THRESHOLDS,
  MEDIA_QUERIES,
  deriveBreakpointFlags,
  deriveDeviceCategory,
  deriveNavMode,
  deriveContentDensity,
  deriveDialogMode,
  deriveInteractionMode,
  deriveGridColumns,
  deriveResponsiveState,
  type BreakpointName,
  type NavMode,
  type ContentDensity,
  type DialogMode,
  type InteractionMode,
  type ResponsiveCapabilities,
  type ResponsiveState,
} from '@games/domain-shared'

/**
 * Domain layer barrel export.
 * Re-exports all pure, framework-agnostic game logic.
 *
 * Usage: import { createBoard, checkWin } from '@/domain'
 */

export * from './ai'
export * from './board'
export * from './constants'
export * from './layers'
export * from './responsive'
export * from './rules'
export * from './themes'
export * from './types'
