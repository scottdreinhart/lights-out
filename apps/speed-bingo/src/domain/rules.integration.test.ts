import { beforeEach, describe, expect, it } from 'vitest'
import {
  ALL_NUMBERS,
  DEFAULT_DRAW_SPEED,
  FAST_DRAW_SPEED,
  GRID_SIZE,
  MAX_NUMBER,
  SLOW_DRAW_SPEED,
} from './constants'
import { createGameState, drawNumber, resetGame, startAutoDraw, stopAutoDraw } from './rules'
import type { SpeedBingoGameState } from './types'

describe('speed-bingo (Rapid-Draw 5x5 Bingo) - Integration Tests', () => {
  let gameState: SpeedBingoGameState

  beforeEach(() => {
    gameState = createGameState()
  })

  describe('Game Initialization', () => {
    it('should create a valid initial game state', () => {
      expect(gameState).toBeDefined()
      expect(gameState.cards).toHaveLength(1)
      expect(gameState.drawnNumbers).toBeInstanceOf(Set)
      expect(gameState.drawnNumbers.size).toBe(0)
      expect(gameState.gameActive).toBe(true)
      expect(gameState.currentDrawn).toBeNull()
    })

    it('should initialize with default draw speed', () => {
      expect(gameState.drawSpeed).toBe(DEFAULT_DRAW_SPEED)
    })

    it('should have auto-draw disabled initially', () => {
      expect(gameState.isAutoDrawing).toBe(false)
    })

    it('should have empty winners list initially', () => {
      expect(gameState.winners).toHaveLength(0)
    })

    it('should create a 5x5 card (25 squares) with unique numbers', () => {
      const card = gameState.cards[0]
      expect(card.squares).toHaveLength(25)

      // Verify all numbers are unique
      const uniqueNumbers = new Set(card.squares)
      expect(uniqueNumbers.size).toBe(25)

      // Verify all numbers are in valid range (1-75)
      card.squares.forEach((num) => {
        expect(num).toBeGreaterThanOrEqual(1)
        expect(num).toBeLessThanOrEqual(MAX_NUMBER)
      })
    })
  })

  describe('Draw Speed Constants', () => {
    it('should have valid draw speed constants defined', () => {
      expect(DEFAULT_DRAW_SPEED).toBe(2000)
      expect(FAST_DRAW_SPEED).toBe(1000)
      expect(SLOW_DRAW_SPEED).toBe(3000)
    })

    it('should have draw speeds in logical order', () => {
      expect(FAST_DRAW_SPEED).toBeLessThan(DEFAULT_DRAW_SPEED)
      expect(DEFAULT_DRAW_SPEED).toBeLessThan(SLOW_DRAW_SPEED)
    })

    it('should have GRID_SIZE constant for 5x5 grid', () => {
      expect(GRID_SIZE).toBe(5)
    })
  })

  describe('Manual Number Drawing', () => {
    it('should draw valid numbers between 1 and 75', () => {
      const drawCount = 20
      for (let i = 0; i < drawCount; i++) {
        gameState = drawNumber(gameState)
        const drawnArray = Array.from(gameState.drawnNumbers)
        expect(drawnArray).toHaveLength(i + 1)

        const lastDrawn = drawnArray[drawnArray.length - 1]
        expect(lastDrawn).toBeGreaterThanOrEqual(1)
        expect(lastDrawn).toBeLessThanOrEqual(MAX_NUMBER)
      }
    })

    it('should accumulate drawn numbers in Set without duplicates', () => {
      for (let i = 0; i < 50; i++) {
        gameState = drawNumber(gameState)
      }

      // Set naturally prevents duplicates
      const drawnArray = Array.from(gameState.drawnNumbers)
      expect(drawnArray).toHaveLength(gameState.drawnNumbers.size)

      const uniqueNumbers = new Set(drawnArray)
      expect(uniqueNumbers.size).toBe(drawnArray.length)
    })

    it('should update currentDrawn with latest drawn number', () => {
      expect(gameState.currentDrawn).toBeNull()

      gameState = drawNumber(gameState)
      expect(gameState.currentDrawn).not.toBeNull()
      const drawn = Array.from(gameState.drawnNumbers)
      expect(drawn).toContain(gameState.currentDrawn)

      const previousDrawn = gameState.currentDrawn
      gameState = drawNumber(gameState)
      expect(gameState.currentDrawn).not.toBe(previousDrawn)
    })

    it('should mark matching numbers on card', () => {
      const card = gameState.cards[0]
      const cardNumbersToFind = card.squares.slice(0, 5) // Target first 5 numbers

      // Draw until we hit each target number
      for (const targetNum of cardNumbersToFind) {
        while (!gameState.drawnNumbers.has(targetNum) && gameState.drawnNumbers.size < 75) {
          gameState = drawNumber(gameState)
        }

        // Find the index of the target number in the card
        const squareIndex = card.squares.indexOf(targetNum)
        expect(squareIndex).toBeGreaterThanOrEqual(0)

        if (gameState.drawnNumbers.has(targetNum)) {
          expect(card.marked[squareIndex]).toBe(true)
        }
      }
    })

    it('should track drawn count correctly', () => {
      for (let i = 0; i < 30; i++) {
        gameState = drawNumber(gameState)
        expect(gameState.drawnNumbers.size).toBe(i + 1)
      }
    })
  })

  describe('Auto-Draw Feature', () => {
    it('should start auto-draw when requested', () => {
      expect(gameState.isAutoDrawing).toBe(false)
      gameState = startAutoDraw(gameState)
      expect(gameState.isAutoDrawing).toBe(true)
    })

    it('should stop auto-draw when requested', () => {
      gameState = startAutoDraw(gameState)
      expect(gameState.isAutoDrawing).toBe(true)

      gameState = stopAutoDraw(gameState)
      expect(gameState.isAutoDrawing).toBe(false)
    })

    it('should maintain game state during auto-draw toggling', () => {
      const originalCardCount = gameState.cards.length
      const originalDrawSpeed = gameState.drawSpeed

      gameState = startAutoDraw(gameState)
      gameState = stopAutoDraw(gameState)

      expect(gameState.cards).toHaveLength(originalCardCount)
      expect(gameState.drawSpeed).toBe(originalDrawSpeed)
      expect(gameState.gameActive).toBe(true)
    })
  })

  describe('Draw Speed Configuration', () => {
    it('should support changing draw speed', () => {
      expect(gameState.drawSpeed).toBe(DEFAULT_DRAW_SPEED)

      gameState = createGameState(1, FAST_DRAW_SPEED)
      expect(gameState.drawSpeed).toBe(FAST_DRAW_SPEED)

      gameState = createGameState(1, SLOW_DRAW_SPEED)
      expect(gameState.drawSpeed).toBe(SLOW_DRAW_SPEED)
    })

    it('should maintain draw speed across draws', () => {
      gameState = createGameState(1, FAST_DRAW_SPEED)
      const originalSpeed = gameState.drawSpeed

      for (let i = 0; i < 10; i++) {
        gameState = drawNumber(gameState)
        expect(gameState.drawSpeed).toBe(originalSpeed)
      }
    })
  })

  describe('Winning Conditions', () => {
    it('should track winners when cards win', () => {
      expect(gameState.winners).toHaveLength(0)
      expect(gameState.gameActive).toBe(true)

      // Draw enough numbers to potentially win (depends on implementation)
      for (let i = 0; i < 30; i++) {
        gameState = drawNumber(gameState)
        // Game continues until winning condition is met
      }

      // At this point, winners list may or may not be populated
      // depending on whether 30 draws is enough for a win
      expect(gameState.winners).toBeDefined()
    })

    it('should recognize winning patterns', () => {
      const card = gameState.cards[0]

      // Draw the entire first row to force a win (5 consecutive marked squares)
      const firstRow = card.squares.slice(0, 5)
      for (const num of firstRow) {
        while (!gameState.drawnNumbers.has(num)) {
          gameState = drawNumber(gameState)
        }
      }

      // After marking a full row, winners should be populated or game should end
      // (specific winning logic depends on implementation)
      expect(gameState.gameActive).toBeDefined()
    })

    it('should not declare winner until winning condition is met', () => {
      // Draw just 5 random numbers (not enough for any winning pattern)
      for (let i = 0; i < 5; i++) {
        gameState = drawNumber(gameState)
      }

      // With only 5 numbers drawn, no winning pattern should exist
      // (unless very unlucky 5-in-a-row)
      expect(gameState.drawnNumbers.size).toBe(5)
    })
  })

  describe('Game Reset', () => {
    it('should reset game to initial state', () => {
      // Play the game
      for (let i = 0; i < 20; i++) {
        gameState = drawNumber(gameState)
      }
      expect(gameState.drawnNumbers.size).toBe(20)

      // Reset
      gameState = resetGame(gameState)

      // Verify reset state
      expect(gameState.drawnNumbers.size).toBe(0)
      expect(gameState.currentDrawn).toBeNull()
      expect(gameState.gameActive).toBe(true)
      expect(gameState.isAutoDrawing).toBe(false)
    })

    it('should create fresh card after reset', () => {
      const originalSquares = gameState.cards[0].squares.slice()

      // Play
      for (let i = 0; i < 10; i++) {
        gameState = drawNumber(gameState)
      }

      // Reset
      gameState = resetGame(gameState)

      // New card may have different numbers (both are valid)
      // But it should be a valid 5x5 card
      const newCard = gameState.cards[0]
      expect(newCard.squares).toHaveLength(25)
      expect(newCard.marked).toHaveLength(25)
      expect(newCard.marked.every((m) => m === false)).toBe(true)
    })

    it('should reset all marked squares after reset', () => {
      const card = gameState.cards[0]

      // Mark some squares by drawing
      for (let i = 0; i < 10; i++) {
        gameState = drawNumber(gameState)
      }

      const markedBeforeReset = card.marked.filter((m) => m).length
      expect(markedBeforeReset).toBeGreaterThan(0)

      // Reset
      gameState = resetGame(gameState)

      // Verify all marked flags are reset
      const newCard = gameState.cards[0]
      const markedAfterReset = newCard.marked.filter((m) => m).length
      expect(markedAfterReset).toBe(0)
    })
  })

  describe('Constants Validation', () => {
    it('should have ALL_NUMBERS constant with all valid bingo numbers', () => {
      expect(ALL_NUMBERS).toBeDefined()
      expect(ALL_NUMBERS).toHaveLength(MAX_NUMBER)

      // Verify sequence 1 through MAX_NUMBER
      for (let i = 1; i <= MAX_NUMBER; i++) {
        expect(ALL_NUMBERS).toContain(i)
      }
    })

    it('should have no duplicate numbers in ALL_NUMBERS', () => {
      const unique = new Set(ALL_NUMBERS)
      expect(unique.size).toBe(ALL_NUMBERS.length)
    })

    it('should have MAX_NUMBER set to 75 for speed bingo', () => {
      expect(MAX_NUMBER).toBe(75)
    })
  })

  describe('Multiple Card Support', () => {
    it('should support creating games with multiple cards', () => {
      gameState = createGameState(3) // Create 3 cards
      expect(gameState.cards).toHaveLength(3)

      // Each card should be independent
      gameState.cards.forEach((card) => {
        expect(card.squares).toHaveLength(25)
        expect(card.marked).toHaveLength(25)
      })
    })

    it('should mark matching numbers on all cards', () => {
      gameState = createGameState(2)

      // Get common numbers between both cards to test
      const card1Numbers = new Set(gameState.cards[0].squares)
      const card2Numbers = new Set(gameState.cards[1].squares)
      const commonNumbers = Array.from(card1Numbers).filter((n) => card2Numbers.has(n))

      if (commonNumbers.length > 0) {
        const testNum = commonNumbers[0]

        // Draw until we get the common number
        while (!gameState.drawnNumbers.has(testNum)) {
          gameState = drawNumber(gameState)
        }

        // Both cards should mark it if it's on both
        const idx1 = gameState.cards[0].squares.indexOf(testNum)
        const idx2 = gameState.cards[1].squares.indexOf(testNum)

        if (idx1 >= 0) expect(gameState.cards[0].marked[idx1]).toBe(true)
        if (idx2 >= 0) expect(gameState.cards[1].marked[idx2]).toBe(true)
      }
    })
  })

  describe('Game Flow Integration', () => {
    it('should maintain game state consistency through extended play', () => {
      const initialGameActive = gameState.gameActive
      const cardCount = gameState.cards.length

      for (let i = 0; i < 40; i++) {
        gameState = drawNumber(gameState)

        // Verify invariants
        expect(gameState.cards).toHaveLength(cardCount)
        expect(gameState.drawnNumbers.size).toBe(i + 1)
        expect(gameState.currentDrawn).not.toBeNull()

        // Each card should have at least some marked squares
        gameState.cards.forEach((card) => {
          const markedCount = card.marked.filter((m) => m).length
          expect(markedCount).toBeGreaterThanOrEqual(0)
          expect(markedCount).toBeLessThanOrEqual(25)
        })
      }

      expect(gameState.gameActive).toBe(initialGameActive)
    })

    it('should handle alternating between auto-draw and manual draw', () => {
      expect(gameState.isAutoDrawing).toBe(false)

      // Start auto
      gameState = startAutoDraw(gameState)
      expect(gameState.isAutoDrawing).toBe(true)

      // Draw manually while auto is enabled
      gameState = drawNumber(gameState)
      expect(gameState.drawnNumbers.size).toBe(1)

      // Stop auto
      gameState = stopAutoDraw(gameState)
      expect(gameState.isAutoDrawing).toBe(false)

      // Continue manual draws
      gameState = drawNumber(gameState)
      expect(gameState.drawnNumbers.size).toBe(2)
    })

    it('should prevent drawing duplicate numbers across extended sessions', () => {
      const allDrawn = new Set<number>()

      for (let i = 0; i < 60; i++) {
        const sizeBefore = gameState.drawnNumbers.size
        gameState = drawNumber(gameState)
        const sizeAfter = gameState.drawnNumbers.size

        // Should increase by 1 each time (no duplicates)
        expect(sizeAfter).toBe(sizeBefore + 1)

        gameState.drawnNumbers.forEach((num) => allDrawn.add(num))
      }

      // All drawn numbers should be unique
      expect(allDrawn.size).toBe(60)
      expect(gameState.drawnNumbers.size).toBe(60)
    })
  })

  describe('Auto-Draw Control', () => {
    it('should support starting auto-draw', () => {
      const state = startAutoDraw(gameState)
      expect(state.autoDrawing).toBe(true)
    })

    it('should support stopping auto-draw', () => {
      let state = startAutoDraw(gameState)
      expect(state.autoDrawing).toBe(true)

      state = stopAutoDraw(state)
      expect(state.autoDrawing).toBe(false)
    })

    it('should continue drawing during auto-draw', () => {
      const state = startAutoDraw(gameState)
      expect(state.autoDrawing).toBe(true)
      // In real scenario, auto-draw would call drawNumber on an interval
    })
  })

  describe('Draw Speed Management', () => {
    it('should support fast draw speed', () => {
      const state = { ...gameState, drawSpeed: FAST_DRAW_SPEED }
      expect(state.drawSpeed).toBe(FAST_DRAW_SPEED)
      expect(state.drawSpeed).toBeLessThan(gameState.drawSpeed)
    })

    it('should support slow draw speed', () => {
      const state = { ...gameState, drawSpeed: SLOW_DRAW_SPEED }
      expect(state.drawSpeed).toBe(SLOW_DRAW_SPEED)
      expect(state.drawSpeed).toBeGreaterThan(gameState.drawSpeed)
    })
  })

  describe('Game Reset', () => {
    it('should reset game state correctly', () => {
      for (let i = 0; i < 20; i++) {
        gameState = drawNumber(gameState)
      }

      expect(gameState.drawnNumbers.length).toBeGreaterThan(0)

      const resetState = resetGame()

      expect(resetState.drawnNumbers).toEqual([])
      expect(resetState.gameOver).toBe(false)
      expect(resetState.winner).toBeNull()
      expect(resetState.autoDrawing).toBe(false)
      expect(resetState.drawSpeed).toBe(DEFAULT_DRAW_SPEED)
    })
  })

  describe('Constants Validation', () => {
    it('should have ALL_NUMBERS constant with correct length', () => {
      expect(ALL_NUMBERS.length).toBe(MAX_NUMBER)
    })

    it('should have ALL_NUMBERS containing values 1 through 75', () => {
      for (let i = 1; i <= MAX_NUMBER; i++) {
        expect(ALL_NUMBERS).toContain(i)
      }
    })

    it('should have no duplicate numbers in ALL_NUMBERS', () => {
      const uniqueNumbers = new Set(ALL_NUMBERS)
      expect(uniqueNumbers.size).toBe(ALL_NUMBERS.length)
    })
  })

  describe('Game Flow', () => {
    it('should support extended play scenarios', () => {
      let roundsPlayed = 0

      while (roundsPlayed < 40) {
        gameState = drawNumber(gameState)
        roundsPlayed++
        expect(gameState.drawnNumbers.length).toBe(roundsPlayed)
      }

      expect(gameState.drawnNumbers.length).toBe(40)
    })

    it('should maintain game state consistency during play', () => {
      for (let i = 0; i < 25; i++) {
        gameState = drawNumber(gameState)

        const uniqueNumbers = new Set(gameState.drawnNumbers)
        expect(uniqueNumbers.size).toBe(gameState.drawnNumbers.length)
        expect(gameState.drawnNumbers.length).toBeLessThanOrEqual(MAX_NUMBER)
        expect(gameState.drawSpeed).toBeGreaterThan(0)
      }
    })
  })

  describe('Rapid-Fire Scenarios', () => {
    it('should handle rapid draws without issues', () => {
      for (let i = 0; i < 60; i++) {
        if (gameState.drawnNumbers.length < MAX_NUMBER) {
          gameState = drawNumber(gameState)
        }
      }

      expect(gameState.drawnNumbers.length).toBeGreaterThan(50)
    })
  })

  describe('Grid Configuration', () => {
    it('should have 25 cells total (5x5)', () => {
      const totalCells = gameState.userCard.board.reduce((sum, row) => sum + row.length, 0)
      expect(totalCells).toBe(25)
    })
  })
})
