/**
 * Zip Domain Types
 * Type definitions for the Zip maze navigation puzzle
 */

export type CellType = 'empty' | 'wall' | 'start' | 'goal' | 'item' | 'player'

export type Position = {
  row: number
  col: number
}

export type Cell = {
  type: CellType
  collected?: boolean
}

export type Maze = Cell[][]

export type Direction = 'up' | 'down' | 'left' | 'right'

export type Move = {
  from: Position
  to: Position
  direction: Direction
}

export type ZipState = {
  maze: Maze
  playerPosition: Position
  startPosition: Position
  goalPosition: Position
  items: Position[]
  collectedItems: Position[]
  moves: Move[]
  isComplete: boolean
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export type MazeConfig = {
  width: number
  height: number
  itemCount: number
  difficulty: Difficulty
}

export type PathNode = {
  position: Position
  g: number // Cost from start
  h: number // Heuristic to goal
  f: number // Total cost (g + h)
  parent?: PathNode
}

export type Solution = {
  path: Position[]
  moves: Move[]
  collectedItems: Position[]
  totalCost: number
}