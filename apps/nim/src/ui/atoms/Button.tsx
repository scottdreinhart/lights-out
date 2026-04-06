/**
 * Standard web button component replacing IonButton
 * Provides the same functionality without Ionic dependency
 */

import './Button.css'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
  'aria-label'?: string
}

export function Button({
  children,
  onClick,
  disabled = false,
  type = 'button',
  variant = 'primary',
  loading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`button button--${variant} ${loading ? 'button--loading' : ''}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="button__spinner" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
