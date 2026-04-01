# TicTacToe Monorepo Readiness Matrix

## Purpose

Translate the `tictactoe` source repo state into concrete monorepo execution tasks for PR #1.

- Source analyzed: `C:/Users/scott/tictactoe/package.json`
- Target package: `apps/tictactoe`
- Target identity: `@games/tictactoe`

## 1) Script Contract Parity

Required contract vs current source scripts.

| Area | Required Script | Present in source | Action |
|---|---|---:|---|
| Core | `dev` | ✅ | Keep |
| Core | `build` | ✅ | Keep |
| Core | `preview` | ✅ | Keep |
| Core | `lint` | ✅ | Keep |
| Core | `typecheck` | ✅ | Keep |
| Core | `test` | ✅ | Keep |
| Core | `check` | ✅ | Keep |
| Core | `validate` | ✅ | Keep |
| Web | `web:build` | ❌ | Add alias to `build` |
| Desktop | `electron:build:win` | ✅ | Keep |
| Desktop | `electron:build:linux` | ✅ | Keep |
| Desktop | `electron:build:mac` | ✅ | Keep |
| Mobile | `cap:sync` | ✅ | Keep |
| Mobile | `cap:build:android` | ❌ | Add (wrap existing android path) |
| Mobile | `cap:build:ios` | ❌ | Add (macOS-only path) |

## 2) Reporting Script Gaps

Required report scripts for parity with your current detailed reporting approach.

| Required Report Script | Present in source | Action |
|---|---:|---|
| `report:lint` | ❌ | Add |
| `report:typecheck` | ❌ | Add |
| `report:test` | ❌ | Add |
| `report:coverage` | ❌ | Add |
| `report:a11y` | ❌ | Add |
| `report:lighthouse` | ❌ | Add |
| `report:security` | ❌ | Add |
| `report:build` | ❌ | Add |

## 3) Platform Output Readiness

| Target | Current capability in source | Monorepo action |
|---|---|---|
| Web | Vite build scripts present | Keep and add `web:build` alias |
| Windows | Electron build script present | Keep; route via PowerShell in CI |
| Linux | Electron build script present | Keep; run in Bash runner |
| macOS | Electron build script present | Keep; run on macOS runner |
| Android | Capacitor init/run/sync present | Add `cap:build:android` wrapper contract |
| iOS | Capacitor init/run/sync present | Add `cap:build:ios` wrapper (macOS runner only) |

## 4) Dependency/Tooling Alignment Notes

- Strong alignment with platform reference apps (`lights-out`, `nim`, `tictactoe`) stack (React/Vite/Electron/Capacitor/AssemblyScript).
- Minor version drift exists for some packages (e.g., `vite`, `electron`, `wait-on`), to normalize in follow-up.
- Optional Linux binary deps in source should be reviewed for monorepo portability.

## 5) PR #1 Deliverables

1. Move source into `apps/tictactoe`.
2. Standardize `package.json` name and script contract.
3. Add report scripts and report output paths at `apps/tictactoe/reports/*`.
4. Validate:
   - `pnpm --filter @games/tictactoe check`
   - `pnpm --filter @games/tictactoe validate`
5. Add CI matrix entries for app + platform targets.

## 6) Acceptance Gate (PR #1)

PR is ready to merge when all are true:

- Contract scripts exist and execute.
- Platform scripts exist for web/desktop/mobile outputs.
- Reports are emitted in `apps/tictactoe/reports/*`.
- App remains independently buildable and releasable.

## 7) Immediate Next Commands (Execution Branch)

```bash
# from monorepo root (future execution branch)
mkdir -p apps/tictactoe
# copy source repo content into apps/tictactoe (excluding .git and local artifacts)
# then:
pnpm --filter @games/tictactoe lint
pnpm --filter @games/tictactoe typecheck
pnpm --filter @games/tictactoe test
pnpm --filter @games/tictactoe validate
```
