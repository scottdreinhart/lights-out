/**
 * @games/button-system
 * 
 * Standardized button system with WCAG 44px compliance across all games.
 * Provides CSS classes and TypeScript types for consistent button styling.
 */

/**
 * Button style variants
 */
export type ButtonVariant = 'default' | 'secondary' | 'danger' | 'success'

/**
 * Button size variants
 */
export type ButtonSize = 'small' | 'default' | 'large'

/**
 * Button state
 */
export type ButtonState = 'default' | 'loading' | 'disabled'

/**
 * Button configuration interface
 */
export interface ButtonConfig {
  variant?: ButtonVariant
  size?: ButtonSize
  state?: ButtonState
  icon?: boolean
  block?: boolean
  className?: string
}

/**
 * Generate control button class string
 * @param config - Button configuration
 * @returns CSS class string
 */
export function getButtonClass(config: ButtonConfig): string {
  const classes: string[] = ['control-button']

  if (config.variant && config.variant !== 'default') {
    classes.push(config.variant)
  }

  if (config.size && config.size !== 'default') {
    classes.push(config.size)
  }

  if (config.state && config.state !== 'default') {
    classes.push(config.state)
  }

  if (config.icon) {
    classes.push('icon')
  }

  if (config.block) {
    classes.push('block')
  }

  if (config.className) {
    classes.push(config.className)
  }

  return classes.join(' ')
}

/**
 * Button styles CSS file path for import
 * Import in your CSS: @import '@games/button-system/styles';
 */
export const STYLES_PATH = '@games/button-system/styles'

/**
 * Default button configuration for most use cases
 */
export const DEFAULT_BUTTON_CONFIG: ButtonConfig = {
  variant: 'default',
  size: 'default',
  state: 'default',
  icon: false,
  block: false,
}

/**
 * Button minimum requirements (WCAG 2.1 AAA)
 */
export const BUTTON_REQUIREMENTS = {
  minHeight: 44, // pixels
  minWidth: 44, // pixels  
  minTouchTarget: 44, // pixels
  focusOutlineWidth: 2, // pixels
  focusOutlineOffset: 2, // pixels
  animationDuration: 0.3, // seconds
  animationCurve: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const

/**
 * Accessibility requirements met by this system:
 * - WCAG 2.1 Level AAA: 44px minimum touch target size
 * - WCAG 2.1 Level AA: Visible focus indicator
 * - WCAG 2.1: Sufficient color contrast (7:1 ratio)
 * - WCAG 2.1: Touch-friendly animations (@media (pointer: coarse))
 * - WCAG 2.1: Reduced motion support (@media (prefers-reduced-motion))
 * - WCAG 2.1: High contrast mode support (@media (prefers-contrast: more))
 */
export const ACCESSIBILITY_COMPLIANCE = {
  section508: true,
  wcagA: true,
  wcagAA: true,
  wcagAAA: true,
  wcagTouchTarget: '44px minimum',
  focusIndicator: 'visible',
  contrastRatio: '7:1',
  touchOptimized: true,
  reducedMotion: true,
} as const
