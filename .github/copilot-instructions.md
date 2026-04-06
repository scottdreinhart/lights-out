# Copilot Runtime Policy — Nim

> **Authority**: This file is subordinate to `AGENTS.md`. If any rule here conflicts, `AGENTS.md` wins.
> **CRITICAL**: Bash/POSIX is the mandatory default shell. PowerShell is opt-in only and must never be assumed.

Default development shell for this repository: **Bash (WSL Ubuntu)**.

**PowerShell is opt-in only.** Do not default to PowerShell unless the user explicitly requests it or the task is specifically `electron:build:win` (Windows Electron packaging).

**Mandatory policy**: All development, build, testing, and operational tasks use Bash/POSIX shell unless explicitly exempted by user direction.

---

## MANDATORY: Copilot Operating Rules

Before making ANY changes, you MUST:

1. **Read AGENTS.md first** — Especially § 0 (Non-Negotiable Rules), § 0.A (Runtime Validation & Self-Correction), § 3 (Architecture), § 4 (Path Discipline), § 29 (Node.js Best Practices), § 30 (CSS Performance)
2. **Inspect existing code** — Search for similar components, hooks, utilities, and patterns before creating anything new
3. **Reuse before creating** — Extend existing implementations instead of building parallel code
4. **Make minimal edits** — Prefer surgical changes over rewrites; preserve file structure and naming
5. **Respect architecture** — Never bypass layering, import rules, or barrel conventions
6. **No fake completion** — Do not leave placeholders, mock wiring, or incomplete integrations; run all checks before finishing
7. **Run quality gates** — After edits, execute `pnpm check`, `pnpm test`, and `pnpm validate` and fix any failures
8. **Self-correct failures** — When checks fail, read errors carefully, fix root cause, rerun, and repeat until all checks pass
9. **Match conventions** — Follow existing patterns: naming, folder layout, state management, exports, accessibility
10. **Apply Node.js best practices** — See AGENTS.md § 29 and `.github/instructions/19-nodejs-frontend-best-practices.instructions.md` for async/await discipline, error handling, naming conventions, testing standards
11. **CSS Performance mandatory** — All CSS must respect AGENTS.md § 30 (Critical Rendering Path). Lighthouse ≥90, Core Web Vitals passing. See `.github/instructions/20-css-performance-rendering-optimization.instructions.md` for complete enforcement

**Violations of these rules create technical debt and break the codebase. Do not do this.**

**See AGENTS.md § 0 for full non-negotiable rules and § 0.A for mandatory self-correction loop.**

---

## Package Manager

**pnpm only.** Never use npm, npx, yarn, or generate non-pnpm lockfiles.

---

## Architecture (CLEAN + Atomic Design)

| Layer   | Path           | May Import               |
| ------- | -------------- | ------------------------ |
| Domain  | `src/domain/`  | `domain/` only           |
| App     | `src/app/`     | `domain/`, `app/`        |
| UI      | `src/ui/`      | `domain/`, `app/`, `ui/` |
| Workers | `src/workers/` | `domain/` only           |
| Themes  | `src/themes/`  | nothing (pure CSS)       |

**Component hierarchy**: `atoms/ → molecules/ → organisms/`
**Data flow**: Hooks → Organism → Molecules → Atoms (unidirectional)

---

## Import Rules

- Use path aliases: `@/domain/...`, `@/app/...`, `@/ui/...`.
- Import from barrel `index.ts` files, not internal modules.
- Never use `../../` cross-layer relative imports.

---

## Key Scripts

| Task            | Script                                                                 | CSS Performance |
| --------------- | ---------------------------------------------------------------------- | --- |
| Dev server      | `pnpm start` or `pnpm dev`                                             | Use DevTools Coverage |
| Build           | `pnpm build`                                                           | Triggers Lighthouse audit |
| Quality gate    | `pnpm check` (lint + format:check + typecheck)                         | Lint includes CSS rules |
| Auto-fix        | `pnpm fix` (lint:fix + format)                                         | Fixes CSS violations |
| Full validation | `pnpm validate` (check + build + Lighthouse)                           | MUST pass ≥80 score |
| Clean           | `pnpm clean` / `pnpm clean:node` / `pnpm clean:all` / `pnpm reinstall` | — |

