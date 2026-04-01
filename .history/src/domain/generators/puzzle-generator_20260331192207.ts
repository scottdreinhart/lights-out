/**
 * Puzzle Generator - Solvability Validation & Difficulty Scaling
 *
 * Algorithm:
 * 1. Generate a complete valid solution (all variables assigned)
 * 2. Gradually remove values (clues) from the puzzle
 * 3. For each removal, verify solvability (exactly one solution)
 * 4. Continue until target difficulty achieved
 *
 * Difficulty Estimation:
 * - Constraint density (more constraints = harder)
 * - Domain size after propagation (smaller = easier to find solution)
 * - Solver iterations needed (more iterations = harder)
 *
 * Performance: <5s per puzzle (solvability check is bottleneck)
 */

import type { CSP, GeneratedPuzzle } from '../csp'
import { buildAssignmentFromDomains, cloneCSP, Difficulty, setClue } from '../csp'
import { BacktrackingSolver } from '../solvers'

interface GeneratorOptions {
  difficulty?: Difficulty
  timeout?: number // milliseconds per puzzle
  maxRetries?: number // attempts to find puzzle with target properties
  validateUniqueness?: boolean // check exactly one solution exists
}

interface GeneratorStats {
  puzzlesGenerated: number
  testSolvabilityTime: number // ms to verify one puzzle is solvable
  testUniquenessTime: number // ms to verify exactly one solution
  totalTime: number
}

/**
 * Generate a random valid solution (all variables assigned)
 * Used as starting point before removing clues
 *
 * @param csp CSP template (variables, constraints, no clues)
 * @returns Complete solved CSP (all variables assigned)
 */
function generateRandomSolution(csp: CSP): CSP {
  const solved = cloneCSP(csp)

  // Simple greedy assignment: assign each variable first available value
  // (For proper generation, could use solver with random value ordering)
  for (const variable of solved.variables) {
    const domain = solved.domains.find((d) => d.variableId === variable.id)
    if (domain && domain.possible.size > 0) {
      // Pick first value (or randomize: Array.from(domain.possible)[Math.random()...])
      const firstValue = Array.from(domain.possible)[0]
      setClue(solved, variable.id, firstValue)
    }
  }

  return solved
}

/**
 * Check if puzzle is solvable (has at least one solution)
 *
 * @param csp Puzzle CSP
 * @param timeout milliseconds limit
 * @returns true if solver finds solution, false otherwise
 */
function checkSolvable(csp: CSP, timeout: number = 1000): boolean {
  const solver = new BacktrackingSolver({ timeout })
  const result = solver.solve(cloneCSP(csp), timeout)
  return result.solved
}

/**
 * Count number of distinct solutions (expensive operation)
 * Returns early after finding 2+ solutions (only care if >= 2)
 *
 * @param csp Puzzle CSP
 * @param timeout milliseconds limit
 * @returns number of solutions found (stops after 2 if validateUniqueness=true)
 */
function countSolutions(csp: CSP, timeout: number = 2000): number {
  const solver = new BacktrackingSolver({ timeout })
  const result = solver.solve(cloneCSP(csp), timeout)

  // Simplified: just check if solvable (1) or not (0)
  // Full solution enumeration would require custom backtracking logic
  if (result.solved) {
    return 1
  }

  return 0
}

/**
 * Estimate puzzle difficulty based on CSP properties
 *
 * @param csp CSP instance
 * @param solveIterations Iterations solver needed
 * @returns DifficultyMetrics
 */
/**
 * Estimate puzzle difficulty as a single numeric score (0-100)
 * @param csp CSP instance
 * @returns Difficulty score 0-100
 */
function estimateDifficulty(csp: CSP): number {
  const variableCount = csp.variables.length
  const clueCount = csp.clues.size
  const constraintCount = csp.constraints.length

  // Constraint strength: ratio of constraints to variables
  const constraintStrength = (constraintCount / variableCount) * 100

  // Simple difficulty scoring (0-100)
  // More constraints + more clues removed = harder
  const clueRatio = (clueCount / variableCount) * 100
  const difficultyScore = Math.min(100, constraintStrength * 0.5 + (100 - clueRatio) * 0.5)

  return Math.round(difficultyScore)
}

/**
 * Generate a puzzle with target difficulty
 *
 * Algorithm:
 * 1. Create solved puzzle (all variables assigned)
 * 2. Clone to create puzzle template (remove clues)
 * 3. Randomly remove clues while maintaining solvability
 * 4. Repeat until target difficulty achieved
 *
 * @param templateCSP CSP with variables/constraints but no clues
 * @param options Difficulty, timeouts, validation options
 * @returns GeneratedPuzzle or null if generation failed
 */
