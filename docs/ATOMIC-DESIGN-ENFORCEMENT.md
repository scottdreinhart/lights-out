# 💡 Atomic Design ESLint Enforcement

**Status**: ✅ **ENFORCED** — Architecture is auditable and validated at lint time  
**Authority**: `.eslintrc.js` with `eslint-plugin-boundaries`  
**Scope**: All React components across `src/ui/` and `apps/*/src/ui/`

---

## Architecture Layers (Enforced)

The following atomic design hierarchy is **strictly enforced** and **auditable via ESLint**:

```
┌────────────────────────────────────────────────────┐
│                    PAGES                            │
│        (Full page applications, templates)          │
│  ✓ Compose templates, organisms, molecules, atoms  │
│  ✓ Access app hooks, context, domain logic         │
└────────────────────────────────────────────────────┘
                        ↓ composes
┌────────────────────────────────────────────────────┐
│                  TEMPLATES                          │
│     (Page-level layouts, page shells, layouts)     │
│  ✓ Compose organisms, molecules, atoms             │
│  ✓ Access app hooks, context, domain logic         │
└────────────────────────────────────────────────────┘
                        ↓ composes
┌────────────────────────────────────────────────────┐
│                  ORGANISMS                          │
│      (Feature components, complex interactions)    │
│  ✓ Compose molecules, atoms                        │
│  ✓ Small state management, effects, event handling │
│  ✓ Access app hooks (useTheme, useResponsive)     │
│  ✓ Access domain logic directly                    │
│  ❌ Must NOT compose other organisms               │
└────────────────────────────────────────────────────┘
                        ↓ composes
┌────────────────────────────────────────────────────┐
│                  MOLECULES                          │
│     (Composed atoms, groups, reusable patterns)    │
│  ✓ Compose atoms only                              │
│  ✓ Local state (open/close, hovered, etc.)        │
│  ✓ Access app hooks (but minimal side effects)     │
│  ❌ Must NOT compose organisms                      │
│  ❌ Must NOT contain feature-level logic            │
└────────────────────────────────────────────────────┘
                        ↓ composes
┌────────────────────────────────────────────────────┐
│                   ATOMS                             │
│       (Visual primitives, pure presentation)       │
│  ✓ Render content based on props only              │
│  ✓ Minimal internal state (focus, hover)          │
│  ✓ NO app context access                          │
│  ✓ NO domain logic                                 │
│  ❌ Must NOT compose other atoms into hierarchies   │
│  ❌ Pure presentational components only             │
└────────────────────────────────────────────────────┘
```

---

## ESLint Rules (Enforced)

### Boundary Rules: Import Restrictions

The following imports are **enforced by ESLint** (`boundaries/element-types`):

| From Layer   | Can Import                                                  | Cannot Import                   |
| ------------ | ----------------------------------------------------------- | ------------------------------- |
| **Atom**     | `@/domain`, `@/app`, other atoms                            | molecules, organisms            |
| **Molecule** | `@/domain`, `@/app`, atoms, other molecules                 | organisms, templates            |
| **Organism** | `@/domain`, `@/app`, atoms, molecules, organisms            | templates, pages                |
| **Template** | `@/domain`, `@/app`, atoms, molecules, organisms, templates | pages (within same template ok) |
| **Page**     | All layers (max composition freedom)                        | N/A (end of hierarchy)          |

**Violation Example** (Will fail ESLint):

```tsx
// ❌ FAIL: Molecule importing organism
// src/ui/molecules/FormGroup.tsx
import { GameBoard } from '@/ui/organisms' // Boundaries violation!

// ❌ FAIL: Atom importing molecule
// src/ui/atoms/Button.tsx
import { FormGroup } from '@/ui/molecules' // Boundaries violation!

// ✅ PASS: Organism importing molecules
// src/ui/organisms/GameBoard.tsx
import { FormGroup } from '@/ui/molecules' // OK

// ✅ PASS: Molecule importing atoms
// src/ui/molecules/FormGroup.tsx
import { Label } from '@/ui/atoms' // OK
```

**Run ESLint to validate**:

```bash
pnpm lint  # Validates all imports
# Error: boundary/element-types: Element Layer.type should not depend on Layer.type (current)
```

---

## Responsibility Boundaries (Strict)

### Atoms: Pure Presentational Primitives

**What atoms are for**:

- Visual building blocks (Button, Label, Input, Card, Badge, Icon)
- Minimal props (no complex state management)
- Render content based on received props only
- Optional: local UI state (focus, hover, active)

**What atoms must NOT do**:

- ❌ Contain business logic
- ❌ Access app hooks (useTheme is ok; complex hooks are not)
- ❌ Manage feature state
- ❌ Compose other atoms into hierarchies
- ❌ Access domain logic directly
- ❌ Perform side effects (useEffect for non-UI concerns)
- ❌ Exceed 150-200 lines of code

**Change: Atom file size → decompose by responsibility**:

If an atom exceeds ~150 lines:

