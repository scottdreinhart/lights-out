# Puzzle Engine Architecture Design

**Date**: March 31, 2026  
**Status**: DESIGN PHASE - Ready to Implementation  
**Scope**: 7-game unified CSP engine (Queens, Tango, Zip, Crossclimb, Pinpoint, Mini Sudoku, Patches)  
**Foundation**: CLEAN Architecture + CQRS Pattern  

---

## 1. Executive Summary

### Vision

A unified **Constraint Satisfaction Problem (CSP) framework** that powers 7 distinct puzzle games through a common domain abstraction layer, maintaining CLEAN architecture and enabling efficient solving/generating across different complexity classes.

### Core Philosophy

- **Single Domain, Multiple Manifestations**: One CSP core, seven UI/game adaptations
- **Pluggable Solvers**: Backtracking (simple), Constraint Propagation (medium), Local Search (complex), SAT/ML (custom)
- **Difficulty-Aware Generation**: Clue removal validation, constraint strength metrics
- **Performance Tiering**: Sync main-thread (simple), Worker async (medium), WASM (complex)
- **Type Safety**: TypeScript strict mode throughout, no `any` types

### Success Criteria

✅ Single codebase supports all 7 games  
✅ Game-agnostic CSP solver achieves <100ms decision on typical boards  
✅ Difficulty generation validates solvability (< 30s overhead)  
✅ Extensible: New puzzle type = new Constraint + new UI  
✅ No cross-game rule pollution (each game isolated)  

---

## 2. Conceptual Architecture (Top-Level Flow)

```
┌─────────────────────────────────────────────────────────────┐
│                        UI LAYER                              │
│  (Game-Specific: Board, Controls, Status, Difficulty Picker)│
│  atoms/ → molecules/ → organisms/                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                        APP LAYER                             │
│  useGame(), useResponsiveState(), useSolver(), useDifficulty│
│  React hooks → CQRS Commands/Queries                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                      CQRS COMMAND LAYER                      │
│                                                               │
│  Commands:                                                   │
│  ├─ CreateGameCommand(gameType, difficulty)                 │
│  ├─ PlaceCellCommand(index, value)                           │
│  ├─ RemoveCellCommand(index)                                 │
│  ├─ GenerateGameCommand(difficulty)                          │
│  └─ SolveGameCommand(partial)                                │
│                                                               │
│  Handlers:                                                   │
│  ├─ CreateGameHandler → CSP Factory                          │
│  ├─ PlaceCellHandler → Validate + Propagate                  │
│  ├─ GenerateGameHandler → Solver + Clue Removal             │
│  └─ SolveGameHandler → Select Solver (sync/async/WASM)      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    CSP DOMAIN LAYER                          │
│                                                               │
│  Core Types:                                                 │
│  ├─ PuzzleType (enum: QUEENS, TANGO, ZIP, etc.)             │
│  ├─ Constraint (interface, game-specific implementations)    │
│  ├─ Variable & Domain (cell-level)                           │
│  ├─ CSPState (current solution state)                        │
│  └─ Difficulty (enum: EASY, MEDIUM, HARD, EXPERT)           │
│                                                               │
│  Core Algorithms:                                            │
│  ├─ BacktrackingSolver (default)                             │
│  ├─ ConstraintPropagation (AC-3 arc consistency)             │
│  ├─ LocalSearchSolver (min-conflicts)                        │
│  ├─ SATAdapter (for NP-hard variants)                        │
│  └─ ClueRemovalGenerator (difficulty validation)             │
│                                                               │
│  Game Modules:                                               │
│  ├─ domain/games/queens/ (constraints, rules)                │
│  ├─ domain/games/sudoku/ (6×4 variant)                       │
│  ├─ domain/games/tango/ (binary CSP)                         │
│  ├─ domain/games/zip/ (path CSP)                             │
│  ├─ domain/games/crossclimb/ (graph search)                  │
│  ├─ domain/games/pinpoint/ (clustering)                      │
│  └─ domain/games/patches/ (polyomino tiling)                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    WORKERS LAYER (Async)                    │
│                                                               │
│  Main Thread ←→ Message Passing ←→ Worker                   │
│                                                               │
│  Worker Tasks:                                               │
│  ├─ Solve Complex Boards (Medium complexity)                 │
│  ├─ Generate Clues (Difficulty validation)                   │
│  ├─ Deep Analysis (Constraint propagation chains)            │
│  └─ WASM Initialization                                      │
│                                                               │
│  Fallback: Sync main-thread for simple cases                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  WASM OPTIONAL LAYER                         │
│                 (AssemblyScript Compiled)                    │
│                                                               │
│  Scenarios:                                                  │
│  ├─ Complex solvers (Patches polyomino search)               │
│  ├─ Large board sizes (Queens 100×100)                       │
│  └─ Batch generation (100+ games, difficulty validation)     │
│                                                               │
│  Fallback: JavaScript implementation (always correct)        │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. CSP Foundation & Core Abstractions

### 3.1 CSP Formal Definition

```typescript
interface CSP<T> {
  /**
   * Variables: Array of puzzle cells
   * Each cell has a domain of possible values
   */
  variables: Variable[]
  
  /**
   * Domains: Possible values for each variable
   * Variable[i] can take values from Domain[i]
   */
  domains: Domain[]
  
  /**
   * Constraints: Rules governing variable relationships
   * Each constraint references 1+ variables
   */
  constraints: Constraint[]
}

interface Variable {
  id: string          // "cell_0_0", "cell_1_2", etc.
  type: 'CELL'        // Extensible for future types
  metadata: {
    row?: number
    col?: number
    region?: number   // For Sudoku-like regions
    isInitial: boolean // Clue (cannot change)
  }
}

interface Domain {
  variableId: string
  possible: Set<number | string>  // Current domain (shrinks as solved)
  initial: Set<number | string>  // Original domain (immutable)
}

interface Constraint {
  name: string        // "unique_row", "no_attack", "equal_count", etc.
  scope: string[]     // Variable IDs involved
  isSatisfied(assignment: Map<string, number | string>): boolean
  getConflictingVariables?(assignment, violatingValue): string[]
}
```

### 3.2 PuzzleType Enum & Registry

```typescript
enum PuzzleType {
  SUDOKU_MINI = 'sudoku_mini',      // 6×4 variant (stable ✅)
  QUEENS = 'queens',                  // N×N placement (stable ✅)
  TANGO = 'tango',                    // Binary CSP (v1.0)
  ZIP = 'zip',                        // Path CSP (v1.0)
  CROSSCLIMB = 'crossclimb',          // Graph search (v1.0)
  PINPOINT = 'pinpoint',              // Clustering (v1.0)
  PATCHES = 'patches',                // Polyomino tiling (v2.0)
}

