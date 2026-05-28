# Workspace-Aware Scripts Documentation

**Updated**: May 2, 2026  
**Purpose**: Document workspace-wide and app-specific script patterns  
**Philosophy**: Preservation-first design with **lights-out as primary development target** and **workspace-aware operations via `:ws` suffix**

---

## 📋 Script Pattern Overview

The monorepo supports **three script patterns** with clear execution scopes:

### 1️⃣ **App-Focused Scripts** (default root scripts)
**These target `apps/lights-out/` for backward compatibility and quick development**

- Syntax: `pnpm start`, `pnpm build`, `pnpm lint`, `pnpm format`, `pnpm typecheck`, etc.
- Purpose: Fast iteration on lights-out game (primary development target)
- Execution: Limited to `apps/lights-out/src/` only
- Use when: Developing lights-out specifically

**⚠️ IMPORTANT**: Root scripts like `pnpm lint` do NOT scan all 60+ game apps—only lights-out. For workspace-wide operations, use the `:ws` suffix.

### 2️⃣ **Workspace-Aware Scripts** (the `:ws` suffix pattern)
**These run across ALL apps in the monorepo**

- Syntax: `pnpm start:ws`, `pnpm build:ws`, `pnpm lint:ws`, `pnpm typecheck:ws`, etc.
- Purpose: Platform-wide operations and validation
- Execution: All apps in `apps/*/` directory in parallel or sequential mode
- Use when: Validating entire platform, running quality gates, preparing releases

**✅ COMPLETE LIST**: `lint:ws`, `lint:fix:ws`, `format:ws`, `format:check:ws`, `typecheck:ws`, `check:ws`, `fix:ws`, `validate:ws`, `clean:ws`, `test:ws`, `test:watch:ws`, `build:ws`, `start:ws`, `dev:ws`, `preview:ws`

### 3️⃣ **Per-App Scripts** (explicit app targeting)
**Target specific apps via per-app scripts**

- Syntax: `pnpm monchola:web:build`, `pnpm tictactoe:web:lint`, `pnpm <app>:web:*`, etc.
- Purpose: Focused app-by-app development
- Execution: Single app only
- Use when: Working on specific game app (bingo, checkers, nim, etc.)

---

## 🚨 Common Mistakes to Avoid

| ❌ If you do this | ✅ Do this instead | Reason |
|---|---|---|
| `pnpm lint` (expects ALL apps scanned) | `pnpm lint:ws` | Root `lint` only targets lights-out |
| `pnpm validate` (full platform) | `pnpm validate:ws` | Root `validate` is lights-out-only |
| `pnpm build` (all apps) | `pnpm build:ws` | Root `build` uses build-apps-sequential |
| `pnpm start` (run all servers) | `pnpm start:ws` | Root `start` launches lights-out only |

---

## Quick Reference

### Development

| Task | Lights-Out Only | All Apps | Per-App |
|------|-----------------|----------|---------|
| **Dev server** | `pnpm dev` | `pnpm dev:ws` | `pnpm <app>:web:dev` |
| **Build** | `pnpm build` | `pnpm build:ws` | `pnpm <app>:web:build` |
| **Lint** | `pnpm lint` | `pnpm lint:ws` | `pnpm <app>:web:lint` |
| **Format** | `pnpm format` | `pnpm format:ws` | `pnpm <app>:web:format` |
| **Type check** | `pnpm typecheck` | `pnpm typecheck:ws` | `pnpm <app>:web:typecheck` |

### Quality Assurance

| Task | Lights-Out Only | All Apps |
|------|-----------------|----------|
| **Auto-fix** | `pnpm fix` | `pnpm fix:ws` |
| **Check all** | `pnpm check` | `pnpm check:ws` |
| **Full validation** | `pnpm validate` | `pnpm validate:ws` |

### Testing

| Task | Scope | Command |
|------|-------|----------|
| **Unit tests (single app)** | lights-out only | `pnpm test:unit` |
| **All test types (single app)** | lights-out only | `pnpm test` |
| **Tests in workspace** | All apps | `pnpm test:ws` |
| **Watch mode (single app)** | lights-out only | `pnpm test:watch` |
| **Watch mode (all apps)** | All apps | `pnpm test:watch:ws` |

### Cleanup

| Task | Lights-Out Only | All Apps |
|------|-----------------|----------|
| **Clean build** | `pnpm clean` | `pnpm clean:ws` |

---

## Workspace-Aware Scripts (Complete List)

### Development & Build

**`pnpm start:ws`**
- Starts dev servers for ALL apps in parallel
- Use when: Testing platform-wide startup behavior
- Execution: `pnpm -r --parallel start`

**`pnpm dev:ws`**
- Alias for `pnpm start:ws`
- Starts dev servers for ALL apps in parallel

**`pnpm build:ws`**
- Builds ALL apps sequentially (ensures proper dependency ordering)
- Use when: Preparing cross-app release builds
- Execution: `pnpm -r --sequential build`

**`pnpm preview:ws`**
- Previews production builds for ALL apps
- Use when: Testing production-like builds across platform
- Execution: `pnpm -r --sequential preview`

### Code Quality

**`pnpm lint:ws`**
- Lints ALL app code
- Use when: Platform-wide quality check
- Execution: `pnpm -r lint`

**`pnpm lint:fix:ws`**
- Auto-fixes linting issues across ALL apps
- Use when: Batch fix linting violations
- Execution: `pnpm -r lint:fix`

**`pnpm format:ws`**
- Formats code in ALL apps sequentially by invoking each app's bracketed format script
- Use when: Batch format all code and confirm each app individually
- Execution: `node scripts/validate-workspace-segmented.mjs --script=format:segment --scope=apps --timeoutMs=600000`

