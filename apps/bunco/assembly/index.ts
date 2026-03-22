// =======================================================================
// Bunco Dice Engine — WebAssembly (AssemblyScript)
//
// Provides dice rolling (xorshift64 PRNG) and scoring logic compiled
// to WASM for the Web Worker path.
//
// Compile: pnpm wasm:build
// =======================================================================

// ── PRNG state (xorshift64) ───────────────────────────────────────────
let seed: u64 = 1

/** Seed the PRNG. Must be called before rollDice(). */
export function setSeed(s: u64): void {
  seed = s !== 0 ? s : 1
}

function xorshift64(): u64 {
  let x = seed
  x ^= x << 13
  x ^= x >> 7
  x ^= x << 17
  seed = x
  return x
}

/** Returns a die value 1-6. */
function rollOne(): i32 {
  return <i32>(xorshift64() % 6) + 1
}

// ── Dice rolling ──────────────────────────────────────────────────────
// Results stored in module memory, read via exported getters.
let die1: i32 = 0
let die2: i32 = 0
let die3: i32 = 0

/** Roll three dice. Read results with getDie1/2/3(). */
export function rollDice(): void {
  die1 = rollOne()
  die2 = rollOne()
  die3 = rollOne()
}

export function getDie1(): i32 { return die1 }
export function getDie2(): i32 { return die2 }
export function getDie3(): i32 { return die3 }

// ── Scoring ───────────────────────────────────────────────────────────
let lastPoints: i32 = 0
let lastIsBunco: i32 = 0
let lastIsMiniBunco: i32 = 0
let lastMatchCount: i32 = 0

/**
 * Score a roll of (d1, d2, d3) against the target number.
 * Read results with getPoints(), getIsBunco(), etc.
 */
export function scoreRoll(d1: i32, d2: i32, d3: i32, target: i32): void {
  const isThreeOfKind = d1 === d2 && d2 === d3

  if (isThreeOfKind && d1 === target) {
    lastPoints = 21
    lastIsBunco = 1
    lastIsMiniBunco = 0
    lastMatchCount = 3
    return
  }

  if (isThreeOfKind) {
    lastPoints = 5
    lastIsBunco = 0
    lastIsMiniBunco = 1
    lastMatchCount = 0
    return
  }

  let matches: i32 = 0
  if (d1 === target) { matches++ }
  if (d2 === target) { matches++ }
  if (d3 === target) { matches++ }

  lastPoints = matches
  lastIsBunco = 0
  lastIsMiniBunco = 0
  lastMatchCount = matches
}

export function getPoints(): i32 { return lastPoints }
export function getIsBunco(): i32 { return lastIsBunco }
export function getIsMiniBunco(): i32 { return lastIsMiniBunco }
export function getMatchCount(): i32 { return lastMatchCount }
