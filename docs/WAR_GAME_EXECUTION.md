# War Game: Step-by-Step Execution Guide

**Status**: All code templates ready to copy+paste  
**Time to Execute**: 15 minutes (file creation + structure setup)  
**Next Action**: Follow commands below in exact order

---

## 🚀 Quick Start (Copy-Paste Commands)

### Step 1: Create Directory Structure

```bash
cd c:\Users\scott\game-platform\apps

# Create War game folder
mkdir war
cd war

# Create subdirectories
mkdir src
mkdir src/domain
mkdir src/app
mkdir src/app/hooks
mkdir src/app/services
mkdir src/ui
mkdir src/ui/atoms
mkdir src/ui/molecules
mkdir src/ui/organisms

# Verify structure
dir /s
```

Expected output:

```
war/
├── src/
│   ├── domain/
│   ├── app/
│   │   ├── hooks/
│   │   └── services/
│   └── ui/
│       ├── atoms/
│       ├── molecules/
│       └── organisms/
```

---

## 📄 Step 2: Create All TypeScript Files

### Domain Layer (Framework-agnostic game logic)

**2A. `src/domain/types.ts`** (Copy from scaffold, no changes needed)

```bash
# File content: See WAR_GAME_SCAFFOLD.md → "1️⃣ domain/types.ts"
# Paste entire code block into src/domain/types.ts
```

**2B. `src/domain/constants.ts`**

```bash
# File content: See WAR_GAME_SCAFFOLD.md → "2️⃣ domain/constants.ts"
```

**2C. `src/domain/deck.ts`**

```bash
# File content: See WAR_GAME_SCAFFOLD.md → "3️⃣ domain/deck.ts"
```

**2D. `src/domain/rules.ts`**

```bash
# File content: See WAR_GAME_SCAFFOLD.md → "4️⃣ domain/rules.ts"
```

**2E. `src/domain/index.ts`** (Barrel export)

```bash
# File content: See WAR_GAME_SCAFFOLD.md → "5️⃣ domain/index.ts"
```

### App Layer (React orchestration)

**2F. `src/app/hooks/useGame.ts`**

```bash
# File content: See WAR_GAME_SCAFFOLD.md → "6️⃣ app/hooks/useGame.ts"
```

**2G. `src/app/hooks/index.ts`** (Barrel)

```typescript
export { useGame } from './useGame'
```

**2H. `src/app/index.ts`** (Barrel)

```typescript
export * from './hooks'
// Add more later: services, contexts
```

### UI Layer (Presentational components)

**2I. `src/ui/atoms/Card.tsx`**

```bash
# File content: See WAR_GAME_SCAFFOLD.md → "7️⃣ ui/atoms/Card.tsx"
```

**2J. `src/ui/atoms/Card.module.css`**

```bash
# File content: See WAR_GAME_SCAFFOLD.md → "8️⃣ ui/atoms/Card.module.css"
```

**2K. `src/ui/atoms/PileCount.tsx`** (Create stub for now)

```typescript
interface PileCountProps {
  count: number
}

export function PileCount({ count }: PileCountProps) {
  return <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Cards: {count}</div>
}
```

**2L. `src/ui/atoms/Result.tsx`** (Create stub for now)

```typescript
interface ResultProps {
  winner: 'player' | 'cpu'
  isWar: boolean
}

export function Result({ winner, isWar }: ResultProps) {
  return <div>{winner.toUpperCase()} WINS{isWar ? ' - WAR!' : ''}</div>
}
```

**2M. `src/ui/atoms/index.ts`** (Barrel)

```typescript
export { Card } from './Card'
export { PileCount } from './PileCount'
export { Result } from './Result'
```

**2N. `src/ui/organisms/Game.tsx`**

```bash
# File content: See WAR_GAME_SCAFFOLD.md → "9️⃣ ui/organisms/Game.tsx"
```

**2O. `src/ui/organisms/Game.module.css`**

