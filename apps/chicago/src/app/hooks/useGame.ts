import { useState } from 'react'

type Player = 'human' | 'cpu'
type Winner = Player | 'tie' | null

interface TurnResult {
  rolls: [number, number, number]
  best: number
  hitTarget: boolean
}

interface ChicagoState {
  round: number
  target: number
  scores: Record<Player, number>
  lastTurn: Record<Player, TurnResult> | null
  message: string
  gameOver: boolean
  winner: Winner
}

const MAX_ROUNDS = 11 // targets 2 through 12

const rollTwoDice = (): number =>
  Math.floor(Math.random() * 6) + 1 + (Math.floor(Math.random() * 6) + 1)

const playTurn = (target: number): TurnResult => {
  const rolls: [number, number, number] = [rollTwoDice(), rollTwoDice(), rollTwoDice()]
  const hitTarget = rolls.includes(target)
  const best = Math.max(...rolls)
  return { rolls, best, hitTarget }
}

const createInitialState = (): ChicagoState => ({
  round: 1,
  target: 2,
  scores: { human: 0, cpu: 0 },
  lastTurn: null,
  message: 'Round 1: target 2.',
  gameOver: false,
  winner: null,
})

export const useGame = () => {
  const [state, setState] = useState<ChicagoState>(() => createInitialState())

  const playRound = () => {
    setState((prev) => {
      if (prev.gameOver) {
        return prev
      }

      const human = playTurn(prev.target)
      const cpu = playTurn(prev.target)
      const scores = { ...prev.scores }

      if (human.hitTarget) {
        scores.human += prev.target
      }
      if (cpu.hitTarget) {
        scores.cpu += prev.target
      }

      if (!human.hitTarget && !cpu.hitTarget) {
        if (human.best > cpu.best) {
          scores.human += 1
        }
        if (cpu.best > human.best) {
          scores.cpu += 1
        }
      }

      const nextRound = prev.round + 1
      const gameOver = nextRound > MAX_ROUNDS
      const winner: Winner = gameOver
        ? scores.human === scores.cpu
          ? 'tie'
          : scores.human > scores.cpu
            ? 'human'
            : 'cpu'
        : null

      const message = gameOver
        ? winner === 'tie'
          ? 'Match finished in a tie.'
          : winner === 'human'
            ? 'You win the Chicago match.'
            : 'CPU wins the Chicago match.'
        : `Round ${nextRound}: target ${prev.target + 1}.`

      return {
        round: nextRound,
        target: Math.min(12, prev.target + 1),
        scores,
        lastTurn: { human, cpu },
        message,
        gameOver,
        winner,
      }
    })
  }

  const resetGame = () => setState(createInitialState())

  return {
    state,
    playRound,
    resetGame,
  }
}

export default useGame
