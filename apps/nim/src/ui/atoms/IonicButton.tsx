/**
 * IonicButton — Ionic-powered button component with platform awareness.
 *
 * Features:
 * - Touch-optimized on mobile/tablet
 * - Hover effects on desktop
 * - Platform-aware sizing via useIonicPlatform()
 * - Responsive typography
 * - Integrates with Ionic theming (CSS variables)
 * - Supports loading state
 * - Semantic sizing: small, default, large
 *
 * Usage:
 * <IonicButton onClick={handleClick}>Click me</IonicButton>
 * <IonicButton size="large" color="primary">Large primary</IonicButton>
 * <IonicButton disabled>Disabled</IonicButton>
 * <IonicButton loading>Loading...</IonicButton>
 */

import { IonButton, IonSpinner } from '@ionic/react'
import React from 'react'

import { useIonicPlatform } from '@/app'
import styles from './IonicButton.module.css'

interface IonicButtonProps
  extends Omit<React.ComponentProps<typeof IonButton>, 'size' | 'color' | 'fill' | 'expand' | 'shape'> {
  /**
   * Visual variant: primary, secondary, danger, success, warning, light, dark
   */
  color?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'light' | 'dark'

  /**
   * Button size: small, default, large
   * Default: 'default'
   * On mobile, automatically scales up for touch targets
   */
  size?: 'small' | 'default' | 'large'

  /**
   * Visually fills the button with background color
   */
  fill?: boolean

  /**
   * Show loading spinner (disables click events)
   */
  loading?: boolean

  /**
   * Button content (text, children, or custom)
   */
  children?: React.ReactNode

  /**
   * Expand button to full width
   */
  expand?: boolean

  /**
   * Shape: default, round
   */
  shape?: 'default' | 'round'
}

/**
 * IonicButton component using Ionic's IonButton with platform awareness.
 * Automatically adjusts size and styling based on device type.
 */
export const IonicButton = React.forwardRef<HTMLIonButtonElement, IonicButtonProps>(
  function IonicButton(
    { color = 'primary', size = 'default', fill = false, loading = false, expand = false, shape = 'default', children, className, ...props },
    ref,
  ) {
    const platform = useIonicPlatform()

    // Size adjustment: larger touch targets on mobile/tablet
    const effectiveSize =
      platform.isMobileDevice && size === 'default' ? 'large' : size

    // Render loading state
    if (loading) {
      return (
        <IonButton
          ref={ref}
          color={color}
          size={effectiveSize}
          fill={fill ? 'solid' : 'outline'}
          disabled
          className={`${styles.button} ${styles.loading}`}
        >
          <IonSpinner name="crescent" slot="start" />
          {children}
        </IonButton>
      )
    }

    return (
      <IonButton
        ref={ref}
        color={color}
        size={effectiveSize}
        fill={fill ? 'solid' : 'outline'}
        expand={expand ? 'block' : undefined}
        shape={shape === 'round' ? 'round' : undefined}
        className={`${styles.button} ${className || ''}`}
        {...props}
      >
        {children}
      </IonButton>
    )
  },
)

IonicButton.displayName = 'IonicButton'
