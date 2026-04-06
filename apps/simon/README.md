# Simon - Classic Memory Game Implementation

> A full-stack implementation of Simon, the classic memory game, built with React, TypeScript, and modern web technologies.

## 🎮 Game Overview

Simon is a memory game where players must repeat increasingly longer sequences of colors. The game tests and improves memory and concentration.

### How to Play

1. Press **Start** to begin the game
2. Watch as Simon displays a sequence of colored buttons (4 total)
3. Repeat the sequence exactly by clicking the buttons in the same order
4. Each round, Simon adds one more color to the sequence
5. Win by matching all sequences up to level 20
6. One mistake and the game ends!

## 🏗️ Architecture

This implementation follows the **CLEAN Architecture** pattern with three functional layers:

### Domain Layer (`src/domain/`)
Pure business logic, framework-agnostic:

- **types.ts** — Game state, rules, enums
- **rules.ts** — Game rule enforcement, move validation
- **constants.ts** — Configuration, difficulty settings
- **ai.ts** — Simon's decision-making engine
- **simonGame.ts** — Core game state machine
- **index.ts** — Barrel export (public API)

### App Layer (`src/app/`)
React integration, state management, services:

- **hooks/useSimonGame.ts** — Main game hook, orchestrates domain logic
- **hooks/useColorAnimation.ts** — Color sequence animation control
- **hooks/index.ts** — Hook exports
- **index.ts** — Barrel export (public API)

### UI Layer (`src/ui/`)
Presentational components following atomic design:

