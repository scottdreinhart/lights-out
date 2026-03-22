# Post-Cleanup Validation — 2026-03-16

## Scope

Validation after duplicate-governance cleanup (`docs/monorepo/DEDUP-CLEANUP-2026-03-16.md`, 155 removed paths).

## Checks Performed

- Verified cleanup report targets only duplicate app-level governance/workflow/lock/workspace files.
- Spot-checked app directories (`apps/battleship`, `apps/mancala`, `apps/nim`) to confirm app source/config files remain.
- Verified workspace package discovery: `apps/*/package.json` returns 25 app packages.
- Verified root workspace globs in `pnpm-workspace.yaml` still include `apps/*`.
- Scanned for stale invalid alias `moncala` references.

## Results

- Structural integrity: **PASS**
- App package discovery: **PASS** (25/25)
- Root workspace config: **PASS**
- Invalid alias in active scripts/config: **PASS** (none in root `package.json`)
- Invalid alias in historical artifacts: **EXPECTED** (legacy log filenames/content retained)

## Hygiene Fixes Applied

- Normalized active summary docs from `moncala:*` to `mancala:*`:
  - `docs/monorepo/MONCHOLA-ROOT-SCRIPT-VERIFICATION-2026-03-16.md`
  - `docs/monorepo/monchola-script-status.txt`
  - `docs/monorepo/script-run/summary.txt`
- Preserved legacy artifact filenames in notes for traceability.

## Remaining Safe Opportunities

1. Keep historical logs unchanged (recommended) unless a full archival rename pass is explicitly requested.
2. Decide policy for app-level `.npmrc` additive setting (`node-linker=hoisted`) before any further normalization.
3. Optionally run a lightweight cross-app script smoke pass on selected apps to confirm no hidden coupling to removed app-local workflows.
