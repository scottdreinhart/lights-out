/**
 * Domain types for Go Fish game.
 */

export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  rank: CardRank
}

export type GamePhase = 'playing' | 'game-over'

export interface GameState {
  phase: GamePhase
  playerHand: Card[]
  computerHand: Card[]
  deck: Card[]
  playerSets: number
  computerSets: number
  currentPlayer: 'player' | 'computer'
  gameOver: boolean
}
