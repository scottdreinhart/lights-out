# Developer Onboarding Guide — Game Platform Sprint 2 Complete

**Welcome to the Game Platform!** 🎮  
**Sprint**: 2 Complete, Ready for Sprint 3  
**Date**: January 24, 2025  
**Estimated Onboarding Time**: 60–90 minutes

---

## Quick Start (First 15 Minutes)

### 1. Understand What This Is

You're joining a **multi-game platform** with 23 independent game apps, all powered by shared systems:

```
Game Platform (Monorepo)
├── 23 independent game apps (apps/ folder)
├── 6 shared packages (packages/ folder)  
├── Strict architecture (CLEAN pattern)
└── Comprehensive quality gates (ESLint)
```

**Key Philosophy**: Many small, high-quality, independent games powered by reusable systems.

### 2. Understand the Architecture (10 min read)

**CLEAN Architecture** enforced in every app:

```
src/
├── domain/          ← Pure game logic (no React, no framework)
├── app/             ← React hooks, context, services
├── ui/              ← Components (atoms → molecules → organisms)
├── workers/         ← Web Workers
└── themes/          ← CSS-only styling
```

**Import Rule**: NO BACKWARDS IMPORTS
- ✅ UI can import from app/domain
- ❌ App cannot import from ui
- ❌ Domain cannot import from app/ui

**Violating this rule = ESLint failure**

### 3. Set Up Your Machine (5 min)

```bash
# Install Node + pnpm
node --version           # Should be 24.14.0+
pnpm --version          # Should be 10.31.0+

# Clone the repo
cd ~/projects
git clone <repo-url> game-platform
cd game-platform

# Install dependencies
pnpm install            # Creates node_modules + pnpm-lock.yaml

# Verify setup
pnpm lint:gate:full    # Should pass (0 errors)
pnpm typecheck         # Should pass (0 errors)
pnpm build             # Should complete successfully
```

**If any step fails**:
1. Check Node/pnpm versions
2. Try `pnpm clean:all && pnpm install`
3. Check `.node-platform.md` for cross-shell issues
4. Ask in team Slack #dev-help

---

## Understanding Sprint 2 (Weeks 3–4)

### What Was Built

**1. ESLint Quality Gates** ← CRITICAL FOR YOU
   - 9 comprehensive rule sets
   - Security, boundaries, quality, accessibility
   - Blocks broken code from being committed
   - Learn: `eslint.config.js` (understand the rules)

**2. Input Controls System**
   - Semantic actions (35+ defined)
   - Platform-aware keyboard mapping
   - Text-input safety
   - Learn: `packages/app-hook-utils/`

**3. Shared Systems**
   - Responsive design (5-tier breakpoints)
   - Theme system (colors + tokens)
   - Sound effects + audio
   - Stats + history tracking
   - Learn: `packages/`

**4. Comprehensive Documentation**
   - 14 `.instructions.md` files in `.github/instructions/`
   - AGENTS.md (supreme governance document)
   - Architecture guides
   - Learn: Read in priority order (see below)

**5. GitHub Actions**
   - Automated quality gates on every PR
   - Passes ESLint + TypeScript + build
   - Posts feedback on PRs
   - Learn: `.github/workflows/quality-gates.yml`

### Success Metrics

```
Architecture:       ✅ 100% CLEAN enforced
Accessibility:      ✅ WCAG 2.1 AA ready
Type Safety:        ✅ Strict TypeScript
Linting:            ✅ 0 violations
Documentation:      ✅ 180+ pages
Testing:            ✅ 180+ unit tests passing
```

---

## What You Need to Know (30–45 min reading list)

### ▶️ MUST READ (in order, ~30 min)

1. **AGENTS.md** (root) — 
   - **What**: Supreme governance document
   - **Why**: Defines architecture, rules, constraints
   - **How long**: 15–20 min (skim sections 1–10)
   - **Key**: § 3 (Architecture), § 4 (Path Discipline), § 5 (Shell), § 8 (Response Contract)

2. **eslint.config.js** (root) —
   - **What**: Quality gate rules
   - **Why**: This is what blocks your code from merging
   - **How long**: 5 min (understand the 4 gate levels)
   - **Key**: Comment blocks explaining each rule set

