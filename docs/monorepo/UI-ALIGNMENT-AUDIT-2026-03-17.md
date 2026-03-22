# Cross-App UI Alignment Audit — 2026-03-17

## Scope
Audit target: `apps/*/src/ui` across all app projects.

Goals evaluated:
- Look/feel consistency signals (themes, menu/settings patterns)
- Coding standards consistency (atomic structure, CSS module usage, barrel patterns)
- Naming and semantic consistency (component names, tier placement)
- Consolidation opportunities into shared packages (`packages/common` and related)

## Method
This audit used repository-wide filesystem and duplicate-content analysis:
- Per-app component tier counts (`atoms`, `molecules`, `organisms`)
- Repeated component name analysis across all apps
- Exact duplicate detection via SHA1 hashes on `apps/*/src/ui/*`
- CSS style pattern checks (`*.module.css` vs plain `*.css`)
- Presence checks for menu/settings component families

## Executive Summary
- **Structure baseline is strong**: all apps retain `src/ui/index.ts` + `src/ui/ui-constants.ts` and atomic tier folders.
- **High-value dedupe opportunity exists now**: several components are identical across 20+ apps and should be centralized immediately.
- **Naming/semantics are inconsistent** in some projects (`Hud` vs `HUD`, `Scoreboard` vs `ScoreBoard`, mixed `SettingsModal`/`SettingsOverlay`), which hurts maintainability.
- **Look/feel parity is partially mature**: themes are mostly standardized (7 files across most apps), but menu/settings UX is uneven.

## Baseline Findings

### 1) Atomic Structure Coverage
Per-app tier footprint shows large variance in UI complexity:
- Minimal: `monchola` (`atoms=2`, `molecules=1`, `organisms=2`)
- Mid: many apps in `atoms=4-6`, `molecules=1-2`, `organisms=4`
- Rich: `nim` (`17/18/9`), `tictactoe` (`21/23/6`), `mancala` (`4/5/15`)

Interpretation:
- Core architecture is present everywhere.
- Component richness and UX depth vary significantly by app maturity.

### 2) Exact Duplicate Components (Best Commonization Candidates)
Top exact-duplicate groups in `apps/*/src/ui`:
- `OfflineIndicator.module.css` — identical in **24 apps**
- `OfflineIndicator.tsx` — identical in **23 apps**
- `ErrorBoundary.module.css` — identical in **22 apps**
- `ErrorBoundary.tsx` (atoms variant) — identical in **21 apps**
- `ui/utils/index.ts` identical in **20 apps**
- `ui-constants.ts` identical in **16 apps**
- `PileToggle.tsx` identical in **8 apps** (nim-family)
- `NimObject.tsx` identical in **8 apps** (nim-family)

Interpretation:
- There is immediate, low-risk consolidation value.
- Some shared-component migration already exists in places; it should be completed uniformly.

### 3) Naming and Semantic Drift
Observed naming inconsistencies:
- `Scoreboard.tsx` vs `ScoreBoard.tsx`
- `Hud.tsx` vs `HUD.tsx`
- `SettingsModal.tsx` vs `SettingsOverlay.tsx`
- `Landing.tsx` vs `LandingPage.tsx`
- Multiple components named `App.tsx` in organisms (expected), but varying responsibility split (sometimes shell-level, sometimes full feature-level)

Observed semantic/tier drift:
- `ErrorBoundary.tsx` appears as both atom and organism in different apps.
- Menu/settings entry point patterns vary widely between otherwise similar game apps.

### 4) CSS Standard Consistency
- Most apps use CSS Modules in `src/ui` consistently.
- Outliers:
  - `lights-out`: plain CSS in UI (`plain=2`)
  - `rock-paper-scissors`: plain CSS in UI (`plain=5`)

Interpretation:
- Converting these outlier UI styles to CSS Modules would improve consistency and reduce style leakage risk.

### 5) Look & Feel Consistency Signals
Theme file baseline:
- Most apps: **7 shared theme files**
- `mancala` and `snake`: **8** theme files (extra variants)

Menu/settings pattern coverage:
- Fuller menu/settings stack present in a subset (`battleship`, `nim`, `tictactoe`, partial in `snake`, `lights-out`, `minesweeper`)
- Many apps still have minimal/no hamburger + settings surface pattern

Interpretation:
- Visual token baseline is healthy.
- UX surface parity (menus/settings/overlays) is still fragmented.

## Recommended Alignment Plan

### Phase 1 — Immediate, Low-Risk Commonization (No UX Change)
Move exact duplicates to shared package and replace imports:
1. `OfflineIndicator.tsx` + `OfflineIndicator.module.css`
2. `ErrorBoundary.tsx` + `ErrorBoundary.module.css` (split atom/organism variants intentionally)
3. `ui-constants.ts` re-export unification
4. `ui/utils/index.ts` + `cx` helper unification

Target location:
- Prefer extending `packages/common/src/ui` for shared atoms/molecules.

Success criteria:
- Zero visual/behavior changes
- Smaller per-app UI surface area
- Reduced duplicate file count by >30% in first pass

### Phase 2 — Family-Level Consolidation
Create game-family shared components for heavily repeated but domain-shaped components:
- Nim-family shared set:
  - `NimObject.tsx`
  - `PileToggle.tsx`
- Overlay/menu family shared set:
  - `HamburgerMenu.tsx`
  - base `SettingsOverlay` contract component

Success criteria:
- Family apps import same shared components
- Only app-specific styling/labels remain local

### Phase 3 — Naming and Semantic Normalization
Adopt canonical names and tier placement rules:
- `HUD` (choose one: `Hud` or `HUD` and enforce)
- `Scoreboard` (single spelling/casing)
- `SettingsOverlay` vs `SettingsModal` (choose one semantic distinction and enforce)
- `Landing` vs `LandingPage` (choose one)
- `ErrorBoundary` placement policy (atom-only + wrapper usage pattern, or dual with clear rule)

Success criteria:
- Naming lint/profile checklist passes across all apps
- No duplicate semantic components with divergent names

### Phase 4 — UX Parity & Aesthetic Harmonization
Standardize look/feel patterns across app shells:
- Common top-level menu/settings interaction model
- Shared spacing/typography scale by responsive tier
- Shared motion/transition tokens and touch-safe hover fallbacks

Success criteria:
- Visual QA rubric passes on all apps
- Equivalent UX affordances across game projects

## Priority Commonization Backlog (Ranked)
1. `OfflineIndicator` (24/23 duplicates) — **P0**
2. `ErrorBoundary` + css (22/21 duplicates) — **P0**
3. `ui-constants.ts` (16 duplicates) — **P1**
4. Nim-family `NimObject` + `PileToggle` (8 duplicates each) — **P1**
5. Menu/settings primitives (`HamburgerMenu`) — **P1/P2**
6. CSS Module conversion for outlier apps — **P2**
7. Naming normalization sweep — **P2**

## Risks and Guardrails
- Do not merge components with hidden behavior differences without snapshot + interaction tests.
- Preserve CLEAN layer boundaries (`domain` remains framework-agnostic; UI imports through app/domain barrels).
- Prefer additive migration with adapters to avoid broad breakage.
- Keep per-app visual identity where intended; standardize mechanics and semantics first.

## Suggested Next Execution Step
Start with a dedicated PR that centralizes only **exact duplicate** UI primitives (`OfflineIndicator`, `ErrorBoundary`) into `packages/common` and updates imports across all apps, with no style or behavior changes.
