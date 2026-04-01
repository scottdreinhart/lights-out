/**
 * Crossclimb AI Algorithms
 * Graph search algorithms for pathfinding
 */

import { MAX_SEARCH_DEPTH, SEARCH_TIMEOUT } from './constants'
import { calculatePathWeight, isValidPath } from './rules'
import type { Graph, NodeId, Path, SearchResult } from './types'

/**
 * Breadth-First Search for finding any valid path
 */
export const findPathBFS = (graph: Graph): SearchResult => {
  const startTime = Date.now()
  const startNode = graph.startNode
  const endNode = graph.endNode

  const queue: Array<{ path: NodeId[]; visited: Set<NodeId> }> = [
    { path: [startNode], visited: new Set([startNode]) },
  ]

  let bestPath: Path | null = null
  let minWeight = Infinity

  while (queue.length > 0 && Date.now() - startTime < SEARCH_TIMEOUT) {
    const { path, visited } = queue.shift()!
    const currentNodeId = path[path.length - 1]

    // Check if we reached the end with all checkpoints
    if (currentNodeId === endNode && isValidPath(path, graph)) {
      const weight = calculatePathWeight(path, graph)
      if (weight < minWeight) {
        minWeight = weight
        bestPath = {
          nodes: path,
          edges: [], // Will be filled below
          totalWeight: weight,
          valid: true,
        }
      }
      continue // Continue searching for potentially better paths
    }

    // Prevent infinite loops
    if (path.length > MAX_SEARCH_DEPTH) continue

    const currentNode = graph.nodes.get(currentNodeId)!
    for (const neighborId of currentNode.connections) {
      if (!visited.has(neighborId)) {
        const newPath = [...path, neighborId]
        const newVisited = new Set([...visited, neighborId])
        queue.push({ path: newPath, visited: newVisited })
      }
    }
  }

  if (bestPath) {
    bestPath.edges = generateEdgeList(bestPath.nodes, graph)
  }

  return {
    path: bestPath,
    visited: new Set(),
    cost: bestPath?.totalWeight || 0,
    found: bestPath !== null,
  }
}

/**
 * Depth-First Search with backtracking
 */
export const findPathDFS = (graph: Graph): SearchResult => {
  const startTime = Date.now()
  const startNode = graph.startNode
  const endNode = graph.endNode

  let bestPath: Path | null = null
  let minWeight = Infinity

  const dfs = (currentPath: NodeId[], visited: Set<NodeId>): void => {
    if (Date.now() - startTime > SEARCH_TIMEOUT) return
    if (currentPath.length > MAX_SEARCH_DEPTH) return

    const currentNodeId = currentPath[currentPath.length - 1]

    // Check if we found a valid path
    if (currentNodeId === endNode && isValidPath(currentPath, graph)) {
      const weight = calculatePathWeight(currentPath, graph)
      if (weight < minWeight) {
        minWeight = weight
        bestPath = {
          nodes: [...currentPath],
          edges: [],
          totalWeight: weight,
          valid: true,
        }
      }
      return
    }

    const currentNode = graph.nodes.get(currentNodeId)!
    for (const neighborId of currentNode.connections) {
      if (!visited.has(neighborId)) {
        currentPath.push(neighborId)
        visited.add(neighborId)
        dfs(currentPath, visited)
        currentPath.pop()
        visited.delete(neighborId)
      }
    }
  }

  dfs([startNode], new Set([startNode]))

  if (bestPath) {
    bestPath.edges = generateEdgeList(bestPath.nodes, graph)
  }

  return {
    path: bestPath,
    visited: new Set(),
    cost: bestPath?.totalWeight || 0,
    found: bestPath !== null,
  }
}

/**
 * A* Search with heuristic for optimal pathfinding
 */
