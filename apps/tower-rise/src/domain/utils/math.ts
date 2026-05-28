/**
 * TODO: PURPOSE
 * TODO: Hold deterministic scalar helpers reused by movement and hazard systems.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own pure numeric helpers only.
 *
 * TODO: INPUTS
 * TODO: Number operands.
 *
 * TODO: OUTPUTS
 * TODO: Clamped or interpolated numeric values.
 *
 * TODO: DEPENDENCIES
 * TODO: No imports.
 *
 * TODO: EDGE CASES
 * TODO: Clamp guards simulation from escaping world bounds.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Pure arithmetic keeps hot paths stable and JIT-friendly.
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))
