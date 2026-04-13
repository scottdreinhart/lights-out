# ENVIRONMENT.md

## Purpose

Operational context for Copilot CLI, editor chat agents, and coding assistants in this repository.  
This file is a compact runtime layer that reinforces existing governance and reduces invalid assumptions.

## Authority and precedence

- **Primary authority**: `AGENTS.md` (repository constitution).
- Precedence order is defined in `AGENTS.md` §1:
  1. `AGENTS.md`
  2. `.github/copilot-instructions.md`
  3. `.github/instructions/*.instructions.md`
  4. `docs/**` (informational)
- If this file conflicts with any higher source, **higher source wins**.
- This file does not replace governance; it points agents to authoritative controls.

## Repository operating context

- Monorepo root with pnpm workspaces (`pnpm-workspace.yaml`):
  - `.` (root)
  - `apps/*`
  - `packages/*`
  - `tooling/*`
- Current structure evidence:
  - `apps/` contains many independent game apps (53 app folders detected).
  - `packages/` contains shared libraries/contracts/utilities (36 package folders detected).
  - `tooling/` exists for auxiliary tooling.
- Root scripts currently route common commands to `apps/lights-out`; many app-specific scripts also exist (for example `nim:*`, `tictactoe:*`, `mancala:*`, `monchola:*`).

## Package manager and runtime policy

- **Package manager: pnpm only** (`packageManager: pnpm@10.31.0`).
- **Runtime target**:
  - Root `package.json` engines: Node `24.14.1`, pnpm `10.31.0`
  - `.nvmrc`: `24.14.1`
- Do not use `npm`, `npx`, or `yarn`.
- Use `package.json` scripts as canonical entrypoints before direct tool invocation.

## Platform and shell expectations

- **Default shell**: Bash/POSIX (WSL Ubuntu on Windows).
- **PowerShell is opt-in only** for Windows Electron packaging (`electron:build:win`) or explicit user request.
- **macOS is required** for iOS Capacitor and macOS Electron packaging (`cap:*:ios`, `electron:build:mac`).
- Node binary compatibility guardrail:
  - Check `.node-platform.md` before running commands across WSL/PowerShell contexts.
  - Reinstall node modules when platform marker mismatches (`pnpm clean:node && pnpm install`).

## Monorepo / workspace layout

- Root governance and config:
  - `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.github/instructions/*`
  - `package.json`, `pnpm-workspace.yaml`, `tsconfig.json`, `eslint.config.js`, `.prettierrc`
  - Root test runners: `vitest.config.ts`, `playwright.config.ts`
- App-level pattern (`apps/<game>/`):
  - `src/` (domain/app/ui/workers/wasm/themes or equivalents)
  - app-specific `package.json`, `tsconfig.json`, `vite.config.*`
  - optional Electron (`electron/main.js`) and Capacitor (`capacitor.config.ts`)
- Shared packages live in `packages/*` and are consumed via workspace deps and `@games/*` aliases.

## Architecture and dependency boundaries

- Enforced model: **CLEAN architecture + Atomic Design** (see `AGENTS.md` §3–§4, `02-frontend.instructions.md`).
- Core boundaries:
  - `domain` imports `domain` only
  - `app` imports `domain` + `app`
  - `ui` imports `domain` + `app` + `ui`
  - `workers` import `domain` only
  - `themes` import nothing
- UI composition direction: `atoms -> molecules -> organisms`.
- Data flow: hooks/services -> organisms -> molecules -> atoms.
- Import discipline:
  - Use aliases (`@/*`, `@/domain/*`, `@/app/*`, `@/ui/*`, plus `@games/*` workspace aliases).
  - Prefer barrel `index.ts` public APIs.
  - Avoid cross-layer relative imports (`../../`).
- Boundary checks are enforced by ESLint (`eslint-plugin-boundaries`).

## Build and execution policy

- Prefer root scripts first; use workspace/app scripts when scope requires.
- Common root scripts:
  - `pnpm dev`, `pnpm build`, `pnpm preview`
  - `pnpm check`, `pnpm fix`, `pnpm validate`
  - `pnpm test`, `pnpm test:e2e`, `pnpm test:names`
  - `pnpm electron:*`, `pnpm cap:*`, `pnpm wasm:*`
- WASM pipeline is present (AssemblyScript + worker integration). Use existing `wasm:*` scripts; do not create parallel build paths.
- Electron and Capacitor are supported across multiple apps; follow platform routing rules above.

## Testing and quality gates

- Baseline validation expectations from governance:
  - `pnpm check` (lint + format:check + typecheck)
  - `pnpm test` (Vitest families)
  - `pnpm validate` (root gate)
  - `pnpm test:names` (strict test naming validator)
  - `pnpm test:e2e` when E2E-affected behavior is changed
- Test file naming is strictly enforced:
  - Vitest: `<feature>.<type>.test.ts(x)` where type in `unit|integration|component|api|perf`
  - Playwright: `<feature>.<type>.spec.ts` where type in `e2e|a11y|visual`

## File placement and editing expectations

- Place code in existing layer/feature locations; do not create new top-level directories without explicit direction.
- Reuse existing components/hooks/services/packages before creating new abstractions.
- Keep changes minimal and surgical; preserve naming/layout conventions.
- Do not weaken lint/type/test rules to pass gates.

## Agent behavior expectations

- Read governance first, then inspect local config/scripts before coding.
- Prefer repository scripts and existing patterns over ad hoc commands or new tooling.
- Resolve uncertainty using repository evidence (`package.json`, configs, instruction files), not assumptions.
- Keep token usage low by:
  - Checking authoritative files first
  - Scoping commands to relevant app/package
  - Reusing established workflows

## Safety and non-assumption rules

- Do not assume unsupported stack pieces:
  - **No Tailwind config found**
  - **No shadcn config found**
  - **No Cypress config found**
- Treat feature-specific docs in `.github/instructions/` as conditional to changed scope.
- Do not expose or commit secrets from `.env*`; `.env` handling guidance exists under `docs/ENVIRONMENT.md`.

## Fast reference summary

- Governance start: `AGENTS.md` -> `.github/copilot-instructions.md` -> `.github/instructions/*`
- Package manager: `pnpm` only
- Node/pnpm: Node `24.14.1`, pnpm `10.31.0`
- Default shell: Bash (WSL Ubuntu); PowerShell/macOS only for explicit platform cases
- Workspace roots: `apps/*`, `packages/*`, `tooling/*`
- Architecture: CLEAN layers + Atomic Design + alias/barrel import discipline
- Canonical quality commands: `pnpm check`, `pnpm test`, `pnpm validate`, `pnpm test:names` (+ `pnpm test:e2e` when applicable)
