# Sprint 3 Implementation Plan — Advanced Board Systems & Governance

**Status**: 📋 READY FOR IMPLEMENTATION  
**Duration**: Weeks 5–8  
**Deliverables**: 7 major components (board matrix, game families, compliance, CI/CD, shared systems, Electron, Performance)

---

## Overview

Sprint 3 builds on the architecture established in Sprint 1–2 by adding:
1. **Advanced Board Systems** — Extensible tile + board matrix for all grid-based games
2. **Game Family Architecture** — Sudoku, Checkers, Chess, Queens pattern templates
3. **Compliance Tracking System** — Dashboard + matrix for quality gate management
4. **CI/CD Pipeline** — Automated testing, linting, type checking, build validation
5. **Shared Systems** — Theme, keyboard, accessibility, animation reuse
6. **Electron & Capacitor** — Desktop and mobile platform support
7. **Performance Optimization** — Profiling, bundling, lazy-loading, caching

---

## Phase 1: Advanced Board Systems (WEEKS 5–5.5)

### 1.1 Extensible Tile Component

**Location**: `packages/ui-tile-system/`

**Responsibility**:
- Polymorphic content rendering (icons, numbers, text, badges, overlays)
- State management (selected, focused, disabled, locked, highlighted, conflicted, hinted)
- Responsive sizing (fits 5 device tiers)
- Accessibility (aria-labels, keyboard, focus trap)
- Theme-driven styling (no hardcoded colors)
- Animation support (spring transitions, state changes)

**Deliverables**:
- `Tile.tsx` (core component, 200–250 lines)
- `Tile.module.css` (responsive, breakpoint-aware)
- `useTileState.ts` (state management hook, 150 lines)
- `useTileAccessibility.ts` (a11y helpers, 100 lines)
- `tileTypes.ts` (type definitions: TileContent, TileState, TileVariant)
- `tileVariants.ts` (content modes: icon, number, text, chess-like piece)
- `index.ts` (barrel export)

**Tests**: `Tile.test.tsx`, `useTileState.test.ts`, `useTileAccessibility.test.ts`

**Integration Points**:
- `@/ui/molecules` (compose into board rows)
- `@/domain/responsive` (responsive sizing)
- `@/theme` (theme tokens)
- `@/packages/ui-utils` (aria helpers)

---

### 1.2 Board Grid System

**Location**: `packages/ui-board-core/`

**Responsibility**:
- Matrix layout (NxM grid, flexible sizes)
- Tile positioning (row, col, index)
- Keyboard navigation (arrow keys, enter, escape)
- Focus management (trap, restore, move)
- Overlay system (highlights, candidates, hints, conflicts)
- Responsive constraints (max-width, aspect ratio per device tier)

**Deliverables**:
- `BoardGrid.tsx` (core component, 250–300 lines)
- `BoardGrid.module.css` (grid layout, responsive)
- `useBoardKeyboard.ts` (navigation hook, 180 lines)
- `useBoardFocus.ts` (focus management, 150 lines)
- `useBoardOverlays.ts` (highlight layers, 200 lines)
- `boardTypes.ts` (BoardDimensions, BoardState, CellPosition, Overlay)
- `index.ts` (barrel)

**Tests**: `BoardGrid.test.tsx`, `useBoardKeyboard.test.ts`, `useBoardFocus.test.ts`

**Integration Points**:
- `Tile` component (child tile rendering)
- `@/domain/responsive` (adaptive scaling)
- `@/app` input hooks (keyboard coordination)
- `@/theme` (board styling tokens)

---

### 1.3 Coordination Layer

**Location**: `packages/ui-board-core/` (within)

**Deliverables**:
- `useBoardCoordination.ts` (orchestrates tile + grid interactions, 250 lines)
- `BoardContext.tsx` (provides board state + actions to children)
- `useBoardContext.ts` (consumer hook)

---

### 1.4 Test & Documentation

**Deliverables**:
- `BOARD-SYSTEM-GUIDE.md` (usage patterns, examples for 5 game families)
- `TILE-CONTENT-MODELS.md` (how to extend content rendering)
- Storybook stories: Tile, BoardGrid, overlay systems

---

