# New Game App Template

**Authority**: AGENTS.md § 4 (Path Discipline)  
**Last Updated**: March 17, 2026

This document defines the canonical structure for new game apps in the monorepo. Use this as a copy-paste scaffold to ensure consistency across all 25+ apps.

---

## Directory Structure

```
apps/new-game/
├── src/
│   ├── app/                    # React integration layer (hooks, context, services)
│   │   ├── context/            # (optional, if >5 contexts)
│   │   │   ├── ThemeContext.tsx
│   │   │   ├── SoundContext.tsx
│   │   │   └── index.ts
│   │   ├── hooks/              # (optional, if >8 hooks)
│   │   │   ├── useGame.ts
│   │   │   ├── useSoundEffects.ts
│   │   │   ├── useStats.ts
│   │   │   └── index.ts
│   │   ├── services/           # (optional, if >3 services)
│   │   │   ├── storageService.ts
│   │   │   ├── crashLogger.ts
│   │   │   └── index.ts
│   │   ├── SoundContext.tsx    # (if no context/ subdir)
│   │   ├── ThemeContext.tsx    # (if no context/ subdir)
│   │   ├── crashLogger.ts
│   │   ├── haptics.ts
│   │   ├── sounds.ts
│   │   ├── storageService.ts
│   │   ├── useGame.ts
│   │   ├── useSoundEffects.ts
│   │   ├── useStats.ts
│   │   ├── useSwipeGesture.ts
│   │   ├── useTheme.ts
│   │   └── index.ts            # BARREL: Export local app code only
│   │
│   ├── domain/                 # Framework-agnostic business logic
│   │   ├── ai.ts               # AI decision-making (pure function)
│   │   ├── board.ts            # Game board state helpers
│   │   ├── constants.ts        # Configuration, defaults, flags
│   │   ├── layers.ts           # Z-index and layout constants
│   │   ├── responsive.ts       # Responsive breakpoints (if app-specific)
│   │   ├── rules.ts            # Game rules enforcement
│   │   ├── sprites.ts          # Sprite/asset mapping (if applicable)
│   │   ├── themes.ts           # Theme data and palettes
│   │   ├── types.ts            # Type definitions (shared vocabulary)
│   │   └── index.ts            # BARREL: Export public API only
│   │
│   ├── ui/                     # Presentational layer (React components)
│   │   ├── atoms/              # Smallest reusable primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Cell.tsx
│   │   │   ├── Icon.tsx
│   │   │   └── index.ts        # BARREL
│   │   │
│   │   ├── molecules/          # Composed atoms (layouts, groups)
│   │   │   ├── GameBoard.tsx
│   │   │   ├── HamburgerMenu.tsx
│   │   │   ├── QuickThemePicker.tsx
│   │   │   └── index.ts        # BARREL
│   │   │
│   │   ├── organisms/          # Feature components (screens, full layouts)
│   │   │   ├── App.tsx         # Root app component (with providers)
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── index.ts        # BARREL
│   │   │
│   │   ├── utils/              # UI utilities (CSS modules, helpers)
│   │   │   ├── cssModules.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── ui-constants.ts     # UI-only constants (colors, sizes, etc.)
│   │   └── index.ts            # BARREL: Export all atoms, molecules, organisms
│   │
│   ├── themes/                 # Theme CSS files (Lazy-loaded, no JS)
│   │   ├── light.css
│   │   ├── dark.css
│   │   └── custom.css
│   │
│   ├── wasm/                   # WASM AI loader
│   │   ├── ai-wasm.ts          # (Auto-generated from assembly build)
│   │   ├── index.ts
│   │   └── wasm-loader.ts
│   │
│   ├── workers/                # Web Worker entry points
│   │   ├── ai.worker.ts        # WASM-backed AI worker
│   │   └── index.ts
│   │
│   ├── index.tsx               # React app root
│   ├── styles.css              # Global baseline styles
│   └── vite-env.d.ts           # Vite type definitions
│
├── assembly/                   # AssemblyScript source (AI engine)
│   ├── index.ts
│   └── tsconfig.json
│
├── public/
│   ├── manifest.json
│   └── offline.html
│
├── src/
│   └── (see above)
│
├── index.html                  # Vite entry point
├── tsconfig.json
├── package.json
└── vite.config.js
```

