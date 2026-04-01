import { beforeEach, describe, expect, it } from 'vitest'
import {
  calculatePathWeight,
  createInitialState,
  createRandomGraph,
  isValidMove,
  isValidPath,
} from '../domain'

describe('Crossclimb Game Logic', () => {
  let graph: ReturnType<typeof createRandomGraph>
  let initialState: ReturnType<typeof createInitialState>

  beforeEach(() => {
    graph = createRandomGraph('easy')
    initialState = createInitialState(graph, 'easy')
  })

  describe('Graph Generation', () => {
    it('should create a valid graph with nodes and edges', () => {
      expect(graph.nodes).toBeDefined()
      expect(graph.edges).toBeDefined()
      expect(Object.keys(graph.nodes).length).toBeGreaterThan(0)
      expect(Object.keys(graph.edges).length).toBeGreaterThan(0)
    })

    it('should have a start and end node', () => {
      const nodes = Object.values(graph.nodes)
      const startNode = nodes.find((node) => node.type === 'start')
      const endNode = nodes.find((node) => node.type === 'end')

      expect(startNode).toBeDefined()
      expect(endNode).toBeDefined()
    })

    it('should have at least one checkpoint', () => {
      const checkpoints = Object.values(graph.nodes).filter((node) => node.isCheckpoint)
      expect(checkpoints.length).toBeGreaterThan(0)
    })
  })

  describe('Game State', () => {
    it('should initialize with start node in path', () => {
      const startNode = Object.values(graph.nodes).find((node) => node.type === 'start')!
      expect(initialState.currentPath).toContain(startNode.id)
    })

    it('should have empty hint and solution paths initially', () => {
      expect(initialState.hintPath).toEqual([])
      expect(initialState.solutionPath).toEqual([])
    })
  })

  describe('Move Validation', () => {
    it('should allow valid moves to adjacent nodes', () => {
      const startNode = Object.values(graph.nodes).find((node) => node.type === 'start')!
      const adjacentNodes = Object.values(graph.edges)
        .filter((edge) => edge.from === startNode.id || edge.to === startNode.id)
        .map((edge) => (edge.from === startNode.id ? edge.to : edge.from))

      if (adjacentNodes.length > 0) {
        const adjacentNodeId = adjacentNodes[0]
        expect(isValidMove(graph, initialState.currentPath, adjacentNodeId)).toBe(true)
      }
    })

    it('should reject moves to non-adjacent nodes', () => {
      const allNodeIds = Object.keys(graph.nodes)
      const currentNodeId = initialState.currentPath[initialState.currentPath.length - 1]

      // Find a non-adjacent node
      const nonAdjacentNodeId = allNodeIds.find((nodeId) => {
        if (nodeId === currentNodeId) return false
        const isAdjacent = Object.values(graph.edges).some(
          (edge) =>
            (edge.from === currentNodeId && edge.to === nodeId) ||
            (edge.from === nodeId && edge.to === currentNodeId),
        )
        return !isAdjacent
      })

      if (nonAdjacentNodeId) {
        expect(isValidMove(graph, initialState.currentPath, nonAdjacentNodeId)).toBe(false)
      }
    })
  })

  describe('Path Validation', () => {
    it('should validate complete paths from start to end', () => {
      const startNode = Object.values(graph.nodes).find((node) => node.type === 'start')!
      const endNode = Object.values(graph.nodes).find((node) => node.type === 'end')!

      // Create a simple path from start to end
      const path = [startNode.id, endNode.id]

      // Check if there's a direct edge
      const hasDirectEdge = Object.values(graph.edges).some(
        (edge) =>
          (edge.from === startNode.id && edge.to === endNode.id) ||
          (edge.from === endNode.id && edge.to === startNode.id),
      )

      if (hasDirectEdge) {
        expect(isValidPath(graph, path)).toBe(true)
      }
    })

    it('should calculate correct path weights', () => {
      const startNode = Object.values(graph.nodes).find((node) => node.type === 'start')!
      const path = [startNode.id]

      expect(calculatePathWeight(graph, path)).toBe(0)
    })
  })
})
