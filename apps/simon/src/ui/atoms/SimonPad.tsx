import type { SimonColor } from '@/domain'
import styles from './SimonPad.module.css'

interface SimonPadProps {
  colors: SimonColor[]
  onColorClick: (color: SimonColor) => void
  activeColor: SimonColor | null
  colorValues: Record<SimonColor, string>
  disabled?: boolean
}

export const SimonPad = ({
  colors,
  onColorClick,
  activeColor,
  colorValues,
  disabled = false,
}: SimonPadProps) => {
  return (
    <div className={styles.padContainer} data-color-count={colors.length}>
      {colors.map((color) => (
        <button
          key={color}
          className={`${styles.button} ${activeColor === color ? styles.active : ''} ${
            disabled ? styles.disabled : ''
          }`}
          style={{
            backgroundColor: activeColor === color ? '#ffffff' : getColorValue(color, colorValues),
          }}
          onClick={() => !disabled && onColorClick(color)}
          disabled={disabled}
          aria-label={`Simon button: ${color}`}
        />
      ))}
    </div>
  )
}

function getColorValue(color: SimonColor, colorValues: Record<SimonColor, string>): string {
  switch (color) {
    case 'red':
      return colorValues.red
    case 'green':
      return colorValues.green
    case 'yellow':
      return colorValues.yellow
    case 'blue':
      return colorValues.blue
    case 'orange':
      return colorValues.orange
    case 'purple':
      return colorValues.purple
    case 'cyan':
      return colorValues.cyan
    case 'pink':
      return colorValues.pink
  }
}
