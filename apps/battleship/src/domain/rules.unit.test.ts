import { describe, expect, it } from 'vitest'

import { canPlaceShip, createBoard, fireAt, getShipCells, placeShip } from '@/domain/board'
import { GRID_SIZE, SHIP_DEFS } from '@/domain/constants'
import { allShipsSunk, hitCount, shotCount, sunkCount } from '@/domain/rules'

// ─── Board Creation ───────────────────────────────────────────────────────────

describe('createBoard', () => {
  it('creates an empty board of the specified size', () => {
    const board = createBoard(10)
    expect(board.size).toBe(10)
    expect(board.grid).toHaveLength(10)
    expect(board.grid[0]).toHaveLength(10)
    expect(board.ships).toHaveLength(0)
  })

  it('defaults to GRID_SIZE', () => {
    const board = createBoard()
    expect(board.size).toBe(GRID_SIZE)
  })

  it('fills all cells with empty state', () => {
    const board = createBoard(5)
    for (const row of board.grid) {
      for (const cell of row) {
        expect(cell).toBe('empty')
      }
    }
  })
})

// ─── Ship Placement ───────────────────────────────────────────────────────────

describe('getShipCells', () => {
  it('generates correct horizontal cells', () => {
    const cells = getShipCells({ row: 0, col: 2 }, 'horizontal', 3)
    expect(cells).toEqual([
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      { row: 0, col: 4 },
    ])
  })

  it('generates correct vertical cells', () => {
    const cells = getShipCells({ row: 2, col: 1 }, 'vertical', 3)
    expect(cells).toEqual([
      { row: 2, col: 1 },
      { row: 3, col: 1 },
      { row: 4, col: 1 },
    ])
  })
})

describe('canPlaceShip', () => {
  it('allows valid placement in empty board', () => {
    const board = createBoard()
    expect(canPlaceShip(board, { row: 0, col: 0 }, 'horizontal', 5)).toBe(true)
  })

  it('rejects placement that goes out of bounds horizontally', () => {
    const board = createBoard(10)
    expect(canPlaceShip(board, { row: 0, col: 8 }, 'horizontal', 5)).toBe(false)
  })

  it('rejects placement that goes out of bounds vertically', () => {
    const board = createBoard(10)
    expect(canPlaceShip(board, { row: 8, col: 0 }, 'vertical', 5)).toBe(false)
  })

  it('rejects placement overlapping an existing ship', () => {
    let board = createBoard()
    board = placeShip(board, SHIP_DEFS[0], { row: 0, col: 0 }, 'horizontal', 'player')!
    expect(canPlaceShip(board, { row: 0, col: 0 }, 'horizontal', 3)).toBe(false)
  })
})

describe('placeShip', () => {
  it('places a ship and marks cells', () => {
    let board = createBoard()
    board = placeShip(board, SHIP_DEFS[4], { row: 0, col: 0 }, 'horizontal', 'player')!
    expect(board).not.toBeNull()
    expect(board.ships).toHaveLength(1)
    expect(board.grid[0][0]).toBe('ship')
    expect(board.grid[0][1]).toBe('ship')
  })

  it('returns null for invalid placement', () => {
    const board = createBoard()
    const result = placeShip(board, SHIP_DEFS[0], { row: 0, col: 8 }, 'horizontal', 'player')
    expect(result).toBeNull()
  })
})

// ─── Firing ───────────────────────────────────────────────────────────────────