interface PuzzleRegistry {
  [PuzzleType.QUEENS]: {
    factory: QueensFactory
    solver: BacktrackingSolver
    generator: QueensClueRemovalGenerator
    difficulty: DifficultyMetrics
  }
  // ... 6 more entries
}
```

### 3.3 Difficulty Abstraction

```typescript
enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

interface DifficultyMetrics {
  minClues: number          // Minimum clues for solvability
  clueRange: {
    easy: [number, number]
    medium: [number, number]
    hard: [number, number]
    expert: [number, number]
  }
  estimatedSolveTime: {
    easy: number            // milliseconds
    medium: number
    hard: number
    expert: number
  }
  constraintStrength: {    // How much each clue "constrains"
    easy: number
    medium: number
    hard: number
    expert: number
  }
}

// Per-game examples:
// Queens: minClues = 0 (solve from empty board), solveTime varies with N
// Sudoku: minClues = 17, clueRange = [17, 81], solveTime ~10ms-1s
// Tango: minClues = varies with size, SAT solver needed
// Zip: minClues = count of pairs (game-dependent)
```

---

## 4. Constraint Registry by Game Type

### 4.1 Queens Constraints

```typescript
namespace QueensConstraints {
  /**
   * Core constraint: No two queens attack each other
   * (Different row, column, diagonal)
   */
  class NoAttackConstraint implements Constraint {
    name = 'no_attack'
    scope: string[]  // All N² cells
    
    isSatisfied(assignment: Map<string, 0 | 1>): boolean {
      // For each pair of queens, verify no row/col/diagonal conflict
      // Queen = 1, Empty = 0
    }
    
    getConflictingVariables(assignment, value): string[] {
      // Return cells that would attack position [row, col]
    }
  }
  
  /**
   * Uniqueness constraint: One queen per row
   * (Can be enforced via domain reduction)
   */
  class OnePerRowConstraint implements Constraint {
    name = 'unique_row'
    scope: string[]  // All cells in target row
    
    isSatisfied(assignment): boolean {
      // Count queens in row === 1
    }
  }
  
  /**
   * Symmetry constraint: Solutions are symmetric
   * (Optional, for generating variants)
   */
  class SymmetryConstraint implements Constraint {
    name = 'symmetry'
    scope: string[]  // Symmetric cell pairs
    
    isSatisfied(assignment): boolean {
      // Queen at (r,c) ⟺ Queen at (c,r)
    }
  }
}
```

### 4.2 Sudoku Mini Constraints

```typescript
namespace SudokuConstraints {
  class UniqueRowConstraint implements Constraint {
    // All cells in row have different values (1-6 or 1-4)
  }
  
  class UniqueColumnConstraint implements Constraint {
    // All cells in column have different values
  }
  
  class UniqueRegionConstraint implements Constraint {
    // All cells in 2×3 (or 2×2) region have different values
  }
  
  // Inherited from Sudoku domain logic
  // cf. existing src/domain/rules.ts
}
```

### 4.3 Tango (Binary CSP) Constraints

```typescript
namespace TangoConstraints {
  class EqualCountConstraint implements Constraint {
    // Row count(0) === Row count(1)
    // Col count(0) === Col count(1)
  }
  
  class NoThreeAdjacentConstraint implements Constraint {
    // No 3+ consecutive identical symbols horizontally/vertically
  }
  
  class UniqueRowConstraint implements Constraint {
    // No duplicate rows
  }
  
  class UniqueColumnConstraint implements Constraint {
    // No duplicate columns
  }
}
```

### 4.4 Zip (Path CSP) Constraints

```typescript
namespace ZipConstraints {
  class ContinuousPathConstraint implements Constraint {
    // Path is connected (no gaps)
    // All cells reachable from start
  }
  
  class NoCrossingConstraint implements Constraint {
    // Paths don't intersect
    // Each cell belongs to exactly one path
  }
  
  class SingleCellPerValueConstraint implements Constraint {
    // Each value appears exactly once
    // (For number pairs)
  }
  
  class EndpointsMatchValueConstraint implements Constraint {
    // Path start/end = value pair
  }
}
```

### 4.5 Crossclimb (Graph Search) Constraints

```typescript
namespace CrossclimbConstraints {
  class SingleLetterDifferenceConstraint implements Constraint {
    // Adjacent words differ by exactly 1 letter (Hamming distance = 1)
    // Leverages word-graph connectivity
  }
  
  class AllWordsValidConstraint implements Constraint {
    // Each step is a valid word in dictionary
  }
  
  class PathConnectivityConstraint implements Constraint {
    // Start → target reachable via single-letter steps
  }
}
```

### 4.6 Pinpoint (Clustering) Constraints

```typescript
namespace PinpointConstraints {
  class SemanticSimilarityConstraint implements Constraint {
    // Items in cluster share semantic property
    // Uses embedding distance or category membership
  }
  
  class OptimalClusterCountConstraint implements Constraint {
    // Number of clusters = target count (variable)
  }
  
  class BalanceConstraint implements Constraint {
    // Clusters have similar sizes (optional)
  }
}
```

### 4.7 Patches (Polyomino Tiling) Constraints

```typescript
namespace PatchesConstraints {
  class NoOverlapConstraint implements Constraint {
    // No two polyominoes occupy same cell
  }
  
  class CompleteCoverageConstraint implements Constraint {
    // Union of all polyominoes = entire grid
  }
  
  class ValidPolyominoConstraint implements Constraint {
    // Each piece is a valid polyomino shape
    // (Connected orthogonally)
  }
}
```

---

## 5. Solver Hierarchy & Selection Strategy

### 5.1 Solver Interface (Abstract)

```typescript
interface Solver {
  name: string
  complexity: 'LINEAR' | 'POLYNOMIAL' | 'EXPONENTIAL'
  
  /**
   * Solve CSP instance
   * Returns: Complete assignment (solved) or partial (unsolvable)
   */
  solve(csp: CSP<any>, timeout?: number): SolveResult
  
  /**
   * Predict solvability without full solving
   * For difficulty validation
   */
  getEstimatedDifficulty(csp: CSP<any>): number  // 0-100
}

interface SolveResult {
  solved: boolean
  assignment: Map<string, number | string>
  iterations: number
  timeMs: number
  conflictPath?: string[]  // For diagnostics
}
```

### 5.2 Backtracking Solver (Default, Simple Cases)

```typescript
class BacktrackingSolver implements Solver {
  name = 'Backtracking'
  complexity = 'EXPONENTIAL'
  
