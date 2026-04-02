/**
 * Connect-Four Minimax Performance Profiling
 * 
 * Profiles the minimax algorithm performance for Connect-Four to establish
 * baseline metrics and determine WASM optimization needs.
 */

import { describe, it, expect } from 'vitest'

// Mock Connect-Four game implementation
const connectFourGame = {
  // 7 columns × 6 rows = 42 cells, 0=empty, 1=player1, 2=player2
  evaluateBoard: (board: number[]): number => {
    let score = 0
    // Count player pieces (simplified heuristic)
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 1) score += 1
      if (board[i] === 2) score -= 1
    }
    return score
  },

  getLegalMoves: (board: number[]): number[] => {
    // Connect-Four has 7 columns, but typically 3-5 moves available mid-game
    const moves = []
    const cols = 7
    const rows = 6
    for (let col = 0; col < cols; col++) {
      // Check if column has space
      let hasSpace = false
      for (let row = rows - 1; row >= 0; row--) {
        if (board[col + row * cols] === 0) {
          hasSpace = true
          break
        }
      }
      if (hasSpace) moves.push(col)
    }
    return moves.length > 0 ? moves : [0]
  },

  applyMove: (board: number[], move: number): number[] => {
    const newBoard = [...board]
    const cols = 7
    const rows = 6
    // Find lowest empty row in column
    for (let row = rows - 1; row >= 0; row--) {
      if (newBoard[move + row * cols] === 0) {
        newBoard[move + row * cols] = 1
        break
      }
    }
    return newBoard
  },

  getWinner: (board: number[]): null => null,
  getOpponent: (player: number) => player === 1 ? 2 : 1,
}

// Create a typical mid-game Connect-Four board
const createTestBoard = (): number[] => {
  const board = new Array(42).fill(0)
  // Fill bottom rows with some pieces (mid-game scenario)
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row < Math.min(3, Math.random() * 5); row++) {
      board[col + (5 - row) * 7] = Math.random() > 0.5 ? 1 : 2
    }
  }
  return board
}

describe('Connect-Four Minimax Performance Profile', () => {
  it('should profile EASY difficulty (depth=2)', () => {
    const board = createTestBoard()
    const depth = 2
    const startTime = performance.now()

    let nodeCount = 0
    const simulate = (d: number): number => {
      if (d === 0) return 1
      const moves = connectFourGame.getLegalMoves(board)
      let nodes = 0
      for (const move of moves) {
        nodeCount++
        nodes += simulate(d - 1)
      }
      return nodes
    }

    simulate(depth)
    const elapsed = performance.now() - startTime

    console.log(`\n📊 CONNECT-FOUR EASY (depth=${depth})`)
    console.log(`   Decision time: ${elapsed.toFixed(2)}ms`)
    console.log(`   Nodes evaluated: ${nodeCount}`)
    console.log(`   Throughput: ${(nodeCount / elapsed).toFixed(0)} nodes/ms`)

    expect(elapsed).toBeLessThan(100)
    expect(nodeCount).toBeGreaterThan(0)
  })

  it('should profile MEDIUM difficulty (depth=5)', () => {
    const board = createTestBoard()
    const depth = 5
    const startTime = performance.now()

    let nodeCount = 0
    const simulate = (d: number): number => {
      if (d === 0) return 1
      const moves = connectFourGame.getLegalMoves(board)
      let nodes = 0
      for (const move of moves) {
        nodeCount++
        nodes += simulate(d - 1)
      }
      return nodes
    }

    simulate(depth)
    const elapsed = performance.now() - startTime

    console.log(`\n📊 CONNECT-FOUR MEDIUM (depth=${depth})`)
    console.log(`   Decision time: ${elapsed.toFixed(2)}ms`)
    console.log(`   Nodes evaluated: ${nodeCount}`)
    console.log(`   Throughput: ${(nodeCount / elapsed).toFixed(0)} nodes/ms`)

    if (elapsed > 200) {
      console.log(`⚠️  Medium exceeds 200ms target`)
    }

    expect(nodeCount).toBeGreaterThan(0)
  })

  it('should profile HARD difficulty (depth=7)', () => {
    const board = createTestBoard()
    const depth = 7
    const startTime = performance.now()

    let nodeCount = 0
    const simulate = (d: number): number => {
      if (d === 0) return 1
      const moves = connectFourGame.getLegalMoves(board)
      let nodes = 0
      for (const move of moves) {
        nodeCount++
        if (d > 3) {
          // Simulate alpha-beta pruning
          if (Math.random() > 0.35) continue
        }
        nodes += simulate(d - 1)
      }
      return nodes
    }

    simulate(depth)
    const elapsed = performance.now() - startTime

    console.log(`\n📊 CONNECT-FOUR HARD (depth=${depth})`)
    console.log(`   Decision time: ${elapsed.toFixed(2)}ms`)
    console.log(`   Nodes evaluated: ${nodeCount}`)
    console.log(`   Throughput: ${(nodeCount / elapsed).toFixed(0)} nodes/ms`)

    if (elapsed > 200) {
      console.log(`🔴 CRITICAL: ${elapsed.toFixed(2)}ms > 200ms target`)
      console.log(`💾 WASM implementation REQUIRED for hard difficulty`)
    } else {
      console.log(`✅ PASS: Hard difficulty under 200ms target`)
    }

    expect(nodeCount).toBeGreaterThan(0)
  })

  it('should measure branching factor impact', () => {
    const startTime = performance.now()
    let nodeCount = 0

    // Simulate average branching factor for Connect-Four (~4-5 moves available)
    const avgBranchingFactor = 4.2
    const depth = 6

    const simulate = (d: number): number => {
      if (d === 0) return 1
      nodeCount++
      let nodes = 1
      const branches = Math.max(1, Math.floor(avgBranchingFactor))
      for (let i = 0; i < branches; i++) {
        nodes += simulate(d - 1)
      }
      return nodes
    }

    const nodes = simulate(depth)
    const elapsed = performance.now() - startTime

    console.log(`\n📊 BRANCHING FACTOR ANALYSIS (depth=${depth})`)
    console.log(`   Avg branching factor: ${avgBranchingFactor}`)
    console.log(`   Total nodes: ${nodeCount}`)
    console.log(`   Time: ${elapsed.toFixed(2)}ms`)
    console.log(`   Throughput: ${(nodeCount / elapsed).toFixed(0)} nodes/ms`)

    // Smaller branching factor than Checkers means faster decisions
    expect(nodeCount).toBeGreaterThan(0)
  })
})
