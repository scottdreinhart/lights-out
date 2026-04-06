import { memo } from 'react'

import type { CellState } from '@/domain'

import { cx } from '@/ui/utils/cssModules'
import styles from './Cell.module.css'

interface CellProps {
  readonly state: CellState
  readonly showShip: boolean
  readonly onClick?: () => void
  readonly disabled?: boolean
  readonly cellDisabled?: boolean
  readonly touchOptimized?: boolean
  readonly blinking?: boolean
  readonly selected?: boolean // Keyboard selection state
  readonly highlighted?: boolean // Hint/suggestion state
}

function CellComponent({
  state,
  showShip,
  onClick,
  disabled,
  cellDisabled,
  touchOptimized,
  blinking,
  selected,
  highlighted,
}: CellProps) {
  // Determine what to display
  let visible = 'empty'
  if (showShip && state === 'ship') {
    visible = 'ship'
  } else if (state === 'playerHit' || state === 'playerMiss') {
    // Always show player's own shots
    visible = state
  } else if (state === 'cpuHit' || state === 'cpuMiss') {
    // Always show CPU's shots
    visible = state
  }

  return (
    <button
      type="button"
      className={cx(
        styles.cell,
        styles[visible],
        blinking && visible === 'ship' && styles.shipBlinking,
        selected && styles.selected,
        highlighted && styles.hint,
        disabled && styles.disabled,
        cellDisabled && styles.cellDisabled,
        touchOptimized && styles.touchOptimized,
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Cell: ${visible}${cellDisabled ? ' (already bombed)' : ''}`}
    />
  )
}

export const Cell = memo(CellComponent)
