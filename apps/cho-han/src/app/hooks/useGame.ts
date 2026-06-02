import { useCallback, useState } from 'react'

type BetSide = 'cho' | 'han'

interface ChoHanState {
  round: number
  bankroll: number
  wins: number
  losses: number
  betSize: number
  lastRoll: [number, number] | null
  result: BetSide | null
  message: string
  gameOver: boolean
  winner: 'human' | 'house' | null
}

const INITIAL_BANKROLL = 100
const TARGET_BANKROLL = 200

export const useGame = () => {
  const [state, setState] = useState<ChoHanState>({
    round: 1,
    bankroll: INITIAL_BANKROLL,
    wins: 0,
    losses: 0,
    betSize: 5,
    lastRoll: null,
    result: null,
    message: '',
    gameOver: false,
    winner: null,
  })

  const setBetSize = useCallback((v: number) => {
    setState((s) => ({ ...s, betSize: Math.max(1, Math.floor(v)) }))
  }, [])

  const rollDice = () => {
    const a = Math.floor(Math.random() * 6) + 1
    const b = Math.floor(Math.random() * 6) + 1
    return [a, b] as [number, number]
  }

  const placeBet = useCallback((side: BetSide) => {
    setState((s) => {
      if (s.gameOver) {return s}

      const [a, b] = rollDice()
      const sum = a + b
      const result: BetSide = sum % 2 === 0 ? 'cho' : 'han'
      const won = result === side
      const bankroll = won ? s.bankroll + s.betSize : s.bankroll - s.betSize
      const wins = won ? s.wins + 1 : s.wins
      const losses = won ? s.losses : s.losses + 1
      const round = s.round + 1

      const gameOver = bankroll >= TARGET_BANKROLL || bankroll <= 0
      const winner = bankroll >= TARGET_BANKROLL ? 'human' : bankroll <= 0 ? 'house' : null

      return {
        ...s,
        round,
        bankroll,
        wins,
        losses,
        lastRoll: [a, b],
        result,
        message: won ? 'You won the bet!' : 'You lost the bet.',
        gameOver,
        winner,
      }
    })
  }, [])

  const resetGame = useCallback(() => {
    setState({
      round: 1,
      bankroll: INITIAL_BANKROLL,
      wins: 0,
      losses: 0,
      betSize: 5,
      lastRoll: null,
      result: null,
      message: '',
      gameOver: false,
      winner: null,
    })
  }, [])

  return { state, setBetSize, placeBet, resetGame }
}

export default useGame
