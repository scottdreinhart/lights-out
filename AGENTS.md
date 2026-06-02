# AGENTS.md — Repository Governance Constitution

> **Scope**: Repository-wide. This file is the top-level authority for every AI agent,
> IDE assistant, CLI tool, and CI pipeline operating in this repository.
> All other governance files inherit from and must not contradict this document.

---

## § 32. Amazon Fire TV Web App Governance

**Authority**: AGENTS.md § 0 (Non-Negotiable Rules), § 19 (Input Controls), and `.github/instructions/21-fire-tv.instructions.md`

This repository may target Amazon Fire TV web and hybrid deployments. Fire TV behavior must remain remote-first and action-driven, without creating parallel architecture paths.

### 32.1 Input Mapping Requirements (Mandatory)

Fire TV-compatible key mappings:

- Left `37`, Up `38`, Right `39`, Down `40`
- Select/Confirm `13`
- Back `4`
- Play/Pause `179`
- Rewind `227`, Fast Forward `228`

Hard constraints:

- Home, Menu, and Voice Search are non-capturable in third-party web apps.
- All interactive surfaces must be fully reachable through directional navigation.
- Focus must remain visible and recoverable at all times.
- Back behavior must be deterministic (modal -> menu -> previous surface -> exit route).

### 32.2 Focus and Lifecycle Handling (Mandatory)

Fire TV integrations must handle focus transitions using:

- Page Visibility API (`visibilitychange`, `document.hidden`/`webkitHidden`)
- Platform pause/resume signals where available

Required behavior:

- Pause/mute gameplay and audio when app loses focus or voice search interrupts.
- Restore coherent focus and playback/game state on resume.
- Do not assume media UI remains valid after focus transitions; re-sync control state.

### 32.3 Display and 10-Foot UI Baseline

- Target 1080p (`1920x1080`) as primary Fire TV resolution.
- Preserve explicit focus styling; do not rely on browser default focus visuals.
- Keep control density, text size, and contrast suitable for TV viewing distance.

### 32.4 Fire TV Validation Workflow

Before claiming Fire TV readiness:

1. Validate input and focus behavior with Web App Tester.
2. Debug runtime behavior with Chrome DevTools (`chrome://inspect`) over ADB.
3. Verify pause/resume and back navigation paths on real remote/controller input.
4. Confirm no touch-only interactions are required to complete core flows.

### 32.5 Cache and Sensitive Data

For sensitive/authenticated content in Fire TV web contexts:

- Prefer `Cache-Control: no-store` (or `no-cache` where appropriate)
- Include `Pragma: no-cache` for backward compatibility where needed

If Amazon cache APIs are available, app-scoped cache/cookie clearing may be used on logout, guarded by platform readiness checks.

### 32.6 Fire TV Checklist

- [ ] Remote key mapping implemented (`37/38/39/40/13/4/179/227/228`)
- [ ] No dependence on Home/Menu/Voice Search capture
- [ ] Back navigation and focus recovery deterministic
- [ ] Pause/resume lifecycle handling implemented
- [ ] 1080p 10-foot UI validated
- [ ] Web App Tester + `chrome://inspect` workflow used for platform debugging

---

## § 33. Endless Runner Generation Governance

**Authority**: AGENTS.md § 0 (Non-Negotiable Rules), § 3 (Architecture Preservation), and `.github/instructions/22-endless-runner.instructions.md`

When generating or implementing endless-runner games, specs must be deterministic and implementation-ready. Vague “runner-like” descriptions are non-compliant.

### 33.1 Canonical Assets (Mandatory)

- Instruction authority: `.github/instructions/22-endless-runner.instructions.md`
- Schema authority: `.github/prompts/endless-runner/schema/endless-runner.schema.json`
- Prompt template authority: `.github/prompts/endless-runner/generator-template.txt`
- Preset library: `.github/prompts/endless-runner/presets/*.json`

### 33.2 Required Runner Fields (Mandatory)

Every runner spec must explicitly define:

- `scroll_direction`
- `camera_mode`
- `lane_model`
- `movement_model`
- `primary_input`
- `obstacle_model`
- `difficulty_curve`
- `failure_condition`

Do not omit directional flow, world-scroll relation, or collision consequences.

### 33.3 Architecture Constraints (Mandatory)

- React is HUD/UI shell only
- Simulation loop lives in domain logic (not React reconciliation)
- Rendering stack: PixiJS + `@pixi/react`
- UI/app state: Zustand only where needed
- Fixed-timestep deterministic simulation required
- No general-purpose physics unless config explicitly requires terrain physics

### 33.4 Output Contract (Mandatory)

Generated runner output must include these sections in order:

1. Game Identity
2. Directional Flow
3. Camera + Movement Model
4. Player Controls
5. Core Loop
6. Obstacle Systems
7. Collectibles + Power-Ups
8. Difficulty Scaling
9. Fail State
10. Scoring Model
11. Domain Systems Required
12. Rendering Rules
13. Anti-Patterns
14. Copilot Build Prompt

### 33.5 Endless Runner Compliance Checklist

- [ ] Scroll direction is literal and unambiguous
- [ ] Camera perspective matches direction
- [ ] Movement model defines feel and traversal constraints
- [ ] Inputs are concrete action mappings (not abstract)
- [ ] Obstacle categories and spawn logic are explicit
- [ ] Difficulty scaling factors are measurable
- [ ] Failure is immediate and readable
- [ ] Simulation/rendering separation is preserved