3. `.github/instructions/` directory — 
   - **What**: 14 detailed guidance documents
   - **Why**: Teaches patterns for your specific tasks
   - **How long**: 5–10 min (skim all titles, read as needed)
   - **Priority order**:
     - `02-frontend.instructions.md` (React + TypeScript)
     - `08-input-controls.instructions.md` (Keyboard handling)
     - `06-responsive.instructions.md` (Breakpoints)
     - `09-wcag-accessibility.instructions.md` (A11y)

### ▶️ SHOULD READ (in next 1 hour)

1. **docs/SPRINT_2_COMPLETION_SUMMARY.md** (in this repo) —
   - What was built in Sprint 2
   - Quality metrics
   - Readiness for Sprint 3

2. **docs/SPRINT_3_IMPLEMENTATION_PLAN.md** —
   - What will be built in Sprint 3 (your next work)
   - Phases + deliverables
   - Dependencies you need to know

3. **packages/README.md** —
   - Overview of shared systems
   - What's available to use

### ▶️ READ WHEN NEEDED (reference docs)

- `.instructions` files (13 more) — as needed for your tasks
- API documentation in `packages/*/README.md`
- Storybook stories (if available)
- Individual app `README.md` files

---

## The ESLint Quality Gates (CRITICAL)

### 4 Gate Levels (You MUST understand this)

```bash
# Level 1: Quick gate (security + boundaries) — 5 min
pnpm lint:type:security    # XSS prevention, input validation
pnpm lint:type:boundaries  # Cross-layer import checks

# Level 2: Full gate (all rules) — 10 min
pnpm lint:gate:full        # Used in CI/CD

# Level 3: Fix what you can
pnpm lint --fix            # Auto-fix enabled rules

# Level 4: Manual edits
# For violations marked "manual fix", edit by hand
```

### What Blocks Your PR?

**These will FAIL your PR**:
- ❌ XSS vulnerabilities (dangerous HTML)
- ❌ Missing input validation
- ❌ Cross-layer imports (ui importing from app)
- ❌ TypeScript errors
- ❌ Prettier formatting violations
- ❌ Build failures

**These will PASS**:
- ✅ Tests (optional, but recommended)
- ✅ Comments and documentation
- ✅ Storybook stories (optional)

### Example: Fixing an ESLint Error

```bash
# You write code that violates a boundary rule
# Run lint:gate:full
pnpm lint:gate:full

# Output:
# ❌ eslint error in src/ui/organisms/GameBoard.tsx:
#    Cannot import @/app/useGame (boundaries/internal-import-pattern)

# Fix: Check the import
import { useGame } from '@/app'  # Wrong (internal import)
import { useGame } from '@/app'  # Correct (via barrel)

# OR: Check the layer
// In src/ui/ → importing from src/app is BLOCKED
// Move logic to src/app, import result to src/ui

# Run lint again
pnpm lint:gate:full              # Should pass now
```

---

## Your First Task

### Task 1: Verify the Setup (10 min)

```bash
cd ~/projects/game-platform

# Run all quality gates
pnpm lint:gate:full    # Should pass (0 errors)
pnpm typecheck         # Should pass (0 errors)
pnpm format:check      # Should pass (0 errors)
pnpm build             # Should complete

# If all pass, setup is ✅ complete

# If anything fails:
# Try: pnpm clean:all && pnpm install
# Then re-run the above
```

### Task 2: Pick a Game App (15 min)

Explore one of the 23 game apps to understand the structure:

```bash
cd apps/tictactoe         # Or any game

# Understand the structure
tree src -L 2             # See domain/app/ui/etc

# Look at one file
cat src/domain/rules.ts   # Pure game logic
cat src/app/useGame.ts    # React hook
cat src/ui/organisms/GameBoard.tsx  # React component

# Run this game's quality gate
pnpm lint
pnpm typecheck
pnpm format:check
```

**What you should observe**:
- `domain/` has NO imports from `app/` or `ui/`
- `app/` imports from `domain/` only
- `ui/` imports from `app/` + `domain/`
- All files follow naming conventions (use*, *Service, *Context)
- All files have proper types (TypeScript)

### Task 3: Make a Small Change (15 min)

