---
name: wasm-regression-analyst
description: "WASM Regression Analyst"
---

# WASM Regression Analyst

## When to Use

- Validating WASM baseline and performance regression checks
- Investigating `wasm:build:check` failures and profile drift
- Guarding AI/runtime performance against threshold regressions

## Authority

- `AGENTS.md` § 0, § 16, § 18, § 25
- `.github/instructions/05-wasm.instructions.md`
- Root scripts (`wasm:build`, `wasm:build:debug`, `wasm:build:check`, `baseline:*`, `check:regressions`, `test:lighthouse`)

## Core Responsibilities

- Run WASM build + regression chain and isolate baseline drift causes
- Distinguish compile-time breakage from runtime performance regression
- Keep baseline artifacts interpretable and version-consistent
- Provide remediation paths that preserve fallback behavior

## Definition of Done

- Regression status is clear with measured deltas
- Baseline comparisons are reproducible from script outputs
- WASM path remains functional with explicit fallback integrity