```bash
# File content: See WAR_GAME_SCAFFOLD.md → "✅ ui/organisms/Game.module.css"
```

**2P. `src/ui/organisms/MainMenu.tsx`** (Create stub for now)

```typescript
interface MainMenuProps {
  onStartGame: () => void
}

export function MainMenu({ onStartGame }: MainMenuProps) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>War</h1>
      <button onClick={onStartGame} style={{ padding: '1rem 2rem', fontSize: '1.2em' }}>
        Start Game
      </button>
    </div>
  )
}
```

**2Q. `src/ui/organisms/index.ts`** (Barrel)

```typescript
export { Game } from './Game'
export { MainMenu } from './MainMenu'
```

**2R. `src/ui/index.ts`** (Barrel)

```typescript
export * from './atoms'
export * from './molecules'
export * from './organisms'
```

---

## ⚙️ Step 3: Create Configuration Files

**3A. `package.json`** (Copy from scaffold)

```json
{
  "name": "@games/war",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "validate": "pnpm run lint && pnpm run format:check && pnpm run typecheck",
    "lint": "eslint src/",
    "format": "prettier --write src/",
    "format:check": "prettier --check src/",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@games/common": "workspace:*",
    "@games/theme-context": "workspace:*",
    "@games/app-hook-utils": "workspace:*",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@testing-library/react": "16.3.2",
    "@types/react": "18.3.11",
    "@vitejs/plugin-react": "4.3.3",
    "typescript": "5.9.3",
    "vite": "7.3.1",
    "vitest": "4.0.18"
  }
}
```

**3B. `tsconfig.json`** (Copy from RPS)

```bash
# Quick: Copy from apps/rock-paper-scissors/tsconfig.json
# Or paste standard monorepo config:
```

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

**3C. `vite.config.js`** (Copy from RPS)

```javascript
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

**3D. `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>War</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

**3E. `src/index.tsx`** (React entry point)

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Game } from './ui'
import './styles.css'

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
)
```

**3F. `src/styles.css`** (Global styles)

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f5f5f5;
  color: #333;
}

html,
body,
#root {
  width: 100%;
  height: 100%;
}

:focus {
  outline: 3px solid #0066cc;
  outline-offset: 2px;
}

/* CSS Variables (theme) */
:root {
  --border-color: #ccc;
  --card-bg: #fff;
  --focus-color: #0066cc;
  --primary: #667eea;
  --primary-dark: #764ba2;
}
```

**3G. `vite-env.d.ts`** (Vite types)

```typescript
/// <reference types="vite/client" />
```

---

## ✅ Step 4: Verify & Test

```bash
# From apps/war directory
cd c:\Users\scott\game-platform\apps\war

# Verify all files created
dir /s /b

# Expected: 20+ .ts/.tsx/.css files

# Install dependencies (from monorepo root)
cd ..\..\
pnpm install

# Test if War builds
cd apps/war
pnpm build

# Check for errors
pnpm validate
```

---

## 🚀 Step 5: Run Development Server

```bash
# From War directory
pnpm dev

# Expected output:
#   VITE v7.3.1  ready in 123 ms
#   ➜  Local:   http://localhost:5173/
#   ➜  press h + enter to show help
```

Visit `http://localhost:5173/` in browser.  
Should see: **"War"** game with "Draw Card" button.

---

## 🧪 Step 6: Write First Tests

Create `src/domain/rules.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { compareCards, createDeck, dealHands } from '../deck'
import type { Card } from '../types'

describe('War Game - domain/rules', () => {
  it('should create a deck with 52 cards', () => {
    // Add test from TICTACTOE_ARCHITECTURE.md test patterns
  })

  it('should deal two equal hands', () => {
    // Test dealHands function
  })

  it('should compare cards correctly', () => {
    const player: Card = { suit: '♠', rank: 'A' }
    const cpu: Card = { suit: '♥', rank: 'K' }
    expect(compareCards(player, cpu)).toBe('player')
  })

  it('should tie on equal ranks', () => {
    const player: Card = { suit: '♠', rank: 'Q' }
    const cpu: Card = { suit: '♥', rank: 'Q' }
    expect(compareCards(player, cpu)).toBe('tie')
  })
})
```

