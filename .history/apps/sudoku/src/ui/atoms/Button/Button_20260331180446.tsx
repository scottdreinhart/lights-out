import React from 'react'
import styles from './Button.module.css'

interface ButtonProps {
  onClick?: () => void
  children: React.ReactNode
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled = false,
  variant = 'primary',
  size = 'md',
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
