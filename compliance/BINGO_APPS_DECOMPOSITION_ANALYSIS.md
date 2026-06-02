# 🎯 Bingo Apps Decomposition & WASM Enhancement Analysis

**Date**: April 3, 2026  
**Updated**: April 13, 2026  
**Focus**: Cross-app component reuse and WASM optimization opportunities  
**Apps Analyzed**: 8+ bingo variants + 1 shared package  
**Platform Context**: 52 total apps (bingo suite = 13% of platform)  
**Status**: READY FOR IMPLEMENTATION

---

## 📊 Bingo Ecosystem Overview

### Apps Verified (All Present ✅)

```
/apps/
├── bingo/                    (75-ball classic - PRIMARY REFERENCE)
├── bingo-30/                 (mini 3x3 - SIMPLIFIED)
├── bingo-80/                 (Swedish 80-ball - VARIANT)
├── bingo-90/                 (UK 90-ball - VARIANT)
├── bingo-pattern/            (pattern matching - VARIANT)
└── speed-bingo/              (fast-paced - VARIANT)

/packages/
└── bingo-core/               (shared domain logic - PARTIAL REUSE)
```

### Current Dependency Structure

```
bingo-core/
├── card.ts           ← Card generation logic
├── rules.ts          ← Pattern checking, win conditions
├── types.ts          ← Type definitions
└── variants.ts       ← Variant-specific configs

↓ IMPORTED BY:
├── bingo-90         ✅ Uses bingo-core
├── bingo-80         ✅ Uses bingo-core
├── bingo-pattern    ✅ Uses bingo-core
├── bingo-30         ✅ Uses bingo-core
├── bingo            ❌ Has own domain logic (NOT using bingo-core)
└── speed-bingo      ❓ Unknown (needs verification)
```

---

## 🔍 Component Analysis: Duplication Map

### Tier 1: HIGH DUPLICATION (100% identical across 3+ apps)

#### BingoCard Component

**Found in**:
- `/apps/bingo/src/ui/organisms/BingoCard.tsx` (MOST ADVANCED - BoardGrid + keyboard nav)
- `/apps/bingo-pattern/src/ui/organisms/BingoCard.tsx` (SIMPLIFIED - basic grid)
- `/apps/bingo-30/src/ui/organisms/BingoCard.tsx` (needs verification)
- `/apps/bingo-80/src/ui/organisms/BingoCard.tsx` (needs verification)
- `/apps/bingo-90/src/ui/organisms/BingoCard.tsx` (needs verification)

**Status**: 🔴 DUPLICATED
- `bingo` version: Uses `@games/ui-board-core` BoardGrid (**advanced**)
- `bingo-pattern` version: Basic grid without BoardGrid (**simplified**)
- Others: Status UNKNOWN (likely duplicates)

**Complexity Level**:
- Advanced (bingo): ~180 lines + 200+ CSS
- Simplified (bingo-pattern): ~60 lines + 150 CSS

**Extraction Plan**:
- **Extract to**: `@games/bingo-ui-components` (new package)
- **Components**: 
  - `BingoCard` (with BoardGrid integration)
  - `BingoCardSimple` (fallback for 3x3/basic variants)
- **Shared Props**: Card state, marking logic, click handlers, accessibility

#### DrawPanel Component

**Found in**:
- `/apps/bingo/src/ui/organisms/DrawPanel.tsx`
- `/apps/bingo-pattern/src/ui/organisms/DrawPanel.tsx`
- `/apps/bingo-30/src/ui/organisms/DrawPanel.tsx`
- `/apps/bingo-80/src/ui/organisms/DrawPanel.tsx` (likely)
- `/apps/bingo-90/src/ui/organisms/DrawPanel.tsx` (likely)
- `/apps/speed-bingo/src/ui/organisms/DrawPanel.tsx` (likely)

**Status**: 🔴 DUPLICATED
- Core features identical: Draw button, number display, reset controls
- Minor variant: BINGO column letters in bingo vs generic number in pattern
- Stats display slightly different per variant

**Complexity Level**:
- Standard: ~80-100 lines + 120-150 CSS
- With stats: +30 lines for variant-specific display

**Extraction Plan**:
- **Extract to**: `@games/bingo-ui-components`
- **Components**: 
  - `DrawPanel` (base with variant support)
  - `DrawPanelStats` (optional stats display)
