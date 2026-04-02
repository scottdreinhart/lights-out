#!/usr/bin/env node
/**
 * Reversi Minimax Performance Profiling - Standalone
 */

const reversiGame = {
  getLegalMoves: (board) => {
    const moves = []
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 0) {
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
}

const createTestBoard = () => {
  const board = new Array(64).fill(0)
  board[27] = 2
  board[28] = 1
  board[35] = 1
  board[36] = 2
  for (let i = 0; i < 64; i += 8) {
    if (Math.random() > 0.6) {
      board[i + Math.floor(Math.random() * 8)] = Math.random() > 0.5 ? 1 : 2
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

  console.log(`\n📊 REVERSI ${name} (depth=${depth})`)
  console.log(`   Decision time: ${elapsed.toFixed(2)}ms`)
  console.log(`   Nodes evaluated: ${nodeCount}`)
  console.log(`   Throughput: ${(nodeCount / elapsed).toFixed(0)} nodes/ms`)

  return { name, depth, time: elapsed, nodes: nodeCount }
}

console.log('\n═══════════════════════════════════════════════════════════')
console.log('REVERSI MINIMAX PERFORMANCE PROFILING')
console.log('═══════════════════════════════════════════════════════════')

const easyResult = profileDifficulty('EASY', 2)
const mediumResult = profileDifficulty('MEDIUM', 4)
const hardResult = profileDifficulty('HARD', 6)

console.log('\n📈 SUMMARY')
console.log(`   Easy:   ${easyResult.time.toFixed(2)}ms`)
console.log(`   Medium: ${mediumResult.time.toFixed(2)}ms`)
console.log(`   Hard:   ${hardResult.time.toFixed(2)}ms`)

if (hardResult.time > 1000) {
  console.log(`\n🔴 CRITICAL: ${hardResult.time.toFixed(2)}ms exceeds hard target`)
  console.log(`   WASM optimization REQUIRED`)
} else if (hardResult.time > 200) {
  console.log(`\n🟡 DECISION: WASM optimization recommended`)
  console.log(`   Hard difficulty ${hardResult.time.toFixed(2)}ms > 200ms but < 1s`)
} else {
  console.log(`\n✅ DECISION: JavaScript minimax is sufficient`)
}

// Stability analysis
console.log('\n📊 STABILITY ANALYSIS (5 trials, depth=4)')
const numTrials = 5
const times = []

for (let trial = 0; trial < numTrials; trial++) {
  const board = createTestBoard()
  let nodeCount = 0
  const startTime = performance.now()

  const simulate = (d) => {
    if (d === 0) return 1
    const moves = reversiGame.getLegalMoves(board)
    let nodes = 0
    for (const move of moves) {
      nodeCount++
      nodes += simulate(d - 1)
    }
    return nodes
  }

  simulate(4)
  times.push(performance.now() - startTime)
}

const avgTime = times.reduce((a, b) => a + b) / times.length
const variance = Math.sqrt(
  times.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / times.length,
)
const stdDev = (variance / avgTime * 100).toFixed(1)

console.log(`   Times: ${times.map(t => t.toFixed(2)).join(', ')} ms`)
console.log(`   Average: ${avgTime.toFixed(2)}ms`)
console.log(`   Std Dev: ${stdDev}%`)

if (Number(stdDev) < 10) {
  console.log(`   ✅ STABLE: <10% variance`)
} else {
  console.log(`   ⚠️  VARIABLE: >${stdDev}% variance`)
}

console.log('\n═══════════════════════════════════════════════════════════')
