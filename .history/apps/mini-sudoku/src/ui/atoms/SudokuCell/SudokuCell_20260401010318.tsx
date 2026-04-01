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
  const handleWrapperKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.()
    }
  }

  return (
    <div
      className={`${styles.cellWrapper} ${isSelected ? styles.selected : ''} ${
        isSameNumber ? styles.sameNumber : ''
      } ${isInvalid ? styles.invalid : ''}`}
      onClick={onSelect}
      onKeyDown={handleWrapperKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Cell, ${value === 0 ? 'empty' : `value ${value}`}${isEditable ? ', editable' : ''}${isSelected ? ', selected' : ''}${isInvalid ? ', invalid' : ''}`}
    >
      <input
        type="text"
        className={`${styles.cell} ${isEditable ? styles.editable : ''}`}
        value={value === 0 ? '' : value}
        onChange={(e) => {
          if (isEditable && onChange && e.target.value) {
            const num = parseInt(e.target.value.slice(-1))
            if (num >= 1 && num <= 9) {
              onChange(num as Digit)
            }
          }
        }}
        onKeyDown={handleKeyDown}
        readOnly={!isEditable}
        inputMode="numeric"
        maxLength={1}
      />
    </div>
  )
}
