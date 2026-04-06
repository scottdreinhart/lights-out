import type { ReactNode } from 'react'
import styles from './Tile.module.css'

/**
 * Generic tile content that can be customized per game
 * Supports icons, text, numbers, custom renders
 */
export interface TileContent {
  type: 'empty' | 'icon' | 'text' | 'number' | 'custom'
  value?: string | number | ReactNode
  iconName?: string // e.g., 'chess-king', 'checker-red', 'mine'
  imageUrl?: string
  customRender?: () => ReactNode
}

/**
 * TileState represents all interactive states a tile can have
 */
export interface TileState {
  selected?: boolean
  focused?: boolean
  target?: boolean
  highlighted?: boolean
  disabled?: boolean
  locked?: boolean
  error?: boolean
  hint?: boolean
  lastFrom?: boolean
  lastTo?: boolean
}

/**
 * TileProps for the generic tile component
 */
export interface TileProps {
  // Identification
  position: { row: number; col: number }
  role?: string

  // Content
  content?: TileContent
  children?: ReactNode

  // State
  state?: TileState
  isDarkSquare?: boolean
  isPlayable?: boolean

  // Theming
  className?: string
  style?: React.CSSProperties

  // Accessibility
  ariaLabel?: string
  ariaDescribedBy?: string

  // Interaction
  disabled?: boolean
  onClick?: (position: { row: number; col: number }) => void
  onDoubleClick?: (position: { row: number; col: number }) => void
  onKeyDown?: (event: React.KeyboardEvent) => void

  // Responsiveness
  responsive?: {
    touchOptimized?: boolean
    supportsHover?: boolean
    prefersReducedMotion?: boolean
    compactViewport?: boolean
  }
}

/**
 * Generic Tile component for grid-based games
 *
 * Supports:
 * - Any board game (checkers, chess, queens, sudoku, minesweeper, etc.)
 * - Multiple content types (icons, text, numbers, custom renders)
 * - Rich accessibility (ARIA labels, keyboard navigation hints)
 * - Responsive styling (touch optimization, hover states)
 * - Game-specific states (selected, focused, target, locked, etc.)
 *
 * Game-specific styling should be applied via className or dedicated CSS modules
 * Game-specific content rendering should use the content.customRender prop
 *
 * @example
 * // Checkers piece
 * <Tile
 *   position={{ row: 2, col: 3 }}
 *   content={{ type: 'custom', customRender: () => <CheckersPiece /> }}
 *   state={{ selected: true }}
 *   isDarkSquare={true}
 *   ariaLabel="Red checker on row 3, column 4, selected"
 * />
 *
 * @example
 * // Sudoku cell with number
 * <Tile
 *   position={{ row: 0, col: 0 }}
 *   content={{ type: 'number', value: 5 }}
 *   state={{ locked: true }}
 *   ariaLabel="5, fixed clue"
 * />
 *
 * @example
 * // Minesweeper cell with hint
 * <Tile
 *   position={{ row: 1, col: 1 }}
 *   content={{ type: 'number', value: 3 }}
 *   state={{ hint: true }}
 *   ariaLabel="3 mines nearby"
 * />
 */
export function Tile({
  position,
  role = 'gridcell',
  content,
  children,
  state = {},
  isDarkSquare = true,
  isPlayable = true,
  className = '',
  style,
  ariaLabel,
  ariaDescribedBy,
  disabled = state.disabled,
  onClick,
  onDoubleClick,
  onKeyDown,
  responsive = {},
}: TileProps) {
  const handleClick = () => {
    if (!disabled && isPlayable && onClick) {
      onClick(position)
    }
  }

  const handleDoubleClick = () => {
    if (!disabled && isPlayable && onDoubleClick) {
      onDoubleClick(position)
    }
  }

  const renderContent = (): ReactNode => {
    if (children) return children
    if (!content || content.type === 'empty') return null

    switch (content.type) {
      case 'text':
        return content.value
      case 'number':
        return content.value
      case 'icon':
        // Game-specific icon rendering should be handled by caller via customRender
        return content.value
      case 'custom':
        return content.customRender?.()
      default:
        return null
    }
  }

  const getStateClasses = (): string[] => {
    const classes: string[] = []
    if (state.selected) classes.push('tile--selected')
    if (state.focused) classes.push('tile--focused')
    if (state.target) classes.push('tile--target')
    if (state.highlighted) classes.push('tile--highlighted')
    if (state.locked) classes.push('tile--locked')
    if (state.error) classes.push('tile--error')
    if (state.hint) classes.push('tile--hint')
    if (state.lastFrom) classes.push('tile--last-from')
    if (state.lastTo) classes.push('tile--last-to')
    return classes
  }

  const getResponsiveClasses = (): string[] => {
    const classes: string[] = []
    if (responsive.touchOptimized) classes.push('tile--touch-optimized')
    if (responsive.supportsHover) classes.push('tile--hoverable')
    if (responsive.prefersReducedMotion) classes.push('tile--reduced-motion')
    if (responsive.compactViewport) classes.push('tile--compact')
    return classes
  }

  const allClasses = [
    styles.tile, // Foundational: 58px × 58px minimum (marketplace requirement)
    'tile',
    isDarkSquare ? 'tile--dark' : 'tile--light',
    isPlayable ? 'tile--playable' : 'tile--unplayable',
    disabled ? 'tile--disabled' : '',
    className,
    ...getStateClasses(),
    ...getResponsiveClasses(),
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      role={role}
      className={allClasses}
      style={style}
      disabled={disabled || !isPlayable}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={onKeyDown}
    >
      {renderContent()}
    </button>
  )
}

export default Tile
