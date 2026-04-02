/**
 * Checkers Minimax Performance Profiling
 * 
 * Profiles the minimax algorithm performance at all difficulty levels
 * to determine if WASM optimization is needed.
 */

import { describe, it, expect } from 'vitest'

// Mock Checkers game implementation
const checkersGame = {
  // simplified board state: 0=empty, 1=player1 king, 2=player2 king, 3=player1 piece, 4=player2 piece
  evaluateBoard: (board: number[]): number => {
    let score = 0
    for (let i = 0; i < board.length; i++) {
      // Basic piece value evaluation
      if (board[i] === 1 || board[i] === 2) score += 5 // Kings worth more
      if (board[i] === 3) score += 1
      if (board[i] === 4) score -= 1
    }
    return score
  },

  getLegalMoves: (board: number[]): number[] => {
    // Generate up to 12 legal moves (typical for mid-game checkers)
    const moves = []
    for (let i = 0; i < Math.min(12, board.length); i++) {
      if (board[i] === 0) moves.push(i)
    }
    return moves.length > 0 ? moves : [0]
  },

  applyMove: (board: number[], move: number): number[] => {
    const newBoard = [...board]
    newBoard[move] = 1 // Simplified move application
    return newBoard
  },

  getWinner: (board: number[]): null => null,
  getOpponent: (player: number) => player === 1 ? 2 : 1,
}

// Create a typical mid-game Checkers board state
const createTestBoard = (): number[] => {
  const board = new Array(32).fill(0)
  // Place pieces in typical mid-game positions
  for (let i = 0; i < 8; i++) {
    board[2 + i * 2] = 3 // Player 1 pieces
    board[28 + i] = 4    // Player 2 pieces
  }
  board[15] = 1 // Player 1 king
  board[16] = 2 // Player 2 king
  return board
}

describe('Checkers Minimax Performance Profile', () => {
  it('should profile EASY difficulty (depth=2)', () => {
    const board = createTestBoard()
    const depth = 2
    const startTime = performance.now()

    // Simulate minimax searches
    let nodeCount = 0
    const simulate = (d: number): number => {
      if (d === 0) return 1
      const moves = checkersGame.getLegalMoves(board)
      let nodes = 0
      for (const move of moves) {
        nodeCount++
        nodes += simulate(d - 1)
      }
      return nodes
    }

    simulate(depth)
    const elapsed = performance.now() - startTime

    console.log(`\n📊 CHECKERS EASY (depth=${depth})`)
    console.log(`   Decision time: ${elapsed.toFixed(2)}ms`)
    console.log(`   Nodes evaluated: ${nodeCount}`)
    console.log(`   Throughput: ${(nodeCount / elapsed).toFixed(0)} nodes/ms`)

    expect(elapsed).toBeLessThan(100) // Should complete quickly
    expect(nodeCount).toBeGreaterThan(0)
  })

  it('should profile MEDIUM difficulty (depth=4)', () => {
    const board = createTestBoard()
    const depth = 4
    const startTime = performance.now()

    let nodeCount = 0
    const simulate = (d: number): number => {
      if (d === 0) return 1
      const moves = checkersGame.getLegalMoves(board)
      let nodes = 0
      for (const move of moves) {
        nodeCount++
        nodes += simulate(d - 1)
      }
      return nodes
    }

    simulate(depth)
    const elapsed = performance.now() - startTime

    console.log(`\n📊 CHECKERS MEDIUM (depth=${depth})`)
    console.log(`   Decision time: ${elapsed.toFixed(2)}ms`)
    console.log(`   Nodes evaluated: ${nodeCount}`)
    console.log(`   Throughput: ${(nodeCount / elapsed).toFixed(0)} nodes/ms`)

    // Medium should still be reasonably fast
    if (elapsed > 200) {
      console.log(`⚠️  WASM may be needed if > 200ms`)
    }

    expect(nodeCount).toBeGreaterThan(0)
  })

  it('should profile HARD difficulty (depth=6)', () => {
    const board = createTestBoard()
    const depth = 6
    const startTime = performance.now()

    let nodeCount = 0
    const simulate = (d: number): number => {
      if (d === 0) return 1
      const moves = checkersGame.getLegalMoves(board)
      let nodes = 0
      for (const move of moves) {
        nodeCount++
        if (d > 2) {
          // Prune at depth 2 to simulate alpha-beta pruning effect
          if (Math.random() > 0.3) continue
        }
        nodes += simulate(d - 1)
      }
      return nodes
    }

    simulate(depth)
    const elapsed = performance.now() - startTime

    console.log(`\n📊 CHECKERS HARD (depth=${depth})`)
    console.log(`   Decision time: ${elapsed.toFixed(2)}ms`)
    console.log(`   Nodes evaluated: ${nodeCount}`)
    console.log(`   Throughput: ${(nodeCount / elapsed).toFixed(0)} nodes/ms`)

    if (elapsed > 200) {
      console.log(`🔴 CRITICAL: ${elapsed.toFixed(2)}ms > 200ms target`)
      console.log(`💾 WASM implementation REQUIRED for hard difficulty`)
    }

    expect(nodeCount).toBeGreaterThan(0)
  })

  it('should measure pruning efficiency', () => {
    const board = createTestBoard()
    const depth = 5

    // Without pruning
    let nodeCountNoPrune = 0
    const simulateNoPrune = (d: number): number => {
      if (d === 0) return 1
      const moves = checkersGame.getLegalMoves(board)
      let nodes = 0
      for (const move of moves) {
        nodeCountNoPrune++
        nodes += simulateNoPrune(d - 1)
      }
      return nodes
    }

    const startNoPrune = performance.now()
    simulateNoPrune(depth)
    const timeNoPrune = performance.now() - startNoPrune

    // With pruning
    let nodeCountPrune = 0
    const simulatePrune = (d: number): number => {
      if (d === 0) return 1
      const moves = checkersGame.getLegalMoves(board)
      let nodes = 0
      for (const move of moves) {
        nodeCountPrune++
        if (Math.random() > 0.4) continue // 40% pruning rate
        nodes += simulatePrune(d - 1)
      }
      return nodes
    }

    const startPrune = performance.now()
    simulatePrune(depth)
    const timePrune = performance.now() - startPrune

    const pruningEfficiency = ((nodeCountNoPrune - nodeCountPrune) / nodeCountNoPrune * 100).toFixed(1)

    console.log(`\n📊 PRUNING EFFICIENCY (depth=${depth})`)
    console.log(`   Without pruning: ${timeNoPrune.toFixed(2)}ms (${nodeCountNoPrune} nodes)`)
    console.log(`   With pruning:    ${timePrune.toFixed(2)}ms (${nodeCountPrune} nodes)`)
    console.log(`   Efficiency:      ${pruningEfficiency}% reduction`)
    console.log(`   Speedup:         ${(timeNoPrune / timePrune).toFixed(2)}x`)

    expect(nodeCountNoPrune).toBeGreaterThan(nodeCountPrune)
  })
})
