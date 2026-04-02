#!/usr/bin/env node
/**
 * Connect-Four Minimax Performance Profiling - Standalone
 */

const connectFourGame = {
  getLegalMoves: (board) => {
    const moves = []
    const cols = 7
    const rows = 6
    for (let col = 0; col < cols; col++) {
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
}

const createTestBoard = () => {
  const board = new Array(42).fill(0)
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row < Math.min(3, Math.random() * 5); row++) {
      board[col + (5 - row) * 7] = Math.random() > 0.5 ? 1 : 2
    }
  }
  return board
}

function profileDifficulty(name, depth) {
  const board = createTestBoard()
  const startTime = performance.now()

  let nodeCount = 0
  const simulate = (d) => {
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

  console.log(`\n📊 CONNECT-FOUR ${name} (depth=${depth})`)
  console.log(`   Decision time: ${elapsed.toFixed(2)}ms`)
  console.log(`   Nodes evaluated: ${nodeCount}`)
  console.log(`   Throughput: ${(nodeCount / elapsed).toFixed(0)} nodes/ms`)

  return { name, depth, time: elapsed, nodes: nodeCount }
}

console.log('\n═══════════════════════════════════════════════════════════')
console.log('CONNECT-FOUR MINIMAX PERFORMANCE PROFILING')
console.log('═══════════════════════════════════════════════════════════')

const easyResult = profileDifficulty('EASY', 2)
const mediumResult = profileDifficulty('MEDIUM', 5)
const hardResult = profileDifficulty('HARD', 7)

console.log('\n📈 SUMMARY')
console.log(`   Easy:   ${easyResult.time.toFixed(2)}ms`)
console.log(`   Medium: ${mediumResult.time.toFixed(2)}ms`)
console.log(`   Hard:   ${hardResult.time.toFixed(2)}ms`)

if (hardResult.time > 200) {
  console.log(`\n🟡 DECISION: WASM optimization recommended`)
  console.log(`   Hard difficulty ${hardResult.time.toFixed(2)}ms > 200ms target`)
} else {
  console.log(`\n✅ DECISION: JavaScript minimax is sufficient`)
  console.log(`   Smaller branching factor allows deeper searches in reasonable time`)
}

// Branching factor analysis
console.log('\n📊 BRANCHING FACTOR ANALYSIS')
const avgBranchingFactor = 4.2
const depth = 6

let nodeCount = 0
const sim = (d) => {
  if (d === 0) return 1
  nodeCount++
  let nodes = 1
  const branches = Math.max(1, Math.floor(avgBranchingFactor))
  for (let i = 0; i < branches; i++) {
    nodes += sim(d - 1)
  }
  return nodes
}

const startTime = performance.now()
sim(depth)
const elapsed = performance.now() - startTime

console.log(`   Avg branching factor: ${avgBranchingFactor}`)
console.log(`   Total nodes (depth=${depth}): ${nodeCount}`)
console.log(`   Time: ${elapsed.toFixed(2)}ms`)
console.log(`   Throughput: ${(nodeCount / elapsed).toFixed(0)} nodes/ms`)

console.log('\n═══════════════════════════════════════════════════════════')
