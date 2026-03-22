// =======================================================================
// AI Engine for Shut the Box — WebAssembly (AssemblyScript)
//
// Board: 9 tiles (1-9), each open (1) or closed (0).
// Encoded as a single u16 bitmask: bit 0 = tile 1, bit 8 = tile 9.
//
// Exported functions:
//   getValidMovesCount(board, sum) → number of valid combinations
//   getValidMove(board, sum, idx) → bitmask of the idx-th combination
//   calculateScore(board) → sum of open tiles
//   canRollOneDie(board) → 1 if tiles 7,8,9 are all closed, else 0
//   getBestMove(board, sum) → bitmask of the AI-chosen combination
//
// Compile: pnpm wasm:build
// =======================================================================

// ── Scratch buffers for combination search ────────────────────────────────
// Max theoretical combinations for 9 tiles ≤ 2^9 = 512
const MAX_COMBOS: i32 = 512
const combos = new StaticArray<u16>(MAX_COMBOS)
let comboCount: i32 = 0

// ── Helper: enumerate all subsets of open tiles summing to `sum` ──────────
function enumerate(board: u16, sum: i32): void {
  comboCount = 0
  // Iterate over all subsets of the board bitmask
  let subset: u16 = board
  while (subset > 0) {
    // Check if this subset sums to the target
    let s: i32 = 0
    for (let bit: u16 = 0; bit < 9; bit++) {
      if ((subset >> bit) & 1) {
        s += <i32>bit + 1
      }
    }
    if (s === sum && comboCount < MAX_COMBOS) {
      unchecked((combos[comboCount] = subset))
      comboCount++
    }
    // Gosper's hack: iterate subsets of `board`
    // Next subset of board: subtract 1, AND with board
    subset = ((subset - 1) & board) as u16
  }
}

// ── Exported: count valid move combinations ───────────────────────────────
export function getValidMovesCount(board: u16, sum: i32): i32 {
  enumerate(board, sum)
  return comboCount
}

// ── Exported: retrieve the idx-th valid move (call after getValidMovesCount)
export function getValidMove(_board: u16, _sum: i32, idx: i32): u16 {
  if (idx < 0 || idx >= comboCount) return 0
  return unchecked(combos[idx])
}

// ── Exported: sum of open tile values ─────────────────────────────────────
export function calculateScore(board: u16): i32 {
  let score: i32 = 0
  for (let bit: u16 = 0; bit < 9; bit++) {
    if ((board >> bit) & 1) {
      score += <i32>bit + 1
    }
  }
  return score
}

// ── Exported: can player choose to roll one die? ──────────────────────────
export function canRollOneDie(board: u16): i32 {
  // Tiles 7,8,9 = bits 6,7,8.  All must be 0 (closed).
  const mask: u16 = 0b111_000_000 // bits 6-8
  return ((board & mask) === 0) ? 1 : 0
}

// ── Exported: AI best-move selection ──────────────────────────────────────
// Strategy: prefer the move that leaves the lowest expected score.
// For each valid move, simulate closing those tiles and compute the
// remaining score.  Pick the move with the lowest residual score.
// Tie-break: prefer closing fewer tiles (keeps options open).
export function getBestMove(board: u16, sum: i32): u16 {
  enumerate(board, sum)
  if (comboCount === 0) return 0

  let bestMask: u16 = unchecked(combos[0])
  let bestScore: i32 = calculateScore((board & ~bestMask) as u16)
  let bestBits: i32 = popcnt<i32>(bestMask as i32)

  for (let i: i32 = 1; i < comboCount; i++) {
    const mask: u16 = unchecked(combos[i])
    const remaining: u16 = (board & ~mask) as u16
    const score: i32 = calculateScore(remaining)
    const bits: i32 = popcnt<i32>(mask as i32)

    if (score < bestScore || (score === bestScore && bits < bestBits)) {
      bestMask = mask
      bestScore = score
      bestBits = bits
    }
  }

  return bestMask
}
