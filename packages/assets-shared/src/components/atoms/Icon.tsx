import React, { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Icon.module.css'

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg'
  name: string // Icon identifier (e.g., 'menu', 'cross', 'pause')
  ariaLabel?: string
}

/**
 * Icon atom — wraps common SVG patterns for consistent sizing and a11y.
 * Icons should be passed as children or via icon library integration.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ className, size = 'md', name, ariaLabel, children, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        className={clsx(styles.icon, styles[size], className)}
        aria-label={ariaLabel || name}
        role="img"
        {...rest}
      >
        {children}
      </svg>
    )
  },
)

Icon.displayName = 'Icon'
