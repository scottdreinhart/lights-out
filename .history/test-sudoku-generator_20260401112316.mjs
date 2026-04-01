#!/usr/bin/env node

/**
 * Test script for the generic sudoku generator
 * Verifies that it can generate valid puzzles for different board sizes
 */

import { generateSudokuPuzzle, validateBoard } from '../packages/domain-shared/src/sudoku/generator.js'

// Test configurations
const configs = [
  { boardSize: 4, boxSize: 2, name: '4x4 Mini Sudoku' },
  { boardSize: 6, boxSize: 2, name: '6x6 Sudoku' },
  { boardSize: 9, boxSize: 3, name: '9x9 Standard Sudoku' },
  { boardSize: 12, boxSize: 3, name: '12x12 Sudoku' },
  { boardSize: 16, boxSize: 4, name: '16x16 Sudoku' },
]

console.log('🧩 Testing Generic Sudoku Generator\n')

for (const config of configs) {
  try {
    console.log(`Testing ${config.name}...`)

    // Generate puzzle
    const puzzle = generateSudokuPuzzle(config, 'medium')
    console.log(`  ✅ Generated ${config.boardSize}x${config.boardSize} puzzle`)

    // Validate puzzle
    const isValid = validateBoard(puzzle.grid, config.boardSize, config.boxSize)
    console.log(`  ✅ Puzzle validation: ${isValid ? 'PASS' : 'FAIL'}`)

    // Check solution
    const solutionValid = validateBoard(puzzle.solution.grid, config.boardSize, config.boxSize)
    console.log(`  ✅ Solution validation: ${solutionValid ? 'PASS' : 'FAIL'}`)

    // Count clues
    const clueCount = puzzle.grid.flat().filter(cell => cell !== 0).length
    const totalCells = config.boardSize * config.boardSize
    const cluePercentage = Math.round((clueCount / totalCells) * 100)
    console.log(`  📊 Clues: ${clueCount}/${totalCells} (${cluePercentage}%)`)

    console.log('')

  } catch (error) {
    console.error(`  ❌ Error with ${config.name}:`, error.message)
    console.log('')
  }
}

console.log('🎉 Generic Sudoku Generator Test Complete!')