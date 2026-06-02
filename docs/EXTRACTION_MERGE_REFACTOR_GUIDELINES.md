# 📚 Extraction & Merge-First Guidelines

**Requirement**: When extracting to shared packages, always audit existing implementations, identify merge/refactor opportunities, and ensure zero loss of features and backward compatibility.

---

## The Rule (Non-Negotiable)

```
Before extracting ANY component or hook to a shared package:

1. ✅ AUDIT what already exists in shared packages
2. ✅ SEARCH for similar patterns across all apps
3. ✅ IDENTIFY merge opportunities
4. ✅ REFACTOR intelligently (consolidate without loss)
5. ✅ PRESERVE all existing functionality
6. ✅ MAINTAIN backward compatibility
7. ✅ UPDATE all existing consumers

Only THEN extract new code.
```

---

## Team A: HamburgerMenu Extraction (Dashboard Phase 1)

### Pre-Extraction Checklist

**Step 1: Audit Existing Shared UI Components**

```bash
# Check if shared-ui-components already exists
ls packages/shared-ui-components/

# Check what's already in packages/
ls packages/ | grep -i ui

# Search for any existing menu components
grep -r "HamburgerMenu\|hamburger\|menu" packages/ --include="*.tsx" --include="*.ts"

# Check apps for similar menu implementations
grep -r "HamburgerMenu\|Hamburger" apps/ --include="*.tsx" | cut -d: -f1 | sort | uniq
```

**Expected Result**: Probably find:

- ✅ Bingo has HamburgerMenu.tsx (the source)
- ✅ Battleship may have similar menu component (check)
- ⚠️ Any other apps with menu patterns? (search)
- ⚠️ Existing shared-ui-components package? (check)

---

### Step 2: Identify Merge Opportunities

**If you find similar menu components in 2+ apps:**

```
Current State:
├── apps/bingo/src/ui/molecules/HamburgerMenu.tsx (original)
├── apps/battleship/src/ui/molecules/HamburgerMenu.tsx (copy or variant?)
└── apps/[other]/src/ui/molecules/SomeMenu.tsx (different name, similar behavior?)

BEFORE extracting to shared:
1. Compare implementations side-by-side
2. Identify: Common code + variant code
3. Design: Shared base + configuration flags
4. Extract: Merge patterns into single shared component
5. Update: All apps import from shared (backward compatible!)
```

**Example Merge Pattern** (Pseudo-code):

```typescript
// ❌ DON'T DO THIS (duplicate extraction)
// packages/shared-ui-components/src/HamburgerMenu.tsx
export const HamburgerMenu = ({ onClose }) => <...>

// apps/bingo/src/ui/molecules/HamburgerMenu.tsx (new import)
export { HamburgerMenu } from '@/shared-ui-components'

// ✅ DO THIS INSTEAD (intelligent merge)
// packages/shared-ui-components/src/HamburgerMenu.tsx
export const HamburgerMenu = ({
  onClose,           // common
  position = 'top-right',  // variant flag
  customItems = [],        // extensibility
}) => <...>

// apps/bingo/src/ui/molecules/HamburgerMenu.tsx
export { HamburgerMenu } from '@/shared-ui-components'

// apps/battleship/src/ui/molecules/HamburgerMenu.tsx (now uses shared!)
export { HamburgerMenu } from '@/shared-ui-components'

// apps/[future-game]/src/ui/molecules/HamburgerMenu.tsx
export { HamburgerMenu } from '@/shared-ui-components'
```

---

### Step 3: Refactor Without Losing Features

**Audit Bingo's HamburgerMenu for all features:**

```bash
# Read the source file to identify ALL behaviors
cat apps/bingo/src/ui/molecules/HamburgerMenu.tsx

# Search for related hooks/utilities used
grep -E "useEffect|useState|useContext|useCallback" apps/bingo/src/ui/molecules/HamburgerMenu.tsx

# Check for CSS-in-JS or module styles
ls apps/bingo/src/ui/molecules/HamburgerMenu.*

# Identify all props accepted
grep "interface.*Props\|type.*Props\|{.*}" apps/bingo/src/ui/molecules/HamburgerMenu.tsx | head -20
```

**Features to preserve**:

- [ ] Portal rendering (fixed position above game board)
- [ ] Animation (3-line → X transformation)
- [ ] Focus management (keyboard navigation, tab trap)
- [ ] Accessibility (aria-\* attributes)
- [ ] Click-outside detection (mousedown + touchstart)
- [ ] ESC key handling
- [ ] Responsive sizing (mobile/tablet/desktop breakpoints)
- [ ] Theme integration (colors from ThemeContext)
- [ ] Sound integration (if applicable)
- [ ] Custom item support (content slots)

**Document These Features** in shared component:

