// =======================================================================
// AI Engine for Checkers - WebAssembly (AssemblyScript)
// Minimax with alpha-beta pruning for CPU move selection.
//
// Board representation (flat array of 64 bytes):
//   0 = empty
//   1 = red piece
//   2 = red king
//   3 = black piece
//   4 = black king
//
// Move encoding: [source_idx, dest_idx] as Uint32
// =======================================================================

// Memory layout:
//   0-63: board data (64 bytes)
//   64-191: legal moves array (up to 128 moves)
//   192+: scratch space for minimax

const BOARD_OFFSET = 0
const MOVES_OFFSET = 64
const SCRATCH_OFFSET = 192
const BOARD_SIZE = 8
const BOARD_CELLS = 64

// Piece type constants (matches JavaScript)
const EMPTY = 0
const RED = 1
const RED_KING = 2
const BLACK = 3
const BLACK_KING = 4

const RED_PLAYER = 0
const BLACK_PLAYER = 1

// Helper: convert (row, col) to flat index
function posToIdx(row: i32, col: i32): i32 {
  return row * BOARD_SIZE + col
}

// Helper: convert flat index to (row, col)
function idxToRow(idx: i32): i32 {
  return idx / BOARD_SIZE
}

function idxToCol(idx: i32): i32 {
  return idx % BOARD_SIZE
}

// Helper: read piece at board index
function getPieceAt(idx: i32): i32 {
  return load<u8>(BOARD_OFFSET + idx)
}

// Helper: write piece at board index
function setPieceAt(idx: i32, piece: i32): void {
  store<u8>(BOARD_OFFSET + idx, piece as u8)
}

// Helper: is piece owned by player
function isPieceOwned(piece: i32, player: i32): bool {
  if (player === RED_PLAYER) {
    return piece === RED || piece === RED_KING
  }
  return piece === BLACK || piece === BLACK_KING
}

// Helper: opponent player
function getOpponent(player: i32): i32 {
  return player === RED_PLAYER ? BLACK_PLAYER : RED_PLAYER
}

// Helper: is piece a king
function isKing(piece: i32): bool {
  return piece === RED_KING || piece === BLACK_KING
}

// Helper: count pieces/kings for a player
function countPieces(player: i32): i32 {
  let count = 0
  for (let i = 0; i < BOARD_CELLS; i += 1) {
    if (isPieceOwned(getPieceAt(i), player)) {
      count += 1
    }
  }
  return count
}

function countKings(player: i32): i32 {
  let count = 0
  for (let i = 0; i < BOARD_CELLS; i += 1) {
    const piece = getPieceAt(i)
    if (isPieceOwned(piece, player) && isKing(piece)) {
      count += 1
    }
  }
  return count
}

// Helper: get winner (0 if none, player+1 if has winner)
function checkWinner(): i32 {
  const redCount = countPieces(RED_PLAYER)
  const blackCount = countPieces(BLACK_PLAYER)

  if (redCount === 0) {
    return BLACK_PLAYER + 1 // Black wins
  }
  if (blackCount === 0) {
    return RED_PLAYER + 1 // Red wins
  }

  // Check if current player has no moves (simplified - check if next move exists)
  return 0 // No winner
}

// Helper: is position valid
function isValidPos(row: i32, col: i32): bool {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
}

// Helper: evaluate board position from perspective of a player
function evaluateBoard(player: i32): i32 {
  const opponent = getOpponent(player)

  const ownPieces = countPieces(player)
  const opponentPieces = countPieces(opponent)
  const ownKings = countKings(player)
  const opponentKings = countKings(opponent)

  let centerScore = 0
  let advancementScore = 0

  for (let idx = 0; idx < BOARD_CELLS; idx += 1) {
    const piece = getPieceAt(idx)
    if (piece === EMPTY) {
      continue
    }

    const row = idxToRow(idx)
    const col = idxToCol(idx)
    const isCentral = row >= 2 && row <= 5 && col >= 2 && col <= 5 ? 1 : 0

    if (isPieceOwned(piece, player)) {
      centerScore += isCentral
      if (!isKing(piece)) {
        const direction = player === RED_PLAYER ? 7 - row : row
        advancementScore += (direction * 35) / 100
      }
    } else {
      centerScore -= isCentral
      if (!isKing(piece)) {
        const direction = isPieceOwned(piece, RED_PLAYER)
          ? 7 - row
          : row
        advancementScore -= (direction * 35) / 100
      }
    }
  }

  const movesOwnCount = countLegalMovesFor(player)
  const movesOpponentCount = countLegalMovesFor(opponent)

  return (
    (ownPieces - opponentPieces) * 100 +
    (ownKings - opponentKings) * 65 +
    (movesOwnCount - movesOpponentCount) * 7 +
    centerScore * 8 +
    i32(advancementScore)
  )
}

// Count legal moves for a player (simplified - just check if any valid move exists)
function countLegalMovesFor(player: i32): i32 {
  // Simplified: return 1 if player has moves, 0 otherwise
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const idx = posToIdx(row, col)
      if (isPieceOwned(getPieceAt(idx), player)) {
        // Try basic moves
        const directions = isKing(getPieceAt(idx))
          ? [
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1],
            ]
          : player === RED_PLAYER
            ? [[-1, -1], [-1, 1]]
            : [[1, -1], [1, 1]]

        for (let d = 0; d < directions.length; d += 1) {
          const newRow = row + i32(load<i32>((SCRATCH_OFFSET + d * 8) as usize))
          const newCol = col + i32(load<i32>((SCRATCH_OFFSET + d * 8 + 4) as usize))
          if (isValidPos(newRow, newCol)) {
            return 1
          }
        }
      }
    }
  }
  return 0
}

