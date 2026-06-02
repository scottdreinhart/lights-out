import { describe, expect, it } from 'vitest'

import {
  applyMove,
  calculateScore,
  canRollOneDie,
  createBoard,
  getOpenTiles,
  getValidMoves,
  isBoardShut,
  isValidMove,
  setDiceSum,
  toggleTileSelection,
} from '@/domain/board'
import { determineWinner, hasShutBox, wouldCompleteBox } from '@/domain/rules'

// ─── createBoard ──────────────────────────────────────────────────────────────

describe('createBoard', () => {
  it('creates a board with all 9 tiles open', () => {
    const board = createBoard()
    expect(getOpenTiles(board)).toHaveLength(9)
    expect(isBoardShut(board)).toBe(false)
  })

  it('starts with dice sum of 0 and no selected tiles', () => {
    const board = createBoard()
    expect(board.diceSum).toBe(0)
    expect(board.selectedTiles).toHaveLength(0)
  })
})

// ─── setDiceSum ───────────────────────────────────────────────────────────────

describe('setDiceSum', () => {
  it('updates the board dice sum', () => {
    const board = createBoard()
    const next = setDiceSum(board, 7)
    expect(next.diceSum).toBe(7)
  })
})

// ─── toggleTileSelection ──────────────────────────────────────────────────────

describe('toggleTileSelection', () => {
  it('adds a tile to selected', () => {
    const board = createBoard()
    const next = toggleTileSelection(board, 5)
    expect(next.selectedTiles).toContain(5)
  })

  it('removes a tile when already selected', () => {
    let board = createBoard()
    board = toggleTileSelection(board, 5)
    board = toggleTileSelection(board, 5)
    expect(board.selectedTiles).not.toContain(5)
  })
})

// ─── getValidMoves ────────────────────────────────────────────────────────────

describe('getValidMoves', () => {
  it('returns combinations summing to diceSum', () => {
    const board = createBoard()
    const moves = getValidMoves(board, 7)
    expect(Array.isArray(moves)).toBe(true)
    expect(moves.length).toBeGreaterThan(0)
    // All combinations should sum to 7
    for (const combo of moves) {
      expect(combo.reduce((a, b) => a + b, 0)).toBe(7)
    }
  })

  it('returns empty array when no valid combination exists', () => {
    // Close all tiles and check — sum 5 with no open tiles
    const board = createBoard()
    // Simulate all tiles closed via applyMove sequence
    const fullyClosedBoard = {
      ...board,
      tiles: Object.fromEntries(
        Object.keys(board.tiles).map((k) => [k, false]),
      ) as typeof board.tiles,
    }
    const moves = getValidMoves(fullyClosedBoard, 5)
    expect(moves).toHaveLength(0)
  })
})

// ─── isValidMove ─────────────────────────────────────────────────────────────

describe('isValidMove', () => {
  it('returns true for tiles that sum to diceSum and are open', () => {
    const board = setDiceSum(createBoard(), 9)
    expect(isValidMove(board, [9])).toBe(true)
    expect(isValidMove(board, [4, 5])).toBe(true)
  })

  it('returns false for tiles that do not sum to diceSum', () => {
    const board = setDiceSum(createBoard(), 9)
    expect(isValidMove(board, [1, 2])).toBe(false) // sums to 3, not 9
  })
})

// ─── applyMove ────────────────────────────────────────────────────────────────

describe('applyMove', () => {
  it('closes selected tiles', () => {
    const board = setDiceSum(createBoard(), 9)
    const next = applyMove(board, [9])
    expect(next.tiles[9]).toBe(false)
    expect(getOpenTiles(next)).toHaveLength(8)
  })

  it('resets dice sum and selection after move', () => {
    const board = setDiceSum(createBoard(), 9)
    const next = applyMove(board, [9])
    expect(next.diceSum).toBe(0)
    expect(next.selectedTiles).toHaveLength(0)
  })

  it('throws for an invalid move', () => {
    const board = setDiceSum(createBoard(), 9)
    expect(() => applyMove(board, [1, 2])).toThrow() // sums to 3, not 9
  })
})

// ─── calculateScore ───────────────────────────────────────────────────────────

describe('calculateScore', () => {
  it('returns sum of all open tiles on a fresh board (1+2+...+9 = 45)', () => {
    const board = createBoard()
    expect(calculateScore(board)).toBe(45)
  })

  it('returns 0 when all tiles are closed', () => {
    const board = createBoard()
    const fullyClosedBoard = {
      ...board,
      tiles: Object.fromEntries(
        Object.keys(board.tiles).map((k) => [k, false]),
      ) as typeof board.tiles,
    }
    expect(calculateScore(fullyClosedBoard)).toBe(0)
  })
})

// ─── isBoardShut ─────────────────────────────────────────────────────────────

describe('isBoardShut', () => {
  it('returns false on a fresh board', () => {
    expect(isBoardShut(createBoard())).toBe(false)
  })

  it('returns true when all tiles are closed', () => {
    const board = createBoard()
    const fullyClosedBoard = {
      ...board,
      tiles: Object.fromEntries(
        Object.keys(board.tiles).map((k) => [k, false]),
      ) as typeof board.tiles,
    }
    expect(isBoardShut(fullyClosedBoard)).toBe(true)
  })
})

// ─── canRollOneDie ────────────────────────────────────────────────────────────

describe('canRollOneDie', () => {
  it('returns false when 7, 8, 9 are all open', () => {
    expect(canRollOneDie(createBoard())).toBe(false)
  })

  it('returns true when 7, 8, 9 are all closed', () => {
    const board = createBoard()
    const partial = { ...board, tiles: { ...board.tiles, 7: false, 8: false, 9: false } }
    expect(canRollOneDie(partial)).toBe(true)
  })
})

// ─── Rules: hasShutBox ────────────────────────────────────────────────────────

describe('hasShutBox', () => {
  it('returns false on fresh game state', () => {
    const board = createBoard()
    const gameState = {
      board,
      players: [{ id: 'p1', name: 'Player 1', score: 0 }],
      currentPlayerIndex: 0,
      phase: 'rolling' as const,
      round: 1,
      maxRounds: 3,
    }
    expect(hasShutBox(gameState)).toBe(false)
  })
})

// ─── Rules: determineWinner ───────────────────────────────────────────────────

describe('determineWinner', () => {
  it('returns the player with the lowest score', () => {
    const players = [
      { id: 'p1', name: 'Alice', score: 15 },
      { id: 'p2', name: 'Bob', score: 7 },
    ]
    const winner = determineWinner(players)
    expect(winner.id).toBe('p2')
  })
})

// ─── wouldCompleteBox ─────────────────────────────────────────────────────────

describe('wouldCompleteBox', () => {
  it('returns true when selected tiles count matches remaining open tiles', () => {
    const board = createBoard()
    const closedBoard = {
      ...board,
      tiles: {
        ...board.tiles,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
      },
    }
    const gameState = {
      board: closedBoard,
      players: [{ id: 'p1', name: 'Player 1', score: 0 }],
      currentPlayerIndex: 0,
      phase: 'rolling' as const,
      round: 1,
      maxRounds: 3,
    }
    expect(wouldCompleteBox(gameState, [1])).toBe(true)
  })
})