  /**
   * Standard backtracking + MRV (Minimum Remaining Values) heuristic
   * Target: <100ms on typical boards
   * 
   * Algorithm:
   * 1. Select unassigned variable with smallest domain (MRV)
   * 2. For each value in domain:
   *    a. Assign value
   *    b. Check constraint satisfaction (fail-fast)
   *    c. Recursively solve remaining
   *    d. If complete solution found, return
   *    e. Otherwise, backtrack
   * 3. Return unsolvable if all paths exhausted
   */
  solve(csp: CSP<any>, timeout = 100): SolveResult {
    const assignment = new Map()
    const startTime = performance.now()
    let iterations = 0
    
    const backtrack = (): boolean => {
      if (performance.now() - startTime > timeout) return false
      iterations++
      
      // All assigned? Success
      if (assignment.size === csp.variables.length) return true
      
      // Select next variable (MRV)
      const unassigned = this.selectMRV(csp, assignment)
      if (!unassigned) return false
      
      // Try each value in domain
      for (const value of csp.domains[this.getVariableIndex(unassigned)].possible) {
        assignment.set(unassigned, value)
        
        // Check constraints
        if (this.isConsistent(csp, assignment)) {
          if (backtrack()) return true
        }
        
        assignment.delete(unassigned)
      }
      
      return false
    }
    
    return {
      solved: backtrack(),
      assignment,
      iterations,
      timeMs: performance.now() - startTime,
    }
  }
  
  private selectMRV(csp, assignment): string | null {
    // Return unassigned variable with smallest domain
  }
  
  private isConsistent(csp, assignment): boolean {
    // Check all constraints; return false on first violation
  }
}
```

### 5.3 Constraint Propagation Solver (Medium Complexity)

```typescript
class ConstraintPropagationSolver implements Solver {
  name = 'Constraint Propagation + Backtracking'
  complexity = 'POLYNOMIAL'  // With backtracking fallback
  
  /**
   * Arc Consistency (AC-3) + Backtracking
   * Target: <500ms on medium boards
   * 
   * Algorithm:
   * 1. Maintain constraint queue (all arcs initially)
   * 2. For each arc (Xi, Xj):
   *    a. Remove from Xi.domain any value with no support in Xj
   *    b. If Xi.domain changed, re-queue all arcs (Xk, Xi)
   * 3. Once consistent, backtrack only if needed
   * 4. Dramatically reduces search space
   */
  solve(csp: CSP<any>, timeout = 500): SolveResult {
    const domains = this.arcConsistency(csp, timeout / 2)
    
    // If arc consistency solved it, return
    if (this.isSolved(domains)) {
      return { solved: true, assignment: this.domainsToAssignment(domains), iterations: 0, timeMs: 0 }
    }
    
    // Otherwise, backtrack with reduced domains
    return new BacktrackingSolver().solve(csp, timeout / 2)
  }
  
  private arcConsistency(csp: CSP<any>, timeout: number): Domain[] {
    // AC-3 algorithm implementation
    // Shrinks domains based on constraints
  }
  
  private isSolved(domains: Domain[]): boolean {
    // Check if all domains have exactly 1 value
  }
}
```

### 5.4 Local Search Solver (Hard Complexity)

```typescript
class LocalSearchSolver implements Solver {
  name = 'Min-Conflicts Local Search'
  complexity = 'POLYNOMIAL'
  
  /**
   * Min-Conflicts Algorithm
   * Target: Scales to huge boards (e.g., Queens 1M×1M)
   * Trade-off: May not find solution if one exists (incomplete)
   * Use-case: Queens, large boards, approximate solutions acceptable
   * 
   * Algorithm:
   * 1. Start with random complete assignment
   * 2. While unsolved:
   *    a. Pick random conflicted variable
   *    b. Assign value that minimizes conflicts
   *    c. If no progress, restart
   * 3. Return best assignment found
   */
  solve(csp: CSP<any>, timeout = 1000): SolveResult {
    let assignment = this.randomInitialAssignment(csp)
    const startTime = performance.now()
    let iterations = 0
    
    while (performance.now() - startTime < timeout) {
      if (this.isComplete(csp, assignment)) {
        return { solved: true, assignment, iterations, timeMs: performance.now() - startTime }
      }
      
      const conflicted = this.getConflictedVariables(csp, assignment)
      if (conflicted.length === 0) break  // No progress possible
      
      const variable = conflicted[Math.floor(Math.random() * conflicted.length)]
      const bestValue = this.minConflictValue(csp, assignment, variable)
      assignment.set(variable, bestValue)
      
      iterations++
    }
    
    return { solved: false, assignment, iterations, timeMs: performance.now() - startTime }
  }
  
  private getConflictedVariables(csp, assignment): string[] {
    // Return all variables violating 1+ constraints
  }
  
  private minConflictValue(csp, assignment, variable): any {
    // Return value for variable that minimizes constraint violations
  }
}
```

### 5.5 SAT Solver Adapter (NP-Hard Games)

```typescript
/**
 * For games where standard CSP solvers struggle
 * (e.g., Tango with SAT, Zip with vertex-disjoint paths)
 * 
 * Options:
 * 1. Compile to 3-SAT, use SAT solver library (or-tools, SATisfiability)
 * 2. Call external API (unlikely in client-side context)
 * 3. Use specialized algorithm (e.g., vertex-disjoint path theorem)
 * 
 * Decision: Defer to v2.0 (after core engine validated)
 * For now: Use constraint propagation + backtracking fallback
 */
class SATSolverAdapter implements Solver {
  name = 'SAT Solver (Future)'
  complexity = 'NP'
  
  solve(csp: CSP<any>, timeout?: number): SolveResult {
    // TODO: Integrate SAT solver library
    // Fallback to constraint propagation
    return new ConstraintPropagationSolver().solve(csp, timeout)
  }
}
```

### 5.6 Solver Selection Strategy

```typescript
interface SolverSelectionStrategy {
  selectSolver(puzzleType: PuzzleType, boardState: CSP<any>): Solver
}

