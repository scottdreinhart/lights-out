import { checkWinningPatterns, createBingoCards, isWinner, markNumber } from './card'
import { ALL_NUMBERS, DEFAULT_DRAW_SPEED } from './constants'
import type { BlackoutBingoGameState, DrawResult, WinnerCheck, WinningPattern } from './types'
import { MAX_CARDS, MIN_CARDS } from './types'

export function createGameState(
  cardCount: number = 1,
  drawSpeed: number = DEFAULT_DRAW_SPEED,
): BlackoutBingoGameState {
  const safeCardCount = Math.max(MIN_CARDS, Math.min(MAX_CARDS, cardCount))
  return {
    cards: createBingoCards(safeCardCount),
    drawnNumbers: new Set(),
    winners: [],
    gameActive: true,
    currentDrawn: null,
    drawSpeed,
    isAutoDrawing: false,
  }
}

export function drawNumber(state: BlackoutBingoGameState): DrawResult | null {
  if (!state.gameActive || state.drawnNumbers.size >= ALL_NUMBERS.length) {
    return null
  }

  const available = ALL_NUMBERS.filter((n) => !state.drawnNumbers.has(n))
  if (available.length === 0) {
    return null
  }

  const number = available[Math.floor(Math.random() * available.length)]
  state.drawnNumbers.add(number)
  state.currentDrawn = number

  for (const card of state.cards) {
    markNumber(card, number)
  }

  const newWinners = state.cards
    .filter((card) => !state.winners.includes(card.id) && isWinner(card))
    .map((card) => card.id)

  state.winners.push(...newWinners)
  if (state.winners.length > 0) {
    state.gameActive = false
    state.isAutoDrawing = false
  }

  return { number, winners: newWinners }
}

export function startAutoDraw(state: BlackoutBingoGameState): void {
  state.isAutoDrawing = true
}

export function stopAutoDraw(state: BlackoutBingoGameState): void {
  state.isAutoDrawing = false
}

export function setDrawSpeed(state: BlackoutBingoGameState, speed: number): void {
  state.drawSpeed = Math.max(250, speed)
}

export function drawNumbers(state: BlackoutBingoGameState, count: number): (DrawResult | null)[] {
  const results: (DrawResult | null)[] = []
  for (let i = 0; i < count; i++) {
    const result = drawNumber(state)
    results.push(result)
    if (!result || !state.gameActive) {
      break
    }
  }
  return results
}

export function getRemainingNumbers(state: BlackoutBingoGameState): number[] {
  return ALL_NUMBERS.filter((n) => !state.drawnNumbers.has(n))
}

export function getCardPatterns(state: BlackoutBingoGameState, cardId: string): WinningPattern[] {
  const card = state.cards.find((item) => item.id === cardId)
  return card ? checkWinningPatterns(card) : []
}

export function getWinnerCheck(state: BlackoutBingoGameState, cardId: string): WinnerCheck {
  const patterns = getCardPatterns(state, cardId)
  return {
    isWinner: patterns.length > 0,
    patterns,
  }
}

export function getCardHint(
  state: BlackoutBingoGameState,
  cardId: string,
): { row: number; col: number }[] {
  const card = state.cards.find((item) => item.id === cardId)
  if (!card) {
    return []
  }

  const hints: { row: number; col: number }[] = []
  card.grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell.marked && !cell.isFreeSpace) {
        hints.push({ row: rowIndex, col: colIndex })
      }
    })
  })
  return hints
}

export function resetGame(state: BlackoutBingoGameState): void {
  state.drawnNumbers.clear()
  state.winners.length = 0
  state.gameActive = true
  state.currentDrawn = null
  state.isAutoDrawing = false

  for (const card of state.cards) {
    for (const row of card.grid) {
      for (const cell of row) {
        cell.marked = cell.isFreeSpace
      }
    }
  }
}

export function endGame(state: BlackoutBingoGameState): void {
  state.gameActive = false
  state.isAutoDrawing = false
}

export function getGameStats(state: BlackoutBingoGameState) {
  const targetCellsPerCard = 24
  const totalTargets = targetCellsPerCard * state.cards.length
  const markedTargets = state.cards.reduce(
    (total, card) =>
      total + card.grid.flat().filter((cell) => !cell.isFreeSpace && cell.marked).length,
    0,
  )

  return {
    totalCards: state.cards.length,
    numbersDrawn: state.drawnNumbers.size,
    numbersRemaining: ALL_NUMBERS.length - state.drawnNumbers.size,
    winners: state.winners,
    completion: totalTargets === 0 ? 0 : (markedTargets / totalTargets) * 100,
  }
}

export function cloneGameState(state: BlackoutBingoGameState): BlackoutBingoGameState {
  return {
    ...state,
    cards: state.cards.map((card) => ({
      ...card,
      grid: card.grid.map((row) =>
        row.map((cell) => ({
          ...cell,
        })),
      ),
    })),
    drawnNumbers: new Set(state.drawnNumbers),
    winners: [...state.winners],
  }
}
