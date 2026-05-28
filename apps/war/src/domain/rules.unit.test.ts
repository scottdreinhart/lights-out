import { describe, expect, it } from 'vitest'
import { compareCards, createDeck, createInitialGameState } from './constants'
import { isCardConservationValid, playRound } from './rules'
import { DEFAULT_RULES } from './rules/war.rules'
import type { Card, GameState } from './types'

const totalCards = (state: GameState): number =>
  state.playerDeck.length +
  state.playerWonPile.length +
  state.computerDeck.length +
  state.computerWonPile.length

const makeCard = (id: string, rank: Card['rank'], suit: Card['suit']): Card => ({ id, rank, suit })

describe('War Card Game', () => {
  it('creates a standard 52-card deck with no jokers', () => {
    const deck = createDeck()
    expect(deck).toHaveLength(52)
    expect(deck.every((card) => card.rank !== 'joker')).toBe(true)
  })

  it('initializes with an even split and conserved card count', () => {
    const state = createInitialGameState()
    expect(state.playerDeck).toHaveLength(26)
    expect(state.computerDeck).toHaveLength(26)
    expect(state.playerWonPile).toHaveLength(0)
    expect(state.computerWonPile).toHaveLength(0)
    expect(totalCards(state)).toBe(52)
    expect(isCardConservationValid(state)).toBe(true)
  })

  it('preserves total card count through multiple rounds', () => {
    let state = createInitialGameState()

    for (let i = 0; i < 200; i++) {
      state = playRound(state, DEFAULT_RULES)
      expect(totalCards(state)).toBe(52)
      expect(isCardConservationValid(state)).toBe(true)
      if (state.gameOver) {
        break
      }
    }
  })

  it('refills from captured pile when draw pile is empty', () => {
    const initialTotal = 5
    const state: GameState = {
      phase: 'playing',
      playerDeck: [makeCard('p-draw', '5', 'hearts')],
      computerDeck: [makeCard('c-draw-1', '4', 'spades'), makeCard('c-draw-2', '3', 'clubs')],
      playerWonPile: [makeCard('p-c1', '7', 'clubs'), makeCard('p-c2', '8', 'diamonds')],
      computerWonPile: [],
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

    const afterFirst = playRound(state, DEFAULT_RULES)
    expect(afterFirst.playerDeck).toHaveLength(0)
    expect(afterFirst.playerWonPile.length).toBeGreaterThan(2)
    expect(totalCards(afterFirst)).toBe(initialTotal)

    const afterSecond = playRound(afterFirst, DEFAULT_RULES)
    expect(afterSecond.roundsPlayed).toBe(2)
    expect(afterSecond.playerDeck.length + afterSecond.playerWonPile.length).toBeGreaterThan(0)
    expect(totalCards(afterSecond)).toBe(initialTotal)
  })

  it('compares card ranks correctly (A high, suits ignored)', () => {
    const ace = makeCard('ace', 'A', 'hearts')
    const ten = makeCard('ten', '10', 'spades')
    const tie1 = makeCard('tie1', 'Q', 'clubs')
    const tie2 = makeCard('tie2', 'Q', 'diamonds')

    expect(compareCards(ace, ten)).toBe(1)
    expect(compareCards(ten, ace)).toBe(2)
    expect(compareCards(tie1, tie2)).toBe(0)
  })
})
