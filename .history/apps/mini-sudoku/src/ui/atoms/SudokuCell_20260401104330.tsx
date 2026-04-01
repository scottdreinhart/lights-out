/**
 * SudokuCell Atom Component
 * Single cell in the 9×9 board
 */

import React from 'react'
import type { Cell } from '@/domain'
import styles from './SudokuCell.module.css'

interface SudokuCellProps {
  value: Cell
  isEditable: boolean
  isSelected: boolean
  onClick: () => void
  onChange: (value: Cell) => void
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  value,
  isEditable,
  isSelected,
  onClick,
  onChange,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) as Cell
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 9) {
      onChange(newValue)
    }
  }

  return (
    <div
      className={[
        styles.cell,
        !isEditable && styles.given,
        isSelected && styles.selected,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      {isEditable ? (
        <input
          type="text"
          value={value || ''}
          onChange={handleChange}
          className={styles.input}
          maxLength={1}
        />
      ) : (
        <span className={styles.value}>{value || ''}</span>
      )}
    </div>
  )
}
      aria-label={`Cell ${cellId}, ${value ? `value ${value}` : 'empty'}${isGiven ? ', given' : ''}${isSelected ? ', selected' : ''}${hasConflict ? ', has conflict' : ''}`}
    >
      {value && <div className={styles.value}>{value}</div>}
      {!value && candidates.size > 0 && (
        <div className={styles.candidates}>
          {Array.from(candidates).map(v => (
            <span key={v} className={styles.candidate}>
              {v}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
