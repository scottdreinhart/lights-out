import { describe, expect, it } from 'vitest'

import { determineGameWinner, determineRoundWinner, isGameOver } from './rules'

describe('rock-paper-scissors rules', () => {
  it('should determine round outcomes correctly', async () => {
    await expect(determineRoundWinner('rock', 'scissors')).resolves.toBe('win')
    await expect(determineRoundWinner('rock', 'paper')).resolves.toBe('loss')
    await expect(determineRoundWinner('paper', 'paper')).resolves.toBe('draw')
  })

  it('should detect game-over state for best-of format', async () => {
    await expect(isGameOver(2, 0, 3)).resolves.toBe(true)
    await expect(isGameOver(1, 1, 3)).resolves.toBe(false)
  })

  it('should determine the match winner', async () => {
    await expect(determineGameWinner(3, 1, 5)).resolves.toBe('player')
    await expect(determineGameWinner(1, 3, 5)).resolves.toBe('cpu')
    await expect(determineGameWinner(1, 1, 5)).resolves.toBeNull()
  })
})
