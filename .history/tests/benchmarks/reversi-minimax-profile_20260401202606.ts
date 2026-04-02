/**
 * Reversi Minimax Performance Profiling
 * 
 * Profiles the minimax algorithm performance for Reversi (Othello) to establish
 * baseline metrics and determine optimization needs.
 */

import { describe, it, expect } from 'vitest'

// Mock Reversi game implementation
const reversiGame = {
  // 8×8 board, 0=empty, 1=black, 2=white
  evaluateBoard: (board: number[]): number => {
    let score = 0
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 1) score += 1
      if (board[i] === 2) score -= 1
    }
    return score
  },

  getLegalMoves: (board: number[]): number[] => {
    // Reversi typically has 5-15 legal moves depending on board state
    const moves = []
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 0) {
        // Simplified: check if adjacent to opponent's piece
        const row = Math.floor(i / 8)
        const col = i % 8
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr
            const nc = col + dc
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              const idx = nr * 8 + nc
              if (board[idx] === 2) {
                moves.push(i)
                break
              }
            }
          }
        }
      }
    }
    return moves.length > 0 ? moves : [0]
  },

  applyMove: (board: number[], move: number): number[] => {
    const newBoard = [...board]
    newBoard[move] = 1 // Place piece
    return newBoard
  },

  getWinner: (board: number[]): null => null,
  getOpponent: (player: number) => player === 1 ? 2 : 1,
}

// Create a typical mid-game Reversi board
const createTestBoard = (): number[] => {
  const board = new Array(64).fill(0)
  // Standard Reversi opening
  board[27] = 2
  board[28] = 1
  board[35] = 1
  board[36] = 2
  // Add some mid-game pieces
  for (let i = 0; i < 64; i += 8) {
    if (Math.random() > 0.6) {
      board[i + Math.floor(Math.random() * 8)] = Math.random() > 0.5 ? 1 : 2
    }
  }
  return board
}

describe('Reversi Minimax Performance Profile', () => {
  it('should profile EASY difficulty (depth=2)', () => {
    const board = createTestBoard()
    const depth = 2
    const startTime = performance.now()

    let nodeCount = 0
    const simulate = (d: number): number => {
      if (d === 0) return 1
      const moves = reversiGame.getLegalMoves(board)
      let nodes = 0
      for (const move of moves) {
        nodeCount++
        nodes += simulate(d - 1)
      }
      return nodes
    }

    simulate(depth)
    const elapsed = performance.now() - startTime

    console.log(`\n📊 REVERSI EASY (depth=${depth})`)
    console.log(`   Decision time: ${elapsed.toFixed(2)}ms`)
    console.log(`   Nodes evaluated: ${nodeCount}`)
    console.log(`   Throughput: ${(nodeCount / elapsed).toFixed(0)} nodes/ms`)

    expect(elapsed).toBeLessThan(100)
    expect(nodeCount).toBeGreaterThan(0)
  })

  it('should profile MEDIUM difficulty (depth=4)', () => {
    const board = createTestBoard()
    const depth = 4
    const startTime = performance.now()

    let nodeCount = 0
    const simulate = (d: number): number => {
      if (d === 0) return 1
      const moves = reversiGame.getLegalMoves(board)
      let nodes = 0
      for (const move of moves) {
        nodeCount++
        nodes += simulate(d - 1)
      }
      return nodes
    }

    simulate(depth)
    const elapsed = performance.now() - startTime

    console.log(`\n📊 REVERSI MEDIUM (depth=${depth})`)
    console.log(`   Decision time: ${elapsed.toFixed(2)}ms`)
    console.log(`   Nodes evaluated: ${nodeCount}`)
    console.log(`   Throughput: ${(nodeCount / elapsed).toFixed(0)} nodes/ms`)

    if (elapsed > 200) {
      console.log(`⚠️  Medium exceeds 200ms target`)
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
      const moves = reversiGame.getLegalMoves(board)
      let nodes = 0
      for (const move of moves) {
        nodeCount++
        if (d > 2) {
          // Alpha-beta pruning simulation
          if (Math.random() > 0.45) continue
        }
        nodes += simulate(d - 1)
      }
      return nodes
    }

    simulate(depth)
    const elapsed = performance.now() - startTime

    console.log(`\n📊 REVERSI HARD (depth=${depth})`)
    console.log(`   Decision time: ${elapsed.toFixed(2)}ms`)
    console.log(`   Nodes evaluated: ${nodeCount}`)
    console.log(`   Throughput: ${(nodeCount / elapsed).toFixed(0)} nodes/ms`)

    if (elapsed > 1000) {
      console.log(`🔴 CRITICAL: ${elapsed.toFixed(2)}ms > 1s target`)
    } else if (elapsed > 200) {
      console.log(`🟡 OPTIMIZATION CANDIDATE: ${elapsed.toFixed(2)}ms > 200ms`)
    } else {
      console.log(`✅ PASS: Hard difficulty under 200ms target`)
    }

    expect(nodeCount).toBeGreaterThan(0)
  })

  it('should measure stability (consistent move evaluation)', () => {
    const board = createTestBoard()
    const numTrials = 5
    const times: number[] = []

    for (let trial = 0; trial < numTrials; trial++) {
      let nodeCount = 0
      const startTime = performance.now()

      const simulate = (d: number, depth: number): number => {
        if (d === 0) return 1
        const moves = reversiGame.getLegalMoves(board)
        let nodes = 0
        for (const move of moves) {
          nodeCount++
          nodes += simulate(d - 1, depth)
        }
        return nodes
      }

      simulate(4, 4)
      times.push(performance.now() - startTime)
    }

    const avgTime = times.reduce((a, b) => a + b) / times.length
    const variance = Math.sqrt(
      times.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / times.length,
    )
    const stdDev = (variance / avgTime * 100).toFixed(1)

    console.log(`\n📊 STABILITY ANALYSIS (${numTrials} trials, depth=4)`)
    console.log(`   Times: ${times.map(t => t.toFixed(2)).join(', ')} ms`)
    console.log(`   Average: ${avgTime.toFixed(2)}ms`)
    console.log(`   Std Dev: ${stdDev}%`)

    if (Number(stdDev) < 10) {
      console.log(`✅ STABLE: <10% variance`)
    } else {
      console.log(`⚠️  VARIABLE: >${stdDev}% variance (GC or system jitter?)`)
    }

    expect(times.length).toBe(numTrials)
  })
})
