# ESLint Quality Gates - Bracketed Testing Levels

**Status**: ✅ Implemented  
**Location**: `scripts/quality-gates.sh`  
**Package Scripts**: `pnpm lint:gate:quick|standard|full|strict`  
**Date Created**: 2026-03-19  

---

## Overview

The quality gates system organizes ESLint validation into four **bracketed tiers**, each designed for different stages of development and deployment. This prevents developers from running excessive checks while still maintaining comprehensive validation at critical points.

### Design Philosophy

- **Quick (5s)**: Fast feedback on critical issues (security, architecture)
- **Standard (15s)**: Normal checks before pushing (+ TypeScript, React)
- **Full (30s)**: Comprehensive validation for CI/CD pipelines
- **Strict (60s)**: Zero-tolerance release validation (includes scope checks)

---

## The Four Quality Gates

### 🚀 GATE 1: QUICK (Pre-commit) — ~5 seconds

**Purpose**: Fast feedback for immediate development  
**When**: Before committing code locally  
**Coverage**: 2 critical rule categories  
**Rules**:
- 🔐 Security violations
- 🏗️ Architectural boundaries

**Command**:
```bash
pnpm lint:gate:quick
bash scripts/quality-gates.sh quick
```

**Typical Use Case**: Code is still in flux, developer wants fast validation

**Expected Output**:
```
═════════════════════════════════════════════
QUALITY GATE 1: QUICK (Pre-commit)
═════════════════════════════════════════════

🚀 Running critical checks only (max 1 file per type)...

🔐 Security check...
✅ No violations found

🏗️  Boundaries check...
✅ No violations found

✅ Quick gate passed
Time: ~5 seconds | Files: Critical only
```

---

### 📋 GATE 2: STANDARD (Pre-push) — ~15 seconds

**Purpose**: Normal validation before pushing to remote  
**When**: Before `git push` to GitHub  
**Coverage**: 4 important rule categories  
**Rules**:
- 🔐 Security (`lint:type:security`)
- 🏗️ Boundaries (`lint:type:boundaries`)
- 📘 TypeScript (`lint:type:typescript`)
- ⚛️ React (`lint:type:react`)

**Command**:
```bash
pnpm lint:gate:standard
bash scripts/quality-gates.sh standard
```

**Typical Use Case**: Code is ready for review, prevent common issues from reaching remote

**Expected Output**:
```
═════════════════════════════════════════════
QUALITY GATE 2: STANDARD (Pre-push)
═════════════════════════════════════════════

📋 Running standard checks (critical + common rules)...

🔐 Security... ✅
🏗️  Boundaries... ✅
📘 TypeScript... ✅
⚛️  React... ✅

✅ Standard gate passed
Time: ~15 seconds | Files: Core rules
```

---

### 🔍 GATE 3: FULL (CI/CD) — ~30 seconds

**Purpose**: Comprehensive validation for deployment CI/CD  
**When**: During CI/CD pipeline before merge to main  
**Coverage**: All 7 rule categories  
**Rules**:
- 🔐 Security
- 🏗️ Boundaries
- 📘 TypeScript
- ⚛️ React
- 🪝 Hooks
- ♿ Accessibility
- 🔧 Core

**Command**:
```bash
pnpm lint:gate:full
bash scripts/quality-gates.sh full
```

**Typical Use Case**: Automated CI/CD validation, no scope checks yet

**Expected Output**:
```
═════════════════════════════════════════════
QUALITY GATE 3: FULL (CI/CD)
═════════════════════════════════════════════

🔍 Running all standard checks...

🔐 Security... ✅
🏗️  Boundaries... ✅
📘 TypeScript... ✅
⚛️  React... ✅
🪝 Hooks... ✅
♿ Accessibility... ✅
🔧 Core... ✅

✅ Full gate passed
Time: ~30 seconds | Files: All rule types
```

---

### 🎯 GATE 4: STRICT (Release) — ~60 seconds