class DefaultSolverSelector implements SolverSelectionStrategy {
  selectSolver(puzzleType: PuzzleType, boardState: CSP<any>): Solver {
    // Domain knowledge per game type
    switch (puzzleType) {
      case PuzzleType.QUEENS:
        // Large boards → Min-conflicts
        // Small boards → Backtracking
        return boardState.variables.length > 100
          ? new LocalSearchSolver()
          : new BacktrackingSolver()
      
      case PuzzleType.SUDOKU_MINI:
      case PuzzleType.PATCHES:
        // NP-Complete, moderate size
        // Constraint propagation helps significantly
        return new ConstraintPropagationSolver()
      
      case PuzzleType.TANGO:
      case PuzzleType.ZIP:
        // SAT-solvable, but fallback to propagation
        return new ConstraintPropagationSolver()
      
      case PuzzleType.CROSSCLIMB:
        // Graph search (polynomial in word dict)
        // Use BFS + Hamming distance heuristic
        return new CrossclimbGraphSearchSolver()
      
      case PuzzleType.PINPOINT:
        // Clustering (polynomial, ML-based)
        return new ClusteringMLSolver()
      
      default:
        return new BacktrackingSolver()
    }
  }
}
```

---

## 6. Generator Framework (Difficulty-Aware Clue Removal)

### 6.1 Generator Interface

```typescript
interface PuzzleGenerator {
  /**
   * Generate random solved board
   */
  generateSolved(boardSize: any): CSP<any>
  
  /**
   * Generate playable puzzle at difficulty level
   * Validates solvability
   */
  generatePuzzle(difficulty: Difficulty, timeout?: number): {
    puzzle: CSP<any>
    solution: Map<string, any>
    estimatedTime: number
  }
  
  /**
   * Constraint: Unique solution
   */
  hasUniqueSolution(puzzle: CSP<any>): boolean
}
```

### 6.2 Clue Removal Generator (Sudoku-Pattern)

```typescript
class ClueRemovalGenerator implements PuzzleGenerator {
  /**
   * Standard approach for Sudoku-like puzzles
   * 
   * Algorithm:
   * 1. Generate complete solution (backtracking)
   * 2. Iteratively remove clues (random cell select)
   * 3. Validate solvability + uniqueness
   * 4. Stop when target clue count reached
   * 5. Verify no further clues can be removed (minimal)
   * 
   * Difficulty calibration:
   * EASY: High clue count, few branching paths
   * HARD: Low clue count, complex propagation chains
   * EXPERT: Minimal clues, requires advanced techniques
   */
  generatePuzzle(difficulty: Difficulty, timeout = 30000): GeneratedPuzzle {
    const startTime = performance.now()
    
    // Step 1: Generate solved board
    const solved = this.generateSolved(difficulty)
    const puzzle = structuredClone(solved)  // Copy
    const targetClues = this.getTargetClueCount(difficulty)
    
    // Step 2: Remove clues iteratively
    let cluesRemoved = 0
    const removed = new Set<string>()
    
    while (
      puzzle.domain.sum() > targetClues &&
      performance.now() - startTime < timeout
    ) {
      // Select random cell with a clue
      const cellWithClue = this.selectRandomClue(puzzle, removed)
      if (!cellWithClue) break
      
      const originalValue = puzzle.assignment.get(cellWithClue)
      puzzle.assignment.delete(cellWithClue)
      removed.add(cellWithClue)
      
      // Validate: Still solvable?
      const solver = new ConstraintPropagationSolver()
      const result = solver.solve(puzzle, 1000)
      
      if (!result.solved) {
        // Restore clue, try another
        puzzle.assignment.set(cellWithClue, originalValue)
        removed.delete(cellWithClue)
      } else {
        cluesRemoved++
      }
    }
    
    // Step 3: Verify minimal (no further removals possible)
    // (Optional, expensive - skip for fast generation)
    
    return {
      puzzle,
      solution: solved.assignment,
      estimatedTime: difficulty === 'EASY' ? 10 : difficulty === 'MEDIUM' ? 60 : 300,
    }
  }
  
  private getTargetClueCount(difficulty: Difficulty): number {
    // Per-game override
    // Sudoku: EASY=45, MEDIUM=35, HARD=25, EXPERT=17
  }
}
```

### 6.3 Difficulty Metrics Calculation

```typescript
class DifficultyMetricsCalculator {
  /**
   * Estimate puzzle difficulty without full solving
   * Metrics:
   * 1. Clue count (fewer = harder)
   * 2. Constraint strength (how much each clue constrains)
   * 3. Propagation depth (chains required to solve)
   * 4. Branching factor (search tree width)
   */
  calculateDifficulty(puzzle: CSP<any>): number {
    const clueCount = puzzle.assignment.size
    const totalCells = puzzle.variables.length
    
    // 1. Clue density (0-50)
    const clueDensity = (clueCount / totalCells) * 50
    
    // 2. Constraint propagation (0-30)
    const propagationScore = this.estimatePropagationChains(puzzle) * 30
    
    // 3. Branching factor (0-20)
    const branchingScore = this.estimateBranchingFactor(puzzle) * 20
    
    return clueDensity + propagationScore + branchingScore // 0-100
  }
  
  private estimatePropagationChains(puzzle: CSP<any>): number {
    // Run AC-3 to count constraint propagation steps
    // More steps = harder (more logical deduction required)
  }
  
  private estimateBranchingFactor(puzzle: CSP<any>): number {
    // Count average domain size across variables
    // Larger domains = more guessing required
  }
}
```

---

## 7. Worker Orchestration & Async Strategy

### 7.1 Worker Interface & Message Protocol

```typescript
/**
 * Main Thread ←→ Dedicated Worker
 * Message-based communication (safe concurrency)
 */

interface WorkerMessage {
  type: 'SOLVE' | 'GENERATE' | 'ANALYZE'
  puzzleType: PuzzleType
  payload: {
    puzzle?: CSP<any>
    difficulty?: Difficulty
    timeout?: number
  }
  messageId: string
}

interface WorkerResponse {
  messageId: string
  success: boolean
  result?: {
    solved?: boolean
    assignment?: Map<string, any>
    estimatedDifficulty?: number
  }
  error?: string
  timeMs: number
}
```

### 7.2 Worker Lifecycle

```typescript
class PuzzleWorkerOrchestrator {
  private worker: Worker
  private pendingRequests: Map<string, Promise<WorkerResponse>>
  
  constructor() {
    this.worker = new Worker('src/workers/puzzle.worker.ts')
    this.worker.onmessage = (e) => this.handleWorkerResponse(e.data)
    this.pendingRequests = new Map()
  }
  
  /**
   * Offload solve to worker (async)
   * Main thread remains responsive
   */
  async solvePuzzle(puzzle: CSP<any>, timeout = 5000): Promise<SolveResult> {
    const messageId = this.generateId()
    
    const promise = new Promise<WorkerResponse>((resolve) => {
      this.pendingRequests.set(messageId, resolve as any)
    })
    
    this.worker.postMessage({
      type: 'SOLVE',
      puzzleType: puzzle.type,
      payload: { puzzle, timeout },
      messageId,
    })
    
    const response = await promise
    return response.result as SolveResult
  }
  
