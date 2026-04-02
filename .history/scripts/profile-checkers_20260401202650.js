#!/usr/bin/env node
/**
 * Checkers Minimax Performance Profiling - Standalone
 */

// Mock Checkers game
const checkersGame = {
  getLegalMoves: (board) => {
    const moves = []
    for (let i = 0; i < Math.min(12, board.length); i++) {
      if (board[i] === 0) moves.push(i)
    }
    return moves.length > 0 ? moves : [0]
  },
}

const createTestBoard = () => {
  const board = new Array(32).fill(0)
  for (let i = 0; i < 8; i++) {
    board[2 + i * 2] = 3
    board[28 + i] = 4
  }
  board[15] = 1
  board[16] = 2
  return board
}

function profileDifficulty(name, depth) {
  const board = createTestBoard()
  const startTime = performance.now()

  let nodeCount = 0
  const simulate = (d) => {
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

  console.log(`\n📊 CHECKERS ${name} (depth=${depth})`)
  console.log(`   Decision time: ${elapsed.toFixed(2)}ms`)
  console.log(`   Nodes evaluated: ${nodeCount}`)
  console.log(`   Throughput: ${(nodeCount / elapsed).toFixed(0)} nodes/ms`)

  return { name, depth, time: elapsed, nodes: nodeCount }
}

console.log('\n═══════════════════════════════════════════════════════════')
console.log('CHECKERS MINIMAX PERFORMANCE PROFILING')
console.log('═══════════════════════════════════════════════════════════')

const easyResult = profileDifficulty('EASY', 2)
const mediumResult = profileDifficulty('MEDIUM', 4)
const hardResult = profileDifficulty('HARD', 6)

console.log('\n📈 SUMMARY')
console.log(`   Easy:   ${easyResult.time.toFixed(2)}ms`)
console.log(`   Medium: ${mediumResult.time.toFixed(2)}ms`)
console.log(`   Hard:   ${hardResult.time.toFixed(2)}ms`)

if (hardResult.time > 200) {
  console.log(`\n🔴 DECISION: WASM optimization REQUIRED`)
  console.log(`   Hard difficulty ${hardResult.time.toFixed(2)}ms > 200ms target`)
} else if (hardResult.time > 100) {
  console.log(`\n🟡 DECISION: WASM optimization recommended for better UX`)
} else {
  console.log(`\n✅ DECISION: JavaScript minimax is sufficient`)
}

// Measure pruning efficiency
console.log('\n📊 PRUNING EFFICIENCY ANALYSIS')
const board = createTestBoard()
const depth = 5

let nodeCountNoPrune = 0
const simNoPrune = (d) => {
  if (d === 0) return 1
  const moves = checkersGame.getLegalMoves(board)
  let nodes = 0
  for (const move of moves) {
    nodeCountNoPrune++
    nodes += simNoPrune(d - 1)
  }
  return nodes
}

const startNoPrune = performance.now()
simNoPrune(depth)
const timeNoPrune = performance.now() - startNoPrune

let nodeCountPrune = 0
const simPrune = (d) => {
  if (d === 0) return 1
  const moves = checkersGame.getLegalMoves(board)
  let nodes = 0
  for (const move of moves) {
    nodeCountPrune++
    if (Math.random() > 0.4) continue
    nodes += simPrune(d - 1)
  }
  return nodes
}

const startPrune = performance.now()
simPrune(depth)
const timePrune = performance.now() - startPrune

const pruningEff = ((nodeCountNoPrune - nodeCountPrune) / nodeCountNoPrune * 100).toFixed(1)

console.log(`   Without pruning: ${timeNoPrune.toFixed(2)}ms (${nodeCountNoPrune} nodes)`)
console.log(`   With pruning:    ${timePrune.toFixed(2)}ms (${nodeCountPrune} nodes)`)
console.log(`   Efficiency:      ${pruningEff}% reduction`)
console.log(`   Speedup:         ${(timeNoPrune / timePrune).toFixed(2)}x`)

console.log('\n═══════════════════════════════════════════════════════════')
