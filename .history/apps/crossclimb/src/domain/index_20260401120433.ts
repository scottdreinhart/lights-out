/**
 * Crossclimb Domain Layer
 * Graph search puzzle game logic
 */

export type {
  NodeId,
  EdgeId,
  Position,
  Node,
  Edge,
  Graph,
  Path,
  CrossclimbState,
  Difficulty,
  DifficultyConfig,
  SearchResult,
} from './types'

export {
  DIFFICULTY_CONFIGS,
  NODE_COLORS,
  EDGE_COLORS,
  NODE_RADIUS,
  EDGE_WIDTH,
  CANVAS_PADDING,
  ANIMATION_DURATION,
  PATH_HIGHLIGHT_DURATION,
} from './constants'

export {
  createRandomGraph,
  createInitialState,
  isValidMove,
  makeMove,
  isValidPath,
  calculatePathWeight,
  resetGame,
} from './rules'

export {
  findPathBFS,
  findPathDFS,
  findPathAStar,
  getHintMove,
  isGraphSolvable,
} from './ai'