```bash
# Pick any app
cd apps/tictactoe

# Make a tiny change (add a comment, tweak spacing)
# Or: Add a new constant to domain/constants.ts

# Run quality gates on just this app
pnpm lint
pnpm typecheck

# Observe: No failures, gates working ✅

# Or: Deliberately break something (wrong import)
# to see what ESLint error you get

# Fix it, gates pass again
```

---

## Frequently Asked Questions

### Q: What if I don't understand AGENTS.md?
**A**: That's normal. It's 30+ sections. Read § 1–10 first, skim the rest. The `.instructions` files are more practical.

### Q: Can I use React Context?
**A**: Yes! See `packages/theme-contract/` for the pattern.

### Q: Can I create a new shared package?
**A**: Yes. Create `packages/[name]/`, include `index.ts` barrel, follow CLEAN rules. Discuss with team first.

### Q: What if my code fails lint in CI/CD?
**A**: The PR gets blocked. Fix locally (`pnpm lint --fix`, then manual fixes), push again. CI/CD re-runs automatically.

### Q: How do I know what breakpoints to support?
**A**: Use `useResponsiveState()` hook. It handles the 5 breaks (mobile/tablet/desktop/widescreen/ultrawide). See `06-responsive.instructions.md`.

### Q: Can I import directly from packages?
**A**: Use barrels! `import { useTheme } from '@theme'` not `from '@theme/context'`.

### Q: What's the difference between app/ and domain/?
**A**: `domain/` = pure logic (no React), `app/` = React integration (hooks, context, services).

### Q: Can I skip tests?
**A**: Not recommended. Tests catch bugs before PR review. Plus, CI/CD may require them in future sprints.

### Q: What if I need to add a dependency?
**A**: Check § 22 of AGENTS.md first. Most new features can be built with existing deps. If you really need one, document your case + get approval.

---

## Common Pitfalls (Avoid These!)

### ❌ Pitfall 1: Cross-Layer Imports
```typescript
// WRONG: UI importing internal app file
import { _useGameState } from '@/app/useGame'

// RIGHT: Use barrel export + public API
import { useGame } from '@/app'
```

### ❌ Pitfall 2: Business Logic in UI
```typescript
// WRONG: Game logic in React component
const GameBoard = () => {
  const isValid = board.some(row => row.length === 9)  // GAME LOGIC HERE
  // ...
}

// RIGHT: Game logic in domain, use via hook
const GameBoard = () => {
  const { board, isValid } = useGame()  // Hook handles logic
  // ...
}
```

### ❌ Pitfall 3: Hardcoded Values
```typescript
// WRONG: Hardcoded breakpoint
if (window.innerWidth < 600) { /* mobile */ }

// RIGHT: Use responsive state
const responsive = useResponsiveState()
if (responsive.isMobile) { /* mobile */ }
```

### ❌ Pitfall 4: Backwards Arrow Imports
```typescript
// WRONG: App importing from UI
import { GameBoard } from '@/ui/organisms'
export const useGameHook = () => {
  // ...
}

// FIX: Move to UI layer, consume via app hook
// app/useGame.ts → domain logic
// ui/organisms/GameBoard.tsx → uses useGame()
```

### ❌ Pitfall 5: Missing Barrel Exports
```typescript
// WRONG: Direct internal import
import { Button } from '@/ui/atoms/Button/Button'

// RIGHT: Use barrel
import { Button } from '@/ui/atoms'
```

---

## Development Workflow

### Daily Workflow

```bash
# 1. Start your day
cd game-platform
git pull origin main          # Get latest

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Make changes in an app
cd apps/[game]
# ... edit src/ files ...

# 4. Before commit: run quality gates
pnpm lint:gate:full           # Must pass
pnpm typecheck                # Must pass
pnpm format:check             # Must pass (use --fix if needed)

# 5. Create a test if adding feature
# file: src/[layer]/[feature].test.ts

# 6. Commit
git add src/
git commit -m "feat: [description]"

# 7. Push
git push origin feature/my-feature

# 8. Create PR on GitHub
# CI/CD runs automatically
# Gates must pass before merge
```

### CI/CD Pipeline (Automatic on PR)

