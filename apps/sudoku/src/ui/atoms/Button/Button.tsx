import React from 'react'
import styles from './Button.module.css'

interface ButtonProps {
  onClick?: () => void
  children: React.ReactNode
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'disabled'
  size?: 'sm' | 'md' | 'lg' | 'square'
  type?: 'button' | 'submit' | 'reset'
  className?: string
  title?: string
  'aria-label'?: string
  'aria-pressed'?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled = false,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  title,
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
    >
      {children}
    </button>
  )
}
