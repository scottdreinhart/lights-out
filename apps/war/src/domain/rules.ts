/**
 * War card game rules engine.
 * Maintains strict 52-card conservation while ownership shifts between players.
 */

import { compareCards, createDeck, shuffleDeck } from './constants'
import { type WarRuleConfig, getWarCardCount } from './rules/war.rules'
import type { Card, GameState } from './types'

type Participant = 'player' | 'computer'

interface DeckBuckets {
  drawPile: Card[]
  wonPile: Card[]
}

const EMPTY_TABLE = { player: [] as Card[], computer: [] as Card[] }

function getBuckets(state: GameState, participant: Participant): DeckBuckets {
  if (participant === 'player') {
    return {
      drawPile: state.playerDeck,
      wonPile: state.playerWonPile,
    }
  }

  return {
    drawPile: state.computerDeck,
    wonPile: state.computerWonPile,
  }
}

function setBuckets(state: GameState, participant: Participant, buckets: DeckBuckets): GameState {
  if (participant === 'player') {
    return {
      ...state,
      playerDeck: buckets.drawPile,
      playerWonPile: buckets.wonPile,
    }
  }

  return {
    ...state,
    computerDeck: buckets.drawPile,
    computerWonPile: buckets.wonPile,
  }
}

function getOwnedCount(state: GameState, participant: Participant): number {
  const { drawPile, wonPile } = getBuckets(state, participant)
  return drawPile.length + wonPile.length
}

function getTotalCardCount(state: GameState): number {
  return getOwnedCount(state, 'player') + getOwnedCount(state, 'computer')
}

function refillDrawPile(buckets: DeckBuckets, rules: WarRuleConfig): DeckBuckets {
  if (buckets.drawPile.length > 0 || buckets.wonPile.length === 0 || !rules.reshuffleOnEmpty) {
    return buckets
  }

  return {
    drawPile: shuffleDeck(buckets.wonPile),
    wonPile: [],
  }
}

function drawOneCard(
  buckets: DeckBuckets,
  rules: WarRuleConfig,
): { card: Card | null; buckets: DeckBuckets } {
  const withRefill = refillDrawPile(buckets, rules)
  const card = withRefill.drawPile[0] ?? null

  if (!card) {
    return { card: null, buckets: withRefill }
  }

  return {
    card,
    buckets: {
      ...withRefill,
      drawPile: withRefill.drawPile.slice(1),
    },
  }
}

function drawWarBundle(
  buckets: DeckBuckets,
  faceDownCount: number,
  rules: WarRuleConfig,
): { faceDown: Card[]; faceUp: Card; buckets: DeckBuckets } | null {
  const available = buckets.drawPile.length + buckets.wonPile.length
  const needed = faceDownCount + 1

  if (available < needed) {
    return null
  }

  let next = buckets
  const faceDown: Card[] = []

  for (let i = 0; i < faceDownCount; i++) {
    const draw = drawOneCard(next, rules)
    if (!draw.card) {
      return null
    }
    faceDown.push(draw.card)
    next = draw.buckets
  }

  const faceUpDraw = drawOneCard(next, rules)
  if (!faceUpDraw.card) {
    return null
  }

  return {
    faceDown,
    faceUp: faceUpDraw.card,
    buckets: faceUpDraw.buckets,
  }
}

/**
 * Play a single round of War
 * 1. Draw top card from each draw pile (refill from won pile when needed)
 * 2. Compare cards
 * 3. Handle ties with war
 */
export function playRound(state: GameState, rules: WarRuleConfig): GameState {
  if (state.gameOver) {
    return state
  }

  let working = state

  // Refill empty draw piles from won piles before each round.
  working = setBuckets(working, 'player', refillDrawPile(getBuckets(working, 'player'), rules))
  working = setBuckets(working, 'computer', refillDrawPile(getBuckets(working, 'computer'), rules))

  if (getOwnedCount(working, 'player') === 0 || getOwnedCount(working, 'computer') === 0) {
    return finishGame(working)
  }

  const playerDraw = drawOneCard(getBuckets(working, 'player'), rules)
  working = setBuckets(working, 'player', playerDraw.buckets)

  const computerDraw = drawOneCard(getBuckets(working, 'computer'), rules)
  working = setBuckets(working, 'computer', computerDraw.buckets)

  if (!playerDraw.card || !computerDraw.card) {
    return finishGame(working)
  }

  const newState: GameState = {
    ...working,
    phase: 'playing',
    playerCard: playerDraw.card,
    computerCard: computerDraw.card,
    roundsPlayed: working.roundsPlayed + 1,
  }

  const winner = compareCards(playerDraw.card, computerDraw.card)

  if (winner === 0) {
    return startWar(newState, rules, playerDraw.card)
  }

  return winner === 1 ? playerWinsRound(newState, []) : computerWinsRound(newState, [])
}

/**
 * Start a war sequence when cards are equal.
 * tableCards holds only previously contested cards; playerCard/computerCard hold current face-up cards.
 */
