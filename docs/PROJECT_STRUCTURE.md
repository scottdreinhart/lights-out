# 📁 Project Structure Documentation

**Authority**: AGENTS.md § 4 (Path Discipline) · § 21 (Project Organization) · § 30 (CSS Performance)
**Status**: ✅ CURRENT — Canonical reference (consolidated)
**Generated**: 2026-04-24
**Format**: Markdown (Enhanced Display) | Complete Tree with Annotations

---

## ⭐ Quick Reference

### Repository Overview

- **Type**: pnpm monorepo - 60+ independent game applications + 30+ shared packages
- **Node**: v24.14.1 | pnpm: 10.31.0 | npm: 11.9.0
- **License**: Proprietary
- **Architecture**: CLEAN (Domain/App/UI separation) + Atomic Design patterns

---

## 🏗️ Core Architecture

### Layer Structure (CLEAN Architecture)

```
┌─────────────────────────────────────┐
│           UI Layer                  │
│  atoms/ → molecules/ → organisms/   │
│  (Presentational components only)   │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│           App Layer                 │
│  hooks, context, services           │
│  (React integration, not logic)      │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│        Domain Layer                 │
│  types, rules, AI, constants        │
│  (Pure logic, framework-agnostic)   │
└─────────────────────────────────────┘
```

### Component Hierarchy (Atomic Design)

```
Atoms (Button, Input, Label, Card)
  ↓ compose into
Molecules (FormGroup, MenuItem, StatusBar, GameBoard)
  ↓ compose into
Organisms (App, SettingsModal, ErrorBoundary)
```

---

## 📁 Directory Overview

### Root Level Files

| File                   | Purpose                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `AGENTS.md`            | **🔐 Supreme Authority** - Repository governance rules § 0-30 |
| `GEMINI.md`            | Gemini CLI agent mandates - reinforces AGENTS.md              |
| `CLAUDE.md`            | Claude AI copilot policy - extends AGENTS.md                  |
| `LICENSE`              | Proprietary software license                                  |
| `README.md`            | Project overview, quick start guide                           |
| `pnpm-workspace.yaml`  | Monorepo workspace configuration                              |
| `package.json`         | Root dependencies (pnpm, TypeScript, build tools)             |
| `tsconfig.json`        | TypeScript configuration (strict mode, path aliases)          |
| `eslint.config.js`     | ESLint rules with boundary enforcement                        |
| `vite.config.ts`       | Vite bundler configuration                                    |
| `vitest.config.ts`     | Unit test framework configuration                             |
| `playwright.config.ts` | E2E test configuration                                        |

---

## 🎮 Game Applications (`apps/`)

### 60+ Independent Games

Each application follows a consistent structure, supporting Web, Electron (Desktop), and Capacitor (Mobile).

**Key Apps**: Battleship, Bingo, Blackjack, Checkers, Connect Four, Lights Out, Mancala, Minesweeper, Nim, Reversi, Snake, Sudoku, Tic-Tac-Toe, and many more.

### Game App Structure (Template)

```
apps/{game-name}/
├── assembly/           # AssemblyScript WASM source
├── capacitor.config.ts # Mobile (iOS/Android) config
├── electron/           # Desktop app main/preload
├── index.html          # Web entry point
├── package.json        # Game-specific dependencies
├── public/             # Static assets
│   ├── icon.svg       # App icon
│   ├── manifest.json  # Web manifest
│   ├── offline.html   # Offline fallback
│   └── sw.js          # Service worker
├── src/
│   ├── app/           # React hooks, context, services
│   ├── domain/        # Pure game logic (rules, AI, types)
│   ├── ui/            # Component library (atoms, molecules, organisms)
│   ├── index.tsx      # React root
│   └── styles.css     # Global styles
├── tsconfig.json      # TypeScript config
├── vite.config.js     # Build config
└── vitest.config.ts   # Test config
```

---

## 📁 Shared Packages (`packages/`)

Shared libraries consumed via workspace dependencies and `@games/*` aliases.

| Package              | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `@games/theme-contract` | Shared styling and theme types              |
| `assets-shared`      | Common game assets and sprites                 |
| `shared-hooks`       | Reusable React hooks                           |
| `domain-shared`      | Shared game logic and algorithms               |

---

## 📁 Key Directories at a Glance

| Path                  | Type      | Purpose                     |
| --------------------- | --------- | --------------------------- |
| `apps/`               | Directory | 60+ game applications       |
| `packages/`           | Directory | Shared reusable packages    |
| `src/`                | Directory | Shared monorepo source code |
| `docs/`               | Directory | Documentation hub           |
| `scripts/`            | Directory | Build and automation        |
| `compliance/`         | Directory | Quality and metrics         |
| `tests/`              | Directory | E2E test suites             |
| `tooling/`            | Directory | Development tools           |

---

## 🔐 Governance Authority

**Reading Order**:

1. ⭐ **AGENTS.md** - Supreme authority for all rules (§ 0–30)
2. **GEMINI.md** / **CLAUDE.md** - Agent-specific reinforcements
3. **.github/instructions/** - Domain-specific guidance (build, frontend, electron, etc.)

---

## 🧪 Testing Standards

- **Unit/Integration**: Vitest (`*.unit.test.ts`, `*.integration.test.ts`)
- **E2E/A11y/Visual**: Playwright (`*.e2e.spec.ts`, `*.a11y.spec.ts`)
- **Strict Naming**: `<feature>.<type>.(test|spec).ts` (Mandatory)
