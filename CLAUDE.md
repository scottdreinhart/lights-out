# CLAUDE.md — Claude Copilot Policy

> **Authority**: This file is subordinate to `AGENTS.md`. All rules here inherit from and are aligned with AGENTS.md.
> **Foundation**: If any rule here conflicts with AGENTS.md, AGENTS.md wins.
> **Scope**: These rules apply when Claude is used as a coding assistant for this repository.

---

## Non-Negotiable Rules for Claude

When working on this repository, you MUST:

### 1. Read Governance First

Before making any changes:

- [ ] Read `AGENTS.md` (especially § 0, § 3, § 4)
- [ ] Read `.github/copilot-instructions.md`
- [ ] Read `.github/instructions/` files relevant to the task
- [ ] Inspect existing code to identify patterns and reusable components

**Do not skip governance reading.** The rules there prevent architectural violations and duplicate work.

### 2. Reuse Existing Code

Before creating anything new:

- Search for existing components, hooks, utilities, types, services, stores, and patterns
- Extend existing implementations instead of building parallel code
- Do not create duplicate functionality or parallel abstractions
- Prefer composition and extension of existing scaffolding

**Reuse first. If it already exists well, use it.**

### 3. Make Minimal, Surgical Changes

- Make the smallest correct change set possible
- Prefer surgical edits over rewrites
- Preserve naming, structure, conventions, and file layout unless the task explicitly requires change
- Update existing files instead of creating replacements where possible

**Small, focused changes are safer and easier to verify.**

### 4. Respect Architecture

- Respect boundaries, layering, separation of concerns, and import rules (AGENTS.md § 3–4)
- Never bypass architecture for convenience
- Never introduce cross-layer shortcuts or violate barrel/import conventions
- Never move or rename files without justification

**Architecture is sacred. Violations break the entire system.**

### 5. No Fake Completion

- Do not claim work is complete without running relevant checks
- Do not leave placeholder wiring, fake handlers, mock flows, or incomplete integrations
- Do not treat partial scaffolding as finished implementation
- Do not skip tests or mark work done if verification hasn't been run

**Real completion is verified. Fake completion is a trap.**

### 6. Quality Gates Are Mandatory

After making changes, run ALL relevant checks:

- `pnpm check` (lint + format:check + typecheck)
- `pnpm test` (unit/integration/component/api tests)
- `pnpm test:e2e` (E2E tests if applicable)
- `pnpm validate` (full gate: check + build)
- `pnpm test:names` (test naming validation)
- Any app-specific checks (Electron, Capacitor, WASM)

**If checks fail, fix the code. Do not weaken rules or skip verifications.**

**Self-Correction Loop When Checks Fail**:

1. **Read error output carefully** — Identify root cause, not just symptom
2. **Fix the root cause** — Address the underlying issue in code or config
3. **Rerun the command** — Verify the fix resolved the problem
4. **Repeat until green** — Keep fixing and retesting until all checks pass
5. **Never stop early** — Code that "looks right" is not done until checks pass

**Forbidden**: Disable rules, loosen types, delete tests, use `// eslint-disable` or `// @ts-ignore`, comment out code, skip validation, claim success before checks pass.

### 7. Preserve Governance

- Do not erase, replace, or dilute repo-specific instructions
- Do not introduce conflicts with existing AGENTS.md or instruction files
- Expand and harmonize governance surgically rather than rewriting it

**Governance is the foundation. Preserve it.**

### 8. Prefer Deterministic Validation

- Favor type safety, linting, tests, and static analysis over intuition
- Keep nullability, edge cases, error handling, and security concerns explicit
- Avoid hidden side effects and implicit behavior
- Use repo tools (typecheck, lint, tests, build) as the source of truth

**The machine is right. Intuition without proof is wrong.**

### 9. Control Dependencies

- Do not add new dependencies unless absolutely necessary
- Prefer existing installed packages and repo tooling
- Preserve the existing package manager (pnpm) and workspace conventions
- Justify any new dependency briefly in your output

**Each dependency is a liability.**

### 10. Match Repo Conventions Exactly

- Follow established file structure, naming, folder layout exactly
- Use existing export/import patterns, barrel conventions, and path aliases
- Match existing state patterns, data flow, and error handling
- Reuse existing shared hooks, components, utilities wherever applicable
- Match accessibility, keyboard navigation, focus behavior, and modal patterns

**Consistency is not optional.**

### 11. CSS PERFORMANCE & RENDERING OPTIMIZATION (MANDATORY)

**ALL CSS changes must comply with AGENTS.md § 30 and `.github/instructions/20-css-performance-rendering-optimization.instructions.md`**

**Mandatory Enforcement**:
- Lighthouse score ≥80 (target ≥90) — Non-negotiable quality gate
- Core Web Vitals passing: FCP <1.8s, LCP <2.5s, CLS <0.1
- CSS critical path <50KB
- DevTools Coverage >80% CSS used
- No render-blocking CSS beyond critical path
- No parser-blocking JS in `<head>`

**Before submitting CSS changes**:
1. Run Lighthouse audit (`npx lighthouse <url> --view`)
2. Open DevTools Network → verify critical resources download first
3. Open DevTools Coverage → verify CSS usage >80%
4. Verify no layout shifts (CLS <0.1)
5. Verify animations use transform/opacity only (no reflow)
6. Run `pnpm validate` — must pass ≥80 Lighthouse score

**Failure condition**: Any CSS change dropping Lighthouse by >5 points or exceeding thresholds must be reverted and reworked.

---

## Workflow Template

For each task, follow this pattern:

1. **Read** — Inspect AGENTS.md § 0, § 0.A (Runtime Validation), relevant instruction files, and existing code
2. **Plan** — Briefly state the plan and identify existing code to reuse
3. **Search** — Find existing components, hooks, utilities, and patterns; extend rather than create
4. **Edit** — Make minimal, surgical changes; update existing files instead of creating new ones
5. **Verify** — Run all relevant checks (`pnpm check`, `pnpm test`, `pnpm validate`)
6. **Self-Correct** — If checks fail, follow the self-correction loop (AGENTS.md § 0.A):
   - Read error output carefully
   - Fix the root cause
   - Rerun the command
   - Repeat until green (never disable checks or weaken rules)
7. **Report** — Summarize what changed and confirm all checks pass

**See AGENTS.md § 0.A for the complete self-correction loop requirements.**

---

## Key References

For detailed guidance, see:

- **AGENTS.md § 0** — Full non-negotiable AI operating rules
- **AGENTS.md § 0.A** — Runtime Validation & Self-Correction loop (MANDATORY)
- **AGENTS.md § 3–4** — Architecture and path discipline
- **.github/copilot-instructions.md** — Operational rules for all AI assistants
- **.github/instructions/** — Domain-specific guidance (build, frontend, Electron, etc.)

---

## Summary

You are working in a production-oriented repository with strict governance.
Read the rules. Reuse existing code. Make minimal changes. Run checks. Do not fake completion.

**AGENTS.md is the source of truth. When in doubt, read it.**
