import { useCallback, useState } from 'react'

type Player = 'human' | 'cpu'

export interface MexicoState {
  lives: Record<Player, number>
  activePlayer: Player
  targetRoll: number | null
  targetOwner: Player | null
  lastRoll: number | null
  gameOver: boolean
  winner: Player | null
  round: number
  message: string
}

const INITIAL_LIVES = 3

const otherPlayer = (player: Player): Player => (player === 'human' ? 'cpu' : 'human')
const rollDiceTotal = (): number =>
  Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1)

const createInitialState = (): MexicoState => ({
  lives: { human: INITIAL_LIVES, cpu: INITIAL_LIVES },
  activePlayer: 'human',
  targetRoll: null,
  targetOwner: null,
  lastRoll: null,
  gameOver: false,
  winner: null,
  round: 1,
  message: 'Roll to set the target for your opponent.',
})

export function useGame() {
  const [state, setState] = useState<MexicoState>(createInitialState)

  const rollCurrentPlayer = useCallback(() => {
    setState((previous) => {
      if (previous.gameOver) return previous

      const roller = previous.activePlayer
      const challenger = previous.targetOwner
      const total = rollDiceTotal()

      if (previous.targetRoll === null || challenger === null) {
        return {
          ...previous,
          targetRoll: total,
          targetOwner: roller,
          activePlayer: otherPlayer(roller),
          lastRoll: total,
          message: `${roller === 'human' ? 'You' : 'CPU'} set target ${total}. ${otherPlayer(roller) === 'human' ? 'Your' : 'CPU'} turn to beat it.`,
        }
      }

      const beatTarget = total > previous.targetRoll
      const loser = beatTarget ? challenger : roller
      const winner = otherPlayer(loser)
      const nextLives = {
        ...previous.lives,
        [loser]: Math.max(0, previous.lives[loser] - 1),
      }
      const gameWinner = nextLives[loser] === 0 ? winner : null

      return {
        ...previous,
        lives: nextLives,
        targetRoll: gameWinner ? previous.targetRoll : total,
        targetOwner: gameWinner ? previous.targetOwner : winner,
        activePlayer: loser,
        lastRoll: total,
        gameOver: gameWinner !== null,
        winner: gameWinner,
        round: previous.round + 1,
        message:
          gameWinner !== null
            ? `${gameWinner === 'human' ? 'You win' : 'CPU wins'}! ${loser === 'human' ? 'You are' : 'CPU is'} out of lives.`
            : `${roller === 'human' ? 'You' : 'CPU'} rolled ${total}. ${loser === 'human' ? 'You lose' : 'CPU loses'} a life.`,
      }
    })
  }, [])

  const resetGame = useCallback(() => {
    setState(createInitialState())
  }, [])

  const canRoll = !state.gameOver

  return { state, rollCurrentPlayer, resetGame, canRoll }
}
