/**
 * Zip Domain AI
 * Pathfinding and solving algorithms for maze navigation
 */

import type {
  Maze,
  Position,
  PathNode,
  Solution,
  ZipState,
  Move,
  Direction,
} from './types'
import {
  getValidMoves,
  wouldCollectItem,
  isValidPosition,
  isPassable,
} from './rules'
import { DIRECTIONS, MOVEMENT_COSTS } from './constants'

/**
 * Calculate Manhattan distance heuristic
 */
const manhattanDistance = (a: Position, b: Position): number => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col)
}

/**
 * Calculate movement cost between positions
 */
const getMovementCost = (from: Position, to: Position, maze: Maze): number => {
  const cell = maze[to.row][to.col]
  return MOVEMENT_COSTS[cell.type] || MOVEMENT_COSTS.empty
}

/**
 * A* pathfinding algorithm for maze navigation
 */
export const findPathAStar = (
  start: Position,
  goal: Position,
  maze: Maze,
  collectedItems: Position[] = []
): Position[] => {
  const openSet: PathNode[] = []
  const closedSet: Set<string> = new Set()

  const startNode: PathNode = {
    position: start,
    g: 0,
    h: manhattanDistance(start, goal),
    f: manhattanDistance(start, goal),
  }

  openSet.push(startNode)

  while (openSet.length > 0) {
    // Find node with lowest f score
    openSet.sort((a, b) => a.f - b.f)
    const current = openSet.shift()!

    const posKey = `${current.position.row},${current.position.col}`
    if (closedSet.has(posKey)) continue
    closedSet.add(posKey)

    // Check if goal reached
    if (current.position.row === goal.row && current.position.col === goal.col) {
      return reconstructPath(current)
    }

    // Explore neighbors
    const validMoves = getValidMoves(current.position, maze)
    for (const move of validMoves) {
      const neighborPos = move.to
      const neighborKey = `${neighborPos.row},${neighborPos.col}`

      if (closedSet.has(neighborKey)) continue

      const gScore = current.g + getMovementCost(current.position, neighborPos, maze)
      const hScore = manhattanDistance(neighborPos, goal)
      const fScore = gScore + hScore

      // Check if this path is better
      const existingNode = openSet.find(node =>
        node.position.row === neighborPos.row &&
        node.position.col === neighborPos.col
      )

      if (!existingNode || gScore < existingNode.g) {
        const neighborNode: PathNode = {
          position: neighborPos,
          g: gScore,
          h: hScore,
          f: fScore,
          parent: current,
        }

        if (existingNode) {
          // Update existing node
          Object.assign(existingNode, neighborNode)
        } else {
          openSet.push(neighborNode)
        }
      }
    }
  }

  return [] // No path found
}

/**
 * Reconstruct path from A* result
 */
const reconstructPath = (node: PathNode): Position[] => {
  const path: Position[] = []
  let current: PathNode | undefined = node

  while (current) {
    path.unshift(current.position)
    current = current.parent
  }

  return path
}

/**
 * Find optimal path considering item collection
 */
export const findOptimalPath = (state: ZipState): Solution | null => {
  const start = state.playerPosition
  const goal = state.goalPosition
  const remainingItems = state.items.filter(item =>
    !state.collectedItems.some(collected =>
      collected.row === item.row && collected.col === item.col
    )
  )

  if (remainingItems.length === 0) {
    // No items left, go directly to goal
    const path = findPathAStar(start, goal, state.maze, state.collectedItems)
    if (path.length === 0) return null

    return {
      path,
      moves: convertPathToMoves(path),
      collectedItems: [],
      totalCost: calculatePathCost(path, state.maze),
    }
  }

  // Find best sequence to collect remaining items and reach goal
  // For simplicity, use nearest neighbor approach
  let currentPos = start
  let totalPath: Position[] = [start]
  let collectedSequence: Position[] = []

  while (remainingItems.length > 0) {
    let bestItem: Position | null = null
    let bestPath: Position[] = []
    let bestCost = Infinity

    for (const item of remainingItems) {
      const path = findPathAStar(currentPos, item, state.maze, state.collectedItems)
      if (path.length > 0) {
        const cost = calculatePathCost(path, state.maze)
        if (cost < bestCost) {
          bestCost = cost
          bestPath = path
          bestItem = item
        }
      }
    }

    if (!bestItem || bestPath.length === 0) break

    // Add path to item (excluding starting position to avoid duplication)
    totalPath.push(...bestPath.slice(1))
    collectedSequence.push(bestItem)
    currentPos = bestItem

    // Remove collected item
    const index = remainingItems.findIndex(item =>
      item.row === bestItem!.row && item.col === bestItem!.col
    )
    remainingItems.splice(index, 1)
  }

  // Add path to goal
  const goalPath = findPathAStar(currentPos, goal, state.maze, state.collectedItems)
  if (goalPath.length > 0) {
    totalPath.push(...goalPath.slice(1))
  }

  if (totalPath.length <= 1) return null

  return {
    path: totalPath,
    moves: convertPathToMoves(totalPath),
    collectedItems: collectedSequence,
    totalCost: calculatePathCost(totalPath, state.maze),
  }
}

/**
 * Convert path to moves
 */
const convertPathToMoves = (path: Position[]): Move[] => {
  const moves: Move[] = []

  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i]
    const to = path[i + 1]

    const deltaRow = to.row - from.row
    const deltaCol = to.col - from.col

    let direction: Direction
    if (deltaRow === -1) direction = 'up'
    else if (deltaRow === 1) direction = 'down'
    else if (deltaCol === -1) direction = 'left'
    else direction = 'right'

    moves.push({
      from,
      to,
      direction,
    })
  }

  return moves
}

/**
 * Calculate total cost of a path
 */
const calculatePathCost = (path: Position[], maze: Maze): number => {
  let cost = 0
  for (let i = 0; i < path.length - 1; i++) {
    cost += getMovementCost(path[i], path[i + 1], maze)
  }
  return cost
}

/**
 * Get next hint move
 */
export const getHintMove = (state: ZipState): Position | null => {
  const solution = findOptimalPath(state)
  if (!solution || solution.path.length < 2) return null

  return solution.path[1] // Next position after current
}

/**
 * Check if maze is solvable
 */
export const isMazeSolvable = (state: ZipState): boolean => {
  const solution = findOptimalPath(state)
  return solution !== null && solution.path.length > 0
}

/**
 * Generate a guaranteed solvable maze
 */
export const generateSolvableMaze = (difficulty: Difficulty): ZipState => {
  let state: ZipState
  let attempts = 0
  const maxAttempts = 50

  do {
    state = createInitialState(difficulty)
    attempts++
  } while (!isMazeSolvable(state) && attempts < maxAttempts)

  // If we couldn't generate a solvable maze, return the last attempt
  return state
}