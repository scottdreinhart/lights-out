# ESLint Boundary Violations — Error & Fix Guide

**When you see a linting error, find it here.** 🔍

---

## Table of Contents

1. **Import Boundary Violations** — Most common
2. **Complexity Violations** — Large components
3. **Component Responsibility Violations** — Anti-patterns
4. **Advanced Scenarios** — Edge cases

---

## 1. Import Boundary Violations 🚫

These happen when a component imports from a higher layer.

### Error: Atom imports Molecule

```
ERROR: src/ui/atoms/Button/Button.tsx
boundaries/element-types: Element atom should not depend on molecule

Import: import { FormGroup } from '@/ui/molecules'
```

**Why it failed:**

- Atoms are reusable building blocks
- They can't depend on molecules (composite components)
- Creates circular dependency risks

**Fix 1: Accept via props**

```tsx
// Button.tsx (atom)
interface ButtonProps {
  label?: string
  icon?: ReactNode
  // Button accepts what it needs from props, doesn't import
}

export const Button: React.FC<ButtonProps> = ({ label, icon, ...props }) => (
  <button {...props}>
    {icon} {label}
  </button>
)
```

**Fix 2: Move component up to molecule layer**

```tsx
// If Button really needs FormGroup semantics:
// Move to molecules/ButtonGroup/ButtonGroup.tsx
import { Button } from '@/ui/atoms'
import { FormGroup } from '@/ui/molecules' // OK here

export const ButtonGroup = () => (
  <FormGroup label="Actions">
    <Button>Cancel</Button>
    <Button>Save</Button>
  </FormGroup>
)
```

**Fix 3: Extract to parent component**

```tsx
// Parent (molecule or higher) composition
const formField = (
  <>
    <Label>Submit</Label>
    <Button onClick={handleSubmit}>Click me</Button>
  </>
)
```

---

### Error: Molecule imports Organism

```
ERROR: src/ui/molecules/FormGroup/FormGroup.tsx
boundaries/element-types: Element molecule should not depend on organism

Import: import { GameBoard } from '@/ui/organisms'
```

**Why it failed:**

- Molecules are atoms + simple composition
- Organisms are feature-level components
- Molecule can't orchestrate organism complexity

**Fix 1: Move component to organism layer**

```tsx
// Move FormGroup up to organisms/ if it's that complex
import { FormGroup } from '@/ui/organisms'

export const GameSettingsForm = () => (
  <FormGroup label="Difficulty">
    <GameBoard difficulty="medium" />
  </FormGroup>
)
```

**Fix 2: Reverse composition: organism composes molecules**

```tsx
// GameBoard (organism) composes FormGroup (molecule) ✅
import { FormGroup } from '@/ui/molecules'

export const GameBoard = () => (
  <>
    <FormGroup label="Settings">
      <select>...</select>
    </FormGroup>
    <GameGrid />
  </>
)
```

**Fix 3: Separate concerns**

```tsx
// If logic is truly mixed, split:
// molecules/FormGroup.tsx — form UI only
// organisms/GameSettingsPanel.tsx — full feature

// Page composes both separately
<FormGroup ... />  {/* Molecule */}
<GameSettingsPanel ... />  {/* Organism */}
```

---

### Error: Organism imports Organism

```
ERROR: src/ui/organisms/GameBoard/GameBoard.tsx
boundaries/element-types: Element organism should not depend on organism

Import: import { GameStatus } from '@/ui/organisms'
```

**Why it failed:**

- Each organism is a feature-level component
- Organisms shouldn't nest feature-level logic (creates complexity)
- Forces composition to template/page level