1. Extract reusable markup patterns into separate atomic files
2. Extract internal helpers into utilities (not modules)
3. Extract complex style logic into CSS Module
4. Extract accessibility concerns into separate functions/components
5. Never keep mixed concerns in the same atom just because it "still works"

---

### Molecules: Composed Atoms with Light Orchestration

**What molecules are for**:

- Composed atom groups (FormGroup = Label + Input)
- Reusable layout patterns (MenuSection = Icon + Label)
- Light state management (open/close, selected, hovered)
- Wrapping atoms in semantic meaning

**What molecules must NOT do**:

- ❌ Compose organisms
- ❌ Import from organisms layer
- ❌ Contain feature-level logic
- ❌ Manage complex state (that's organisms' job)
- ❌ Access context providers for business state
- ❌ Exceed 250-300 lines of code

**Change: Molecule file size → decompose to atoms or organisms**:

If a molecule exceeds ~250 lines:

1. Extract repeated atom patterns as new atoms
2. Extract layout/composition logic as new molecule
3. Extract state management as custom hook (belongs in app layer)
4. Extract feature logic to organism
5. Ensure molecule is a **pure composition**, not a feature container

---

### Organisms: Feature Components

**What organisms are for**:

- Complete feature implementations (GameBoard, Modal, Navigation)
- Compose molecules and atoms (not other organisms)
- Reasonable state management (useState, useCallback, hooks from @/app)
- Event handling and user interaction orchestration
- Access to domain logic, app hooks, context

**What organisms must NOT do**:

- ❌ Compose other organisms (prevents unnecessary nesting)
- ❌ Become monolithic "god components" (decompose by responsibility)
- ❌ Mix unrelated features (split into separate organisms)
- ❌ Exceed 350-400 lines of code

**Decomposition by Responsibility** (When organisms get too large):

If an organism exceeds ~350 lines, decompose by concern:

1. **Extract State Coordination** → Custom Hook (in `@/app`)

   ```tsx
   // Extract complex state logic
   const useGameState = () => {
     /* state logic */
   }
   // Organism imports hook, stays focused on rendering
   ```

2. **Extract Derived State** → Separate Hook or Selector

   ```tsx
   // Extract computed values from state
   const validMoves = useMemo(() => computeValid(...), [state])
   // Keep in separate hook for reuse and testability
   ```

3. **Extract Event Handlers** → Separate File or Utilities

   ```tsx
   // Extract non-trivial handlers into named functions
   const handlers = {
     onMove: (move) => {
       /* ... */
     },
     onUndo: () => {
       /* ... */
     },
   }
   ```

4. **Extract Data Transformation** → Domain Functions

   ```tsx
   // Move business logic to @/domain
   const result = transformGameState(state, move)
   ```

5. **Extract Accessibility Concerns** → ARIA Utilities

   ```tsx
   // Extract a11y logic to separate functions
   const { ariaLabel, ariaDescribedBy } = getA11yAttrs(...)
   ```

6. **Extract Styling** → CSS Module (already done)

   ```css
   /* Complex style logic goes in separate .module.css */
   ```

7. **Decompose into Sub-Organisms** (if truly warranted)
   ```tsx
   // Only if responsibility is truly distinct
   // GameBoard.tsx composes GameBoardHeader + GameBoardGrid + GameBoardStatus
   ```

---

### Templates: Page-Level Layouts

**What templates are for**:

- Page shell structure (header, sidebar, main, footer)
- Page-wide layout composition (not logic)
- Route-level concerns (breadcrumbs, navigation patterns)

**What templates must NOT do**:

- ❌ Contain page-specific logic (move to organisms)
- ❌ Become feature containers
- ❌ Exceed 200-250 lines

---

### Pages: Full Page Applications

**What pages are for**:

- Complete page implementations
- Route handlers
- Page-level context setup
- Full composition freedom

---

## Comment Extraction Rule (Enforced by Convention)

### When to Extract Comments to Markdown

If a component file accumulates substantial **inline comments**, that commentary should be extracted to a neighboring `*.md` file.

**Threshold**: > ~30 lines of cumulative comments → extract to markdown

**Example**:

```tsx
// ❌ BAD: Large narrative comments in source
const GameBoard = () => {
  // The board state is stored in component state, but we need to
  // coordinate between the game engine (in domain), the UI state,
  // and the undo system. This was tricky to get right because...
  // [20 more lines of explanation]
  const [board, setBoard] = useState(...)
  // ...
}

// ✅ GOOD: Extract to GameBoard.md, keep source clean
// GameBoard.tsx
const GameBoard = () => {
  const [board, setBoard] = useState(...)
  // ...
}

// GameBoard.md (new file)
// # GameBoard Component Design
//
// ## State Coordination
// The board state is stored in component state, but we need to coordinate...
// [Full explanation in markdown]
```

**Files to Extract Comments Into**:

```
ComponentName.tsx          (Component source)
├── ComponentName.md       (Design rationale & notes)
├── ComponentName.design.md (Complex design decisions)
├── ComponentName.notes.md  (Implementation notes)
├── ComponentName.policy.md (Access control, permissions)
└── ComponentName.a11y.md   (Accessibility justification)
```