---

## 0. Non-Negotiable AI Operating Rules

**CRITICAL**: These rules govern all AI-assisted development in this repository. Violating them defeats the purpose of this codebase architecture.

### 0.1 Governance Must Be Read First

Before making ANY changes:

- [ ] Read AGENTS.md (this file)
- [ ] Read `.github/copilot-instructions.md`
- [ ] Read scoped `.github/instructions/*.md` files relevant to your task
- [ ] Inspect `package.json`, `tsconfig.json`, `eslint.config.js`, `vite.config.js`
- [ ] Inspect folder structure and identify existing implementations

**No exceptions. Governance reading is non-negotiable.**

### 0.2 Reuse Before Creation

Before creating ANY new code:

- [ ] Search for existing components, hooks, utilities, types, services, stores, styles, test helpers
- [ ] Search for existing patterns, abstractions, and scaffolding in the repo
- [ ] Extend existing implementations rather than building parallel code
- [ ] Do not create duplicate functionality, duplicate abstractions, or parallel implementations

**Reuse first. Duplication is a code smell.**

### 0.3 Minimal Change Principle

- Make the **smallest correct change set** possible
- Prefer **surgical edits** over rewrites
- **Preserve existing** naming, structure, conventions, behavior, and file layout unless the task explicitly requires change
- **Update existing files** instead of creating replacement files where possible
- **Do not remove** existing comments, documentation, or guardrails unless explicitly instructed

**Minimal edits. Big rewrites are a risk.**

### 0.4 Architecture Is Sacred

- **Respect all boundaries, layering, separation of concerns, and import rules** defined in AGENTS.md § 3–4
- Do **not bypass architecture** for convenience
- Do **not collapse or flatten** domain/app/ui separation or equivalent repo layering
- Do **not introduce cross-layer shortcuts** or violate barrel/import conventions
- Do **not move files or rename files** unless required

**Architecture violations break the entire system. Do not do this.**

### 0.5 No Fake Completion

- **Do not claim work is complete** without running relevant checks
- **Do not leave placeholder wiring**, fake handlers, mock flows, incomplete integration, TODO-based implementations, or stubbed logic unless explicitly requested
- **Do not treat partial scaffolding as finished** implementation
- **Do not mark tasks done** if required tests, validation, or verification have been skipped

**Real completion is verified. Fake completion is a trap.**

### 0.6 Quality Gates Are Mandatory

After making changes, run ALL relevant checks defined by the repo:

- `pnpm check` (lint + format:check + typecheck)
- `pnpm test` (unit/integration/component/api tests)
- `pnpm test:e2e` (end-to-end tests if applicable)
- `pnpm validate` (full gate: check + build)
- `pnpm test:names` (test naming validation)
- Any app-specific or platform-specific checks (Electron, Capacitor, WASM)

**If checks fail, fix the code. Do not weaken rules, disable lint, suppress errors, or comment out tests.**

**Self-Correction Loop (Mandatory)**:
When checks fail, you MUST:

1. **Read the error output carefully** — Identify the root cause, not just the symptom
2. **Fix the root cause** — Address the underlying issue in your code or configuration
3. **Rerun the failing command** — Verify the fix actually resolved the problem
4. **Repeat until green** — Keep fixing and retesting until all checks pass
5. **Do not stop early** — Code that "looks right" is not done until checks pass

**Forbidden Actions When Checks Fail**:

- ❌ Do NOT disable lint rules to force a pass
- ❌ Do NOT loosen type safety to force a pass
- ❌ Do NOT delete or skip failing tests to force a pass
- ❌ Do NOT use `// eslint-disable` suppression comments
- ❌ Do NOT use `// @ts-ignore` type ignore comments
- ❌ Do NOT comment out failing code sections
- ❌ Do NOT claim work is complete if checks still fail
- ❌ Do NOT bypass architecture checks or boundary validation

The only acceptable outcome is green checks. If you cannot achieve green checks, state the blocker explicitly and ask for guidance.

### 0.7 Preserve Governance

- **Do not erase, replace, or dilute** repo-specific instructions
- **Expand and harmonize governance surgically** rather than rewriting it
- **Do not conflict** with existing AGENTS.md or instruction files
- Governance updates are **only made when explicitly requested**

**Governance is the foundation. Preserve it.**

### 0.8 Favor Deterministic Validation Over Guesswork

- **Prefer type safety, linting, schema validation, tests, and explicit verification** over model intuition
- **Keep nullability, edge cases, error handling, and security concerns explicit**
- **Avoid hidden side effects** and implicit behavior
- **Use repo-provided tools** (typecheck, lint, tests, build) as the source of truth

**The machine is right. Your intuition is wrong without proof.**

### 0.9 Control Dependencies Strictly

- **Do not add new dependencies** unless absolutely necessary
- **Prefer existing installed packages** and repo tooling
- **Preserve the existing package manager** (pnpm) and workspace conventions
- **Justify briefly** in your output summary any new dependency proposed

**Each dependency is a liability. Only add when blocking.**

### 0.10 Match Repo Conventions Exactly

