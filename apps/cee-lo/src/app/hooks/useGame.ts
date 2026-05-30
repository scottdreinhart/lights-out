import { useCallback, useState } from 'react'

type Player = 'human' | 'cpu'

interface LastRollRow {
  dice: number[]
  label: string
}

interface CeeLoState {
  round: number
  wins: { human: number; cpu: number }
  lastRoll: { human: LastRollRow | null; cpu: LastRollRow | null }
  message: string
  gameOver: boolean
  winner: Player | null
}

const TARGET_ROUNDS = 3

const rollDice = (count = 3) => Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1)

const labelForDice = (dice: number[]) => `${dice.join(', ')}`

export const useGame = () => {
  const [state, setState] = useState<CeeLoState>({
    round: 1,
    wins: { human: 0, cpu: 0 },
    lastRoll: { human: null, cpu: null },
    message: '',
    gameOver: false,
    winner: null,
  })

  const canPlay = !state.gameOver

  const playRound = useCallback(() => {
    if (state.gameOver) {return}

    const humanDice = rollDice()
    const cpuDice = rollDice()
    const humanSum = humanDice.reduce((a, b) => a + b, 0)
    const cpuSum = cpuDice.reduce((a, b) => a + b, 0)

    let message = ''
    const wins = { ...state.wins }

    if (humanSum > cpuSum) {
      wins.human += 1
      message = 'YOU WIN!'
    } else if (cpuSum > humanSum) {
      wins.cpu += 1
      message = 'YOU LOSE!'
    } else {
      message = `Round tied at ${humanSum}`
    }

    const gameOver = wins.human >= TARGET_ROUNDS || wins.cpu >= TARGET_ROUNDS
    const winner = wins.human >= TARGET_ROUNDS ? 'human' : wins.cpu >= TARGET_ROUNDS ? 'cpu' : null

    setState((s) => ({
      ...s,
      round: s.round + 1,
      wins,
      lastRoll: { human: { dice: humanDice, label: labelForDice(humanDice) }, cpu: { dice: cpuDice, label: labelForDice(cpuDice) } },
      message,
      gameOver,
      winner,
    }))
  }, [state.gameOver, state.wins])

  const resetGame = useCallback(() => {
    setState({
      round: 1,
      wins: { human: 0, cpu: 0 },
      lastRoll: { human: null, cpu: null },
      message: '',
      gameOver: false,
      winner: null,
    })
  }, [])

  return { state, canPlay, playRound, resetGame }
}

export default useGame
