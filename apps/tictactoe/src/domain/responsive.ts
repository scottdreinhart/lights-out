/**
 * Responsive system — centralized breakpoints, media query tokens, types,
 * and pure derived-state helpers. Framework-agnostic.
 *
 * This is the single source of truth for all responsive logic.
 *
 * Re-exports from @games/domain-shared, with TicTacToe-specific type definitions.
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
} from '@games/domain-shared'
