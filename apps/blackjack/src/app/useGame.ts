/** Game Hook - Orchestrates game logic and state management */

import type { Card, GameAction, GameState, HandHistory, UndoRedoState } from '@/domain'
import {
  calculatePayout,
  canDoubleDown,
  canHit,
  canRedoInPhase,
  canSplit,
  canStand,
  canUndoInPhase,
  createGameState,
  createUndoRedoState,
  determineOutcome,
  getHandValues,
  isBust,
  isNaturalBlackjack,
  recordState,
  redo,
  undo,
} from '@/domain'
import { useCallback, useEffect, useRef, useState } from 'react'
import { saveGameResult } from './api'
import { useSoundEffects } from './hooks'
import { validateBetAmount } from './validators'

const DECK_SHOE_SIZE = 8 // Standard Vegas shoe

const createShoe = (): Card[] => {
  const shoe: Card[] = []
  const suits: Array<'hearts' | 'diamonds' | 'clubs' | 'spades'> = [
    'hearts',
    'diamonds',
    'clubs',
    'spades',
  ]
  // Note: Rank ordering must match card-deck-core Rank type ("2" | "3" | ... | "J" | "Q" | "K" | "A")
  const ranks = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
  ] as const

  for (let deckNum = 0; deckNum < DECK_SHOE_SIZE; deckNum++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        shoe.push({
          id: `${suit}-${rank}-${deckNum}-${Math.random()}`,
          suit,
          rank,
        })
      }
    }
  }

  return shoe.sort(() => Math.random() - 0.5)
}

