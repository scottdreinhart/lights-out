/**
 * Dominoes domain rules — pure functions for game mechanics.
 */

import { INITIAL_HAND_SIZE, MAX_PIPS } from './constants'
import type { Domino, GameState } from './types'

/** Generate all tiles in a standard double-6 set. */
export function generateBoneyard(): Domino[] {
  const tiles: Domino[] = []
  for (let left = 0; left <= MAX_PIPS; left++) {
    for (let right = left; right <= MAX_PIPS; right++) {
      tiles.push({ left, right })
    }
  }
  return shuffle(tiles)
}

/** Fisher-Yates shuffle. */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Create the initial game state. */
export function createGameState(): GameState {
  const boneyard = generateBoneyard()
  const playerHand = boneyard.splice(0, INITIAL_HAND_SIZE)
  const computerHand = boneyard.splice(0, INITIAL_HAND_SIZE)
  return {
    phase: 'playing',
    playerHand,
    computerHand,
    boneyard,
    table: [],
    currentPlayer: 'player',
    playerScore: 0,
    computerScore: 0,
    gameOver: false,
  }
}

/** Check if a domino can be placed at the given end of the table. */
export function canPlace(domino: Domino, tableEnd: number | null): boolean {
  if (tableEnd === null) {return true}
  return domino.left === tableEnd || domino.right === tableEnd
}

/** Get valid moves from a hand given the current table ends. */
export function getValidMoves(
  hand: Domino[],
  leftEnd: number | null,
  rightEnd: number | null,
): Domino[] {
  return hand.filter((d) => canPlace(d, leftEnd) || canPlace(d, rightEnd))
}

/** Calculate the pip count of a hand (used for scoring when passing). */
export function handPipCount(hand: Domino[]): number {
  return hand.reduce((sum, d) => sum + d.left + d.right, 0)
}

/** Check if a player has blocked (no valid moves and boneyard empty). */
export function isBlocked(
  hand: Domino[],
  leftEnd: number | null,
  rightEnd: number | null,
  boneyardEmpty: boolean,
): boolean {
  return boneyardEmpty && getValidMoves(hand, leftEnd, rightEnd).length === 0
}
