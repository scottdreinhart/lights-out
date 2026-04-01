/**
 * Crossclimb Domain Rules
 * Core game logic for graph search puzzle
 */

import type {
  Graph,
  Node,
  Edge,
  NodeId,
  EdgeId,
  Position,
  CrossclimbState,
  Difficulty,
  Path,
} from './types'
import { DIFFICULTY_CONFIGS, CANVAS_PADDING } from './constants'

/**
 * Generate a random position within canvas bounds
 */
export const generateRandomPosition = (
  canvasWidth: number,
  canvasHeight: number,
  existingPositions: Position[],
  minDistance: number = 60
): Position => {
  let attempts = 0
  const maxAttempts = 100

  while (attempts < maxAttempts) {
    const x = CANVAS_PADDING + Math.random() * (canvasWidth - 2 * CANVAS_PADDING)
    const y = CANVAS_PADDING + Math.random() * (canvasHeight - 2 * CANVAS_PADDING)
    const position = { x, y }

    const tooClose = existingPositions.some(existing =>
      Math.sqrt((x - existing.x) ** 2 + (y - existing.y) ** 2) < minDistance
    )

    if (!tooClose) {
      return position
    }
    attempts++
  }

  // Fallback: return a position anyway
  return {
    x: CANVAS_PADDING + Math.random() * (canvasWidth - 2 * CANVAS_PADDING),
    y: CANVAS_PADDING + Math.random() * (canvasHeight - 2 * CANVAS_PADDING),
  }
}

/**
 * Create a random graph for the given difficulty
 */
export const createRandomGraph = (difficulty: Difficulty, canvasWidth: number, canvasHeight: number): Graph => {
  const config = DIFFICULTY_CONFIGS[difficulty]
  const nodes = new Map<NodeId, Node>()
  const edges = new Map<EdgeId, Edge>()
  const positions: Position[] = []

  // Create nodes
  for (let i = 0; i < config.nodeCount; i++) {
    const id = `node-${i}`
    const position = generateRandomPosition(canvasWidth, canvasHeight, positions)
    positions.push(position)

    const nodeType = i === 0 ? 'start' :
                    i === config.nodeCount - 1 ? 'end' :
                    i < config.checkpointCount + 1 ? 'checkpoint' : 'normal'

    nodes.set(id, {
      id,
      position,
      type: nodeType,
      connections: [],
      visited: false,
      required: nodeType === 'checkpoint' || nodeType === 'start' || nodeType === 'end',
    })
  }

  // Create edges based on proximity and density
  const nodeIds = Array.from(nodes.keys())
  for (let i = 0; i < nodeIds.length; i++) {
    for (let j = i + 1; j < nodeIds.length; j++) {
      const nodeA = nodes.get(nodeIds[i])!
      const nodeB = nodes.get(nodeIds[j])!

      const distance = Math.sqrt(
        (nodeA.position.x - nodeB.position.x) ** 2 +
        (nodeA.position.y - nodeB.position.y) ** 2
      )

      // Create edge if nodes are close enough and random chance passes
      if (distance < 150 && Math.random() < config.edgeDensity) {
        const edgeId = `edge-${i}-${j}`
        const weight = Math.floor(Math.random() * config.maxWeight) + 1

        edges.set(edgeId, {
          id: edgeId,
          from: nodeIds[i],
          to: nodeIds[j],
          weight,
          traversable: true,
        })

        // Add connections
        nodeA.connections.push(nodeIds[j])
        nodeB.connections.push(nodeIds[i])
      }
    }
  }

  // Ensure graph is connected (add minimum spanning tree if needed)
  ensureConnectivity(nodes, edges, nodeIds)

  const checkpoints = nodeIds.filter(id => nodes.get(id)!.type === 'checkpoint')

  return {
    nodes,
    edges,
    startNode: 'node-0',
    endNode: `node-${config.nodeCount - 1}`,
    checkpoints,
  }
}

/**
 * Ensure the graph is connected by adding necessary edges
 */
