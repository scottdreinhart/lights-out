import { describe, expect, it } from 'vitest'
import { DEFAULT_DRAW_SPEED } from './constants'
import {
  cloneGameState,
  createGameState,
  drawNumber,
  getCardHint,
  getWinnerCheck,
  setDrawSpeed,
  startAutoDraw,
  stopAutoDraw,
} from './rules'

describe('bingo-blackout rules', () => {
  it('creates valid initial state', () => {
    const state = createGameState()
    expect(state.cards).toHaveLength(1)
    expect(state.drawnNumbers.size).toBe(0)
    expect(state.currentDrawn).toBeNull()
    expect(state.isAutoDrawing).toBe(false)
    expect(state.drawSpeed).toBe(DEFAULT_DRAW_SPEED)
    expect(state.gameActive).toBe(true)
  })

  it('drawNumber draws one unique number and marks cards', () => {
    const state = createGameState()
    const result = drawNumber(state)
    expect(result).not.toBeNull()
    expect(state.drawnNumbers.size).toBe(1)
    expect(state.currentDrawn).toBe(result?.number)
  })

  it('toggles auto draw and enforces minimum draw speed', () => {
    const state = createGameState()
    startAutoDraw(state)
    expect(state.isAutoDrawing).toBe(true)
    setDrawSpeed(state, 100)
    expect(state.drawSpeed).toBe(250)
    stopAutoDraw(state)
    expect(state.isAutoDrawing).toBe(false)
  })

  it('returns winner check and hints for card', () => {
    const state = createGameState()
    const cardId = state.cards[0].id
    const winner = getWinnerCheck(state, cardId)
    const hints = getCardHint(state, cardId)
    expect(winner.isWinner).toBe(false)
    expect(winner.patterns).toEqual([])
    expect(hints.length).toBeGreaterThan(0)
  })

  it('cloneGameState deep-clones mutable references', () => {
    const state = createGameState()
    const cloned = cloneGameState(state)
    expect(cloned).not.toBe(state)
    expect(cloned.cards).not.toBe(state.cards)
    expect(cloned.drawnNumbers).not.toBe(state.drawnNumbers)
    expect(cloned.winners).not.toBe(state.winners)
  })
})
