/**
 * War card game rules engine.
 * Handles card dealing, round resolution, and war mechanics.
 */

import type { Card, GameState, WarSequence } from './types'
import { compareCards, getWarCards } from './constants'
import { type WarRuleConfig, getWarCardCount } from './rules/war.rules'

/**
 * Play a single round of War
 * 1. Draw top card from each deck
 * 2. Compare cards
 * 3. Handle ties with war
 */
export function playRound(state: GameState, rules: WarRuleConfig): GameState {
  // Check if game is over
  if (state.playerDeck.length === 0 || state.computerDeck.length === 0) {
    return finishGame(state)
  }

  // Draw top card from each player
  const playerCard = state.playerDeck[0]
  const computerCard = state.computerDeck[0]

  if (!playerCard || !computerCard) {
    return finishGame(state)
  }

  const newState: GameState = {
    ...state,
    playerCard,
    computerCard,
    playerDeck: state.playerDeck.slice(1),
    computerDeck: state.computerDeck.slice(1),
    roundsPlayed: state.roundsPlayed + 1,
  }

  // Compare cards
  const winner = compareCards(playerCard, computerCard)

  if (winner === 0) {
    // Cards are equal - start war
    return startWar(newState, rules, playerCard)
  } else if (winner === 1) {
    // Player wins
    return playerWinsRound(newState, [playerCard, computerCard])
  } else {
    // Computer wins
    return computerWinsRound(newState, [playerCard, computerCard])
  }
}

/**
 * Start a war sequence when cards are equal
 */
function startWar(
  state: GameState,
  rules: WarRuleConfig,
  tiedCard: Card
): GameState {
  const warCardCount = getWarCardCount(rules, tiedCard.rank)

  // Check if both players have enough cards for war
  const playerCanWar = state.playerDeck.length > warCardCount
  const computerCanWar = state.computerDeck.length > warCardCount

  if (!playerCanWar || !computerCanWar) {
    // Handle out of cards during war
    return handleOutOfCardsInWar(
      state,
      rules,
      [state.playerCard!, state.computerCard!],
      playerCanWar,
      computerCanWar
    )
  }

  // Both players can war - draw face-down cards
  const playerFaceDown = state.playerDeck.slice(0, warCardCount)
  const computerFaceDown = state.computerDeck.slice(0, warCardCount)

  // Remove face-down cards from decks
  let playerDeck = state.playerDeck.slice(warCardCount)
  let computerDeck = state.computerDeck.slice(warCardCount)

  // Draw face-up cards
  const playerFaceUp = playerDeck[0]
  const computerFaceUp = computerDeck[0]

  if (!playerFaceUp || !computerFaceUp) {
    return handleOutOfCardsInWar(state, rules, [], true, true)
  }

  playerDeck = playerDeck.slice(1)
  computerDeck = computerDeck.slice(1)

  // Store war cards on table
  const newState: GameState = {
    ...state,
    phase: 'war',
    playerDeck,
    computerDeck,
    playerCard: playerFaceUp,
    computerCard: computerFaceUp,
    tableCards: {
      player: [...state.tableCards.player, state.playerCard!, ...playerFaceDown, playerFaceUp],
      computer: [...state.tableCards.computer, state.computerCard!, ...computerFaceDown, computerFaceUp],
    },
    warsPlayed: state.warsPlayed + 1,
  }

  // Compare face-up cards
  const faceUpWinner = compareCards(playerFaceUp, computerFaceUp)

  if (faceUpWinner === 0 && rules.allowRecursiveWar) {
    // Recursive war - start another war with the face-up card
    return startWar(newState, rules, playerFaceUp)
  } else if (faceUpWinner === 1) {
    // Player wins war
    return playerWinsRound(newState, [])
  } else if (faceUpWinner === 2) {
    // Computer wins war
    return computerWinsRound(newState, [])
  } else {
    // Tie but no recursive war allowed - draw again
    return {
      ...newState,
      phase: 'playing',
    }
  }
}

/**
 * Handle situation where player runs out of cards during war
 */
