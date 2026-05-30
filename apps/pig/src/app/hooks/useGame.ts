import { useCallback, useState } from 'react'

type Player = 'human' | 'cpu'

export interface PigState {
  scores: Record<Player, number>
  turnScore: number
  currentPlayer: Player
  lastRoll: number | null
  gameOver: boolean
  winner: Player | null
  message: string
}

const TARGET_SCORE = 100
const CPU_HOLD_THRESHOLD = 20

const createInitialState = (): PigState => ({
  scores: { human: 0, cpu: 0 },
  turnScore: 0,
  currentPlayer: 'human',
  lastRoll: null,
  gameOver: false,
  winner: null,
  message: 'Roll the die. Hold to bank points before you pig out.',
})

const rollDie = (): number => Math.floor(Math.random() * 6) + 1
const otherPlayer = (player: Player): Player => (player === 'human' ? 'cpu' : 'human')

export function useGame() {
  const [state, setState] = useState<PigState>(createInitialState)

  const hold = useCallback(() => {
    setState((previous) => {
      if (previous.gameOver || previous.turnScore <= 0) {return previous}

      const player = previous.currentPlayer
      const nextScore = previous.scores[player] + previous.turnScore
      const scores = { ...previous.scores, [player]: nextScore }
      const winner: Player | null = nextScore >= TARGET_SCORE ? player : null

      return {
        ...previous,
        scores,
        turnScore: 0,
        currentPlayer: winner ? previous.currentPlayer : otherPlayer(player),
        gameOver: winner !== null,
        winner,
        message:
          winner !== null
            ? `${winner === 'human' ? 'You win' : 'CPU wins'} with ${nextScore} points!`
            : `${player === 'human' ? 'You hold' : 'CPU holds'} at ${nextScore}.`,
      }
    })
  }, [])

  const roll = useCallback(() => {
    setState((previous) => {
      if (previous.gameOver) {return previous}

      const player = previous.currentPlayer
      const rollValue = rollDie()

      if (rollValue === 1) {
        return {
          ...previous,
          lastRoll: 1,
          turnScore: 0,
          currentPlayer: otherPlayer(player),
          message: `${player === 'human' ? 'You pigged out' : 'CPU pigged out'}! Turn score lost.`,
        }
      }

      const nextTurnScore = previous.turnScore + rollValue
      return {
        ...previous,
        lastRoll: rollValue,
        turnScore: nextTurnScore,
        message: `${player === 'human' ? 'You rolled' : 'CPU rolled'} ${rollValue}. Turn score: ${nextTurnScore}.`,
      }
    })
  }, [])

  const resetGame = useCallback(() => {
    setState(createInitialState())
  }, [])

  const cpuShouldHold =
    state.currentPlayer === 'cpu' &&
    !state.gameOver &&
    (state.turnScore >= CPU_HOLD_THRESHOLD || state.scores.cpu + state.turnScore >= TARGET_SCORE)

  return { state, roll, hold, resetGame, cpuShouldHold }
}
