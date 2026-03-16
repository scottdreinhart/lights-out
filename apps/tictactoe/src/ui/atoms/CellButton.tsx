import React from 'react'

import type { CellValue, SwipeDirection } from '../../domain/types.ts'
import { cx } from '../utils/cssModules.ts'
import styles from './CellButton.module.css'
import OMark from './OMark.tsx'
import XMark from './XMark.tsx'

interface CellButtonProps {
  value: CellValue
  disabled: boolean
  isFocused: boolean
  isWinning: boolean
  focusDirection: SwipeDirection | null
  onClick: () => void
  ariaLabel: string
  tabIndex: number
}

const CellButton = React.forwardRef<HTMLButtonElement, CellButtonProps>(
  (
    { value, disabled, isFocused, isWinning, focusDirection, onClick, ariaLabel, tabIndex },
    ref,
  ) => {
    const focusClassName =
      isFocused && focusDirection
        ? styles[`focus${focusDirection.charAt(0).toUpperCase() + focusDirection.slice(1)}`]
        : ''

    return (
      <button
        ref={ref}
        type="button"
        className={cx(
          styles.root,
          value === 'X' && styles.tokenX,
          value === 'O' && styles.tokenO,
          isFocused && styles.focused,
          focusClassName,
          disabled && styles.disabled,
          isWinning && styles.winning,
        )}
        onClick={disabled ? undefined : onClick}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        tabIndex={tabIndex}
      >
        {value === 'X' && <XMark className={cx(styles.mark, styles.markx)} />}
        {value === 'O' && <OMark className={cx(styles.mark, styles.marko)} />}
      </button>
    )
  },
)

CellButton.displayName = 'CellButton'

export default CellButton
