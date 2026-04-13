# 💡 Atomic Design Enforcement — Quick Reference Card

**Print this. Keep it visible.** 🖨️

---

## The Rule 🎯

```
PAGES ↑ Can import everything
  ↑ TEMPLATES: Can import ≤ organisms
    ↑ ORGANISMS: Can import ≤ molecules (NOT organisms)
      ↑ MOLECULES: Can import ≤ atoms
        ↑ ATOMS: Can only import from @/domain, @/app
```

**All layers can import: @/domain, @/app**

---

## Component Size Limits

| Atom  | Molecule | Organism | Template | Page  |
| ----- | -------- | -------- | -------- | ----- |
| <200  | <300     | <350     | <350     | no    |
| lines | lines    | lines    | lines    | limit |

**Exceeding? Decompose by concern.**

---

## Import Checklist ✅

Before you write `import`:

```tsx
// Ask: Where is the source file?
```

**src/ui/atoms/Button.tsx** trying to import from:

- ✅ `@/domain` or `@/app` → OK
- ✅ Other atoms → OK
- ❌ Molecules → ERROR (boundaries/element-types)
- ❌ Organisms → ERROR (boundaries/element-types)

**src/ui/molecules/FormGroup.tsx** trying to import from:

- ✅ `@/domain` or `@/app` → OK
- ✅ Atoms or molecules → OK
- ❌ Organisms → ERROR (boundaries/element-types)

**src/ui/organisms/GameBoard.tsx** trying to import from:

- ✅ `@/domain` or `@/app` → OK
- ✅ Atoms or molecules → OK
- ✅ Other organisms (if refactored to molecules) → OK
- ❌ Other organisms (direct) → ERROR (boundaries/element-types)

---

## When to Extract 🔄

| File Size     | Status | Action          |
| ------------- | ------ | --------------- |
| <250 lines    | ✅     | Keep            |
| 250-350 lines | ⚠️     | Review concerns |
| 350-450 lines | 🔴     | Extract now     |
| >450 lines    | 🔴     | Large extract   |

**Extract to:**

- State → Custom hook (`@/app/hooks/`)
- Computed values → `useMemo` within component
- Event handlers → Named functions or hook
- Sub-layout → Presentational molecule
- Full feature → Organism (if splitting another organism)
- Domain logic → `@/domain/`

---

## ESLint Errors: Quick Fixes

**Error: `boundaries/element-types: Element atom should not depend on molecule`**

```tsx
// ❌ This:
import { FormGroup } from '@/ui/molecules' // ERROR: atom can't import molecule

// ✅ Fix: Prop instead
interface ButtonProps {
  label?: string // Parent passes what Button needs
}
```

**Error: `boundaries/element-types: Element molecule should not depend on organism`**

```tsx
// ❌ This:
import { GameBoard } from '@/ui/organisms' // ERROR: molecule can't import organism

// ✅ Fix: Lift to organism or template
// Move composition upward in hierarchy
```

**Error: `complexity: Cyclomatic complexity is 12, exceeds 8`**

```tsx
// ❌ This (11 branches = too complex):
if (mode === 'edit') { ... }
else if (mode === 'view') { ... }
// ... 6 more conditions

// ✅ Fix: Extract branches to custom hook
const renderContent = () => {
  const { jsx } = useModeRenderer(mode)
  return jsx
}
```

---

## File Structure

```
Button/
├── Button.tsx                        (component)
├── Button.module.css                 (styles only)
├── Button.component.test.tsx         (tests)
├── Button.md (optional)              (design notes)
└── index.ts                          (export)

export { Button } from './Button'
export type { ButtonProps } from './Button'
```

---

## Essential Commands

```bash
# Check architecture
pnpm lint

# Fix what you can auto-fix
pnpm lint --fix

# Type checking + lint + test + build
pnpm validate  # FULL GATE

# Test your component
pnpm test Button.component
```

**`pnpm validate` passes = you're good to commit.** ✅

---

## Component Anatomy

### Atom (Simple) ⚛️

```tsx
export const Button: React.FC<ButtonProps> = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
)
```

- Props control everything
- No hooks (except memo if needed)
- Pure presentation

### Molecule (Light State) 🧬