  /**
   * Offload generation to worker (async)
   * Validates solvability without blocking UI
   */
  async generatePuzzle(puzzleType: PuzzleType, difficulty: Difficulty): Promise<GeneratedPuzzle> {
    const messageId = this.generateId()
    
    const promise = new Promise<WorkerResponse>((resolve) => {
      this.pendingRequests.set(messageId, resolve as any)
    })
    
    this.worker.postMessage({
      type: 'GENERATE',
      puzzleType,
      payload: { difficulty },
      messageId,
    })
    
    const response = await promise
    return response.result as GeneratedPuzzle
  }
  
  private handleWorkerResponse(response: WorkerResponse) {
    const resolve = this.pendingRequests.get(response.messageId)
    if (resolve) {
      resolve(response)
      this.pendingRequests.delete(response.messageId)
    }
  }
  
  terminate() {
    this.worker.terminate()
  }
}
```

### 7.3 Worker Implementation

```typescript
// src/workers/puzzle.worker.ts

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { type, puzzleType, payload, messageId } = e.data
  const startTime = performance.now()
  
  try {
    let result
    
    switch (type) {
      case 'SOLVE':
        result = await handleSolve(payload.puzzle, payload.timeout)
        break
      case 'GENERATE':
        result = await handleGenerate(puzzleType, payload.difficulty)
        break
      case 'ANALYZE':
        result = await handleAnalyze(payload.puzzle)
        break
    }
    
    self.postMessage({
      messageId,
      success: true,
      result,
      timeMs: performance.now() - startTime,
    } as WorkerResponse)
  } catch (error) {
    self.postMessage({
      messageId,
      success: false,
      error: (error as Error).message,
      timeMs: performance.now() - startTime,
    } as WorkerResponse)
  }
}

async function handleSolve(puzzle: CSP<any>, timeout: number): Promise<SolveResult> {
  const selector = new DefaultSolverSelector()
  const solver = selector.selectSolver(puzzle.type, puzzle)
  return solver.solve(puzzle, timeout)
}

async function handleGenerate(puzzleType: PuzzleType, difficulty: Difficulty) {
  const generator = new ClueRemovalGenerator()
  return generator.generatePuzzle(difficulty)
}

async function handleAnalyze(puzzle: CSP<any>) {
  const calc = new DifficultyMetricsCalculator()
  return { estimatedDifficulty: calc.calculateDifficulty(puzzle) }
}
```

### 7.4 Sync vs. Async Decision Tree

```typescript
/**
 * When to use sync main-thread vs. async worker
 */

class PerformanceDecisionTree {
  shouldUseWorker(puzzleType: PuzzleType, boardSize: number, operation: 'SOLVE' | 'GENERATE'): boolean {
    const estimatedTime = this.estimateTime(puzzleType, boardSize, operation)
    
    // Sync: <100ms, Worker: 100ms-5s, WASM: >5s
    if (estimatedTime < 100) return false  // Main thread
    if (estimatedTime < 5000) return true   // Worker async
    return this.shouldUseWASM(puzzleType)   // WASM
  }
  
  private estimateTime(puzzleType, boardSize, operation): number {
    // Heuristics per game type
    switch (puzzleType) {
      case PuzzleType.QUEENS:
        return boardSize <= 20 ? 50 : boardSize <= 100 ? 500 : 5000
      case PuzzleType.SUDOKU_MINI:
        return operation === 'SOLVE' ? 50 : 2000  // Generation validates
      case PuzzleType.TANGO:
        return boardSize <= 10 ? 200 : 2000
      case PuzzleType.PATCHES:
        return operation === 'SOLVE' ? 1000 : 10000  // Expensive
      default:
        return 1000
    }
  }
  
  private shouldUseWASM(puzzleType: PuzzleType): boolean {
    // WASM only for extremely complex workloads (v2.0)
    return false  // Defer to v2.0
  }
}
```

---

## 8. WASM Integration (Optional, v2.0+)

### 8.1 WASM Decision Criteria

```typescript
/**
 * When to build WASM version
 * (Current: Not required for MVP)
 */

interface WASMCandidate {
  puzzleType: PuzzleType
  reason: string
  estimatedSpeedup: string
  priority: 'P0' | 'P1' | 'P2'
}

const wasmCandidates: WASMCandidate[] = [
  {
    puzzleType: PuzzleType.PATCHES,
    reason: 'Polyomino enumeration (exponential, memory-intensive)',
    estimatedSpeedup: '10-100x per iteration',
    priority: 'P1',  // High impact
  },
  {
    puzzleType: PuzzleType.QUEENS,
    reason: 'Large boards (N > 1000) with min-conflicts',
    estimatedSpeedup: '5-20x',
    priority: 'P1',
  },
  {
    puzzleType: PuzzleType.ZIP,
    reason: 'Batch generation (100+ puzzles)',
    estimatedSpeedup: '3-10x',
    priority: 'P2',
  },
]
```

### 8.2 WASM Fallback Strategy

```typescript
/**
 * WASM is optional enhancement
 * JavaScript implementation always correct
 */

class WASMLoader {
  private wasmInstance: WebAssembly.Instance | null = null
  
  async initialize(): Promise<boolean> {
    try {
      const wasmBuffer = await fetch('puzzle-engine.wasm')
      const wasmModule = await WebAssembly.instantiate(wasmBuffer)
      this.wasmInstance = wasmModule.instance
      return true
    } catch (e) {
      console.warn('WASM failed to load, using JavaScript fallback', e)
      return false
    }
  }
  
  /**
   * If WASM available, use it
   * Otherwise, fallback to JS (identical semantics)
   */
  solveQueens(boardSize: number): number[] {
    if (this.wasmInstance) {
      return this.wasmInstance.exports.solveQueens(boardSize) as number[]
    }
    return solveQueensJS(boardSize)  // Pure JS fallback
  }
}
```

---

## 9. CQRS Pattern Integration (App Layer)

### 9.1 Command Definitions

```typescript
/**
 * Commands represent user intents
 * Each command is immutable, serializable
 */

// Domain events resulting from commands
type DomainEvent =
  | GameCreatedEvent
  | CellPlacedEvent
  | CellRemovedEvent
  | GameSolvedEvent
  | GameGeneratedEvent
  | DifficultyChangedEvent

// Handlers execute commands, emit events
type CommandHandler<C extends Command> = (cmd: C) => Promise<DomainEvent[]>

interface Command {
  readonly type: string
}

// Command examples
class CreateGameCommand implements Command {
  readonly type = 'CREATE_GAME'
  constructor(
    readonly puzzleType: PuzzleType,
    readonly difficulty: Difficulty,
  ) {}
}

