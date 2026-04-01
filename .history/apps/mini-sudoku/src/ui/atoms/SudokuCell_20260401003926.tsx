/**
 * SudokuCell Atom Component
 * Single cell in the 4×4 board
 */

import React from 'react'
import styles from './SudokuCell.module.css'

interface SudokuCellProps {
  cellId: string
  value: string
  isGiven: boolean
  candidates: Set<string>
  isSelected: boolean
  hasConflict: boolean
  onSelect: (cellId: string) => void
  onValueChange: (cellId: string, value: string) => void
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  cellId,
  value,
  isGiven,
  candidates,
  isSelected,
  hasConflict,
  onSelect,
  onValueChange,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(cellId)
    }
  }

  return (
    <div
      className={[
        styles.cell,
        isGiven && styles.given,
        isSelected && styles.selected,
        hasConflict && styles.conflict,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => onSelect(cellId)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
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
