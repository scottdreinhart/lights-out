# PR1 Runbook — Execute `tictactoe` Absorption

Candidate note: this runbook is candidate-specific and does not grant permanent priority to `tictactoe`.
Use it only when comparison evidence shows `tictactoe` is the best next merge option among peer repos.

## Candidate Selection Gate (Required)

Use template: `docs/monorepo/PEER-CANDIDATE-SELECTION-CHECKLIST.md`

- [ ] Link comparison evidence from queue/ranking artifacts.
- [ ] Document why `tictactoe` is selected now versus other peer candidates.
- [ ] Confirm selection criteria: merge safety, completeness, shared-package ROI.

## Master TODO Queue

### Phase 0 — Branch + Safety

- [ ] Create branch: `feat/monorepo-absorb-tictactoe`
- [ ] Tag rollback point on current monorepo main
- [ ] Freeze source repo changes during copy window

### Phase 1 — Intake Audit

- [ ] Candidate selection gate completed and evidence linked
- [ ] Capture script/dependency inventory from source
- [ ] Map Electron/Capacitor target paths
- [ ] Map reporting outputs required for parity

### Phase 2 — Package Isolation

- [ ] Copy source into `apps/tictactoe` with exclusions
- [ ] Set package identity to `@games/tictactoe`
- [ ] Verify isolated app execution via `pnpm --filter`

### Phase 3 — Script Contract Parity

- [ ] Ensure `dev/build/preview/lint/typecheck/test/check/validate`
- [ ] Add `web:build`, `cap:build:android`, `cap:build:ios`
- [ ] Add all `report:*` scripts

### Phase 4 — Reporting Parity

- [ ] Create `apps/tictactoe/reports/*` folders
- [ ] Verify each report script writes to expected location
- [ ] Validate report artifact naming and consistency

### Phase 5 — Build/Release Verification

- [ ] Validate web build
- [ ] Validate Linux desktop build path
- [ ] Validate Windows desktop build route (PowerShell)
- [ ] Validate macOS desktop/iOS route (macOS runner)
- [ ] Validate Android sync/build path

### Phase 6 — Shared Code Extraction (Controlled)

- [ ] Identify duplicated low-risk modules (input/UI/domain helpers)
- [ ] Extract to `packages/*` without boundary leaks
- [ ] Replace app-local imports incrementally and re-validate

### Phase 7 — CI + Merge Gate

- [ ] Add `tictactoe` CI matrix entries and report artifact upload
- [ ] Ensure `pnpm --filter @games/tictactoe validate` is green
- [ ] Ensure platform contract + report parity + boundary checks pass

## Branch

```bash
git checkout -b feat/monorepo-absorb-tictactoe
```

## 1) Prepare destination

Before creating destination files, ensure the candidate selection gate above is complete.

```bash
mkdir -p apps/tictactoe
```

## 2) Copy source repo into monorepo app package

From monorepo root (`C:/Users/scott/lights-out`):

```bash
rsync -av --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='coverage' --exclude='release' ../tictactoe/ apps/tictactoe/
```

If `rsync` is unavailable, use equivalent copy preserving structure and exclusions.

## 3) Standardize package identity

In `apps/tictactoe/package.json`:

- set `name` to `@games/tictactoe`
- keep `private: true`

## 4) Add missing contract scripts

Ensure these are present (add aliases/wrappers if needed):

- `web:build`
- `cap:build:android`
- `cap:build:ios`
- `report:lint`
- `report:typecheck`
- `report:test`
- `report:coverage`
- `report:a11y`
- `report:lighthouse`
- `report:security`
- `report:build`

## 5) Create report directories

```bash
mkdir -p apps/tictactoe/reports/{lint,typecheck,test,coverage,a11y,lighthouse,security,build}
```

## 6) Validation commands

```bash
pnpm install
pnpm --filter @games/tictactoe lint
pnpm --filter @games/tictactoe typecheck
pnpm --filter @games/tictactoe test
pnpm --filter @games/tictactoe validate
```

## 7) Platform command checks

```bash
pnpm --filter @games/tictactoe web:build
pnpm --filter @games/tictactoe electron:build:linux
# Windows route (PowerShell runner): electron:build:win
# macOS route (macOS runner): electron:build:mac and cap:build:ios
pnpm --filter @games/tictactoe cap:sync
pnpm --filter @games/tictactoe cap:build:android
```

## 8) PR checklist before merge

- [ ] Candidate selection evidence attached and auditable
- [ ] Script contract complete
- [ ] Report output contract complete
- [ ] Validation commands green
- [ ] No boundary violations
- [ ] CI matrix updated for app/platform targets