```typescript
/**
 * HamburgerMenu - Portable across all games
 *
 * FEATURES PRESERVED:
 * ✅ Portal rendering (fixed position z-index 9999)
 * ✅ 3-line → X animation (300ms cubic-bezier)
 * ✅ ESC key + outside-click close
 * ✅ Focus trap + aria attributes
 * ✅ Responsive (mobile 240px → desktop 480px)
 * ✅ Theme colors + touch-safe defaults
 * ✅ Custom items support via children
 *
 * USAGE:
 * import { HamburgerMenu } from '@/shared-ui-components'
 *
 * <HamburgerMenu>
 *   <MenuItem onClick={...}>Difficulty</MenuItem>
 *   <MenuItem onClick={...}>Settings</MenuItem>
 * </HamburgerMenu>
 */
```

---

### Step 4: Backward Compatibility Check

**After creating shared package, verify zero breakage:**

```bash
# Test Bingo still works (primary consumer)
pnpm --filter @games/bingo dev
# Check: Menu appears, keyboard nav works, animations smooth, no console errors

# Test newly added apps work
pnpm --filter @games/bunco build
# Check: Build succeeds, no missing imports

# Verify CSS is accessible
# Check: Colors match theme, sizing matches devices
```

**If you find breakage:**

```
DON'T: Remove features from shared component
DO: Create wrapper or adapter layer

Example:
// apps/custom-game/src/ui/molecules/HamburgerMenu.tsx
import { HamburgerMenu as BaseMenu } from '@/shared-ui-components'

export const HamburgerMenu = (props) => (
  <BaseMenu {...props} customBehavior={...} />
)
```

---

## Team B: Hook Extraction (Bingo Phase C Redux)

### Pre-Integration Checklist

**Step 1: Audit Target Packages**

```bash
# Audit what already exists in each package
cat packages/theme-context/src/index.ts
cat packages/bingo-core/src/index.ts
cat packages/sound-context/src/index.ts

# Search for hook-like exports
grep -E "export.*use|export.*hook" packages/*/src/index.ts

# Check for conflicts (same function in 2 packages)
grep -r "^export.*function\|^export.*const" packages/*/src/ | sort | uniq -d
```

**Expected Result**: Identify:

- ✅ What hooks already exist in shared packages
- ✅ What Bingo's useGame needs from each package
- ⚠️ Are there overlapping functions? (deduplicate!)
- ⚠️ Are there naming conflicts? (resolve!)

---

### Step 2: Identify Merge Opportunities

**If you find similar hooks across packages:**

```
Current State:
├── packages/bingo-core/src/rules.ts (game logic)
├── packages/theme-context/src/useTheme.ts (theme hook)
├── apps/bingo/src/app/useGame.ts (bingo-specific hook)
└── apps/sudoku/src/app/useGame.ts (sudoku-specific hook? check!)

BEFORE extracting useGame:
1. Compare useGame implementations across games
2. Identify: Common logic + game-specific logic
3. Design: Shared hook factory + game-specific overrides
4. Extract: Merge into family-specific package (e.g., @games/puzzle-game-hooks)
5. Update: All games import from shared (backward compatible!)
```

**Example Merge Pattern** (Pseudo-code):

```typescript
// ❌ DON'T DO THIS (duplicate hook extraction)
// packages/bingo-game-hooks/src/useGame.ts
export const useGame = () => { ... }

// apps/bingo/src/app/useGame.ts (new import)
export { useGame } from '@/games/bingo-game-hooks'

// ✅ DO THIS INSTEAD (intelligent merge)
// packages/puzzle-game-hooks/src/useGame.ts (family-level, Game-agnostic)
export const useGame = (gameRules, initialState) => { ... }

// packages/puzzle-game-hooks/src/useBingo.ts (bingo-specific wrapper)
export const useBingo = () => useGame(bingoRules, bingoInitialState)

// apps/bingo/src/app/useGame.ts
export { useBingo as useGame } from '@/games/puzzle-game-hooks'

// apps/sudoku/src/app/useGame.ts (can now also use shared!)
export const useGame = () => {
  const base = useGame(sudokuRules, sudokuInitialState)
  return { ...base, sudokuSpecificFeature: ... }
}
```

---

### Step 3: Refactor Without Losing Features

**Audit Bingo's useGame for all capabilities:**

```bash
# Read the hook to identify ALL behaviors
cat apps/bingo/src/app/useGame.ts

# List all functions/methods returned
grep "return {" apps/bingo/src/app/useGame.ts -A 50 | head -60

# Check for state management (useState, useReducer)
grep -E "useState|useReducer|useCallback|useMemo" apps/bingo/src/app/useGame.ts

# Identify all dependencies (imported from)
grep "^import" apps/bingo/src/app/useGame.ts
```

**Capabilities to preserve**:

- [ ] Game state initialization
- [ ] Move validation (using rules from bingo-core)
- [ ] Score calculation
- [ ] Undo/redo (if exists)
- [ ] Timer management (if exists)
- [ ] Persistence (if exists)
- [ ] Stats tracking
- [ ] Theme integration
- [ ] Sound effects integration
- [ ] Game completion detection

**Document These Capabilities** in shared hook:

