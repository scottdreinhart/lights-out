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
  type Difficulty,
  type Digit,
  type GameState,
  type GameStatistics,
  type Move,
} from '@games/domain-shared'

// Re-export shared Sudoku constants and rules
export * from '@games/domain-shared'
