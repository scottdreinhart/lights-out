# Standards Expansion Strategy

**Date**: April 29, 2026  
**Status**: Planning & Prioritization  
**Focus**: Config files, documentation, test standards, component naming

---

## 📊 Current Inventory

| Category            | Count  | Notes                                             |
| ------------------- | ------ | ------------------------------------------------- |
| JSON Config Files   | ~1,384 | package.json, tsconfig.json, vite.config.js, etc. |
| Markdown Documents  | ~310   | docs/, project-level READMEs, governance files    |
| Shell Scripts (.sh) | 148    | ✅ Standardized (COLORS blocks)                   |
| Node Scripts (.mjs) | 84     | ✅ Standardized (COLORS objects)                  |

---

## 🎯 Expansion Roadmap

### **Phase 1: Configuration Files (Medium Effort, High Impact)**

#### **Target 1.1: Package.json Standardization**

**Scope**: ~110 package.json files (root + all 51 app packages)

**What to standardize**:

- Field ordering (name, version, description, type, private, etc.)
- Scripts naming convention (validate, lint, format, build, test)
- Dependency grouping (dependencies, devDependencies, peerDependencies)
- Metadata (author, license, repository, keywords)

**Example Standard Structure**:

```json
{
  "name": "@games/checkers",
  "version": "1.0.0",
  "description": "Checkers game for Game Platform",
  "type": "module",
  "private": true,
  "license": "PROPRIETARY",
  "author": "Game Platform Team",

  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "validate": "pnpm check && pnpm build",
    "check": "pnpm lint && pnpm format:check && pnpm typecheck",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "format:check": "prettier --check src/",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },

  "dependencies": {
    /* ... */
  },
  "devDependencies": {
    /* ... */
  },
  "peerDependencies": {
    /* ... */
  }
}
```

**Benefit**: Consistency, easier cross-app navigation, scripting automation

**Effort**: ~2-3 hours (tooling can automate reordering)

---

#### **Target 1.2: TypeScript Config (tsconfig.json)**

**Scope**: ~10-15 tsconfig files (root + apps/\*/tsconfig.json)

**Current State**: Varied compiler options, inconsistent extends chains

**Standardize**:

- Strict mode settings (strict, noImplicitAny, etc.)
- Module settings (module, target, moduleResolution)
- Path aliases (baseUrl, paths)
- Emit settings (declaration, declarationMap, sourceMap)
- Output structure (outDir, rootDir)

**Example Standard**:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",

    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,

    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/domain/*": ["src/domain/*"],
      "@/app/*": ["src/app/*"],
      "@/ui/*": ["src/ui/*"]
    }
  }
}
```

**Benefit**: Consistent type checking, fewer errors, better IDE support

**Effort**: ~1 hour (mostly validation)

---

### **Phase 2: Documentation Standards (Low Effort, Medium Impact)**

#### **Target 2.1: README.md Template**

**Scope**: ~60 README files (root, /docs, apps/\*/README.md)

**Standardize**:

- Section ordering (Overview, Quick Start, Installation, Usage, Testing, API, Contributing)
- Code example formatting
- Badge standards (build status, license, version)
- Link formatting

**Example Template**:

```markdown
# Project/Game Name

> Short description

[![Build Status](shield)](build) [![License](shield)](LICENSE)

## Quick Start

### Prerequisites

- Node.js 24+
- pnpm 10.31.0

### Installation

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

### Running Tests

\`\`\`bash
pnpm test
pnpm test:coverage
\`\`\`

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Contributing](CONTRIBUTING.md)
- [API Reference](docs/API.md)

## Troubleshooting

### Issue: X

Solution: Y

## Resources

- [Parent Project](../README.md)
- [Governance](AGENTS.md)
```

**Benefit**: Better onboarding, consistent documentation experience

**Effort**: ~2 hours (create template, apply to 10 key docs)

---

#### **Target 2.2: Governance Document Format**

