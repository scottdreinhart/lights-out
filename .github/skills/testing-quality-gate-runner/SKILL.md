---
name: testing-quality-gate-runner
description: "Testing Quality Gate Runner"
---

# Testing Quality Gate Runner

## When to Use

- Designing test coverage and execution plans
- Enforcing test naming and framework selection rules
- Running and triaging quality gates in local or CI contexts

## Authority

- `AGENTS.md` § 0, § 0.A, § 28
- `.github/instructions/17-testing.instructions.md`
- `.github/instructions/04-mobile-testing.instructions.md`

## Core Responsibilities

- Enforce 8-type test taxonomy and naming conventions
- Keep Vitest vs Playwright usage correctly separated
- Ensure `pnpm test:names`, `pnpm test`, `pnpm test:e2e`, and `pnpm validate` expectations are met
- Surface root-cause failures with actionable remediation

## Definition of Done

- Test naming and framework policy compliant
- Relevant suites executed and passing
- Quality-gate status is clear and reproducible

---

## Phase 4: Security Test Integration

### Security Test Templates Integrated

All 6 security test templates from DEVELOPER_WORKFLOW.md are integrated:

1. **Input Validation Tests** (`.validation.test.ts`)
   - SQL injection patterns
   - XSS script detection
   - Boundary condition testing
   - UUID/format validation

2. **Authentication & Session Tests** (`.integration.test.ts`)
   - Token generation verification (64 hex chars)
   - Session expiration validation
   - Password hashing (bcrypt format)
   - Login attempt tracking

3. **CSRF Protection Tests** (`.integration.test.ts`)
   - Token presence in requests
   - Invalid token rejection
   - Header placement validation

4. **Secure Cookie Tests** (`.integration.test.ts`)
   - HttpOnly + Secure + SameSite flags
   - Expiration time validation
   - Domain/Path restrictions

5. **Security Event Logging Tests** (`.integration.test.ts`)
   - Sensitive data redaction (passwords, tokens)
   - Severity level assignment
   - Timestamp presence

6. **Configuration Validation Tests** (`.validation.test.ts`)
   - Required env vars enforced
   - Secret minimum length enforced
   - Debug mode disabled in production

### Test Naming Validation with Security Context

```typescript
// Enhanced test name validator
const SECURITY_TEST_PATTERNS = {
  'input-validation': /.+\.validation\.test\.ts$/,
  'auth-integration': /.+\.integration\.test\.ts$/,
  'csrf-integration': /.+\.integration\.test\.ts$/,
  'cookie-integration': /.+\.integration\.test\.ts$/,
  'logging-integration': /.+\.integration\.test\.ts$/,
  'config-validation': /.+\.validation\.test\.ts$/,
};

const validateSecurityTestNaming = (testFile: string) => {
  // Must match one of the security patterns
  for (const [pattern] of Object.entries(SECURITY_TEST_PATTERNS)) {
    if (testFile.includes(pattern)) {
      return true;
    }
  }
  return false;
};
```

### Quality Gate Execution Order

```bash
# pnpm validate (full gate including security tests)
1. pnpm lint                 # ESLint (includes security rules)
2. pnpm typecheck            # TypeScript strict mode
3. pnpm test:names           # Test naming validation (includes security patterns)
4. pnpm test                 # Vitest (unit/integration/component/api, includes security tests)
5. pnpm test:e2e             # Playwright (e2e/a11y/visual, includes security flows)
6. pnpm build                # Vite production build
7. pnpm test:coverage        # Coverage report
```

