# Instruction Baseline Profile

Date: 2026-04-12
Purpose: Portable baseline extracted from mature instruction-driven governance repositories.

## Why This Exists

Large multi-app repositories gain consistency when architecture/process guidance is split into focused instruction files. This profile captures the reusable baseline for that model while remaining repo-agnostic.

## Baseline File Set

Required when `ENFORCE_INSTRUCTION_BASELINE=1`:

1. `.github/instructions/01-build.instructions.md`
2. `.github/instructions/02-frontend.instructions.md`
3. `.github/instructions/03-electron.instructions.md`
4. `.github/instructions/04-capacitor.instructions.md`
5. `.github/instructions/05-wasm.instructions.md`
6. `.github/instructions/06-responsive.instructions.md`
7. `.github/instructions/07-ai-orchestration.instructions.md`
8. `.github/instructions/08-input-controls.instructions.md`
9. `.github/instructions/09-hook-patterns.instructions.md`
10. `.github/instructions/09-wcag-accessibility.instructions.md`
11. `.github/instructions/10-security.instructions.md`
12. `.github/instructions/11-performance.instructions.md`
13. `.github/instructions/12-error-handling.instructions.md`
14. `.github/instructions/13-mobile-gestures.instructions.md`
15. `.github/instructions/14-performance-optimization.instructions.md`
16. `.github/instructions/15-app-store-compliance.instructions.md`
17. `.github/instructions/16-ionic-integration.instructions.md`
18. `.github/instructions/17-testing.instructions.md`
19. `.github/instructions/18-capacitor-conditional.instructions.md`
20. `.github/instructions/19-nodejs-frontend-best-practices.instructions.md`

## Enforced Invariants

When instruction baseline enforcement is enabled, governance checks verify:

1. Shell governance exists in build/electron/capacitor instruction files (Bash-default model).
2. Capacitor docs do not regress to `npx cap` examples.
3. Testing instruction defines explicit taxonomy (`8 Test Types`).

## Governance Themes Captured

1. Bash/WSL default shell routing with explicit opt-in exceptions.
2. pnpm-only command policy across automation/config surfaces.
3. CLEAN architecture boundaries with app-local and package-level compatibility.
4. Atomic design and input/accessibility requirements for web/mobile/TV paths.
5. Security + OWASP supplement patterns for frontend and optional backend/API contexts.
6. Performance + Web Vitals + CSS critical-path quality gates.
7. Testing taxonomy and naming contracts (unit/integration/component/api/e2e/a11y/visual/perf).

## Adoption Modes

1. Light mode
- Copy this governance pack.
- Keep `ENFORCE_INSTRUCTION_BASELINE=0`.
- Use architecture and quality checks only.

2. Full instruction-governed mode
- Introduce full `.github/instructions` baseline.
- Set `ENFORCE_INSTRUCTION_BASELINE=1` in CI.
- Gate merges on instruction baseline + governance checks.

## Notes

- This profile intentionally avoids repository-specific release/docs/emoji workflows.
- Keep instruction files subordinate to repo authority (`AGENTS.md` and top-level governance docs).
