/**
 * Responsive system — centralized breakpoints, media query tokens, types,
 * and pure derived-state helpers. Framework-agnostic.
 *
 * This is the single source of truth for all responsive logic.
 *
 * Re-exports from @games/domain-shared, with TicTacToe-specific type definitions.
 */

export {
  HEIGHT_THRESHOLDS,
  MEDIA_QUERIES,
  RESPONSIVE_BREAKPOINTS,
  deriveBreakpointFlags,
  deriveContentDensity,
  deriveDeviceCategory,
  deriveDialogMode,
  deriveGridColumns,
  deriveInteractionMode,
  deriveNavMode,
  deriveResponsiveState,
  type BreakpointName,
  type ContentDensity,
  type DialogMode,
  type InteractionMode,
  type NavMode,
  type ResponsiveCapabilities,
  type ResponsiveState,
} from '@games/domain-shared'
