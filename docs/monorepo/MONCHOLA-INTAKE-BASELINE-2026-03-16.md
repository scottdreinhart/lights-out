# Monchola Intake Baseline — 2026-03-16

## Source

- Repository: `C:/Users/scott/monchola`
- Snapshot date: `2026-03-16`
- Package manifest: `C:/Users/scott/monchola/package.json`

## Baseline Metadata

- Name: `monchola-game`
- Version: `1.0.0`
- Private: `true`
- Package manager pin: `pnpm@10.31.0`
- Engine pins: Node `24.14.0`, pnpm `10.31.0`

## Script Inventory (Observed)

### Core lifecycle and quality

- `start`, `dev`, `build`, `preview`, `build:preview`
- `lint`, `format:check`, `typecheck`, `check`, `fix`, `validate`
- `clean`, `clean:node`, `clean:all`, `reinstall`, `prebuild`

### Desktop/mobile/wasm

- Electron: `electron:dev`, `electron:build`, `electron:build:win`, `electron:build:linux`, `electron:build:mac`, `electron:preview`
- Capacitor: `cap:init:android`, `cap:init:ios`, `cap:sync`, `cap:open:android`, `cap:open:ios`, `cap:run:android`, `cap:run:ios`
- WASM: `wasm:build`, `wasm:build:debug`
- Input governance helper: `check:input`

## Contract Delta vs Monorepo Intake Requirements

### Present

- Required core scripts present: `dev`, `build`, `preview`, `lint`, `typecheck`, `check`, `validate`.
- Required Electron scripts are present: `electron:build:win`, `electron:build:linux`, `electron:build:mac`.
- Required `cap:sync` is present.

### Missing / Requires Mapping

1. `test` script is not defined in source manifest.
2. Required mobile build script names differ from contract:
   - Contract expects `cap:build:android`, `cap:build:ios`.
   - Source provides `cap:run:android`, `cap:run:ios` and `cap:open:*`.
3. Required reporting scripts are absent:
   - `report:lint`, `report:typecheck`, `report:test`, `report:coverage`, `report:a11y`, `report:lighthouse`, `report:security`, `report:build`.
4. Required report output contract path is not defined yet:
   - `apps/monchola/reports/*`.
5. Package identity must be normalized for workspace contract:
   - from `monchola-game` to `@games/monchola`.

## Dependency Snapshot (Observed)

- Runtime: React 19.2.4, React DOM 19.2.4, Capacitor core/android 8.2.0.
- Build/quality: Vite 7.3.1, TypeScript 5.9.3, ESLint 10.x, Prettier 3.8.1, boundaries plugin present.
- Desktop/mobile/WASM: Electron 40.8.0, electron-builder 26.8.1, AssemblyScript 0.28.10.

## Platform Footprint Verification

- Capacitor config present: `capacitor.config.ts` (`appId`, `appName`, `webDir`).
- Electron main/preload present: `electron/main.js`, `electron/preload.js`.
- WASM build path present: `scripts/build-wasm.js`, `assembly/`, `src/wasm/`, `src/workers/`.
- Expected app layer structure present under `src/` (`domain`, `app`, `ui`, `themes`, `wasm`, `workers`).

## Selection-Evidence Linkage

This baseline supports the candidate-selection and intake gates defined in:

- `docs/monorepo/PEER-CANDIDATE-SELECTION-CHECKLIST.md`
- `docs/monorepo/PR-BLUEPRINT-MONCHOLA.md`
- `docs/monorepo/PR1-MONCHOLA-RUNBOOK.md`
- `docs/monorepo/MONCHOLA-EXECUTION-TODOS.md`

## Step 1 Ready Conditions

Step 1 (`apps/monchola` import) is ready once:

- peer-comparison evidence is attached to this intake,
- package rename + script contract normalization plan is accepted,
- report script/output scaffolding plan is prepared for immediate post-copy implementation.
