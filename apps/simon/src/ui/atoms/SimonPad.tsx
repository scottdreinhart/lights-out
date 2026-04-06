import type { SimonColor } from '@/domain'
import styles from './SimonPad.module.css'

interface SimonPadProps {
  colors: SimonColor[]
  onColorClick: (color: SimonColor) => void
  activeColor: SimonColor | null
  colorValues: Record<SimonColor, string>
  disabled?: boolean
}

export function SimonPad({
  colors,
  onColorClick,
  activeColor,
  colorValues,
  disabled = false,
}: SimonPadProps) {
  return (
    <div className={styles.padContainer} data-color-count={colors.length}>
      {colors.map((color) => (
        <button
          key={color}
          className={`${styles.button} ${activeColor === color ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
          style={{
            backgroundColor: colorValues[color],
          }}
          onClick={() => !disabled && onColorClick(color)}
          disabled={disabled}
          aria-label={`Simon button: ${color}`}
        />
      ))}
    </div>
  )
}
