/**
 * useGameEvents — composes sound effects, haptics, and stats tracking
 * into a GameCallbacks object for useGame.
 *
 * This hook bridges side-effect systems with the game state machine
 * without coupling them together.
 */

import { useMemo } from 'react'

import { vibrate } from './haptics'
import type { GameCallbacks } from './useGame'
import { useSoundEffects } from './useSoundEffects'
import { useStats } from './useStats'

export function useGameEvents() {
  const sounds = useSoundEffects()
  const { stats, recordWin, recordLoss, resetStats } = useStats()

  const callbacks: GameCallbacks = useMemo(
    () => ({
      onRollStart(isHuman) {
        if (isHuman) {
          sounds.onDiceRoll()
          vibrate(30)
        } else {
          sounds.onCpuMove()
        }
      },

      onRollResult(result) {
        if (result.isBunco) {
          sounds.onBunco()
          vibrate([100, 50, 100, 50, 100])
        } else if (result.isMiniBunco) {
          vibrate([50, 30, 50])
        }
      },

      onGameEnd(winner) {
        if (winner === 'human') {
          sounds.onWin()
          vibrate([50, 30, 50, 30, 100])
          recordWin()
        } else {
          sounds.onLose()
          vibrate(200)
          recordLoss()
        }
      },
    }),
    [sounds, recordWin, recordLoss],
  )

  return { callbacks, stats, resetStats }
}
