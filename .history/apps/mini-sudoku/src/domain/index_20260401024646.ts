/**
 * Mini Sudoku Domain Layer Barrel Export
 *
 * Re-exports shared 9×9 Sudoku domain from @games/domain-shared.
 * Mini-sudoku UI and tests expect a grid-based model, which is provided by the shared domain.
 */

// Import and re-export shared Sudoku types and rules
export {
  type Board,
  type Cell,
  type Digit,
  type Difficulty,
  type GameState,
  type Move,
  type GameStatistics,
} from '@games/domain-shared'

// Re-export shared Sudoku constants and rules
export * from '@games/domain-shared'