---

## Responsive Design (5-Tier Architecture)

All UI components support 5 semantic device tiers using centralized `useResponsiveState()` hook.

**Device Tiers:**

- **Mobile** (xs/sm: <600px) — phones, compact layout
- **Tablet** (md: 600–899px) — tablets, balanced layout
- **Desktop** (lg: 900–1199px) — laptops, full layout
- **Widescreen** (xl: 1200–1799px) — large monitors, spacious layout
- **Ultrawide** (xxl: 1800px+) — multi-monitor, premium refinement

**Pattern:**

- Extract responsive state: `const responsive = useResponsiveState()`
- Use inline styles for dynamic layout changes (flexDirection, maxWidth, padding based on contentDensity)
- Use CSS media queries for static typography and spacing variants per tier
- Always provide touch fallback: `@media (pointer: coarse) { .button:hover { transform: none; } }`
- Apply content density awareness to spacing: compact/comfortable/spacious

**References:**

- Detailed patterns: `.github/instructions/06-responsive.instructions.md`
- Governance rules: `AGENTS.md` § 12

---

## Menu & Settings Architecture

Applications implement a **dual-menu system**: in-app hamburger (quick access) + full-screen modal (comprehensive).

**Hamburger Menu Pattern:**

- Portal-rendered dropdown (`createPortal()` to `document.body`)
- Fixed positioning at z-index 9999+ (above game)
- Position calculated from button bounding rect via `useLayoutEffect`
- Smart alignment: right-edge aligns to game board with overflow clamping
- Dropdown behavior via `useDropdownBehavior` hook (ESC closes, click-outside closes, focus trap)
- Hamburger icon animates 3-line → X (spring cubic-bezier, 300ms)
- Accessibility: aria-haspopup, aria-expanded, aria-controls, aria-label
- Touch-safe: mousedown + touchstart listeners, no accidental gameplay triggers
- Responsive sizing: 240px (mobile) → 320–480px (desktop) → 380–520px (ultrawide)
- Content density aware: padding/gap scale with `responsive.contentDensity` enum
- Keyboard nav: ESC closes, focus returns to button, tab-trapped while open

**Full-Screen Settings Modal:**

- Triggered from home screen (MainMenu), not during gameplay
- Organized sections: game settings, theme/display, accessibility
- Uses same atoms as hamburger for consistency
- All context providers integrated (ThemeContext, SoundContext, etc.)
- Transactional semantics: OK confirms, Cancel reverts
- Scrollable on mobile if needed
- Accessible form fields with proper labeling

**Related Governance:** `AGENTS.md` § 13 — Menu & Settings Architecture Governance features comprehensive specifications, implementation patterns, and checklists.

---

---

## Shell Routing (Mandatory Policy)

**Bash (POSIX) is the mandatory default shell for all development work in this repository.**

**PowerShell is opt-in only and must never be assumed as the default.**

### Default: Bash

Default to **Bash (WSL: Ubuntu)** for all development work:

- `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm check`, `pnpm fix`, `pnpm validate`
- All linting, formatting, typechecking
- WASM builds, Electron development, Capacitor sync
- All general repository tasks

### Explicit Opt-In: PowerShell

Use **PowerShell** only when:

- User explicitly requests PowerShell, OR
- The task is `pnpm run electron:build:win` (Windows Electron packaging, explicitly Windows-native)

Do NOT use PowerShell for routine development or CI tasks.

### Explicit Opt-In: macOS / Apple

Use **macOS** only for: `pnpm run electron:build:mac`, `pnpm run cap:init:ios`, `pnpm run cap:open:ios`, `pnpm run cap:run:ios`

Never suggest iOS tasks as feasible from Windows/WSL without explicit macOS hardware.

### Forbidden (Non-Negotiable)

