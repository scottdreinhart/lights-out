/**
 * @games/domain-shared — Centralized domain-layer constants shared across all game apps.
 *
 * Exports responsive breakpoints, media query tokens, and layer configuration.
 * All apps import from this package instead of maintaining local copies.
 */

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
} from './responsive'

export {
  LAYER_Z,
  getLayerStack,
  layerStackToCssVars,
  type LayerConfig,
  type LayerStack,
} from './layers'

export {
  SHARED_THEME_COLORS,
  type SharedThemeColors,
  type ThemeCssVariables,
} from './themeColors'

export * from './sudoku/constants'
export * from './sudoku/rules'
export * from './sudoku/types'