class PlaceCellCommand implements Command {
  readonly type = 'PLACE_CELL'
  constructor(
    readonly cellId: string,
    readonly value: number | string,
  ) {}
}

class SolveGameCommand implements Command {
  readonly type = 'SOLVE_GAME'
  constructor() {}
}

class GenerateGameCommand implements Command {
  readonly type = 'GENERATE_GAME'
  constructor(readonly difficulty: Difficulty) {}
}
```

### 9.2 Event Definitions

```typescript
interface DomainEvent {
  readonly type: string
  readonly timestamp: number
  readonly aggregate: string  // Entity ID
}

class GameCreatedEvent implements DomainEvent {
  readonly type = 'GAME_CREATED'
  constructor(
    readonly timestamp: number,
    readonly aggregate: string,
    readonly puzzleType: PuzzleType,
    readonly initialBoard: CSP<any>,
  ) {}
}

class CellPlacedEvent implements DomainEvent {
  readonly type = 'CELL_PLACED'
  constructor(
    readonly timestamp: number,
    readonly aggregate: string,
    readonly cellId: string,
    readonly value: number | string,
  ) {}
}

class GameSolvedEvent implements DomainEvent {
  readonly type = 'GAME_SOLVED'
  constructor(
    readonly timestamp: number,
    readonly aggregate: string,
    readonly solution: Map<string, any>,
    readonly solveTimeMs: number,
  ) {}
}
```

### 9.3 Command Bus & Handlers

```typescript
class CommandBus {
  private handlers: Map<string, CommandHandler<any>> = new Map()
  
  register<C extends Command>(type: string, handler: CommandHandler<C>) {
    this.handlers.set(type, handler)
  }
  
  async execute<C extends Command>(command: C): Promise<DomainEvent[]> {
    const handler = this.handlers.get(command.type)
    if (!handler) throw new Error(`No handler for ${command.type}`)
    return handler(command)
  }
}

// Example handler
class CreateGameCommandHandler implements CommandHandler<CreateGameCommand> {
  constructor(
    private cspFactory: CSPFactory,
    private eventStore: EventStore,
  ) {}
  
  async handle(cmd: CreateGameCommand): Promise<DomainEvent[]> {
    const csp = this.cspFactory.create(cmd.puzzleType)
    const gameId = generateId()
    
    const event = new GameCreatedEvent(
      Date.now(),
      gameId,
      cmd.puzzleType,
      csp,
    )
    
    await this.eventStore.append(gameId, [event])
    return [event]
  }
}
```

### 9.4 Query Models (Read)

```typescript
/**
 * Queries are read-only projections
 * Optimized for fast retrieval
 */

interface Query {
  readonly type: string
}

class GetGameStateQuery implements Query {
  readonly type = 'GET_GAME_STATE'
  constructor(readonly gameId: string) {}
}

class ListGamesQuery implements Query {
  readonly type = 'LIST_GAMES'
  constructor(readonly userId: string) {}
}

type QueryHandler<Q extends Query, R> = (query: Q) => Promise<R>

class QueryBus {
  private handlers: Map<string, QueryHandler<any, any>> = new Map()
  
  register<Q extends Query, R>(type: string, handler: QueryHandler<Q, R>) {
    this.handlers.set(type, handler)
  }
  
  async execute<Q extends Query, R>(query: Q): Promise<R> {
    const handler = this.handlers.get(query.type)
    if (!handler) throw new Error(`No handler for ${query.type}`)
    return handler(query)
  }
}

class GetGameStateQueryHandler implements QueryHandler<GetGameStateQuery, GameState> {
  constructor(private gameRepository: GameRepository) {}
  
  async handle(query: GetGameStateQuery): Promise<GameState> {
    return this.gameRepository.findById(query.gameId)
  }
}
```

---

## 10. File Structure & Organization

### 10.1 Root Level (src/)

```
src/
├── domain/
│   ├── index.ts
│   ├── types.ts                    # CSP, Variable, Domain, Constraint
│   ├── constants.ts                # Board sizes, defaults
│   ├── games/                      # Per-game module
│   │   ├── queens/
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   ├── constraints.ts
│   │   │   ├── factory.ts
│   │   │   └── difficulty.ts
│   │   ├── sudoku-mini/
│   │   ├── tango/
│   │   ├── zip/
│   │   ├── crossclimb/
│   │   ├── pinpoint/
│   │   └── patches/
│   ├── solvers/
│   │   ├── index.ts
│   │   ├── backtracking.ts
│   │   ├── constraint-propagation.ts
│   │   ├── local-search.ts
│   │   ├── sat-adapter.ts          # v2.0
│   │   └── selector.ts
│   ├── generators/
│   │   ├── index.ts
│   │   ├── clue-removal.ts
│   │   ├── difficulty-metrics.ts
│   │   └── factories.ts
│   └── csp/
│       ├── index.ts
│       ├── csp.ts
│       ├── constraint.ts
│       └── propagation.ts
│
├── app/
│   ├── index.ts
│   ├── hooks/
│   │   ├── useGame.ts
│   │   ├── useSolver.ts
│   │   ├── useGenerator.ts
│   │   ├── useDifficulty.ts
│   │   └── useWorker.ts
│   ├── context/
│   │   ├── GameContext.tsx
│   │   └── SolverContext.tsx
│   ├── services/
│   │   ├── cqrs.ts                 # CommandBus, QueryBus
│   │   ├── event-store.ts
│   │   └── game-repository.ts
│   └── adapters/
│       ├── game-converter.ts       # CSP ↔ GameState
│       └── event-projector.ts
│
├── ui/
│   ├── atoms/
│   │   ├── Cell.tsx                # Generic puzzle cell
│   │   ├── DifficultyPicker.tsx
│   │   ├── Timer.tsx
│   │   └── ...
│   ├── molecules/
│   │   ├── PuzzleBoard.tsx          # Generic grid layout
│   │   ├── StatusBar.tsx
│   │   ├── ControlPanel.tsx
│   │   └── ...
│   ├── organisms/
│   │   ├── QueensGame.tsx
│   │   ├── SudokuMiniGame.tsx
│   │   ├── TangoGame.tsx
│   │   ├── ZipGame.tsx
│   │   ├── CrossclimbGame.tsx
│   │   ├── PinpointGame.tsx
│   │   └── PatchesGame.tsx
│   └── pages/
│       ├── HomePage.tsx
│       ├── GamePage.tsx
│       └── GameSelectPage.tsx
│
├── workers/
│   ├── puzzle.worker.ts
│   └── puzzle-orchestrator.ts
│
├── wasm/                           # v2.0
│   ├── index.ts
│   ├── loader.ts
│   └── puzzle-engine.wasm          # binary
│
├── __tests__/
│   ├── domain/
│   │   ├── csp.test.ts
│   │   ├── solvers.test.ts
│   │   ├── generators.test.ts
│   │   └── games/
│   │       ├── queens.test.ts
│   │       ├── sudoku.test.ts
│   │       └── ...
│   └── app/
│       ├── cqrs.test.ts
│       └── hooks.test.ts
│
├── types.ts                        # Global type exports
├── App.tsx
├── index.tsx
└── styles.css
```

### 10.2 Constants & Configuration

```typescript
// src/domain/constants.ts
export const PUZZLE_BOARD_SIZES = {
  [PuzzleType.QUEENS]: [8, 16, 32],           // N×N
  [PuzzleType.SUDOKU_MINI]: [6, 4],           // 6×4
  [PuzzleType.TANGO]: [6, 8, 10],             // N×N (even)
  [PuzzleType.ZIP]: [5, 6, 7],                // Custom
  [PuzzleType.CROSSCLIMB]: [2, 4, 6],         // Word pair count
  [PuzzleType.PINPOINT]: [12, 16, 20],        // Item count
  [PuzzleType.PATCHES]: [8, 10, 12],          // N×N
}

