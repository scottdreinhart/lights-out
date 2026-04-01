# Monchola Platform Validation Evidence (2026-03-16)

## Scope

Validation evidence for PR1 Monchola platform routing/checks under monorepo governance.

## Environment

- Workspace: `c:/Users/scott/game-platform`
- App package: `@games/monchola`
- Shell state marker: `.node-platform.md` = `platform: linux`
- Date: 2026-03-16

## 1) Workspace/Filter Resolution (Bash)

Command:

- `pnpm --filter @games/monchola exec node -p "process.cwd()"`

Observed output:

- `/mnt/c/Users/scott/game-platform/apps/monchola`

Result:

- PASS — filtered package resolution works from workspace root.

## 2) Linux Electron Build Path (Bash)

Command:

- `pnpm --filter @games/monchola electron:build:linux`

Observed evidence:

- Vite production build completed.
- Electron-builder executed.
- Release artifacts present in `apps/monchola/release`:
  - `Monchola-1.0.0.AppImage`
  - `linux-unpacked/`
  - `builder-effective-config.yaml`

Result:

- PASS — Linux Electron route validated from Bash.

## 3) Android Capacitor Build Path (Bash)

Command:

- `pnpm --filter @games/monchola cap:build:android`

Observed evidence:

- `cap:sync` executed.
- Vite build completed.
- Capacitor sync completed:
  - `copy web` OK
  - `update web` OK
  - `Sync finished`

Result:

- PASS — Android Capacitor route validated in current environment.

## 4) Windows Electron Path (Documented Route)

Governance route:

- Use PowerShell for `pnpm --filter @games/monchola electron:build:win`.

Reason:

- Repository shell routing requires PowerShell for Windows packaging.

Result:

- DOCUMENTED — route and command confirmed; execution should be done in PowerShell runner/session.

## 5) macOS Electron + iOS Capacitor Paths (Documented Route)

Governance route:

- macOS runner required for:
  - `pnpm --filter @games/monchola electron:build:mac`
  - `pnpm --filter @games/monchola cap:build:ios`
  - `pnpm --filter @games/monchola cap:open:ios`
  - `pnpm --filter @games/monchola cap:run:ios`

Reason:

- iOS tooling/Xcode and macOS packaging require Apple hardware/runner.

Result:

- DOCUMENTED — path requirements and commands are recorded.

## Remaining Platform Work

- Execute Windows packaging in PowerShell execution context (or windows-latest CI runner).
- Execute macOS/iOS packaging in macOS execution context (or macos-latest CI runner).