**Fix 1: Demote to molecule (if it's simple enough)**

```tsx
// If GameStatus is really just UI:
// Move to molecules/GameStatus.tsx
import { GameStatus } from '@/ui/molecules' // ✅ OK

export const GameBoard = () => (
  <>
    <GameStatus score={score} moves={moves} />
    <Grid board={board} onClick={handleMove} />
  </>
)
```

**Fix 2: Lift composition to template or page**

```tsx
// GameBoard (organism) and GameStatus (organism) shouldn't nest
// Instead, compose at template/page level:

// templates/GameTemplate.tsx
import { GameBoard } from '@/ui/organisms'
import { GameStatus } from '@/ui/organisms'

export const GameTemplate = ({ game }) => (
  <div className={styles.gameContainer}>
    <GameStatus game={game} />
    <GameBoard game={game} />
    <GameControls game={game} />
  </div>
)
```

**Fix 3: Extract shared UI to molecule**

```tsx
// If both organisms need similar UI, extract it:

// organisms/GameBoard.tsx
import { GameStatusWidget } from '@/ui/molecules' // ✅ OK

export const GameBoard = ({ game }) => (
  <>
    <GameStatusWidget game={game} />
    <Grid board={game.board} />
  </>
)
```

---

### Error: Component in Wrong Folder

```
ERROR: src/ui/molecules/GameBoard.tsx
boundaries/element-types: Unknown element type

(File path not matching any defined type)
```

**Why it failed:**

- File is in `molecules/` folder but ESLint thinks it might be larger
- Usually means component is too complex for its layer

**Fix 1: Move to correct layer**

```bash
# If GameBoard is really an organism (feature), move it:
mv src/ui/molecules/GameBoard src/ui/organisms/GameBoard
```

**Fix 2: Update folder structure**

```
src/ui/organisms/GameBoard/GameBoard.tsx  ← Correct
src/ui/molecules/GameBoard.tsx             ← Wrong (can be feature-level)
```

**Verify file is in correct folder:**

- Atoms live in: `src/ui/atoms/*/`
- Molecules live in: `src/ui/molecules/*/`
- Organisms live in: `src/ui/organisms/*/`
- Templates live in: `src/ui/templates/*/`
- Pages live in: `src/pages/*/`

---

## 2. Complexity Violations 🔴

These catch components doing too much.

### Error: Cyclomatic Complexity Too High

```
ERROR: src/ui/organisms/GameBoard/GameBoard.tsx:45
complexity: Cyclomatic complexity is 12, exceeds 8

Line 45: if (gameMode === 'single') {
```

**Why it failed:**

- Component has >8 branching paths (if/else, switch, etc.)
- Indicates mixed concerns or unclear logic

**What makes complexity:**

```tsx
if (a) { ... }      // +1
else if (b) { ... } // +1
else if (c) { ... } // +1
case x: ...         // +1 per case
? : :               // +1 per ternary
&& and || chains    // +1 per operator
```

**Fix 1: Extract branches to custom hook**

```tsx
// ❌ HIGH COMPLEXITY
const GameBoard = ({ mode, difficulty, players }) => {
  if (mode === 'single-player') {
    if (difficulty === 'easy') {
      /* ... */
    }
    if (difficulty === 'medium') {
      /* ... */
    }
    if (difficulty === 'hard') {
      /* ... */
    }
  } else if (mode === 'multi-player') {
    if (players.length === 2) {
      /* ... */
    }
    if (players.length === 3) {
      /* ... */
    }
    if (players.length === 4) {
      /* ... */
    }
  }
  return <div>{jsx}</div> // 9+ branches
}

// ✅ EXTRACTED
const useGameBoardRenderer = (mode, difficulty, players) => {
  if (mode === 'single-player') {
    if (difficulty === 'easy') return singlePlayerEasyJsx
    if (difficulty === 'medium') return singlePlayerMediumJsx
    if (difficulty === 'hard') return singlePlayerHardJsx
  }
  // ... multi-player
  return defaultJsx
}

const GameBoard = (props) => {
  const jsx = useGameBoardRenderer(props.mode, props.difficulty, props.players)
  return <div>{jsx}</div> // Complexity now in hook
}
```

**Fix 2: Extract sub-components**

```tsx
// ❌ HIGH COMPLEXITY
const Dashboard = ({ user, stats, mode }) => {
  if (mode === 'admin') return <AdminDashboard user={user} stats={stats} />
  if (mode === 'player') return <PlayerDashboard user={user} stats={stats} />
  if (mode === 'spectator') return <SpectatorDashboard user={user} />
  return <NotFoundDashboard />
}

// ✅ AS MOLECULES
const AdminDashboard = ({ user, stats }) => { /* simple */ }
const PlayerDashboard = ({ user, stats }) => { /* simple */ }
const SpectatorDashboard = ({ user }) => { /* simple */ }

// ✅ WRAPPER (organism) IS SIMPLE
const DashboardRouter = ({ user, stats, mode }) => {
  const dashboards = {
    admin: <AdminDashboard ... />,
    player: <PlayerDashboard ... />,
    spectator: <SpectatorDashboard ... />,
  }
  return dashboards[mode] || <NotFound />  // Complexity: 1
}
```

**Fix 3: Move logic to domain/utils**

```tsx
// ❌ Logic in component
const renderGameStateMessage = (state, turn, winner) => {
  if (state === 'setup') return 'Choose difficulty'
  if (state === 'playing') return `${turn}'s turn`
  if (state === 'finished' && winner) return `${winner} wins!`
  if (state === 'finished' && !winner) return 'Draw'
  if (state === 'error') return 'Something went wrong'
  return 'Unknown state'
}

// ✅ Move to @/domain (testable, reusable)
// @/domain/messages.ts
export const getGameStateMessage = (state, turn, winner) => {
  /* same logic */
}