---

## File Patterns & Naming Conventions

### React Components

```typescript
// ✅ GOOD: Component file (PascalCase, default export)
// src/ui/atoms/Button.tsx
export default function Button(props: ButtonProps) {
  return <button {...props} />
}

// ✅ GOOD: Scoped styles (CSS Modules)
// src/ui/atoms/Button.module.css
.button { padding: 1rem; }

// ✅ GOOD: Component types (optional, for complex props)
// src/ui/atoms/Button.types.ts
export interface ButtonProps { ... }
```

### Custom Hooks

```typescript
// ✅ GOOD: Custom hook (use* prefix, in app/hooks/ or app/)
// src/app/hooks/useGame.ts
export function useGame(): GameState {
  return useState<GameState>(initialState)
}

// ✅ GOOD: Hook from shared package
// Component import
import { useResponsiveState } from '@games/app-hook-utils'
```

### Context Providers

```typescript
// ✅ GOOD: Context + hook pair
// src/app/context/ThemeContext.tsx
export const ThemeContext = createContext<Theme | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeContext must be used in ThemeProvider')
  return ctx
}
```

### Services

```typescript
// ✅ GOOD: Service object (stateless methods)
// src/app/services/storageService.ts
export const storageService = {
  saveGame: (state: GameState): void => {
    localStorage.setItem('game-state', JSON.stringify(state))
  },
  loadGame: (): GameState | null => {
    const stored = localStorage.getItem('game-state')
    return stored ? JSON.parse(stored) : null
  },
}
```

### Domain Logic

```typescript
// ✅ GOOD: Pure functions (no side effects)
// src/domain/rules.ts
export const isValidMove = (board: Board, move: Move): boolean => {
  return board[move.row]?.[move.col] === empty
}

export const applyMove = (board: Board, move: Move, player: Player): Board => {
  const newBoard = board.map((row) => [...row])
  newBoard[move.row][move.col] = player
  return newBoard
}

// ✅ GOOD: Types centralized
// src/domain/types.ts
export type Board = Cell[][]
export type Cell = 'X' | 'O' | ''
export type Move = { row: number; col: number }
```

---

## Import Patterns

### ✅ DO: Direct imports from source of truth

```typescript
// Local app code
import { useGame, useSoundEffects } from '@/app'

// Shared utilities (direct from source, not re-exports)
import { useResponsiveState, useKeyboardControls } from '@games/app-hook-utils'
import { useDropdownBehavior } from '@games/assets-shared'

// Domain logic
import { isValidMove, applyMove } from '@/domain'

// UI components
import { Button, Card } from '@/ui'

// Types
import type { GameState, Move } from '@/domain'
```

### ❌ DON'T: Use unnecessary re-export shims

```typescript
// ❌ BAD: Don't re-export shared code in app barrel
// src/app/index.ts should NOT have:
//   export { useResponsiveState } from '@games/app-hook-utils'

// ❌ BAD: Don't import shared code from app barrel
// Components should NOT do:
//   import { useResponsiveState } from '@/app'  // ← wrong path
```

---

## Barrel Pattern (Required)

Every directory must export a barrel `index.ts` re-exporting **its own public APIs only**.

### ✅ GOOD: App Barrel

```typescript
// src/app/index.ts
// Local app code only
export { useGame } from './useGame'
export { useSoundEffects } from './useSoundEffects'
export { useStats } from './useStats'
export { SoundProvider, useSoundContext } from './SoundContext'
export { ThemeProvider, useThemeContext } from './ThemeContext'
export * from './haptics'
export * from './crashLogger'
export * from './storageService'

// DO NOT re-export shared code:
// ❌ export { useResponsiveState } from '@games/app-hook-utils'
// ❌ export { useKeyboardControls } from '@games/app-hook-utils'
```

### ✅ GOOD: Domain Barrel