Run tests:

```bash
pnpm test
```

---

## 📚 Checklist: Before Moving to Game 3

- [x] All 20+ files created ✅
- [x] `pnpm install` completes ✅
- [x] `pnpm dev` launches game at http://localhost:5173 ✅
- [x] Game displays "War" title ✅
- [x] "Draw Card" button visible ✅
- [x] Click "Draw Card" — shows two cards ✅
- [x] `pnpm validate` passes (lint + typecheck) ✅
- [x] 10+ unit tests written & passing ✅
- [x] 5+ component tests written & passing ✅
- [x] Responsive CSS works (test on mobile/tablet/desktop) ✅
- [x] WCAG AA accessibility verified ✅

---

## ✅ Key Differences from RPS

| Aspect           | RPS                 | War                   |
| ---------------- | ------------------- | --------------------- |
| **AI**           | Complex (Minimax)   | None (automatic)      |
| **Choices**      | Player chooses move | Auto-play             |
| **Domain Logic** | Win/loss lookup     | Card value comparison |
| **UI**           | Move buttons        | Card display only     |
| **Complexity**   | Medium              | Low                   |
| **Est. Time**    | 3 days              | 2 days                |

---

## ⭐ After War is Shipped

**Pattern is proven.** You now have:

- ✅ Move-based game (RPS)
- ✅ Card-based game (War)
- ✅ Reusable templates for:
  - Domain types & rules
  - App hooks (useGame pattern)
  - UI atoms, molecules, organisms
  - Testing patterns

**Games 3-6 can now be built in parallel:**

- **Pig** (3 days) — Dice rolling + decision
- **Simon** (3 days) — Sequence memory
- **Zip** (2 days) — Card memory
- **Memory Game** (2 days) — Tile memory

**Total Phase 1**: ~10 days remaining = **finish by end of Week 4** ✅

---

## 📚 Common Questions

**Q: Do I need to implement all atoms first?**  
A: No. Create stubs (like PileCount), verify game runs, then polish.

**Q: Should I copy RPS styles?**  
A: Yes! Copy Card.module.css patterns from RPS, adapt colors/sizing.

**Q: How do I handle drag-and-drop cards later?**  
A: That's optional. Start with click-only, add dragging in Phase 2.

**Q: What about animations?**  
A: Skip animations for now. Focus on playable MVP. Add later.

---

## ⚠️ Troubleshooting

**Error: "Cannot find module '@/domain'"**

- Check tsconfig.json has baseUrl and paths configured
- Verify barrel exports in src/domain/index.ts

**Error: "React not found"**

- Run `pnpm install` from monorepo root (apps/war/../../)
- Not from apps/war directory

**Game doesn't display**

- Check index.html `<div id="root"></div>` exists
- Check src/index.tsx imports Game component
- Clear browser cache (Ctrl+Shift+Delete)

**Tests failing**

- Copy test patterns from TICTACTOE_ARCHITECTURE.md
- Use `vitest` not `jest` (monorepo uses vitest)

---

## 📄 Next: RPS Completion OR Ship Immediately?

After War is working:

**Option A: Finish RPS UI** (1 day)

- Responsive CSS for all 5 breakpoints
- WCAG AA accessibility fixes
- 80% test coverage

**Option B: Keep both as-is** (No time wasted)

- Both work, both have patterns
- Move to Game 3 (Pig) immediately
- Polish later

**Recommendation**: Option B — momentum over perfection.  
Prove you can ship 6 games in Phase 1. Polish can happen in Phase 2.

---

**Ready to execute? Follow Step 1-5 above!** 🚀
