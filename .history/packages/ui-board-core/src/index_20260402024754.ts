/**
 * @games/ui-board-core - Shared board UI components and utilities for grid-based games
 *
 * Provides:
 * - Generic Tile component (for any game piece/content)
 * - Generic BoardGrid component (configurable rectangular grids)
 * - useKeyboardBoardNavigation hook (arrow/WASD navigation)
 * - Accessibility helpers (descriptions, ARIA attributes, announcements)
 *
 * Supports all board-based games:
 * - Checkers, Tic-Tac-Toe, Connect-Four, Queens, Minesweeper, Reversi, Battleship, Pinpoint
 *
 * @example
 * import { BoardGrid, Tile, useKeyboardBoardNavigation } from '@games/ui-board-core'
 * import { describePosition, getKeyboardHelpText } from '@games/ui-board-core/accessibility'
 */

export { BoardGrid, type BoardGridProps, type BoardCell, type Position as BoardPosition } from './BoardGrid'
export { Tile, type TileProps, type TileState, type TileContent } from './Tile'
export {
  useKeyboardBoardNavigation,
  type UseKeyboardBoardNavigationOptions,
  type Position,
} from './useKeyboardBoardNavigation'
export {
  describePosition,
  describeSquareColor,
  positionToText,
  positionToAlgebraic,
  getKeyboardHelpText,
  announcePositionChange,
  buildGridAriaAttributes,
  positionsEqual,
  A11Y_ROLES,
  type DescribePositionOptions,
} from './accessibility'
