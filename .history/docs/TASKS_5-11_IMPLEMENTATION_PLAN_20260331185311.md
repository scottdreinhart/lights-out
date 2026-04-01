# Tasks 5-11: CSP Puzzle Games Implementation Plan

**Date**: March 31, 2026  
**Status**: 🎯 READY FOR EXECUTION  
**Scope**: Create 7 CSP puzzle games (Tasks 5-11)  
**Integration**: Unified CSP solver + CQRS infrastructure (Task 4)  
**Foundation**: Completed CSP core + propagation + generator + workers + CQRS  

---

## 📊 Audit Findings Summary

### Current Portfolio (26 Games)
- ✅ **26 production-ready game shells** with perfect architecture
- ✅ **domain/app/ui split** standardized across all games
- ✅ **Cross-platform support** (Electron, Capacitor, Web)
- ❌ **0 CSP puzzle games exist** (none of the 7 target games)
- ⚠️ **Low test coverage** (~20% of games)

### Target Games Status
| Task | Game | Type | Status | Priority |
|------|------|------|--------|----------|
| **5** | **Mini Sudoku** | CSP Puzzle | ❌ Create | 🔴 Critical (simplest) |
| **6** | **Queens** | CSP Puzzle | ❌ Create | 🟠 High |
| **7** | **Tango** | CSP Puzzle | ❌ Create | 🟠 High |
| **8** | **Zip** | CSP Puzzle | ❌ Create | 🟠 High |
| **9** | **Crossclimb** | CSP Puzzle | ❌ Create | 🟠 High |
| **10** | **Pinpoint** | CSP Puzzle | ❌ Create | 🟠 High |
| **11** | **Patches** | CSP Puzzle | ❌ Create | 🟠 High |

---

## 🏗️ Reference Architecture

All 7 games follow the unified pattern. **Example: Mini Sudoku**