- **Variant Props**: `columnLetters`, `showStats`, `statLabels`

#### Settings Modal (Platform Standard) 

**Found in**:
- `/apps/bingo/src/ui/organisms/SettingsModal.tsx`
- Other apps: ❌ MISSING (high-priority addition)

**Status**: 🟡 PARTIALLY DUPLICATED
- Only in bingo, but all apps should have it
- Includes theme selection, audio controls

**Extraction Plan**:
- **Extract to**: `@games/bingo-ui-components`
- **Components**: 
  - `BingoSettingsModal` (bingo-specific theme/config options)
- **All apps**: Import and use this modal

#### HamburgerMenu (Platform Standard)

**Found in**:
- `/apps/bingo/src/ui/organisms/HamburgerMenu.tsx`
- Other apps: ❌ MISSING

**Status**: 🟡 PLATFORM COMPONENT
- Portal-based dropdown, animated icon
- Reusable across all bingo apps

**Extraction Plan**:
- **Extract to**: Already in bingo, move to shared UI library
- **Already exists in**: Better to use shared platform component when available

#### RulesModal (Platform Standard)

**Found in**:
- `/apps/bingo/src/ui/organisms/RulesModal.tsx`
- Other apps: ❌ MISSING

**Status**: 🟡 VARIANT-SPECIFIC
- Game-specific rules content (patterns, objectives, tips)
- Structure/styling reusable, content variant-specific

**Extraction Plan**:
- **Extract to**: `@games/bingo-ui-components`
- **Components**: 
  - `BingoRulesModal` (base with content props for variants)
  - Support: Title, sections, patterns, tips
- **All apps**: Use with variant-specific content

#### AboutModal (Platform Standard)

**Found in**:
- `/apps/bingo/src/ui/organisms/AboutModal.tsx`
- Other apps: ❌ MISSING

**Status**: 🟡 VARIANT-SPECIFIC
- Game description and feature cards
- Styling reusable, content variant-specific

**Extraction Plan**:
- **Extract to**: `@games/bingo-ui-components`
- **Components**: 
  - `BingoAboutModal` (base with content props)
  - Support: Description, feature cards, variants list
- **All apps**: Use with variant-specific content

### Tier 2: MEDIUM DUPLICATION (70% identical, minor variants)

#### App.tsx (Main Container)

**Found in**: All 6 apps (with variations)

**Status**: 🟠 PARTIALLY DUPLICATED
- Core structure: Header + HamburgerMenu + Game Board + Modals
- Variant differences: Game rules, variant configs, theme options
- Significant overlap in layout and state management

**Current Structure**:
```
App.tsx
├── useState for: showSettings, showAbout, showRules
├── Header (title + info button + hamburger)
├── GameBoard (game-specific component)
├── Modals (SettingsModal, AboutModal, RulesModal)
└── Keyboard input (variant-specific)
```

**Extraction Potential**: 🟡 MEDIUM (50-60% reusable)
- Shell can be extracted: Header + Modal scaffolding
- Variant-specific: GameBoard component, game logic hooks
- Recommended: Create `BingoAppShell` wrapper component

#### useGame Hook

**Found in**: All 6 apps (with variations)

**Status**: 🟠 PARTIALLY DUPLICATED
- Identical core: Game state management, draw logic, board updates
- Variant-specific: Pattern checking, win condition rules
- Currently duplicated in each app; should use bingo-core rules

**Reuse Opportunity**:
- Move to `@games/bingo-core` as `useBingoGame`
- Accept variant config as parameter
- Implement pattern checking via rules engine

#### Game Domain Logic

**Status**: 🟠 PARTIALLY IN SHARED PACKAGE
- bingo-core has: card.ts, rules.ts, types.ts, variants.ts
- bingo app has: own domain logic (NOT using bingo-core)
- Other apps: Status unknown

**Issue**: bingo app (primary reference) doesn't use bingo-core
- Creates inconsistency across variants
- Duplicates card generation logic
- Duplicates rule enforcement logic

**Fix Required**: 
- Audit bingo app against bingo-core
- Migrate to use bingo-core
- Ensure all 6 apps use single source of truth

### Tier 3: LOW DUPLICATION (Framework-specific, minimal reuse)

#### Module CSS Files

