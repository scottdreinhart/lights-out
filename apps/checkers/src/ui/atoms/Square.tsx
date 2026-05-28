import { memo } from 'react'

import { cx } from '@/ui/utils/cssModules'
import styles from './Square.module.css'

interface SquareProps {
  readonly piece?: 'red' | 'black' | null // null = empty
  readonly isKing?: boolean
  readonly selected?: boolean // Keyboard selection state
  readonly highlighted?: boolean // Hint/suggestion state
  readonly disabled?: boolean
  readonly onClick?: () => void
}

function SquareComponent({ piece, isKing, selected, highlighted, disabled, onClick }: SquareProps) {
  // Determine piece display
  let pieceDisplay = ''
  if (piece === 'red') {
    pieceDisplay = isKing ? '♛' : '●'
  } else if (piece === 'black') {
    pieceDisplay = isKing ? '♚' : '●'
  }

  return (
    <button
      type="button"
      className={cx(
        styles.square,
        piece && styles[piece],
        isKing && styles.king,
        selected && styles.selected,
        highlighted && styles.hint,
        disabled && styles.disabled,
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Square with ${piece ? `${piece}${isKing ? ' king' : ''}` : 'no'} piece`}
    >
      {pieceDisplay}
    </button>
  )
}

export const Square = memo(SquareComponent)