- **atoms/** — Button, Badge, Container primitives
- **molecules/** — ColorButton, ButtonGroup, StatusBar composed patterns
- **organisms/** — GameBoard, MainMenu, RulesModal feature screens
- **index.ts** — Barrel export (public API)

## 🎯 Core Features

### Game Mechanics

✅ **Dynamic Sequence Generation** — Simon generates sequences using constrained randomization
✅ **Player Input Validation** — Real-time input validation against Simon's sequence
✅ **Progressive Difficulty** — Adaptive game difficulty based on sequence length
✅ **Timeout Management** — Input timeout after each Simon move
✅ **Win/Lose Detection** — Automatic game end detection with clear feedback

### User Experience

✅ **Main Menu** — Clean home screen with variant selection
✅ **Rules Modal** — Accessible game rules and configuration display
✅ **Responsive Design** — Works on mobile (375px), tablet (600px), desktop (900px+)
✅ **Visual Feedback** — Color pulses, highlights, status updates
✅ **Keyboard Support** — Full keyboard navigation and number/letter based color selection
✅ **Accessibility** — WCAG 2.1 AA compliant (contrast, semantics, focus, labels)

### Game Variants

The system supports multiple rule variants:

1. **Classic** (default) — Traditional Simon with 4 colors, 20 rounds
2. **Hard Mode** — 5 colors, faster timing, 25 rounds
3. **Zen Mode** — 4 colors, no timer, unlimited attempts (learning mode)

## 📁 Directory Structure

```
apps/simon/
├── src/
│   ├── domain/              # Game logic layer
│   │   ├── types.ts         # Types and constants
│   │   ├── rules.ts         # Game rule engine
│   │   ├── ai.ts            # Simon's move selection
│   │   ├── simonGame.ts      # State machine
│   │   └── index.ts         # Public API
│   ├── app/                 # React hooks and services
│   │   ├── hooks/
│   │   │   ├── useSimonGame.ts
│   │   │   └── useColorAnimation.ts
│   │   └── index.ts         # Public API
│   ├── ui/                  # React components
│   │   ├── atoms/           # Primitives
│   │   ├── molecules/       # Composed patterns
│   │   ├── organisms/       # Feature screens
│   │   └── index.ts         # Public API
│   ├── App.tsx              # Root application component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── vite.config.ts           # Build configuration
├── package.json             # Dependencies and scripts
└── tsconfig.json (inherited from workspace root)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 24.14.1+
- pnpm 10.31.0+

### Installation

```bash
# From workspace root
pnpm install
```

### Development

```bash
# Start dev server (port 5173)
pnpm --filter @games/simon dev

# Or from the app directory
cd apps/simon
pnpm dev
```

### Build

```bash
# Production build
pnpm --filter @games/simon build

# Preview production build
pnpm --filter @games/simon preview
```

### Quality Gates

```bash
# Run all checks (lint + typecheck + build)
pnpm --filter @games/simon validate

# Lint TypeScript and JSX
pnpm --filter @games/simon lint

# Auto-fix linting issues
pnpm --filter @games/simon lint:fix

# Format code
pnpm --filter @games/simon format

# Type checking
pnpm --filter @games/simon typecheck
```

## 🧪 Testing

```bash
# Run unit and integration tests
pnpm --filter @games/simon test

# Watch mode
pnpm --filter @games/simon test:watch
```

## 🎨 Responsive Design

Simon is fully responsive across all device sizes:

| Breakpoint | Width | Device | Strategy |
|-----------|-------|--------|----------|
| Mobile | <600px | Phones | Single-column, touch-optimized |
| Tablet | 600–899px | Tablets | Balanced layout |
| Desktop | ≥900px | Laptops | Full-featured layout |

All components use the `useResponsiveState()` hook to adapt layouts and spacing.

## ♿ Accessibility

Simon is built with **WCAG 2.1 AA** compliance:

✅ **Keyboard Navigation** — All controls usable via keyboard (Tab, Enter, number keys)
✅ **Color Contrast** — All text meets 4.5:1 contrast ratio (AAA)
✅ **Semantic HTML** — Proper button, form, and heading semantics
✅ **ARIA Labels** — All interactive elements labeled
✅ **Focus Management** — Clear focus indicators, focus trap in modals
✅ **Text Alternatives** — No information conveyed by color alone

## 📊 Performance

| Metric | Target | Notes |
|--------|--------|-------|
| FCP | <1.5s | First Contentful Paint |
| LCP | <2.5s | Largest Contentful Paint |
| CLS | <0.1 | Cumulative Layout Shift |
| TTI | <3.5s | Time To Interactive |

## 🛠️ Technology Stack

- **React** 19.2.4 — UI framework
- **TypeScript** 5.9.3 — Type safety
- **Vite** 7.3.1 — Build tool
- **CSS Modules** — Scoped styling
- **Vitest** — Unit testing framework

## 📝 Implementation Notes

### State Management

The game uses **React hooks with Context** for state management:

- `useSimonGame()` — Primary game hook (orchestrates domain logic)
- `useColorAnimation()` — Animation state management
- React.useState for local component state

No Redux or external state management library is required for Simon's complexity.

### Component Guidelines

All components follow these principles:

- **Single Responsibility** — Each component has one purpose
- **Composability** — Atoms compose into molecules, molecules into organisms
- **Props-Based Configuration** — All behavior controlled via props
- **Accessibility First** — Built with keyboard and screen reader support
- **Responsive by Default** — All components work across all device sizes

### Domain Layer Design

The domain layer is completely **framework-agnostic**:

- No React imports
- Pure functions returning new state
- Full test coverage
- Reusable across platforms (web, Electron, mobile)

## 🔄 Integration with Game Platform

Simon follows the platform's standard patterns:

✅ Uses **shared-kernel** for message protocols
✅ Uses **ui-board-core** for board rendering (if applicable)
✅ Uses **shared-hooks** for common patterns
✅ Implements **game-shell** layout
✅ Complies with **platform-compliance** matrix

## 📦 Deployment

Simon can be deployed to:

- **Web** — Via Vite build to static hosting
- **Electron** — Desktop application (Windows, macOS, Linux)
- **Capacitor** — Mobile (iOS, Android)
- **App Store** — iOS App Store, Google Play

Each target uses the same `src/` codebase with platform-specific wrappers.

## 📚 Further Reading

- `AGENTS.md` — Workspace governance and architecture decisions
- `.github/copilot-instructions.md` — AI tool expectations
- `.github/instructions/06-responsive.instructions.md` — Responsive design patterns
- `.github/instructions/09-wcag-accessibility.instructions.md` — Accessibility standards
- `docs/` — Additional platform documentation

## 📄 License

PROPRIETARY — All rights reserved

---

**Last Updated**: 2025-01-23  
**Maintainer**: Scott Reinhart

