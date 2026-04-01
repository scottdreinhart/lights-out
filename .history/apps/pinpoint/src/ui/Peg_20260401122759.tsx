import React from 'react'
import type { Color } from '@/domain'
import { COLOR_HEX_CODES, PEG_SIZE } from '@/domain'
import styles from './Peg.module.css'

interface PegProps {
  color: Color | null
  size?: number
  onClick?: () => void
  className?: string
  ariaLabel?: string
}

export const Peg: React.FC<PegProps> = ({
  color,
  size = PEG_SIZE,
  onClick,
  className = '',
  ariaLabel
}) => {
  const backgroundColor = color ? COLOR_HEX_CODES[color] : 'transparent'
  const border = color ? 'none' : '2px solid #ccc'

  return (
    <div
      className={`${styles.peg} ${onClick ? styles.clickable : ''} ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor,
        border,
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    />
  )
}