## Phase 2: Game Family Architecture (WEEKS 5.5–6)

### 2.1 Sudoku Family

**Location**: `packages/sudoku-core/`, `packages/sudoku-ui-core/`

**Subdomain Structure**:

```
packages/sudoku-core/
├── index.ts                         # Barrel
├── types.ts                         # SudokuBoard, Move, Constraint, etc.
├── constants.ts                     # BOARD_SIZE, GRID_SIZE, etc.
├── generators/
│   ├── index.ts
│   ├── generate.ts                  # Create valid Sudoku boards
│   └── difficulty.ts                # Difficulty scaling
├── validators/
│   ├── index.ts
│   ├── moveLegality.ts              # Is move legal?
│   ├── conflicts.ts                 # Highlight conflicts + duplicates
│   └── constraints.ts               # Apply Sudoku constraints
├── solvers/
│   ├── index.ts
│   ├── backtracking.ts              # Backtracking solver
│   └── heuristics.ts                # Choice heuristics (MRV, etc.)
└── transformations/
    ├── index.ts
    ├── fromFlat.ts                  # Flatten/unflatten boards
    └── serialize.ts                 # Persist/restore

packages/sudoku-ui-core/
├── index.ts
├── SudokuBoard.tsx                  # Game board organism
├── useSudokuGame.ts                 # Game logic hook (200 lines)
├── useSudokuDifficulty.ts           # Difficulty management
├── SudokuBoard.module.css
└── SudokuBoard.types.ts
```

**Deliverables**:
- Generator (create valid boards, 150 lines)
- Validator (check legality + conflicts, 180 lines)
- Solver (backtracking, 200 lines)
- Game logic hook (200 lines)
- Documentation: `SUDOKU-FAMILY-GUIDE.md`

---

### 2.2 Board Game Families (Chess, Checkers, Queens)

**Location**: `packages/[game-family]-core/`

**Chess/Checkers Pattern**:

```
packages/chess-core/
├── types.ts                         # PieceType, Position, Move
├── constants.ts                     # STARTPOS, piece weights
├── rules/
│   ├── index.ts
│   ├── isLegalMove.ts
│   ├── validMoves.ts
│   └── checkDetection.ts
├── board/
│   ├── createBoard.ts
│   ├── applyMove.ts
│   └── boardToFen.ts                # Forsyth-Edwards Notation
└── ai/
    ├── minimax.ts
    └── evaluator.ts

packages/chess-ui-core/
├── ChessBoard.tsx                   # 8x8 board with pieces
├── usePieceSelection.ts             # Click/drag selection
├── useChessGame.ts                  # Game orchestration
└── PieceRenderer.tsx                # SVG piece rendering
```

**Deliverables**:
- Rules engine (100 lines per game)
- Board state management (150 lines)
- Piece rendering component (100 lines)
- AI engine (150 lines for basic minimax)
- UI integration hooks (100–150 lines each)
- Documentation: `BOARD-GAME-FAMILIES-GUIDE.md`

---

### 2.3 N-Queens & Constraint Solver

**Location**: `packages/constraint-solver/`

**Deliverables**:
- Constraint registry (extensible)
- Backtracking solver (generic)
- N-Queens specific constraints
- Board visualization for constraint problems
- Documentation

---

## Phase 3: Compliance & Dashboard System (WEEKS 6–6.5)

### 3.1 Compliance Matrix Schema

**Location**: `compliance/schema.json` + `compliance/README.md`

**Structure**:

```json
{
  "version": "1.0",
  "generated": "2025-01-24",
  "games": [
    {
      "id": "sudoku",
      "name": "Sudoku Classic",
      "family": "sudoku",
      "status": "green|amber|red",
      "categories": {
        "features": [
          {
            "id": "core-gameplay",
            "description": "Core Sudoku puzzle solving",
            "status": "green",
            "lastUpdated": "2025-01-24"
          },
          {
            "id": "undo-redo",
            "description": "Undo/redo functionality",
            "status": "amber",
            "notes": "In progress"
          }
        ],
        "quality": [
          {
            "id": "keyboard-nav",
            "description": "Full keyboard navigation",
            "status": "green"
          },
          {
            "id": "error-handling",
            "description": "Graceful error recovery",
            "status": "amber"
          }
        ],
        "accessibility": [
          {
            "id": "wcag-aa",
            "description": "WCAG 2.1 AA compliance",
            "status": "green"
          }
        ],
        "platform": [
          {
            "id": "web",
            "description": "Web platform support",
            "status": "green"
          },
          {
            "id": "electron",
            "description": "Electron desktop support",
            "status": "amber"
          },
          {
            "id": "capacitor",
            "description": "Mobile iOS/Android",
            "status": "red"
          }
        ]
      }
    }
  ]
}
```

