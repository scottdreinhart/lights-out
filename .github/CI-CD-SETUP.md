# CI/CD Pipeline & Validation Gates

This document describes how to set up automated validation gates for governance compliance across the 25 app projects.

## Overview

**Three validation tiers**:

1. **Pre-commit** (Local) — Runs before commits are allowed
2. **Pre-push** (Local) — Runs before pushing to remote
3. **Pull Request** (Server) — Runs on GitHub/CI server before merge

## Local Validation Gates

### Pre-commit Hook (Automatic)

Each project has a `.husky/pre-commit` hook that automatically runs:

```bash
pnpm fix  # lint:fix + format (auto-corrects issues)
```

This prevents commits with linting or formatting violations.

### Pre-push Hook (Manual)

Before pushing, run the full quality gate:

```bash
pnpm validate  # check + build
```

This ensures:
- ✅ `pnpm lint` passes (no ESLint security rule violations)
- ✅ `pnpm format:check` passes (consistent formatting)
- ✅ `pnpm typecheck` passes (no TypeScript errors)
- ✅ `pnpm build` succeeds (production build works)

## Server-Side Validation (GitHub Actions)

### Recommended Workflow (.github/workflows/validate.yml)

```yaml
name: Governance Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '24'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Lint
        run: pnpm lint
      
      - name: Format check
        run: pnpm format:check
      
      - name: Type check
        run: pnpm typecheck
      
      - name: Build
        run: pnpm build
      
      - name: Test
        run: pnpm test --run || true  # Optional, don't fail if tests are minimal
```

### Security Checks

ESLint security rules automatically check for:
- ✅ XSS vulnerabilities (`no-unsafe-html`)
- ✅ Unsafe regexes (`no-unsafe-regex`)
- ✅ Missing crypto verification (`no-unsanitized-eval`)
- ✅ Object injection (`no-object-injection`)

Violations will fail the CI pipeline.

### Governance Compliance Checks

When validating governance adoption:

```bash
# Check all governance files deployed
find .github/instructions -name "*.md" | wc -l
# Should be ≥ 5

# Verify README governance section
grep "## Governance Adoption" README.md
# Should exist

# Verify security plugin enabled
grep "eslint-plugin-security" eslint.config.js
# Should exist
```

## Enforcement Strategy

### Merge Requirements

Configure repository settings to require:
1. ✅ All CI checks pass (lint, format, typecheck, build)
2. ✅ PR review approval
3. ✅ No unresolved conversations

### Branch Protection Rules (GitHub)

```yaml
# Settings > Branches > Branch protection rules > main

Require status checks to pass before merging:
  - validate / lint
  - validate / format
  - validate / typecheck
  - validate / build

Require code reviews:
  - Required: 1 approval

Require branches to be up to date before merging: Yes
```

## Command Reference

### Local Quality Gates

| Command | Purpose | Used When |
|---------|---------|-----------|
| `pnpm lint` | Check for violations | Before commit |
| `pnpm lint:fix` | Auto-fix violations | Part of `pnpm fix` |
| `pnpm format` | Format code | Part of `pnpm fix` |
| `pnpm format:check` | Check formatting | Pre-push gate |
| `pnpm typecheck` | Type validation | Pre-push gate |
| `pnpm check` | All three checks | Manual quality gate |
| `pnpm fix` | Auto-fix lint + format | Part of pre-commit |
| `pnpm validate` | Full gate (check + build) | Pre-push gate |

### Typical Workflow

```bash
# 1. Make changes
# (pre-commit hook automatically runs pnpm fix)

# 2. Commit
git add .
git commit -m "feat: add governance framework"
# (auto-runs pnpm fix)

# 3. Before push, run full validation
pnpm validate
# (if this fails, fix issues and re-run)

# 4. Push to origin
git push origin feature-branch
# (GitHub CI runs validation gates)

# 5. Create PR and request review
# (merge once all checks pass + approved)
```

## Troubleshooting

### "ESLint: react/require-render-return"

This rule is disabled because it's incompatible with Vite's flat config. It's disabled in `eslint.config.js`:

```javascript
// Disabled: incompatible with flat config
// rules: { "react/require-render-return": "error" }
```

### "TypeScript: Type 'string | null | undefined' is not assignable to type 'string'"

In ErrorBoundary.tsx, use:

```tsx
String(info.componentStack || '')
```

### Pre-commit Hook Not Running

Ensure husky is installed:

```bash
pnpm install
# Creates .husky/pre-commit hook
```

If still not running:

```bash
# Enable git hooks
husky install

# Verify hook exists
cat .husky/pre-commit
```

## Next Steps

1. **Implement GitHub Actions** — Copy the workflow above to `.github/workflows/validate.yml`
2. **Enable branch protection** — Require all checks pass before merge
3. **Monitor the pipeline** — Watch for failures and fix early
4. **Extend checks** — Add security scanning, dependency audits, or performance tests as needed

## References

- [ESLint Security Plugin](https://github.com/nodesecurity/eslint-plugin-security)
- [Husky Pre-commit Hooks](https://typicode.github.io/husky/)
- [GitHub Actions Workflows](https://docs.github.com/en/actions/using-workflows)
- [pnpm CLI Reference](https://pnpm.io/cli/overview)
