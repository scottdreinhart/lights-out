import React from 'react'
import type { Color } from '@/domain'
import { Peg } from './Peg'
import { COLOR_DISPLAY_NAMES } from '@/domain'
import styles from './ColorPalette.module.css'

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
  className = ''
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