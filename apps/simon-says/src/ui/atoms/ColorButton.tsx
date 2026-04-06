/**
 * Simon Says: Color Button Atom
 */

import type { Color } from '@/domain'
import styles from './ColorButton.module.css'

interface ColorButtonProps {
  color: Color
  isAnimating: boolean
  isDisabled: boolean
  onClick: () => void
}

const COLOR_MAP: Record<Color, string> = {
  red: '#dc3545',
  green: '#28a745',
  blue: '#007bff',
  yellow: '#ffc107',
}

export function ColorButton({ color, isAnimating, isDisabled, onClick }: ColorButtonProps) {
  return (
    <button
      className={`${styles.button} ${isAnimating ? styles.animating : ''}`}
      style={{
        backgroundColor: COLOR_MAP[color],
        opacity: isAnimating ? 1 : 0.8,
      }}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={`${color} button`}
      type="button"
    />
  )
}