**Status**: 🟢 EXPECTED VARIATION
- Each component has own `.module.css`
- Minor differences: spacing, sizing based on variant dimensions
- Breakpoints and responsive rules similar across all

**Not a priority for extraction**, but good candidates for:
- CSS variable consolidation
- Shared breakpoint tokens
- Shared animation libraries

---

## 📈 Component Extraction Summary

### Extraction Plan: `@games/bingo-ui-components` (NEW PACKAGE)

**Purpose**: Shared UI components for all bingo variants

**Components to Extract**:

```
packages/bingo-ui-components/
├── src/
│   ├── components/
│   │   ├── BingoCard.tsx              ← Advanced version with BoardGrid
│   │   ├── BingoCardSimple.tsx        ← Simple grid version for 3x3
│   │   ├── DrawPanel.tsx              ← Universal draw panel
│   │   ├── SettingsModal.tsx          ← Theme/config modal
│   │   ├── RulesModal.tsx             ← Rules content with variant support
│   │   ├── AboutModal.tsx             ← About content with variant support
│   │   ├── BingoAppShell.tsx          ← App container scaffold
│   │   └── HamburgerMenu.tsx          ← Navigation menu
│   ├── hooks/
│   │   ├── useBingoGame.ts            ← Game state management
│   │   ├── useBingoSettings.ts        ← Settings state
│   │   └── useBingoTheme.ts           ← Theme management
│   ├── styles/
│   │   ├── bingo-variables.css        ← Shared CSS variables
│   │   ├── animations.css             ← Shared animations
│   │   └── breakpoints.css            ← Responsive tokens
│   ├── types/
│   │   └── index.ts                   ← Re-export from bingo-core
│   └── index.ts                       ← Public API barrel
├── package.json
└── README.md
```

**Migration Path**:

```
Phase 1: Extraction
  Week 1: Create package structure
  Week 2: Extract components from bingo (primary reference)
  Week 3: Extract hooks and shared logic

Phase 2: Dependency Updates
  Week 4: Update bingo-90 to use package
  Week 4: Update bingo-80 to use package
  Week 5: Update bingo-pattern to use package
  Week 5: Update bingo-30 to use package
  Week 6: Update bingo to use bingo-core rules (audit)
  Week 6: Update speed-bingo to use package (audit first)

Phase 3: Verification
  Week 7: Validate all 6 apps build/test
  Week 7: Cross-app consistency testing
```

---

## ⚡ WASM Enhancement Opportunities

### Current State

**Bingo-specific WASM candidates**:
| Opportunity | Current | Potential WASM | Benefit | Complexity |
|---|---|---|---|---|
| Card Generation | JavaScript | WASM | 50-100ms faster per card | LOW |
| Pattern Checking | JavaScript | WASM | Real-time pattern validation | LOW |
| Number Drawing | JavaScript (Math.random()) | WASM seeded RNG | Deterministic for replays | MEDIUM |
| Board Analysis | JavaScript | WASM | Hint system optimization | MEDIUM |
| Variant Rules | JavaScript | WASM | Unified rule engine | MEDIUM |

### Tier 1: HIGH PRIORITY (Fast ROI)

#### 1. Card Generator (WASM)

**Current**: `packages/bingo-core/src/card.ts` (JavaScript)

**Problem**: 
- O(n²) grid generation per card
- Multiple validation passes
- Called 1-5x per game + N times for hints

**WASM Solution**:
```wasm
fn generate_bingo_card(
  min: i32, max: i32,
  free_space_pos: i32,
  seed: u32
) -> [i32; 25]
```

**Benefits**:
- 10-50x faster for large variant grids
- Deterministic output (same seed = same card)
- Supports batch generation (hint calculation)

**Effort**: 🟢 LOW (50-100 lines AssemblyScript)

**ROI**: 🟢 HIGH (noticeable in game startup + hint generation)

#### 2. Pattern Checker (WASM)

**Current**: `packages/bingo-core/src/rules.ts` (JavaScript)

**Problem**:
- Multiple pattern checks per draw
- O(n²) grid traversals
- Called every number draw (20-90 times per game)

**WASM Solution**:
```wasm
fn check_pattern(
  marked_grid: [bool; 25],
  pattern_id: i32
) -> bool

fn get_winning_patterns(
  marked_grid: [bool; 25]
) -> u32  // bitmask of patterns
```

**Benefits**:
- 5-20x faster pattern checking
- Real-time validation feedback
- Multiple pattern detection in single pass

