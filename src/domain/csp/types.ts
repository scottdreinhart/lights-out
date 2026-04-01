/**
 * Core CSP Type Definitions
 *
 * Formal CSP definition (per Constraint Satisfaction Problem theory):
 * CSP = ⟨X, D, C⟩ where:
 *   X = set of variables
 *   D = domain (possible values) for each variable
 *   C = constraints over variables
 *
 * This module provides game-agnostic abstractions supporting all 7 puzzle types.
 */

// ============================================================================
// PUZZLE TYPE ENUMERATION (7 Games)
// ============================================================================

export enum PuzzleType {
  SUDOKU_MINI = 'sudoku_mini', // 6×4 Boolean CSP (stable ✅)
  QUEENS = 'queens', // N×N placement CSP (stable ✅)
  TANGO = 'tango', // Binary CSP variant (v1.0)
  ZIP = 'zip', // Path CSP / Numberlink (v1.0)
  CROSSCLIMB = 'crossclimb', // Graph search / Word ladder (v1.0)
  PINPOINT = 'pinpoint', // Clustering / Semantic (v1.0)
  PATCHES = 'patches', // Polyomino tiling CSP (v2.0)
}

// ============================================================================
// DIFFICULTY ENUMERATION
// ============================================================================

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

// ============================================================================
// VARIABLE DEFINITION
// ============================================================================

/**
 * A variable represents a single puzzle cell or decision point.
 * Each variable has an ID, type, and metadata.
 */
export interface Variable {
  /**
   * Unique identifier within the puzzle.
   * Examples: "cell_0_0", "cell_1_2", "edge_1_2_1_3"
   */
  id: string

  /**
   * Variable type (extensible for future types)
   */
  type: 'CELL' | 'EDGE' | 'NODE'

  /**
   * Game-specific metadata
   */
  metadata: {
    row?: number // Row index (grid-based puzzles)
    col?: number // Column index (grid-based puzzles)
    region?: number // Region index (Sudoku regions, Queens regions)
    index?: number // Linear index (flat representation)
    isInitial?: boolean // Whether this is a clue (immutable)
    [key: string]: any // Extensible for game-specific data
  }
}

// ============================================================================
// DOMAIN DEFINITION
// ============================================================================

/**
 * A domain represents the set of possible values for a variable.
 *
 * During solving:
 * - `possible` shrinks as constraints eliminate values
 * - `initial` remains unchanged (reference)
 */
export interface Domain {
  variableId: string
  possible: Set<number | string | boolean>
  initial: Set<number | string | boolean>
}

// ============================================================================
// CONSTRAINT DEFINITION
// ============================================================================

/**
 * Abstract constraint interface.
 * Subclasses implement game-specific logic.
 *
 * A constraint is satisfied if the given assignment respects the rule.
 */
export interface Constraint {
  /**
   * Unique constraint name (e.g., "unique_row", "no_attack")
   */
  name: string

  /**
   * Variable IDs involved in this constraint.
   * Scope can be:
   *   - 1 variable: unary constraint
   *   - 2 variables: binary constraint
   *   - N variables: higher-order constraint
   */
  scope: string[]

  /**
   * Check if this constraint is satisfied by the given assignment.
   *
   * @param assignment Map of variable ID → assigned value
   * @returns true if constraint satisfied, false otherwise
   */
  isSatisfied(assignment: Map<string, number | string | boolean>): boolean

  /**
   * (Optional) Get variables that conflict with the given assignment.
   * Used by solvers to guide variable selection.
   *
   * @param assignment Current partial assignment
   * @param variableId Variable ID that was just assigned
   * @returns Array of conflicting variable IDs
   */
  getConflictingVariables?(
    assignment: Map<string, number | string | boolean>,
    variableId: string,
  ): string[]

  /**
   * (Optional) Get all violations for the current assignment.
   * Used during debugging and constraint propagation.
   *
   * @param assignment Partial assignment to check
   * @returns Array of variable IDs involved in violations
   */
  getViolations?(assignment: Map<string, number | string | boolean>): string[]
}

