# Node.js Best Practices (Frontend Adaptation)

> **Authority**: `AGENTS.md` § 0 (Non-Negotiable Rules) and § 29 (Node.js Best Practices)
> **Source**: https://github.com/goldbergyoni/nodebestpractices (102+ items, adapted for React/TypeScript)
> **Scope**: Async patterns, error handling, naming conventions, testing practices, code quality
> **BASELINE**: Before making changes, read `AGENTS.md` § 0. Quality gates mandatory. No fake completion.

---

## Overview

This instruction file synthesizes Node.js best practices for a frontend React/Vite/TypeScript context. While Node.js best practices originated from backend server development, many core principles apply directly to modern frontend applications, especially around async/await, testing, error handling, and code quality.

**Highly Relevant Sections**:

- Code style & naming conventions
- Async/await discipline
- Error handling & promise safety
- Testing practices
- Configuration management
- Code quality gates

---

## 1. Async/Await Discipline (Error Handling Patterns)

### Rule: Always Handle Promise Rejections

In React hooks and event handlers, always wrap async operations with proper error handling.

#### ✅ GOOD: Async with Try/Catch in Hook

```typescript
// src/app/useGameEngine.ts
import { useState, useCallback } from 'react'

export const useGameEngine = () => {
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const initializeEngine = useCallback(async (boardSize: number) => {
    setLoading(true)
    setError(null)

    try {
      // Async operation with explicit error handling
      const engine = await loadWasmEngine()
      if (!engine) {
        throw new Error('WASM engine failed to load')
      }

      await engine.initialize(boardSize)
      return engine
    } catch (err) {
      // Classify and handle error
      const error = err instanceof Error ? err : new Error('Unknown error')
      console.error('Engine initialization failed:', error.message)
      setError(error)
      // Return fallback or rethrow
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { initializeEngine, error, loading }
}
```

#### ❌ BAD: Unhandled Promise Rejection

```typescript
// Never do this:
useEffect(() => {
  loadWasmEngine() // ❌ No error handling
    .then((engine) => engine.initialize())
    .catch((err) => {
      // Swallowing error (no logging, no state update)
      console.error(err)
      // Caller doesn't know this failed!
    })
}, [])
```

#### ❌ BAD: Fire-and-Forget Promise

```typescript
// ❌ FORBIDDEN: Unhandled rejection
const handleGameStart = async () => {
  initializeEngine() // No await, no error handling!
  startGame() // Might run before engine is ready
}
```

#### ✅ GOOD: Always Await and Handle

```typescript
// ✅ CORRECT: Explicit async/await with error handling
const handleGameStart = async () => {
  try {
    await initializeEngine()
    startGame()
  } catch (err) {
    showErrorUI('Failed to start game')
    crashLogger.error('Game start failed', err)
  }
}
```

### Rule: Explicit Error Classification

Distinguish between error types and handle appropriately:

```typescript
// src/app/errorClassifier.ts
export enum ErrorType {
  USER_INPUT = 'user_input', // Form validation, invalid move
  RECOVERABLE = 'recoverable', // Network timeout, WASM load failure
  FATAL = 'fatal', // Data corruption, security breach
}

export const classifyError = (error: unknown): ErrorType => {
  if (error instanceof ValidationError) {
    return ErrorType.USER_INPUT
  }
  if (error instanceof NetworkError || error instanceof WasmError) {
    return ErrorType.RECOVERABLE
  }
  if (error instanceof DataIntegrityError) {
    return ErrorType.FATAL
  }
  return ErrorType.RECOVERABLE // Default to recoverable
}

// In React component:
export const GameBoard: React.FC = () => {
  const handleMove = async (move: Move) => {
    try {
      await engine.makeMove(move)
    } catch (err) {
      const errorType = classifyError(err)

      if (errorType === ErrorType.USER_INPUT) {
        setValidationError(err.message) // Show inline feedback
      } else if (errorType === ErrorType.RECOVERABLE) {
        showToast('Connection lost. Retrying...') // Offer retry
        await retryOperation()
      } else {
        // FATAL: Clear state and restart
        localStorage.removeItem('gameState')
        window.location.reload()
      }
    }
  }
}
```

---

## 2. Promise Safety Patterns

### Rule: Avoid Promise.all() on Mixed Critical/Non-Critical Operations

