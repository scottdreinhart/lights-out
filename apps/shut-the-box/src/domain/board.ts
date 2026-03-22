/**
 * Board operations — pure functions for creating and manipulating game state.
 * No React, no DOM — purely functional transformations.
 */

import type { BoardState, Tile } from './types'

/**
 * Create a fresh board with all tiles open (true = open, false = closed)
 */
export function createBoard(): BoardState {
  return {
    tiles: {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
      9: true,
    },
    diceSum: 0,
    selectedTiles: [],
  }
}

/**
 * Set the dice sum for the current roll
 */
export function setDiceSum(board: BoardState, sum: number): BoardState {
  return {
    ...board,
    diceSum: sum,
  }
}

/**
 * Toggle tile selection
 */
export function toggleTileSelection(board: BoardState, tile: Tile): BoardState {
  const isSelected = board.selectedTiles.includes(tile)
  return {
    ...board,
    selectedTiles: isSelected
      ? board.selectedTiles.filter((t) => t !== tile)
      : [...board.selectedTiles, tile],
  }
}

/**
 * Get all open tiles (still available to play)
 */
export function getOpenTiles(board: BoardState): Tile[] {
  return (Object.keys(board.tiles) as unknown as string[])
    .map(Number)
    .filter((tile) => board.tiles[tile as Tile]) as Tile[]
}

/**
 * Check if the player may choose to roll a single die.
 * Standard rule: allowed when tiles 7, 8, and 9 are all closed.
 */
export function canRollOneDie(board: BoardState): boolean {
  return !board.tiles[7] && !board.tiles[8] && !board.tiles[9]
}

/**
 * Get all valid move combinations for a given sum
 */
export function getValidMoves(board: BoardState, sum: number): Tile[][] {
  const openTiles = getOpenTiles(board)
  const validCombinations: Tile[][] = []

  const findCombinations = (remaining: Tile[], currentSum: number, current: Tile[]) => {
    if (currentSum === sum && current.length > 0) {
      validCombinations.push([...current])
      return
    }
    if (currentSum > sum) {
      return
    }

    for (let i = 0; i < remaining.length; i++) {
      const tile = remaining[i]
      findCombinations(remaining.slice(i + 1), currentSum + tile, [...current, tile])
    }
  }

  findCombinations(openTiles, 0, [])
  return validCombinations
}

/**
 * Check if a given move is valid (tiles sum to diceSum and aren't closed)
 */
export function isValidMove(board: BoardState, tiles: Tile[]): boolean {
  const sum = tiles.reduce((acc, tile) => acc + tile, 0)
  const allOpen = tiles.every((tile) => board.tiles[tile])
  return sum === board.diceSum && allOpen && tiles.length > 0
}

/**
 * Apply move: close selected tiles and prepare for next roll
 */
export function applyMove(board: BoardState, tiles: Tile[]): BoardState {
  if (!isValidMove(board, tiles)) {
    throw new Error('Invalid move')
  }

  const newTiles = { ...board.tiles }
  tiles.forEach((tile) => {
    newTiles[tile] = false // Close the tile
  })

  return {
    tiles: newTiles,
    diceSum: 0,
    selectedTiles: [],
  }
}

/**
 * Calculate the score (sum of remaining open tiles)
 */
export function calculateScore(board: BoardState): number {
  return getOpenTiles(board).reduce((sum, tile) => sum + tile, 0)
}

/**
 * Check if the board is completely shut (all tiles closed)
 */
export function isBoardShut(board: BoardState): boolean {
  return getOpenTiles(board).length === 0
}

/**
 * Clear selected tiles without closing them
 */
export function clearSelection(board: BoardState): BoardState {
  return {
    ...board,
    selectedTiles: [],
  }
}
