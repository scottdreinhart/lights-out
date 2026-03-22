# ESLint Security Configuration Enhancement Guide

**Date**: March 16, 2026  
**Objective**: Transform ESLint into a first-line security review layer  
**Status**: 🟢 Ready for Implementation

---

## 📋 Current State Analysis

### Existing Security Coverage ✅
- ✅ `eslint-plugin-security` (basic security checks)
- ✅ TypeScript type safety
- ✅ Accessibility rules (XSS prevention)
- ✅ Architecture boundaries (prevents mixing concerns)

### Critical Gaps Identified ❌
1. No eval/Function constructor detection
2. No implied-eval (string-based timers)
3. No secrets/credentials detection
4. No dangerouslySetInnerHTML detection (React)
5. No prototype pollution protection
6. No regex safety beyond basic unsafe-regex
7. No code smell detection (SonarJS patterns)
8. Insufficient `any` type restriction at trust boundaries
9. No import restriction patterns
10. Missing per-context rule customization (tests, config, etc.)

---

## 📦 Packages to Install

### New Dependencies (3 plugins)

```bash
pnpm add -D \
  eslint-plugin-sonarjs@next \
  eslint-plugin-no-secrets@^1.5.0
```

### Summary
| Package | Version | Why | Risk |
|---------|---------|-----|------|
| `eslint-plugin-sonarjs` | Latest | Code smells + SonarQube integration; catches complex patterns | Low—well-maintained |
| `eslint-plugin-no-secrets` | 1.5.0+ | Detects API keys, tokens, passwords before commit | Very Low—passive scanning |
| `eslint-plugin-security` | Already installed ✅ | Core security rules (eval, regex, child process, etc.) | N/A |

**Total new package count**: 2 (sonarjs, no-secrets)  
**Total dev dependencies**: Will add ~2 packages (no-secrets + sonarjs dependencies)

---

## 🔒 Security Rules Breakdown

### CRITICAL Errors (Build-Blocking)

**Code Execution**
- `no-eval` — Blocks `eval()` entirely
- `no-implied-eval` — Blocks `setTimeout("code", delay)` patterns
- `no-new-func` — Blocks `Function("code")()`
- `no-restricted-syntax` — Blocks string-based timers (setTimeout with literal string)

**DOM Injection**
- `react/no-danger` — Blocks `dangerouslySetInnerHTML`
- `react/no-danger-with-children` — Blocks mixed dangerous content

**Secrets**
- `no-secrets/no-secrets` — Blocks API keys, tokens, credentials

**Object Pollution**
- `security/detect-object-injection` — Flags `obj[userKey] = value` patterns

**Node.js Risks**
- `security/detect-child-process` — Blocks `spawn()`, `exec()` without explicit review
- `security/detect-non-literal-fs-filename` — Blocks `fs.readFile(userPath)`
- `security/detect-non-literal-require` — Blocks `require(userString)`
- `security/detect-buffer-noassert` — Blocks unsafe Buffer operations

**Type Safety**
- `@typescript-eslint/no-explicit-any` — Breaks on `any` (forces TS safety)
- `@typescript-eslint/no-non-null-asserted-optional-chain` — Blocks `obj?.prop!.method()` (incorrect logic)

**Regex Safety**
- `security/detect-unsafe-regex` — Blocks ReDoS patterns (catastrophic backtrack)

### WARN Level (Developer Awareness)

**Suspicious Code**
- `security/detect-non-literal-regexp` — Flag `new RegExp(userInput)` (encourages validation)
- `security/detect-no-csrf-before-method-override` — HTTP method override patterns
- `sonarjs/cognitive-complexity` — Functions >30 are harder to audit (warn at 30)

**Type Safety**
- `@typescript-eslint/no-non-null-assertion` — `value!` bypasses type safety
- `@typescript-eslint/no-implicit-any-catch` — `catch (e)` with inferred any

**Code Hygiene**
- `@typescript-eslint/no-unused-vars` — Dead code is harder to audit
- `no-console` — Remove debug logs before production

### Special Scoping

**Tests** (`*.test.ts`, `*.spec.ts`)
- Relax `no-eval`, `any` restrictions
- Allow `no-console`
- Reason: Mocks, spies, test fixtures need flexibility

**Build Scripts** (`vite.config.js`, `scripts/`, `electron/`)
- Allow `require()`, `child_process`
- Reason: Node.js context expected

---

## 📊 Implementation Plan

### Step 1: Install Dependencies
```bash
pnpm add -D eslint-plugin-sonarjs eslint-plugin-no-secrets
```

### Step 2: Update ESLint Configuration
Replace current `eslint.config.js` with enhanced config:

```bash
cp eslint.config.security-enhanced.js eslint.config.js
```

### Step 3: Verify Installation
```bash
pnpm lint  # Should run new rules
```

### Step 4: Address Any New Violations
```bash
pnpm lint --fix  # Auto-fix style/variable naming
pnpm lint        # Manually fix security issues
```

Expect ~3-8 violations on first run (mostly unused variables, no console in test files).

### Step 5: Add Security-Specific Scripts

Update `package.json` scripts:

```json
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "lint:security": "eslint src/ --rule 'no-eval: error' --rule 'no-secrets/no-secrets: error'",
    "lint:deep": "eslint src/ --rule '@typescript-eslint/no-explicit-any: error'",
    "lint:ci": "eslint src/ --format json > lint-report.json && pnpm lint:security"
  }
}
```

