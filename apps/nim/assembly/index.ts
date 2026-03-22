// ═══════════════════════════════════════════════════════════════════════════
// AI Engine for Nim — WebAssembly (AssemblyScript)
//
// Pile counts are passed as individual i32 params (up to 8 piles).
// Mode: 0 = normal, 1 = misère.
// Return value encodes both pileId and removeCount as (pileId << 8) | removeCount.
//
// Exported functions:
//   selectMove(p0..p7, numPiles, mode) → encoded move
//   selectMoveBatch(p0..p7, numPiles, mode, iterations) → encoded move
//
// Compile: pnpm wasm:build
// ═══════════════════════════════════════════════════════════════════════════

// Module-level pile buffer (avoids per-call allocation)
const piles: StaticArray<i32> = new StaticArray<i32>(8)

/** Load pile counts into the module-level buffer */
function loadPiles(
  p0: i32,
  p1: i32,
  p2: i32,
  p3: i32,
  p4: i32,
  p5: i32,
  p6: i32,
  p7: i32,
): void {
  unchecked((piles[0] = p0))
  unchecked((piles[1] = p1))
  unchecked((piles[2] = p2))
  unchecked((piles[3] = p3))
  unchecked((piles[4] = p4))
  unchecked((piles[5] = p5))
  unchecked((piles[6] = p6))
  unchecked((piles[7] = p7))
}

/** Calculate Nim-sum (XOR of all pile counts) */
function calculateNimSum(numPiles: i32): i32 {
  let nimSum: i32 = 0
  for (let i: i32 = 0; i < numPiles; i++) {
    nimSum ^= unchecked(piles[i])
  }
  return nimSum
}

/** Encode a move as a single i32: (pileId << 8) | removeCount */
function encodeMove(pileId: i32, removeCount: i32): i32 {
  return (pileId << 8) | removeCount
}

/**
 * Misère end-game: if exactly one pile has count > 1, reduce it
 * to leave an odd number of 1-piles.
 * Returns encoded move, or -1 if no misère end-game applies.
 */
function getMisereMove(numPiles: i32): i32 {
  let bigPileCount: i32 = 0
  let bigPileIdx: i32 = -1
  let onesPiles: i32 = 0

  for (let i: i32 = 0; i < numPiles; i++) {
    const c: i32 = unchecked(piles[i])
    if (c > 1) {
      bigPileCount++
      bigPileIdx = i
    } else if (c === 1) {
      onesPiles++
    }
  }

  if (bigPileCount === 1) {
    const bigCount: i32 = unchecked(piles[bigPileIdx])
    // Leave an odd number of 1-piles
    const targetCount: i32 = onesPiles % 2 === 0 ? 1 : 0
    return encodeMove(bigPileIdx, bigCount - targetCount)
  }

  return -1
}

/** Select move assuming pile buffer has already been loaded */
function selectMoveFromLoaded(numPiles: i32, mode: i32): i32 {
  // Check for misère end-game
  if (mode === 1) {
    const misereMove: i32 = getMisereMove(numPiles)
    if (misereMove >= 0) {
      return misereMove
    }
  }

  const nimSum: i32 = calculateNimSum(numPiles)

  if (nimSum !== 0) {
    // Winning position: find a pile where pile ^ nimSum < pile
    for (let i: i32 = 0; i < numPiles; i++) {
      const count: i32 = unchecked(piles[i])
      const target: i32 = count ^ nimSum
      if (target < count) {
        return encodeMove(i, count - target)
      }
    }
  }

  // Losing position (nimSum === 0): take 1 from first non-empty pile
  for (let i: i32 = 0; i < numPiles; i++) {
    if (unchecked(piles[i]) > 0) {
      return encodeMove(i, 1)
    }
  }

  // Should never reach here if game isn't over
  return encodeMove(0, 0)
}

/**
 * Select the best move for the CPU using Nim-sum strategy.
 *
 * @param p0–p7    Pile counts (0 for unused slots)
 * @param numPiles Actual number of piles (1–8)
 * @param mode     0 = normal, 1 = misère
 * @returns Encoded move: (pileId << 8) | removeCount
 */
export function selectMove(
  p0: i32,
  p1: i32,
  p2: i32,
  p3: i32,
  p4: i32,
  p5: i32,
  p6: i32,
  p7: i32,
  numPiles: i32,
  mode: i32,
): i32 {
  loadPiles(p0, p1, p2, p3, p4, p5, p6, p7)
  return selectMoveFromLoaded(numPiles, mode)
}

/**
 * Batched selector for A/B latency experiments.
 *
 * Runs move selection multiple times inside WASM to reduce JS ↔ WASM
 * boundary crossings compared to repeated JS-side calls.
 *
 * @param p0–p7      Pile counts (0 for unused slots)
 * @param numPiles   Actual number of piles (1–8)
 * @param mode       0 = normal, 1 = misère
 * @param iterations Number of internal evaluations (min 1)
 * @returns Encoded move from the final iteration: (pileId << 8) | removeCount
 */
export function selectMoveBatch(
  p0: i32,
  p1: i32,
  p2: i32,
  p3: i32,
  p4: i32,
  p5: i32,
  p6: i32,
  p7: i32,
  numPiles: i32,
  mode: i32,
  iterations: i32,
): i32 {
  loadPiles(p0, p1, p2, p3, p4, p5, p6, p7)

  const loops: i32 = iterations > 0 ? iterations : 1
  let encoded: i32 = 0

  for (let i: i32 = 0; i < loops; i++) {
    encoded = selectMoveFromLoaded(numPiles, mode)
  }

  return encoded
}