```typescript
/**
 * useGame - Game engine hook for puzzle games
 *
 * CAPABILITIES PRESERVED:
 * ✅ Game state management (board, turn, score)
 * ✅ Move validation (uses gameRules contract)
 * ✅ Score calculation (pluggable scoring function)
 * ✅ Undo/redo (if applicable to game family)
 * ✅ Timer support (if applicable)
 * ✅ Persistence (localStorage integration)
 * ✅ Stats tracking (API-compatible with all games)
 * ✅ Theme & sound integration (injected via context)
 *
 * USAGE:
 * const { board, move, undo, stats } = useGame(gameRules, options)
 */
```

---

### Step 4: Backward Compatibility Check

**After creating hooks, verify zero breakage:**

```bash
# Test Bingo still works (primary consumer)
pnpm --filter @games/bingo dev
# Check: Game plays, moves work, score updates, undo works

# Test hook is usable by other games
# Check: Interface is generic enough (game-agnostic)

# Verify no circular dependencies
pnpm install && pnpm build
# Check: Build succeeds, no circular warnings
```

**If you find incompatibilities:**

```
DON'T: Remove capabilities from the hook
DO: Create adapter or configuration layer

Example:
// packages/bingo-game-hooks/src/useBingoGame.ts
export const useBingoGame = (options) => {
  const base = useGame(bingoRules, options)
  return {
    ...base,
    // Bingo-specific enhancements or overrides
    customScore: calculateBingoScore(...),
  }
}
```

---

## General Merge Checklist (Both Teams)

Before committing any extraction:

- [ ] **Audit**: What already exists in packages?
- [ ] **Search**: Are there duplicates across apps (same logic, different files)?
- [ ] **Analyze**: Can we merge intelligently (consolidate without loss)?
- [ ] **Design**: What's shared? What's extensible? What's variant-specific?
- [ ] **Refactor**: Extract merged pattern to shared package
- [ ] **Test**: All original consumers still work (backward compatible!)
- [ ] **Document**: Features preserved + new variants supported
- [ ] **Update**: All affected apps use shared package
- [ ] **Verify**: Zero build errors, no console warnings, no functionality loss

---

## Decision Tree

```
Considering extracting Component X?

1. Does it exist elsewhere?
   ├─ YES → Go to step 2
   └─ NO → Skip to step 4

2. Can they be merged?
   ├─ YES → Go to step 3
   └─ NO → Extract separately, make them coexist

3. Merge design:
   ├─ Shared base + variant flags? → Use that pattern
   ├─ Pluggable behaviors? → Use that pattern
   └─ Game-family specific? → Create family package

4. Extract to shared:
   ├─ Create or update shared package
   ├─ Ensure ALL features preserved
   ├─ Add configuration points if needed
   └─ Test all consumers still work

5. Update consumers:
   └─ All apps using Component X now import from shared
```

---

## Examples from Bingo Precedent

**What was already extracted (GOOD):**

- ✅ SettingsModal.tsx → projects/shared-ui-components (with extensibility)
- ✅ RulesModal.tsx → projects/shared-ui-components (with configurable rules prop)
- ✅ AboutModal.tsx → projects/shared-ui-components (with game identity integration)

**Why these worked:**

- Each was analyzed for reusability
- Variant points were identified upfront
- All original consumers tested
- Zero feature loss reported

---

## Escalation Path

**If you discover:**

| Situation                            | Action                                     |
| ------------------------------------ | ------------------------------------------ |
| Similar component in 2+ apps         | Merge to shared with variants              |
| Hook exists but incompatible API     | Create adapter, update docs                |
| Circular dependency detected         | Refactor to break circle (do NOT extract)  |
| Feature loss during extraction       | Revert, redesign, extract more carefully   |
| Breaking change to existing consumer | Add deprecation wrapper, migrate gradually |

---

## Success Criteria

Extraction is done RIGHT when:

- ✅ Zero duplication (merged all variants)
- ✅ Zero feature loss (all capabilities preserved)
- ✅ Zero breaking changes (backward compatible)
- ✅ Extensible (new games can customize)
- ✅ Well-documented (what was preserved, how to extend)
- ✅ All builds pass (no circular deps, no import errors)
- ✅ All games still work (functional equivalence)

---

## Anti-Patterns (Things NOT to Do)

| Anti-Pattern                      | Why It's Bad                       | Fix                           |
| --------------------------------- | ---------------------------------- | ----------------------------- |
| Extract without auditing existing | Duplicate shared components        | Always audit first            |
| Lose features to simplify         | Breaking change                    | Preserve all + add config     |
| Create circular dependencies      | Build fails, refactoring nightmare | Refactor dependencies first   |
| Export incompatible API           | Can't merge with other games       | Design extensible interface   |
| Forget to update all consumers    | Some apps still have old code      | Grep for all uses, update all |
| Document nothing                  | Next person doesn't understand it  | Add JSDoc, feature matrix     |

---

**📁 PIN THIS**: Always audit, search, merge intelligently, preserve features, maintain compatibility. Do this BEFORE extracting, not after.
