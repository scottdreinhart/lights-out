// ═══════════════════════════════════════════════════════════════════════════
// AI Engine for Tic-Tac-Toe — WebAssembly (AssemblyScript)
//
// Board cells: 0 = empty, 1 = player 1, 2 = player 2
//
// Exported functions (all difficulty levels):
//   findRandomMove(c0..c8, rand)                        → easy
//   findMediumMove(c0..c8, cpuToken, humanToken, rand)  → medium
//   findSmartMove(c0..c8, cpuToken, humanToken)          → hard
//   findBestMove(c0..c8, cpuToken, humanToken)            → unbeatable
//
// Compile: pnpm wasm:build
// ═══════════════════════════════════════════════════════════════════════════

// ── Win line indices (8 lines × 3 positions = 24 entries, flattened) ─────
const WIN_LINES: StaticArray<i32> = StaticArray.fromArray<i32>([
  0, 1, 2, 3, 4, 5, 6, 7, 8, // rows
  0, 3, 6, 1, 4, 7, 2, 5, 8, // columns
  0, 4, 8, 2, 4, 6, // diagonals
]);

// Move ordering: center → corners → edges (maximizes alpha-beta pruning)
const PRIORITY: StaticArray<i32> = StaticArray.fromArray<i32>([
  4, 0, 2, 6, 8, 1, 3, 5, 7,
]);

// Corner indices
const CORNERS: StaticArray<i32> = StaticArray.fromArray<i32>([0, 2, 6, 8]);

// Module-level board buffer (avoids per-call allocation)
const board: StaticArray<i32> = new StaticArray<i32>(9);

// ── Board helpers ────────────────────────────────────────────────────────

/** Load 9 cell values into the module-level board buffer */
function loadBoard(
  c0: i32, c1: i32, c2: i32,
  c3: i32, c4: i32, c5: i32,
  c6: i32, c7: i32, c8: i32,
): void {
  unchecked((board[0] = c0));
  unchecked((board[1] = c1));
  unchecked((board[2] = c2));
  unchecked((board[3] = c3));
  unchecked((board[4] = c4));
  unchecked((board[5] = c5));
  unchecked((board[6] = c6));
  unchecked((board[7] = c7));
  unchecked((board[8] = c8));
}

function getWinner(): i32 {
  for (let i: i32 = 0; i < 24; i += 3) {
    const a: i32 = unchecked(board[unchecked(WIN_LINES[i])]);
    const b: i32 = unchecked(board[unchecked(WIN_LINES[i + 1])]);
    const c: i32 = unchecked(board[unchecked(WIN_LINES[i + 2])]);
    if (a !== 0 && a === b && b === c) return a;
  }
  return 0;
}

function hasEmptyCells(): bool {
  for (let i: i32 = 0; i < 9; i++) {
    if (unchecked(board[i]) === 0) return true;
  }
  return false;
}

/** Count empty cells on the board */
function countEmpty(): i32 {
  let count: i32 = 0;
  for (let i: i32 = 0; i < 9; i++) {
    if (unchecked(board[i]) === 0) count++;
  }
  return count;
}

/** Get the nth empty cell index (0-based). Returns -1 if n >= count. */
function getNthEmpty(n: i32): i32 {
  let count: i32 = 0;
  for (let i: i32 = 0; i < 9; i++) {
    if (unchecked(board[i]) === 0) {
      if (count === n) return i;
      count++;
    }
  }
  return -1;
}

/** Find a cell where the given token wins immediately. Returns -1 if none. */
function findWinningMoveFor(token: i32): i32 {
  for (let i: i32 = 0; i < 9; i++) {
    if (unchecked(board[i]) === 0) {
      unchecked((board[i] = token));
      const winner: i32 = getWinner();
      unchecked((board[i] = 0));
      if (winner === token) return i;
    }
  }
  return -1;
}

// ── Minimax with alpha-beta pruning ──────────────────────────────────────

function minimax(
  depth: i32,
  alpha: i32,
  beta: i32,
  isMaximizing: bool,
  cpuToken: i32,
  humanToken: i32,
): i32 {
  // Terminal state evaluation (matches JS implementation in ai.worker.ts)
  const winner: i32 = getWinner();
  if (winner === cpuToken) {
    return isMaximizing ? 10 + depth : 10 - depth;
  }
  if (winner === humanToken) {
    return isMaximizing ? -10 + depth : -10 - depth;
  }
  if (!hasEmptyCells()) return 0; // draw

  let a: i32 = alpha;
  let b: i32 = beta;

  if (isMaximizing) {
    let best: i32 = -1000;
    for (let i: i32 = 0; i < 9; i++) {
      if (unchecked(board[i]) === 0) {
        unchecked((board[i] = cpuToken));
        const score: i32 = minimax(
          depth + 1,
          a,
          b,
          false,
          cpuToken,
          humanToken,
        );
        unchecked((board[i] = 0));
        if (score > best) best = score;
        if (score > a) a = score;
        if (b <= a) break; // beta cutoff
      }
    }
    return best;
  }

  // Minimizing (human's turn)
  let best: i32 = 1000;
  for (let i: i32 = 0; i < 9; i++) {
    if (unchecked(board[i]) === 0) {
      unchecked((board[i] = humanToken));
      const score: i32 = minimax(
        depth + 1,
        a,
        b,
        true,
        cpuToken,
        humanToken,
      );
      unchecked((board[i] = 0));
      if (score < best) best = score;
      if (score < b) b = score;
      if (b <= a) break; // alpha cutoff
    }
  }
  return best;
}