describe('fireAt', () => {
  function makeBoardWithShip() {
    let board = createBoard()
    board = placeShip(board, SHIP_DEFS[4], { row: 5, col: 5 }, 'horizontal', 'cpu')!
    return board
  }

  it('returns hit when CPU ship is at target', () => {
    const board = makeBoardWithShip()
    const { result } = fireAt(board, { row: 5, col: 5 }, 'player')
    expect(result.result).toBe('hit')
  })

  it('returns miss when no ship at target', () => {
    const board = makeBoardWithShip()
    const { result } = fireAt(board, { row: 0, col: 0 }, 'player')
    expect(result.result).toBe('miss')
  })

  it('marks cell as playerHit on successful hit', () => {
    const board = makeBoardWithShip()
    const { board: newBoard } = fireAt(board, { row: 5, col: 5 }, 'player')
    expect(newBoard.grid[5][5]).toBe('playerHit')
  })

  it('marks cell as playerMiss on miss', () => {
    const board = makeBoardWithShip()
    const { board: newBoard } = fireAt(board, { row: 0, col: 0 }, 'player')
    expect(newBoard.grid[0][0]).toBe('playerMiss')
  })

  it('returns already when firing at a cell already shot', () => {
    const board = makeBoardWithShip()
    const { board: afterFirst } = fireAt(board, { row: 5, col: 5 }, 'player')
    const { result } = fireAt(afterFirst, { row: 5, col: 5 }, 'player')
    expect(result.result).toBe('already')
  })

  it('returns sunkShip when all ship cells are hit', () => {
    const board = makeBoardWithShip()
    // Destroyer has length 2: cells [5,5] and [5,6]
    const { board: b1 } = fireAt(board, { row: 5, col: 5 }, 'player')
    const { result } = fireAt(b1, { row: 5, col: 6 }, 'player')
    expect(result.sunkShip).not.toBeNull()
    expect(result.sunkShip?.def.name).toBe('Destroyer')
  })
})

// ─── Rules ────────────────────────────────────────────────────────────────────

describe('allShipsSunk', () => {
  it('returns false when no ships have been sunk', () => {
    const board = createBoard()
    const b = placeShip(board, SHIP_DEFS[4], { row: 0, col: 0 }, 'horizontal', 'cpu')!
    expect(allShipsSunk(b, 'cpu')).toBe(false)
  })

  it('returns true when all CPU ships have been sunk', () => {
    let board = createBoard()
    board = placeShip(board, SHIP_DEFS[4], { row: 0, col: 0 }, 'horizontal', 'cpu')!
    const { board: b1 } = fireAt(board, { row: 0, col: 0 }, 'player')
    const { board: b2 } = fireAt(b1, { row: 0, col: 1 }, 'player')
    expect(allShipsSunk(b2, 'cpu')).toBe(true)
  })
})

describe('shotCount', () => {
  it('returns 0 on fresh board', () => {
    const board = createBoard()
    expect(shotCount(board)).toBe(0)
  })

  it('increments per shot taken', () => {
    const board = createBoard()
    const { board: b1 } = fireAt(board, { row: 0, col: 0 }, 'player')
    const { board: b2 } = fireAt(b1, { row: 0, col: 1 }, 'player')
    expect(shotCount(b2)).toBe(2)
  })
})

describe('hitCount', () => {
  it('returns 0 on fresh board', () => {
    const board = createBoard()
    const b = placeShip(board, SHIP_DEFS[4], { row: 0, col: 0 }, 'horizontal', 'cpu')!
    expect(hitCount(b, 'cpu')).toBe(0)
  })

  it('increments when CPU ship is hit', () => {
    let board = createBoard()
    board = placeShip(board, SHIP_DEFS[4], { row: 0, col: 0 }, 'horizontal', 'cpu')!
    const { board: b1 } = fireAt(board, { row: 0, col: 0 }, 'player')
    expect(hitCount(b1, 'cpu')).toBe(1)
  })
})

describe('sunkCount', () => {
  it('returns 0 when no ships sunk', () => {
    const board = createBoard()
    const b = placeShip(board, SHIP_DEFS[4], { row: 0, col: 0 }, 'horizontal', 'cpu')!
    expect(sunkCount(b, 'cpu')).toBe(0)
  })

  it('returns 1 after sinking a 2-cell ship', () => {
    let board = createBoard()
    board = placeShip(board, SHIP_DEFS[4], { row: 0, col: 0 }, 'horizontal', 'cpu')!
    const { board: b1 } = fireAt(board, { row: 0, col: 0 }, 'player')
    const { board: b2 } = fireAt(b1, { row: 0, col: 1 }, 'player')
    expect(sunkCount(b2, 'cpu')).toBe(1)
  })
})