**Scope**: AGENTS.md, CLAUDE.md, OPENAI.md, copilot-instructions.md

**Standardize**:

- Section numbering convention (§ 1, § 2, etc.)
- Authority chain presentation
- Rule formatting (Mandatory, Forbidden, Recommended)
- Links and cross-references

**Already Compliant**: ✅ AGENTS.md § numbering is perfect

**Benefit**: Consistent governance reading experience

**Effort**: ~30 minutes (minimal change needed)

---

### **Phase 3: Test File Standards (Medium Effort, High Impact)**

#### **Target 3.1: Test File Naming**

**Scope**: ~300+ test files across codebase

**Current Enforcement**: ✅ Already has `test:names` validation via `validate-test-names.mjs`

**Standard Pattern**:

```
feature.type.test.ts(x)    ← Unit/Integration/Component
feature.e2e.spec.ts        ← End-to-end tests
feature.a11y.spec.ts       ← Accessibility tests
feature.visual.spec.ts     ← Visual regression
feature.perf.js            ← Performance benchmarks
```

**Examples**:

- ✅ `checkers.component.test.tsx` (component test)
- ✅ `board.integration.test.ts` (integration test)
- ✅ `gameLoop.unit.test.ts` (unit test)
- ✅ `ui.a11y.spec.ts` (accessibility)
- ✅ `minimax.perf.js` (performance)

**Status**: Enforced via CI, already standardized

**Benefit**: Clear test intent, easy filtering, searchability

**Effort**: ✅ Already Done

---

#### **Target 3.2: Test Structure & Organization**

**Scope**: All test files

**Standardize**:

- AAA Pattern (Arrange, Act, Assert)
- Describe block hierarchy
- Meaningful test names
- Setup/teardown patterns
- Mock/spy conventions

**Example Template**:

```typescript
describe('Checkers Board', () => {
  let board: CheckersBoard

  beforeEach(() => {
    // Arrange: Set up initial state
    board = new CheckersBoard()
  })

  afterEach(() => {
    // Cleanup
    board.dispose()
  })

  describe('move validation', () => {
    it('should allow valid moves', () => {
      // Arrange
      const piece = board.getPieceAt(0, 0)

      // Act
      const result = board.isValidMove(piece, 1, 1)

      // Assert
      expect(result).toBe(true)
    })

    it('should reject invalid moves', () => {
      // Arrange
      const piece = board.getPieceAt(0, 0)

      // Act
      const result = board.isValidMove(piece, 3, 3)

      // Assert
      expect(result).toBe(false)
    })
  })
})
```

**Benefit**: Readable tests, easier debugging, consistent test organization

**Effort**: ~3-4 hours (create linter rule + apply to critical tests)

---

### **Phase 4: Component Naming Conventions (Low Effort, High Impact)**

#### **Target 4.1: React Component Naming**

**Scope**: ~200+ components across all apps

**Current State**: Mixed patterns (PascalCase mostly, some inconsistency)

**Standardize**:

- **Atoms**: Single semantic element (Button, Input, Badge)
- **Molecules**: Simple component combinations (ButtonGroup, SearchBox)
- **Organisms**: Complex sections (GameBoard, TileGrid, Modal)
- **Templates**: Page-level layouts (GameLayout, MenuTemplate)
- **Views/Pages**: Full pages (GamePage, MenuPage)

**Example Structure**:

```
src/ui/
├── atoms/
│   ├── Button.tsx
│   ├── Icon.tsx
│   ├── Badge.tsx
│   └── index.ts
├── molecules/
│   ├── ButtonGroup.tsx
│   ├── SearchBox.tsx
│   └── index.ts
├── organisms/
│   ├── GameBoard.tsx
│   ├── ScorePanel.tsx
│   └── index.ts
├── templates/
│   ├── GameLayout.tsx
│   ├── MenuLayout.tsx
│   └── index.ts
└── index.ts
```

**Naming Rules**:

