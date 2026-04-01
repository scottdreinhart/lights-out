# Sudoku Game

A full-featured Sudoku puzzle game built with React, TypeScript, and following the game-platform's CLEAN architecture.

## Features

- 🎮 Four difficulty levels: Easy, Medium, Hard, Expert
- ⏱️ Timer to track how long it takes to solve
- ✨ Responsive design (mobile, tablet, desktop)
- 🎯 Smart cell validation
- ♿ WCAG AA accessibility compliant
- 📱 Works on desktop, mobile, and web

## Getting Started

### Development

```bash
# Start dev server (localhost:5173)
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

### Desktop (Electron)

```bash
# Development mode
pnpm electron:dev

# Build for Windows
pnpm electron:build:win

# Build for Linux
pnpm electron:build:linux

# Build for macOS
pnpm electron:build:mac
```

### Mobile (Capacitor)

```bash
# Sync and deploy to Android
pnpm cap:sync
pnpm cap:run:android

# Sync and deploy to iOS
pnpm cap:sync
pnpm cap:run:ios
```

## Architecture

This game follows the game-platform's CLEAN architecture:

- **`src/domain/`** — Pure Sudoku logic (rules, board generation, validation)
- **`src/app/`** — React hooks and state management (useGame, useResponsiveState)
- **`src/ui/`** — UI components (atoms → molecules → organisms)
  - **atoms/** — Primitive components (Button, SudokuCell, Card)
  - **molecules/** — Composed groups (SudokuBoard)
  - **organisms/** — Feature screens (SudokuGame)

## Quality Assurance

```bash
# Run all quality checks
pnpm validate  # lint + typecheck + build

# Run specific checks
pnpm lint
pnpm typecheck
pnpm format:check
pnpm test
```

## Technologies

- React 19.2.4
- TypeScript 5.9.3
- Vite 7.3.1
- Vitest 4.0.18
- Electron 40.8.0
- Capacitor 8.2.0

## License

PROPRIETARY - © Scott Reinhart
