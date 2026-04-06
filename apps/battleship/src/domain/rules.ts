/**
 * Game rules — win/loss/draw detection.
 * Pure functions operating on domain types only.
 */

import type { Board, CellState } from './types'

/** Check if a cell is a hit (made by either player or CPU) */
function isHit(state: CellState): boolean {
  return state === 'playerHit' || state === 'cpuHit'
}

/** Check if a cell is a shot (hit or miss) */
function isShot(state: CellState): boolean {
  return (
    state === 'playerHit' || state === 'playerMiss' || state === 'cpuHit' || state === 'cpuMiss'
  )
}

/** Check if all ships for a specific owner have been sunk */
export function allShipsSunk(board: Board, owner: 'player' | 'cpu'): boolean {
  const ownerShips = board.ships.filter((ship) => ship.owner === owner)
  return (
    ownerShips.length > 0 &&
    ownerShips.every((ship) => ship.cells.every((c) => isHit(board.grid[c.row][c.col])))
  )
}

/** Count how many ships for a specific owner have been sunk */
export function sunkCount(board: Board, owner: 'player' | 'cpu'): number {
  return board.ships
    .filter((ship) => ship.owner === owner)
    .filter((ship) => ship.cells.every((c) => isHit(board.grid[c.row][c.col]))).length
}

/** Count total hits on a specific owner's ships */
export function hitCount(board: Board, owner: 'player' | 'cpu'): number {
  let count = 0
  for (const ship of board.ships.filter((s) => s.owner === owner)) {
    for (const c of ship.cells) {
      if (isHit(board.grid[c.row][c.col])) {
        count++
      }
    }
  }
  return count
}

/** Count total shots taken on the board */
export function shotCount(board: Board): number {
  let count = 0
  for (const row of board.grid) {
    for (const cell of row) {
      if (isShot(cell)) {
        count++
      }
    }
  }
  return count
}