// Component now simple:
const GameStatus = ({ state, turn, winner }) => {
  const message = getGameStateMessage(state, turn, winner)
  return <div>{message}</div>
}
```

---

## 3. Component Responsibility Violations 🔴

These catch anti-patterns in component design.

### Error: Component Too Complex (Functional Logic)

```
WARNING: src/ui/organisms/GameBoard/GameBoard.tsx
react/prefer-stateless-function: Expected a stateless component
```

**Why it failed:**

- Component uses class methods when simple function would work
- Or: component could be simplified to presentational

**Who gets this warning:**

```tsx
// Old React class style (rare)
class Button extends React.Component {
  /* ... */
}

// Or: Function that could be simpler
export const Button = (props) => {
  const [unused, setUnused] = useState(false)
  return <button>{props.children}</button>
  // State is unused; component is simpler without it
}
```

**Fix: Remove unnecessary state**

```tsx
// ❌ Unnecessary state
const Button = ({ onClick, children }) => {
  const [isClicked, setIsClicked] = useState(false)
  // never reads isClicked
  return <button onClick={onClick}>{children}</button>
}

// ✅ Simple stateless
const Button = ({ onClick, children }) => <button onClick={onClick}>{children}</button>
```

---

### Error: Using Array Index as Key

```
ERROR: src/ui/organisms/GameBoard/GameBoard.tsx:52
react/no-array-index-key: Avoid using an array key index

Line 52: {board.map((cell, idx) => <Cell key={idx} />)}
```

**Why it failed:**

- Array indices aren't stable (re-rendering can scramble them)
- React needs stable keys to track element identity

**Fix: Use unique, stable identifier**

```tsx
// ❌ BAD: Array index
{
  board.map((cell, idx) => <Cell key={idx} value={cell} />)
}

// ✅ GOOD: Unique ID from data
{
  board.map((cell) => <Cell key={cell.id} value={cell} />)
}

// ✅ GOOD: Compound key if no ID
{
  board.map((cell, row, col) => <Cell key={`${row}-${col}`} value={cell} />)
}

// ✅ GOOD: UUID if generated
{
  items.map((item) => <Item key={useId()} data={item} />)
}
```

---

### Error: Using Dangerous HTML

```
ERROR: src/ui/atoms/Card/Card.tsx:25
react/no-danger: Avoid using dangerouslySetInnerHTML

Line 25: <div dangerouslySetInnerHTML={{__html: content}} />
```

**Why it failed:**

- Opens XSS vulnerabilities (script injection)
- Should only be used for trusted content (rare)

**Fix 1: Use normal React rendering**

```tsx
// ❌ DANGEROUS
<div dangerouslySetInnerHTML={{__html: userContent}} />

// ✅ SAFE: Let React handle rendering
<div>{userContent}</div>  // React auto-escapes

// ✅ SAFE: For HTML from trusted sources
const trustedHtml = await getSafeHtmlFromServer()
<div dangerouslySetInnerHTML={{__html: trustedHtml}} />
```

**Fix 2: Parse and sanitize**

```tsx
// ✅ SAFE: Use DOMPurify or similar
import DOMPurify from 'dompurify'

const cleanHtml = DOMPurify.sanitize(userInput)
<div dangerouslySetInnerHTML={{__html: cleanHtml}} />
```

---

## 4. Advanced Scenarios 🎯

### Scenario: Component Fits in Multiple Layers

```
Question: Is GameStatus an atom or molecule?
```

**Decision tree:**

```
Does it compose other UI components?
  YES  → Molecule (or higher if complex)
  NO   → Could be Atom

Does it have internal state?
  YES  → Molecule (or higher if complex)
  NO   → Likely Atom

Does it access @/app hooks?
  YES  → Molecule (or higher if it coordinates)
  NO   → Likely Atom

Is it >~150-200 lines?
  YES  → Split it; move to higher layer
  NO   → Atom or Molecule

Can it be used in 5+ different places?
  YES  → Atom (very reusable)
  NO   → Molecule (semi-reusable)
```

**Example:**

```tsx
// GameStatus: Shows score + moves
// - No internal state ✓
// - No other component composition ✓
// - Accepts all data via props ✓
// - <200 lines ✓
// - Reusable in many games ✓
// → ATOM ⚛️

// GameSettingsPanel: Complex form with validation
// - Internal state (form values) ✓
// - Composes atoms + molecules ✓
// - Uses useForm hook ✓
// - <350 lines ✓
// - Specific to settings feature
// → MOLECULE 🧬