// Minimax with alpha-beta pruning
function minimax(currentPlayer: i32, perspective: i32, depth: i32, alpha: i32, beta: i32): i32 {
  const winner = checkWinner()
  if (winner > 0) {
    if (winner === perspective + 1) {
      return 100000 + depth
    }
    return -100000 - depth
  }

  if (depth === 0) {
    return evaluateBoard(perspective)
  }

  if (currentPlayer === perspective) {
    let bestScore = -100000000

    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const idx = posToIdx(row, col)
        if (!isPieceOwned(getPieceAt(idx), currentPlayer)) {
          continue
        }

        const piece = getPieceAt(idx)
        const directions = isKing(piece)
          ? [
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1],
            ]
          : currentPlayer === RED_PLAYER
            ? [[-1, -1], [-1, 1]]
            : [[1, -1], [1, 1]]

        for (let d = 0; d < directions.length; d += 1) {
          const dRow = i32(load<i32>((SCRATCH_OFFSET + d * 8) as usize))
          const dCol = i32(load<i32>((SCRATCH_OFFSET + d * 8 + 4) as usize))
          const newRow = row + dRow
          const newCol = col + dCol

          if (isValidPos(newRow, newCol)) {
            const targetIdx = posToIdx(newRow, newCol)
            const targetPiece = getPieceAt(targetIdx)

            if (targetPiece === EMPTY) {
              // Simple move
              setPieceAt(idx, EMPTY)
              setPieceAt(targetIdx, piece)

              const score = minimax(
                getOpponent(currentPlayer),
                perspective,
                depth - 1,
                alpha,
                beta,
              )
              bestScore = score > bestScore ? score : bestScore
              alpha = score > alpha ? score : alpha

              setPieceAt(idx, piece)
              setPieceAt(targetIdx, EMPTY)

              if (beta <= alpha) {
                return bestScore
              }
            }
          }
        }
      }
    }

    return bestScore
  }

  let bestScore = 100000000

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const idx = posToIdx(row, col)
      if (!isPieceOwned(getPieceAt(idx), currentPlayer)) {
        continue
      }

      const piece = getPieceAt(idx)
      const directions = isKing(piece)
        ? [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
          ]
        : currentPlayer === RED_PLAYER
          ? [[-1, -1], [-1, 1]]
          : [[1, -1], [1, 1]]

      for (let d = 0; d < directions.length; d += 1) {
        const dRow = i32(load<i32>((SCRATCH_OFFSET + d * 8) as usize))
        const dCol = i32(load<i32>((SCRATCH_OFFSET + d * 8 + 4) as usize))
        const newRow = row + dRow
        const newCol = col + dCol

        if (isValidPos(newRow, newCol)) {
          const targetIdx = posToIdx(newRow, newCol)
          const targetPiece = getPieceAt(targetIdx)

          if (targetPiece === EMPTY) {
            // Simple move
            setPieceAt(idx, EMPTY)
            setPieceAt(targetIdx, piece)

            const score = minimax(
              getOpponent(currentPlayer),
              perspective,
              depth - 1,
              alpha,
              beta,
            )
            bestScore = score < bestScore ? score : bestScore
            beta = score < beta ? score : beta

            setPieceAt(idx, piece)
            setPieceAt(targetIdx, EMPTY)

            if (beta <= alpha) {
              return bestScore
            }
          }
        }
      }
    }
  }

  return bestScore
}

// Main entry point: compute best move
export function computeAiMove(boardPtr: usize, boardLen: i32, playerEncoded: i32): i32 {
  // Copy board from JS to WASM memory
  memory.copy(BOARD_OFFSET, boardPtr, boardLen)

  const player = playerEncoded === 0 ? RED_PLAYER : BLACK_PLAYER
  const searchDepth = countPieces(RED_PLAYER) + countPieces(BLACK_PLAYER) <= 10 ? 6 : 4

  let bestSourceIdx = -1
  let bestDestIdx = -1
  let bestScore = -100000000

  // Find best move by minimax
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const idx = posToIdx(row, col)
      if (!isPieceOwned(getPieceAt(idx), player)) {
        continue
      }

      const piece = getPieceAt(idx)
      const directions = isKing(piece)
        ? [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
          ]
        : player === RED_PLAYER
          ? [[-1, -1], [-1, 1]]
          : [[1, -1], [1, 1]]

      for (let d = 0; d < directions.length; d += 1) {
        const dRow = i32(load<i32>((SCRATCH_OFFSET + d * 8) as usize))
        const dCol = i32(load<i32>((SCRATCH_OFFSET + d * 8 + 4) as usize))
        const newRow = row + dRow
        const newCol = col + dCol

        if (isValidPos(newRow, newCol)) {
          const destIdx = posToIdx(newRow, newCol)
          const targetPiece = getPieceAt(destIdx)

          if (targetPiece === EMPTY) {
            // Try this move
            setPieceAt(idx, EMPTY)
            setPieceAt(destIdx, piece)

            const score = minimax(
              getOpponent(player),
              player,
              searchDepth - 1,
              -100000000,
              100000000,
            )

            if (score > bestScore) {
              bestScore = score
              bestSourceIdx = idx
              bestDestIdx = destIdx
            }

            setPieceAt(idx, piece)
            setPieceAt(destIdx, EMPTY)
          }
        }
      }
    }
  }

  // Return encoded move: [source << 8 | dest]
  if (bestSourceIdx === -1) {
    return -1 // No move found
  }

  return (bestSourceIdx << 8) | bestDestIdx
}
