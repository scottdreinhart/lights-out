import type { DieValue } from '@games/common'
import { useState } from 'react'

type Player = 'human' | 'cpu'
type Winner = Player | null

interface Bid {
  quantity: number
  face: DieValue
}

interface Reveal {
  bid: Bid
  matchingDice: number
  caller: Player
  loser: Player
}

interface LiarsDiceState {
  round: number
  dice: Record<Player, DieValue[]>
  diceCount: Record<Player, number>
  currentPlayer: Player
  currentBid: Bid | null
  lastReveal: Reveal | null
  message: string
  gameOver: boolean
  winner: Winner
}

const STARTING_DICE = 5

const rollDie = (): DieValue => (Math.floor(Math.random() * 6) + 1) as DieValue

const rollHand = (count: number): DieValue[] => Array.from({ length: count }, () => rollDie())

const countMatches = (allDice: DieValue[], face: DieValue): number => {
  if (face === 1) {
    return allDice.filter((d) => d === 1).length
  }
  return allDice.filter((d) => d === face || d === 1).length
}

const isHigherBid = (current: Bid | null, next: Bid): boolean => {
  if (!current) {
    return next.quantity > 0 && next.face >= 1 && next.face <= 6
  }
  if (next.quantity > current.quantity) {
    return true
  }
  return next.quantity === current.quantity && next.face > current.face
}

const createInitialState = (): LiarsDiceState => ({
  round: 1,
  dice: {
    human: rollHand(STARTING_DICE),
    cpu: rollHand(STARTING_DICE),
  },
  diceCount: { human: STARTING_DICE, cpu: STARTING_DICE },
  currentPlayer: 'human',
  currentBid: null,
  lastReveal: null,
  message: 'Place the first bid.',
  gameOver: false,
  winner: null,
})

export const useGame = () => {
  const [state, setState] = useState<LiarsDiceState>(() => createInitialState())

  const startNextRound = (prev: LiarsDiceState, starter: Player): LiarsDiceState => ({
    ...prev,
    round: prev.round + 1,
    dice: {
      human: rollHand(prev.diceCount.human),
      cpu: rollHand(prev.diceCount.cpu),
    },
    currentPlayer: starter,
    currentBid: null,
    message: starter === 'human' ? 'Your turn to open bidding.' : 'CPU opens the bidding.',
  })

  const resolveChallenge = (prev: LiarsDiceState, caller: Player): LiarsDiceState => {
    if (!prev.currentBid) {
      return prev
    }

    const allDice = [...prev.dice.human, ...prev.dice.cpu]
    const matches = countMatches(allDice, prev.currentBid.face)
    const bidder: Player = caller === 'human' ? 'cpu' : 'human'
    const bidIsTrue = matches >= prev.currentBid.quantity
    const loser: Player = bidIsTrue ? caller : bidder

    const nextDiceCount = {
      ...prev.diceCount,
      [loser]: Math.max(0, prev.diceCount[loser] - 1),
    }

    const gameOver = nextDiceCount.human === 0 || nextDiceCount.cpu === 0
    const winner: Winner = gameOver ? (nextDiceCount.human === 0 ? 'cpu' : 'human') : null

    const updated: LiarsDiceState = {
      ...prev,
      diceCount: nextDiceCount,
      lastReveal: {
        bid: prev.currentBid,
        matchingDice: matches,
        caller,
        loser,
      },
      message: bidIsTrue
        ? `${caller === 'human' ? 'You' : 'CPU'} called liar incorrectly.`
        : `${caller === 'human' ? 'You' : 'CPU'} called liar correctly.`,
      gameOver,
      winner,
    }

    if (gameOver) {
      return updated
    }

    const starter: Player = loser
    return startNextRound(updated, starter)
  }

  const placeBid = (quantity: number, face: DieValue) => {
    setState((prev) => {
      if (prev.gameOver || prev.currentPlayer !== 'human') {
        return prev
      }

      const bid: Bid = { quantity, face }
      if (!isHigherBid(prev.currentBid, bid)) {
        return { ...prev, message: 'Bid must be higher than current bid.' }
      }

      return {
        ...prev,
        currentBid: bid,
        currentPlayer: 'cpu',
        message: `You bid ${quantity} × ${face}s.`,
      }
    })
  }

  const callLiar = () => {
    setState((prev) => {
      if (prev.gameOver || prev.currentPlayer !== 'human' || !prev.currentBid) {
        return prev
      }
      return resolveChallenge(prev, 'human')
    })
  }

  const cpuTurn = () => {
    setState((prev) => {
      if (prev.gameOver || prev.currentPlayer !== 'cpu') {
        return prev
      }

      const cpuDice = prev.dice.cpu
      const highestFace = ([2, 3, 4, 5, 6, 1] as DieValue[]).reduce(
        (best, face) => {
          const qty = cpuDice.filter((d) => d === face).length
          return qty > best.qty ? { face, qty } : best
        },
        { face: 2 as DieValue, qty: 0 },
      )

      if (!prev.currentBid) {
        const openBid: Bid = { quantity: Math.max(1, highestFace.qty), face: highestFace.face }
        return {
          ...prev,
          currentBid: openBid,
          currentPlayer: 'human',
          message: `CPU opens with ${openBid.quantity} × ${openBid.face}s.`,
        }
      }

      const estimatedMatches =
        countMatches(cpuDice, prev.currentBid.face) +
        Math.round((prev.diceCount.human * (prev.currentBid.face === 1 ? 1 : 2)) / 6)

      if (estimatedMatches < prev.currentBid.quantity) {
        return resolveChallenge(prev, 'cpu')
      }

      const nextBid: Bid =
        prev.currentBid.face < 6
          ? { quantity: prev.currentBid.quantity, face: (prev.currentBid.face + 1) as DieValue }
          : { quantity: prev.currentBid.quantity + 1, face: 2 as DieValue }

      return {
        ...prev,
        currentBid: nextBid,
        currentPlayer: 'human',
        message: `CPU bids ${nextBid.quantity} × ${nextBid.face}s.`,
      }
    })
  }

  const resetGame = () => setState(createInitialState())

  return {
    state,
    placeBid,
    callLiar,
    cpuTurn,
    resetGame,
  }
}