// ============================================================================
// CSP DEFINITION (Core)
// ============================================================================

/**
 * Constraint Satisfaction Problem ⟨X, D, C⟩
 *
 * Generic over value type T (number, string, boolean, etc.)
 */
export interface CSP<T = number | string | boolean> {
  /**
   * Puzzle identifier (UUID)
   */
  id: string

  /**
   * Puzzle type (enum)
   */
  puzzleType: PuzzleType

  /**
   * All variables in the problem
   */
  variables: Variable[]

  /**
   * Domain (possible values) for each variable
   * Index matches variables array
   */
  domains: Domain[]

  /**
   * All constraints
   */
  constraints: Constraint[]

  /**
   * Clues (initial assignment)
   * Immutable during solving
   */
  clues: Map<string, T>

  /**
   * Metadata
   */
  metadata: {
    difficulty?: Difficulty
    estimatedTime?: number // milliseconds
    seedValue?: number
    createdAt?: number
    source?: 'generated' | 'imported' | 'custom'
  }
}

// ============================================================================
// SOLVE RESULT
// ============================================================================

export interface SolveResult {
  /**
   * Whether a complete solution was found
   */
  solved: boolean

  /**
   * Final assignment (complete or partial)
   */
  assignment: Map<string, number | string | boolean>

  /**
   * Number of iterations (for performance analysis)
   */
  iterations: number

  /**
   * Time taken (milliseconds)
   */
  timeMs: number

  /**
   * (Optional) Path to solution (for solver visualization)
   * e.g., ["var_0", "var_1", "var_2", ...]
   */
  decisionPath?: string[]

  /**
   * (Optional) Conflict path (if unsolvable)
   * e.g., ["var_5 = 3 conflicts with var_6"]
   */
  conflictPath?: string[]

  /**
   * (Optional) Solver-specific metadata
   */
  metadata?: {
    solver: string
    branchingFactor?: number
    propagationSteps?: number
  }
}

// ============================================================================
// DIFFICULTY METRICS
// ============================================================================

/**
 * Metrics for difficulty classification and puzzle generation.
 *
 * Used to:
 * 1. Estimate puzzle difficulty (before solving)
 * 2. Calibrate clue removal (during generation)
 * 3. Validate solvability (generator validation)
 */
export interface DifficultyMetrics {
  /**
   * Minimum clues required for solubility.
   * For Queens: typically 0 (solved from empty)
   * For Sudoku: 17 (proven minimum for 9×9)
   * For Tango: varies with board size
   */
  minClues: number

  /**
   * Clue range per difficulty level.
   * Format: [minClues, maxClues] for that level
   */
  clueRange: {
    easy: [number, number]
    medium: [number, number]
    hard: [number, number]
    expert: [number, number]
  }

  /**
   * Estimated solve time (milliseconds) typical human solver.
   * Used for UI expectations and difficulty scaling.
   */
  estimatedSolveTime: {
    easy: number // Usually < 5 minutes
    medium: number // Usually 5-30 minutes
    hard: number // Usually 30-120 minutes
    expert: number // Usually > 120 minutes
  }

  /**
   * Constraint strength score (heuristic).
   * How much each clue restricts the solution space.
   * Higher = more constraining.
   */
  constraintStrength: {
    easy: number
    medium: number
    hard: number
    expert: number
  }

  /**
   * (Optional) Advanced metrics
   */
  advanced?: {
    averageBranchingFactor?: number // Wider tree = harder
    propagationDepth?: number // Chain length = harder
    percentageHintable?: number // % of moves hinted = easier
  }
}

// ============================================================================
// GENERATED PUZZLE
// ============================================================================

export interface GeneratedPuzzle<T = number | string | boolean> {
  /**
   * Playable puzzle (with clues removed)
   */
  puzzle: CSP<T>

