import type { Cell } from '@games/domain-shared'
import React from 'react'
import styles from './SudokuCell.module.css'

interface SudokuCellProps {
  value: Cell
  isEditable: boolean
  isSelected?: boolean
  isSameNumber?: boolean
  isInvalid?: boolean
  onClick?: () => void
  onChange?: (value: Cell) => void
  onSelect?: () => void
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  value,
  isEditable,
  isSelected = false,
  isSameNumber = false,
  isInvalid = false,
  onClick,
  onChange,
  onSelect,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
      onSelect?.()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value) as Cell
    if (!Number.isNaN(newValue) && newValue >= 0 && newValue <= 9) {
      onChange?.(newValue)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isEditable && onChange) {
      if (e.key >= '1' && e.key <= '9') {
        onChange(Number.parseInt(e.key, 10) as Cell)
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        onChange(0)
      }
    }
  }

  return (
    <div
      className={[
        styles.cell,
        !isEditable && styles.given,
        isSelected && styles.selected,
        isSameNumber && styles.sameNumber,
        isInvalid && styles.invalid,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => {
        onClick?.()
        onSelect?.()
      }}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      {isEditable ? (
        <input
          type="text"
          value={value || ''}
          onChange={handleChange}
          onKeyDown={handleInputKeyDown}
          className={styles.input}
          maxLength={1}
          inputMode="numeric"
        />
      ) : (
        <span className={styles.value}>{value || ''}</span>
      )}
    </div>
  )
}
