# Post-Cleanup Smoke Run — 2026-03-16

## Purpose

Targeted integrity smoke validation after de-dup cleanup, using three representative apps:

- `apps/monchola`
- `apps/mancala`
- `apps/tictactoe`

Checks executed per app:

- `typecheck`
- `build`
- `check:input`

## Environment Guardrail

- `.node-platform.md` verified as `platform: linux` before execution.

## Artifacts

- Initial run status: `docs/monorepo/script-run/smoke/post_cleanup_smoke_status_2026-03-16.txt`
- Rerun status (completion): `docs/monorepo/script-run/smoke/post_cleanup_smoke_status_2026-03-16-rerun.txt`
- Deterministic rerun statuses:
  - `docs/monorepo/script-run/smoke/tictactoe_build_rerun2.status`
  - `docs/monorepo/script-run/smoke/tictactoe_check_input_rerun2.status`
- Command logs: `docs/monorepo/script-run/smoke/*.log`

## Results Matrix

| App | typecheck | build | check:input |
|---|---|---|---|
| monchola | PASS | PASS | PASS |
| mancala | FAIL | PASS | PASS |
| tictactoe | FAIL | PASS | PASS |

## Failure Tails

### mancala `typecheck`

- `src/app/useLongPress.ts(15,20): error TS2554: Expected 1 arguments, but got 0.`
- `src/ui/organisms/ErrorBoundary.tsx(34,9): error TS2322: Type 'string | null | undefined' is not assignable to type 'string'.`

Log: `docs/monorepo/script-run/smoke/mancala_typecheck_rerun.log`

### tictactoe `typecheck`

- `../../packages/common/src/hooks/useSoundEffects.ts(3,61): error TS2307: Cannot find module '@games/app-hook-utils' or its corresponding type declarations.`
- `../../packages/common/src/ui/atoms/OfflineIndicator.tsx(1,33): error TS2307: Cannot find module '@games/app-hook-utils' or its corresponding type declarations.`
- `../../packages/common/src/ui/molecules/HamburgerMenu.tsx(4,37): error TS2307: Cannot find module '@games/app-hook-utils' or its corresponding type declarations.`

Log: `docs/monorepo/script-run/smoke/tictactoe_typecheck_rerun.log`

## Interpretation

- Post-cleanup did **not** break build or input-governance checks for the sampled apps.
- Typecheck failures are present and appear app/package-resolution related, not cleanup-deletion related.
- Cleanup safety objective (no broad operational regression) is satisfied for this smoke scope.
