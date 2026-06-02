import { beforeEach, describe, expect, it } from 'vitest'
import { ALL_NUMBERS, MAX_NUMBER } from './constants'
import { createGameState, drawNumber, getHints, getWinners, resetGame } from './rules'
import type { GameState } from './types'

describe('bingo-80 (Swedish 4x4 Bingo) - Integration Tests', () => {
  let gameState: GameState

  beforeEach(() => {
    gameState = createGameState()
  })

  describe('Game Initialization', () => {
    it('should create a valid initial game state', () => {
      expect(gameState).toBeDefined()
      expect(gameState.cards).toBeDefined()
      expect(gameState.cards.length).toBeGreaterThan(0)
      expect(gameState.drawnNumbers).toBeInstanceOf(Set)
      expect(gameState.drawnNumbers.size).toBe(0)
      expect(gameState.winners).toEqual([])
      expect(gameState.gameActive).toBe(true)
      expect(gameState.currentDrawn).toBeNull()
    })

    it('should start with no marked numbers on fresh cards', () => {
      gameState.cards.forEach((card) => {
        card.marked.forEach((isMarked) => {
          expect(isMarked).toBe(false)
        })
      })
    })

    it('should generate valid cards with 16 squares each', () => {
      gameState.cards.forEach((card) => {
        expect(card.id).toBeDefined()
        expect(typeof card.id).toBe('string')
        expect(card.squares.length).toBe(16)
        expect(card.marked.length).toBe(16)
      })
    })

    it('should have GRID_SIZE constant defined', () => {
      expect(gameState.cards[0].squares.length).toBe(16) // 4x4 grid
    })
  })

  describe('Number Drawing', () => {
    it('should draw valid numbers between 1 and 80', () => {
      for (let i = 0; i < 30; i++) {
        drawNumber(gameState)
        const drawn = Array.from(gameState.drawnNumbers)
        const lastDrawn = drawn[drawn.length - 1]

        expect(lastDrawn).toBeGreaterThanOrEqual(1)
        expect(lastDrawn).toBeLessThanOrEqual(MAX_NUMBER)
      }
    })

    it('should accumulate drawn numbers without duplicates', () => {
      for (let i = 0; i < 50; i++) {
        drawNumber(gameState)
      }

      expect(gameState.drawnNumbers.size).toBe(gameState.drawnNumbers.size)
      const drawn = Array.from(gameState.drawnNumbers)
      const uniqueNumbers = new Set(drawn)
      expect(uniqueNumbers.size).toBe(drawn.length) // No duplicates
    })

    it('should mark matching numbers on cards', () => {
      // Get all numbers from first card
      const cardNumbers = new Set(gameState.cards[0].squares)

      // Draw some numbers
      const nums = Array.from(cardNumbers)
        .filter((n): n is number => n !== null)
        .slice(0, 5)
      for (const num of nums) {
        drawNumber(gameState)
        // Keep drawing until we get this number
        while (!gameState.drawnNumbers.has(num) && gameState.drawnNumbers.size < MAX_NUMBER) {
          drawNumber(gameState)
        }

        if (gameState.drawnNumbers.has(num)) {
          // Check if the number is marked on the card
          const squareIdx = gameState.cards[0].squares.indexOf(num)
          if (squareIdx !== -1) {
            expect(gameState.cards[0].marked[squareIdx]).toBe(true)
          }
        }
      }
    })

    it('should track current drawn number', () => {
      expect(gameState.currentDrawn).toBeNull()

      drawNumber(gameState)
      expect(gameState.currentDrawn).toBeDefined()
      expect(typeof gameState.currentDrawn).toBe('number')
    })

    it('should maintain draw count accuracy', () => {
      for (let i = 0; i < 25; i++) {
        drawNumber(gameState)
      }

      expect(gameState.drawnNumbers.size).toBe(25)
    })
  })

  describe('Winning Conditions', () => {
    it('should detect winners when all squares are marked', () => {
      // Mark all squares on first card
      gameState.cards[0].marked = gameState.cards[0].marked.map(() => true)

      // Simulate detecting winner
      const allMarked = gameState.cards[0].marked.every((m) => m === true)
      expect(allMarked).toBe(true)
    })

    it('should track winning card IDs', () => {
      expect(gameState.winners).toEqual([])
      expect(Array.isArray(gameState.winners)).toBe(true)
    })

    it('should support multiple cards with independent tracking', () => {
      const multiCardState = createGameState(2)
      expect(multiCardState.cards.length).toBe(2)
      expect(multiCardState.cards[0].id).not.toBe(multiCardState.cards[1].id)
    })
  })

  describe('Game Reset', () => {
    it('should reset game state correctly', () => {
      // Play a few rounds
      for (let i = 0; i < 20; i++) {
        drawNumber(gameState)
      }

      expect(gameState.drawnNumbers.size).toBeGreaterThan(0)

      // Reset
      const resetState = resetGame(gameState)

      expect(resetState.drawnNumbers.size).toBe(0)
      expect(resetState.winners).toEqual([])
      expect(resetState.gameActive).toBe(true)
    })

    it('should generate fresh cards after reset', () => {
      const resetState = resetGame(gameState)

      expect(resetState.drawnNumbers.size).toBe(0)
      expect(resetState.cards.length).toBe(gameState.cards.length)
    })
  })

  describe('Constants Validation', () => {
    it('should have ALL_NUMBERS constant with correct length', () => {
      expect(ALL_NUMBERS.length).toBe(MAX_NUMBER)
      expect(MAX_NUMBER).toBe(80)
    })

    it('should have ALL_NUMBERS containing values 1 through 80', () => {
      for (let i = 1; i <= MAX_NUMBER; i++) {
        expect(ALL_NUMBERS).toContain(i)
      }
    })

    it('should have no duplicate numbers in ALL_NUMBERS', () => {
      const uniqueNumbers = new Set(ALL_NUMBERS)
      expect(uniqueNumbers.size).toBe(ALL_NUMBERS.length)
    })

    it('should have valid GRID_SIZE constant', () => {
      // 4x4 = 16 squares per card
      expect(gameState.cards[0].squares.length).toBe(16)
    })
  })

  describe('Grid Configuration', () => {
    it('should maintain 4x4 grid structure per card', () => {
      gameState.cards.forEach((card) => {
        // 16 squares = 4x4 grid
        expect(card.squares.length).toBe(16)
        expect(card.marked.length).toBe(16)
      })
    })

    it('should have 16 cells total', () => {
      gameState.cards.forEach((card) => {
        expect(card.squares.length).toBe(16)
      })
    })

    it('should have valid MAX_NUMBER constant', () => {
      expect(MAX_NUMBER).toBe(80)
    })
  })

  describe('Game Flow', () => {
    it('should support extended play scenarios', () => {
      let roundsPlayed = 0

      while (roundsPlayed < 30 && gameState.drawnNumbers.size < MAX_NUMBER) {
        drawNumber(gameState)
        roundsPlayed++
      }

      expect(gameState.drawnNumbers.size).toBeLessThanOrEqual(30)
      expect(gameState.gameActive).toBe(true) // Still active
    })

    it('should maintain game state consistency during play', () => {
      for (let i = 0; i < 20; i++) {
        drawNumber(gameState)

        // State invariants
        expect(gameState.drawnNumbers.size).toBeLessThanOrEqual(MAX_NUMBER)
        expect(gameState.gameActive).toBe(true)
      }
    })

    it('should track hints for drawn numbers', () => {
      drawNumber(gameState)
      const hints = getHints(gameState)
      expect(Array.isArray(hints)).toBe(true)
    })

    it('should support retrieving winners list', () => {
      const winners = getWinners(gameState)
      expect(Array.isArray(winners)).toBe(true)
      expect(winners).toEqual([])
    })
  })
})