- ❌ Never generate PowerShell commands, `.ps1` scripts, or PowerShell cmdlets by default
- ❌ Never assume Windows-native shell syntax even on Windows machines
- ❌ Never present PowerShell as interchangeable with Bash for ordinary tasks
- ❌ Never silent-switch to PowerShell when Bash equivalent exists
- ❌ Never default to PowerShell for dev server, build, linting, testing, or validation

**Bash/POSIX is mandatory. PowerShell requires explicit user approval.**

---

## Node Platform Marker (WSL/PowerShell)

When this repo is on NTFS and used from both WSL Bash and Windows PowerShell, native binaries in `node_modules/` can become incompatible across shells.

- Before running commands in **Bash/WSL**, check `.node-platform.md`.
  - If `platform: windows`, run `pnpm clean:node && pnpm install`, then set marker to `platform: linux`.
- Before running commands in **PowerShell**, check `.node-platform.md`.
  - If `platform: linux`, run `pnpm clean:node && pnpm install`, then set marker to `platform: windows`.
- If `.bin` shims/symlinks are missing after reinstall, run `pnpm rebuild`.

---

## Governance Authority & References

All runtime decisions are subordinate to **AGENTS.md**. Refer to AGENTS.md for comprehensive governance including:

- **§ 4**: Path Discipline & Structure — 15 top-level directories, barrel pattern, file naming conventions, anti-patterns, scaling guidance
- **§ 10**: SOLID Principles & Design Patterns — Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion, DRY, SOC, ACID, CRUD, POLP, RBS; patterns, checklists
- **§ 11**: Standard Application Shell Architecture — splash, landing, main content, results/history screens
- **§ 12**: Responsive Design & Device-Aware UI Governance — 5-tier semantics, content density, touch optimization
- **§ 13**: Menu & Settings Architecture Governance — hamburger menu, full-screen settings modal, dual-menu system, useDropdownBehavior hook, portal rendering, TicTacToe reference implementation
- **§ 14**: Electron & Desktop Build Governance — app-specific electron/main.js, preload.js, platform targets, key dependencies
- **§ 15**: Capacitor & Mobile Build Governance — iOS/Android scripts, environment routing, key dependencies
- **§ 16**: WASM & AI Engine Governance — AssemblyScript, build pipeline, worker integration, anti-orphan-script policy
- **§ 17**: Responsive Design & Mobile-First Patterns — 5-tier device architecture, CSS media queries, content density
- **§ 18**: Scale-Aware AI Orchestration — three-tier decision tree, implementation structure, performance targets
- **§ 19**: Input Controls & Action-Based Architecture — semantic actions, context-aware behavior, platform-specific requirements
- **§ 20**: Build & Deployment Governance — script routing, output directories, cleanup, quality gates
- **§ 21**: Detailed Project Structure & File Organization Governance — UI atomic design hierarchy (atoms/molecules/organisms), app layer organization, domain layer patterns, component file size, import validation, asset organization, type definitions, testing organization, checklists
- **§ 22**: Project Build & Dependency Governance — 4 runtime deps, 34 dev deps (organized by category with official docs), 38 build scripts with shell routing, configuration file rules, linting/quality config, dependency update policy, guardrails
- **§ 23**: Accessibility Governance (WCAG 2.1 AA) — keyboard navigation, semantics, contrast, and verification
- **§ 24**: Security Governance — XSS prevention, input validation, secret handling, secure runtime defaults
- **§ 25**: Performance & Web Vitals Governance — profiling-first optimization, responsiveness, and bundle awareness
- **§ 26**: Error Handling & Recovery Governance — boundaries, call-site handling, classification, and recovery UX
- **§ 27**: Mobile Gesture Governance — semantic-action touch patterns, thresholds, and haptic guardrails

---

## Language Guardrails

Approved languages: HTML, CSS, JavaScript, TypeScript, AssemblyScript, WebAssembly.
Do not introduce orphaned helper scripts or alternate runtimes.

---

## Behavioral Rules

1. **Minimal change** — modify only what was requested.
2. **Preserve style** — match existing conventions.
3. **Cite governance** — name the rule and suggest alternatives.
4. **No new top-level directories** without explicit instruction.
5. **Use existing scripts** from `package.json` before inventing CLI commands.

