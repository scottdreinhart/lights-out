Project Architecture Context:

This project is the `game-platform` monorepo, a proprietary pnpm-only game platform owned by Scott Reinhart.

Primary stack:
- Package manager: pnpm 10.31.0 only
- Runtime: Node 24.14.1
- Language: TypeScript 5.9.3
- UI: React 19.2.4 and React DOM 19.2.4
- Build system: Vite 8
- Desktop wrapper: Electron 41
- Mobile wrapper: Capacitor 8
- Testing: Vitest 4 and Playwright 1.59
- Architecture tooling: eslint-plugin-boundaries, dependency-cruiser, knip, ast-grep
- Quality gates: segmented linting, typechecking, formatting, compliance metrics, Playwright, Lighthouse, accessibility checks, visual checks, WASM regression checks

Monorepo purpose:
- The repository contains multiple small game apps, not one large super-app.
- Current apps include `lights-out`, `monchola`, `mancala`, and `tictactoe`.
- Each game must remain independently buildable, testable, packageable, and deployable.
- Shared logic, shared UI, themes, contracts, hooks, and reusable utilities must be extracted into packages when appropriate.
- Do not duplicate game infrastructure across apps when a shared abstraction is appropriate.

Canonical app structure:
- `apps/<game>/src/domain`
- `apps/<game>/src/app`
- `apps/<game>/src/ui`
- `apps/<game>/src/infrastructure`
- `apps/<game>/src/electron`
- `apps/<game>/src/wasm`
- `apps/<game>/src/workers`

Layer meanings:
- `domain`: pure game rules, state machines, board logic, scoring, validation, move resolution, win/loss/draw logic, and domain types.
- `app`: use cases, orchestration, state coordination, command/query flows, service contracts, and application-level policies.
- `ui`: React components, screens, hooks, layout, rendering, accessibility, input mapping, and Atomic Design components.
- `infrastructure`: persistence, platform adapters, storage, telemetry, external APIs, device APIs, filesystem, and runtime integration.
- `electron`: Electron-specific desktop entrypoints, preload logic, IPC, window lifecycle, and desktop platform concerns.
- `wasm`: AssemblyScript/WebAssembly modules and performance-sensitive computational logic.
- `workers`: Web Worker logic, background computation, async orchestration, and message contracts.

Architectural rules:
- Domain must not import React, Vite, Electron, Capacitor, browser APIs, filesystem APIs, storage APIs, network APIs, or UI code.
- UI must not contain domain rules directly.
- Infrastructure must depend on ports/contracts, not leak concrete implementation details into domain or UI.
- Electron, Capacitor, browser, and platform-specific behavior must be isolated behind adapters.
- Shared package contracts must be preferred over copy-pasted local types.
- The theme contract package `@games/theme-contract` is the canonical shared theme source.
- App-specific code belongs in `apps/<game>`.
- Cross-game reusable code belongs in shared packages.
- Keep each game small, portable, and platform-ready.

Required platform targets:
- Web
- Electron desktop
- Windows
- macOS
- Linux
- Android through Capacitor
- iOS through Capacitor
- PWA/browser-compatible builds where applicable

Required validation mindset:
- Use `pnpm` commands only.
- Prefer existing scripts before inventing new commands.
- Before large changes, consider:
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm lint:type:boundaries`
  - `pnpm lint:architecture`
  - `pnpm test`
  - `pnpm test:e2e`
  - `pnpm test:a11y`
  - `pnpm test:visual`
  - `pnpm validate`
  - `pnpm compliance:metrics`
  - `pnpm check:regressions`
- Generated code must be compatible with the existing segmented lint, architecture, boundary, test, compliance, and platform approval tooling.

Testing expectations:
- Domain logic requires unit tests.
- Application orchestration requires unit or integration tests.
- UI components require component tests where useful.
- Critical flows require Playwright E2E tests.
- Accessibility-sensitive UI requires a11y coverage.
- Visual/styling-sensitive UI should support visual test coverage.
- WASM or performance-sensitive logic must respect existing baseline and regression checks.

Naming and generation:
- Prefer existing generators where appropriate:
  - `pnpm gen:component`
  - `pnpm gen:hook`
  - `pnpm gen:test`
  - `pnpm gen:game-app`
- Follow existing naming patterns.
- Do not create one-off structures that bypass generators, conventions, or governance unless explicitly required.

Dependency rules:
- Do not add dependencies casually.
- Prefer existing stack tools and shared packages.
- Do not introduce npm or yarn workflows.
- Respect pnpm overrides and workspace conventions.
- Treat package versions as intentional unless explicitly asked to upgrade.

Game architecture requirements:
- Game rules must be deterministic and testable.
- Board state, player state, input state, timers, difficulty, scoring, and progression must be separated.
- Rendering must consume state rather than own rules.
- Input systems must support keyboard, pointer/touch, controller-style navigation where applicable, and platform-friendly abstraction.
- Game UI must avoid unnecessary scrolling unless scrolling is core to the game.
- Rules modals, settings, timers, difficulty, navigation, and new-game controls should be reusable patterns across games.

Atomic UI requirements:
- Atoms: buttons, icons, labels, tiles, inputs, badges.
- Molecules: control groups, status rows, score displays, setting groups.
- Organisms: game boards, rules modals, headers, footers, side panels.
- Templates: reusable game layout shells.
- Pages/Screens: route-level compositions only.
- Components must remain reusable and free of business rules.

Performance and platform requirements:
- Keep bundles small.
- Avoid unnecessary runtime dependencies.
- Isolate expensive computation.
- Use workers or WASM where appropriate.
- Maintain responsive layouts across mobile, desktop, tablet, ultrawide, and TV-like displays.
- Avoid platform-specific assumptions in shared logic.

Security and governance:
- Preserve existing security linting.
- Preserve architecture boundary enforcement.
- Preserve compliance dashboard expectations.
- Preserve platform approval reporting.
- Preserve least-privilege and separation between runtime layers.
- Never hardcode secrets, credentials, private keys, tokens, or environment-specific values.