function startWar(state: GameState, rules: WarRuleConfig, tiedCard: Card): GameState {
  const warCardCount = getWarCardCount(rules, tiedCard.rank)

  const playerCurrent = state.playerCard ? [state.playerCard] : []
  const computerCurrent = state.computerCard ? [state.computerCard] : []

  const playerBundle = drawWarBundle(getBuckets(state, 'player'), warCardCount, rules)
  const computerBundle = drawWarBundle(getBuckets(state, 'computer'), warCardCount, rules)

  if (!playerBundle || !computerBundle) {
    return handleOutOfCardsInWar(state, rules, Boolean(playerBundle), Boolean(computerBundle))
  }

  let newState: GameState = {
    ...state,
    phase: 'war',
    playerCard: playerBundle.faceUp,
    computerCard: computerBundle.faceUp,
    tableCards: {
      player: [...state.tableCards.player, ...playerCurrent, ...playerBundle.faceDown],
      computer: [...state.tableCards.computer, ...computerCurrent, ...computerBundle.faceDown],
    },
    warsPlayed: state.warsPlayed + 1,
  }

  newState = setBuckets(newState, 'player', playerBundle.buckets)
  newState = setBuckets(newState, 'computer', computerBundle.buckets)

  const faceUpWinner = compareCards(playerBundle.faceUp, computerBundle.faceUp)

  if (faceUpWinner === 0 && rules.allowRecursiveWar) {
    return startWar(newState, rules, playerBundle.faceUp)
  }

  if (faceUpWinner === 1) {
    return playerWinsRound(newState, [])
  }

  if (faceUpWinner === 2) {
    return computerWinsRound(newState, [])
  }

  return {
    ...newState,
    phase: 'playing',
  }
}

/**
 * Handle situation where a player runs out of cards during war.
 */
function handleOutOfCardsInWar(
  state: GameState,
  rules: WarRuleConfig,
  playerCanContinue: boolean,
  computerCanContinue: boolean,
): GameState {
  if (rules.outOfCardsBehavior === 'lose') {
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
    const playerAllCards = [
      ...state.tableCards.player,
      ...(state.playerCard ? [state.playerCard] : []),
      ...state.playerDeck,
      ...state.playerWonPile,
    ]
    const computerAllCards = [
      ...state.tableCards.computer,
      ...(state.computerCard ? [state.computerCard] : []),
      ...state.computerDeck,
      ...state.computerWonPile,
    ]

    const playerFaceUp = playerAllCards[playerAllCards.length - 1]
    const computerFaceUp = computerAllCards[computerAllCards.length - 1]

    if (!playerFaceUp || !computerFaceUp) {
      return finishGame(state)
    }

    const winner = compareCards(playerFaceUp, computerFaceUp)
    const spoils = playerAllCards.concat(computerAllCards)

    const base: GameState = {
      ...state,
      playerDeck: [],
      computerDeck: [],
      playerWonPile: [],
      computerWonPile: [],
      playerCard: null,
      computerCard: null,
      tableCards: EMPTY_TABLE,
      warHistory: [],
    }

    return winner === 1 ? playerWinsRound(base, spoils) : computerWinsRound(base, spoils)
  }

  return finishGame(state)
}

function collectRoundSpoils(state: GameState, additionalCards: Card[]): Card[] {
  return [
    ...state.tableCards.player,
    ...state.tableCards.computer,
    ...(state.playerCard ? [state.playerCard] : []),
    ...(state.computerCard ? [state.computerCard] : []),
    ...additionalCards,
  ]
}

/**
 * Player wins the current round.
 * Spoils are captured into won pile and shuffled into draw pile only when draw pile is empty.
 */
function playerWinsRound(state: GameState, additionalCards: Card[]): GameState {
  const winnings = collectRoundSpoils(state, additionalCards)

  return {
    ...state,
    phase: 'playing',
    playerWonPile: [...state.playerWonPile, ...winnings],
    playerWins: state.playerWins + 1,
    playerCard: null,
    computerCard: null,
    tableCards: EMPTY_TABLE,
    warHistory: [],
    roundCardsWon: winnings.length,
  }
}

/**
 * Computer wins the current round.
 */
function computerWinsRound(state: GameState, additionalCards: Card[]): GameState {
  const winnings = collectRoundSpoils(state, additionalCards)

  return {
    ...state,
    phase: 'playing',
    computerWonPile: [...state.computerWonPile, ...winnings],
    computerWins: state.computerWins + 1,
    playerCard: null,
    computerCard: null,
    tableCards: EMPTY_TABLE,
    warHistory: [],
    roundCardsWon: winnings.length,
  }
}

/**
 * Finish the game and determine winner.
 */
function finishGame(state: GameState): GameState {
  const playerTotal = getOwnedCount(state, 'player')
  const computerTotal = getOwnedCount(state, 'computer')
  const winner = playerTotal >= computerTotal ? 'player' : 'computer'

  return {
    ...state,
    gameOver: true,
    phase: 'gameOver',
    winner,
  }
}

/**
 * Check if game is over.
 */
export function isGameOver(state: GameState): boolean {
  return (
    state.gameOver || getOwnedCount(state, 'player') === 0 || getOwnedCount(state, 'computer') === 0
  )
}

/**
 * Get the current winner (if game is over).
 */
export function getWinner(state: GameState): 'player' | 'computer' | null {
  if (!isGameOver(state)) {
    return null
  }

  const playerTotal = getOwnedCount(state, 'player')
  const computerTotal = getOwnedCount(state, 'computer')
  return state.winner ?? (playerTotal >= computerTotal ? 'player' : 'computer')
}

/**
 * Reset the game to initial state.
 */
export function resetGame(): GameState {
  const fullDeck = createDeck()
  const mid = Math.floor(fullDeck.length / 2)

  return {
    phase: 'playing',
    playerDeck: fullDeck.slice(0, mid),
    computerDeck: fullDeck.slice(mid),
    playerWonPile: [],
    computerWonPile: [],
    playerCard: null,
    computerCard: null,
    tableCards: EMPTY_TABLE,
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
 * Development invariant: total cards in game should always remain 52.
 */
export function isCardConservationValid(state: GameState): boolean {
  return getTotalCardCount(state) === 52
}
