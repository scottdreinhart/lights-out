/**
 * Zip Domain Layer
 * Public API for Zip maze navigation logic
 */

export type {
  Cell,
  CellType,
  Difficulty,
  Direction,
  Maze,
  MazeConfig,
  Move,
  PathNode,
  Position,
  Solution,
  ZipState,
} from './types'

export {
  CELL_COLORS,
  CELL_SYMBOLS,
  DEFAULT_DIFFICULTY,
  DIRECTIONS,
  ITEM_COUNTS,
  MAZE_CONFIGS,
  MAZE_SIZES,
  MOVEMENT_COSTS,
  getDirectionDelta,
} from './constants'

export {
  createEmptyMaze,
  createInitialState,
  generateMaze,
  getValidMoves,
  isMazeSolved,
  isPassable,
  isValidPosition,
  makeMove,
  placeItems,
  resetGame,
  wouldCollectItem,
} from './rules'

export {
  findOptimalPath,
  findPathAStar,
  generateSolvableMaze,
  getHintMove,
  isMazeSolvable,
} from './ai'
