/**
 * Game constants — magic numbers & config extracted to a single source of truth.
 */

import type { GameStats } from './types'

export const CPU_DELAY_MS = 400

/**
 * Portfolio Game IDs — for future cross-project analytics and services.
 */

export const PORTFOLIO_GAMES = {
  SHUT_THE_BOX: 'shut-the-box',
  TIC_TAC_TOE: 'tictactoe',
  MANCALA: 'mancala',
  CONNECT_FOUR: 'connect-four',
  SIMON_SAYS: 'simon-says',
  LIGHTS_OUT: 'lights-out',
  NIM: 'nim',
  HANGMAN: 'hangman',
  MEMORY: 'memory-game',
  GAME_2048: '2048',
  REVERSI: 'reversi',
  CHECKERS: 'checkers',
  BATTLESHIP: 'battleship',
  SNAKE: 'snake',
  MONCHOLA: 'monchola',
  ROCK_PAPER_SCISSORS: 'rock-paper-scissors',
  MINESWEEPER: 'minesweeper',
  PIG: 'pig',
  FARKLE: 'farkle',
  CEE_LO: 'cee-lo',
  SHIP_CAPTAIN_CREW: 'ship-captain-crew',
  LIARS_DICE: 'liars-dice',
  BUNCO: 'bunco',
  MEXICO: 'mexico',
  CHO_HAN: 'cho-han',
  CHICAGO: 'chicago',
} as const

export const DEFAULT_STATS: GameStats = {
  wins: 0,
  losses: 0,
  streak: 0,
  bestStreak: 0,
}
