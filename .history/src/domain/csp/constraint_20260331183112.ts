/**
 * Base Constraint Class & Common Constraint Implementations
 *
 * All game-specific constraints inherit from BaseConstraint.
 * This module provides the foundation and common utilities.
 */

import type { Constraint } from './types'

// ============================================================================
// BASE CONSTRAINT CLASS
// ============================================================================

/**
 * Abstract base class for all constraints.
 *
 * Subclasses override the core methods and optionally optimize
 * getConflictingVariables and getViolations for their specific domain.
 */
export abstract class BaseConstraint implements Constraint {
  name: string
  scope: string[]

  constructor(name: string, scope: string[]) {
    this.name = name
    this.scope = scope
  }

  /**
   * Core constraint satisfaction check.
   * Subclasses must implement this.
   */
  abstract isSatisfied(
    assignment: Map<string, number | string | boolean>,
  ): boolean

  /**
   * (Optional) Identify conflicting variables.
   * Default implementation: return all scope variables that are assigned.
   * Subclasses can override for optimization.
   */
  getConflictingVariables(
    assignment: Map<string, number | string | boolean>,
    _variableId: string,
  ): string[] {
    return this.scope.filter((varId) => assignment.has(varId))
  }

  /**
   * (Optional) Get all violations in current assignment.
   * Default implementation: check if constraint is satisfied.
   * If not, return entire scope.
   * Subclasses can override for detailed violation reporting.
   */
  getViolations(assignment: Map<string, number | string | boolean>): string[] {
    if (!this.isSatisfied(assignment)) {
      return this.scope.filter((varId) => assignment.has(varId))
    }
    return []
  }
}

// ============================================================================
// COMMON CONSTRAINT IMPLEMENTATIONS
// ============================================================================

/**
 * Uniqueness Constraint: All variables in scope must have different values.
 * Used by: Sudoku rows/cols/regions, Queens no duplicate positions, etc.
 */
export class UniqueConstraint extends BaseConstraint {
  isSatisfied(assignment: Map<string, number | string | boolean>): boolean {
    const values: Set<number | string | boolean> = new Set()

    for (const varId of this.scope) {
      if (assignment.has(varId)) {
        const value = assignment.get(varId)!
        if (values.has(value)) {
          return false  // Duplicate found
        }
        values.add(value)
      }
    }

    return true  // All assigned values unique
  }
}

/**
 * Inclusion Constraint: At least one variable in scope must equal target value.
 * Used by: Sudoku (each digit 1-9 appears once per row), etc.
 */
export class InclusionConstraint extends BaseConstraint {
  constructor(
    name: string,
    scope: string[],
    private targetValue: number | string | boolean,
  ) {
    super(name, scope)
  }

  isSatisfied(assignment: Map<string, number | string | boolean>): boolean {
    // If all variables assigned, check if target appears
    if (this.scope.every((varId) => assignment.has(varId))) {
      const values = this.scope.map((varId) => assignment.get(varId))
      return values.includes(this.targetValue)
    }

    // If partial, might still satisfy (other variables could have target)
    // So we can't definitively say false yet
    return true
  }

  getViolations(
    assignment: Map<string, number | string | boolean>,
  ): string[] {
    // Only report violation if all assigned and target missing
    if (this.scope.every((varId) => assignment.has(varId))) {
      const values = this.scope.map((varId) => assignment.get(varId))
      if (!values.includes(this.targetValue)) {
        return this.scope.filter((varId) => assignment.has(varId))
      }
    }
    return []
  }
}

/**
 * Binary Constraint: Binary predicate between two variables.
 * Base for all pairwise constraints.
 */
export abstract class BinaryConstraint extends BaseConstraint {
  constructor(
    name: string,
    protected varId1: string,
    protected varId2: string,
  ) {
    super(name, [varId1, varId2])
  }

  /**
   * Binary predicate to implement in subclasses.
   * @returns true if constraint satisfied, false otherwise
   */
  protected abstract isSatisfiedPairwise(
    value1: number | string | boolean,
    value2: number | string | boolean,
  ): boolean