export const findPathAStar = (graph: Graph): SearchResult => {
  const startTime = Date.now()
  const startNode = graph.startNode
  const endNode = graph.endNode

  const openSet = new Set([startNode])
  const cameFrom = new Map<NodeId, NodeId>()
  const gScore = new Map<NodeId, number>()
  const fScore = new Map<NodeId, number>()

  // Initialize scores
  gScore.set(startNode, 0)
  fScore.set(startNode, heuristic(startNode, graph))

  while (openSet.size > 0 && Date.now() - startTime < SEARCH_TIMEOUT) {
    // Find node with lowest fScore
    let current: NodeId | null = null
    let lowestFScore = Infinity

    for (const nodeId of openSet) {
      const score = fScore.get(nodeId) || Infinity
      if (score < lowestFScore) {
        lowestFScore = score
        current = nodeId
      }
    }

    if (!current) break

    if (current === endNode) {
      // Reconstruct path
      const path = reconstructPath(cameFrom, current)
      if (isValidPath(path, graph)) {
        const totalWeight = calculatePathWeight(path, graph)
        return {
          path: {
            nodes: path,
            edges: generateEdgeList(path, graph),
            totalWeight,
            valid: true,
          },
          visited: new Set(cameFrom.keys()),
          cost: totalWeight,
          found: true,
        }
      }
    }

    openSet.delete(current)
    const currentNode = graph.nodes.get(current)!

    for (const neighborId of currentNode.connections) {
      // Find edge weight
      let edgeWeight = 1
      const edgeId1 = `edge-${current}-${neighborId}`
      const edgeId2 = `edge-${neighborId}-${current}`
      const edge = graph.edges.get(edgeId1) || graph.edges.get(edgeId2)
      if (edge) {
        edgeWeight = edge.weight
      }

      const tentativeGScore = (gScore.get(current) || 0) + edgeWeight

      if (tentativeGScore < (gScore.get(neighborId) || Infinity)) {
        cameFrom.set(neighborId, current)
        gScore.set(neighborId, tentativeGScore)
        fScore.set(neighborId, tentativeGScore + heuristic(neighborId, graph))

        if (!openSet.has(neighborId)) {
          openSet.add(neighborId)
        }
      }
    }
  }

  return {
    path: null,
    visited: new Set(cameFrom.keys()),
    cost: 0,
    found: false,
  }
}

/**
 * Heuristic function for A* (Manhattan distance + checkpoint penalty)
 */
const heuristic = (nodeId: NodeId, graph: Graph): number => {
  const node = graph.nodes.get(nodeId)!
  const endNode = graph.nodes.get(graph.endNode)!

  // Basic distance
  const distance =
    Math.abs(node.position.x - endNode.position.x) + Math.abs(node.position.y - endNode.position.y)

  // Penalty for unvisited checkpoints
  const unvisitedCheckpoints = graph.checkpoints.filter(
    (cp) => !graph.nodes.get(cp)?.visited,
  ).length

  return distance + unvisitedCheckpoints * 50
}

/**
 * Reconstruct path from A* cameFrom map
 */
const reconstructPath = (cameFrom: Map<NodeId, NodeId>, current: NodeId): NodeId[] => {
  const path = [current]
  while (cameFrom.has(current)) {
    current = cameFrom.get(current)!
    path.unshift(current)
  }
  return path
}

/**
 * Generate edge list from node path
 */
const generateEdgeList = (nodes: NodeId[], graph: Graph): string[] => {
  const edges: string[] = []

  for (let i = 0; i < nodes.length - 1; i++) {
    const fromId = nodes[i]
    const toId = nodes[i + 1]
    const edgeId1 = `edge-${fromId}-${toId}`
    const edgeId2 = `edge-${toId}-${fromId}`

    const edge = graph.edges.get(edgeId1) || graph.edges.get(edgeId2)
    if (edge) {
      edges.push(edge.id)
    }
  }

  return edges
}

/**
 * Get hint for next move (simplified A* for immediate next step)
 */
export const getHintMove = (currentPath: NodeId[], graph: Graph): NodeId | null => {
  const currentNodeId = currentPath[currentPath.length - 1]
  const currentNode = graph.nodes.get(currentNodeId)!

  let bestNeighbor: NodeId | null = null
  let bestScore = Infinity

  for (const neighborId of currentNode.connections) {
    if (currentPath.includes(neighborId)) continue // Avoid cycles

    const neighbor = graph.nodes.get(neighborId)!
    const distance =
      Math.abs(neighbor.position.x - graph.nodes.get(graph.endNode)!.position.x) +
      Math.abs(neighbor.position.y - graph.nodes.get(graph.endNode)!.position.y)

    // Prefer checkpoints
    const checkpointBonus = neighbor.type === 'checkpoint' ? -20 : 0

    const score = distance + checkpointBonus

    if (score < bestScore) {
      bestScore = score
      bestNeighbor = neighborId
    }
  }

  return bestNeighbor
}

/**
 * Check if graph is solvable
 */
export const isGraphSolvable = (graph: Graph): boolean => {
  const result = findPathBFS(graph)
  return result.found
}
