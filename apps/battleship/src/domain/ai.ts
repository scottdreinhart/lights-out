/**
 * AI move selection — CPU player logic.
 * Pure functions: given a board state, return the best move.
 */

import { DIFFICULTY_PRESETS } from './constants'
import type { Board, CellState, Coord, Difficulty } from './types'

/** Check if a cell contains a CPU ship */
function isCpuShip(board: Board, coord: Coord): boolean {
  return board.ships.some(
    (ship) =>
      ship.owner === 'cpu' && ship.cells.some((c) => c.row === coord.row && c.col === coord.col),
  )
}

/** Get all cells that haven't been shot yet and don't contain CPU ships */
function getUntriedCells(board: Board): Coord[] {
  const cells: Coord[] = []
  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      const cell = board.grid[row][col]
      const coord = { row, col }
      // Include empty cells and player ships, but exclude CPU ships
      if ((cell === 'empty' || cell === 'ship') && !isCpuShip(board, coord)) {
        cells.push(coord)
      }
    }
  }
  return cells
}

/** Get adjacent untried cells around a coordinate, excluding CPU ships */
function getAdjacentUntried(board: Board, coord: Coord): Coord[] {
  const dirs: Coord[] = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ]
  return dirs
    .map((d) => ({ row: coord.row + d.row, col: coord.col + d.col }))
    .filter(
      (c) =>
        c.row >= 0 &&
        c.row < board.size &&
        c.col >= 0 &&
        c.col < board.size &&
        (board.grid[c.row][c.col] === 'empty' || board.grid[c.row][c.col] === 'ship') &&
        !isCpuShip(board, c),
    )
}

/** Check if a cell is a hit (made by either player or CPU) */
function isHit(state: CellState): boolean {
  return state === 'playerHit' || state === 'cpuHit'
}

/** Find all unsunk hit cells (hits that belong to ships not yet fully sunk) */
function getUnsunkHits(board: Board): Coord[] {
  const sunkCells = new Set<string>()
  for (const ship of board.ships) {
    if (ship.cells.every((c) => isHit(board.grid[c.row][c.col]))) {
      for (const c of ship.cells) {
        sunkCells.add(`${c.row},${c.col}`)
      }
    }
  }

  const unsunkHits: Coord[] = []
  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      if (isHit(board.grid[row][col]) && !sunkCells.has(`${row},${col}`)) {
        unsunkHits.push({ row, col })
      }
    }
  }
  return unsunkHits
}

/**
 * CPU move selection — hunt/target strategy with difficulty modulation.
 *
 * Randomization: Lower difficulties make more random, suboptimal moves.
 * SmartTargeting: Lower difficulties ignore unsunk hits and only hunt.
 * Target mode: if smartTargeting enabled and unsunk hits exist, target them.
 * Hunt mode: pick a random untried cell with checkerboard parity.
 */
export function getCpuMove(board: Board, difficulty: Difficulty): Coord {
  const preset = DIFFICULTY_PRESETS[difficulty]

  // Randomization: at lower difficulties, make more random moves (ignore strategy)
  if (Math.random() < preset.randomization) {
    const untried = getUntriedCells(board)
    return untried[Math.floor(Math.random() * untried.length)]
  }

  // SmartTargeting mode: focus around existing unsunk hits
  if (preset.smartTargeting) {
    const unsunkHits = getUnsunkHits(board)
    if (unsunkHits.length > 0) {
      // Try cells adjacent to unsunk hits
      for (const hit of unsunkHits) {
        const adjacent = getAdjacentUntried(board, hit)
        if (adjacent.length > 0) {
          return adjacent[Math.floor(Math.random() * adjacent.length)]
        }
      }
    }
  }

  // Hunt mode — checkerboard pattern for efficiency
  const untried = getUntriedCells(board)
  const checkerboard = untried.filter((c) => (c.row + c.col) % 2 === 0)
  const pool = checkerboard.length > 0 ? checkerboard : untried
  return pool[Math.floor(Math.random() * pool.length)]
}
