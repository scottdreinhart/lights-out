import { describe, expect, it } from 'vitest'
import {
  createGameState,
  drawNumber,
  drawNumbers,
  getGameStats,
  getRemainingNumbers,
  resetGame,
} from './rules'

describe('bingo-blackout integration', () => {
  it('supports draw flow with consistent stats', () => {
    const state = createGameState(2)
    const results = drawNumbers(state, 10)
    expect(results.filter(Boolean).length).toBe(10)
    expect(state.drawnNumbers.size).toBe(10)

    const stats = getGameStats(state)
    expect(stats.totalCards).toBe(2)
    expect(stats.numbersDrawn).toBe(10)
    expect(stats.numbersRemaining).toBe(80)
    expect(stats.completion).toBeGreaterThanOrEqual(0)
  })

  it('never draws duplicate numbers until pool exhaustion', () => {
    const state = createGameState(1)
    for (let i = 0; i < 90; i++) {
      drawNumber(state)
    }
    expect(state.drawnNumbers.size).toBe(90)
    expect(getRemainingNumbers(state)).toHaveLength(0)
    expect(drawNumber(state)).toBeNull()
  })

  it('resets round while preserving card ids', () => {
    const state = createGameState(3)
    const originalIds = state.cards.map((card) => card.id)
    drawNumbers(state, 20)
    resetGame(state)
    expect(state.drawnNumbers.size).toBe(0)
    expect(state.currentDrawn).toBeNull()
    expect(state.winners).toHaveLength(0)
    expect(state.cards.map((card) => card.id)).toEqual(originalIds)
  })
})
