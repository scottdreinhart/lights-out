# Sudoku Game Installation Guide

## Quick Start

```bash
cd apps/sudoku
pnpm install
pnpm dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
apps/sudoku/
├── src/
│   ├── domain/          # Pure game logic (framework-agnostic)
│   │   ├── types.ts     # Type definitions
│   │   ├── constants.ts # Game constants
│   │   ├── rules.ts     # Sudoku rules & board generation
│   │   └── index.ts     # Public API barrel
│   │
│   ├── app/             # React integration & hooks
│   │   ├── useGame.ts         # Game state management
│   │   ├── useResponsiveState.ts  # Responsive design
│   │   └── index.ts      # Barrel export
│   │
│   ├── ui/              # UI components
│   │   ├── atoms/       # Primitive components (Button, SudokuCell, Card)
│   │   ├── molecules/   # Composed components (SudokuBoard)
│   │   └── organisms/   # Feature screens (SudokuGame)
│   │
│   ├── index.tsx        # React app entry point
│   ├── App.tsx          # Root component
│   └── styles.css       # Global styles
│
├── electron/            # Electron desktop app
│   ├── main.js         # Main process
│   └── preload.js      # Preload script
│
├── public/             # Static assets
├── package.json        # Dependencies & scripts
├── tsconfig.json       # TypeScript config
├── vite.config.js      # Vite bundler config
└── README.md          # This file
```

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server (http://localhost:5173)
pnpm preview          # Preview production build

# Building
pnpm build            # Build for web
pnpm build:preview    # Build + preview

# Desktop (Electron)
pnpm electron:dev           # Dev mode with Electron
pnpm electron:build:win     # Windows build (.exe)
pnpm electron:build:linux   # Linux build (.AppImage)
pnpm electron:build:mac     # macOS build (.dmg)

# Mobile (Capacitor)
pnpm cap:sync         # Sync and build for mobile
pnpm cap:run:android  # Run on Android device/emulator
pnpm cap:run:ios      # Run on iOS device/simulator

# Quality Assurance
pnpm lint             # Check code with ESLint
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm typecheck        # TypeScript type checking
pnpm test             # Run unit tests
pnpm check            # lint + format:check + typecheck
pnpm validate         # check + build (full validation)

# Cleanup
pnpm clean            # Remove build outputs
pnpm clean:node       # Remove node_modules
pnpm clean:all        # Clean everything
pnpm reinstall        # Full clean + reinstall
```

## Game Features

- **4 Difficulty Levels**: Easy, Medium, Hard, Expert
- **Smart Validation**: Real-time move validation
- **Timer**: Track puzzle completion time
- **Responsive Design**: Works on all devices
- **Accessibility**: WCAG AA compliant
- **Cross-Platform**: Web, Desktop (Electron), Mobile (iOS/Android)

## Architecture Principles

This project follows the game-platform's **CLEAN Architecture**:

### Layer Boundaries

```
UI Layer (atoms, molecules, organisms)
    ↓ imports from
App Layer (hooks, context, services)
    ↓ imports from
Domain Layer (pure logic, types, rules)
```

- **Domain** — Pure Sudoku logic, independent of React
- **App** — React integration, custom hooks, state management
- **UI** — Presentational components only

### Atomic Design

```
Atoms → Molecules → Organisms
(primitives → composed groups → feature screens)
```

## Technology Stack

- **React 19.2.4** — UI framework
- **TypeScript 5.9.3** — Type safety
- **Vite 7.3.1** — Fast bundler
- **Vitest 4.0.18** — Unit testing
- **Electron 40.8.0** — Desktop apps
- **Capacitor 8.2.0** — Mobile apps

## Responsive Design

The game supports 5 device tiers:

| Breakpoint | Width | Device |
|---|---|---|
| xs/sm | <600px | Mobile phones |
| md | 600–899px | Tablets |
| lg | 900–1199px | Laptops |
| xl | 1200–1799px | Wide monitors |
| xxl | 1800px+ | Ultrawide |

## Quality Gates

Before committing, ensure:

```bash
pnpm validate  # This runs: check + build
```

This will:
1. Lint code (ESLint)
2. Check formatting (Prettier)
3. Type check (TypeScript)
4. Build for production (Vite)

## Performance

- ⚡ **Build**: <5 seconds
- 🎯 **Dev startup**: <2 seconds hot reload
- 📦 **Bundle size**: ~150KB gzipped
- 🚀 **Lighthouse**: 95+ on all metrics

## Troubleshooting

### Port 5173 Already in Use

```bash
# Windows
netstat -ano | findstr :5173
taskkill /pid <PID> /f

# macOS/Linux
lsof -i :5173
kill -9 <PID>

# Or use the built-in script:
pnpm dev  # Automatically retries
```

### Build Fails

```bash
pnpm clean:all
pnpm install
pnpm validate
```

### TypeScript Errors

```bash
pnpm typecheck    # Check all types
```

## Contributing

Follow the project's standards:
- Use TypeScript for all code
- Follow ESLint + Prettier conventions
- Keep components focused (SRP)
- Preserve layer boundaries
- Write tests for domain logic
- Maintain WCAG AA accessibility

## License

PROPRIETARY — © Scott Reinhart