export function useGame(
  initialBalance: number = 1000,
  onGameComplete?: (handHistory: HandHistory) => void,
) {
  const [gameState, setGameState] = useState<GameState>(() => createGameState(initialBalance))
  const [undoRedoState, setUndoRedoState] = useState<UndoRedoState>(() =>
    createUndoRedoState(createGameState(initialBalance)),
  )
  const [shoe, setShoe] = useState<Card[]>(() => createShoe())
  const soundEffects = useSoundEffects()
  const shoeIndexRef = useRef(0)

  const drawCard = useCallback((): Card => {
    if (shoeIndexRef.current >= shoe.length) {
      throw new Error('Shoe depleted - reshuffle required')
    }

    const card = shoe[shoeIndexRef.current]
    shoeIndexRef.current += 1
    return card
  }, [shoe])

  const updateGameState = useCallback((newState: GameState, action?: GameAction) => {
    setGameState(newState)
    // Only record action for player moves; phase transitions don't need recording
    setUndoRedoState((current) => recordState(current, newState, action))
  }, [])

  const performUndo = useCallback(() => {
    if (!canUndoInPhase(gameState.phase)) {
      return
    }

    setUndoRedoState((current) => {
      const newUndoRedoState = undo(current)
      setGameState(newUndoRedoState.present)
      return newUndoRedoState
    })
  }, [gameState.phase])

  const performRedo = useCallback(() => {
    if (!canRedoInPhase(gameState.phase)) {
      return
    }

    setUndoRedoState((current) => {
      const newUndoRedoState = redo(current)
      setGameState(newUndoRedoState.present)
      return newUndoRedoState
    })
  }, [gameState.phase])

  const placeBet = useCallback(
    (amount: number) => {
      // Validate bet amount according to game rules
      const validated = validateBetAmount(amount)
      if (!validated.ok) {
        throw new Error(`Invalid bet: ${validated.error}`)
      }

      // Play bet sound effect
      soundEffects.onBet()

      const newState: GameState = {
        ...gameState,
        deck: shoe.slice(shoeIndexRef.current),
        players: [
          {
            ...gameState.players[0],
            currentHand: {
              ...gameState.players[0].currentHand,
              bet: validated.value,
            },
          },
        ],
        phase: 'dealing',
      }

      updateGameState(newState)
    },
    [gameState, soundEffects, updateGameState],
  )

  const dealHands = useCallback(() => {
    const playerCard1 = drawCard()
    const dealerCard1 = drawCard()
    const playerCard2 = drawCard()
    const dealerCard2 = drawCard()

    // Play deal sound effect
    soundEffects.onDeal()

    const newState: GameState = {
      ...gameState,
      deck: shoe.slice(shoeIndexRef.current),
      phase: 'playing',
      players: [
        {
          ...gameState.players[0],
          currentHand: {
            ...gameState.players[0].currentHand,
            cards: [playerCard1, playerCard2],
            status: isNaturalBlackjack([playerCard1, playerCard2]) ? 'blackjack' : 'playing',
          },
        },
      ],
      dealer: {
        ...gameState.dealer,
        hand: [dealerCard1, dealerCard2],
      },
    }

    updateGameState(newState)
  }, [drawCard, gameState, shoe, soundEffects, updateGameState])

  const hit = useCallback(() => {
    // Validate that hit is a valid action in current state
    if (!canHit(gameState.players[0].currentHand.cards)) {
      throw new Error('Cannot hit in current game state')
    }

    const card = drawCard()

    // Play hit sound effect
    soundEffects.onHit()

    const updatedCards = [...gameState.players[0].currentHand.cards, card]
    const newStatus = isBust(updatedCards) ? 'bust' : 'playing'

    const newState: GameState = {
      ...gameState,
      players: [
        {
          ...gameState.players[0],
          currentHand: {
            ...gameState.players[0].currentHand,
            cards: updatedCards,
            status: newStatus,
          },
        },
      ],
      phase: newStatus === 'bust' ? 'settling' : 'playing',
    }

    updateGameState(newState, 'hit')
  }, [drawCard, gameState, soundEffects, updateGameState])

  const stand = useCallback(() => {
    // Validate that stand is a valid action in current state
    if (!canStand(gameState.players[0].currentHand.cards)) {
      throw new Error('Cannot stand in current game state')
    }

    // Play stand sound effect
    soundEffects.onStand()

    const newState: GameState = {
      ...gameState,
      phase: 'playing',
      players: [
        {
          ...gameState.players[0],
          currentHand: {
            ...gameState.players[0].currentHand,
            status: 'stand',
          },
        },
      ],
    }

    updateGameState(newState)
  }, [gameState, soundEffects, updateGameState])

  const doubleDown = useCallback(() => {
    // Validate that double down is a valid action in current state
    if (!canDoubleDown(gameState.players[0].currentHand.cards)) {
      throw new Error('Cannot double down in current game state')
    }

    const card = drawCard()

    // Play double down sound effect
    soundEffects.onDoubleDown()

    const updatedCards = [...gameState.players[0].currentHand.cards, card]
    const newStatus = isBust(updatedCards) ? 'bust' : 'stand'

    const newState: GameState = {
      ...gameState,
      phase: 'playing',
      players: [
        {
          ...gameState.players[0],
          currentHand: {
            ...gameState.players[0].currentHand,
            cards: updatedCards,
            bet: gameState.players[0].currentHand.bet * 2,
            status: newStatus,
          },
        },
      ],
    }

    updateGameState(newState, 'double')
  }, [drawCard, gameState, soundEffects, updateGameState])

  const split = useCallback(() => {
    // Validate that split is a valid action in current state
    if (!canSplit(gameState.players[0].currentHand.cards)) {
      throw new Error('Cannot split in current game state')
    }

    // Play split sound effect
    soundEffects.onSplit()

    const [card1, card2] = gameState.players[0].currentHand.cards
    const newState: GameState = {
      ...gameState,
      players: [
        {
          ...gameState.players[0],
          currentHand: {
            ...gameState.players[0].currentHand,
            cards: [card1],
          },
          splitHands: [
            {
              id: `split-${Date.now()}`,
              cards: [card2],
              bet: gameState.players[0].currentHand.bet,
              status: 'playing',
            },
          ],
        },
      ],
    }

    updateGameState(newState, 'split')
  }, [gameState, soundEffects, updateGameState])

  const playDealer = useCallback(() => {
    // Simple dealer AI: hit on soft 17
    const dealerHand = [...gameState.dealer.hand]
    const MAX_HITS = 5 // Reasonable limit (dealer typically stays 2-5 cards)

    for (let i = 0; i < MAX_HITS; i++) {
      const handValue = getHandValues(dealerHand)
      const value = handValue.soft || handValue.hard // Use soft total if available, else hard
      if (value >= 17 || isBust(dealerHand)) {
        break
      }
      dealerHand.push(drawCard())
      // Play dealer hit sound effect
      soundEffects.onDealerHit()
    }

    // Determine outcome
    const outcome = determineOutcome(gameState.players[0].currentHand.cards, dealerHand)
    const isBlackjack = isNaturalBlackjack(gameState.players[0].currentHand.cards)
    const payout = calculatePayout(gameState.players[0].currentHand.bet, outcome, isBlackjack)

    // Play outcome sound effect
    if (outcome === 'win' && isBlackjack) {
      soundEffects.onBlackjack()
    } else if (outcome === 'win') {
      soundEffects.onWin()
    } else if (outcome === 'loss') {
      soundEffects.onLose()
    } else if (outcome === 'push') {
      soundEffects.onPush()
    }

    // Save game result to server via secure API
    saveGameResult(gameState.players[0].id, {
      outcome: outcome === 'push' ? 'draw' : outcome,
      winnings: payout,
      handsPlayed: 1,
    }).catch((error) => {
      // Log error but don't block game flow
      console.error('Failed to save game result:', error)
    })

    // Create hand history for statistics tracking
    const handHistory: HandHistory = {
      gameId: gameState.id,
      handsPlayed: 1,
      handsWon: outcome === 'win' ? 1 : 0,
      handsLost: outcome === 'loss' ? 1 : 0,
      handsPushed: outcome === 'push' ? 1 : 0,
      blackjackCount: isBlackjack ? 1 : 0,
      totalAmountWon: Math.max(0, payout),
      totalAmountLost: payout < 0 ? Math.abs(payout) : 0,
      timestamp: new Date(),
      amounts: {
        bet: gameState.players[0].currentHand.bet,
        payout: payout,
      },
      outcomes: [outcome === 'push' ? 'draw' : outcome],
    }

    // Notify parent component of game completion for stats/history tracking
    onGameComplete?.(handHistory)

    // Collect all cards that were played this hand and move to discard pile
    const playedCards = [...gameState.players[0].currentHand.cards, ...dealerHand]
    const updatedDiscardPile = [...gameState.discardPile, ...playedCards]

    const newState: GameState = {
      ...gameState,
      phase: 'completed',
      discardPile: updatedDiscardPile,
      dealer: {
        hand: dealerHand,
        status: isBust(dealerHand) ? 'bust' : 'stand',
      },
      players: [
        {
          ...gameState.players[0],
          balance: gameState.players[0].balance + payout,
          result: outcome,
          payout,
          currentHand: {
            ...gameState.players[0].currentHand,
            status: 'settled',
          },
        },
      ],
    }

    updateGameState(newState)
  }, [gameState, drawCard, soundEffects, onGameComplete, updateGameState])

  const newRound = useCallback(() => {
    // Check if shoe has enough cards for another hand (need at least 4 cards: 2 player + 2 dealer)
    const remainingCards = shoe.length - shoeIndexRef.current
    if (remainingCards < 4) {
      // Shoe is depleted - need new table with fresh shoe
      const newShoe = createShoe()
      setShoe(newShoe)
      shoeIndexRef.current = 0
      const newState = createGameState(gameState.players[0].balance)
      updateGameState(newState)
    } else {
      // Continue with same shoe
      const newState = createGameState(gameState.players[0].balance)
      // Preserve the shoe deck reference for tracking
      const updatedState: GameState = {
        ...newState,
        deck: shoe.slice(shoeIndexRef.current),
      }
      updateGameState(updatedState)
    }
  }, [gameState.players[0].balance, shoe, updateGameState])

  const getAvailableActions = useCallback((): GameAction[] => {
    if (gameState.phase !== 'playing') {
      return []
    }

    const actions: GameAction[] = []
    const hand = gameState.players[0].currentHand.cards

    if (canHit(hand)) {
      actions.push('hit')
    }
    if (canStand(hand)) {
      actions.push('stand')
    }
    if (canDoubleDown(hand)) {
      actions.push('double')
    }
    if (canSplit(hand)) {
      actions.push('split')
    }

    return actions
  }, [gameState])

  // Auto-deal when phase transitions to 'dealing'
  useEffect(() => {
    if (gameState.phase === 'dealing' && gameState.players[0].currentHand.bet > 0) {
      // Small delay to ensure state is settled before dealing
      const dealTimer = setTimeout(() => {
        dealHands()
      }, 300)
      return () => clearTimeout(dealTimer)
    }
  }, [gameState.phase, gameState.players[0].currentHand.bet, dealHands])

  // Auto-play dealer's hand when player finishes playing
  // This can be triggered by stand, bust, or complete split hands
  // Dealer plays automatically in most implementations after player is done

  return {
    gameState,
    undoRedoState,
    placeBet,
    dealHands,
    hit,
    stand,
    doubleDown,
    split,
    playDealer,
    newRound,
    getAvailableActions,
    canUndo: canUndoInPhase(gameState.phase),
    canRedo: canRedoInPhase(gameState.phase),
    undo: performUndo,
    redo: performRedo,
  }
}