**Update Script**: `compliance/update-matrix.mjs` (read from app, update schema)

---

### 3.2 Dashboard Implementation

**Location**: `compliance/dashboard.html` + `compliance/dashboard.js`

**Features**:
- Game list with RAG status
- Category breakdown per game
- Trend history (last 30 days)
- Filtering (game, family, category, status)
- Export to JSON/CSV
- Real-time updates via CI/CD webhook

**Deliverables**:
- HTML (responsive, dark theme, 200 lines)
- JavaScript (data filtering, charts, 300 lines)
- CSS (responsive, accessible, 150 lines)
- Update automation (via CI/CD)
- Documentation: `DASHBOARD-GUIDE.md`

---

### 3.3 Compliance Tracking in App

**Location**: `src/domain/compliance.ts` (in each app)

**Deliverables**:
- `complianceMetadata.ts` (export game metadata)
- CI/CD integration (read all complianceMetadata.ts files)
- Matrix generation script (aggregate all apps)
- Dashboard auto-update

---

## Phase 4: CI/CD Pipeline (WEEKS 6.5–7)

### 4.1 GitHub Actions Workflows

**Deliverables**:
1. `quality-gates.yml` ✅ (already created)
   - Quick gate (fail-fast)
   - Full gate (ESLint)
   - TypeScript
   - Format check
   - Build

2. `compliance-matrix.yml` (new)
   - Generate matrix from all apps
   - Update dashboard
   - Report to PR

3. `performance.yml` (new)
   - Bundle analysis
   - Report size changes
   - Alert on regressions

4. `integration.yml` (new)
   - Cross-app integration tests
   - Platform-specific tests (Electron, Capacitor)

---

### 4.2 Local Developer Tools

**Deliverables**:
- `pnpm lint:gate:full` script (uses ESLint config)
- `pnpm lint:scope:[game]` (per-game scoped lint)
- `pnpm validate` (check + build)
- `pnpm report:all` (compliance + performance)
- Pre-commit hooks (via husky)

---

## Phase 5: Shared Systems Consolidation (WEEKS 7–7.5)

### 5.1 Theme System Expansion

**Location**: `packages/theme-contract/`

**Additions**:
- Board/tile design tokens
- Game-family specific color palettes
- Animation/motion tokens
- Dark mode transitions
- High-contrast mode support

**Deliverables**:
- `themeTokens.ts` (extended token set)
- `useBoardTheme.ts` (board-specific theming)
- `useGameFamilyTheme.ts` (family-specific palettes)
- Theme examples for 5 game families

---

### 5.2 Input Controls Consolidation

**Location**: `packages/input-controls-shared/`

**Consolidation**:
- Unify keyboard navigation patterns
- Standardize game-specific actions
- Reusable action mappings
- Platform-aware fallbacks

**Deliverables**:
- `useGameControls.ts` (game + menu context)
- `actionMappings.ts` (per game family)
- `inputValidator.ts` (text-entry safety)
- Documentation

---

### 5.3 Accessibility & Animation Packages

**Deliverables**:
- `packages/a11y-core/` (WCAG helpers, patterns)
- `packages/animation-spring/` (reusable spring animations)
- Both shared across all games

---

## Phase 6: Electron & Capacitor (WEEKS 7.5–8)

### 6.1 Electron Enhanced Setup

**Deliverables**:
- Multi-window support (splash + main game window)
- Native menu integration
- IPC communication patterns
- Saved state + recovery
- Auto-update infrastructure

---

### 6.2 Capacitor Mobile Integration

