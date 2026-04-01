/**
 * Zip Domain Rules
 * Core game logic for maze navigation and movement
 */

import type {
  Maze,
  Cell,
  Position,
  Direction,
  Move,
  ZipState,
  Difficulty,
  MazeConfig,
} from './types'
import {
  MAZE_CONFIGS,
  DIRECTIONS,
  MOVEMENT_COSTS,
} from './constants'

/**
 * Create an empty maze grid
 */
export const createEmptyMaze = (width: number, height: number): Maze => {
  return Array(height).fill(null).map(() =>
    Array(width).fill(null).map((): Cell => ({ type: 'empty' }))
  )
}

/**
 * Check if a position is within maze bounds
 */
export const isValidPosition = (position: Position, maze: Maze): boolean => {
  return position.row >= 0 &&
         position.row < maze.length &&
         position.col >= 0 &&
         position.col < maze[0].length
}

/**
 * Check if a cell is passable (not a wall)
 */
export const isPassable = (cell: Cell): boolean => {
  return cell.type !== 'wall'
}

/**
 * Get all valid moves from a position
 */
export const getValidMoves = (position: Position, maze: Maze): Move[] => {
  const moves: Move[] = []

  for (const [direction, delta] of Object.entries(DIRECTIONS)) {
    const newPos: Position = {
      row: position.row + delta.row,
      col: position.col + delta.col,
    }

    if (isValidPosition(newPos, maze) && isPassable(maze[newPos.row][newPos.col])) {
      moves.push({
        from: position,
        to: newPos,
        direction: direction as Direction,
      })
    }
  }

  return moves
}

/**
 * Check if moving to a position would collect an item
 */
export const wouldCollectItem = (position: Position, maze: Maze, collectedItems: Position[]): boolean => {
  if (!isValidPosition(position, maze)) return false

  const cell = maze[position.row][position.col]
  if (cell.type !== 'item') return false

  // Check if item hasn't been collected yet
  return !collectedItems.some(item =>
    item.row === position.row && item.col === position.col
  )
}

/**
 * Make a move in the maze
 */
export const makeMove = (
  state: ZipState,
  direction: Direction
): ZipState => {
  const currentPos = state.playerPosition
  const delta = DIRECTIONS[direction]
  const newPos: Position = {
    row: currentPos.row + delta.row,
    col: currentPos.col + delta.col,
  }

  // Check if move is valid
  if (!isValidPosition(newPos, state.maze) ||
      !isPassable(state.maze[newPos.row][newPos.col])) {
    return state // Invalid move, return unchanged state
  }

  const newCollectedItems = [...state.collectedItems]
  const collectedItem = wouldCollectItem(newPos, state.maze, state.collectedItems)

  if (collectedItem) {
    newCollectedItems.push(newPos)
  }

  const move: Move = {
    from: currentPos,
    to: newPos,
    direction,
  }

  const isComplete = newPos.row === state.goalPosition.row &&
                    newPos.col === state.goalPosition.col &&
                    newCollectedItems.length === state.items.length

  return {
    ...state,
    playerPosition: newPos,
    collectedItems: newCollectedItems,
    moves: [...state.moves, move],
    isComplete,
  }
}

/**
 * Check if the maze is solved
 */
export const isMazeSolved = (state: ZipState): boolean => {
  return state.isComplete
}

/**
 * Generate a random maze using recursive backtracking
 */
export const generateMaze = (config: MazeConfig): Maze => {
  const maze = createEmptyMaze(config.width, config.height)

  // Initialize with walls
  for (let row = 0; row < config.height; row++) {
    for (let col = 0; col < config.width; col++) {
      maze[row][col] = { type: 'wall' }
    }
  }

  // Recursive backtracking algorithm
  const stack: Position[] = []
  const start: Position = { row: 1, col: 1 }
  maze[start.row][start.col] = { type: 'empty' }
  stack.push(start)

  while (stack.length > 0) {
    const current = stack[stack.length - 1]
    const neighbors = getUnvisitedNeighbors(current, maze)

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)]
      removeWallBetween(current, next, maze)
      maze[next.row][next.col] = { type: 'empty' }
      stack.push(next)
    } else {
      stack.pop()
    }
  }

  return maze
}

/**
 * Get unvisited neighbors for maze generation
 */
const getUnvisitedNeighbors = (position: Position, maze: Maze): Position[] => {
  const neighbors: Position[] = []
  const directions = [
    { row: 0, col: 2 },  // right
    { row: 2, col: 0 },  // down
    { row: 0, col: -2 }, // left
    { row: -2, col: 0 }, // up
  ]

  for (const dir of directions) {
    const neighbor: Position = {
      row: position.row + dir.row,
      col: position.col + dir.col,
    }

    if (isValidPosition(neighbor, maze) &&
        maze[neighbor.row][neighbor.col].type === 'wall') {
      neighbors.push(neighbor)
    }
  }

  return neighbors
}

/**
 * Remove wall between two cells
 */
const removeWallBetween = (pos1: Position, pos2: Position, maze: Maze): void => {
  const wallPos: Position = {
    row: (pos1.row + pos2.row) / 2,
    col: (pos1.col + pos2.col) / 2,
  }
  maze[wallPos.row][wallPos.col] = { type: 'empty' }
}

/**
 * Place items randomly in the maze
 */
export const placeItems = (maze: Maze, count: number): Position[] => {
  const emptyCells: Position[] = []

  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[0].length; col++) {
      if (maze[row][col].type === 'empty') {
        emptyCells.push({ row, col })
      }
    }
  }

  // Shuffle and select positions
  const shuffled = [...emptyCells].sort(() => Math.random() - 0.5)
  const itemPositions = shuffled.slice(0, Math.min(count, shuffled.length))

  // Place items
  for (const pos of itemPositions) {
    maze[pos.row][pos.col] = { type: 'item' }
  }

  return itemPositions
}

/**
 * Create initial game state
 */
export const createInitialState = (difficulty: Difficulty = 'medium'): ZipState => {
  const config = MAZE_CONFIGS[difficulty]
  const maze = generateMaze(config)
  const items = placeItems(maze, config.itemCount)

  // Find suitable start and goal positions
  const emptyCells = []
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[0].length; col++) {
      if (maze[row][col].type === 'empty') {
        emptyCells.push({ row, col })
      }
    }
  }

  const startPos = emptyCells[0]
  const goalPos = emptyCells[emptyCells.length - 1]

  maze[startPos.row][startPos.col] = { type: 'start' }
  maze[goalPos.row][goalPos.col] = { type: 'goal' }

  return {
    maze,
    playerPosition: startPos,
    startPosition: startPos,
    goalPosition: goalPos,
    items,
    collectedItems: [],
    moves: [],
    isComplete: false,
  }
}

/**
 * Reset game to initial state
 */
export const resetGame = (state: ZipState): ZipState => {
  return {
    ...state,
    playerPosition: state.startPosition,
    collectedItems: [],
    moves: [],
    isComplete: false,
  }
}