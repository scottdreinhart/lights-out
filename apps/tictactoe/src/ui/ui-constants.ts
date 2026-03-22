/**
 * UI Constants
 *
 * SOLID: Open/Closed Principle
 * Centralize magic strings/numbers so they can be changed in ONE place.
 * Breakpoint values derived from the central responsive system.
 */

import { RESPONSIVE_BREAKPOINTS } from '@/domain'

export const BREAKPOINTS = {
  sm: RESPONSIVE_BREAKPOINTS.sm,
  md: RESPONSIVE_BREAKPOINTS.md,
  lg: RESPONSIVE_BREAKPOINTS.lg,
  xl: RESPONSIVE_BREAKPOINTS.xl,
} as const

// Menu & Dropdown Sizing
export const MENU_PANEL_MIN_WIDTH = 240 // px
export const MENU_PANEL_VIEWPORT_PADDING = 16 // px safe margin
export const MENU_ANIMATION_DURATION = 250 // ms

// Keyboard & Input
export const GRID_FOCUS_CLASS_NAME = 'cell-focused'
export const HAMBURGER_ICON_LABEL_CLOSE = 'Close menu'
export const HAMBURGER_ICON_LABEL_OPEN = 'Open menu'
export const HAMBURGER_MENU_PANEL_ID = 'game-menu-panel'

// Sound
export const SOUND_ENABLED_LABEL = 'Mute sound effects'
export const SOUND_DISABLED_LABEL = 'Enable sound effects'
export const SOUND_ENABLED_TITLE = 'Sound on'
export const SOUND_DISABLED_TITLE = 'Sound off'

// Difficulty
export const DIFFICULTY_LABEL = 'CPU difficulty'

// Theme
export const THEME_PANEL_LABEL = 'Theme settings'
export const THEME_PANEL_ROLE = 'dialog'

// Animations
export const KINETIC_ANIMATION_DURATION = 300 // ms
export const RESET_ANIMATION_DURATION = 300 // ms
export const CONFETTI_ANIMATION_DURATION = 2000 // ms

// Notification Banner
export const NOTIFICATION_AUTO_DISMISS_MS = 10000 // default 10s

// Accessible Element Roles
export const GRID_ROLE = 'grid'
export const MENU_ROLE = 'menu'
export const STATUS_ROLE = 'status'
export const STATUS_ARIA_LIVE = 'polite' as const
export const STATUS_ARIA_ATOMIC = 'true'