- **Follow established file structure, naming conventions, folder layout exactly**
- **Use existing export/import patterns, barrel conventions, path aliases**
- **Match existing state patterns, data flow, and error handling**
- **Reuse existing shared hooks, shared components, shared utilities** wherever applicable
- **Match accessibility practices, keyboard navigation, focus behavior, modal/dialog patterns** if applicable

**Consistency is not optional. Mismatch creates confusion and breaks assumptions.**

---

## 0.A Runtime Validation & Self-Correction Governance

**CRITICAL**: After making ANY change, deterministic validation is non-negotiable. The self-correction loop replaces guesswork and intuition with mechanical precision.

### Validation Command Priority

1. **Prefer repo-defined umbrella scripts** (if they exist):
   - `pnpm validate` — Full gate (check + build)
   - `pnpm check` — Lint + format + typecheck
   - `pnpm verify` — Alternative full gate
   - `pnpm quality-gate` — Alternative full gate

2. **If umbrella script exists, run it first** — Let it fail completely before drilling into individual components
3. **If no umbrella, run individually**:
   - `pnpm lint` (or `pnpm format:check` if format errors block lint)
   - `pnpm typecheck`
   - `pnpm test` (unit/integration/component/api)
   - `pnpm build`
   - `pnpm test:e2e` (if E2E tests exist)
   - `pnpm test:names` (if test naming validation exists)
   - App-specific checks: Electron, Capacitor, WASM, mobile, etc.

4. **Determine correct commands by inspecting**:
   - Root `package.json` scripts
   - App-level `package.json` scripts (in `apps/[app]/package.json`)
   - Workspace `pnpm-workspace.yaml` configuration
   - Relevant scoped instruction files in `.github/instructions/`

### The Self-Correction Loop (Mandatory)

Every validation failure requires explicit self-correction:

```
┌────────────────────────────────────────────────────────────┐
│ 1. INSPECT OUTPUT: Read error carefully                   │
│    - Identify the ROOT CAUSE (not the symptom)            │
│    - Note file path, line number, rule violated           │
│    - Understand WHY the check failed                      │
└────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────┐
│ 2. FIX ROOT CAUSE: Update code or configuration           │
│    - Address the underlying issue                         │
│    - Do NOT disable/suppress/ignore the rule              │
│    - Do NOT decrease strictness (type, lint, etc.)        │
│    - For build failures: understand dependency/config     │
└────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────┐
│ 3. RERUN THE COMMAND: Verify the fix                      │
│    - Run the exact same command that failed               │
│    - Capture the output                                   │
│    - Did it pass? → Go to Step 4                          │
│    - Still failing? → Go to Step 1 (new analysis)         │
└────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────┐
│ 4. REPEAT UNTIL GREEN: All checks must pass               │
│    - ✅ If this check passes, move to the next check      │
│    - ✅ If all checks pass, work is complete              │
│    - ❌ If ANY check fails, restart at Step 1             │
│    - Do NOT stop early (code that "looks right" is NOT   │
│      done until the machine verifies it)                  │
└────────────────────────────────────────────────────────────┘
```

### Forbidden Actions (Non-Negotiable)

When validation fails, you MUST **NOT**:

| Action                                | Why It's Forbidden                            | What To Do Instead                     |
| ------------------------------------- | --------------------------------------------- | -------------------------------------- |
| Disable lint rules                    | Suppresses real problems; breaks architecture | Fix the code to satisfy the rule       |
| Use `// eslint-disable`               | Hides violations; breaks governance           | Address the underlying issue           |
| Loosen TypeScript strictness          | Reduces type safety; introduces bugs          | Add proper types or refactor code      |
| Comment out failing tests             | Loses test coverage; masks bugs               | Fix the code to pass the test          |
| Delete failing tests                  | Same as commenting out                        | Make the test pass; never delete       |
| Use `// @ts-ignore`                   | Bypasses type checking; hides errors          | Fix the type error properly            |
| Skip validation checks                | Claims completion without proof               | Run ALL checks and fix failures        |
| Bypass architecture checks            | Violates separation of concerns               | Respect boundaries; refactor if needed |
| Weaken build output validation        | Hides problems; breaks reliability            | Fix the real issue in code/config      |
| Claim "it looks right" without checks | Intuition != verification                     | Wait for machine verification          |

### Mandatory Self-Correction Directive

If you encounter a validation failure:

1. **Do not stop** — Self-correct the code
2. **Do not claim success** — Until all checks pass
3. **Do not suppress errors** — Fix the root cause
4. **Do not weaken rules** — Tighten your code instead
5. **Do not skip steps** — Run the full loop
6. **Do not work around issues** — Fix them directly
7. **Do not assume** — Read the error, follow the loop
8. **Do not give up** — Keep self-correcting until green

### When a Real Blocker Is Found

If you encounter a legitimate blocker — something that cannot be fixed without external input or reveals a fundamental issue — then:

1. **State the blocker explicitly** — "I cannot proceed because [specific reason]"
2. **Explain why it blocks** — What would need to change to unblock
3. **Provide evidence** — Command output, stack trace, file listing, etc.
4. **Ask for guidance** — Request clarification or permission from the human before proceeding

**This is the ONLY acceptable condition for incomplete work.** All other validation failures require self-correction.

---

## 1. Governance Precedence

