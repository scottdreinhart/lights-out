/**
 * Crossclimb Domain Layer
 * Graph search puzzle game logic
 */

export type {
  CrossclimbState,
  Difficulty,
  DifficultyConfig,
  Edge,
  EdgeId,
  Graph,
  Node,
  NodeId,
  Path,
  Position,
  SearchResult,
} from './types'

export {
  ANIMATION_DURATION,
  CANVAS_PADDING,
  DIFFICULTY_CONFIGS,
  EDGE_COLORS,
  EDGE_WIDTH,
  NODE_COLORS,
  NODE_RADIUS,
  PATH_HIGHLIGHT_DURATION,
} from './constants'

export {
  calculatePathWeight,
  createInitialState,
  createRandomGraph,
  isValidMove,
  isValidPath,
  makeMove,
  resetGame,
} from './rules'

export { findPathAStar, findPathBFS, findPathDFS, getHintMove, isGraphSolvable } from './ai'
