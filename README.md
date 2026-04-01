# 💡 Lights Out

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://github.com/facebook/react)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://github.com/vitejs/vite)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://github.com/microsoft/TypeScript)
[![AssemblyScript](https://img.shields.io/badge/AssemblyScript-0.28-007AAC?logo=assemblyscript&logoColor=white)](https://github.com/AssemblyScript/assemblyscript)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-AI_Engine-654FF0?logo=webassembly&logoColor=white)](https://webassembly.org/)
[![CSS Modules](https://img.shields.io/badge/CSS_Modules-scoped-1572B6?logo=cssmodules&logoColor=white)](https://github.com/css-modules/css-modules)
[![Electron](https://img.shields.io/badge/Electron-41-47848F?logo=electron&logoColor=white)](https://github.com/electron/electron)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?logo=capacitor&logoColor=white)](https://github.com/ionic-team/capacitor)
[![Node.js](https://img.shields.io/badge/Node.js-24-5FA04E?logo=nodedotjs&logoColor=white)](https://github.com/nodejs/node)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)](https://github.com/pnpm/pnpm)
[![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint&logoColor=white)](https://github.com/eslint/eslint)
[![Prettier](https://img.shields.io/badge/Prettier-3-F7B93E?logo=prettier&logoColor=black)](https://github.com/prettier/prettier)
[![All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-scottdreinhart%2Fgame--platform-181717?logo=github&logoColor=white)](https://github.com/scottdreinhart/game-platform)

Toggle a 5×5 grid of lights; goal is to turn them all off

**⚠️ PROPRIETARY SOFTWARE — All Rights Reserved**

© 2026 Scott Reinhart. This software is proprietary and confidential.
Unauthorized reproduction, distribution, or use is strictly prohibited.
See [LICENSE](LICENSE) file for complete terms and conditions.

> [!CAUTION]
> **LICENSE TRANSITION PLANNED** — This project is currently proprietary. The license will change to open source once the project has reached a suitable state to allow for it.

[Project Structure](#project-structure) · [Getting Started](#getting-started) · [Tech Stack](#tech-stack) · [Contributing](#contributing) · [Portfolio Services](#portfolio-services) · [Future Game Ideas](#future-game-ideas)

## Project Structure

**Monorepo with 25 game applications and 11 shared packages**

```
lights-out/
├── README.md                         # Root documentation (this file)
├── AGENTS.md                         # Monorepo governance & architecture authority
├── LICENSE                           # Proprietary software license
├── package.json                      # Workspace root dependencies & scripts
├── pnpm-lock.yaml                    # pnpm lockfile (locked versions)
├── pnpm-workspace.yaml               # pnpm workspace configuration
├── tsconfig.json                     # Root TypeScript config (strict mode, @/ aliases)
├── eslint.config.js                  # Root ESLint config (flat config, all games)
├── playwright.config.ts              # E2E test configuration
├── .npmrc                            # pnpm config (save-exact, auto-install-peers)
├── .prettierrc                       # Prettier formatting rules
├── .nvmrc                            # Node.js version pin (v24)
├── .gitattributes                    # Git line endings and binary rules
├── .gitignore                        # Git ignore patterns
│
├── apps/                             # 25 game applications (monorepo structure)
│   ├── battleship/                   # Battleship game
│   ├── bunco/                        # Bunco dice/scoring game
│   ├── cee-lo/                       # Cee-lo gambling game
│   ├── checkers/                     # Checkers board game
│   ├── chicago/                      # Chicago dice game
│   ├── cho-han/                      # Chō-han traditional Japanese game
│   ├── connect-four/                 # Connect Four grid game
│   ├── farkle/                       # Farkle dice-rolling game
│   ├── hangman/                      # Hangman word-guessing game
│   ├── liars-dice/                   # Liar's Dice bluffing game
│   ├── lights-out/                   # Lights Out grid puzzle (reference legacy app)
│   ├── mancala/                      # Mancala pit-and-capture game
│   ├── memory-game/                  # Memory / Concentration matching game
│   ├── mexico/                       # Mexico elimination dice game
│   ├── minesweeper/                  # Minesweeper minefield puzzle
│   ├── monchola/                     # Monchola dice/board race game
│   ├── nim/                          # Nim strategy game
│   ├── pig/                          # Pig jeopardy dice game
│   ├── reversi/                      # Reversi / Othello piece-capture game
│   ├── rock-paper-scissors/          # Rock Paper Scissors vs CPU
│   ├── ship-captain-crew/            # Ship Captain Crew dice game
│   ├── shut-the-box/                 # Shut the Box dice/tile game
│   ├── simon-says/                   # Simon Says memory/sequence game
│   ├── snake/                        # Snake real-time survival game
│   └── tictactoe/                    # Tic-Tac-Toe reference architecture
│
├── packages/                         # 11 shared libraries
│   ├── app-hook-utils/               # Reusable React hooks for all games
│   ├── assets-shared/                # Shared sprite sheets and game assets
│   ├── common/                       # Common utilities (types, helpers)
│   ├── crash-utils/                  # Error handling & crash reporting
│   ├── display-contract/             # Display/render type contracts
│   ├── domain-shared/                # Shared game domain logic
│   ├── sprite-contract/              # Sprite system type contracts
│   ├── stats-utils/                  # Statistics tracking utilities
│   ├── storage-utils/                # localStorage & persistence helpers
│   ├── theme-contract/               # Theme/styling type contracts
│   └── ui-utils/                     # Shared UI component utilities
│
├── scripts/                          # Build and automation scripts
│   ├── build-wasm.js                 # AssemblyScript → WASM → base64 generator
│   ├── consolidate-domain-shared.sh  # Consolidate shared domain logic
│   └── *.sh                          # Batch processing & orchestration scripts
│
├── src/                              # Root app sources (shared/demo code)
│   ├── domain/                       # Shared domain logic
│   ├── app/                          # Shared React hooks & context
│   ├── ui/                           # Shared UI components
│   ├── themes/                       # Theme CSS modules
│   ├── wasm/                         # WASM AI loader
│   ├── workers/                      # Web Worker entry points
│   ├── index.tsx                     # Root React entry (demo)
│   └── styles.css                    # Global styles
│
├── docs/                             # Documentation
│   ├── README.md                     # Documentation index
│   ├── DEVELOPER-GUIDE.md            # Development guidelines
│   └── */                            # Governance, deployment, analysis docs
│
├── .github/                          # GitHub configuration
│   └── instructions/                 # 15+ detailed instruction files (build, responsive, AI, etc.)
│
└── tooling/                          # Additional tooling & utilities
```

### Each Game App Structure

All 25 game apps follow the CLEAN Architecture pattern with consistent 5+ level directory hierarchy:

```
apps/{game-name}/
├── src/
│   ├── domain/                       # Pure, framework-agnostic game logic
│   │   ├── ai.ts                     # AI decision-making algorithms
│   │   ├── board.ts                  # Board state & operations
│   │   ├── constants.ts              # Game constants & configuration
│   │   ├── rules.ts                  # Game rules & validation
│   │   ├── types.ts                  # Game-specific type definitions
│   │   ├── themes.ts                 # Theme/color definitions
│   │   └── index.ts                  # Barrel export
│   │
│   ├── app/                          # React hooks & context integration
│   │   ├── context/                  # Context providers
│   │   │   ├── GameContext.tsx       # Game state context
│   │   │   ├── ThemeContext.tsx      # Theme provider (shared)
│   │   │   └── SoundContext.tsx      # Sound provider (shared)
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useGame.ts            # Game state & orchestration
│   │   │   ├── useTheme.ts           # Theme management
│   │   │   ├── useSoundEffects.ts    # Sound playback control
│   │   │   └── useResponsiveState.ts # Responsive design state
│   │   ├── services/                 # Utility services
│   │   │   ├── storageService.ts     # localStorage wrapper
│   │   │   ├── analyticsService.ts   # Analytics tracking
│   │   │   └── crashLogger.ts        # Error logging
│   │   └── index.ts                  # Barrel export
│   │
│   ├── ui/                           # Presentational components (Atomic Design)
│   │   ├── atoms/                    # Elementary UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Icon.tsx
│   │   │   └── index.ts              # Barrel export
│   │   │
│   │   ├── molecules/                # Composed atom groups
│   │   │   ├── FormGroup.tsx
│   │   │   ├── CardSection.tsx
│   │   │   ├── MenuItem.tsx
│   │   │   ├── DialogFooter.tsx
│   │   │   ├── TabBar.tsx
│   │   │   ├── HamburgerMenu.tsx
│   │   │   ├── DifficultySelector.tsx
│   │   │   ├── DropdownMenu.tsx
│   │   │   └── index.ts              # Barrel export
│   │   │
│   │   ├── organisms/                # Feature-complete screens
│   │   │   ├── GameBoard.tsx         # Main game interface
│   │   │   ├── SettingsModal.tsx     # Settings configuration
│   │   │   ├── ResultsTable.tsx      # Results/history display
│   │   │   ├── MainMenu.tsx          # Home screen
│   │   │   ├── StatusBar.tsx         # Game status overlay
│   │   │   └── index.ts              # Barrel export
│   │   │
│   │   ├── theme/                    # Design tokens & utilities
│   │   │   ├── tokens/               # Design token definitions
│   │   │   │   ├── colors.ts
│   │   │   │   ├── spacing.ts
│   │   │   │   └── typography.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/                    # UI utilities
│   │   │   ├── cssModules.ts         # Class binding utility (cx)
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts                  # Barrel export (all layers)
│   │
│   ├── infrastructure/               # Platform-specific implementation
│   │   ├── audio/                    # Web Audio API & sound synthesis
│   │   │   ├── synth.ts              # Sound synthesis engine
│   │   │   ├── effects.ts            # Audio effects
│   │   │   └── index.ts
│   │   │
│   │   ├── haptics/                  # Vibration API
│   │   │   ├── patterns.ts           # Haptic patterns (tick, tap, heavy)
│   │   │   └── index.ts
│   │   │
│   │   ├── storage/                  # Data persistence
│   │   │   ├── localStorage.ts       # Browser storage wrapper
│   │   │   ├── indexedDB.ts          # IndexedDB for large data
│   │   │   └── index.ts
│   │   │
│   │   ├── platform/                 # Platform detection & capabilities
│   │   │   ├── detect.ts             # Platform sniffing
│   │   │   ├── capabilities.ts       # Feature detection
│   │   │   └── index.ts
│   │   │
│   │   ├── diagnostics/              # Performance & error tracking
│   │   │   ├── metrics.ts            # Web Vitals collection
│   │   │   ├── errorTracking.ts      # Error boundary integration
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── ui/                           # Themes (lazy-loaded CSS)
│   │   ├── highcontrast.css          # High-contrast theme
│   │   ├── ocean.css                 # Ocean/blue theme
│   │   ├── sunset.css                # Sunset/warm theme
│   │   ├── forest.css                # Forest/green theme
│   │   ├── rose.css                  # Rose/pink theme
│   │   └── midnight.css              # Midnight/dark theme
│   │
│   ├── wasm/                         # WASM AI engine loader
│   │   ├── ai-wasm.ts                # Auto-generated base64 WASM (DO NOT EDIT)
│   │   └── index.ts
│   │
│   ├── workers/                      # Web Worker entry points
│   │   ├── ai.worker.ts              # Off-main-thread AI computation
│   │   └── index.ts
│   │
│   ├── electron/                     # Electron-specific code
│   │   ├── preload.ts                # Context bridge
│   │   └── index.ts
│   │
│   ├── assets/                       # Game-specific assets
│   │   ├── sprites/                  # Sprite sheets & game graphics
│   │   ├── sounds/                   # Sound files & audio assets
│   │   └── fonts/                    # Custom fonts
│   │
│   ├── __tests__/                    # Test files (co-located pattern)
│   │   ├── domain.test.ts
│   │   ├── ai.test.ts
│   │   ├── rules.test.ts
│   │   └── ui.test.tsx
│   │
│   ├── index.tsx                     # React entry point (ThemeProvider > SoundProvider > ErrorBoundary > App)
│   └── styles.css                    # Global component styles
│
├── public/
│   ├── manifest.json                 # PWA manifest (app metadata)
│   ├── sw.js                         # Service worker (offline support)
│   ├── offline.html                  # Offline fallback page
│   ├── icons/                        # App icons (multiple sizes)
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── favicon.ico
│   └── index.html                    # HTML entry point
│
├── electron/                         # Electron main process & preload
│   ├── main.js                       # Electron main process (window creation)
│   ├── preload.js                    # Sandboxed context bridge (security boundary)
│   └── builds/                       # Build outputs (installer, DMG, etc.)
│
├── assembly/                         # AssemblyScript (if using WASM AI)
│   ├── index.ts                      # WASM AI entry point
│   ├── tsconfig.json                 # AssemblyScript compiler config
│   └── build/                        # WASM build output (gitignored)
│
├── scripts/                          # Game-specific build scripts
│   ├── build-wasm.js                 # WASM compiler wrapper
│   └── generate-assets.js            # Asset pipeline
│
├── dist/                             # Vite production build (gitignored)
│   ├── index.html
│   ├── assets/
│   │   ├── index-XXXXX.js
│   │   ├── style-XXXXX.css
│   │   └── vendor-XXXXX.js
│   └── sw.js
│
├── node_modules/                     # Dependencies (gitignored, pnpm hoisted)
│
├── vite.config.js                    # Vite bundler configuration
├── capacitor.config.ts               # Capacitor native app config (iOS/Android)
├── tsconfig.json                     # TypeScript config (extends root)
├── package.json                      # App dependencies & scripts
└── README.md                         # Game-specific documentation
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v24+ (pin via [nvm](https://github.com/nvm-sh/nvm) — see `.nvmrc`)
- [pnpm](https://pnpm.io/) v10+

### Install & Run

```bash
# Install dependencies
pnpm install

# Start development server (accessible on LAN via 0.0.0.0)
pnpm start          # quick alias — vite --host
pnpm dev            # same + kills stale port 5173 first

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Build then preview in one step
pnpm build:preview
```

### Code Quality

```bash
# Individual tools
pnpm lint           # ESLint — check for issues
pnpm lint:fix       # ESLint — auto-fix issues
pnpm format         # Prettier — format all source files
pnpm format:check   # Prettier — check formatting without writing
pnpm typecheck      # TypeScript type check (tsc --noEmit)

# Chains
pnpm check          # lint + format:check + typecheck in one pass (quality gate)
pnpm fix            # lint:fix + format in one pass (auto-fix everything)
pnpm validate       # check + build — full pre-push validation
```
## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://github.com/facebook/react) | 19 | UI library (hooks, memo, lazy) |
| [TypeScript](https://github.com/microsoft/TypeScript) | 5.9 | Static type checking (strict mode) |
| [Vite](https://github.com/vitejs/vite) | 8 | Build tool & dev server |
| [Electron](https://github.com/electron/electron) | 41 | Desktop app (Windows / Linux / macOS) |
| [Capacitor](https://github.com/ionic-team/capacitor) | 8 | Native mobile / tablet apps (Android / iOS) |
| [electron-builder](https://github.com/electron-userland/electron-builder) | 26 | Desktop packaging & installers |
| [CSS Modules](https://github.com/css-modules/css-modules) | — | Scoped component styling |
| [ESLint](https://github.com/eslint/eslint) | 10 | Linting (flat config, React + hooks plugins) |
| [Prettier](https://github.com/prettier/prettier) | 3 | Code formatting |
| [pnpm](https://github.com/pnpm/pnpm) | 10 | Fast, disk-efficient package manager |
| [Node.js](https://github.com/nodejs/node) | 24 | Runtime (pinned via `.nvmrc`) |

## Architecture

This project enforces nine complementary design principles:

1. **CLEAN Architecture** (Layer Separation)
   - `domain/` layer: Pure, framework-agnostic logic (zero React dependencies)
   - `app/` layer: React hooks for state management & side effects
   - `ui/` layer: Presentational components (atoms → molecules → organisms)
   - **Benefit**: Domain logic is testable, reusable, and framework-independent

2. **Atomic Design** (Component Hierarchy)
   - Data flows unidirectionally: **Hooks → Organism → Molecules → Atoms**
   - Organisms contain zero inline markup; all composition happens in JSX
   - **Benefit**: Components are predictable, composable, and reusable across contexts

3. **SOLID Principles** (Code-Level Design)
   - Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
   - **Benefit**: Code is maintainable, testable, and resistant to side effects

4. **DRY Principle** (No Duplication)
   - Constants extracted to single sources; reusable hooks eliminate component duplication
   - **Benefit**: Changes propagate consistently; less code to maintain

5. **Import Boundary Enforcement** (`eslint-plugin-boundaries`)
   - `domain/` → may only import from `domain/` (zero framework deps)
   - `app/` → may import `domain/` + `app/` (never `ui/`)
   - `ui/` → may import `domain/`, `app/`, and `ui/` (full downstream access)
   - `workers/` → may only import `domain/` (pure computation)
   - `themes/` → may not import anything (pure CSS data)
   - **Benefit**: CLEAN layer violations are caught at lint time, not at code review

6. **Path Aliases** (`@/domain`, `@/app`, `@/ui`)
   - Configured in `tsconfig.json` (`paths`) and per-app `vite.config.ts` (`resolve.alias`)
   - Eliminates fragile `../../` relative imports across layers
   - **Benefit**: Imports are self-documenting (`@/domain/rules` vs `../../domain/rules`) and resilient to file moves

7. **Barrel Exports** (`index.ts` per directory)
   - Each layer exposes a single public API via its barrel file
   - Internal module structure can change without breaking consumers
   - **Benefit**: Explicit public APIs; refactoring internals doesn't cascade import changes

8. **React Error Boundaries** (Crash Isolation)
   - `ErrorBoundary` component wraps the game at the organism level
   - Catches render errors and displays a themed fallback UI with a retry button
   - Prevents a single component crash from taking down the entire app
   - **Benefit**: Graceful degradation — users see an actionable error, not a white screen

9. **React Context for Dependency Injection** (ThemeProvider + SoundProvider)
   - `ThemeProvider` provides theme state to the entire tree via React Context
   - `SoundProvider` provides sound state + guarded play functions via React Context
   - Both wired at the root in `index.tsx`: `ThemeProvider > SoundProvider > ErrorBoundary > App`
   - **Benefit**: Any component can access theme or sound state without prop drilling

## Device Compatibility

| Platform | Native App Tech | Distribution | Input Method | Web | Native App |
|---|---|---|---|:---:|:---:|
| **Desktop** | | | | | |
| Windows | Electron | `.exe` / Microsoft Store | Mouse, keyboard, trackpad | ✅ | ✅ |
| macOS | Electron | `.dmg` / Mac App Store | Mouse, keyboard, trackpad | ✅ | ✅ |
| Linux | Electron | `.AppImage` / `.deb` / `.snap` | Mouse, keyboard, trackpad | ✅ | ✅ |
| **Mobile** | | | | | |
| Android | Capacitor | Google Play Store / `.apk` | Touch, swipe gestures | ✅ | ✅ |
| iOS | Capacitor | App Store | Touch, swipe gestures | ✅ | ✅ |
| **Tablets** | | | | | |
| iPad | Capacitor (iOS) | App Store | Touch, swipe gestures | ✅ | ✅ |
| Android tablets | Capacitor (Android) | Google Play Store | Touch, swipe gestures | ✅ | ✅ |
| Amazon Fire tablets | Capacitor (Android) | Amazon Appstore | Touch, swipe gestures | ✅ | ✅ |

## Remaining Work

### Visual & UX

- [ ] **Game UI implementation** — build the complete game interface with animations and effects
- [ ] **Theme system** — multiple color themes with light/dark/system mode + colorblind presets
- [ ] **Sound effects** — Web Audio API synthesized SFX + background music
- [ ] **Responsive design refinements** — ensure all 25 games display optimally across mobile, tablet, desktop, widescreen, and ultrawide viewports
- [ ] **Accessibility compliance** — full WCAG AA testing across all games and platforms

### Performance & Optimization

- [ ] **WASM AI optimization** — benchmark AI decision times and optimize minimax search depth for each game complexity level
- [ ] **Bundle analysis** — profile and reduce JavaScript bundle size using `pnpm run build:analyze`
- [ ] **Worker thread optimization** — ensure CPU-intensive AI runs off-main-thread where beneficial
- [ ] **Lazy-loading themes** — implement dynamic theme chunk loading to reduce initial bundle size

### Testing & Quality Assurance

- [ ] **Unit test coverage** — achieve >80% coverage across domain logic, hooks, and utilities
- [ ] **Integration tests** — cross-game hook compatibility testing (e.g., `useStats`, `useTheme` work everywhere)
- [ ] **E2E tests** — Playwright tests for core gameplay flows and mobile gestures
- [ ] **Accessibility testing** — automated WCAG validation + manual keyboard/screen reader tests

### Platform Builds

- [ ] **Electron packaging** — test Windows `.exe`, Linux `.AppImage`, macOS `.dmg` installers
- [ ] **Capacitor mobile** — build and submit Android `.apk` to Google Play Store
- [ ] **iOS Capacitor** — build and submit iOS app to Apple App Store
- [ ] **PWA optimization** — service worker, offline support, installable badge

### Monorepo Consolidation

- [ ] **All 25 games migrated** — verify all games follow CLEAN Architecture and import shared packages
- [ ] **Shared package exports** — ensure all `packages/*/index.ts` exports are properly defined
- [ ] **Pnpm workspace validation** — test builds and monorepo scripts across all game combinations
- [ ] **CI/CD pipeline** — set up GitHub Actions for lint, test, build gates on every PR
## Portfolio Services

Infrastructure services and API backends supporting the game portfolio:

| Service | Type | Description |
| ------- | ---- | ----------- |
| **[💳 Game Billing](https://github.com/scottdreinhart/game-billing)** | Admin App | Payment processing & subscription management |
| **[🎨 Theme Store](https://github.com/scottdreinhart/theme-store)** | Admin App | DLC theme downloader & manager |
| **[📺 Ad Network](https://github.com/scottdreinhart/ad-network)** | Admin App | Ad serving & revenue management |
| **[💳 Billing API](https://github.com/scottdreinhart/billing-api)** | Fastify API | Payment & subscription API backend |
| **[🎨 Themes API](https://github.com/scottdreinhart/themes-api)** | Fastify API | Theme catalog & DLC distribution API backend |
| **[📺 Ads API](https://github.com/scottdreinhart/ads-api)** | Fastify API | Ad serving & impression tracking API backend |
| **[🏆 Rankings API](https://github.com/scottdreinhart/rankings-api)** | Fastify API | King of the Hill multiplayer ranking & leaderboard API backend |

## Future Game Ideas

All games in this portfolio share the same React + Vite + TypeScript + CLEAN architecture stack:

| Game | Description | Complexity |
| ---- | ----------- | ---------- |
| **[Tic-Tac-Toe](https://github.com/scottdreinhart/tictactoe)** | Classic 3×3 grid game with 4 AI difficulty levels and series mode | Baseline — the reference architecture |
| **[Shut the Box](https://github.com/scottdreinhart/shut-the-box)** | Roll dice, flip numbered tiles to match the total; lowest remaining sum wins | Similar — grid UI + dice logic |
| **[Mancala (Kalah)](https://github.com/scottdreinhart/mancala)** | Two-row pit-and-stones capture game; simple rules, satisfying chain moves | Slightly higher — seed-sowing animation |
| **[Connect Four](https://github.com/scottdreinhart/connect-four)** | Drop discs into a 7×6 grid; first to four in a row wins | Similar — larger grid, same win-check pattern |
| **[Simon Says](https://github.com/scottdreinhart/simon-says)** | Repeat a growing sequence of colors/sounds; memory challenge | Similar — leverages existing Web Audio API |
| **[Lights Out](https://github.com/scottdreinhart/game-platform)** | Toggle a 5×5 grid of lights; goal is to turn them all off | Similar — grid + toggle logic |
| **[Nim](https://github.com/scottdreinhart/nim)** | Players take turns removing objects from piles; last to take loses | Simpler — minimal UI, pure strategy |
| **[Hangman](https://github.com/scottdreinhart/hangman)** | Guess letters to reveal a hidden word before the stick figure completes | Similar — alphabet grid + SVG drawing |
| **[Memory / Concentration](https://github.com/scottdreinhart/memory-game)** | Flip cards to find matching pairs on a grid | Similar — grid + flip animation |
| **[2048](https://github.com/scottdreinhart/2048)** | Slide numbered tiles on a 4×4 grid; merge matching tiles to reach 2048 | Slightly higher — swipe input + merge logic |
| **[Reversi (Othello)](https://github.com/scottdreinhart/reversi)** | Place discs to flip opponent's pieces; most discs wins | Moderately higher — flip-chain logic + AI |
| **[Checkers](https://github.com/scottdreinhart/checkers)** | Classic diagonal-move capture board game | Higher — move validation + multi-jump |
| **[Battleship](https://github.com/scottdreinhart/battleship)** | Place ships on a grid, take turns guessing opponent locations | Moderately higher — two-board UI + ship placement |
| **[Snake](https://github.com/scottdreinhart/snake)** | Steer a growing snake to eat food without hitting walls or itself | Different — real-time game loop instead of turn-based |
| **[Monchola](https://github.com/scottdreinhart/monchola)** | Traditional dice/board race game with capture mechanics | Similar — dice roll + board path + capture rules |
| **[Rock Paper Scissors](https://github.com/scottdreinhart/rock-paper-scissors)** | Best-of-N rounds against the CPU with hand animations | Simpler — minimal state, animation-focused |
| **[Minesweeper](https://github.com/scottdreinhart/minesweeper)** | Reveal cells on a minefield grid without detonating hidden mines | Moderately higher — flood-fill reveal + flag logic |
| **[Pig](https://github.com/scottdreinhart/pig)** | A jeopardy dice game where players roll a single die to accumulate points, but lose all points for the turn if they roll a 1 | Simpler — single die, push-your-luck logic |
| **[Farkle](https://github.com/scottdreinhart/farkle)** | A scoring game where players roll six dice to build combinations; failure to score on a roll results in a "farkle" and loss of turn points | Moderately higher — multi-dice combo scoring |
| **[Cee-lo](https://github.com/scottdreinhart/cee-lo)** | A gambling game using three dice where players win by rolling specific combinations like 4-5-6 or triples | Similar — combo detection + round resolution |
| **[Ship, Captain, and Crew](https://github.com/scottdreinhart/ship-captain-crew)** | A fast-paced game where players must roll a 6, 5, and 4 in sequence to qualify their remaining dice for scoring | Similar — sequential lock-in mechanic |
| **[Liar's Dice](https://github.com/scottdreinhart/liars-dice)** | A bluffing game where players bid on the total number of dice of a certain value hidden under all players' cups | Higher — bluff AI + hidden information |
| **[Bunco](https://github.com/scottdreinhart/bunco)** | A social game played in rounds where players earn points by rolling specific numbers matching the current round | Simpler — round-based target matching |
| **[Mexico](https://github.com/scottdreinhart/mexico)** | A simple elimination game where players roll two dice and must match or beat the "leader's" score to stay in the round | Similar — elimination round logic |
| **[Chō-han](https://github.com/scottdreinhart/cho-han)** | A traditional Japanese game where players bet on whether the sum of two hidden dice is even (Chō) or odd (Han) | Simpler — binary bet + reveal animation |
| **[Chicago](https://github.com/scottdreinhart/chicago)** | An 11-round game where players score by rolling a sum that matches the specific target number for that round | Similar — round-target scoring system |

## Contributing

This is proprietary software. Contributions are accepted by invitation only.

If you have been granted contributor access:

1. Create a feature branch from `main`
2. Make focused, single-purpose commits with clear messages
3. Run `pnpm validate` before pushing (lint + format + build gate)
4. Submit a pull request with a description of the change

See the [LICENSE](LICENSE) file for usage restrictions.


## Governance Adoption

This project adheres to a standardized governance framework. The governance package includes:

### Security
- **ESLint Security Rules** — 8 XSS/injection detection rules (`eslint-plugin-security`)
- Reference: [Security Guidelines](./.github/instructions/10-security.instructions.md)

### Accessibility
- **WCAG AA Compliance** — 30+ accessibility guidelines
- Reference: [Accessibility Guidelines](./.github/instructions/09-wcag-accessibility.instructions.md)

### Quality Standards
- **Error Handling** — ErrorBoundary component for graceful error recovery
- **Performance Monitoring** — Web Vitals tracking via `usePerformanceMetrics` hook
- **Mobile Gestures** — Swipe/longpress gesture handlers
- **Commit Convention** — Commitizen integration for structured commit messages

### See Also
- Development Build & Deployment: [01-build.instructions.md](./.github/instructions/01-build.instructions.md)
- Performance Guidelines: [11-performance.instructions.md](./.github/instructions/11-performance.instructions.md)
- Error Handling Pattern: [12-error-handling.instructions.md](./.github/instructions/12-error-handling.instructions.md)
## License

Copyright © 2026 Scott Reinhart. All Rights Reserved.

This project is proprietary software. No permission is granted to use, copy, modify, or distribute this software without the prior written consent of the owner. See the [LICENSE](LICENSE) file for full terms.

---

[⬆ Back to top](#-game-platform)