**`pnpm format:check:ws`**
- Checks code formatting for ALL apps sequentially by invoking each app's bracketed format check script
- Use when: Verify formatting compliance before commit
- Execution: `node scripts/validate-workspace-segmented.mjs --script=format:check:segment --scope=apps --timeoutMs=600000`

**`pnpm typecheck:ws`**
- Type-checks ALL apps using TypeScript
- Use when: Verify type safety across platform
- Execution: `pnpm -r typecheck`

### Combined Quality Gates

**`pnpm check:ws`**
- Runs lint, format check, and typecheck for ALL apps
- Use when: Full quality verification before push
- Command: `pnpm lint:ws && pnpm format:check:ws && pnpm typecheck:ws`

**`pnpm fix:ws`**
- Auto-fixes all linting and formatting for ALL apps
- Use when: Batch fix issues before commit
- Command: `pnpm lint:fix:ws && pnpm format:ws`

**`pnpm validate:ws`**
- Full validation: test names, quality checks, and builds for ALL apps
- Use when: Pre-release verification of entire platform
- Command: `pnpm test:names && pnpm check:ws && pnpm build:ws`

### Cleanup

**`pnpm clean:ws`**
- Cleans build artifacts for ALL apps
- Use when: Reset platform-wide builds
- Execution: `pnpm -r clean`

---

## Execution Modes Explained

### `pnpm -r` (All apps, sequential)
- Runs command across all apps in `pnpm-workspace.yaml`
- Sequential execution (one at a time)
- Good for: Quality checks, builds, structured operations

### `pnpm -r --parallel`
- Runs command across all apps simultaneously
- Faster but less predictable output
- Good for: Dev servers, preview servers

### `pnpm -r --sequential`
- Explicit sequential execution
- Good for: Builds, operations with dependencies

### Bracketed workspace validation
- Use `scripts/validate-workspace-segmented.mjs` when a workspace script should run app-by-app with explicit PASS/FAIL output
- Best for: format, format:check, lint, typecheck, and other app-scoped quality gates
- App-level segmented scripts now live as `format:segment` and `format:check:segment`

---

## Usage Patterns

### Pattern 1: Platform Dev Session (develop across multiple games)
```bash
# Terminal 1: Start all game dev servers
pnpm dev:ws

# Terminal 2: Watch for issues
pnpm lint:ws --watch  # (if supported)

# Before commit: Full quality check
pnpm check:ws
```

### Pattern 2: Pre-Release Quality Check
```bash
# Verify entire platform is ready
pnpm validate:ws

# If issues: Auto-fix them
pnpm fix:ws

# Re-validate
pnpm validate:ws
```

### Pattern 3: Focused Game Development (e.g., Sudoku)
```bash
# Develop single game with per-app scripts
pnpm sudoku:web:dev

# Quality check for that game
pnpm sudoku:web:check

# Build that game
pnpm sudoku:web:build
```

### Pattern 4: Batch Updates Across Platform
```bash
# Update dependencies across ALL apps
pnpm -r update lodash@latest

# Quality check all apps
pnpm validate:ws

# If all green, commit
git add .
git commit -m "feat(deps): update lodash across all apps"
```

---

## Backward Compatibility

⚠️ **Important**: Original lights-out-focused scripts remain unchanged:
- `pnpm start` → Still targets `apps/lights-out/` only
- `pnpm build` → Still targets `apps/lights-out/` only
- `pnpm lint` → Still targets `apps/lights-out/` only

This ensures existing workflows and documentation don't break.

---

## Migration Guide

### For Projects Using Lights-Out Scripts

If you're currently using root-level scripts focused on lights-out:

```bash
# OLD: Single app
pnpm build
pnpm lint
pnpm check

# NEW: Include all apps
pnpm build:ws
pnpm lint:ws
pnpm check:ws
```

### For CI/CD Integration

Update CI pipelines to use workspace scripts:

```yaml
# Before: Single app validation
- run: pnpm check && pnpm build

# After: Platform-wide validation
- run: pnpm check:ws && pnpm build:ws
```

---

## Troubleshooting

### Issue: Script fails across all apps
**Solution**: Run individual app script to diagnose
```bash
pnpm <app>:web:lint
```

### Issue: Parallel execution causes issues
**Solution**: Use sequential instead
```bash
# Replace this (parallel):
pnpm -r --parallel command

# With this (sequential):
pnpm -r --sequential command
```

### Issue: Want to add workspace scripts for custom commands
**Steps**:
1. Edit `package.json`
2. Add script with `:ws` suffix
3. Use `pnpm -r` pattern:
   ```json
   "my:custom:ws": "pnpm -r my:custom"
   ```

---

## Scripts Reference by App

Per-app script families. Replace `<app>` with actual app name (monchola, tictactoe, mancala, etc.):

| Script | Purpose |
|--------|---------|
| `pnpm <app>:web:dev` | Dev server for web |
| `pnpm <app>:web:build` | Build for web |
| `pnpm <app>:web:lint` | Lint code |
| `pnpm <app>:web:format` | Format code |
| `pnpm <app>:web:test` | Run tests |
| `pnpm <app>:web:check` | Quality check |
| `pnpm <app>:web:validate` | Full validation |
| `pnpm <app>:android:build` | Build for Android (Capacitor) |
| `pnpm <app>:ios:build` | Build for iOS (Capacitor) |
| `pnpm <app>:linux:build` | Build for Linux (Electron) |
| `pnpm <app>:windows:build` | Build for Windows (Electron) |
| `pnpm <app>:mac:build` | Build for macOS (Electron) |

---

## Related Documentation

- `pnpm-workspace.yaml` — Monorepo configuration
- `package.json` — Complete script registry
- `AGENTS.md` — Architecture and governance
- Individual app `package.json` — Per-app scripts