```
1. Quick Gate (5 min) — security + boundaries
   ↓ (if pass)
2. Full Gate (10 min) — all ESLint rules
3. TypeScript (10 min) — type check
4. Format (5 min) — Prettier validation
5. Build (15 min) — production build
   ↓ (if all pass)
6. Summary — PR comment with ✅ or ❌
```

**If any stage fails**, you get a comment with details. Fix locally, push again.

---

## Tools & Scripts You'll Use

### Most Common

```bash
pnpm lint:gate:full        # Full quality check (before commit)
pnpm typecheck             # Type errors
pnpm format:check          # Formatter issues
pnpm format --fix          # Auto-format
pnpm lint --fix            # Auto-fix linting
pnpm build                 # Production build
pnpm validate              # Full validation (lint + type + format + build)
```

### Per-App

```bash
cd apps/[game]
pnpm lint                  # Just this app
pnpm typecheck             # Just this app
pnpm format:check          # Just this app
pnpm dev                   # Dev server (if app has it)
```

### Shared Packages

```bash
cd packages/[pkg]
pnpm build                 # Build package
pnpm test                  # Run tests
```

---

## What Happens in Sprint 3

**Don't worry about this yet**, but know it's coming:

### Phase 1 (Weeks 5–5.5): Board Systems
- Extensible Tile component (for all grid games)
- Board grid + keyboard navigation
- Building on top of Sprint 2's responsive + input systems

### Phase 2 (Weeks 5.5–6): Game Families
- Sudoku engine (generator, validator, solver)
- Chess/Checkers patterns
- N-Queens constraint solver

### Phase 3–7: Compliance → CI/CD → Electron/Mobile → Performance

---

## Need Help?

### Check These First

1. `.instructions/` files (specific to your task)
2. `packages/[pkg]/README.md` (API reference)
3. An existing game app (see how it's done)
4. AGENTS.md § relevant to your question

### Ask the Team

- **Architecture questions**: Reference AGENTS.md, then ask
- **Specific task help**: Check `.instructions/` first
- **Unblocked?**: Post in #dev-help Slack
- **PR review**: Post PR link, team reviews

---

## Success Criteria: You're Ready When...

✅ You can explain CLEAN architecture in your own words  
✅ You understand why cross-layer imports fail  
✅ You can run `pnpm lint:gate:full` without errors  
✅ You can identify domain/app/ui logic by looking at code  
✅ You can fix a simple linting error  
✅ You understand the 5 responsive design breakpoints  
✅ You know where shared systems live (packages/)  
✅ You can make a PR and get it through CI/CD  

---

## Your First PR Checklist

Before pushing:
- [ ] Code passes `pnpm lint:gate:full`
- [ ] Code passes `pnpm typecheck`
- [ ] Code passes `pnpm format:check`
- [ ] No cross-layer imports
- [ ] Follows naming conventions (use*, *Service, *Context)
- [ ] TypeScript types are explicit
- [ ] Barrel exports updated if new files
- [ ] Tests added (if feature)

On GitHub:
- [ ] PR title is descriptive
- [ ] PR description explains what + why
- [ ] Reference any related issues
- [ ] Wait for CI/CD to complete
- [ ] Address feedback from team
- [ ] Merge once approved + gates pass ✅

---

## Now What?

### Next 30 Minutes

1. ✅ Complete "Your First Task" section above
2. ✅ Verify setup runs without errors
3. ✅ Explore one game app structure
4. ✅ Read AGENTS.md § 1–10 (skim)

### Next 1 Hour

1. ✅ Review `.github/instructions/02-frontend.instructions.md`
2. ✅ Review `.github/instructions/08-input-controls.instructions.md`
3. ✅ Read `docs/SPRINT_2_COMPLETION_SUMMARY.md`

### Next 2 Hours

1. ✅ Your onboarding is COMPLETE
2. ✅ Ready to pick your first task for Sprint 3
3. ✅ Reference guides are your best friend

### Ready?

```bash
# Let's go!
pnpm lint:gate:full
# ✅ All gates pass → You're ready!
```

---

**WELCOME TO THE GAME PLATFORM! 🎮**

Questions? Check `.instructions/`, ask in #dev-help, or reference AGENTS.md.

Good luck! 🚀