When promises have different importance, handle failures selectively.

#### ❌ BAD: All-or-Nothing Promise.all()

```typescript
// If any promise rejects, entire operation fails
const loadGame = async () => {
  try {
    const [gameState, stats, preferences] = await Promise.all([
      loadGameState(), // CRITICAL
      loadPlayerStats(), // Nice to have
      loadPreferences(), // Nice to have
    ])
    // If loadPlayerStats fails, entire loadGame fails
  } catch (err) {
    // Game state lost even though that load might have succeeded
  }
}
```

#### ✅ GOOD: Promise.allSettled() for Mixed Importance

```typescript
// Handle successes and failures independently
const loadGame = async () => {
  const results = await Promise.allSettled([
    loadGameState(), // CRITICAL
    loadStats(), // Optional
    loadPreferences(), // Optional
  ])

  const [gameStateResult, statsResult, prefsResult] = results

  // Handle each independently
  if (gameStateResult.status === 'rejected') {
    throw new Error('Critical: Game state failed to load')
  }

  const stats = statsResult.status === 'fulfilled' ? statsResult.value : null
  const prefs = prefsResult.status === 'fulfilled' ? prefsResult.value : null

  return { gameState: gameStateResult.value, stats, prefs }
}
```

### Rule: Avoid Deeply Nested Promises

Use async/await for clarity instead of promise chains.

#### ❌ BAD: Promise Chain Hell

```typescript
loadBoard()
  .then((board) => {
    return validateBoard(board).then((valid) => {
      if (!valid) throw new Error('Invalid board')
      return computeAiMove(board).then((move) => ({ board, move }))
    })
  })
  .then(({ board, move }) => applyMove(board, move))
  .catch((err) => showError(err.message))
```

#### ✅ GOOD: Async/Await is Clearer

```typescript
try {
  const board = await loadBoard()
  const valid = await validateBoard(board)
  if (!valid) throw new Error('Invalid board')
  const move = await computeAiMove(board)
  await applyMove(board, move)
} catch (err) {
  showError(err.message)
}
```

---

## 3. Naming Conventions (Code Clarity)

### Rule: Name Async Functions with Verb Prefixes

Clearly indicate functions perform async operations.

| Prefix  | Meaning              | Example                     |
| ------- | -------------------- | --------------------------- |
| `load`  | Fetch/initialize     | `loadGameState`, `loadWasm` |
| `fetch` | Retrieve data        | `fetchLeaderboard`          |
| `save`  | Persist data         | `saveGameState`             |
| `sync`  | Bidirectional update | `syncProgress`              |
| `wait`  | Delay/timeout        | `waitForReady`              |
| `init`  | Setup/prepare        | `initializeEngine`          |

#### ✅ GOOD: Clear Async Intent

```typescript
// Naming clearly indicates async behavior
export const loadGameState = async (): Promise<GameState> => {
  const data = await storageService.get('gameState')
  return parseGameState(data)
}

export const saveGameState = async (state: GameState): Promise<void> => {
  await storageService.set('gameState', JSON.stringify(state))
}

export const waitForEngineReady = async (): Promise<Engine> => {
  // Spin until engine is ready or timeout
}
```

#### ❌ BAD: Ambiguous Naming

```typescript
// Does this do something async? Unclear.
export const gameState = (): GameState => {
  // Actually async! Name doesn't indicate it.
  return fetch('/api/game').then((r) => r.json())
}
```

### Rule: Name Boolean Functions with "is"/"has" Prefix

```typescript
// Good naming for predicates
export const isValidMove = (board: Board, move: Move): boolean => {...}
export const hasWon = (board: Board, player: Player): boolean => {...}
export const isBoardFull = (board: Board): boolean => {...}
export const canUndo = (history: Move[]): boolean => {...}
```

### Rule: Name Callbacks with "on"/"handle" Prefix

```typescript
// React event handlers and callbacks
export interface ButtonProps {
  onClick?: (ev: React.MouseEvent) => void // Event handler
  onMove?: (move: Move) => void // Callback
  onError?: (err: Error) => void // Error handler
  onLoadComplete?: (engine: Engine) => void // Lifecycle callback
}

// Implementation
const handleMoveClick = (move: Move) => {
  // Handle the move
}

const handleGameEnd = async (winner: Player) => {
  // Handle game ending
}
```

