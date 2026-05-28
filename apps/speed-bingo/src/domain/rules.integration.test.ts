import { describe, expect, it } from 'vitest'
import {
  createGameState,
  drawNumber,
  drawNumbers,
  getGameStats,
  getRemainingNumbers,
  resetGame,
} from './rules'

describe('speed-bingo integration', () => {
  it('supports continuous draw flow with consistent stats', () => {
    const state = createGameState(2)
    const results = drawNumbers(state, 10)
    expect(results.filter(Boolean).length).toBe(10)
    expect(state.drawnNumbers.size).toBe(10)

    const stats = getGameStats(state)
    expect(stats.totalCards).toBe(2)
    expect(stats.numbersDrawn).toBe(10)
    expect(stats.numbersRemaining).toBe(65)
    expect(stats.completion).toBeCloseTo((10 / 75) * 100)
  })

  it('never draws duplicate numbers until pool is exhausted', () => {
    const state = createGameState(1)
    for (let i = 0; i < 75; i++) {
      drawNumber(state)
    }
    expect(state.drawnNumbers.size).toBe(75)
    expect(getRemainingNumbers(state)).toHaveLength(0)
    expect(drawNumber(state)).toBeNull()
  })

  it('resets round state while preserving cards', () => {
    const state = createGameState(3)
    const originalCardIds = state.cards.map((card) => card.id)
    drawNumbers(state, 12)
    resetGame(state)
    expect(state.drawnNumbers.size).toBe(0)
    expect(state.winners).toHaveLength(0)
    expect(state.currentDrawn).toBeNull()
    expect(state.isAutoDrawing).toBe(false)
    expect(state.cards.map((card) => card.id)).toEqual(originalCardIds)
  })
})
