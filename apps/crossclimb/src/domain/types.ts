/**
 * Crossclimb Domain Types
 * Graph search puzzle game types and interfaces
 */

export type NodeId = string
export type EdgeId = string

export interface Position {
  x: number
  y: number
}

export interface Node {
  id: NodeId
  position: Position
  type: 'start' | 'end' | 'normal' | 'checkpoint'
  connections: NodeId[]
  visited: boolean
  required: boolean
}

export interface Edge {
  id: EdgeId
  from: NodeId
  to: NodeId
  weight: number
  traversable: boolean
}

export interface Graph {
  nodes: Map<NodeId, Node>
  edges: Map<EdgeId, Edge>
  startNode: NodeId
  endNode: NodeId
  checkpoints: NodeId[]
}

export interface Path {
  nodes: NodeId[]
  edges: EdgeId[]
  totalWeight: number
  valid: boolean
}

export interface CrossclimbState {
  graph: Graph
  currentPath: NodeId[]
  visitedNodes: Set<NodeId>
  collectedCheckpoints: Set<NodeId>
  isComplete: boolean
  moves: number
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export interface DifficultyConfig {
  nodeCount: number
  edgeDensity: number
  checkpointCount: number
  maxWeight: number
}

export interface SearchResult {
  path: Path | null
  visited: Set<NodeId>
  cost: number
  found: boolean
}