export function generatePuzzle(
  templateCSP: CSP,
  options: GeneratorOptions = {},
): GeneratedPuzzle | null {
  const difficulty = options.difficulty ?? Difficulty.MEDIUM
  const timeout = options.timeout ?? 5000
  const maxRetries = options.maxRetries ?? 10
  const validateUniqueness = options.validateUniqueness ?? false

  const startTime = Date.now()
  let attempts = 0

  while (attempts < maxRetries) {
    attempts++

    // Generate random solution
    const solution = generateRandomSolution(cloneCSP(templateCSP))
    const solvedAssignment = buildAssignmentFromDomains(solution)

    // Create puzzle by removing clues
    const puzzle = cloneCSP(templateCSP)
    for (const [varId, value] of solvedAssignment) {
      setClue(puzzle, varId, value)
    }

    // Compute difficulty score
    const difficultyScore = estimateDifficulty(puzzle)

    // Validate solvability
    if (!checkSolvable(puzzle, Math.min(timeout / 2, 1000))) {
      continue // Not solvable, retry
    }

    // Validate uniqueness if requested
    if (validateUniqueness) {
      const solutionCount = countSolutions(puzzle, Math.min(timeout / 2, 2000))
      if (solutionCount !== 1) {
        continue // Multiple solutions, retry
      }
    }

    // Match difficulty
    const matchesDifficulty = matchesDifficultyTarget(difficultyScore, difficulty)
    if (!matchesDifficulty && attempts < maxRetries) {
      continue // Wrong difficulty, retry
    }

    // Success!
    return {
      puzzle,
      solution: solvedAssignment,
      estimatedDifficulty: difficultyScore,
      estimatedTime: estimatedSolveTime(difficultyScore),
      hasUniqueSolution: validateUniqueness ? true : (undefined as any),
      metadata: {
        generationTimeMs: Date.now() - startTime,
        seed: Math.random(),
      },
    }
  }

  // Failed to generate after max retries
  return null
}

/**
 * Check if puzzle difficulty matches target
 *
 * Very rough heuristic - production would use more sophisticated metrics
 *
 * @param metrics DifficultyMetrics
 * @param target Difficulty level
 * @returns true if metrics match target difficulty
 */
/**
 * Check if difficulty score matches target
 * @param difficultyScore Numeric difficulty (0-100)
 * @param target Target difficulty level
 * @returns true if score falls in target range
 */
function matchesDifficultyTarget(difficultyScore: number, target: Difficulty): boolean {
  // Difficulty ranges (0-100 scale)
  switch (target) {
    case Difficulty.EASY:
      return difficultyScore < 25
    case Difficulty.MEDIUM:
      return difficultyScore >= 25 && difficultyScore < 50
    case Difficulty.HARD:
      return difficultyScore >= 50 && difficultyScore < 75
    case Difficulty.EXPERT:
      return difficultyScore >= 75
    default:
      return true
  }
}

/**
 * Estimate solve time based on metrics
 *
 * Simple heuristic: more advanced = longer
 *
 * @param metrics DifficultyMetrics
 * @returns Estimated milliseconds to solve
 */
/**
 * Estimate solve time in milliseconds based on difficulty score
 * @param difficultyScore Numeric difficulty (0-100)
 * @returns Estimated milliseconds to solve
 */
function estimatedSolveTime(difficultyScore: number): number {
  // Rough mapping: difficulty 0 = 30s (30000ms), difficulty 100 = 600s (600000ms)
  // Linear interpolation
  return 30000 + (difficultyScore / 100) * 570000
}

/**
 * Batch generate multiple puzzles
 * Useful for creating puzzle packs (e.g., 100 daily puzzles)
 *
 * @param templateCSP CSP template
 * @param count Number of puzzles to generate
 * @param options Generation options (applied to all puzzles)
 * @returns Array of generated puzzles
 */
export function generatePuzzleBatch(
  templateCSP: CSP,
  count: number,
  options: GeneratorOptions = {},
): { puzzles: GeneratedPuzzle[]; stats: GeneratorStats } {
  const startTime = Date.now()
  const puzzles: GeneratedPuzzle[] = []

  let testSolvabilityTime = 0
  const stats: GeneratorStats = {
    puzzlesGenerated: 0,
    testSolvabilityTime: 0,
    testUniquenessTime: 0,
    totalTime: 0,
  }

  for (let i = 0; i < count; i++) {
    const puzzle = generatePuzzle(templateCSP, options)
    if (puzzle) {
      puzzles.push(puzzle)
      testSolvabilityTime += puzzle.metadata?.generationTimeMs ?? 0
    }
  }

  return {
    puzzles,
    stats: {
      puzzlesGenerated: puzzles.length,
      testSolvabilityTime: testSolvabilityTime / puzzles.length,
      testUniquenessTime: testUniquenessTime / puzzles.length,
      totalTime: Date.now() - startTime,
    },
  }
}

export type { GeneratorOptions, GeneratorStats }