```typescript
// src/domain/index.ts
// Public API only
export * from './types'
export * from './constants'
export { isValidMove, applyMove, getValidMoves } from './rules'
export { computeAiMove } from './ai'
export { createBoard, boardToString } from './board'

// DO NOT export internal helpers
// ❌ export { _validateMove }
// ❌ export { CACHE }
```

### ✅ GOOD: UI Barrel

```typescript
// src/ui/index.ts
export { ErrorBoundary } from './organisms'
export { GameBoard, HamburgerMenu } from './molecules'
export { Button, Card, Cell, Icon } from './atoms'
```

---

## Context Providers at App Root

App must wrap root component with all context providers.

```typescript
// src/index.tsx
import { App } from '@/ui'
import { ThemeProvider } from '@/app'
import { SoundProvider } from '@/app'

ReactDOM.render(
  <ThemeProvider>
    <SoundProvider>
      <App />
    </SoundProvider>
  </ThemeProvider>,
  document.getElementById('root'),
)
```

```typescript
// src/ui/organisms/App.tsx
import { useGame, useSoundContext, useThemeContext } from '@/app'
import { useResponsiveState, useKeyboardControls } from '@games/app-hook-utils'

export function App() {
  const game = useGame()
  const responsive = useResponsiveState()
  const keyboard = useKeyboardControls()

  return (
    <div style={{ flex: responsive.isDesktop ? 'row' : 'column' }}>
      {/* Game UI */}
    </div>
  )
}
```

---

## Configuration Files

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/domain/*": ["./src/domain/*"],
      "@/app/*": ["./src/app/*"],
      "@/ui/*": ["./src/ui/*"]
    }
  },
  "include": ["src"]
}
```

### vite.config.js

```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

### package.json (Minimal)

```json
{
  "name": "@games/new-game",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src",
    "lint:fix": "eslint src --fix",
    "format": "prettier --write src",
    "format:check": "prettier --check src"
  },
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@capacitor/android": "^8.2.0",
    "@capacitor/cli": "^8.2.0",
    "@capacitor/core": "^8.2.0",
    "@capacitor/ios": "^8.2.0",
    "@vitejs/plugin-react": "^4.3.3",
    "typescript": "^5.9.3",
    "vite": "^7.3.1"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["@capacitor/ios"]
  }
}
```

---

## Checklist for New App

- [ ] Directory structure matches template above
- [ ] All directories have `index.ts` barrels
- [ ] App barrel exports **only local code**, no shared utilities
- [ ] Components import shared utilities **directly** from `@games/*`
- [ ] tzconfig.json has path aliases for `@/*`, `@/domain/*`, `@/app/*`, `@/ui/*`
- [ ] Components use atomic design hierarchy correctly:
  - Atoms: no imports from molecules/organisms
  - Molecules: no imports from organisms
  - Organisms: can import from all layers
- [ ] Domain layer has NO React imports
- [ ] Root component is wrapped with all context providers
- [ ] `eslint`, `prettier`, `typescript` properly configured
- [ ] TypeScript passes: `pnpm typecheck`

---

## Quick Start (Copy-Paste)

1. **Create app directory**:
   ```bash
   mkdir apps/new-game
   cd apps/new-game
   ```

2. **Copy template structure**:
   - Copy directory tree from this document
   - Or reference: `apps/cee-lo/` or `apps/battleship/` as reference implementations

3. **Initialize files**:
   - `package.json` → Use template above
   - `tsconfig.json` → Use template above
   - `vite.config.js` → Use template above
   - Create `public/manifest.json`, `public/offline.html`
   - Create root `index.html` pointing to `src/index.tsx`

4. **Run validation**:
   ```bash
   pnpm install
   pnpm typecheck
   pnpm lint
   pnpm dev
   ```

---

## References

- **AGENTS.md § 4** (Path Discipline)
- **AGENTS.md § 21** (File Organization Governance)
- **copilot-instructions.md** (Architecture rules)
- **Reference Apps**: `apps/cee-lo/`, `apps/battleship/`, `apps/lights-out/`