const ensureConnectivity = (
  nodes: Map<NodeId, Node>,
  edges: Map<EdgeId, Edge>,
  nodeIds: NodeId[]
): void => {
  const visited = new Set<NodeId>()
  const toVisit = ['node-0']

  // BFS to find connected components
  while (toVisit.length > 0) {
    const currentId = toVisit.shift()!
    if (visited.has(currentId)) continue

    visited.add(currentId)
    const currentNode = nodes.get(currentId)!

    for (const neighborId of currentNode.connections) {
      if (!visited.has(neighborId)) {
        toVisit.push(neighborId)
      }
    }
  }

  // Connect disconnected components
  for (const nodeId of nodeIds) {
    if (!visited.has(nodeId)) {
      // Find closest connected node
      let closestId: NodeId | null = null
      let minDistance = Infinity

      for (const connectedId of visited) {
        const nodeA = nodes.get(nodeId)!
        const nodeB = nodes.get(connectedId)!
        const distance = Math.sqrt(
          (nodeA.position.x - nodeB.position.x) ** 2 +
          (nodeA.position.y - nodeB.position.y) ** 2
        )

        if (distance < minDistance) {
          minDistance = distance
          closestId = connectedId
        }
      }

      if (closestId) {
        const edgeId = `edge-connect-${nodeId}-${closestId}`
        edges.set(edgeId, {
          id: edgeId,
          from: nodeId,
          to: closestId,
          weight: 1,
          traversable: true,
        })

        nodes.get(nodeId)!.connections.push(closestId)
        nodes.get(closestId)!.connections.push(nodeId)
        visited.add(nodeId)
      }
    }
  }
}

/**
 * Create initial game state
 */
export const createInitialState = (difficulty: Difficulty, canvasWidth: number, canvasHeight: number): CrossclimbState => {
  const graph = createRandomGraph(difficulty, canvasWidth, canvasHeight)

  return {
    graph,
    currentPath: [graph.startNode],
    visitedNodes: new Set([graph.startNode]),
    collectedCheckpoints: new Set(),
    isComplete: false,
    moves: 0,
  }
}

/**
 * Check if a move to a node is valid
 */
export const isValidMove = (fromNodeId: NodeId, toNodeId: NodeId, graph: Graph): boolean => {
  const fromNode = graph.nodes.get(fromNodeId)
  if (!fromNode) return false

  return fromNode.connections.includes(toNodeId)
}

/**
 * Make a move in the game
 */
export const makeMove = (state: CrossclimbState, toNodeId: NodeId): CrossclimbState => {
  if (!isValidMove(state.currentPath[state.currentPath.length - 1], toNodeId, state.graph)) {
    return state
  }

  const newPath = [...state.currentPath, toNodeId]
  const newVisitedNodes = new Set(state.visitedNodes)
  newVisitedNodes.add(toNodeId)

  const targetNode = state.graph.nodes.get(toNodeId)!
  const newCollectedCheckpoints = new Set(state.collectedCheckpoints)

  if (targetNode.type === 'checkpoint') {
    newCollectedCheckpoints.add(toNodeId)
  }

  const isComplete = toNodeId === state.graph.endNode &&
                    state.graph.checkpoints.every(cp => newCollectedCheckpoints.has(cp))

  return {
    ...state,
    currentPath: newPath,
    visitedNodes: newVisitedNodes,
    collectedCheckpoints: newCollectedCheckpoints,
    isComplete,
    moves: state.moves + 1,
  }
}

/**
 * Check if the current path is valid (visits all checkpoints)
 */
export const isValidPath = (path: NodeId[], graph: Graph): boolean => {
  if (path.length < 2) return false
  if (path[0] !== graph.startNode) return false
  if (path[path.length - 1] !== graph.endNode) return false

  // Check all checkpoints are visited
  const visitedCheckpoints = new Set(
    path.filter(nodeId => graph.nodes.get(nodeId)?.type === 'checkpoint')
  )

  return graph.checkpoints.every(cp => visitedCheckpoints.has(cp))
}

/**
 * Calculate path weight
 */
export const calculatePathWeight = (path: NodeId[], graph: Graph): number => {
  let totalWeight = 0

  for (let i = 0; i < path.length - 1; i++) {
    const fromId = path[i]
    const toId = path[i + 1]
    const edgeId = `edge-${fromId}-${toId}`

    // Try both directions
    let edge = graph.edges.get(edgeId)
    if (!edge) {
      edge = graph.edges.get(`edge-${toId}-${fromId}`)
    }

    if (edge) {
      totalWeight += edge.weight
    }
  }

  return totalWeight
}

/**
 * Reset the game state
 */
export const resetGame = (state: CrossclimbState): CrossclimbState => {
  return {
    ...state,
    currentPath: [state.graph.startNode],
    visitedNodes: new Set([state.graph.startNode]),
    collectedCheckpoints: new Set(),
    isComplete: false,
    moves: 0,
  }
}