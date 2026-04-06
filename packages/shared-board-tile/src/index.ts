/**
 * @games/shared-board-tile
 *
 * Shared grid cell component for board-based games
 *
 * Provides a reusable `<GridCell>` component that works with:
 * - Battleship, Checkers, Bingo, Queens
 * - Sudoku, Magic Square, and other grid-based games
 *
 * Features:
 * - Keyboard selection with cyan highlight
 * - Hint system with gold glow
 * - Flexible content rendering (numbers, pieces, icons, etc.)
 * - Touch optimization
 * - Full accessibility (ARIA labels, semantic HTML)
 * - CSS variable-driven theming
 * - Responsive design (@media queries for hover, reduced motion)
 *
 * @example
 * ```tsx
 * import { GridCell } from '@games/shared-board-tile'
 *
 * // Battleship
 * <GridCell row={0} col={0} content="🚢" onClick={() => fire(0, 0)} />
 *
 * // Bingo
 * <GridCell row={2} col={3} content={42} highlighted={isWinner} />
 *
 * // Queens
 * <GridCell row={1} col={5} content="♛" selected={isSelected} />
 * ```
 */

export { GridCell } from './GridCell'
export type { GridCellProps } from './GridCell'