// ═══════════════════════════════════════════════════════════════════════════
// Exported API — one function per difficulty level
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Easy: pick a random empty cell.
 *
 * @param rand — random value from JS (Math.random() * 9 | 0), modded by empty count
 * @returns Cell index 0–8, or -1 if board is full
 */
export function findRandomMove(
  c0: i32, c1: i32, c2: i32,
  c3: i32, c4: i32, c5: i32,
  c6: i32, c7: i32, c8: i32,
  rand: i32,
): i32 {
  loadBoard(c0, c1, c2, c3, c4, c5, c6, c7, c8);
  const count: i32 = countEmpty();
  if (count === 0) return -1;
  // abs to guard against negative rand values
  const pick: i32 = (rand < 0 ? -rand : rand) % count;
  return getNthEmpty(pick);
}

/**
 * Medium: win if possible, block opponent, otherwise random.
 *
 * @param rand — random value from JS, used when no tactical move exists
 * @returns Cell index 0–8, or -1 if board is full
 */
export function findMediumMove(
  c0: i32, c1: i32, c2: i32,
  c3: i32, c4: i32, c5: i32,
  c6: i32, c7: i32, c8: i32,
  cpuToken: i32,
  humanToken: i32,
  rand: i32,
): i32 {
  loadBoard(c0, c1, c2, c3, c4, c5, c6, c7, c8);

  // Win immediately if possible
  const win: i32 = findWinningMoveFor(cpuToken);
  if (win >= 0) return win;

  // Block opponent from winning
  const block: i32 = findWinningMoveFor(humanToken);
  if (block >= 0) return block;

  // Otherwise pick a random empty cell
  const count: i32 = countEmpty();
  if (count === 0) return -1;
  const pick: i32 = (rand < 0 ? -rand : rand) % count;
  return getNthEmpty(pick);
}

/**
 * Hard: win → block → center → corner → edge (deterministic heuristic).
 *
 * @returns Cell index 0–8, or -1 if board is full
 */
export function findSmartMove(
  c0: i32, c1: i32, c2: i32,
  c3: i32, c4: i32, c5: i32,
  c6: i32, c7: i32, c8: i32,
  cpuToken: i32,
  humanToken: i32,
): i32 {
  loadBoard(c0, c1, c2, c3, c4, c5, c6, c7, c8);

  // Win immediately if possible
  const win: i32 = findWinningMoveFor(cpuToken);
  if (win >= 0) return win;

  // Block opponent from winning
  const block: i32 = findWinningMoveFor(humanToken);
  if (block >= 0) return block;

  // Take center
  if (unchecked(board[4]) === 0) return 4;

  // Take first available corner
  for (let i: i32 = 0; i < 4; i++) {
    const corner: i32 = unchecked(CORNERS[i]);
    if (unchecked(board[corner]) === 0) return corner;
  }

  // Take first available edge
  for (let i: i32 = 0; i < 9; i++) {
    if (unchecked(board[i]) === 0) return i;
  }

  return -1;
}

/**
 * Unbeatable: optimal move via minimax with alpha-beta pruning.
 *
 * @returns Best cell index 0–8, or -1 if board is full
 */
export function findBestMove(
  c0: i32, c1: i32, c2: i32,
  c3: i32, c4: i32, c5: i32,
  c6: i32, c7: i32, c8: i32,
  cpuToken: i32,
  humanToken: i32,
): i32 {
  loadBoard(c0, c1, c2, c3, c4, c5, c6, c7, c8);

  let bestMove: i32 = -1;
  let bestScore: i32 = -1000;

  // Try moves in priority order (center → corners → edges)
  for (let p: i32 = 0; p < 9; p++) {
    const idx: i32 = unchecked(PRIORITY[p]);
    if (unchecked(board[idx]) === 0) {
      if (bestMove === -1) bestMove = idx; // fallback to first available
      unchecked((board[idx] = cpuToken));
      const score: i32 = minimax(
        0,
        -1000,
        1000,
        false,
        cpuToken,
        humanToken,
      );
      unchecked((board[idx] = 0));

      if (score > bestScore) {
        bestScore = score;
        bestMove = idx;
      }
    }
  }

  return bestMove;
}