- ✅ PascalCase for all components
- ✅ File name matches component name
- ✅ Index files for barrel exports
- ✅ Hooks in separate `hooks/` directory
- ✅ Styles in `*.module.css` or co-located

**Example Hook Naming**:

```
hooks/
├── useGameState.ts
├── usePlayerInput.ts
├── useAudio.ts
└── index.ts
```

**Benefit**: Crystal clear component hierarchy, easier navigation, onboarding

**Effort**: ~1-2 hours (document + spot-check key apps)

---

## 📋 Expansion Priority Matrix

| Target                | Effort  | Impact | Priority    |
| --------------------- | ------- | ------ | ----------- |
| **Test File Naming**  | ✅ Done | HIGH   | ✅ Complete |
| **Component Naming**  | LOW     | HIGH   | 🔴 Phase 4  |
| **Package.json**      | MEDIUM  | HIGH   | 🟡 Phase 1  |
| **Test Structure**    | MEDIUM  | HIGH   | 🟡 Phase 3  |
| **TypeScript Config** | LOW     | MEDIUM | 🟢 Phase 1  |
| **README Template**   | LOW     | MEDIUM | 🟢 Phase 2  |

---

## 🚀 Recommended Expansion Sequence

### **Immediate (This Week)**

1. **Document component naming** → [COMPONENT-NAMING-GUIDE.md](COMPONENT-NAMING-GUIDE.md)
2. **Create tsconfig standard** → Validate + document
3. **Create package.json standard** → Document ideal structure

### **Near Term (This Sprint)**

1. **Enforce component naming** → Via linter rule
2. **Enforce test structure** → Via linter + documentation
3. **Apply README template** → To key docs

### **Long Term (Next Month)**

1. **Automate package.json reordering** → Via script
2. **Enforce test structure at CI** → Add linter rule
3. **Expand to configuration validation** → New CI gate

---

## 📚 Documentation to Create

- [x] `docs/COMPONENT-NAMING-GUIDE.md` — Atomic design + file structure
- [ ] `docs/PACKAGE-JSON-STANDARD.md` — Fields, scripts, dependencies
- [ ] `docs/TYPESCRIPT-CONFIG-STANDARD.md` — Compiler options reference
- [ ] `docs/TEST-STRUCTURE-GUIDE.md` — AAA pattern + examples
- [ ] `docs/README-TEMPLATE.md` — Reusable markdown template

---

## 🎯 Implementation Cost vs. Benefit

```
🟢 LOW EFFORT (< 2 hours)
├─ Document component naming
├─ Document tsconfig standard
└─ Create README template

🟡 MEDIUM EFFORT (2-4 hours)
├─ Enforce component naming (linter rule)
├─ Standardize package.json (script)
└─ Enforce test structure (linter rule)

🔴 HIGH EFFORT (4+ hours)
├─ Automate package.json reorganization
└─ Full compliance sweep + enforcement
```

---

## 🎓 Lessons from Script Standardization

What worked for scripts:

- ✅ Clear authority in docs/
- ✅ Automatic enforcement (CI gate)
- ✅ Local enforcement (pre-commit hook)
- ✅ Visual examples (before/after)
- ✅ Multiple integration points

Apply same approach to:

- Component naming (via ESLint rule)
- Test structure (via Vitest rules + docs)
- Config files (via linter + automation)

## 🎯 Recommended First Pilot

Start with Battleship UI surfaces because they already expose a stable
board-core API and a clear accessibility/performance payoff.

1. Normalize Battleship ship list semantics and board labels.
2. Keep render-heavy board containers isolated with CSS containment.
3. Use the result as the template for a component-naming standard in other board-based games.

---

## 📞 Next Steps

**Choose your expansion focus**:

1. **Start Small**: Component naming guide + linter rule (~3 hours)
2. **Start Medium**: Add package.json standard (~4 hours)
3. **Start Large**: Full Phase 1-4 planning + 2-3 items (~8 hours)

What would you like to standardize next?