```
apps/mini-sudoku/
├── src/
│   ├── domain/
│   │   ├── types.ts              ← Game-specific types
│   │   │   ├── Cell (4x4 grid cells)
│   │   │   ├── Box (2x2 regions)
│   │   │   ├── Difficulty enum
│   │   │   └── SudokuCSPState
│   │   ├── constraints.ts        ← Game rules
│   │   │   ├── UniquenessConstraint (row/col/box)
│   │   │   └── ValueRangeConstraint (1-4)
│   │   ├── rules.ts              ← Validation & move legality
│   │   │   ├── isValidMove(state, cellId, value): boolean
│   │   │   ├── getConflictingCells(state, cellId): cellId[]
│   │   │   └── isComplete(state): boolean
│   │   ├── templates.ts          ← CSP templates for generation
│   │   │   ├── createMiniSudokuCSP(): CSP
│   │   │   └── applyDifficulty(csp, Difficulty): CSP
│   │   ├── constants.ts          ← Configuration
│   │   │   ├── BOARD_SIZE = 4
│   │   │   ├── BOX_SIZE = 2
│   │   │   ├── DIFFICULTY_RANGES
│   │   │   └── THEME colors
│   │   ├── ai.ts                 ← Game-specific solver hints
│   │   │   ├── provideHint(state, hintType): HintData
│   │   │   └── estimateDifficulty(csp): DifficultyMetrics
│   │   ├── index.ts              ← Barrel export
│   │   └── __tests__/
│   │       ├── types.test.ts
│   │       ├── constraints.test.ts
│   │       ├── rules.test.ts
│   │       └── ai.test.ts
│   │
│   ├── app/
│   │   ├── hooks/
│   │   │   ├── useMiniSudoku.ts ← Main game hook (orchestrates domain + CQRS)
│   │   │   │   ├── initialize()
│   │   │   ├── useGameState.ts   ← CQRS integration
│   │   │   └── useHints.ts       ← Hint management
│   │   ├── commands/
│   │   │   └── sudokuCommandHandlers.ts (assign, clear, undo, etc.)
│   │   ├── queries/
│   │   │   └── sudokuQueryHandlers.ts (getCell, getCandidates, etc.)
│   │   └── index.ts
│   │
│   ├── ui/
│   │   ├── atoms/
│   │   │   ├── SudokuCell.tsx     ← Single cell component
│   │   │   └── CandidateList.tsx
│   │   ├── molecules/
│   │   │   ├── SudokuRow.tsx
│   │   │   └── SudokuBox.tsx
│   │   ├── organisms/
│   │   │   ├── SudokuBoard.tsx    ← Full 4x4 board
│   │   │   ├── GameControls.tsx
│   │   │   └── DifficultyPicker.tsx
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── index.tsx
│   └── styles.css
│
├── public/
│   ├── manifest.json
│   └── [icons]
├── vite.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🔄 Game Implementation Workflow

### For Each Game (Task X):

#### **Phase 1: Domain Design (Day 1-2)**
1. **Define Game Logic**
   - CSP variables (cells/positions)
   - CSP domains per variable
   - Game-specific constraints
   - Difficulty mapping (EASY → clues, spread)

2. **Create Types** (`domain/types.ts`)
   - Cell/position representation
   - State interface
   - Difficulty enum
   - Game-specific constants

3. **Implement Rules** (`domain/rules.ts`)
   - Move validation (isValidMove)
   - Constraint checking (getConflictingCells)
   - Completion detection (isComplete)
   - Difficulty estimation

4. **Design Constraints** (`domain/constraints.ts`)
   - Use CSP constraint abstractions from Task 1
   - Game-specific constraint types
   - Constraint factory for different difficulty levels

5. **CSP Template** (`domain/templates.ts`)
   - Create empty CSP instance
   - Apply difficulty-based clue settings
   - Return configured CSP ready for solver

#### **Phase 2: Integration (Day 3)**
1. **Connect to CSP Solver**
   - Register game constraints with solver
   - Test with BacktrackingSolver
   - Verify solvability validation

2. **Connect to CQRS** (`app/commands/`, `app/queries/`)
   - `AssignValueCommand` handler (validate + dispatch `ValueAssignedEvent`)
   - `ClearCellCommand` handler
   - `GetCellCandidatesQuery` handler
   - `IsCompletedQuery` handler
   - Plus all standard commands/queries from Task 4

3. **Create Game Hook** (`app/hooks/useGameName.ts`)
   - Wrap useCQRS()
   - Provide game-specific methods
   - Handle game initialization
   - Wire up solver for hints

#### **Phase 3: UI (Day 4)**
1. **Atoms** (SudokuCell, CellValue, Candidates, etc.)
   - Purely presentational
   - Input handling
   - Visual feedback for conflicts

2. **Molecules** (Row, Box, Row with candidates, etc.)
   - Compose atoms
   - Layout logic
   - Responsive awareness

3. **Organisms** (GameBoard, Controls, DifficultyPicker)
   - Full game screen
   - Connects to useGameName hook
   - Dispatches commands
   - Subscribes to events

#### **Phase 4: Tests (Day 5)**
1. **Domain Tests** (50+ assertions per game)
   - Rules validation
   - Constraint checking
   - Difficulty estimation
   - CSP template creation

2. **Hook Tests**
   - Game initialization
   - State transitions
   - Command execution
   - Query results

3. **UI Tests** (snapshot tests)
   - Component rendering
   - Responsive behavior
   - Event handling

---

## 📋 Task Breakdown: 5-11

### **Task 5: Mini Sudoku (4×4, 2×2 boxes)**

**Why First?** Simplest CSP, leverage existing sudoku knowledge

**Complexity**: ⭐⭐ (Easy)

**Key Files**:
```
apps/mini-sudoku/
├── src/domain/
│   ├── types.ts (Cell, State, Difficulty)
│   ├── constraints.ts (UniquenessConstraint, RangeConstraint)
│   ├── rules.ts (isValidMove, getConflicts)
│   ├── templates.ts (createCSP)
│   └── ai.ts (hints, difficulty estimation)
├── src/app/
│   ├── hooks/useMiniSudoku.ts
│   └── commands/*.ts / queries/*.ts (CQRS handlers)
└── src/ui/organisms/SudokuBoard.tsx
```

**Deliverables**:
- ✅ 4×4 board generation with target difficulty
- ✅ Move validation + constraint checking
- ✅ Hint system (candidates, techniques)
- ✅ Undo/redo via CQRS
- ✅ CQRS event integration (ValueAssigned, PuzzleCompleted)
- ✅ Full test coverage (domain + hooks)

---

### **Task 6: Queens (N-Queens Puzzle)**

**Why Second?** Classic CSP, different constraint model than Sudoku

**Complexity**: ⭐⭐⭐ (Medium)

**Key Constraints**:
- No two queens on same row
- No two queens on same column
- No two queens on same diagonal

**Deliverables**:
- ✅ Variable placement (queen positions)
- ✅ Constraint validation (row, col, diagonal)
- ✅ Difficulty via board size (4×4 → 8×8) + clues
- ✅ Solver integration (test with backtracking)
- ✅ CQRS event stream

---

### **Task 7: Tango (Slide Puzzle)**

**Why Third?** Introduces search-based CSP (not just constraint propagation)

**Complexity**: ⭐⭐⭐ (Medium)

**Key Logic**:
- Tile sliding puzzle (like 15-puzzle)
- Goal state configuration
- Move generation + validation

**Deliverables**:
- ✅ Grid state representation
- ✅ Valid move detection
- ✅ Goal state checking
- ✅ Solvability validation
- ✅ Difficulty via scramble depth

---

### **Task 8: Zip (Zip Puzzle)**

**Complexity**: ⭐⭐⭐⭐ (Medium-Hard)

**Key Logic**:
- Connect adjacent cells with paths
- Path uniqueness constraints
- Number clue validation

**Deliverables**:
- ✅ Path constraint modeling
- ✅ Move validation (path legality)
- ✅ Clue integration
- ✅ Solution verification

---

### **Task 9: Crossclimb (Grid-Based Puzzle)**

**Complexity**: ⭐⭐⭐⭐ (Medium-Hard)

**Key Logic**:
- Climbing constraint (adjacent increasing)
- Region constraints
- Difficulty scaling

**Deliverables**:
- ✅ Adjacency constraint
- ✅ Value progression validation
- ✅ Region assignment logic

---

### **Task 10: Pinpoint (Mastermind Variant)**

**Complexity**: ⭐⭐⭐ (Medium)

**Key Logic**:
- Code-breaking (guess secret code)
- Feedback constraints (correct position, correct value)
- Move scoring

**Deliverables**:
- ✅ Code generation
- ✅ Guess validation
- ✅ Feedback scoring
- ✅ Solvability detection

---

### **Task 11: Patches (Lights-Out Variant)**

**Complexity**: ⭐⭐⭐⭐ (Medium-Hard)

**Key Logic**:
- Toggle constraints (XOR logic)
- Pattern satisfaction
- Linear algebra over GF(2)

**Deliverables**:
- ✅ Toggle state representation
- ✅ Goal state checking
- ✅ Solvability analysis
- ✅ Efficient solver (matrix methods)

---

## 🎯 CQRS Integration Pattern

**All 7 games use shared CQRS infrastructure from Task 4:**

### Command Handlers (per game)

```typescript
// Example: Mini Sudoku handlers
commandBus.register('ASSIGN_VALUE', (state, cmd) => {
  const { cellId, value } = cmd.payload
  
  // Validate using domain rules
  if (!isValidMove(state, cellId, value)) {
    return { success: false, error: 'Invalid move' }
  }
  
  // Update state
  const newAssignments = { ...state.currentAssignments, [cellId]: value }
  const newState = { ...state, currentAssignments: newAssignments }
  
  // Emit event
  const event = {
    type: 'VALUE_ASSIGNED',
    aggregateId: state.puzzleId,
    timestamp: Date.now(),
    data: { cellId, value },
  }
  
  return { success: true, newState, event }
})
```

### Query Handlers (per game)

```typescript
// Example: Get candidates for cell
queryBus.register('GET_CELL_CANDIDATES', (state, query) => {
  const { cellId } = query.payload
  const candidates = calculateCandidates(state, cellId)
  return candidates
})
```

---

## 📊 Estimated Timeline

| Task | Game | Days | Effort | Complexity |
|------|------|------|--------|-----------|
| 5 | Mini Sudoku | 5 | 📍 Low | ⭐⭐ |
| 6 | Queens | 5 | 📍 Medium | ⭐⭐⭐ |
| 7 | Tango | 5 | 📍 Medium | ⭐⭐⭐ |
| 8 | Zip | 6 | 📍 Medium-High | ⭐⭐⭐⭐ |
| 9 | Crossclimb | 6 | 📍 Medium-High | ⭐⭐⭐⭐ |
| 10 | Pinpoint | 5 | 📍 Medium | ⭐⭐⭐ |
| 11 | Patches | 6 | 📍 Medium-High | ⭐⭐⭐⭐ |
| **TOTAL** | **7 Games** | **38 days** | **~240 hours** | **Medium** |

**With queue-driven continuous delivery**: Estimate 2-3 weeks elapsed time (parallel execution).

---

## ✅ Success Criteria

### Per Game
- [ ] Domain types complete + tested
- [ ] Rules validation working
- [ ] CSP constraints defined
- [ ] Solver integration passing
- [ ] CQRS command/query handlers registered
- [ ] Game hook (useGameName) functional
- [ ] UI components responsive (5 tiers)
- [ ] Full test coverage (domain + hooks + UI)
- [ ] Difficulty generation validated
- [ ] Hint system working

### Cross-Game
- [ ] All 7 games playable end-to-end
- [ ] Consistent UX across all games
- [ ] CQRS event stream working for all
- [ ] Tests passing: `pnpm validate`
- [ ] Performance: solve <100ms (sync), <500ms (async)
- [ ] Bundle size: <2MB (META requirement)

---

## 🔧 Dependencies Resolved

✅ **Task 4 (CQRS)**: CommandBus, QueryBus, event infrastructure  
✅ **Task 3 (Workers)**: Async solver/generator offloading  
✅ **Task 2 (Generator)**: Puzzle generation with difficulty  
✅ **Task 1 (Propagation)**: AC-3 constraint propagation  
✅ **CSP Core**: Solver, types, constraints  

**All dependencies ready. Tasks 5-11 can proceed immediately.**

---

## 📝 Starting Point: Task 5

**First game: Mini Sudoku (simplest, most similar to existing Sudoku)**

### Setup (Day 1)
```bash
# Create app scaffold
mkdir -p apps/mini-sudoku/src/{domain,app/hooks,ui}
cp -r apps/sudoku/public apps/mini-sudoku/
cp apps/sudoku/package.json apps/mini-sudoku/  # adjust name
cp apps/sudoku/tsconfig.json apps/mini-sudoku/
cp apps/sudoku/vite.config.js apps/mini-sudoku/
```

### Domain (Days 1-2)
- Start with `domain/types.ts` (Cell, Box, State, Difficulty)
- Implement `domain/constraints.ts` (uniqueness, range)
- Build `domain/rules.ts` (validation functions)
- Create `domain/templates.ts` (CSP factory)

### Integration (Day 3)
- Wire into commandBus (Task 4 infrastructure)
- Register command handlers
- Register query handlers
- Test with mock state

### UI & Hook (Days 4-5)
- Create `useMiniSudoku.ts` hook
- Build UI organisms
- Connect to CQRS via hook
- Full test suite

---

## 🎯 Ready to Execute

**Proceed with Task 5 (Mini Sudoku)** at queue pace.

All infrastructure in place. No blockers.