**What Goes in Markdown**:

| Content              | Location                  | When                      |
| -------------------- | ------------------------- | ------------------------- |
| Design rationale     | `ComponentName.md`        | Why design is this way    |
| Implementation notes | `ComponentName.notes.md`  | Why code is this way      |
| Deferred work        | `ComponentName.md`        | Known issues, TODO items  |
| Permission model     | `ComponentName.policy.md` | Access control logic      |
| A11y justification   | `ComponentName.a11y.md`   | Why certain a11y approach |
| Migration guidance   | `ComponentName.md`        | How to update/decompose   |
| Complex algorithms   | `ComponentName.notes.md`  | Non-obvious logic         |

**Source Comment Guidelines**:

Keep source comments:

- ✅ Short (1-3 lines)
- ✅ Local (adjacent to code they explain)
- ✅ Implementation-specific (why this code, not that code)
- ✅ Non-obvious (skip obvious comments)

Remove from source:

- ❌ Multi-line narrative blocks
- ❌ Design history or rationale
- ❌ "Why we chose this architecture"
- ❌ Deferred work or known issues (document separately)

---

## ESLint Validation

### Run Linter

```bash
pnpm lint  # Validates all files
# OR
pnpm lint --fix  # Auto-fixes where possible
```

### Violations You'll See

**Boundary Violations**:

```
Element Layer.type should not depend on Layer.type
→ File is in wrong atomic layer or importing from disallowed layer
```

**Complex Components**:

```
Function complexity is too high (9)
→ Component has too many branches; decompose by responsibility
```

**Component Responsibility Violations**:

```
Prefer stateless function
→ Component should be simpler or refactored as hook
```

---

## Workflow: Enforcing Atomic Design

### 1. Design Phase

- Identify responsibility: Is this atom, molecule, organism, template, or page?
- Place file in correct directory
- ESLint will enforce boundaries automatically

### 2. Implementation Phase

- Follow atomic design constraints (see **Responsibility Boundaries** above)
- If component exceeds size threshold, decompose **during implementation**
- Keep comments short; extract long-form explanation to `.md`

### 3. Review Phase

- Run `pnpm lint` — ESLint validates atomic design compliance
- Check for boundary violations
- Ensure component responsibility is clear
- Review file size against threshold (ESLint complexity rule helps)

### 4. Commit Phase

```bash
pnpm lint --fix  # Fix all auto-fixable issues
git add .
git commit -m "feat(ui): add GameBoard organism"
```

---

## Success Criteria

✅ **The architecture is enforced** — ESLint prevents boundary violations  
✅ **Each atomic level is distinct** — Clear responsibility at each layer  
✅ **Large components are decomposed** — By responsibility, not by convenience  
✅ **Mixed concerns are separated** — State, logic, presentation distinct  
✅ **Documentation is clear** — Long-form explanation in markdown, source clean  
✅ **Code is readable and testable** — Proper boundaries = proper testing  
✅ **No regressions possible** — ESLint validates every commit

---

## Quick Reference

| Task            | Command               | Result                          |
| --------------- | --------------------- | ------------------------------- |
| Check all files | `pnpm lint`           | ESLint validates architecture   |
| Auto-fix issues | `pnpm lint --fix`     | Auto-fixes formatting, imports  |
| Run per scope   | `pnpm lint:scope:app` | Lint specific scope             |
| Full validation | `pnpm validate`       | lint + typecheck + test + build |

---

## FAQ

**Q: My atom has internal state, is that ok?**  
A: Yes. Atoms can have local UI state (focus, hover, active). Just don't have complex state management.

**Q: Can molecules use useState?**  
A: Yes. Light state is ok (open/close, selected). Complex state should be in organism or custom hook.

**Q: What's the difference between molecule and organism?**  
A: Molecules compose atoms into reusable patterns. Organisms compose molecules/atoms into features. Organisms handle events, state coordination, domain logic access.

**Q: Can I compose organisms?**  
A: No. This creates unnecessary nesting and breaks the hierarchy. Decompose the organism to organisms of smaller responsibility instead.

**Q: My component is 45 lines, is that ok?**  
A: Absolutely. File size is not in itself a violation. What matters is responsibility clarity.

**Q: My component is 400 lines, what do I do?**  
A: Decompose by responsibility (extract state, handlers, logic) into separate hooks or utilities. Keep the component focused.

**Q: Where do custom hooks live?**  
A: In `@/app/` layer. They're part of app-level integration, not UI concerns.

**Q: Where does domain logic live?**  
A: In `@/domain/` layer. Components call it, they don't implement it.

---

## References

- **Atomic Design**: https://bradfrost.com/blog/post/atomic-web-design/
- **CLEAN Architecture**: AGENTS.md § 3-4
- **ESLint Boundaries**: https://github.com/jayu/eslint-plugin-boundaries
- **Component Responsibility**: AGENTS.md § 10 (SOLID Principles)
- **Testing Standards**: AGENTS.md § 28

---

**Architecture is enforced. Violations are auditable. Quality is guaranteed.** ✅
