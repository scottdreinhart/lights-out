/**
 * Centralized responsive breakpoint tokens.
 * Single source of truth for all viewport-related thresholds.
 *
 * Breakpoints use min-width (mobile-first) convention.
 * Never scatter raw pixel values across the codebase — import from here.
 */

export const BREAKPOINTS = {
  /** Extra-small (start of range) */
  xs: 0,
  /** Small phones and larger */
  sm: 480,
  /** Tablets and larger */
  md: 768,
  /** Laptops and larger */
  lg: 1024,
  /** Desktops and larger */
  xl: 1280,
  /** Ultrawide displays */
  xxl: 1536,
} as const

export type BreakpointKey = keyof typeof BREAKPOINTS

/** Viewport heights below this threshold are considered "short" */
export const SHORT_VIEWPORT_HEIGHT = 500