---

## 4. Code Style Standards

### Rule: Use Strict TypeScript

All TypeScript code must use strict mode:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### Rule: Meaningful Variable Names

- Avoid single-letter variables except loop counters
- Avoid abbreviations when full names are clearer

```typescript
// ❌ BAD
const b = computeBoard()
const p = players[0]
const cfg = loadConfig()

// ✅ GOOD
const board = computeBoard()
const currentPlayer = players[0]
const configuration = loadConfig()

// ✅ ACCEPTABLE: Loop counters only
for (let i = 0; i < board.length; i++) {
  // Use i, j, k only here
}
```

### Rule: Consistent Code Style (ESLint + Prettier)

- Always run `pnpm check` before committing
- Configuration enforced in `eslint.config.js` and `.prettierrc`
- Never disable ESLint rules without approval
- Breaking formatting is caught in pre-commit hook

```bash
# Before commit:
pnpm fix          # Auto-fix lint and format
pnpm check        # Verify all checks pass
pnpm validate     # Full gate: check + build
```

---

## 5. Testing Best Practices

### Rule: Test Structure (Arrange-Act-Assert)

All tests follow the AAA pattern:

```typescript
// src/domain/rules.spec.ts
import { describe, it, expect } from 'vitest'
import { isValidMove, makeMove } from '@/domain/rules'

describe('Game Rules', () => {
  it('should reject move to occupied cell', () => {
    // ARRANGE: Set up test data
    const board = [
      ['O', 'X', ''],
      ['', '', ''],
      ['', '', ''],
    ]

    // ACT: Execute function under test
    const valid = isValidMove(board, { row: 0, col: 0 })

    // ASSERT: Verify expectations
    expect(valid).toBe(false)
  })
})
```

### Rule: Meaningful Test Names

Test names describe the behavior being tested:

```typescript
// ✅ GOOD: Describes the scenario and expected outcome
it('should reject move when cell is already occupied', () => {})
it('should return true when player has won', () => {})
it('should throw error when board size is invalid', () => {})

// ❌ BAD: Vague or redundant
it('should work', () => {})
it('test move', () => {})
it('error case', () => {})
```

### Rule: Test Naming File Convention

All test files must follow the naming convention from `AGENTS.md` § 28:

```
<featureName>.<type>.test.ts(x)    // Vitest
<featureName>.<type>.spec.ts       // Playwright
```

Valid types: `unit`, `integration`, `component`, `api`, `e2e`, `a11y`, `visual`, `perf`

Examples:

- ✅ `rules.unit.test.ts` — Unit test for rules
- ✅ `button.component.test.tsx` — React component test
- ✅ `game.e2e.spec.ts` — End-to-end test
- ❌ `test.ts` — Missing feature name
- ❌ `unit.rules.test.ts` — Wrong order

### Rule: Test Coverage for Critical Paths

Minimum coverage expectations:

| Code                     | Min Coverage | Why                     |
| ------------------------ | ------------ | ----------------------- |
| Domain logic (rules, AI) | 80%          | Business-critical       |
| App services             | 70%          | Integration points      |
| UI atoms                 | 60%          | Mostly presentational   |
| UI organisms             | 40%          | Complex UI interactions |

Run `pnpm test:coverage` to verify coverage targets.

---

## 6. Configuration & Environment Discipline

### Rule: Environment Variables Over Hardcoded Config

Never hardcode configuration values:

#### ❌ BAD: Hardcoded Values

```typescript
const API_URL = 'https://prod.example.com/api'
const MAX_RETRIES = 3
const TIMEOUT_MS = 5000
```

#### ✅ GOOD: Environment-Driven Config

```typescript
// src/domain/constants.ts
export const CONFIG = {
  API_URL: process.env.VITE_API_URL || 'http://localhost:3000/api',
  MAX_RETRIES: parseInt(process.env.VITE_MAX_RETRIES || '3', 10),
  TIMEOUT_MS: parseInt(process.env.VITE_TIMEOUT_MS || '5000', 10),
} as const
```

```bash
# .env.development
VITE_API_URL=http://localhost:3000/api
VITE_MAX_RETRIES=3
VITE_TIMEOUT_MS=5000

# .env.production
VITE_API_URL=https://prod.example.com/api
VITE_MAX_RETRIES=5
VITE_TIMEOUT_MS=10000
```

