import type { DieValue } from './types'

/**
 * Rolls three dice, returning random values 1-6.
 * Bunco is purely luck-based — no strategy computation needed.
 */
export function rollDice(): [DieValue, DieValue, DieValue] {
  const roll = (): DieValue => (Math.floor(Math.random() * 6) + 1) as DieValue
  return [roll(), roll(), roll()]
}