function handleOutOfCardsInWar(
  state: GameState,
  rules: WarRuleConfig,
  currentCards: Card[],
  playerCanContinue: boolean,
  computerCanContinue: boolean
): GameState {
  if (rules.outOfCardsBehavior === 'lose') {
    // Player loses immediately
    if (!playerCanContinue) {
      return {
        ...state,
        gameOver: true,
        winner: 'computer',
        phase: 'gameOver',
      }
    }
    if (!computerCanContinue) {
      return {
        ...state,
        gameOver: true,
        winner: 'player',
        phase: 'gameOver',
      }
    }
  } else if (rules.outOfCardsBehavior === 'useLastCard') {
    // Use all remaining cards, last card face-up
    const playerCards = state.playerDeck.length > 0 ? state.playerDeck : []
    const computerCards = state.computerDeck.length > 0 ? state.computerDeck : []

    const playerFaceUp = playerCards[playerCards.length - 1]
    const computerFaceUp = computerCards[computerCards.length - 1]

    if (!playerFaceUp || !computerFaceUp) {
      return finishGame(state)
    }

    const winner = compareCards(playerFaceUp, computerFaceUp)

    const allPlayerCards = [state.playerCard!, ...playerCards]
    const allComputerCards = [state.computerCard!, ...computerCards]

    if (winner === 1) {
      return playerWinsRound({ ...state, playerDeck: [], computerDeck: [] }, allPlayerCards.concat(allComputerCards))
    } else {
      return computerWinsRound({ ...state, playerDeck: [], computerDeck: [] }, allPlayerCards.concat(allComputerCards))
    }
  }

  return finishGame(state)
}

/**
 * Player wins the current round
 */
function playerWinsRound(state: GameState, additionalCards: Card[]): GameState {
  const winnings = [
    state.playerCard,
    state.computerCard,
    ...state.tableCards.player,
    ...state.tableCards.computer,
    ...additionalCards,
  ].filter((c): c is Card => c !== null)

  return {
    ...state,
    phase: 'playing',
    playerDeck: [...state.playerDeck, ...winnings],
    playerWins: state.playerWins + 1,
    tableCards: { player: [], computer: [] },
    warHistory: [],
    roundCardsWon: winnings.length,
  }
}

/**
 * Computer wins the current round
 */
function computerWinsRound(state: GameState, additionalCards: Card[]): GameState {
  const winnings = [
    state.playerCard,
    state.computerCard,
    ...state.tableCards.player,
    ...state.tableCards.computer,
    ...additionalCards,
  ].filter((c): c is Card => c !== null)

  return {
    ...state,
    phase: 'playing',
    computerDeck: [...state.computerDeck, ...winnings],
    computerWins: state.computerWins + 1,
    tableCards: { player: [], computer: [] },
    warHistory: [],
    roundCardsWon: winnings.length,
  }
}

/**
 * Finish the game and determine winner
 */
function finishGame(state: GameState): GameState {
  const winner = state.playerDeck.length > 0 ? 'player' : 'computer'
  return {
    ...state,
    gameOver: true,
    phase: 'gameOver',
    winner,
  }
}

/**
 * Check if game is over
 */
export function isGameOver(state: GameState): boolean {
  return state.gameOver || state.playerDeck.length === 0 || state.computerDeck.length === 0
}

/**
 * Get the current winner (if game is over)
 */
export function getWinner(state: GameState): 'player' | 'computer' | null {
  if (!isGameOver(state)) return null
  return state.winner ?? (state.playerDeck.length > state.computerDeck.length ? 'player' : 'computer')
}

/**
 * Reset the game to initial state
 */
export function resetGame(state: GameState): GameState {
  const fullDeck = createShuffledDeck()
  const mid = Math.floor(fullDeck.length / 2)

  return {
    phase: 'playing',
    playerDeck: fullDeck.slice(0, mid),
    computerDeck: fullDeck.slice(mid),
    playerCard: null,
    computerCard: null,
    tableCards: { player: [], computer: [] },
    warHistory: [],
    roundCardsWon: 0,
    roundsPlayed: 0,
    playerWins: 0,
    computerWins: 0,
    ties: 0,
    warsPlayed: 0,
    gameOver: false,
    winner: null,
  }
}

/**
 * Create and shuffle a standard deck
 */
function createShuffledDeck(): Card[] {
  const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const
  const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const

  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank })
    }
  }

  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }

  return deck
}