### Rule: Never Commit Secrets

- `.env` files are `.gitignore`d
- Default values for non-sensitive config only
- Secrets stored in CI/CD secrets manager, not code

```typescript
// ✅ GOOD: Safe default, replaceable at runtime
const token = process.env.VITE_AUTH_TOKEN || '' // Default empty is safe

// ❌ BAD: Sensitive value in code
const token = 'sk_live_abc123xyz123'
```

### Rule: Validate Configuration at Startup

```typescript
// src/app/configValidation.ts
export const validateConfig = (): void => {
  const requiredEnvVars = [
    'VITE_API_URL',
    'VITE_ENV',
  ]

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(
        `Missing required environment variable: ${envVar}`
      )
    }
  }

  // Validate format
  try {
    new URL(process.env.VITE_API_URL!)
  } catch {
    throw new Error(
      `Invalid VITE_API_URL: ${process.env.VITE_API_URL}`
    )
  }
}

// In index.tsx:
validateConfig()
ReactDOM.render(<App />, document.getElementById('root'))
```

---

## 7. Error Handling Summary (Per AGENTS.md § 26)

### Classification Level

1. **User Error** (form validation) → Show feedback on UI
2. **Recoverable Error** (network timeout) → Retry with exponential backoff
3. **Fatal Error** (data corruption) → Clear state and restart

See `AGENTS.md` § 26 and `.github/instructions/12-error-handling.instructions.md` for detailed patterns.

### Key Principles

- ✅ Always classify errors explicitly
- ✅ Log errors with context (not just message)
- ✅ Provide recovery paths where possible
- ✅ Never silently swallow errors
- ✅ Test error paths as thoroughly as happy paths

---

## 8. Code Quality Gates (Mandatory)

### Before Every Commit

```bash
pnpm fix          # Auto-fix lint + format
pnpm check        # Verify lint, format, types
pnpm test         # Run all unit/integration tests
pnpm validate     # Final gate: check + build
```

### Pre-Commit Hook Automation

Husky + lint-staged automatically runs `pnpm fix` on staged files before commit.

### CI/CD Gates

All checks must pass in CI before merging:

- ✅ `pnpm check` (lint, format, typecheck)
- ✅ `pnpm test` (all tests pass)
- ✅ `pnpm test:names` (valid test naming)
- ✅ `pnpm validate` (full gate)

See `AGENTS.md` § 0.6 and § 20 for full quality gate governance.

---

## 9. Quick Reference Checklist

Before submitting code:

- [ ] All async operations wrapped in try/catch
- [ ] Promise rejections handled (no unhandled rejections)
- [ ] Error types classified (user/recoverable/fatal)
- [ ] Meaningful variable names (no single-letter except loops)
- [ ] Async functions named with verb prefix (load, save, init, etc.)
- [ ] Boolean functions named with "is"/"has" prefix
- [ ] Test files follow naming convention (`<feature>.<type>.test.ts`)
- [ ] ESLint passes (`pnpm lint`)
- [ ] Prettier passes (`pnpm format:check`)
- [ ] TypeScript passes (`pnpm typecheck`)
- [ ] All tests pass (`pnpm test`)
- [ ] Full validation passes (`pnpm validate`)
- [ ] No hardcoded config (use environment variables)
- [ ] Environment-sensitive values validated at startup
- [ ] Error messages are clear and actionable

---

## Cross-References

**Related Governance**:

- `AGENTS.md` § 0 — Non-Negotiable AI Operating Rules
- `AGENTS.md` § 0.6 — Quality Gates Mandatory
- `AGENTS.md` § 26 — Error Handling & Recovery Governance
- `AGENTS.md` § 28 — Testing Governance & Standards
- `AGENTS.md` § 29 — Node.js Best Practices (Frontend Adaptation) [NEW]
- `.github/instructions/02-frontend.instructions.md` — Frontend stack & architecture
- `.github/instructions/12-error-handling.instructions.md` — Error patterns
- `.github/instructions/17-testing.instructions.md` — Testing standards
- `.github/copilot-instructions.md` — AI tooling policy

**External References**:

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices) — Source material
- [Async/Await in JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises) — Promise fundamentals
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about/) — Component testing
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) — Type safety
