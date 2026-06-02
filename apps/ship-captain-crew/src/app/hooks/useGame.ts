import { useCallback, useState } from 'react'

type Player = 'human' | 'cpu'

interface RoundResult {
  player: Player
  rolls: number[][]
  gotShip: boolean
  gotCaptain: boolean
  gotCrew: boolean
  cargo: number
}

interface ShipCaptainCrewState {
  round: number
  wins: Record<Player, number>
  lastRound: { human: RoundResult; cpu: RoundResult; winner: Player | 'tie' } | null
  gameOver: boolean
  winner: Player | null
}

const TARGET_WINS = 5

const rollDice = (count: number): number[] =>
  Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1)

const bestTwoSum = (values: number[]): number => {
  if (values.length < 2) {
    return 0
  }
  const [a, b] = [...values].sort((x, y) => y - x)
  return a + b
}

const simulateTurn = (player: Player): RoundResult => {
  const rolls: number[][] = []
  let gotShip = false
  let gotCaptain = false
  let gotCrew = false
  let bestCargo = 0
  let diceToRoll = 5

  for (let i = 0; i < 3; i += 1) {
    const result = rollDice(diceToRoll)
    rolls.push(result)
    const remaining = [...result]

    if (!gotShip) {
      const index = remaining.indexOf(6)
      if (index >= 0) {
        gotShip = true
        remaining.splice(index, 1)
      }
    }

    if (gotShip && !gotCaptain) {
      const index = remaining.indexOf(5)
      if (index >= 0) {
        gotCaptain = true
        remaining.splice(index, 1)
      }
    }

    if (gotShip && gotCaptain && !gotCrew) {
      const index = remaining.indexOf(4)
      if (index >= 0) {
        gotCrew = true
        remaining.splice(index, 1)
      }
    }

    if (gotShip && gotCaptain && gotCrew) {
      bestCargo = Math.max(bestCargo, bestTwoSum(remaining))
      diceToRoll = 2
    } else {
      const locked = (gotShip ? 1 : 0) + (gotCaptain ? 1 : 0) + (gotCrew ? 1 : 0)
      diceToRoll = 5 - locked
    }
  }

  return {
    player,
    rolls,
    gotShip,
    gotCaptain,
    gotCrew,
    cargo: gotShip && gotCaptain && gotCrew ? bestCargo : 0,
  }
}

const createInitialState = (): ShipCaptainCrewState => ({
  round: 1,
  wins: { human: 0, cpu: 0 },
  lastRound: null,
  gameOver: false,
  winner: null,
})

export function useGame() {
  const [state, setState] = useState<ShipCaptainCrewState>(createInitialState)

  const playRound = useCallback(() => {
    setState((previous) => {
      if (previous.gameOver) {
        return previous
      }

      const human = simulateTurn('human')
      const cpu = simulateTurn('cpu')
      const winner: Player | 'tie' =
        human.cargo === cpu.cargo ? 'tie' : human.cargo > cpu.cargo ? 'human' : 'cpu'

      const nextWins = { ...previous.wins }
      if (winner !== 'tie') {
        nextWins[winner] += 1
      }

      const gameWinner =
        nextWins.human >= TARGET_WINS ? 'human' : nextWins.cpu >= TARGET_WINS ? 'cpu' : null

      return {
        round: previous.round + 1,
        wins: nextWins,
        lastRound: { human, cpu, winner },
        gameOver: gameWinner !== null,
        winner: gameWinner,
      }
    })
  }, [])

  const resetGame = useCallback(() => {
    setState(createInitialState())
  }, [])

  return { state, playRound, resetGame }
}
