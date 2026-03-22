# Governance/File Triage (2026-03-16)

## Decision Summary

Do not bulk-merge app-local governance/config trees into root.
Use root as the single authority, and cherry-pick only demonstrable improvements.

## Evidence Snapshot

Compared against root `.github`:

- `apps/monchola/.github`: instructions same=1, diff=12 (of 13)
- `apps/tictactoe/.github`: instructions same=4, diff=9 (of 13)
- app-local `quality.yml` matches root in some cases, but `validate.yml` diverges and is app/legacy scoped
- `PULL_REQUEST_TEMPLATE.md` and `copilot-instructions.md` diverge across app folders

Interpretation: these are forked copies, not authoritative upgrades.

## Promote to Root (Only If Explicitly Reviewed)

Cherry-pick only concrete, testable improvements from app-local files into root, for example:

- workflow robustness improvements
- missing guardrails with clear repo-wide applicability
- non-conflicting documentation clarifications

No automatic promotion recommended.

## Keep App-Local

These are valid per-app/runtime files and should stay app-local:

- `.env.nocache`
- `.gitattributes`
- `.gitignore`
- `.npmrc`
- `.nvmrc`
- `.prettierrc`
- `.vscode/settings.json`
- app product docs (`README.md`, `LICENSE`, analysis notes)

## Remove / De-duplicate

To avoid policy drift and CI confusion in monorepo mode:

- accidental nested metadata trees (e.g., `apps/monchola/.github/.github`) — remove
- app-local duplicate governance authorities (`AGENTS.md`, `.github/copilot-instructions.md`, `.github/instructions/*`) — do not treat as root authority
- app-local workflows should not replace root workflows; prefer root matrix CI

## Action Taken

- Removed accidental nested tree: `apps/monchola/.github/.github`
- Superset-merged app pnpm config: added `node-linker=hoisted` to `apps/monchola/.npmrc` (aligned with `apps/tictactoe/.npmrc`).
- Superset-merged root quality CI: switched `actions/setup-node` in `.github/workflows/quality.yml` to `node-version-file: .nvmrc`.
- Confirmed `.npmrc` normalization across app packages (`apps/monchola/.npmrc`, `apps/tictactoe/.npmrc`).
- Added root policy note in `AGENTS.md` for workspace baseline vs app-local `.npmrc` overrides.
- Completed superset review for `.gitignore` and `.gitattributes` (root vs `apps/monchola` and `apps/tictactoe`): no additional safe additive merges were needed.
- Removed app-local duplicate governance authorities: `apps/monchola/AGENTS.md`, `apps/tictactoe/AGENTS.md`.
- Removed app-local duplicate runtime governance copies: `apps/monchola/.github/copilot-instructions.md`, `apps/tictactoe/.github/copilot-instructions.md`.
- Removed app-local duplicate instruction trees: `apps/monchola/.github/instructions/*`, `apps/tictactoe/.github/instructions/*`.
- Removed app-local duplicate workflow trees: `apps/monchola/.github/workflows/*`, `apps/tictactoe/.github/workflows/*`.
- Preserved app-specific docs/scripts under app `.github/` roots (e.g., setup/deployment notes, `validate.sh`, PR templates).

## Current State

1. Root governance and instruction authority is centralized under `AGENTS.md` + root `.github/*`.
2. Root CI orchestration remains centralized under root `.github/workflows/*`.
3. App-level `.github/` content is now reduced to product/project-specific docs and scripts.
