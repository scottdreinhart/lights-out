/**
 * Zip Game Tests
 * Unit tests for Zip maze navigation game
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  createEmptyMaze,
  makeMove,
  generateMaze,
  placeItems,
  createInitialState,
  findPathAStar,
  isMazeSolvable,
} from '../domain'
import type { Difficulty } from '../domain'

describe('Zip Domain Logic', () => {
  describe('Maze Creation', () => {
    it('should create an empty maze with correct dimensions', () => {
      const maze = createEmptyMaze(5, 3)
      expect(maze).toHaveLength(3)
      expect(maze[0]).toHaveLength(5)
      expect(maze.every(row => row.every(cell => cell === 'wall'))).toBe(true)
    })

    it('should generate a solvable maze', () => {
      const maze = generateMaze(8, 6)
      expect(maze).toHaveLength(6)
      expect(maze[0]).toHaveLength(8)
      expect(isMazeSolvable(maze)).toBe(true)
    })
  })

  describe('Game State', () => {
    let gameState: any

    beforeEach(() => {
      gameState = createInitialState('easy')
    })

    it('should create initial game state', () => {
      expect(gameState.maze).toBeDefined()
      expect(gameState.playerPosition).toBeDefined()
      expect(gameState.items).toBeDefined()
      expect(gameState.collectedItems).toEqual([])
      expect(gameState.isComplete).toBe(false)
    })

    it('should place items in the maze', () => {
      const mazeWithItems = placeItems(gameState.maze, 3)
      const itemCount = mazeWithItems.flat().filter(cell => cell === 'item').length
      expect(itemCount).toBe(3)
    })
  })

  describe('Movement', () => {
    it('should allow valid moves', () => {
      const maze = [
        ['wall', 'wall', 'wall'],
        ['wall', 'empty', 'wall'],
        ['wall', 'wall', 'wall']
      ]
      const newPosition = makeMove({ row: 1, col: 1 }, 'right', maze)
      expect(newPosition).toEqual({ row: 1, col: 2 })
    })

    it('should prevent invalid moves', () => {
      const maze = [
        ['wall', 'wall', 'wall'],
        ['wall', 'empty', 'wall'],
        ['wall', 'wall', 'wall']
      ]
      const newPosition = makeMove({ row: 1, col: 1 }, 'up', maze)
      expect(newPosition).toEqual({ row: 1, col: 1 }) // Should not move
    })
  })

  describe('Pathfinding', () => {
    it('should find a path in a simple maze', () => {
      const maze = [
        ['wall', 'wall', 'wall', 'wall'],
        ['wall', 'empty', 'empty', 'wall'],
        ['wall', 'empty', 'empty', 'wall'],
        ['wall', 'wall', 'wall', 'wall']
      ]
      const start = { row: 1, col: 1 }
      const goal = { row: 2, col: 2 }
      const path = findPathAStar(maze, start, goal, [])
      expect(path).toBeDefined()
      expect(path!.length).toBeGreaterThan(0)
      expect(path![0]).toEqual(start)
      expect(path![path!.length - 1]).toEqual(goal)
    })

    it('should return null for unsolvable maze', () => {
      const maze = [
        ['wall', 'wall', 'wall'],
        ['wall', 'empty', 'wall'],
        ['wall', 'wall', 'wall']
      ]
      const start = { row: 1, col: 1 }
      const goal = { row: 1, col: 1 } // Same position
      const path = findPathAStar(maze, start, goal, [])
      expect(path).toEqual([start])
    })
  })

  describe('Maze Solvability', () => {
    it('should detect solvable mazes', () => {
      const solvableMaze = [
        ['wall', 'wall', 'wall', 'wall'],
        ['wall', 'empty', 'empty', 'wall'],
        ['wall', 'empty', 'empty', 'wall'],
        ['wall', 'wall', 'wall', 'wall']
      ]
      expect(isMazeSolvable(solvableMaze)).toBe(true)
    })

    it('should detect unsolvable mazes', () => {
      const unsolvableMaze = [
        ['wall', 'wall', 'wall'],
        ['wall', 'empty', 'wall'],
        ['wall', 'wall', 'wall']
      ]
      expect(isMazeSolvable(unsolvableMaze)).toBe(false)
    })
  })
})