1. **AGENTS.md** (this file) — supreme authority; overrides all other governance files.
2. `.github/copilot-instructions.md` — repo-wide Copilot runtime policy.
3. `.github/instructions/*.instructions.md` — scoped, numbered instruction files.
4. `docs/**` — human-readable reference documents (informational, not directive).

If any scoped file contradicts AGENTS.md, AGENTS.md wins.

---

## 1.A Skills Orchestration Governance

**Canonical skill catalog**: `.github/skills/README.md`

This repository uses skill-specialized execution. Agents must route work through the skill catalog workflow bundles before implementation.

### Mandatory

- Map each task to one or more **Operational Workflow Bundles (1-8)** in `.github/skills/README.md`.
- Apply the primary skill owner for the bundle before making non-trivial changes.
- For multi-scope work, assign a lead bundle and one or more supporting bundles explicitly.
- Prefer skill-owned scripts/chains over ad hoc command composition.
- Keep skill definitions aligned with real `package.json` script chains and governance files.

### Forbidden

- Do not execute complex work without selecting a bundle owner.
- Do not create parallel workflows that bypass skill-owned script chains.
- Do not let skill docs drift from actual scripts, quality gates, or platform routing rules.

---

## 2. Absolute Package-Manager Rule

This repository uses **pnpm exclusively**.

| Field            | Value          |
| ---------------- | -------------- |
| `packageManager` | `pnpm@10.31.0` |
| `engines.node`   | `24.14.0`      |
| `engines.pnpm`   | `10.31.0`      |

### Mandatory

- Use `pnpm install`, `pnpm add`, `pnpm remove`, `pnpm update`, `pnpm exec`, `pnpm run <script>`.
- Preserve `pnpm-lock.yaml` and `pnpm-workspace.yaml`.

### Forbidden

- Never use `npm`, `npx`, `yarn`, or any non-pnpm package manager.
- Never generate `package-lock.json` or `yarn.lock`.
- Never suggest `npm install`, `npm run`, `npx`, or Yarn workflows.

### `.npmrc` Policy (Monorepo)

- Root `.npmrc` defines workspace-wide defaults and remains the baseline source of truth.
- App-local `.npmrc` files are allowed only for additive, app-scoped tuning that does not conflict with root package-manager governance.
- Keep app-local `.npmrc` minimal and aligned where possible (for example: `save-exact=true`, `node-linker=hoisted`).
- Do not introduce app-local settings that change package-manager family/lockfile behavior or violate pnpm-only governance.

---

---

## § 3. Architecture & Path Discipline (Modularized)

**Authority**: AGENTS.md § 0 (Rules) and **[docs/governance/ARCHITECTURE.md](docs/governance/ARCHITECTURE.md)**

This repository enforces **CLEAN Architecture** and **Atomic Design**. Detailed layer boundaries, import rules, and path discipline are defined in the modular architecture guide.

### 3.1 Core Constraints

- **Layers**: Domain → App → UI.
- **Imports**: No cross-layer relative imports (`../../`). Use aliases (`@/domain`).
- **Barrels**: Every directory MUST have an `index.ts`.
- **Naming**: Consistent prefixes (`use*`, `*Context`, `*Service`).

See **[docs/governance/ARCHITECTURE.md](docs/governance/ARCHITECTURE.md)** for the complete specification.

---

## 5. Cross-platform Shell Governance (MANDATORY)

**CRITICAL PROJECT INVARIANT:**

- **Bash / POSIX shell is the mandatory default** for all development, build, and operational tasks.
- **PowerShell is opt-in only** and must never be assumed as a default.
- **This rule is non-negotiable** and applies at all layers of project governance.

This repository enforces strict shell usage rules to ensure builds and scripts run in the correct environment, to maximize portability, and to prevent cross-shell command drift.

Reference: The repository's script output formatting, ANSI color palette, and emoji conventions are documented in [docs/SCRIPT-STANDARDS.md](docs/SCRIPT-STANDARDS.md). Follow that specification when authoring or updating shell scripts to ensure consistent CI and developer UX.

### Default Shell: Bash / POSIX

**All development and build tasks must use Bash unless explicitly exempted below.**

Bash is normally provided through:

- **WSL: Ubuntu** (default on Windows development machines)
- native Linux environments
- native macOS bash environments
- CI Linux runners

Use Bash for:

- dependency installation (`pnpm install`)
- development server execution (`pnpm run dev`, `pnpm run start`)
- Vite builds (`pnpm run build`, `pnpm run preview`, `pnpm run build:preview`)
- WASM builds (`pnpm run wasm:build`, `pnpm run wasm:build:debug`)
- linting (`pnpm run lint`, `pnpm run lint:fix`)
- formatting (`pnpm run format`, `pnpm run format:check`)
- typechecking (`pnpm run typecheck`)
- validation (`pnpm run check`, `pnpm run fix`, `pnpm run validate`)
- cleanup (`pnpm run clean`, `pnpm run clean:node`, `pnpm run clean:all`, `pnpm run reinstall`)
- Electron development mode (`pnpm run electron:dev`, `pnpm run electron:preview`)
- Linux Electron packaging (`pnpm run electron:build:linux`)
- Capacitor sync (`pnpm run cap:sync`)
- general source editing, documentation, and repository maintenance