**Purpose**: Zero-tolerance validation for release builds  
**When**: Before deploying to production  
**Coverage**: All 7 rule categories + all 7 scope layers  
**Rules**:

*All 7 Type Checks*:
- 🔐 Security
- 🏗️ Boundaries
- 📘 TypeScript
- ⚛️ React
- 🪝 Hooks
- ♿ Accessibility
- 🔧 Core

*All 7 Scope Checks*:
- App layer
- Domain layer
- UI layer
- Infrastructure
- Electron
- WASM
- Workers

**Command**:
```bash
pnpm lint:gate:strict
bash scripts/quality-gates.sh strict
```

**Typical Use Case**: Release to production, zero tolerance for violations

**Expected Output**:
```
═════════════════════════════════════════════
QUALITY GATE 4: STRICT (Release)
═════════════════════════════════════════════

🎯 Running all checks with zero tolerance...

[All 7 Type Checks]... ✅

🔄 Scope validation...
  • App layer... ✅
  • Domain layer... ✅
  • UI layer... ✅
  • Infrastructure... ✅
  • Electron... ✅
  • WASM... ✅
  • Workers... ✅

✅ Strict gate passed - Ready for release
Time: ~60 seconds | Coverage: 100%
```

---

## Suggested Workflow Integration

### Local Development

```bash
# Initial development
pnpm lint:gate:quick          # Fast feedback
git add .
git commit -m "Feature: ..."

# Before pushing
pnpm lint:gate:standard       # Normal checks
git push
```

### CI/CD Pipeline

```yaml
# .github/workflows/validate.yml
on: [pull_request, push]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 24.14.1
          cache: pnpm
      - run: pnpm install
      
      # Pre-PR validation
      - name: Quality Gate - Full
        run: pnpm lint:gate:full
```

### Release Process

```bash
# Release checklist
pnpm validate                 # All tests pass
pnpm lint:gate:full           # CI/CD level validation
pnpm lint:gate:strict         # Release level validation ← REQUIRED
git tag v1.2.3
npm publish
```

---

## Architecture

### Quick Gate (5s)
```
QUICK GATE
  ├── Security (high priority)
  └── Boundaries (architectural integrity)
```

### Standard Gate (15s)
```
STANDARD GATE
  ├── Quick Gate ┐
  │              ├── All pass = OK to push
  ├── TypeScript ┤
  └── React      ┘
```

### Full Gate (30s)
```
FULL GATE (CI/CD)
  ├── Standard Gate
  ├── Hooks
  ├── Accessibility
  └── Core
  └── All pass = OK to merge
```

### Strict Gate (60s)
```
STRICT GATE (Release)
  ├── Full Gate
  ├── App Scope
  ├── Domain Scope
  ├── UI Scope
  ├── Infrastructure Scope
  ├── Electron Scope
  ├── WASM Scope
  └── Workers Scope
  └── All pass = OK to deploy
```

---

## Command Reference

| Command | Duration | Use Case | Examples |
|---------|----------|----------|----------|
| `pnpm lint:gate:quick` | ~5s | Pre-commit | Before `git commit` |
| `pnpm lint:gate:standard` | ~15s | Pre-push | Before `git push` |
| `pnpm lint:gate:full` | ~30s | CI/CD | Pull request validation |
| `pnpm lint:gate:strict` | ~60s | Release | Before production deploy |
| `bash scripts/quality-gates.sh quick` | ~5s | Direct bash execution | Automation, custom flows |
| `bash scripts/quality-gates.sh standard` | ~15s | Direct bash execution | Automation, custom flows |
| `bash scripts/quality-gates.sh full` | ~30s | Direct bash execution | Automation, custom flows |
| `bash scripts/quality-gates.sh strict` | ~60s | Direct bash execution | Automation, custom flows |

---

## Underlying Rules

Each gate uses existing ESLint rule sets. Here's the mapping:

### Type Checks (Rule Categories)