export const DIFFICULTY_CLUES = {
  [PuzzleType.QUEENS]: {
    [Difficulty.EASY]: 0,
    [Difficulty.MEDIUM]: 0,
    [Difficulty.HARD]: 0,
    [Difficulty.EXPERT]: 0,
  },
  [PuzzleType.SUDOKU_MINI]: {
    [Difficulty.EASY]: 16,
    [Difficulty.MEDIUM]: 12,
    [Difficulty.HARD]: 8,
    [Difficulty.EXPERT]: 6,
  },
  // ... per-game
}

export const SOLVER_TIMEOUTS = {
  mainThread: 100,      // Sync only if < 100ms
  worker: 5000,         // Async worker 100ms-5s
  wasm: Infinity,       // WASM for >5s (v2.0)
}
```

---

## 11. Testing Strategy

### 11.1 Unit Tests (Domain Layer)

```typescript
// src/__tests__/domain/csp.test.ts
describe('CSP', () => {
  it('should validate constraint satisfaction', () => {
    const csp = createQueensCSP(8)
    const assignment = solveQueens(8)
    expect(csp.isSatisfiedBy(assignment)).toBe(true)
  })
})

// src/__tests__/domain/solvers.test.ts
describe('Solvers', () => {
  it('Backtracking: should solve 8x8 Sudoku under 100ms', () => {
    const puzzle = createSudokuPuzzle(Difficulty.MEDIUM)
    const startTime = performance.now()
    const result = new BacktrackingSolver().solve(puzzle, 100)
    expect(performance.now() - startTime).toBeLessThan(100)
    expect(result.solved).toBe(true)
  })
  
  it('Arc Consistency: should reduce domain significantly', () => {
    const puzzle = createSudokuPuzzle(Difficulty.HARD)
    const initial = countPossibilities(puzzle)
    new ConstraintPropagationSolver().solve(puzzle)
    const final = countPossibilities(puzzle)
    expect(final).toBeLessThan(initial * 0.1)  // 90% reduction
  })
  
  it('Min-Conflicts: should solve Queens 1000x1000', () => {
    const csp = createQueensCSP(1000)
    const result = new LocalSearchSolver().solve(csp, 5000)
    expect(result.solved).toBe(true)
  })
})

// src/__tests__/domain/generators.test.ts
describe('Generators', () => {
  it('should generate unique solvable puzzles', () => {
    const gen = new ClueRemovalGenerator()
    const puzzles = [1, 2, 3].map(() => gen.generatePuzzle(Difficulty.MEDIUM))
    expect(new Set(puzzles.map(p => p.puzzle.id)).size).toBe(3)  // All unique
  })
  
  it('should validate solvability for all difficulties', () => {
    const gen = new ClueRemovalGenerator()
    for (const difficulty of [EASY, MEDIUM, HARD, EXPERT]) {
      const puzzle = gen.generatePuzzle(difficulty)
      const solver = new ConstraintPropagationSolver()
      expect(solver.solve(puzzle.puzzle).solved).toBe(true)
    }
  })
})
```

### 11.2 Integration Tests (App Layer)

```typescript
// src/__tests__/app/cqrs.test.ts
describe('CQRS Flow', () => {
  it('should create game, place cell, solve', async () => {
    const bus = new CommandBus()
    const queryBus = new QueryBus()
    
    const createEvent = await bus.execute(
      new CreateGameCommand(PuzzleType.SUDOKU_MINI, Difficulty.EASY)
    )
    const gameId = createEvent[0].aggregate
    
    await bus.execute(new PlaceCellCommand('cell_0_0', 5))
    await bus.execute(new SolveGameCommand())
    
    const gameState = await queryBus.execute(new GetGameStateQuery(gameId))
    expect(gameState.isComplete).toBe(true)
  })
})

// src/__tests__/app/hooks.test.ts
describe('useGame Hook', () => {
  it('should manage game state and solve', async () => {
    const { result } = renderHook(() => useGame(PuzzleType.SUDOKU_MINI, Difficulty.EASY))
    
    expect(result.current.isLoading).toBe(false)
    expect(result.current.board).toBeDefined()
    
    act(() => {
      result.current.makeMove(0, 5)
    })
    
    expect(result.current.board[0]).toBe(5)
  })
})
```

### 11.3 Performance Tests

```typescript
// src/__tests__/performance.test.ts
describe('Performance', () => {
  it('Sudoku solve under SLA', () => {
    const sla = DIFFICULTY_CLUES[PuzzleType.SUDOKU_MINI][Difficulty.HARD].estimatedTime
    const puzzle = generateSudokuPuzzle(Difficulty.HARD)
    const startTime = performance.now()
    new ConstraintPropagationSolver().solve(puzzle)
    expect(performance.now() - startTime).toBeLessThan(sla)
  })
  
  it('Generation time under 30s', () => {
    const startTime = performance.now()
    new ClueRemovalGenerator().generatePuzzle(Difficulty.HARD, 30000)
    expect(performance.now() - startTime).toBeLessThan(30000)
  })
})
```

---

## 12. API Reference & Integration Examples

### 12.1 Creating a New Game (User Perspective)

```typescript
// In React component
const MyGameComponent = () => {
  const { board, isComplete, makeMove, solve, reset } = useGame(
    PuzzleType.QUEENS,
    Difficulty.MEDIUM
  )
  
  return (
    <>
      <GameBoard board={board} onCellClick={(idx, val) => makeMove(idx, val)} />
      <button onClick={() => solve()}>Solve</button>
      <button onClick={() => reset()}>New Game</button>
      {isComplete && <p>Puzzle Solved!</p>}
    </>
  )
}
```

### 12.2 Direct CSP Solving (Advanced)

```typescript
// Low-level CSP API
const csp = createQueensCSP(8)
const selector = new DefaultSolverSelector()
const solver = selector.selectSolver(PuzzleType.QUEENS, csp)
const result = solver.solve(csp, 100)