**If the task is not explicitly a Windows-native or macOS-native packaging task, use Bash. There is no ambiguity.**

### Explicit Exception: Windows-Native Electron Packaging Only

**PowerShell is opt-in only** for one specific task:

- `pnpm run electron:build:win` — Windows Electron `.exe` packaging (PowerShell only)

PowerShell is **not** the default shell. **PowerShell must never be assumed, suggested, or used unless you are explicitly building Windows Electron packages.** Even on Windows development machines, Bash (via WSL) is the default environment.

### macOS and iOS builds

Use a **native or remote macOS** environment only for:

- `pnpm run electron:build:mac`
- `pnpm run cap:init:ios`
- `pnpm run cap:open:ios`
- `pnpm run cap:run:ios`

iOS builds require Apple hardware. Never suggest iOS commands unless macOS availability is confirmed.

### Android builds

Use an **Android-capable environment** (with Android SDK) only for:

- `pnpm run cap:init:android`
- `pnpm run cap:open:android`
- `pnpm run cap:run:android`

### Shell Routing Summary

| Environment                 | Tasks                                                                                                | DEFAULT?  |
| --------------------------- | ---------------------------------------------------------------------------------------------------- | --------- |
| **Bash** (WSL / Linux / CI) | All general development, builds, quality checks, WASM, Electron dev, Linux packaging, Capacitor sync | ✅ YES    |
| **PowerShell**              | `electron:build:win` only                                                                            | ❌ OPT-IN |
| **macOS**                   | `electron:build:mac`, iOS Capacitor tasks                                                            | ❌ OPT-IN |
| **Android SDK**             | Android Capacitor tasks                                                                              | ❌ OPT-IN |

### Non-Negotiable Hard-Stop Rules

**The following violations are prohibited at all times:**

- ❌ Never default to PowerShell for routine development
- ❌ Never present PowerShell as interchangeable with Bash for ordinary tasks
- ❌ Never switch to PowerShell unless the task is explicitly Windows-native Electron packaging
- ❌ Never suggest PowerShell commands without explicit user approval
- ❌ Never generate PowerShell `.ps1` scripts, cmdlets, or syntax unless explicitly requested
- ❌ Never assume Windows-native shell syntax even on Windows machines
- ❌ Never silent-switch to PowerShell when Bash equivalent exists
- ❌ Never claim iOS tasks can run fully from Windows or WSL
- ❌ Never introduce cross-shell command drift

**Bash / POSIX shell is the mandatory default. PowerShell is opt-in only. This rule is enforced at all layers.**

---

## 6. Language, Syntax, and Script Governance

### Approved primary languages

- HTML, CSS, JavaScript, TypeScript, AssemblyScript, WebAssembly

### Language priority order

1. TypeScript 2. JavaScript 3. HTML 4. CSS 5. AssemblyScript 6. WebAssembly

### Rules

- Do not create one-off scripts in random languages.
- Do not create parallel implementations of the same concern.
- New files must live in the correct existing directory.
- Prefer repository-native tooling (Vite, TypeScript, ESLint, Prettier, Electron, Capacitor, AssemblyScript, pnpm).

### Anti-orphan-script policy

Every new script must: solve a real need, belong to approved languages, fit existing structure, not duplicate existing tooling, have clear purpose.

### Hard-stop rules

Never: introduce non-approved languages, create helper scripts in random languages, create duplicate build paths, scatter automation across runtimes.

---

## 7. Minimal-Change Principle

- Modify only what the user requested.
- Do not refactor beyond the scope of the task.
- Do not add dependencies unless explicitly asked.
- Preserve existing code style and organization.

---

## 8. Response Contract

1. **Use pnpm** — never npm, npx, or yarn.
2. **Respect layer boundaries** — per §3.
3. **Use path aliases** — `@/domain/...`, `@/app/...`, `@/ui/...`.
4. **Use existing scripts** — prefer `pnpm <script>` over raw CLI.
5. **Target the correct shell** — per §5.
6. **Cite governance** — explain which rule blocks a request and suggest alternatives.

---

## 9. Self-Check Before Every Response

- [ ] Am I using `pnpm` (not npm/npx/yarn)?
- [ ] Does my import respect layer boundaries in §3?
- [ ] Am I using path aliases, not relative cross-layer imports?
- [ ] Am I targeting the correct shell per §5?
- [ ] Am I using an approved language per §6?
- [ ] Am I avoiding orphaned scripts per §6?
- [ ] Am I modifying only what was requested per §7?
- [ ] Does my output match an existing `package.json` script where applicable?
- [ ] Have I selected and applied the correct skill bundle owner from `.github/skills/README.md`?

If any check fails, fix it before responding.

---

---

## § 10. SOLID Principles & Design Patterns (Modularized)

**Authority**: AGENTS.md § 0 (Rules) and **[docs/governance/SOLID_PATTERNS.md](docs/governance/SOLID_PATTERNS.md)**

This codebase enforces **SOLID principles** and common architectural patterns (Atomic Design, Barrel, Composition, etc.).

### 10.1 Core Patterns

- **CLEAN Layers**: Separation of concerns.
- **Atomic Design**: Hierarchy of UI components.
- **Composition**: Prefer composition over inheritance.
- **DRY**: Logic reuse via hooks and domain logic.

