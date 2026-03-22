// =======================================================================
// AI Engine for Rock Paper Scissors - WebAssembly (AssemblyScript)
//
// Move encoding: 0 = rock, 1 = paper, 2 = scissors
// Result encoding: 0 = draw, 1 = win, 2 = loss
//
// Compile: pnpm wasm:build
// =======================================================================

/**
 * Seed for pseudo-random number generation.
 * Using a simple linear congruential generator.
 */
let seed: u32 = 12345

/**
 * Simple PRNG that mimics Math.random() behavior
 * Returns value in range [0, 1)
 */
function random(): f64 {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff
  return f64(seed) / f64(0x7fffffff)
}

/**
 * Select a random move (0=rock, 1=paper, 2=scissors)
 */
function randomMove(): i32 {
  return i32(random() * 3.0)
}

/**
 * Determine the result of a single round.
 * Returns: 0 = draw, 1 = win, 2 = loss
 */
function determineRoundWinner(playerMove: i32, cpuMove: i32): i32 {
  if (playerMove === cpuMove) {
    return 0 // draw
  }

  if (
    (playerMove === 0 && cpuMove === 2) || // rock beats scissors
    (playerMove === 2 && cpuMove === 1) || // scissors beats paper
    (playerMove === 1 && cpuMove === 0)    // paper beats rock
  ) {
    return 1 // win
  }

  return 2 // loss
}

/**
 * Exported version of determineRoundWinner for public use
 */
export function getRoundWinner(playerMove: i32, cpuMove: i32): i32 {
  return determineRoundWinner(playerMove, cpuMove)
}

/**
 * Check if game is over based on best-of-N format.
 * Returns: 1 if game over, 0 if game continues
 */
export function isGameOver(playerScore: i32, cpuScore: i32, bestOf: i32): i32 {
  const winsNeeded = (bestOf / 2) + 1
  return (playerScore >= winsNeeded || cpuScore >= winsNeeded) ? i32(1) : i32(0)
}

/**
 * Determine the overall game winner.
 * Returns: 0 = no winner yet, 1 = player wins, 2 = cpu wins
 */
export function determineGameWinner(playerScore: i32, cpuScore: i32, bestOf: i32): i32 {
  if (isGameOver(playerScore, cpuScore, bestOf) === 0) {
    return 0 // no winner
  }

  if (playerScore > cpuScore) {
    return 1 // player wins
  }

  return 2 // cpu wins
}

/**
 * Calculate scores from a sequence of results.
 * resultsPtr points to array of result values (0=draw, 1=win, 2=loss)
 * Returns combined score: player_score << 16 | cpu_score
 */
export function calculateScores(resultsPtr: i32, roundCount: i32): i32 {
  let playerScore = 0
  let cpuScore = 0

  for (let i = 0; i < roundCount; i++) {
    const result = load<i32>(resultsPtr + i * 4)
    if (result === 1) {
      playerScore++
    } else if (result === 2) {
      cpuScore++
    }
  }

  return (playerScore << 16) | (cpuScore & 0xffff)
}

/**
 * Hash a move sequence for quick comparison/caching.
 * Computes a fast hash of all moves to detect game state equivalence.
 */
export function hashMoves(movesPtr: i32, moveCount: i32): u32 {
  let hash: u32 = 5381

  for (let i = 0; i < moveCount; i++) {
    const move = load<i32>(movesPtr + i * 4)
    hash = ((hash << 5) + hash) ^ u32(move)
  }

  return hash
}

/**
 * Select CPU move using adaptive AI strategy.
 * Input: encoded rounds as flat array [playerMove, cpuMove, result, playerMove, cpuMove, result, ...]
 * Returns: the selected CPU move (0=rock, 1=paper, 2=scissors)
 */
export function selectCPUMove(roundsPtr: i32, roundsLen: i32, seed_val: u32): i32 {
  seed = seed_val

  // Early game: play randomly
  if (roundsLen < 2) {
    return randomMove()
  }

  // Load last round from memory
  const lastRoundIndex = (roundsLen - 1) * 3
  const lastPlayerMove = load<i32>(roundsPtr + lastRoundIndex * 4)
  const lastCpuMove = load<i32>(roundsPtr + (lastRoundIndex + 1) * 4)
  const lastResultValue = load<i32>(roundsPtr + (lastRoundIndex + 2) * 4)

  // If CPU won last round (result == 2 for CPU win), tend to repeat (70% chance)
  if (lastResultValue === 2 && random() < 0.7) {
    return lastCpuMove
  }

  // Counter the opponent's last move
  // Rock (0) -> Paper (1), Paper (1) -> Scissors (2), Scissors (2) -> Rock (0)
  const countermoves: i32[] = [1, 2, 0]
  const countermove = countermoves[lastPlayerMove]

  // 60% chance to counter
  if (random() < 0.6) {
    return countermove
  }

  // Otherwise play randomly
  return randomMove()
}

/**
 * Exported function to set the seed for reproducible randomness
 */
export function setSeed(val: u32): void {
  seed = val
}
