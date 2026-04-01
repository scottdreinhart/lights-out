import type { Cell, Digit } from '@/domain'
import React from 'react'
import styles from './SudokuCell.module.css'

interface SudokuCellProps {
  value: Cell
  isEditable: boolean
  isSelected?: boolean
  isSameNumber?: boolean
  isInvalid?: boolean
  onSelect?: () => void
  onChange?: (value: Cell) => void
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  value,
  isEditable,
  isSelected = false,
  isSameNumber = false,
  isInvalid = false,
  onSelect,
  onChange,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isEditable && onChange) {
      if (e.key >= '1' && e.key <= '9') {
        onChange(Number.parseInt(e.key, 10) as Digit)
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        onChange(0)
      }
    }
  }

  return (
    <div
      className={`${styles.cellWrapper} ${isSelected ? styles.selected : ''} ${
        isSameNumber ? styles.sameNumber : ''
      } ${isInvalid ? styles.invalid : ''}`}
    >
      <input
        type="text"
        className={`${styles.cell} ${isEditable ? styles.editable : ''}`}
        value={value === 0 ? '' : value}
        onChange={(e) => {
          if (isEditable && onChange && e.target.value) {
            const num = Number.parseInt(e.target.value.slice(-1), 10)
            if (num >= 1 && num <= 9) {
              onChange(num as Digit)
            }
          }
        }}
        onKeyDown={handleKeyDown}
        onFocus={onSelect}
        onClick={onSelect}
        readOnly={!isEditable}
        inputMode="numeric"
        maxLength={1}
      />
    </div>
  )
}
