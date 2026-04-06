# Frontend Instructions — React / Vite / UI

> **Scope**: Frontend stack, CLEAN architecture layers, component hierarchy, styling, linting, formatting, and type checking.
> Subordinate to `AGENTS.md` §0 (Non-Negotiable Rules), §3 (architecture), and §4 (path discipline).
> **BASELINE** — Before creating UI components, read `AGENTS.md` § 0 for non-negotiable AI rules. Reuse before creation. Minimal edits. Quality gates mandatory.

---

## Stack

| Technology  | Version | Purpose                                                                  |
| ----------- | ------- | ------------------------------------------------------------------------ |
| React       | 19      | UI library (hooks, memo, lazy, context)                                  |
| TypeScript  | 5.9     | Static type checking (strict mode)                                       |
| Vite        | 7       | Build tool + dev server                                                  |
| ESLint      | 10      | Linting (flat config + `react`, `react-hooks`, `boundaries`, `prettier`) |
| Prettier    | 3       | Code formatting                                                          |
| CSS Modules | —       | Scoped component styling                                                 |

---

## Architecture — CLEAN Layers

| Layer       | Path           | May Import               | Must Not Import                     |
| ----------- | -------------- | ------------------------ | ----------------------------------- |
| **Domain**  | `src/domain/`  | `domain/` only           | `app/`, `ui/`, React, any framework |
| **App**     | `src/app/`     | `domain/`, `app/`        | `ui/`                               |
| **UI**      | `src/ui/`      | `domain/`, `app/`, `ui/` | —                                   |
| **Workers** | `src/workers/` | `domain/` only           | `app/`, `ui/`, React                |
| **Themes**  | `src/themes/`  | nothing (pure CSS)       | everything                          |

Boundaries are enforced at lint time by `eslint-plugin-boundaries` (see `eslint.config.js`).

### Domain Layer (`src/domain/`)

- Pure, framework-agnostic game logic. Zero React dependencies.
- Files: `types.ts`, `constants.ts`, `board.ts`, `rules.ts`, `ai.ts`, `themes.ts`, `layers.ts`, `sprites.ts`.
- All exported through barrel `src/domain/index.ts`.

### App Layer (`src/app/`)

- React hooks, context providers, and services.
- Files: `useTheme.ts`, `useSoundEffects.ts`, `ThemeContext.tsx`, `SoundContext.tsx`, `sounds.ts`, `haptics.ts`, `storageService.ts`.
- All exported through barrel `src/app/index.ts`.

### UI Layer (`src/ui/`)

- Presentational React components following Atomic Design.
- `atoms/` → smallest reusable primitives (e.g., `ErrorBoundary.tsx`).
- `molecules/` → composed atom groups.
- `organisms/` → full feature components (e.g., `App.tsx`).
- `utils/` → UI utilities (e.g., `cssModules.ts` for `cx()` class binding).
- All exported through barrel `src/ui/index.ts`.

---

## Component Hierarchy (Atomic Design)

atoms/ → molecules/ → organisms/

- Data flows unidirectionally: **Hooks → Organism → Molecules → Atoms**.
- Components are predictable, composable, and reusable across contexts.

---

## Import Conventions

- **Path aliases**: `@/domain/...`, `@/app/...`, `@/ui/...`.
- **Barrel imports**: Always import from `index.ts`, never from internal module files.
- **No cross-layer relative imports**: Never use `../../` to cross layer boundaries.

---

## Entry Point

`src/index.tsx` wires the provider tree:

ThemeProvider > SoundProvider > ErrorBoundary > App

---

## Styling

- Global styles and CSS custom properties in `src/styles.css`.
- Theme files in `src/themes/` — lazy-loaded CSS chunks (pure data, no imports).
- Component-scoped styles via CSS Modules.
- UI layout constants in `src/ui/ui-constants.ts`.

### Mandatory Gameplay Surface Layout

- Game boards and game tables must remain fully visible and unobstructed during gameplay.
- Do not allow vertical page scrolling on the active gameplay surface unless scrolling is a deliberate mechanic of that game.
- Time, difficulty, and level/status indicators must render at the top of the board/table region.
- Navigation and `New Game` actions must render at the bottom of the board/table region.
- On responsive breakpoints, preserve the same semantic order: top status region -> board/table region -> bottom action region.

### CSS Performance & Rendering Optimization (MANDATORY)

**ALL CSS must respect the Critical Rendering Path (CRP) and Core Web Vitals thresholds.**

See AGENTS.md § 30 and `.github/instructions/20-css-performance-rendering-optimization.instructions.md` for complete enforcement.

**13 Super Prompts** enforce CSS optimization:
1. CRP respect (HTML → CSS blocked → JS → Paint)
2. Render-blocking CSS minimization
3. Critical CSS strategy (inline <14KB above-fold; defer non-critical)
4. CSS size optimization (minify + clean unused)
5. Non-blocking CSS loading (defer non-critical after FCP)
6. HEAD optimization (critical resources only)
7. Layout/reflow/paint (transform/opacity animations only)
8. CLS prevention (reserve space for images <0.1 shift)
9. Font performance (font-display: swap, preload LCP font)
10. CSS architecture (BEM naming, split by feature)
11. Resource prioritization (LCP ≤2.5s)
12. Validation + tooling (Lighthouse ≥90, DevTools Coverage >80%)
13. Core Web Vitals (FCP <1.8s, LCP <2.5s, CLS <0.1)

**Mandatory Enforcement**:
- Lighthouse score ≥90 (target) or ≥80 (minimum)
- LCP ≤2.5s, FCP <1.8s, CLS <0.1
- CSS critical path <50KB
- DevTools Coverage >80% CSS used
- No render-blocking CSS beyond critical path
- No parser-blocking JS in `<head>`
- All animations use transform/opacity only (no layout-triggering properties)
- Font loading optimized (font-display: swap, not blocking text)

**Quality Gate** (`pnpm validate`):
- Runs Lighthouse audit
- Validates Core Web Vitals thresholds
- Fails if Lighthouse <80 or metrics exceed thresholds

**Before committing CSS changes**:
```bash
# 1. Run local Lighthouse
npx lighthouse <url> --view

# 2. Open DevTools
#    - Network: Verify critical.css downloads first
#    - Coverage: CSS % used > 80%
#    - Performance: No layout thrashing

# 3. Run quality gate
pnpm validate

# 4. Commit only after ✅ all checks pass
```

---

## Quality Workflow

**Default Shell: Bash (WSL: Ubuntu)**

All commands run in **Bash (WSL: Ubuntu)** (default shell per `AGENTS.md` §5).

PowerShell is opt-in only and must never be assumed as the default, even on Windows machines. See `AGENTS.md` §5 (Cross-platform Shell Governance) for complete shell routing rules.

pnpm lint, pnpm lint:fix, pnpm format, pnpm format:check, pnpm typecheck, pnpm check, pnpm fix, pnpm validate.

Run `pnpm validate` before pushing.

---

## Language Guardrails

Frontend code uses **TypeScript** for logic and **CSS** for styling.
Do not introduce orphaned helper scripts or alternate runtimes.
Prefer existing `package.json` scripts and repository-native tooling (Vite, ESLint, Prettier).
Modern ESM syntax; match existing code conventions.
