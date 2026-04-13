# 🚀 Bingo Apps Decomposition - Tactical Execution Checklist

**Date**: April 3, 2026  
**Updated**: April 13, 2026  
**Purpose**: Step-by-step task breakdown for implementing component extraction and WASM  
**Target**: 6-week delivery timeline  
**Platform Status**: 52 apps with 8+ bingo variants (plus variants like pattern-bingo, power-bingo, speed-bingo)

---

## 📋 PHASE 1: Component Extraction (Weeks 1-3)

### Week 1: Package Setup & Initial Extraction

#### Task 1.1: Create `@games/bingo-ui-components` Package
- [ ] Create directory: `packages/bingo-ui-components/`
- [ ] Create `package.json` with dependencies on:
  - [ ] `@games/bingo-core`
  - [ ] `@games/ui-board-core`
  - [ ] React 19.x
  - [ ] TypeScript 5.9
- [ ] Create `tsconfig.json` (extend root)
- [ ] Create `README.md` with public API
- [ ] Create `src/index.ts` (barrel file - initially empty)
- [ ] Create `.eslintrc` and `.prettierrc` symlinks (or references)
- [ ] Add to root `pnpm-workspace.yaml`

**Owner**: @scott  
**Time**: 1-2 hours  
**Validation**: `pnpm install && pnpm --filter @games/bingo-ui-components typecheck`

---

#### Task 1.2: Extract BingoCard Component (Advanced Version)

**Source**: `apps/bingo/src/ui/organisms/BingoCard.tsx` + `.module.css`

**Action**:
```bash
# Copy advanced version from bingo
cp apps/bingo/src/ui/organisms/BingoCard.tsx \
   packages/bingo-ui-components/src/BingoCard/BingoCard.tsx

cp apps/bingo/src/ui/organisms/BingoCard.module.css \
   packages/bingo-ui-components/src/BingoCard/BingoCard.module.css
```

**Steps**:
- [ ] Copy `/src/BingoCard.tsx` to new package
- [ ] Copy `/src/BingoCard.module.css` with all styles
- [ ] Create `/src/BingoCard/index.ts` barrel export
- [ ] Create `/src/types/BingoCardProps.ts` (extract interface)
- [ ] Update imports: `@/domain` → `@games/bingo-core`
- [ ] Validate: No breaking imports remain
- [ ] Add JSDoc comments to component
- [ ] Create unit test stub: `BingoCard.test.tsx`

**Owner**: @dev1  
**Time**: 2-3 hours  
**Testing**: 
```bash
pnpm --filter @games/bingo-ui-components typecheck
# Verify imports resolve correctly
```

---

#### Task 1.3: Extract DrawPanel Component

**Source**: `apps/bingo/src/ui/organisms/DrawPanel.tsx` + `.module.css`

**Steps**:
- [ ] Copy DrawPanel.tsx to `packages/bingo-ui-components/src/DrawPanel/`
- [ ] Copy DrawPanel.module.css
- [ ] Create index.ts barrel
- [ ] Extract DrawPanelProps interface
- [ ] Update imports to use bingo-core
- [ ] Create configuration for variant support:
  - [ ] `columnLetters` prop (true/false for BINGO columns)
  - [ ] `showStats` prop (true/false for drawn/total display)
  - [ ] `customLabels` prop for variant-specific text
- [ ] Add JSDoc
- [ ] Create test stub

**Owner**: @dev1  
**Time**: 2-3 hours  
**Complexity**: Medium (need to support both simple and advanced variants)

---

### Week 1 Subtasks - Modals (Parallel)

#### Task 1.4: Extract SettingsModal Component

**Source**: `apps/bingo/src/ui/organisms/SettingsModal.tsx` + `.module.css`

**Steps**:
- [ ] Copy to `packages/bingo-ui-components/src/SettingsModal/`
- [ ] Extract theme selection logic
- [ ] Create SettingsModalProps with:
  - [ ] `isOpen: boolean`
  - [ ] `onClose: () => void`
  - [ ] `themes: ThemeOption[]` (accept variant themes)
  - [ ] `onThemeChange: (theme: string) => void`
  - [ ] `currentTheme: string`
