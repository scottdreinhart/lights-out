/**
 * Zip Domain Layer
 * Public API for Zip maze navigation logic
 */

export type {
  CellType,
  Position,
  Cell,
  Maze,
  Direction,
  Move,
  ZipState,
  Difficulty,
  MazeConfig,
  PathNode,
  Solution,
} from './types'

export {
  MAZE_SIZES,
  ITEM_COUNTS,
  MAZE_CONFIGS,
  DIRECTIONS,
  CELL_COLORS,
  CELL_SYMBOLS,
  MOVEMENT_COSTS,
  DEFAULT_DIFFICULTY,
} from './constants'

export {
  createEmptyMaze,
  isValidPosition,
  isPassable,
  getValidMoves,
  wouldCollectItem,
  makeMove,
  isMazeSolved,
  generateMaze,
  placeItems,
  createInitialState,
  resetGame,
} from './rules'

export {
  findPathAStar,
  findOptimalPath,
  getHintMove,
  isMazeSolvable,
  generateSolvableMaze,
} from './ai'