// GameBoard: Full feature, board state + moves
// - Complex state ✓
// - Composes molecules + atoms ✓
// - Uses multiple @/app hooks ✓
// - Accesses @/domain logic ✓
// - 250-380 lines ✓
// → ORGANISM 🦑
```

---

### Scenario: Refactoring an Oversized Component

```
Problem: GameBoard.tsx is 450 lines (too large)
```

**Strategy:**

**Step 1: Identify mixed concerns**

```tsx
// 450 lines of:
// - Board state management (100 lines)
// - Move validation (50 lines)
// - UI rendering (150 lines)
// - Move preview (75 lines)
// - Accessibility helpers (50 lines)
// - Undo/redo logic (25 lines)
```

**Step 2: Extract each concern**

```
Board state → @/app/hooks/useGameBoard.ts (100 lines)
Move validation → @/domain/validation.ts (50 lines)
Move preview → molecules/MovePreview.tsx (75 lines)
A11y helpers → @/app/hooks/useGameA11y.ts (50 lines)
Undo/redo → @/app/hooks/useGameHistory.ts (25 lines)
UI shell → organisms/GameBoard.tsx (100 lines)
```

**Step 3: Rebuild organism simply**

```tsx
export const GameBoard = ({ difficulty, onGameEnd }) => {
  const board = useGameBoard(difficulty)
  const history = useGameHistory(board, onGameEnd)
  const a11y = useGameA11y(board)

  return (
    <div {...a11y.rootProps}>
      <GameGrid board={board.current} onClick={board.move} />
      <MovePreview recent={board.lastMove} />
      <GameControls
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onUndo={history.undo}
        onRedo={history.redo}
      />
    </div>
  )
} // 40 lines of composition
```

**Result:**

- GameBoard: 40 lines (clean orchestration)
- Hooks: 225 lines (testable logic)
- Molecules: 75 lines (focused UI)
- Total same or less, but separated concerns ✅

---

### Scenario: Debugging Import Errors

```
ERROR: "Element organism should not depend on organism"
But I don't see that import!
```

**Debug steps:**

1. **Check your direct imports:**

   ```tsx
   import { GameStatus } from '@/ui/organisms' // ← Obvious
   ```

2. **Check indirect imports via barrel:**

   ```tsx
   import { GameStatus } from '@/ui' // Barrel re-exports from organisms
   // src/ui/index.ts
   export { GameStatus } from './organisms' // ← Hidden dependency
   ```

3. **Check monorepo scoping:**

   ```tsx
   // If in apps/my-game/:
   import { GameStatus } from '@/ui/organisms' // Uses root @/ui

   // vs.
   import { GameStatus } from './ui/organisms' // Uses app-scoped
   ```

4. **Run linter with verbose output:**
   ```bash
   pnpm lint --format json | jq '.[] | select(.ruleId=="boundaries/element-types")'
   ```

---

## Quick Error → Fix Mapping

| Error                                             | Root Cause              | Quick Fix                                  |
| ------------------------------------------------- | ----------------------- | ------------------------------------------ |
| `boundaries/element-types: Element X depend on Y` | Wrong layer composition | Move to higher layer or demote Y           |
| `complexity exceeds 8`                            | Too many branches       | Extract branches to hook or sub-components |
| `no-array-index-key`                              | Using `idx` in .map     | Use `.id` or compound key                  |
| `no-danger`                                       | dangerouslySetInnerHTML | Use React rendering; sanitize if needed    |
| `prefer-stateless-function`                       | Unused state            | Remove useState; make presentational       |
| `Unknown element type`                            | File in wrong folder    | Move to correct layer folder               |

---

## Prevention

**Before you commit:**

```bash
pnpm lint --fix  # Auto-fixes what it can
pnpm validate    # Full quality gate

# No errors? ✅ Commit!
```

**In pre-commit hook:**

```bash
git commit  # Runs: pnpm lint (blocks if errors)
```

**In CI/CD:**

```bash
pnpm validate  # Runs on every PR
# Must pass before merge
```

---

## When All Else Fails

1. **Read the ESLint rule docs:**
   - `eslint-plugin-boundaries`: https://github.com/jayu/eslint-plugin-boundaries
   - React rules: https://github.com/jsx-eslint/eslint-plugin-react

2. **Check the enforcement guide:**
   - `docs/ATOMIC-DESIGN-ENFORCEMENT.md` (sections on each layer)

3. **Ask team:**
   - Slack/chat with architecture team
   - Reference specific error message

4. **Create an exception (rare):**

   ```tsx
   // Only if absolutely necessary
   // eslint-disable-next-line boundaries/element-types
   import { GameBoard } from '@/ui/organisms'

   // Add comment explaining why:
   // JUSTIFICATION: Special case needed for [reason]
   // Reviewed by: @[reviewer]
   ```

---

**Version**: 1.0  
**Last Updated**: April 2026  
**Authority**: eslint.config.js + ATOMIC-DESIGN-ENFORCEMENT.md

**Remember: ESLint is your friend. It catches problems before code review.** ✅