## Project Identity Rule

- Preserve project identity. Never rename the project or product to a framework, runtime, or tool name; treat that as forbidden.

## Input & UI Consistency

- Use shared keyboard controller hooks in `src/app` rather than per-component keydown listeners.
- Maintain standard application shell surfaces (splash, landing, main content, results/history) as detailed in `AGENTS.md` § 11.

## Input Controls Directive (Mandatory)

- All input work must follow `.github/instructions/08-input-controls.instructions.md`.
- Input implementations must remain semantic-action-driven, platform-aware, text-input-safe, and TV-focus-compliant.
- `useKeyboardControls` is a keyboard adapter only; broader orchestration belongs in higher-level app hooks.

## Testing Standards (Mandatory)

All test files MUST follow strict naming convention and validation:

**File Naming Pattern** (STRICTLY ENFORCED):

- Unit/integration/component/api: `<feature-name>.<type>.test.ts`
- E2E/a11y/visual: `<feature-name>.<type>.spec.ts`
- Valid types: `unit`, `integration`, `component`, `api`, `e2e`, `a11y`, `visual`, `perf`

**Examples**:

- ✅ `auth.unit.test.ts` — Authentication utilities unit test
- ✅ `button.component.test.tsx` — Button component test
- ✅ `checkout.e2e.spec.ts` — Checkout flow E2E test
- ✅ `keyboard-nav.a11y.spec.ts` — Keyboard navigation accessibility test

**Invalid** (will fail validation):

- ❌ `test.auth.ts` — Feature NOT first
- ❌ `unit.auth.test.ts` — Type NOT second
- ❌ `auth.spec.ts` — Missing type
- ❌ `test.ts` — No feature name

**What You Must Do**:

1. Name test files using approved pattern (see examples above)
2. Validate before committing: `pnpm test:names --verbose`
3. Ensure test runs with correct framework:
   - Vitest: `pnpm test` (unit/integration/component/api)
   - Playwright: `pnpm test:e2e` (e2e/a11y/visual)
4. Do NOT mix frameworks in same file (create separate files)
5. Ask user which test type if unclear (unit vs integration vs e2e)

**What You MUST NOT Do**:

- ❌ Create `test.ts` or `generic.spec.ts` files without feature name
- ❌ Mix Vitest and Playwright in same file
- ❌ Skip test naming validation before suggesting code
- ❌ Create generic test names (use descriptive feature names)
- ❌ Ignore `pnpm test:names` validation failures

**Validation & Enforcement**:

- `pnpm test:names` — Validates all test filenames (runs in `pnpm validate`)
- `pnpm validate` — Full gate: lint + typecheck + test:names + build
- Failures block merge; must be fixed before commit

**Reference Documents**:

- Comprehensive rules: `.github/instructions/17-testing.instructions.md`
- Quick start: `docs/CONTRIBUTING_TESTS.md`
- Full reference: `docs/TEST_NAMING_CONVENTION.md`

**Governance Authority**: AGENTS.md § 28 (Testing Governance)

---

## Self-Check Checklist (Before Every Task)

- [ ] Am I using `pnpm` (not npm/npx/yarn)?
- [ ] Does my import respect layer boundaries in Architecture section?
- [ ] Am I using path aliases, not relative cross-layer imports?
- [ ] Am I targeting the correct shell per Shell Routing?
- [ ] Am I using an approved language per Language Guardrails?
- [ ] Am I avoiding orphaned scripts?
- [ ] Am I modifying only what was requested?
- [ ] Does my output match an existing `package.json` script where applicable?
- [ ] If creating tests: do filenames follow `<feature>.<type>.test.ts` pattern? ✅ NEW
- [ ] If creating tests: are test types valid (unit/integration/component/api/e2e/a11y/visual)? ✅ NEW

## Input Controls Agent Checklist

- [ ] Use semantic actions as the primary integration surface.
- [ ] Preserve text-input safety and chat/input focus behavior.
- [ ] Keep `useKeyboardControls` as an adapter, not orchestration.
- [ ] Ensure mappings remain unsurprising across Desktop/Web/Mobile/TV.