See **[docs/governance/SOLID_PATTERNS.md](docs/governance/SOLID_PATTERNS.md)** for the complete specification and agent checklist.

---

GENERAL GAME ENGINE DESIGN RULE

---

When designing any game-family engine:

- isolate pure game logic from UI
- isolate rendering from rules
- isolate input handling from game rules
- isolate persistence from gameplay logic
- isolate scoring and progression from rendering
- compose behavior instead of branching on product identity
- use registries, factories, adapters, or plugin-like patterns when appropriate
- do not create giant switch statements over app names or variant names

Prefer:

- engines
- modules
- policies
- validators
- handlers
- factories
- adapters
- registries
- configuration-driven composition

SIGNAL-DRIVEN GAME GOVERNANCE

---

When designing any game-family app or engine where pacing, mood, AI behavior,
difficulty, or music intensity matter:

- treat `pressure`, `intensity`, `focus`, and `progress` as first-class runtime
  signals
- keep signal generation, simulation consumption, and presentation separate
- use these signals to drive pacing, difficulty, encounter cadence, timer
  pressure, and music or mood shifts
- prefer shared generators and policies over product-specific branching
- if an app only visualizes the signals without a playable loop and fail
  state, classify it as a scaffold or reference implementation, not a finished
  game

When reviewing completeness, confirm:

- a real game loop exists
- the signals change state over time
- UI reflects gameplay rather than faking progression
- the app can be described as playable, not only as a signal shell

Avoid:

- giant monolith files
- app-name branching inside shared engines
- product-specific hacks in shared code

---

REFACTORING PROCEDURE

---

Before changes:

1. Identify behavior
2. Identify contracts
3. Identify dependencies
4. Identify shared systems
5. Identify extraction points
6. Identify whether the work belongs in apps, packages, or both
7. Identify compliance impact and affected quality gates where appropriate

Then:

- preserve
- decompose
- extract
- avoid unnecessary rewrites
- make minimal safe edits

---

LARGE COMPONENT RULE

---

Split:

- subcomponents
- hooks
- handlers
- selectors
- derived state
- view-model shaping
- render branches
- accessibility helpers
- keyboard helpers

DO NOT:

- compress into a smaller monolith
- delete logic to make the file shorter

---

LARGE FUNCTION RULE

---

Split:

- validators
- guards
- transformers
- policies
- calculators
- branch-specific handlers
- command or query handlers where appropriate

DO NOT:

- remove cases
- flatten nuanced behavior into generic behavior
- delete branches simply to reduce complexity

---

PROHIBITED ACTIONS

---

NEVER:

- merge multiple games into one app
- build selector-based super apps
- remove functionality
- replace real logic with placeholders
- duplicate shared logic
- break accessibility
- break keyboard behavior
- silently change contracts
- silently change UX behavior
- silently change focus behavior
- silently change validation or fallback behavior
- bypass compliance tracking when relevant
- ignore shared systems where they should be used

---

OUTPUT REQUIREMENTS

---

For non-trivial work:

FIRST:

1. behavior preserved
2. contracts preserved
3. modules or layers involved
4. proposed plan
5. why the change is lossless
6. whether the work belongs in apps, packages, or both
7. any compliance or quality gate impact if applicable

THEN:

- implement minimal safe changes
- place code in the correct layer
- preserve architectural boundaries

---

SUCCESS CRITERIA

---

Success means:

- behavior preserved
- contracts preserved
- accessibility preserved
- keyboard preserved
- focus behavior preserved
- fallback and validation behavior preserved
- reuse increased
- complexity reduced via decomposition
- apps remain independent
- shared systems remain shared
- compliance visibility remains accurate
- dashboard data can reflect implementation state correctly

If ANY capability is lost:
THE CHANGE IS INVALID

---

---

## § 28. Testing Governance & Standards (Modularized)

**Authority**: AGENTS.md § 0 (Rules) and **[docs/governance/TESTING.md](docs/governance/TESTING.md)**

All applications enforce strict testing standards with mandatory validation, consistent naming, and framework boundaries.

### 28.1 Key Standards

- **Naming**: `<feature>.<type>.(test|spec).ts`
- **Frameworks**: Vitest (unit/int/comp/api) vs Playwright (e2e/a11y/visual).
- **Quality Gate**: `pnpm validate` includes test naming and execution checks.

See **[docs/governance/TESTING.md](docs/governance/TESTING.md)** for the complete specification.

---

## § 29. Node.js Best Practices (Frontend Adaptation)

**Authority**: AGENTS.md § 0 (Non-Negotiable Rules), § 29  
**Primary Documentation**: `.github/instructions/19-nodejs-frontend-best-practices.instructions.md`  
**Source**: https://github.com/goldbergyoni/nodebestpractices (102+ items, adapted for React/TypeScript)

### Scope & Relevance

This section synthesizes Node.js best practices for frontend React/TypeScript/Vite applications. While Node.js best practices originated from backend server development, core principles apply directly:

- **Async/await discipline** — Error handling, promise safety, rejection patterns
- **Code style & naming** — Clear intent, TypeScript strictness, convention over configuration
- **Testing best practices** — Test structure (AAA), meaningful names, coverage targets
- **Error handling** — Classification, recovery paths, logging with context
- **Configuration** — Environment-driven config, secrets management, validation at startup
- **Code quality gates** — Pre-commit automation, CI/CD enforcement, quality metrics