```tsx
const FormGroup: React.FC<FormGroupProps> = ({ label, value, onChange }) => {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <Label text={label} />
      <Input value={value} onChange={onChange} onFocus={() => setFocused(true)} />
    </div>
  )
}
```

- Light state only (UI state like focus, hover)
- Composes atoms
- No domain logic

### Organism (Complex) 🦑

```tsx
const GameBoard: React.FC<Props> = ({ difficulty, onEnd }) => {
  const { board, score, moves, move } = useGameLogic(difficulty)
  const [selectedCell, setSelected] = useState(null)

  const handleMove = (row, col) => {
    if (isValidMove(board, row, col)) {
      move(row, col)
    }
  }

  return (
    <div>
      <GameBoardGrid board={board} onCellClick={handleMove} />
      <StatusBar score={score} moves={moves.length} />
    </div>
  )
}
```

- Feature coordination
- Uses `@/app` hooks (game logic, context)
- Accesses `@/domain` (validation, rules)
- Composes atoms + molecules

---

## Anti-Patterns 🚫

❌ **Atom imports molecule:**

```tsx
// WRONG
import { FormGroup } from '@/ui/molecules'
```

❌ **Component has 450+ lines:**

```tsx
// WRONG: Extract by concern
// Extract state → hook
// Extract sub-UI → molecules
```

❌ **Mixed concerns in organism:**

```tsx
// WRONG: API call in component
const [users, setUsers] = useState([])
useEffect(() => fetch('/api/users'), [])

// RIGHT: Move to @/app hook
const users = useFetchUsers()
```

❌ **Domain logic in UI:**

```tsx
// WRONG
const isWinning = board.filter((cell) => cell === 'X').length > 5

// RIGHT: Move to @/domain
const isWinning = checkWinCondition(board)
```

---

## The Mental Model 🧠

```
Think of: ⚛️ ← 🧬 ← 🦑 ← 🏗️ ← 📄

Each level is DENSER with responsibility

⚛️ ATOM      = Pure presentation (100% reusable)
🧬 MOLECULE  = Composed presentation (90% reusable)
🦑 ORGANISM  = Feature coordination (50% reusable)
🏗️ TEMPLATE  = Page layout (might be unique)
📄 PAGE      = Route + full composition (unique)

Lower levels = more reusable
Higher levels = more specific
```

---

## Red Flags ⚠️

| Sign                           | Fix                                   |
| ------------------------------ | ------------------------------------- |
| Component imports org-level UI | Move import up in hierarchy           |
| File >350 lines                | Extract state/handlers/sub-components |
| Many useEffect hooks           | Review if belongs in @/app            |
| Domain logic in JSX            | Extract to @/domain functions         |
| >30 lines of comments          | Extract to `.md` companion file       |
| Complex conditional rendering  | Extract branches to utility function  |

---

## Success Checklist ✅

- [ ] `pnpm lint` passes (no boundary errors)
- [ ] File is <~350 lines (or <~250 if in lower tier)
- [ ] No downward imports (atom→molecule, mol→org)
- [ ] Domain logic in `@/domain/`
- [ ] State management in `@/app/hooks/`
- [ ] Component folder has `index.ts` barrel
- [ ] Tests present (`.component.test.tsx`)
- [ ] Comments are brief (or extracted to `.md`)

**All green? Commit. 🚀**

---

## Still Stuck?

| Question                  | Answer Location                                         |
| ------------------------- | ------------------------------------------------------- |
| "How do I decompose [X]?" | `ATOMIC-DESIGN-DECOMPOSITION-PATTERNS.md`               |
| "Where does [Y] go?"      | `ATOMIC-DESIGN-ENFORCEMENT.md` (Responsibility section) |
| "Why does it matter?"     | `AGENTS.md` § 3-4 (Architecture)                        |
| "How do I test [Z]?"      | `.github/instructions/17-testing.instructions.md`       |

---

## Remember

**Architecture is enforced, not suggested.**

Violations = `pnpm lint` fails.  
Compliance = automatic & auditable.  
Scale grows with structure, not despite it.

**Questions? Ask team. Rules? Check ESLint.** ✅

---

**Version**: 1.0  
**Last Updated**: April 2026  
**Authority**: AGENTS.md § 3-4 + eslint.config.js

Print and share! 🖨️
