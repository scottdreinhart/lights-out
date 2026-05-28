import React from 'react'
import styles from './SudokuCell.module.css'

interface SudokuCellProps {
  value: number | null
  isEditable: boolean
  isSelected?: boolean
  isSameNumber?: boolean
  isInvalid?: boolean
  onClick?: () => void
  onSelect?: () => void
  onChange?: (value: number | null) => void
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  value,
  isEditable,
  isSelected = false,
  isSameNumber = false,
  isInvalid = false,
  onClick,
  onSelect,
  onChange,
}) => {
  const className = [
    styles.cellWrapper,
    isSelected && styles.selected,
    isSameNumber && styles.sameNumber,
    isInvalid && styles.invalid,
  ]
    .filter(Boolean)
    .join(' ')

  if (!isEditable) {
    return (
      <button type="button" className={className} onClick={onClick} onFocus={onSelect}>
        <span className={styles.cell}>{value}</span>
      </button>
    )
  }

  return (
    <div className={className}>
      <input
        className={`${styles.cell} ${styles.editable}`}
        value={value ?? ''}
        onClick={onClick}
        onFocus={onSelect}
        onChange={(event) => {
          const nextValue = Number(event.target.value)
          if (Number.isNaN(nextValue) || nextValue < 1 || nextValue > 9) {
            onChange?.(null)
            return
          }
          onChange?.(nextValue)
        }}
        maxLength={1}
        inputMode="numeric"
        pattern="[1-9]"
        aria-label="Editable Sudoku cell"
      />
    </div>
  )
}