### What's Covered

| Topic                        | Where           | Priority  |
| ---------------------------- | --------------- | --------- |
| **Async/Await Discipline**   | Instruction § 1 | HIGH      |
| **Promise Safety**           | Instruction § 2 | HIGH      |
| **Naming Conventions**       | Instruction § 3 | HIGH      |
| **Code Style Standards**     | Instruction § 4 | MEDIUM    |
| **Testing Best Practices**   | Instruction § 5 | HIGH      |
| **Configuration Discipline** | Instruction § 6 | MEDIUM    |
| **Error Handling Summary**   | Instruction § 7 | HIGH      |
| **Quality Gates Review**     | Instruction § 8 | MANDATORY |

### Key Rules

1. **Always handle promise rejections** — No fire-and-forget async operations
2. **Classify errors explicitly** — User error vs recoverable vs fatal
3. **Use async/await over promise chains** — Clearer, easier to debug
4. **Name functions by intent** — Async verbs (load, save, init); booleans (is, has); handlers (on, handle)
5. **Strict TypeScript** — No implicit any, no loose nullability
6. **Test naming convention** — `<feature>.<type>.test.ts(x)` (enforced by `pnpm test:names`)
7. **Environment-driven config** — Never hardcode sensitive values or environment-specific settings
8. **Quality gates mandatory** — `pnpm validate` must pass before commit

### Quick Checklist

After every code change:

- [ ] Async operations wrapped in try/catch
- [ ] Promise rejections handled explicitly
- [ ] Errors classified (user/recoverable/fatal)
- [ ] Variable names clear and meaningful
- [ ] Test files follow naming convention
- [ ] `pnpm fix` passes (auto-fixes lint + format)
- [ ] `pnpm check` passes (lint + format:check + typecheck)
- [ ] `pnpm test` passes (all tests pass)
- [ ] `pnpm validate` passes (full gate: check + build)

### Read First

**Start here**: `.github/instructions/19-nodejs-frontend-best-practices.instructions.md`  
**Then read**: `AGENTS.md` § 0 (Non-Negotiable Rules)  
**Reference**: `AGENTS.md` § 26 (Error Handling), § 28 (Testing)

Note: Node.js script output conventions (ANSI colors, emoji usage, and standardized progress labels) are specified in [docs/SCRIPT-STANDARDS.md](docs/SCRIPT-STANDARDS.md). Node.js scripts that emit CLI output should comply with that document in addition to the rules below.

### Governance Precedence

1. `AGENTS.md` § 0 — Supreme authority (non-negotiable rules)
2. `AGENTS.md` § 29 — This section (Node.js best practices summary)
3. `.github/instructions/19-nodejs-frontend-best-practices.instructions.md` — Detailed guidance
4. Related sections: § 26 (error handling), § 28 (testing), § 12 (responsive design)

---

---

## § 30. CSS Performance & Rendering Optimization (MANDATORY)

**Authority**: AGENTS.md § 0 (Non-Negotiable Rules), Primary source: `.github/instructions/20-css-performance-rendering-optimization.instructions.md`

### CRITICAL RULE: ALL CSS MUST RESPECT THE CRITICAL RENDERING PATH

The browser executes these steps in order. EVERY step must be optimized:

1. **Download HTML** → 2. **Parse HTML + Discover Assets** → 3. **Download & Parse Critical CSS** ⚠️ **RENDER-BLOCKING** → 4. **Download & Execute Critical JS** ⚠️ **PARSER-BLOCKING** → 5. **Build Render Tree** → 6. **Layout** → 7. **Paint** → 8. **Composite**

CSS construction is **ALL-OR-NOTHING** (not incremental). Browser WAITS until entire CSSOM is parsed before rendering anything.

### 13 SUPER PROMPTS ENFORCEMENT

All CSS optimization derives from 13 maximum-density super prompts. See `.github/instructions/20-css-performance-rendering-optimization.instructions.md` for complete enforcement rules.

**Quick Reference**:

| Super Prompt                | Rule                                        | Target                     |
| --------------------------- | ------------------------------------------- | -------------------------- |
| 1. CRP                      | HTML → CSS (blocked) → JS → Paint           | Optimize browser sequence  |
| 2. Render-Blocking CSS      | CSS blocks rendering by default             | Every KB costs 1-3ms parse |
| 3. Critical CSS Strategy    | Inline <14KB above-fold; defer non-critical | FCP timing                 |
| 4. CSS Size Optimization    | Minify + remove unused                      | <50KB critical path        |
| 5. Non-Blocking CSS         | Load non-critical AFTER FCP                 | media="print" pattern      |
| 6. HEAD Optimization        | Only critical resources                     | Minimal blocking           |
| 7. Layout/Reflow/Paint      | transform/opacity only for animations       | No layout thrashing        |
| 8. CLS Prevention           | Reserve space for images                    | CLS <0.1                   |
| 9. Font Performance         | font-display: swap; preload LCP font        | Text renders immediately   |
| 10. CSS Architecture        | BEM naming, split by feature                | Clean, reusable CSS        |
| 11. Resource Prioritization | LCP ≤2.5s; fetchpriority="high"             | User perception            |
| 12. Validation + Tooling    | Lighthouse ≥90, DevTools, PageSpeed         | No guessing                |
| 13. Core Web Vitals         | FCP <1.8s, LCP <2.5s, CLS <0.1              | 75th percentile field data |

