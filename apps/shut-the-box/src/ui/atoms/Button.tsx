import type { ReactNode } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'

interface ButtonProps {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: ButtonVariant
  fullWidth?: boolean
  ariaLabel?: string
  className?: string
  priority?: 'high' | 'normal' | 'low'
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  ariaLabel,
  className = '',
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </button>
  )
}