---

## 🎯 Expected Behavior

### Local Development
```bash
# Create a file with security issue:
echo "eval('x = 1')" > src/test.ts

# Run lint:
pnpm lint
# Output: ✖ error eval() found. Eval is evil

# Cannot commit / must fix
```

### CI/CD Integration
```bash
# In GitHub Actions, GitLab CI, etc.:
pnpm lint:security  # Fails build if any critical security rule violated
```

---

## 🚦 Per-Context Rules Summary

| Context | Eval | Any | Child Process | DOM Injection |
|---------|------|-----|---------------|---------------|
| **src/** (main) | ❌ error | ❌ error | ❌ error | ❌ error |
| **src/**/*.test.ts (tests) | ⚠️ warn | ⚠️ warn | ✅ off | ✅ off |
| **scripts/** (build) | ⚠️ warn | ⚠️ warn | ⚠️ warn | ✅ off |
| **vite.config.js** (config) | ✅ off | ⚠️ warn | ⚠️ warn | ✅ off |

---

## 📈 False Positive Mitigation

### Acceptable Suppressions

**Case 1: Intentional Object Injection** (rare)
```typescript
// eslint-disable-next-line security/detect-object-injection
const result = obj[key]
```

**Case 2: Intentional Any Type** (at trust boundaries)
```typescript
// Type from external API; verified safe via schema validation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = await fetch(url).then(r => r.json())
```

**Case 3: Test Utility Functions**
```typescript
// Test file - mocking is expected
// eslint-disable-next-line no-eval
const vm = require('vm').runInNewContext(userCode, sandbox)
```

---

## 🛡️ Trust Boundary Enforcement

### Where `any` Is Not Allowed
- Function parameters (inputs!)
- External API responses
- User form submissions
- URL search params
- localStorage/sessionStorage reads
- Message event data

### Where Loose Typing Is Acceptable
- Type-safe internal functions (no external inputs)
- Type definitions imported from trusted libraries
- 100% controlled test/fixture data

---

## ✅ Validation Checklist

Run before committing:

```bash
# 1. Typecheck
pnpm typecheck

# 2. Security lint
pnpm lint:security

# 3. Full lint
pnpm lint

# 4. Build
pnpm build

# 5. Tests (if applicable)
pnpm test
```

---

## 🔗 Integration with External Tools

### Semgrep (Optional—Advanced)
Complement ESLint with Semgrep for:
- Dataflow analysis (tainted data tracking)
- Cross-file patterns
- Language-specific vulnerability databases

```bash
semgrep --config p/owasp-top-ten --output semgrep-report.json src/
```

### gitleaks (Optional—Pre-Commit)
Catch secrets before they hit git:

```bash
gitleaks detect --verbose  # Run before push
```

### SBOM + Dependency Auditing
```bash
pnpm audit  # Check for known CVEs in dependencies
```

---

## 📝 Maintenance & Updates

### Quarterly Review
1. Check for new ESLint plugin versions
2. Review false positives in CI logs
3. Update rules if new attack vectors emerge

### When Adding New Dependencies
1. Run `pnpm audit` to check for CVEs
2. Review package source (GitHub stars, maintenance history)
3. Run `pnpm lint:security` after adding

---

## 🚀 Deployment & CI Recommendation

### GitHub Actions Example
```yaml
name: Security Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 24
          cache: 'pnpm'
      
      - run: pnpm install
      
      # CRITICAL: Fail if security rules violated
      - run: pnpm lint:security
        if: always()
      
      # INFO: Full lint (warnings don't fail)
      - run: pnpm lint
        if: always()
      
      # Build
      - run: pnpm build
```

### GitLab CI Example
```yaml
lint:security:
  stage: test
  script:
    - pnpm install
    - pnpm lint:security  # Fails on security violations
  allow_failure: false  # Fail build
```

---

## 📚 Key References

**ESLint Plugin Security**
- https://github.com/nodesecurity/eslint-plugin-security

**SonarJS**
- https://github.com/SonarSource/eslint-plugin-sonarjs

**No Secrets**
- https://github.com/nickdeis/eslint-plugin-no-secrets

**TypeScript-ESLint Trust Boundaries**
- https://typescript-eslint.io/rules/no-explicit-any/

---

## 🎓 Developer Training

### Quick Start
```bash
# Run security checks locally
pnpm lint:security

# See which rules are enabled
pnpm lint --print-config src/app/useTheme.ts | grep -A5 security
```

### Common Issues

**"no-secrets found hardcoded secret"**
- Check for `.env.example` or move to `.env` (gitignored)
- Use environment variables or vault services

**"any type not allowed"**
- Use `unknown` instead of `any`
- Add explicit type guards: `if (typeof x === 'string') { ... }`

**"dangerouslySetInnerHTML not allowed"**
- Use text content or sanitization library (DOMPurify)
- For safe HTML, use `<RichText content={sanitized} />`

---

## ✨ Success Criteria

After implementation:
✅ All new code runs through security lint before merge  
✅ No eval/Function/string-based timers in production code  
✅ No secrets committed  
✅ All security violations are explicit (no silent failures)  
✅ Developers understand why rules exist (documentation)  
✅ False positives <5% (manageable)  
✅ CI fails on critical security rule violations  

---

**Next Steps**: Run the installation steps above and report any violations. Most should be auto-fixable with `pnpm lint:fix`.

