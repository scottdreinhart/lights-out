# PR1 Runbook — Execute `tictactoe` Absorption

## Branch

```bash
git checkout -b feat/monorepo-absorb-tictactoe
```

## 1) Prepare destination

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

- [ ] Script contract complete
- [ ] Report output contract complete
- [ ] Validation commands green
- [ ] No boundary violations
- [ ] CI matrix updated for app/platform targets
