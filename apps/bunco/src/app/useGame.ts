import { advanceRound, applyRoll, createInitialState, rollDice, scoreRoll } from '@/domain'
import { CPU_DELAY_MS, ROLL_ANIMATION_MS } from '@/domain'
import type { GameState, Player, RollResult } from '@/domain'
import { useEffect, useState } from 'react'

export interface GameCallbacks {
  onRollStart?: (isHuman: boolean) => void
  onRollResult?: (result: RollResult) => void
  onGameEnd?: (winner: Player) => void
}

export const useGame = (callbacks?: GameCallbacks) => {
  const [state, setState] = useState<GameState>(createInitialState)

  const executeRoll = (isHuman: boolean) => {
    callbacks?.onRollStart?.(isHuman)

    setState((previous) => {
      if (previous.isGameOver || previous.roundOver || previous.isRolling) {
        return previous
      }

      if (isHuman && previous.currentPlayer !== 'human') {
        return previous
      }

      if (!isHuman && previous.currentPlayer !== 'cpu') {
        return previous
      }

      return {
        ...previous,
        isRolling: true,
      }
    })

    window.setTimeout(() => {
      setState((previous) => {
        if (previous.isGameOver || previous.roundOver || !previous.isRolling) {
          return previous
        }

        const rollResult = scoreRoll(rollDice(), previous.target)
        const result = applyRoll(previous, rollResult)

        callbacks?.onRollResult?.(rollResult)
        return result
      })
    }, ROLL_ANIMATION_MS)
  }

  const roll = () => {
    executeRoll(true)
  }

  const nextRound = () => {
    setState((previous) => {
      if (!previous.roundOver || previous.isGameOver) {
        return previous
      }

      const advanced = advanceRound(previous)
      if (advanced.isGameOver && advanced.gameWinner) {
        callbacks?.onGameEnd?.(advanced.gameWinner)
      }
      return advanced
    })
  }

  const newGame = () => {
    setState(createInitialState())
  }

  useEffect(() => {
    if (state.currentPlayer !== 'cpu' || state.isGameOver || state.roundOver || state.isRolling) {
      return
    }

    const timerId = window.setTimeout(() => {
      executeRoll(false)
    }, CPU_DELAY_MS)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [state.currentPlayer, state.isGameOver, state.roundOver, state.isRolling])

  return {
    state,
    roll,
    nextRound,
    newGame,
  }
}
