# Root vs App Duplicate Audit

Date: 2026-03-16

## Method

For each duplicated root/app candidate, compare:

- modified date,
- size,
- line count,
- apparent feature completeness.

Then choose:

- keep in root (workspace-wide),
- keep in app (game-specific),
- or promote to `packages/*` (shared reusable API).

## Snapshot Metrics (root vs `apps/tictactoe`)

### Files

| File | Root size / LOC | App size / LOC | Decision Signal |
|---|---:|---:|---|
| `index.html` | 955 / 25 | 1390 / 36 | App copy has more app-specific shell metadata; keep app-local |
| `vite.config.js` | 4841 / 186 | 1044 / 50 | Root config is broader platform/build profile; app config should be app-local |
| `capacitor.config.ts` | 1434 / 72 | 200 / 9 | Root appears more complete; app should receive app-local version once normalized |
| `package.json` | 6767 / 170 | 5739 / 146 | Root is workspace shell; app package remains independently scoped |
| `tsconfig.json` | 750 / 28 | 729 / 28 | Similar size; keep root solution + app-local config |
| `eslint.config.js` | 4768 / 130 | 4827 / 131 | Both comprehensive; root governs workspace, app keeps app-local linting |
| `README.md` | 28211 / 394 | 80834 / 1192 | App README is more game-complete; keep app-local |

### Directories

| Directory | Root files/size | App files/size | Decision Signal |
|---|---:|---:|---|
| `src/` | 91 / 115607 | 139 / 338791 | App is more feature-complete for TicTacToe; keep per-app source |
| `public/` | 4 / 2857 | 10 / 6262596 | App is richer for TicTacToe; keep app-local assets |
| `electron/` | 3 / 5597 | 2 / 1661 | Root currently richer; candidate to migrate per app boundary |
| `assembly/` | 2 / 3097 | 2 / 9783 | App appears richer; keep app-local wasm source |
| `scripts/` | 12 / 32128 | 2 / 4004 | Root scripts are mostly workspace/shared tooling |

## Executed This Pass

### Migrated superior root web-shell content into `apps/lights-out`

Added app-local files:

- `apps/lights-out/index.html`
- `apps/lights-out/vite.config.ts`
- `apps/lights-out/public/icon.svg`
- `apps/lights-out/public/manifest.json`
- `apps/lights-out/public/offline.html`
- `apps/lights-out/public/sw.js`

### Migrated superior root platform/runtime content into `apps/lights-out`

Added app-local files:

- `apps/lights-out/electron/main.js`
- `apps/lights-out/electron/preload.js`
- `apps/lights-out/electron/types.ts`
- `apps/lights-out/capacitor.config.ts`
- `apps/lights-out/assembly/index.ts`
- `apps/lights-out/assembly/tsconfig.json`
- `apps/lights-out/tests/accessibility.spec.ts`

## Validation

Executed successfully:

- `pnpm -C apps/lights-out typecheck`
- `pnpm -C apps/lights-out build`

Result: `apps/lights-out` now builds independently with app-local web shell assets.
Result: `apps/lights-out` remains type-safe and buildable after platform/runtime migration.

## Purge Guard Status

- No root files were purged in this pass.
- Pre-purge existence/hash manifest recorded in `docs/monorepo/PURGE-GUARD-2026-03-16.csv`.
- Deletion sequencing is now controlled by `docs/monorepo/PURGE-SAFETY-PROTOCOL.md`.

## Next Candidates (Staged)

1. Update app-local scripts in `apps/lights-out/package.json` for Electron/Capacitor/WASM/testing workflows.
2. Keep root only for workspace governance/tooling and shared orchestration.
3. Continue duplicate-resolution workflow: compare siblings, pick best implementation, refactor, and promote reusable logic into `packages/*`.