if (result.solved) {
  console.log('Solution:', result.assignment)
} else {
  console.log('Unsolvable after', result.iterations, 'iterations')
}
```

### 12.3 Async Solving via Worker

```typescript
const orchestrator = new PuzzleWorkerOrchestrator()
const puzzle = generateSudokuPuzzle(Difficulty.HARD)

const solution = await orchestrator.solvePuzzle(puzzle, 5000)
console.log('Solved in', solution.timeMs, 'ms')
```

---

## 13. Migration Path from Sudoku (Existing Code)

### 13.1 Compatibility Layer

```typescript
/**
 * Existing Sudoku code continues to work
 * New games integrate via CSP abstraction
 */

// Keep existing src/domain/rules.ts for Sudoku
export { createBoard, fillBoard, isValidPlacement, ... } from './rules.ts'

// Add adapter
export const sudokuToCSP = (board: Cell[][]): CSP<number> => {
  // Convert existing Sudoku domain to CSP format
  const csp: CSP<number> = {
    variables: board.flat().map((_, idx) => ({
      id: `cell_${idx}`,
      metadata: { row: Math.floor(idx / 9), col: idx % 9 }
    })),
    domains: board.flat().map((cell, idx) => ({
      variableId: `cell_${idx}`,
      possible: new Set(cell ? [cell] : [1, 2, 3, 4, 5, 6, 7, 8, 9]),
      initial: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
    })),
    constraints: [
      new UniqueRowConstraint(),
      new UniqueColumnConstraint(),
      new UniqueRegionConstraint(),
    ]
  }
  return csp
}
```

### 13.2 Phase Cutover

**Phase 1 (Current)**: Keep Sudoku as-is, validate CSP interface works  
**Phase 2**: Add new games (Queens, Mini Sudoku, etc.) as new CSP modules  
**Phase 3**: Optional: Refactor Sudoku to full CSP (if benefits clear)  

---

## 14. Success Metrics & Acceptance Criteria

### 14.1 Correctness

- ✅ All 7 games solve correctly (100% correctness)
- ✅ Difficulty metrics correlate with actual solve time (R² > 0.8)
- ✅ Generated puzzles are always solvable and unique

### 14.2 Performance

| Scenario | Target | Measurement |
|----------|--------|------------|
| Simple solve (Easy) | <100ms | Main thread, backtracking |
| Medium solve (Hard) | <500ms | Worker, constraint propagation |
| Complex generation | <30s | Worker, clue removal |
| Large board (Queens 1M) | <5s | Local search |

### 14.3 Maintainability

- ✅ New game type = 1 new module (constraints + factory)
- ✅ Solver algorithm change = No game-layer impact
- ✅ Test coverage >80% (all core paths)

---

## 15. Dependencies & Risks

### 15.1 Dependencies

**Hard Dependencies**:
- React 19, TypeScript 5.9, Vite 7.3
- Web Workers API (all modern browsers)

**Soft Dependencies** (optional):
- WASM v2.0 (AssemblyScript)
- SAT solver library (v2.0)
- ML libraries for Pinpoint (v2.0)

**No New Runtime Dependencies**: Avoid adding lodash, d3, external solvers

### 15.2 Risks & Mitigation

| Risk | Probability | Mitigation |
|------|-----------|-----------|
| Backtracking timeout on medium boards | Medium | Use constraint propagation + worker |
| Memory exhaustion (large boards) | Low | Lazy evaluation of domains |
| Worker message serialization (large CSP) | Medium | Compress assignment, transfer only delta |
| WASM build complexity | Low | Defer to v2.0, JavaScript always correct |

---

## 16. Next Steps (Phase 4 - Implementation)

### 16.1 Week 1: Core Infrastructure

1. Create domain/types.ts (CSP, Variable, Domain, Constraint)
2. Create domain/csp/ (core algorithms: backtracking, AC-3)
3. Create domain/games/queens/ (first game module)
4. Create domain/solvers/ (solver selector)
5. Unit tests for all above

### 16.2 Week 2: App & CQRS Layer

1. Create app/services/cqrs.ts (CommandBus, QueryBus)
2. Create app/hooks/useGame.ts (React integration)
3. Create workers/puzzle.worker.ts
4. Create app/adapters/game-converter.ts
5. Integration tests

### 16.3 Week 3: Remaining Games & UI

1. Create domain/games/{tango,zip,crossclimb,pinpoint,patches}/
2. Create UI organisms for each game
3. Create domain/generators/ (clue removal)
4. Performance tests

### 16.4 Week 4+: Polish & Optimization

1. Performance profiling + optimization
2. WASM v2.0 planning (if needed)
3. Documentation + examples
4. Production validation

---

## Appendix A: Game-Specific Notes

### Queens (NP-Complete, Heuristic-Friendly)

- Best approach: Min-conflicts local search for large N
- Edge case: N=2, N=3 have no solutions
- Difficulty: Clue count doesn't apply (solve from empty board)
- Alternative difficulty: Board size N

### Tango (NP-Complete CSP Variant)

- Constraint propagation essential (reduces search space 90%+)
- SAT solver optional (v2.0)
- Difficulty: Clue count (fewer clues = harder)

### Zip (NP-Complete Path Problem)

- Vertex-disjoint paths formulation
- Specialized algorithm vs. general CSP?
- Difficulty: Pair count + grid size

### Crossclimb (Polynomial Graph Search)

- BFS on word graph (word dictionary required)
- Hamming distance heuristic
- Difficulty: Distance between start/target

### Pinpoint (Clustering, Polynomial)

- k-means or hierarchical clustering
- Category definition required (hardcoded or API?)
- Difficulty: Cluster overlap / ambiguity

### Mini Sudoku (NP-Complete, Stable)

- Inherit existing Sudoku logic
- Grid variant: 6×4 or 4×4
- Difficulty: Clue count (same metrics as 9×9)

### Patches (Exponential, Combinatorial)

- Transfer-matrix enumeration for small boards
- Redelmeier's algorithm
- Difficulty: Extent of coverage / constraints

---

**Architecture Document Complete ✅**

Ready for implementation phase (Phase 4). All major design decisions captured, dependencies identified, testing strategy defined.

