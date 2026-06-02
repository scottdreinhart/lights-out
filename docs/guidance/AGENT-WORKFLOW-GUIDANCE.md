# Agent Workflow Guidance

> **Purpose**: Practical generated guidance for applying repository governance,
> guardrails, scoped instructions, and skill routing during implementation.
> This document is informational.

## Start Every Task

1. Follow `AGENTS.md` § 0 for startup rules.
2. Follow `AGENTS.md` § 1.A and `.github/skills/README.md` for bundle routing.
3. Read only scoped `.github/instructions/*` files relevant to the changed
   surface.
4. Search existing implementation patterns before creating code.

## Bundle Selection Guide

| Work type                                | Lead bundle | Common supporting bundles |
| ---------------------------------------- | ----------- | ------------------------- |
| Lint, typecheck, test, validate failures | 1           | 2, 5                      |
| Workspace scripts or package boundaries  | 2           | 1, 5                      |
| Electron, Capacitor, mobile packaging    | 3           | 1, 8                      |
| Compliance dashboards or governance docs | 4           | 1, 6                      |
| ESLint, dependency-cruiser, generators   | 5           | 1, 2                      |
| Commit, changelog, release workflows     | 6           | 1, 4                      |
| WASM or performance regression work      | 7           | 1, 3                      |
| Single-app implementation or repair      | 8           | 1, 2, 3                   |

## Implementation Flow

Follow `AGENTS.md` § 0.2-0.5 for reuse, minimal changes, architecture, and
completion standards. Follow `AGENTS.md` § 0.A for validation and failure
self-correction.

## App Work Guidance

- Prefer app-local scripts with `pnpm -C apps/<app> <script>` when working on a
  single app.
- Confirm app-local package scripts before assuming root defaults.
- Keep app identity inside the app.
- Extract reusable behavior only when multiple apps genuinely share it.
- Respect app-level `src/domain`, `src/app`, `src/ui`, `src/workers`,
  `src/wasm`, and `src/themes` boundaries.

## Game Logic Guidance

- Put rules, scoring, state transitions, deterministic randomization, collision,
  and win or fail conditions in domain logic.
- Keep rendering and presentation in UI.
- Keep input adapters in app or platform layers and dispatch semantic actions.
- Use fixed-timestep deterministic simulation for arcade and runner-style games.
- Use PixiJS and `@pixi/react` for endless-runner rendering where required.

## Platform Guidance

- For mobile work, validate safe areas, touch targets, gestures, offline
  behavior, lifecycle restore, accessibility, and performance budgets.
- For Electron work, keep preload, main process, renderer, and packaging
  responsibilities separated.
- For Capacitor work, use conditional adapters so web builds remain valid.
- For Fire TV work, validate remote navigation, focus recovery, pause/resume,
  back routing, and no reliance on non-capturable buttons.

## Security Review Guidance

Use a security pass when work touches user input, storage, network boundaries,
auth, redirects, generated HTML, files, logs, or platform bridges.

Check for:

- untrusted input validation
- secret exposure
- unsafe DOM or HTML APIs
- overly broad permissions
- weak cache controls for sensitive content
- internal error leakage
- dependency or supply-chain changes

## Validation Guidance

Follow `AGENTS.md` § 0.A for validation command priority, failure handling, and
the self-correction loop. Use app-local commands only after identifying the
correct scope from root and app `package.json` scripts.

## Completion Report Guidance

A useful completion report includes:

- files changed
- behavior changed
- validation commands run and results
- skipped checks with concrete reason
- remaining blocker, if any

Do not report the work as complete when required validation is still failing.