  /**
   * Complete solution
   */
  solution: Map<string, T>

  /**
   * Estimated difficulty (0-100 scale)
   */
  estimatedDifficulty: number

  /**
   * Estimated human solve time (milliseconds)
   */
  estimatedTime: number

  /**
   * Whether solution is unique
   */
  hasUniqueSolution: boolean

  /**
   * (Optional) Generation metadata
   */
  metadata?: {
    generationTimeMs?: number
    seed?: number
    generatorVersion?: string
  }
}

// ============================================================================
// GAME STATE (App Layer)
// ============================================================================

/**
 * Game state as seen from React/UI layer.
 * Derived from CSP, but includes UI-specific state.
 */
export interface GameState<T = number | string | boolean> {
  /**
   * Current puzzle
   */
  puzzle: CSP<T>

  /**
   * Current assignment (user moves + clues)
   */
  assignment: Map<string, T>

  /**
   * Whether puzzle is complete and correct
   */
  isComplete: boolean

  /**
   * Whether any move violates constraints
   */
  hasErrors: boolean

  /**
   * Errors (if hasErrors = true)
   */
  errors?: Array<{
    variableId: string
    message: string
  }>

  /**
   * Move history (for undo/redo)
   */
  history: Array<{
    variableId: string
    oldValue?: T
    newValue: T
    timestamp: number
  }>

  /**
   * Current position in history (for undo/redo)
   */
  historyIndex: number

  /**
   * Metadata
   */
  metadata?: {
    startedAt?: number
    solvedAt?: number
    hintCount?: number
  }
}

// ============================================================================
// SOLVER INTERFACE
// ============================================================================

export interface Solver<T = number | string | boolean> {
  /**
   * Unique solver name
   */
  name: string

  /**
   * Complexity class (for solver selection)
   */
  complexity: 'LINEAR' | 'POLYNOMIAL' | 'EXPONENTIAL' | 'NP'

  /**
   * Solve CSP instance.
   *
   * @param csp Problem instance
   * @param timeout Maximum time (milliseconds)
   * @returns Solve result (solved or partial)
   */
  solve(csp: CSP<T>, timeout?: number): SolveResult

  /**
   * (Optional) Get estimated difficulty without solving.
   * Used by generators to avoid full solve.
   *
   * @param csp Problem instance
   * @returns Difficulty score (0-100)
   */
  getEstimatedDifficulty?(csp: CSP<T>): number
}

// ============================================================================
// GENERATOR INTERFACE
// ============================================================================

export interface PuzzleGenerator<T = number | string | boolean> {
  /**
   * Generate random solved puzzle board.
   * @returns Complete, valid assignment
   */
  generateSolved(): CSP<T>

  /**
   * Generate playable puzzle at difficulty level.
   *
   * @param difficulty Target difficulty
   * @param timeout Maximum time (milliseconds)
   * @returns Generated puzzle with solution
   */
  generatePuzzle(difficulty: Difficulty, timeout?: number): GeneratedPuzzle<T>

  /**
   * Verify puzzle has unique solution.
   * Expensive operation (requires multiple solves).
   *
   * @param puzzle Puzzle to verify
   * @returns true if unique, false otherwise
   */
  hasUniqueSolution(puzzle: CSP<T>): boolean
}

// ============================================================================
// HINT
// ============================================================================

export interface Hint {
  /**
   * Variable ID to assign
   */
  variableId: string

  /**
   * Value to assign
   */
  value: number | string | boolean

  /**
   * Hint explanation (why this move is forced)
   */
  reason: string

  /**
   * Hint type classification
   */
  type:
    | 'FORCED_MOVE' // Only one value possible
    | 'HIDDEN_SINGLE' // Only one cell for value
    | 'ELIMINATION' // Arc consistency reveals impossibility
    | 'DEDUCTION' // Logical chain (if X then Y)
    | 'GUESS' // No logical path, educated guess
}