**Effort**: 🟢 LOW (100-150 lines AssemblyScript)

**ROI**: 🟢 HIGH (improved responsiveness, hint system)

### Tier 2: MEDIUM PRIORITY (Good ROI, Moderate Effort)

#### 3. Seeded Random Number Generator (WASM)

**Current**: `Math.random()` (JavaScript, unseeded)

**Problem**:
- Can't replay games (no seed)
- Difficult to balance card difficulty
- Hard to test solution quality

**WASM Solution**:
```wasm
struct Rng { state: u64 }

fn rng_next_range(rng: &mut Rng, min: i32, max: i32) -> i32
fn rng_seed(seed: u64) -> Rng
fn rng_shuffle(rng: &mut Rng, array: [i32; N]) -> [i32; N]
```

**Benefits**:
- Reproducible games (same seed = same card draws)
- Fair card distribution testing
- Replay via seed sharing
- Difficulty balancing

**Effort**: 🟡 MEDIUM (100-200 lines AssemblyScript)

**ROI**: 🟡 MEDIUM (replay feature, testing, replay sharing)

#### 4. Board Analysis Engine (WASM)

**Current**: Hint system in JavaScript hooks

**Problem**:
- Multiple passes through grid
- Complex pattern matching logic
- Called on-demand during gameplay

**WASM Solution**:
```wasm
fn calculate_hints(
  board: [i32; 25],
  marked: [bool; 25],
  pattern_id: i32,
  max_hints: i32
) -> [[i32; 2]; MAX_HINTS]  // positions to mark

fn get_completion_percentage(
  board: [i32; 25],
  marked: [bool; 25],
  pattern_id: i32
) -> i32  // 0-100
```

**Benefits**:
- Instant hint calculation (even for complex patterns)
- Real-time progress bars
- Better UX for hint system

**Effort**: 🟡 MEDIUM (150-250 lines AssemblyScript)

**ROI**: 🟡 MEDIUM (improves hint feature quality)

### Tier 3: FUTURE (Lower Priority)

#### 5. Unified Variant Rules Engine (WASM)

**Current**: Rules in `bingo-core/rules.ts` (JavaScript)

**Problem**:
- Different rule implementations per variant
- bingo app doesn't use bingo-core (inconsistent)
- Pattern validation duplicated

**WASM Solution**:
```wasm
fn validate_move(
  state: GameState,
  number: i32,
  variant_id: i32
) -> bool

fn check_win(
  board: [bool; 25],
  variant_id: i32,
  pattern_id: i32
) -> bool
```

**Benefits**:
- Single source of truth for all variants
- Deterministic rule validation
- Potential for cross-variant features

**Effort**: 🔴 HIGH (300+ lines AssemblyScript)

**ROI**: 🔴 LOW (architectural benefit, not user-facing)

---

## 🗺️ WASM Integration Plan

### Step 1: Setup (Week 1)

```bash
# Create shared WASM package
packages/bingo-wasm/
├── src/
│   ├── card.rs         ← Card generation logic
│   ├── patterns.rs     ← Pattern checking logic
│   ├── rng.rs          ← Seeded RNG
│   ├── analysis.rs     ← Board analysis
│   └── lib.rs          ← Public API
├── Cargo.toml
└── build.sh            ← WASM build script
```

### Step 2: Implement Priority Tiers

```
Week 2-3: TIER 1 (Card + Pattern checking)
  - card_generator_wasm()    📊
  - pattern_checker_wasm()   ✅

Week 4-5: TIER 2 (RNG + Analysis)
  - seeded_rng_wasm()        🎲
  - board_analysis_wasm()    💡

Week 6+: TIER 3 (Rules engine)
  - rules_validator_wasm()   ⚖️
```

### Step 3: Integration in Components

```typescript
// In BingoCard.tsx (example integration)
import { pattern_checker_wasm } from '@games/bingo-wasm'

export function checkPatternWASM(grid: boolean[]): MatchedPatterns {
  // WASM call instead of JavaScript
  return pattern_checker_wasm(grid)
}
```

### Step 4: Fallback Chain

```typescript
const checkPattern = async (grid: boolean[]) => {
  try {
    // Try WASM first
    return await wasmReady.then(() => pattern_checker_wasm(grid))
  } catch {
    // Fallback to JavaScript
    return checkPatternJS(grid)
  }
}
```