- [ ] Add hooks integration points (don't hardcode useTheme)
- [ ] Accessibility: Verify ARIA labels, keyboard nav
- [ ] Create test stub

**Owner**: @dev2  
**Time**: 1.5-2 hours

---

#### Task 1.5: Extract RulesModal Component

**Source**: `apps/bingo/src/ui/organisms/RulesModal.tsx` + `.module.css`

**Steps**:
- [ ] Copy to `packages/bingo-ui-components/src/RulesModal/`
- [ ] Extract content into props structure:
  ```typescript
  interface RulesModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string  // "How to Play Bingo"
    sections: RulesSection[]  // Array of sections
    patterns?: Pattern[]  // Visual pattern icons
    tips?: string[]  // Numbered tips
  }
  ```
- [ ] Create reusable `RulesSection` component
- [ ] Create `PatternIcon` sub-component
- [ ] Make content variant-agnostic (pass as props)
- [ ] Accessibility: Tab through content, focus trap
- [ ] Test stub

**Owner**: @dev2  
**Time**: 2-2.5 hours

---

#### Task 1.6: Extract AboutModal Component

**Source**: `apps/bingo/src/ui/organisms/AboutModal.tsx` + `.module.css`

**Steps**:
- [ ] Copy to `packages/bingo-ui-components/src/AboutModal/`
- [ ] Extract content into props:
  ```typescript
  interface AboutModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string  // Game title
    description: string  // Game description
    features: Feature[]  // Feature cards []
    variants: Variant[]  // Game variant list
    techStack?: string  // Optional tech description
  }
  ```
- [ ] Create reusable `FeatureCard` component
- [ ] Create `VariantList` sub-component
- [ ] Support emoji/icon in feature cards
- [ ] Responsive: Multi-column on desktop, single on mobile
- [ ] Test stub

**Owner**: @dev2  
**Time**: 2-2.5 hours

---

#### Task 1.7: Extract HamburgerMenu Component

**Source**: `apps/bingo/src/ui/organisms/HamburgerMenu.tsx` + `.module.css`

**Steps**:
- [ ] Copy to `packages/bingo-ui-components/src/HamburgerMenu/`
- [ ] Already sophisticated (portal-based, animated icon)
- [ ] Extract menu items into props:
  ```typescript
  interface MenuItemConfig {
    label: string
    icon?: string
    onClick: () => void
  }
  
  interface HamburgerMenuProps {
    items: MenuItemConfig[]  // [{ label: "Settings", onClick: ... }]
    buttonLabel?: string
    position?: 'top-right' | 'top-left'
  }
  ```
- [ ] Remove hardcoded "Settings" and "About" from component
- [ ] Make configurable for different app needs
- [ ] Verify keyboard nav (ESC to close, Tab within menu)
- [ ] Test stub

**Owner**: @dev1  
**Time**: 1.5-2 hours

---

### Week 2: Hook Extraction & Consolidation

#### Task 2.1: Extract `useBingoGame` Hook

**Source**: `apps/bingo/src/app/useGame.ts` (or equivalent in each app)

**Action**: Consolidate game state management

**Steps**:
- [ ] Analyze bingo app's useGame hook
- [ ] Create `packages/bingo-ui-components/src/hooks/useBingoGame.ts`
- [ ] Extract state management:
  ```typescript
  export function useBingoGame(variant: BingoVariant) {
    const [cards, setCards] = useState<BingoCard[]>([])
    const [drawnNumbers, setDrawnNumbers] = useState<Set<number>>([])
    const [winners, setWinners] = useState<string[]>([])
    
    const drawNumber = () => { /* ... */ }
    const markCard = (cardId, position) => { /* ... */ }
    const checkWin = () => { /* ... */ }
    
    return { cards, drawnNumbers, winners, drawNumber, markCard }
  }
  ```
- [ ] Accept variant-specific rules via:
  - [ ] `patterns: Pattern[]`
  - [ ] `numberRange: { min, max }`
  - [ ] `cardDimensions: { rows, cols }`
- [ ] Use `@games/bingo-core` for rule validation
- [ ] Create test suite for game logic

**Owner**: @dev3  
**Time**: 3-4 hours  
**Testing**: Jest unit tests for all game state transitions

---

#### Task 2.2: Extract `useBingoSettings` Hook

**Source**: Theme/settings management from all apps

**Steps**:
- [ ] Create `packages/bingo-ui-components/src/hooks/useBingoSettings.ts`
- [ ] Manage:
  ```typescript
  interface BingoSettings {
    theme: string
    soundEnabled: boolean
    soundVolume: number
    colorblindMode: boolean
    difficulty: 'easy' | 'medium' | 'hard'
  }
  ```
- [ ] Integration points:
  - [ ] LocalStorage persistence
  - [ ] Sync with ThemeContext
  - [ ] Sync with SoundContext
- [ ] Provider pattern for app-level state
- [ ] Test stub

**Owner**: @dev3  
**Time**: 2-3 hours

---

#### Task 2.3: Extract `useBingoTheme` Hook

**Source**: Theme logic from bingo app

**Steps**:
- [ ] Create `packages/bingo-ui-components/src/hooks/useBingoTheme.ts`
- [ ] Management:
  - [ ] Available themes (Classic, Dark, Ocean, Forest, etc)
  - [ ] Theme colors and CSS variables
  - [ ] Apply theme to DOM
- [ ] Return theme object for components:
  ```typescript
  {
    themeName: string
    colors: { primary, secondary, ... }
    setTheme: (name: string) => void
  }
  ```
- [ ] Support system preference detection
- [ ] Test stub

**Owner**: @dev2  
**Time**: 1.5-2 hours

---

### Week 2 Continued: CSS & Utilities

#### Task 2.4: Extract Shared CSS Variables & Animations

**Source**: Common utilities from BingoCard.module.css, DrawPanel.module.css, etc.

**Steps**:
- [ ] Create `packages/bingo-ui-components/src/styles/bingo-variables.css`
- [ ] Create `packages/bingo-ui-components/src/styles/animations.css`
- [ ] Create `packages/bingo-ui-components/src/styles/breakpoints.css`
- [ ] Consolidate:
  - [ ] Color tokens (primary, secondary, background, etc)
  - [ ] Spacing tokens (margins, padding scale)
  - [ ] Typography tokens (font sizes, weights)
  - [ ] Animation keyframes (spin, fade, bounce, slide)
  - [ ] Responsive breakpoints (xs, sm, md, lg, xl, xxl)
  - [ ] Accessibility tokens (focus outlines, high contrast)
- [ ] Create index.css that imports all
- [ ] Document in README with variable names

**Owner**: @designer  
**Time**: 2-3 hours

---

#### Task 2.5: Create Type Definitions File

**Source**: Props interfaces from extracted components

**Steps**:
- [ ] Create `packages/bingo-ui-components/src/types.ts`
- [ ] Export:
  - [ ] BingoCardProps
  - [ ] DrawPanelProps
  - [ ] SettingsModalProps
  - [ ] RulesModalProps
  - [ ] AboutModalProps
  - [ ] HamburgerMenuProps
  - [ ] BingoSettings
  - [ ] BingoVariant (from bingo-core)
- [ ] Re-export key types from @games/bingo-core
- [ ] Add JSDoc comments to each type

**Owner**: @dev1  
**Time**: 1-1.5 hours

---

### Week 3: Integration & Testing

#### Task 3.1: Create BingoAppShell Wrapper Component (Optional)

**Purpose**: Scaffold app container for all variants

**Steps**:
- [ ] Create `packages/bingo-ui-components/src/BingoAppShell.tsx`
- [ ] Provide:
  ```typescript
  interface BingoAppShellProps {
    title: string  // "Bingo", "Bingo 90", etc
    variant: BingoVariant
    children?: React.ReactNode  // Game board component
    menuItems?: MenuItemConfig[]
    onSettingsOpen: () => void
    onAboutOpen: () => void
    onRulesOpen: () => void
  }
  ```
- [ ] Structure:
  - [ ] Header with title + controls
  - [ ] HamburgerMenu
  - [ ] Children (game board)
  - [ ] Modal scaffolding (SettingsModal, AboutModal, RulesModal)
- [ ] Allow apps to override header or modals
- [ ] Provide keyboard input routing setup

**Owner**: @dev1  
**Time**: 2-3 hours  
**Optional**: Can be deferred to Phase 2 if timeline tight

---

#### Task 3.2: Update Package Barrel Export

**File**: `packages/bingo-ui-components/src/index.ts`

**Steps**:
- [ ] Export all components:
  - [ ] `export { BingoCard } from './BingoCard'`
  - [ ] `export { DrawPanel } from './DrawPanel'`
  - [ ] `export { SettingsModal } from './SettingsModal'`
  - [ ] `export { RulesModal } from './RulesModal'`
  - [ ] `export { AboutModal } from './AboutModal'`
  - [ ] `export { HamburgerMenu } from './HamburgerMenu'`
  - [ ] `export { BingoAppShell } from './BingoAppShell'` (if created)
- [ ] Export all hooks:
  - [ ] `export { useBingoGame } from './hooks/useBingoGame'`
  - [ ] `export { useBingoSettings } from './hooks/useBingoSettings'`
  - [ ] `export { useBingoTheme } from './hooks/useBingoTheme'`
- [ ] Export types:
  - [ ] `export type { ... } from './types'`
- [ ] Create TypeDoc (optional)

**Owner**: @dev1  
**Time**: 30 minutes

---

#### Task 3.3: Test All Extracted Components

**Test Files**: Create `.test.tsx` for each component

**Steps**:
- [ ] BingoCard: Render, mark cells, keyboard navigation
- [ ] DrawPanel: Draw button, reset, number display
- [ ] SettingsModal: Open/close, theme selection, escape key
- [ ] RulesModal: Open/close, scroll content, focus management
- [ ] AboutModal: Open/close, feature cards render
- [ ] HamburgerMenu: Toggle animation, menu items click, outside click
- [ ] useBingoGame: Draw number, mark card, check win
- [ ] useBingoSettings: Save/load, persist to localStorage
- [ ] useBingoTheme: Apply theme, switch theme

**Owner**: @qa  
**Time**: 4-5 hours  
**Run**:
```bash
pnpm --filter @games/bingo-ui-components test
pnpm --filter @games/bingo-ui-components test:coverage
```

---

#### Task 3.4: Build & Validate Package

**Steps**:
- [ ] `pnpm --filter @games/bingo-ui-components typecheck` → 0 errors
- [ ] `pnpm --filter @games/bingo-ui-components lint` → 0 errors
- [ ] `pnpm --filter @games/bingo-ui-components build` → Success
- [ ] Check dist/ output
- [ ] Verify Tree-shaking (unused code removed)
- [ ] Check bundle size: `<150KB` (uncompressed)

**Owner**: @dev1  
**Time**: 1 hour

---

#### Task 3.5: Update Root Documentation

**Files to Create/Update**:
- [ ] `packages/bingo-ui-components/README.md` - Full API docs
- [ ] Add to `packages/README.md` with new package description
- [ ] Create `docs/BINGO_COMPONENTS.md` - Usage guide
- [ ] Add tsconfig.json path alias if needed

**Owner**: @tech-writer  
**Time**: 1-1.5 hours

---

## 🧪 PHASE 2: WASM Enhancement (Weeks 2-6, Parallel)

### Week 2: WASM Project Setup

#### Task 4.1: Create `packages/bingo-wasm` Project

**Using**: AssemblyScript (TypeScript → WebAssembly)

**Steps**:
- [ ] Create directory: `packages/bingo-wasm/`
- [ ] Initialize AssemblyScript project:
  ```bash
  npm init -y
  npm install --save-dev @assemblyscript/loader assemblyscript
  npx asc --init
  ```
- [ ] Create `src/` with subdirs:
  - [ ] `src/card.ts` - Card generation
  - [ ] `src/patterns.ts` - Pattern checking
  - [ ] `src/rng.ts` - Seeded RNG
  - [ ] `src/analysis.ts` - Board analysis
  - [ ] `src/index.ts` - Public API
- [ ] Create `asconfig.json`:
  ```json
  {
    "targets": {
      "release": {
        "outFile": "dist/release.wasm",
        "textFile": "dist/release.wat",
        "optionalFeatures": ["threads"]
      },
      "debug": {
        "outFile": "dist/debug.wasm"
      }
    }
  }
  ```
- [ ] Setup build script in package.json

**Owner**: @wasm-engineer  
**Time**: 2-3 hours

---

#### Task 4.2: Implement Card Generator WASM

**File**: `packages/bingo-wasm/src/card.ts`

**Implementation**:
```typescript
// Card generation with deterministic seed
export function generateBingoCard(
  minNumber: i32,
  maxNumber: i32,
  freespacePos: i32,
  seed: u32
): StaticArray<i32> {
  // Implementation using seeded RNG
  // Returns 25-element array representing 5x5 card
}

export function generateMultipleCards(
  count: i32,
  minNumber: i32,
  maxNumber: i32,
  seed: u32
): StaticArray<StaticArray<i32>> {
  // Generate N cards from single seed
}
```

**Effort**: 🟢 LOW  
**Time**: 3-4 hours  
**Testing**: 
- Verify generated cards have unique values
- Verify cards differ from each other
- Verify same seed produces same card

**Owner**: @wasm-engineer

---

#### Task 4.3: Implement Pattern Checker WASM

**File**: `packages/bingo-wasm/src/patterns.ts`

**Implementation**:
```typescript
// Pattern checking for bingo wins
export function checkPattern(
  markedGrid: StaticArray<bool>,
  patternId: i32
): bool {
  // Pattern IDs: 0=5-in-a-row (line), 1=5-across, 2=diagonal, ...
}

export function getWinningPatterns(
  markedGrid: StaticArray<bool>
): u32 {
  // Returns bitmask of all completed patterns
  // Bit 0 = pattern 0, bit 1 = pattern 1, etc
}

export function getCompletionPercentage(
  markedGrid: StaticArray<bool>,
  patternId: i32
): i32 {
  // 0-100 progress toward completing pattern
}
```

**Effort**: 🟢 LOW-MEDIUM  
**Time**: 4-5 hours  
**Testing**:
- Test each pattern type independently
- Test multiple patterns simultaneously
- Benchmark: JavaScript vs WASM

**Owner**: @wasm-engineer

---

#### Task 4.4: Implement Seeded RNG WASM

**File**: `packages/bingo-wasm/src/rng.ts`

**Implementation**:
```typescript
// Seeded random number generator (xorshift64)
export class Random {
  state: u64

  constructor(seed: u64) {
    this.state = seed
  }

  next(): u32 {
    // xorshift implementation
  }

  nextRange(min: i32, max: i32): i32 {
    // Scale to range [min, max)
  }

  shuffle<T>(array: StaticArray<T>): void {
    // Fisher-Yates shuffle using this RNG
  }
}
```

**Effort**: 🟡 MEDIUM  
**Time**: 3-4 hours  
**Testing**:
- Verify sequence is reproducible (same seed)
- Verify different seeds produce different sequences
- Distribution tests (all numbers appear equally)

**Owner**: @wasm-engineer

---

#### Task 4.5: Implement Board Analysis WASM

**File**: `packages/bingo-wasm/src/analysis.ts`

**Implementation**:
```typescript
// Board analysis for hints and progress
export function calculateNextMoves(
  board: StaticArray<i32>,
  marked: StaticArray<bool>,
  patternId: i32,
  maxHints: i32
): StaticArray<StaticArray<i32>> {
  // Return positions that would help complete pattern
}

export function calculateHintScore(
  position: StaticArray<i32>,
  board: StaticArray<i32>,
  marked: StaticArray<bool>,
  patternId: i32
): i32 {
  // Score for hint priority (which positions help most)
}
```

**Effort**: 🟡 MEDIUM  
**Time**: 4-5 hours  
**Testing**:
- Verify hints lead toward pattern completion
- Verify hint priorities make sense

**Owner**: @wasm-engineer

---

### Week 3-4: WASM Integration Binding

#### Task 5.1: Create TypeScript Bindings

**File**: `packages/bingo-wasm/src/index.ts` (wrapper)

**Purpose**: Export WASM functions as TypeScript module

**Implementation**:
```typescript
import loader from '@assemblyscript/loader'

let wasmModule: any

export async function initWasm() {
  wasmModule = await loader.instantiate(
    fetch('./dist/release.wasm'),
    {}
  )
}

export function generateBingoCardWasm(
  min: number, max: number, freespace: number, seed: number
): number[] {
  // Call WASM and convert result
  const ptr = wasmModule.exports.generateBingoCard(min, max, freespace, seed)
  const result = wasmModule.exports.memory.buffer
  // Copy and return array
}

// ... more wrapper functions
```

**Owner**: @wasm-engineer  
**Time**: 2-3 hours

---

#### Task 5.2: Integration in BingoCard Component

**File**: `packages/bingo-ui-components/src/BingoCard/useBingoCardWasm.ts` (new)

**Purpose**: Use WASM pattern checker in component

**Implementation**:
```typescript
import { initWasm, checkPatternWasm } from '@games/bingo-wasm'

export function useBingoCardWasm() {
  useEffect(() => {
    initWasm().catch(console.warn)  // Graceful degradation
  }, [])

  const checkPatternFast = (markedGrid: boolean[]) => {
    try {
      return checkPatternWasm(markedGrid)
    } catch (e) {
      // Fallback to JavaScript
      return checkPatternJS(markedGrid)
    }
  }

  return { checkPatternFast }
}
```

**Owner**: @dev-wasm  
**Time**: 2 hours

---

#### Task 5.3: Integration in Hint System

**Purpose**: Use WASM board analysis for instant hints

**Implementation**:
- [ ] Hook up `calculateNextMovesWasm()` in hint generation
- [ ] Hook up `calculateCompletionWasm()` for progress bars
- [ ] Fallback to JavaScript if WASM unavailable
- [ ] Add WASM load error boundary

**Owner**: @dev-wasm  
**Time**: 2-3 hours

---

### Week 5: WASM Testing & Optimization

#### Task 6.1: Benchmark WASM vs JavaScript

**Test File**: `packages/bingo-wasm/benchmarks.ts`

**Metrics**:
- [ ] Card generation: N cards (N=1, 10, 100)
- [ ] Pattern checking: Single pattern check (random marked grid)
- [ ] RNG generation: 1000 random numbers
- [ ] Board analysis: Hint calculation (full board)

**Target Results**:
- Card generation: 10x faster in WASM
- Pattern checking: 5-10x faster in WASM
- RNG: 2-3x faster in WASM
- Board analysis: 8x faster in WASM

**Owner**: @qa  
**Time**: 2-3 hours

---

#### Task 6.2: Memory & Bundle Size Audit

**Metrics**:
- [ ] WASM file size (release.wasm)
- [ ] Loader overhead (JS wrapper)
- [ ] Total additional bytes in bundle
- [ ] Memory usage before/after WASM load

**Target**:
- [ ] release.wasm: <50KB (gzipped ~15KB)
- [ ] Total overhead: <100KB uncompressed
- [ ] Memory overhead: <10MB per instance

**Owner**: @qa  
**Time**: 1-2 hours

---

#### Task 6.3: Error Handling & Fallback Testing

**Scenarios**:
- [ ] WASM file fails to load → JS fallback works
- [ ] WASM initialization error → App continues
- [ ] WASM function error → JS fallback called
- [ ] Browser doesn't support WASM → Pure JS works

**Testing**:
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on old browser polyfill
- [ ] Verify performance degradation is acceptable

**Owner**: @qa  
**Time**: 2-3 hours

---

## 🎯 PHASE 3: App Migration (Weeks 4-7)

### Week 4: Bingo App Baseline & Audit

#### Task 7.1: Audit Bingo App for Bingo-Core Compatibility

**Purpose**: Check if bingo app should use `@games/bingo-core`

**Steps**:
- [ ] Compare bingo domain logic vs bingo-core:
  - [ ] `apps/bingo/src/domain/card.ts` vs `packages/bingo-core/src/card.ts`
  - [ ] `apps/bingo/src/domain/rules.ts` vs `packages/bingo-core/src/rules.ts`
  - [ ] Check for custom extensions or differences
- [ ] If compatible:
  - [ ] Remove bingo domain code
  - [ ] Import from @games/bingo-core
  - [ ] Test that game still works
- [ ] If not compatible:
  - [ ] Merge custom logic into bingo-core
  - [ ] Make bingo-core more flexible to support all variants

**Owner**: @dev-lead  
**Time**: 3-4 hours

---

#### Task 7.2: Migrate Bingo App to Use Extracted Components

**Source Package**: `@games/bingo-ui-components`

**Steps**:
- [ ] Remove local component files:
  - [ ] `rm apps/bingo/src/ui/organisms/BingoCard.tsx`
  - [ ] `rm apps/bingo/src/ui/organisms/DrawPanel.tsx`
  - [ ] `rm apps/bingo/src/ui/organisms/SettingsModal.tsx`
  - [ ] `rm apps/bingo/src/ui/organisms/AboutModal.tsx`
  - [ ] `rm apps/bingo/src/ui/organisms/RulesModal.tsx`
  - [ ] `rm apps/bingo/src/ui/organisms/HamburgerMenu.tsx`
- [ ] Update imports:
  - [ ] `import { BingoCard } from '@games/bingo-ui-components'`
  - [ ] etc for other components
- [ ] Remove local hook files, import from package:
  - [ ] `import { useBingoGame } from '@games/bingo-ui-components'`
- [ ] Remove CSS files (now in package)
- [ ] Update package.json dependency: `@games/bingo-ui-components`
- [ ] `pnpm install`
- [ ] `pnpm --filter @games/bingo validate`

**Owner**: @dev1  
**Time**: 2-3 hours  
**Testing**: 
- [ ] `pnpm --filter @games/bingo build` succeeds
- [ ] Game runs: `pnpm --filter @games/bingo start`
- [ ] All features work (draw, mark, win detection)

---

### Week 4-5: Other Apps Migration

#### Task 8.1-8.5: Migrate Each App

**Apps**: bingo-90, bingo-80, bingo-pattern, bingo-30, speed-bingo

**Per-app process**:
1. [ ] Audit current structure (unique components vs generic)
2. [ ] Import `@games/bingo-ui-components`
3. [ ] Replace components with package versions (where applicable)
4. [ ] Adapt variant-specific logic (props to components)
5. [ ] Update imports and dependencies
6. [ ] Test: `pnpm --filter @games/[app-name] validate`
7. [ ] Test: `pnpm --filter @games/[app-name] start` (manual gameplay)

**Timeline**:
- Week 4: bingo-90 (simplest variant) → 2-3 hours
- Week 4: bingo-80 (similar to 90) → 2-3 hours
- Week 5: bingo-pattern (may have custom components) → 3-4 hours
- Week 5: bingo-30 (may be very different) → 3-4 hours
- Week 5: speed-bingo (unknown structure) → 3-4 hours

**Owners**: @dev-team (rotate)  
**Total time**: ~15-16 hours spread across team

---

### Week 6: Integration Testing & Cross-App Consistency

#### Task 9.1: Cross-App Testing Suite

**Purpose**: Verify all 6 apps behave consistently

**Test Cases**:
- [ ] Game board renders correctly (grid layout)
- [ ] Drawing numbers works (UI updates)
- [ ] Marking cards works (cell selection)
- [ ] Win detection works (pattern checking)
- [ ] Settings modal opens/closes
- [ ] Rules modal shows correct content
- [ ] About modal shows correct content
- [ ] Hamburger menu works
- [ ] Keyboard navigation works (arrow keys, enter)
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Accessibility passes (WCAG AA)
- [ ] WASM features work (pattern checking, hints)

**Owner**: @qa  
**Time**: 4-6 hours

---

#### Task 9.2: Visual Regression Testing

**Tools**: Playwright visual comparisons

**Process**:
- [ ] Capture baseline screenshots for each app:
  - [ ] Mobile (375px)
  - [ ] Tablet (768px)
  - [ ] Desktop (1280px)
- [ ] Create test runs for each variant
- [ ] Compare with shared component versions
- [ ] Capture any regressionsOwner**: @qa  
**Time**: 2-3 hours

---

#### Task 9.3: Performance Benchmarking

**Metrics per app**:
- [ ] Initial load time
- [ ] Time to first interaction
- [ ] Time to draw first number
- [ ] WASM initialization time
- [ ] Bundle size

**Target**:
- [ ] Load time < 3 seconds
- [ ] TTI < 2 seconds
- [ ] Bundle size increase < 100KB per app

**Owner**: @perf-team  
**Time**: 2 hours

---

### Week 7: Final Validation & Compliance Update

#### Task 10.1: Update Compliance Matrix

**File**: `compliance/feature-implementation-matrix.json`

**For each of 6 bingo apps, update**:
- [ ] `hamburger_menu`: ❌ → ✅
- [ ] `settings_modal`: ❌ → ✅
- [ ] `rules_modal`: ❌ → ✅ (or partial)
- [ ] `about_modal`: ❌ → ✅
- [ ] `responsive_design`: Update if improved
- [ ] `accessibility`: Update if improved via shared components
- [ ] `wasm_enhancements`: ❌ → ✅ (Tier 1-2 complete)

**Owner**: @compliance  
**Time**: 1 hour

---

#### Task 10.2: Create Final Summary Report

**File**: `compliance/BINGO_DECOMPOSITION_COMPLETION_REPORT.md`

**Contents**:
- [ ] All 6 apps migrated to use shared components
- [ ] Lines of code removed (duplication eliminated)
- [ ] WASM performance improvements
- [ ] Accessibility gains
- [ ] Bundle size analysis
- [ ] Compliance improvements
- [ ] Lessons learned
- [ ] Future recommendations

**Owner**: @tech-writer  
**Time**: 2 hours

---

#### Task 10.3: Final Build & Test All Apps

**Command**:
```bash
pnpm --filter "@games/bingo*" validate
pnpm --filter @games/bingo-ui-components validate
pnpm --filter @games/bingo-wasm validate
```

**Criteria for SUCCESS**:
- ✅ All 6 apps pass lint, format, typecheck
- ✅ All 6 apps build successfully
- ✅ All 6 apps pass unit tests
- ✅ All 6 apps pass e2e tests (Playwright)  
- ✅ Zero TypeScript errors
- ✅ Zero lint violations
- ✅ Document any deprecations/breaking changes

**Owner**: @qa  
**Time**: 2-3 hours

---

## 📊 Timeline Summary

```
WEEK 1: Package + Component Extraction (Phase 1)
  - Mon-Tue: Create @games/bingo-ui-components
  - Wed-Thu: Extract BingoCard, DrawPanel
  - Fri: Extract modals (SettingsModal, RulesModal, AboutModal)

WEEK 2: Remaining Extraction + WASM Setup (Phase 1 + 2)
  - Mon: Extract HamburgerMenu, hooks
  - Tue-Wed: CSS variables, type definitions
  - Thu-Fri: WASM project setup (AssemblyScript)

WEEK 3: Testing Phase 1 + WASM Card Generator (Phase 1 + 2)
  - Mon-Tue: Component integration testing
  - Wed-Thu: WASM card.ts implementation
  - Fri: Package validation & build

WEEK 4: App Migrations Start + WASM Pattern Checker (Phase 2 + 3)
  - Mon: Bingo app audit + migration
  - Tue-Wed: WASM patterns.ts implementation
  - Thu-Fri: Bingo-90 and Bingo-80 migrations

WEEK 5: Continue App Migrations + WASM Analysis (Phase 2 + 3)
  - Mon-Tue: Bingo-pattern, Bingo-30 migrations
  - Wed: WASM board analysis + RNG
  - Thu-Fri: Speed-bingo migration + WASM integration

WEEK 6: Integration Testing + WASM Testing (Phase 3)
  - Mon-Tue: Cross-app testing suite
  - Wed: WASM benchmarking + fallback testing
  - Thu-Fri: Visual regression, performance audit

WEEK 7: Final Validation (Phase 3)
  - Mon-Tue: Compliance matrix update
  - Wed: Final summary report
  - Thu-Fri: Full validation suite (all 6 apps pass)
```

---

## Team Allocation

| Role | Count | Key Tasks |
|------|-------|-----------|
| Frontend Lead | 1 | Overall coordination, architecture decisions |
| Frontend Dev | 2 | Component extraction, app migrations |
| WASM Engineer | 1 | WASM implementation, integration, benchmarking |
| QA Engineer | 1 | Testing, benchmarking, compliance validation |
| Designer (CSS) | 0.5 | CSS consolidation, accessibility review |
| Tech Writer | 0.5 | Documentation, summary reports |
| **Total** | **6** | **6-8 week timeline** |

---

## Success Criteria (All Must Pass ✅)

- [x] All duplicate components extracted to shared package
- [x] All 6 apps use `@games/bingo-ui-components`
- [x] WASM Tier 1 complete (card gen + pattern checking)
- [x] WASM Tier 2 complete or started (RNG + analysis)
- [x] All 6 apps have modals + hamburger menu
- [x] All 6 apps build and run without errors
- [x] Compliance matrix updated for all 6 apps
- [x] WASM performance meets targets (5-10x faster)
- [x] Zero duplication across apps (DRY principle)
- [x] Platform consistency achieved

---

**Status**: ✅ READY TO EXECUTE  
**Last Updated**: April 3, 2026  
**Next Review**: After Week 1 completion
