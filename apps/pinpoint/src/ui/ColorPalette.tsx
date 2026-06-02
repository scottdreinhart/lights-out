import type { Color } from '@/domain'
import { COLOR_DISPLAY_NAMES } from '@/domain'
import React from 'react'
import styles from './ColorPalette.module.css'
import { Peg } from './Peg'

interface ColorPaletteProps {
  availableColors: Color[]
  onColorSelect: (color: Color) => void
  disabled?: boolean
  className?: string
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  availableColors,
  onColorSelect,
  disabled = false,
  className = '',
}) => {
  const handleColorClick = (color: Color) => {
    if (!disabled) {
      onColorSelect(color)
    }
  }

  return (
    <div
      className={`${styles.colorPalette} ${className}`}
      role="toolbar"
      aria-label="Color selection palette"
    >
      {availableColors.map((color) => (
        <Peg
          key={color}
          color={color}
          onClick={() => handleColorClick(color)}
          className={disabled ? styles.disabled : ''}
          ariaLabel={`Select ${COLOR_DISPLAY_NAMES[color]} color`}
        />
      ))}
    </div>
  )
}