**Deliverables**:
- iOS + Android builds
- Safe area handling (notches, home indicators)
- Touch gestures (swipe, long-press, pinch)
- Native camera/share APIs
- Mobile-first responsive layout

---

## Phase 7: Performance Optimization (WEEKS 8)

### 7.1 Bundle Analysis

**Deliverables**:
- `pnpm analyze:bundle` script
- Rollup plugin for visualization
- Regressions detected in CI/CD
- Per-game budget enforcement

---

### 7.2 Code Splitting

**Deliverables**:
- Game async routes
- Shared module chunking
- Lazy theme loading
- Dynamic rule loading

---

### 7.3 Rendering Optimization

**Deliverables**:
- Board rerender optimization
- Tile memoization
- Overlay batch updates
- Canvas rendering for large boards

---

## Implementation Order

**Week 5**:
1. Tile component system (3 days)
2. Board grid system (2 days)
3. Integration testing (2 days)

**Week 5.5**:
4. Sudoku family (2 days)
5. Board game families (1.5 days)

**Week 6**:
6. Compliance matrix (2 days)
7. Dashboard (1.5 days)
8. App metadata (1 day)

**Week 6.5**:
9. GitHub Actions workflows (2 days)
10. Local developer tools (1 day)

**Week 7**:
11. Theme consolidation (1.5 days)
12. Input controls consolidation (1.5 days)
13. A11y + animation packages (1 day)

**Week 7.5**:
14. Electron multi-window (1 day)
15. Capacitor mobile (1.5 days)

**Week 8**:
16. Bundle analysis (1 day)
17. Code splitting (1 day)
18. Rendering optimization (1 day)

---

## Success Criteria

✅ **Board System**:
- Tile component renders correctly at 5 breakpoints
- Board grid handles NxM sizes
- Keyboard navigation works for all tiles
- Accessibility tested (WCAG AA)

✅ **Game Families**:
- Sudoku generator creates valid puzzles
- Chess/Checkers rules enforced
- N-Queens solver works
- All family-specific components render

✅ **Compliance**:
- Matrix updates automatically
- Dashboard reflects all apps
- CI/CD validates matrix
- Trend history tracked

✅ **CI/CD**:
- All workflows passing
- ESLint gates enforced
- No regressions allowed
- Build artifacts created

✅ **Shared Systems**:
- Theme tokens cover all game families
- Input controls unified
- A11y patterns consistent
- Animation library reusable

✅ **Platforms**:
- Electron windows managed
- Capacitor builds for iOS/Android
- Platform-specific optimizations applied

✅ **Performance**:
- Bundle size tracked
- No regressions > 5%
- LCP, FID, CLS within targets
- Code splitting effective

---

## Documentation Deliverables

1. `BOARD-SYSTEM-GUIDE.md` (usage + examples)
2. `TILE-CONTENT-MODELS.md` (extensibility)
3. `SUDOKU-FAMILY-GUIDE.md` (patterns)
4. `BOARD-GAME-FAMILIES-GUIDE.md` (chess, checkers, queens)
5. `COMPLIANCE-SYSTEM-GUIDE.md` (matrix + dashboard)
6. `CI-CD-REFERENCE.md` (workflows + local tools)
7. `SHARED-SYSTEMS-REFERENCE.md` (theme, input, a11y, animation)
8. `PERFORMANCE-GUIDE.md` (profiling, optimization, budgets)

---

## Risk Mitigation

**Risk**: Board system complexity  
**Mitigation**: Start with Sudoku (simplest grid), expand to others

**Risk**: Game families too varied  
**Mitigation**: Identify common patterns first, use composition

**Risk**: Compliance tracking maintenance overhead  
**Mitigation**: Fully automate matrix generation via CI/CD

**Risk**: CI/CD pipeline slowness  
**Mitigation**: Parallelize stages, fail-fast quick gate

**Risk**: Performance regressions  
**Mitigation**: Automated bundle analysis, per-app budgets

---

## Rollback Plan

If any phase fails critical tests:
1. Revert to previous commit
2. Identify root cause via CI/CD logs
3. Create focused fix branch
4. Re-run phase with fixes
5. Merge once all criteria met

---

**SPRINT 3 READY FOR KICKOFF** 🚀