  isSatisfied(assignment: Map<string, number | string | boolean>): boolean {
    const val1 = assignment.get(this.varId1)
    const val2 = assignment.get(this.varId2)

    // If both assigned, check predicate
    if (val1 !== undefined && val2 !== undefined) {
      return this.isSatisfiedPairwise(val1, val2)
    }

    // If partial, can't definitively say false
    return true
  }
}

/**
 * Inequality Constraint: Two variables must have different values.
 * Used by: X != Y (e.g., adjacent Tango cells must differ)
 */
export class InequalityConstraint extends BinaryConstraint {
  constructor(varId1: string, varId2: string) {
    super('inequality', varId1, varId2)
  }

  protected isSatisfiedPairwise(
    value1: number | string | boolean,
    value2: number | string | boolean,
  ): boolean {
    return value1 !== value2
  }
}

/**
 * Equality Constraint: Two variables must have the same value.
 * Used by: X = Y (e.g., mirrored Sudoku cells)
 */
export class EqualityConstraint extends BinaryConstraint {
  constructor(varId1: string, varId2: string) {
    super('equality', varId1, varId2)
  }

  protected isSatisfiedPairwise(
    value1: number | string | boolean,
    value2: number | string | boolean,
  ): boolean {
    return value1 === value2
  }
}

/**
 * Domain Constraint: Variable can only take specific values.
 * Used by: Restricted domains (e.g., only values 1-3 allowed)
 */
export class DomainConstraint extends BaseConstraint {
  constructor(
    varId: string,
    private allowedValues: Set<number | string | boolean>,
  ) {
    super('domain', [varId])
  }

  isSatisfied(assignment: Map<string, number | string | boolean>): boolean {
    if (!assignment.has(this.scope[0])) {
      return true  // Not yet assigned
    }

    const value = assignment.get(this.scope[0])!
    return this.allowedValues.has(value)
  }
}

/**
 * Custom Constraint: Arbitrary user-provided predicate.
 * Used for: Game-specific logic that doesn't fit standard patterns.
 */
export class CustomConstraint extends BaseConstraint {
  constructor(
    name: string,
    scope: string[],
    private predicate: (
      assignment: Map<string, number | string | boolean>,
    ) => boolean,
  ) {
    super(name, scope)
  }

  isSatisfied(assignment: Map<string, number | string | boolean>): boolean {
    return this.predicate(assignment)
  }
}

// ============================================================================
// CONSTRAINT REGISTRY & UTILITIES
// ============================================================================

/**
 * Constraint factory for common patterns.
 * Used throughout the codebase for consistency.
 */
export const ConstraintFactory = {
  /**
   * Create uniqueness constraint (all different in scope)
   */
  unique(name: string, varIds: string[]): UniqueConstraint {
    return new UniqueConstraint(name, varIds)
  },

  /**
   * Create inclusion constraint (at least one variable equals target)
   */
  inclusion(
    name: string,
    varIds: string[],
    targetValue: number | string | boolean,
  ): InclusionConstraint {
    return new InclusionConstraint(name, varIds, targetValue)
  },

  /**
   * Create inequality constraint (two variables differ)
   */
  notEqual(varId1: string, varId2: string): InequalityConstraint {
    return new InequalityConstraint(varId1, varId2)
  },

  /**
   * Create equality constraint (two variables equal)
   */
  equal(varId1: string, varId2: string): EqualityConstraint {
    return new EqualityConstraint(varId1, varId2)
  },

  /**
   * Create domain constraint (variable restricted to values)
   */
  domain(
    varId: string,
    allowedValues: Set<number | string | boolean>,
  ): DomainConstraint {
    return new DomainConstraint(varId, allowedValues)
  },

  /**
   * Create custom constraint from predicate
   */
  custom(
    name: string,
    varIds: string[],
    predicate: (assignment: Map<string, number | string | boolean>) => boolean,
  ): CustomConstraint {
    return new CustomConstraint(name, varIds, predicate)
  },
}

export default BaseConstraint
