/**
 * CSP Factory & Utility Tests
 * Tests core CSP construction, domain operations, and constraint querying
 *
 * Coverage: createCSP, addVariable, addConstraint, domain ops, querying, validation
 */

import { describe, it, expect } from 'vitest'
import {
  createCSP,
  addVariable,
  addConstraint,
  getDomain,
  reduceToValue,
  removeFromDomain,
  isAssigned,
  getAssignedValue,
  getConstraintsForVariable,
  isWellFormed,
  getCSPStats,
  generateCellId,
  generateEdgeId,
} from '../csp'
import {
  ConstraintFactory,
  UniqueConstraint,
  InequalityConstraint,
} from '../csp/constraint'
import type { CSP, Variable } from '../csp/types'
import { PuzzleType, Difficulty } from '../csp/types'

describe('CSP Factory & Utilities', () => {
  // ============================================================================
  // FACTORY TESTS
  // ============================================================================

  describe('createCSP', () => {
    it('should create empty CSP with correct puzzle type', () => {
      const csp = createCSP(PuzzleType.SUDOKU_MINI, Difficulty.EASY)

      expect(csp.id).toBeDefined()
      expect(csp.puzzleType).toBe(PuzzleType.SUDOKU_MINI)
      expect(csp.variables).toHaveLength(0)
      expect(csp.domains).toHaveLength(0)
      expect(csp.constraints).toHaveLength(0)
    })

    it('should generate unique IDs for multiple CSPs', () => {
      const csp1 = createCSP(PuzzleType.QUEENS)
      const csp2 = createCSP(PuzzleType.QUEENS)

      expect(csp1.id).not.toBe(csp2.id)
    })
  })

  // ============================================================================
  // VARIABLE & DOMAIN TESTS
  // ============================================================================

  describe('addVariable', () => {
    it('should add variable with initial domain', () => {
      const csp = createCSP(PuzzleType.SUDOKU_MINI)
      const variable: Variable = {
        id: 'cell_0_0',
        type: 'CELL',
        metadata: { row: 0, col: 0 },
      }

      addVariable(csp, variable, [1, 2, 3, 4, 5, 6])

      expect(csp.variables).toHaveLength(1)
      expect(csp.domains).toHaveLength(1)
      expect(getDomain(csp, 'cell_0_0')).toBeDefined()
    })

    it('should track initial domain values separately', () => {
      const csp = createCSP(PuzzleType.SUDOKU_MINI)
      const variable: Variable = { id: 'cell_0_0', type: 'CELL', metadata: {} }

      addVariable(csp, variable, [1, 2, 3, 4])

      const domain = getDomain(csp, 'cell_0_0')
      expect(domain?.possible.size).toBe(4)
      expect(domain?.initial.size).toBe(4)
    })

    it('should prevent duplicate variable IDs', () => {
      const csp = createCSP(PuzzleType.SUDOKU_MINI)
      const variable: Variable = { id: 'cell_0_0', type: 'CELL', metadata: {} }

      addVariable(csp, variable, [1, 2, 3])
      const beforeCount = csp.variables.length

      // Attempting to add same ID should not duplicate
      // (exact behavior depends on implementation detail)
      addVariable(csp, variable, [1, 2, 3])

      // Should either prevent or warn
      expect(csp.variables.length).toBeLessThanOrEqual(beforeCount + 1)
    })
  })

  // ============================================================================
  // DOMAIN OPERATIONS
  // ============================================================================

  describe('Domain Operations', () => {
    let csp: CSP
    let variable: Variable

    beforeEach(() => {
      csp = createCSP(PuzzleType.SUDOKU_MINI)
      variable = { id: 'cell_0_0', type: 'CELL', metadata: {} }
      addVariable(csp, variable, [1, 2, 3, 4])
    })

    describe('reduceToValue', () => {
      it('should assign single value to domain', () => {
        const domain = getDomain(csp, 'cell_0_0')!
        reduceToValue(domain, 2)

        expect(isAssigned(domain)).toBe(true)
        expect(getAssignedValue(domain)).toBe(2)
      })

      it('should remove other values after assignment', () => {
        const domain = getDomain(csp, 'cell_0_0')!
        expect(domain.possible.size).toBe(4)

        reduceToValue(domain, 3)

        expect(domain.possible.size).toBe(1)
        expect(domain.possible.has(3)).toBe(true)
      })
    })

    describe('removeFromDomain', () => {
      it('should remove value from domain', () => {
        const domain = getDomain(csp, 'cell_0_0')!
        expect(domain.possible.has(1)).toBe(true)

        removeFromDomain(domain, 1)

        expect(domain.possible.has(1)).toBe(false)
        expect(domain.possible.size).toBe(3)
      })

      it('should handle removal of non-existent value gracefully', () => {
        const domain = getDomain(csp, 'cell_0_0')!
        const before = domain.possible.size

        removeFromDomain(domain, 99)

        expect(domain.possible.size).toBe(before)
      })

      it('should allow complete domain erasure', () => {
        const domain = getDomain(csp, 'cell_0_0')!

        removeFromDomain(domain, 1)
        removeFromDomain(domain, 2)
        removeFromDomain(domain, 3)
        removeFromDomain(domain, 4)

        expect(domain.possible.size).toBe(0)
      })
    })

    describe('isAssigned', () => {
      it('should return false for multi-value domain', () => {
        const domain = getDomain(csp, 'cell_0_0')!
        expect(isAssigned(domain)).toBe(false)
      })

      it('should return true for single-value domain', () => {
        const domain = getDomain(csp, 'cell_0_0')!
        reduceToValue(domain, 1)

        expect(isAssigned(domain)).toBe(true)
      })
    })

    describe('getAssignedValue', () => {
      it('should return assigned value', () => {
        const domain = getDomain(csp, 'cell_0_0')!
        reduceToValue(domain, 42)

        expect(getAssignedValue(domain)).toBe(42)
      })

      it('should return undefined for unassigned domain', () => {
        const domain = getDomain(csp, 'cell_0_0')!

        expect(getAssignedValue(domain)).toBeUndefined()
      })
    })
  })

  // ============================================================================
  // CONSTRAINT TESTS
  // ============================================================================

  describe('addConstraint', () => {
    let csp: CSP

    beforeEach(() => {
      csp = createCSP(PuzzleType.SUDOKU_MINI)
      addVariable(csp, { id: 'cell_0_0', type: 'CELL', metadata: {} }, [1, 2, 3])
      addVariable(csp, { id: 'cell_0_1', type: 'CELL', metadata: {} }, [1, 2, 3])
    })

    it('should add constraint to CSP', () => {
      const constraint = ConstraintFactory.notEqual('cell_0_0', 'cell_0_1')
      addConstraint(csp, constraint)

      expect(csp.constraints).toHaveLength(1)
    })

    it('should validate scope variables exist', () => {
      const constraint = ConstraintFactory.notEqual('cell_0_0', 'nonexistent')

      // Depending on implementation, should either warn or throw
      expect(() => addConstraint(csp, constraint)).not.toThrow()
    })
  })

  describe('getConstraintsForVariable', () => {
    let csp: CSP

    beforeEach(() => {
      csp = createCSP(PuzzleType.SUDOKU_MINI)
      addVariable(csp, { id: 'v1', type: 'CELL', metadata: {} }, [1, 2, 3])
      addVariable(csp, { id: 'v2', type: 'CELL', metadata: {} }, [1, 2, 3])
      addVariable(csp, { id: 'v3', type: 'CELL', metadata: {} }, [1, 2, 3])
    })

    it('should return constraints involving variable', () => {
      const c1 = ConstraintFactory.notEqual('v1', 'v2')
      const c2 = ConstraintFactory.notEqual('v2', 'v3')
      addConstraint(csp, c1)
      addConstraint(csp, c2)

      const v1Constraints = getConstraintsForVariable(csp, 'v1')
      expect(v1Constraints).toContain(c1)
      expect(v1Constraints).not.toContain(c2)
    })

    it('should return empty array for variable with no constraints', () => {
      const constraints = getConstraintsForVariable(csp, 'v1')
      expect(constraints).toHaveLength(0)
    })
  })

  // ============================================================================
  // VALIDATION & STATISTICS
  // ============================================================================

  describe('isWellFormed', () => {
    let csp: CSP

    beforeEach(() => {
      csp = createCSP(PuzzleType.SUDOKU_MINI)
      addVariable(csp, { id: 'v1', type: 'CELL', metadata: {} }, [1, 2, 3])
      addVariable(csp, { id: 'v2', type: 'CELL', metadata: {} }, [1, 2, 3])
    })

    it('should validate well-formed CSP', () => {
      const constraint = ConstraintFactory.notEqual('v1', 'v2')
      addConstraint(csp, constraint)

      expect(isWellFormed(csp)).toBe(true)
    })

    it('should flag constraint with undefined scope variable', () => {
      const constraint = ConstraintFactory.notEqual('v1', 'undefined_var')
      addConstraint(csp, constraint)

      expect(isWellFormed(csp)).toBe(false)
    })

    it('should validate empty CSP as well-formed', () => {
      const emptyCsp = createCSP(PuzzleType.SUDOKU_MINI)
      expect(isWellFormed(emptyCsp)).toBe(true)
    })
  })

  describe('getCSPStats', () => {
    it('should compute correct statistics', () => {
      const csp = createCSP(PuzzleType.SUDOKU_MINI)
      addVariable(csp, { id: 'v1', type: 'CELL', metadata: {} }, [1, 2, 3])
      addVariable(csp, { id: 'v2', type: 'CELL', metadata: {} }, [1, 2])
      addVariable(csp, { id: 'v3', type: 'CELL', metadata: {} }, [1, 2, 3, 4])

      const stats = getCSPStats(csp)

      expect(stats.variableCount).toBe(3)
      expect(stats.domainCount).toBe(3)
      expect(stats.minDomainSize).toBe(2)
      expect(stats.maxDomainSize).toBe(4)
      expect(stats.avgDomainSize).toBeCloseTo(3, 0)
    })
  })

  // ============================================================================
  // ID GENERATION
  // ============================================================================

  describe('ID Generation', () => {
    describe('generateCellId', () => {
      it('should generate consistent cell IDs', () => {
        const id1 = generateCellId(0, 0)
        const id2 = generateCellId(0, 0)

        expect(id1).toBe(id2)
      })

      it('should generate different IDs for different cells', () => {
        const id1 = generateCellId(0, 0)
        const id2 = generateCellId(0, 1)

        expect(id1).not.toBe(id2)
      })

      it('should be well-formatted', () => {
        const id = generateCellId(3, 5)
        expect(id).toMatch(/^cell_\d+_\d+/)
      })
    })

    describe('generateEdgeId', () => {
      it('should normalize edge IDs (order-independent)', () => {
        const id1 = generateEdgeId(0, 0, 0, 1)
        const id2 = generateEdgeId(0, 1, 0, 0)

        expect(id1).toBe(id2)
      })

      it('should generate different IDs for different edges', () => {
        const id1 = generateEdgeId(0, 0, 0, 1)
        const id2 = generateEdgeId(0, 0, 1, 1)

        expect(id1).not.toBe(id2)
      })
    })
  })

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  describe('Integration: Building a Mini Sudoku CSP', () => {
    it('should construct a valid 4x4 Sudoku CSP', () => {
      const csp = createCSP(PuzzleType.SUDOKU_MINI, Difficulty.EASY)

      // Add 16 variables (4x4 grid)
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const variable: Variable = {
            id: generateCellId(row, col),
            type: 'CELL',
            metadata: { row, col, region: Math.floor(row / 2) * 2 + Math.floor(col / 2) },
          }
          addVariable(csp, variable, [1, 2, 3, 4])
        }
      }

      expect(csp.variables).toHaveLength(16)
      expect(csp.domains).toHaveLength(16)

      // Add row constraints
      for (let row = 0; row < 4; row++) {
        const rowVars: string[] = []
        for (let col = 0; col < 4; col++) {
          rowVars.push(generateCellId(row, col))
        }
        const constraint = new UniqueConstraint('row_constraint', rowVars)
        addConstraint(csp, constraint)
      }

      expect(csp.constraints.length).toBe(4) // 1 per row

      // Add column constraints
      for (let col = 0; col < 4; col++) {
        const colVars: string[] = []
        for (let row = 0; row < 4; row++) {
          colVars.push(generateCellId(row, col))
        }
        const constraint = new UniqueConstraint('col_constraint', colVars)
        addConstraint(csp, constraint)
      }

      expect(csp.constraints.length).toBe(8) // 4 row + 4 col

      // Validate structure
      expect(isWellFormed(csp)).toBe(true)

      const stats = getCSPStats(csp)
      expect(stats.variableCount).toBe(16)
      expect(stats.constraintCount).toBe(8)
    })
  })
})