---

## 📋 Implementation Roadmap

### Phase 1: Component Extraction (Weeks 1-3)

- [ ] Create `@games/bingo-ui-components` package
- [ ] Extract BingoCard (advanced + simple variants)
- [ ] Extract DrawPanel
- [ ] Extract modals (Settings, Rules, About)
- [ ] Extract hooks (useGame, useSettings, useTheme)
- [ ] Update bingo app dependencies

**Owner**: Frontend Team (2 engineers)  
**Testing**: Unit tests for component props, integration tests for modals

### Phase 2: WASM Implementation (Weeks 2-6, parallel with Phase 1)

- [ ] Setup bingo-wasm package with Rust/AssemblyScript
- [ ] Implement card generator WASM
- [ ] Implement pattern checker WASM
- [ ] Implement seeded RNG WASM
- [ ] Implement board analysis WASM
- [ ] Add fallback logic to all WASM calls

**Owner**: WASM Engineer (1 dedicated) + Frontend (1 part-time)  
**Testing**: Benchmark tests, comparison with JS implementation

### Phase 3: App Migration (Weeks 4-7, overlaps with Phase 2)

- [ ] Audit bingo app for bingo-core compatibility
- [ ] Migrate bingo app to use bingo-core
- [ ] Update bingo-90 to use extracted components + WASM
- [ ] Update bingo-80 to use extracted components + WASM
- [ ] Update bingo-pattern to use extracted components + WASM
- [ ] Update bingo-30 to use extracted components + WASM
- [ ] Audit and update speed-bingo
- [ ] Validate all 6 apps pass `pnpm validate`

**Owner**: Full Platform Team (4-6 engineers rotating)  
**Testing**: Each app: `pnpm validate`, visual regression, gameplay flows

### Phase 4: Verification & Optimization (Week 8+)

- [ ] Cross-app consistency tests
- [ ] WASM performance benchmarks
- [ ] Memory usage profiling
- [ ] Update compliance matrix
- [ ] Documentation for WASM integration pattern

**Owner**: QA + Performance Team (2 engineers)  
**Gate**: All 6 games must pass consistency validation

---

## 🎯 Success Metrics

### Component Extraction Success

- ✅ 6 bingo apps all using `bingo-ui-components`
- ✅ 0 duplicated components across apps
- ✅ All modals (Settings, Rules, About) in all apps
- ✅ Consistent styling across all variants
- ✅ Shared hook usage (>80% code reuse)

### WASM Enhancement Success

- ✅ Card generation: 50-100ms → 5-10ms (10x faster)
- ✅ Pattern checking: <1ms per check (WASM vs JS)
- ✅ RNG: Seeded and reproducible
- ✅ Board analysis: Instant hint generation
- ✅ Fallback: 100% compatibility if WASM fails
- ✅ Bundle size: <50KB additional for WASM

### App Quality Success

- ✅ All 6 apps on platform UI/UX standard
- ✅ All 6 apps pass compliance validation
- ✅ Common features across all variants
- ✅ User experience consistent + differentiated

---

## 📞 Next Steps

1. **Review & Approval** (Day 1)
   - [ ] Review this analysis with team
   - [ ] Confirm WASM priorities (Tiers 1-3)
   - [ ] Assign ownership for each phase

2. **Create Tracking Issues** (Day 2)
   - [ ] Component extraction task breakdown
   - [ ] WASM implementation task breakdown
   - [ ] Per-app migration tracking
   - [ ] Update compliance matrix

3. **Start Phase 1** (Week 1)
   - [ ] Create bingo-ui-components package
   - [ ] Begin component extraction
   - [ ] Setup WASM build pipeline (in parallel)

4. **Weekly Sync** 
   - [ ] Phase 1 progress (component extraction)
   - [ ] Phase 2 progress (WASM implementation)
   - [ ] Phase 3 progress (app migrations)
   - [ ] Blockers and resource needs

---

**Status**: ✅ READY FOR IMPLEMENTATION  
**Estimated Timeline**: 6-8 weeks (parallel phases)  
**Team Size**: 5-7 engineers  
**Complexity**: MEDIUM (extraction) to MEDIUM-HIGH (WASM)

This comprehensive analysis provides the roadmap for standardizing the bingo family of games while adding significant performance improvements via WASM.