| Type | Script | Purpose |
|------|--------|---------|
| `a11y` | `lint:type:a11y` | Accessibility violations |
| `security` | `lint:type:security` | Security vulnerabilities |
| `hooks` | `lint:type:hooks` | React hooks rules |
| `react` | `lint:type:react` | React component patterns |
| `boundaries` | `lint:type:boundaries` | Architecture layer violations |
| `typescript` | `lint:type:typescript` | TypeScript type errors |
| `core` | `lint:type:core` | General linting rules |

### Scope Checks (Architectural Layers)

| Scope | Script | Path | Purpose |
|-------|--------|------|---------|
| `app` | `lint:scope:app` | `src/app` | React integration layer |
| `domain` | `lint:scope:domain` | `src/domain` | Pure business logic |
| `ui` | `lint:scope:ui` | `src/ui` | Components (atoms, molecules, organisms) |
| `infrastructure` | `lint:scope:infrastructure` | `src/infrastructure` | Build, deployment, tooling |
| `electron` | `lint:scope:electron` | `src/electron` | Electron main process |
| `wasm` | `lint:scope:wasm` | `src/wasm` | WebAssembly integration |
| `workers` | `lint:scope:workers` | `src/workers` | Web Workers |

---

## Implementation Details

### Script Location

```
scripts/quality-gates.sh          Main quality gate implementation
├── quality_gate_quick()          GATE 1 function
├── quality_gate_standard()       GATE 2 function
├── quality_gate_full()           GATE 3 function
└── quality_gate_strict()         GATE 4 function
```

### Invocation

```bash
# Via pnpm (recommended)
pnpm lint:gate:quick             # Calls: bash scripts/quality-gates.sh quick

# Via bash (direct)
bash scripts/quality-gates.sh quick

# Via zsh/sh (alternative)
sh scripts/quality-gates.sh quick
```

### Exit Codes

- `0` = All checks passed, safe to proceed
- `1` = One or more checks failed, review errors before proceeding

### Error Handling

- **Fast fail**: Script exits immediately on first failure
- **Error output**: ESLint violations printed to stdout
- **Status colors**: Red (❌ failed), Green (✅ passed), Cyan (headers)

---

## Troubleshooting

### "Command not found: pnpm lint:gate:quick"

**Solution**: Verify `scripts/quality-gates.sh` is executable and package.json was saved:
```bash
chmod +x scripts/quality-gates.sh
pnpm install  # Refresh scripts
pnpm lint:gate:quick
```

### "Some checks take too long"

**Analysis**:

- **Quick taking >10s?** Might be checking too many files
  - Solution: Reduce scope in `quality_gate_quick()`
  
- **Standard taking >30s?** Rule configuration might be expensive
  - Solution: Check ESLint config for expensive plugins
  
- **Full taking >60s?** Codebase is large
  - Solution: Consider splitting into per-app gates

### "Getting false positives in security check"

**Solution**: Review eslint rule configuration:
```bash
# See which rules are flagged
pnpm lint:type:security
```

### Integration with pre-commit hooks

Add to `.husky/pre-commit`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint:gate:quick || exit 1
pnpm lint:fix
git add .
```

---

## Best Practices

1. **Local Development**: Use `quick` gate for fast feedback
2. **Before Push**: Use `standard` gate to catch common issues
3. **CI/CD Pipeline**: Use `full` gate for automated validation
4. **Release**: Require `strict` gate to pass
5. **Custom Flows**: Use bash script directly for specialized needs

---

## Future Enhancements

### Potential Improvements

- [ ] Parallel execution (run multiple gates concurrently)
- [ ] JSON output mode for CI/CD integration
- [ ] Custom rule sets per gate level
- [ ] Performance profiling per gate
- [ ] HTML report generation
- [ ] GitLab CI integration templates

---

## Related Documentation

- [ESLint Configuration](../eslint.config.js)
- [Lint Scripts Reference](./DEVELOPER-GUIDE.md#lint-scripts)
- [Architecture Layer Boundaries](./DEVELOPER-GUIDE.md#architecture)
- [AGENTS.md § 22 - Build & Dependency Governance](../AGENTS.md#-22-project-build--dependency-governance)