### MANDATORY THRESHOLDS (Hard Limits)

| Metric                | Good      | Fail   |
| --------------------- | --------- | ------ |
| **Lighthouse**        | ≥90       | <80    |
| **FCP**               | <1.8s     | >3s    |
| **LCP**               | <2.5s     | >4s    |
| **CLS**               | <0.1      | >0.25  |
| **CSS Critical Path** | <50KB     | >100KB |
| **DevTools Coverage** | >80% used | <70%   |

### SELF-CORRECTION LOOP (MANDATORY)

When CSS performance issue identified:

1. **Measure**: Run Lighthouse, DevTools, PageSpeed
2. **Identify**: Which super prompt applies?
3. **Analyze**: Which metric is failing? (FCP/LCP/CLS/blocking resources)
4. **Fix**: Apply super prompt solution
5. **Validate**: Rerun tools until green
6. **Document**: What was the issue + fix

### ENFORCEMENT CHECKLIST (Every Commit)

- [ ] Lighthouse score ≥80 (target ≥90)
- [ ] No render-blocking CSS >critical path
- [ ] No parser-blocking JS in `<head>`
- [ ] DevTools Coverage: CSS usage >80%
- [ ] LCP ≤2.5s (field data if available)
- [ ] CLS ≤0.1 (no unexpected shifts)
- [ ] Core Web Vitals passing (FCP, LCP, CLS)
- [ ] Waterfall: Critical resources downloaded first
- [ ] No unused CSS shipped
- [ ] All validation tools passing

### INTEGRATION POINTS

- **AGENTS.md § 0**: Non-negotiable rules (quality gates mandatory, self-correction loop)
- **AGENTS.md § 0.A**: Runtime validation & self-correction (applies to CSS changes)
- **`.github/copilot-instructions.md`**: Added enforcement directive + link to § 30
- **`CLAUDE.md`**: Added CSS performance quality gate requirement
- **`.github/instructions/02-frontend.instructions.md`**: Added React CSS optimization rules
- **`.github/instructions/01-build.instructions.md`**: Added Lighthouse audit to `pnpm validate`
- **`.github/instructions/17-testing.instructions.md`**: Added performance test requirements
- **`.github/instructions/20-css-performance-rendering-optimization.instructions.md`**: Complete authoritative reference (13 super prompts)

### AUTHORITATIVE SOURCES (All Embedded with URLs)

- ✅ MDN Critical Rendering Path
- ✅ web.dev/CRP, CSS Vitals, LCP
- ✅ Chrome Lighthouse Audit Docs
- ✅ SpeedCurve Web Performance Guide
- ✅ web.dev/Field Measurement Best Practices
- ✅ web.dev/Resource Loading
- ✅ Google Web Vitals Library
- ✅ PageSpeed Insights API

**See § 30 complete reference**: `.github/instructions/20-css-performance-rendering-optimization.instructions.md`

---

DEFAULT EXECUTION DIRECTIVE

---

Act as a senior engineer.

Preserve behavior.
Preserve contracts.
Preserve architecture.

Decompose instead of deleting.
Compose instead of branching.
Reuse instead of duplicating.

Build MANY small, high-quality, independent game apps powered by shared systems.

DO NOT build a super app.
DO NOT reduce app count.
DO NOT trade product proliferation for architectural convenience.

---

---

## § 31. Commit Governance & Self-Enforcing Documentation (Modularized)

**Authority**: AGENTS.md § 0 (Rules) and **[docs/governance/COMMIT_GOVERNANCE.md](docs/governance/COMMIT_GOVERNANCE.md)**

This repository uses **Conventional Commits** and **Gitmoji** to drive automated changelogs and documentation.

### 31.1 Enforcement Stack

1. **Commitizen**: Interactive prompts (`pnpm commit`).
2. **Commitlint**: Syntax validation.
3. **Husky**: Pre-commit hooks.
4. **standard-version**: Automated releases and CHANGELOG generation.

See **[docs/governance/COMMIT_GOVERNANCE.md](docs/governance/COMMIT_GOVERNANCE.md)** for the complete specification.

---

---

## § 35. Audio System Governance (MANDATORY)

**Authority**: AGENTS.md § 0 (Rules) and **[docs/governance/AUDIO_GOVERNANCE.md](docs/governance/AUDIO_GOVERNANCE.md)**

This repository enforces a unified audio architecture via the \`@games/audio-engine\` package.

### 35.1 Core Mandates

- **Abstraction**: Never import \`howler\` directly in apps. Use \`useAudio\` or \`useMusic\` hooks.
- **Synthesis**: Favor programmatic Web Audio synthesis (\`useSynth\`) for bleeps/UI feedback to reduce asset size.
- **Context**: Every application MUST be wrapped in the \`<AudioProvider>\` for global volume/mute governance.
- **Motion**: Audio triggers MUST respect the \`prefers-reduced-motion\` system setting.

See **[docs/governance/AUDIO_GOVERNANCE.md](docs/governance/AUDIO_GOVERNANCE.md)** for the complete specification and integration guide.

---
