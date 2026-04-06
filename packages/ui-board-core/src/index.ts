/**
 * @games/ui-board-core - Shared board UI components and utilities for grid-based games
 *
 * FOUNDATIONAL CONSTRAINT (Marketplace Compliance):
 * All tiles enforce a minimum 58px × 58px size to comply with:
 * - WCAG 2.5.5 Target Size (Level AAA)
 * - Apple App Store guidelines
 * - Google Play Store guidelines
 * - Amazon Appstore requirements
 *
 * This constraint is automatically applied to all Tile components via Tile.module.css.
 * Individual games can increase tile sizes but cannot bypass this minimum.
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

export {
  A11Y_ROLES,
  announcePositionChange,
  buildGridAriaAttributes,
  describePosition,
  describeSquareColor,
  getKeyboardHelpText,
  positionToAlgebraic,
  positionToText,
  positionsEqual,
  type DescribePositionOptions,
} from './accessibility'
export {
  BoardGrid,
  type BoardCell,
  type BoardGridProps,
  type Position as BoardPosition,
} from './BoardGrid'
export {
  BattleshipCellFsm,
  CellStateFsm,
  MinesweeperCellFsm,
  SimpleCellFsm,
  type CellStateFsmConfig,
  type CellStateTransition,
} from './cellStateFsm'
export { Tile, type TileContent, type TileProps, type TileState } from './Tile'
export {
  useKeyboardBoardNavigation,
  type Position,
  type UseKeyboardBoardNavigationOptions,
} from './useKeyboardBoardNavigation'
export { useWasmOptimizedCells, type UseWasmOptimizedCellsOptions } from './useWasmOptimizedCells'
