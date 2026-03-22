import React, { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Button.module.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

/**
 * Reusable button atom — available across all apps.
 * Provides consistent styling, accessibility, and touch optimization.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...rest },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(styles.button, styles[variant], styles[size], className, {
          [styles.disabled]: disabled || isLoading,
        })}
        disabled={disabled || isLoading}
        {...rest}
      >
        {isLoading && <span className={styles.spinner} />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
