# Security Governance - Auditor Workflow

## Your Role

You are verifying that the platform's security governance is:
1. ✅ Complete (all OWASP categories covered)
2. ✅ Enforceable (lint rules, tests, validation)
3. ✅ Traceable (authority standards documented)
4. ✅ Compliant (aligned with industry standards)
5. ✅ Operational (working correctly in practice)

---

## Platform Audit Checklist

### Phase 1: Governance Authority Review

**Question**: Is the governance framework comprehensive and authoritative?

- [ ] **Authority File Exists**: `AGENTS.md` § 24 Security Governance (1000+ lines)
- [ ] **Source Count**: § 24 cites 40+ authoritative sources
- [ ] **OWASP Coverage**: § 24 § 1 maps all 10 OWASP Top 10 2021 categories
- [ ] **CWE Mapping**: § 24 includes CWE numbers for each category
- [ ] **Governance Hierarchy**: § 0 (non-negotiable) → § 24 (authority) → § 10 (implementation)

**Verification Commands**:
```bash
# Check file exists and has content
wc -l AGENTS.md .github/instructions/24-security-governance.md
# Expected: AGENTS.md > 1000 lines, 24-security-governance.md > 1000 lines

# Count authority sources (OWASP, MDN, CWE, etc.)
grep -E 'https?://' .github/instructions/24-security-governance.md | wc -l
# Expected: > 40 URLs

# Verify OWASP categories documented
grep -E 'A0[1-9]:2021|A10:2021' .github/instructions/24-security-governance.md | wc -l
# Expected: 10 references (one per OWASP category)
```

**Red Flags** ⚠️:
- § 24 missing → No authoritative security framework
- Fewer than 30 sources → Incomplete authority citation
- OWASP categories not mapped → Gaps in coverage

---

### Phase 2: Implementation Enforcement Review

**Question**: Are security rules actually enforced on every commit?

#### ESLint Enforcement (OWASP A03:2021 XSS Prevention)

- [ ] **Rule Enabled**: `react/no-danger` in `eslint.config.js`
- [ ] **Rule Configuration**: Correct strictness level
- [ ] **Workspace Coverage**: Rule applies to all apps (not just some)
- [ ] **Test Command**: `pnpm lint` catches violations
- [ ] **Pre-commit Hook**: Husky runs `lint-staged` before commit

**Verification Commands**:
```bash
# Check ESLint rule is enabled
grep -r 'react/no-danger' eslint.config.js
# Expected: Rule configured with non-zero severity

# Run linting across all apps
pnpm lint:scope:app
# Expected: ✅ All apps pass (or known violations documented)

# Check pre-commit hook
cat .husky/pre-commit
# Expected: References lint-staged (auto-fixes before commit)

# Verify lint-staged configuration
cat package.json | grep -A 10 '"lint-staged"'
# Expected: Includes ESLint rules for **/*.{ts,tsx}
```

#### TypeScript Enforcement (Strict Mode)

- [ ] **Strict Mode Enabled**: `tsconfig.json` has `"strict": true`
- [ ] **No-Any Rule**: `"noImplicitAny": true` enforced
- [ ] **Workspace Coverage**: All apps use consistent tsconfig.json
- [ ] **Type Coverage**: > 90% of code is typed
- [ ] **Test Command**: `pnpm typecheck` catches violations

**Verification Commands**:
```bash
# Check strict mode is enabled
grep -E '"strict"|"noImplicitAny"' tsconfig.json
# Expected: "strict": true and "noImplicitAny": true

# Run typecheck across all apps
pnpm typecheck
# Expected: ✅ All apps pass (no type errors)

# Check for any `any` type usage
find src -name '*.ts' -o -name '*.tsx' | xargs grep -c ': any'
# Expected: < 5 (minimal, with justification)
```

#### Secrets Management Enforcement (OWASP A02:2021)

- [ ] **`.gitignore` Updated**: `.env.local` excluded
- [ ] **Pre-commit Check**: Secret scanning (optional via pre-commit hook)
- [ ] **Environment Variables**: VITE_PUBLIC_* variables documented
- [ ] **CI/CD Check**: Secret scanning in pipeline (optional)
- [ ] **Documentation**: `.env.example` provides template

**Verification Commands**:
```bash
# Verify .env.local is ignored
grep '.env.local' .gitignore
# Expected: .env.local appears in .gitignore

# Check for accidental secrets in committed files
git log -S 'PRIVATE_KEY' --all
# Expected: No results (or old commits, pre-governance)

# Verify environment template exists
cat .env.example
# Expected: Example env vars with placeholders
```

#### Validation Enforcement (Input Validation, OWASP A08:2021)

- [ ] **Zod Installed**: `pnpm list zod`
- [ ] **Zod Usage**: Schemas used in data-critical paths
- [ ] **Error Handling**: Invalid input rejected safely (no details leaked)
- [ ] **Test Coverage**: Boundary conditions tested

**Verification Commands**:
```bash
# Check Zod is installed
pnpm list zod
# Expected: zod@X.Y.Z listed

# Find Zod schema usage
find src -name '*.ts' -o -name '*.tsx' | xargs grep -l 'z\\.object\\|z\\.string\\|z\\.number'
# Expected: > 10 uses (common validation patterns)

# Check validation tests exist
find src -name '*.test.ts' -o -name '*.test.tsx' | xargs grep -l 'rejects\\|throws\\|invalid'
# Expected: Multiple test files checking invalid input
```

---

### Phase 3: OWASP Mapping Verification

**Question**: Does the codebase cover all OWASP Top 10 2021 categories?

Create or verify the OWASP Compliance Matrix:

| OWASP Category | Risk Level | Enforcement Mechanism | Status | Tests | Docs |
|---|---|---|---|---|---|
| **A01** Broken Access Control | HIGH | CSRF token validation + RBAC | ✅ | ✅ | ✅ |
| **A02** Cryptographic Failures | HIGH | .env.local, no hard-coded secrets | ✅ | ✅ | ✅ |
| **A03** Injection (XSS) | CRITICAL | react/no-danger ESLint + DOMPurify | ✅ | ✅ | ✅ |
| **A04** Insecure Design | MEDIUM | Architecture review in AGENTS.md § 3-4 | ✅ | ✅ | ✅ |
| **A05** Security Misconfiguration | MEDIUM | ESLint security plugin + TypeScript strict | ✅ | ✅ | ✅ |
| **A06** Vulnerable Components | HIGH | pnpm audit, no high/critical CVEs | ✅ | ✅ | ✅ |
| **A07** Auth/Session Failures | HIGH | Secure cookies (HttpOnly, Secure, SameSite) | ✅ | ✅ | ✅ |
| **A08** Software & Data Integrity | HIGH | Zod validation, input schema validation | ✅ | ✅ | ✅ |
| **A09** Logging & Monitoring | MEDIUM | Error handling, safe error messages | ✅ | ✅ | ✅ |
| **A10** SSRF | MEDIUM | URL validation, protocol whitelist | ✅ | ✅ | ✅ |

**Verification Commands**:
```bash
# Check each OWASP category is documented in § 10
for category in A01 A02 A03 A04 A05 A06 A07 A08 A09 A10; do
  grep -q "$category" .github/instructions/10-security.instructions.md && echo "$category: ✅" || echo "$category: ❌"
done

# Create compliance matrix
node scripts/audit-owasp-compliance.mjs > compliance-matrix.md
```

---

### Phase 4: Test Coverage Audit

**Question**: Are security vulnerabilities actually tested for?

#### Test Type Coverage

- [ ] **Unit Tests**: Pure security functions tested (validation, sanitization)
- [ ] **Integration Tests**: Attack scenarios tested (XSS, CSRF, injection)
- [ ] **E2E Tests**: Full user flows secure (login, data submission, logout)
- [ ] **Security Tests**: Labeled with `security` or `attack` keywords

**Verification Commands**:
```bash
# Find security-specific tests
find src -name '*.test.ts' -o -name '*.test.tsx' | xargs grep -l 'security\|xss\|csrf\|injection\|attack' -i
# Expected: > 20 test files with security-specific tests

# Run all tests with coverage
pnpm test -- --coverage
# Expected: > 80% statement coverage, > 90% branch coverage for critical paths

# Identify test naming compliance
find src -name '*.test.ts' -o -name '*.test.tsx' | sort
# Expected: Filenames match pattern: feature.type.test.ts (e.g., xss.security.test.ts)
```

#### Attack Scenario Coverage

- [ ] **XSS Tests**: Verify XSS payloads are blocked
- [ ] **CSRF Tests**: Verify CSRF tokens are validated
- [ ] **Injection Tests**: Verify SQL/command injection blocked
- [ ] **Input Validation Tests**: Verify boundary conditions rejected

**Verification Commands**:
```bash
# Check for XSS payload testing
find src -name '*.test.ts' -o -name '*.test.tsx' | xargs grep -l 'onerror=\\|<img src=x\\|<script>' | wc -l
# Expected: > 5 test files include XSS payloads

# Check for CSRF token testing
find src -name '*.test.ts' -o -name '*.test.tsx' | xargs grep -l 'csrf\\|x-csrf\\|csrf-token' -i | wc -l
# Expected: > 3 test files include CSRF token scenarios

# Run security-specific test suite
pnpm test security
# Expected: All security tests pass
```

---

### Phase 5: Dependency Security Audit

**Question**: Are third-party dependencies secure?

#### Known Vulnerability Check

- [ ] **No High/Critical CVEs**: `pnpm audit` shows no high/critical vulnerabilities
- [ ] **Audit Passing**: `pnpm validate` includes audit check
- [ ] **Regular Updates**: Dependencies updated monthly or on security patches
- [ ] **Lock File**: `pnpm-lock.yaml` committed (no npm-lock.json or yarn.lock)

**Verification Commands**:
```bash
# Run security audit
pnpm audit
# Expected: No high or critical vulnerabilities
# Output format: 0 vulnerabilities, or list of low/moderate with resolution guidance

# Check audit is part of validation gate
grep -r 'audit' package.json .github/instructions/
# Expected: `pnpm audit` referenced in validation scripts

# Verify lock file integrity
ls -la pnpm-lock.yaml
# Expected: File exists (do NOT expect npm-lock.json or yarn.lock)

# Check for security updates
git log --oneline pnpm-lock.yaml | head -20
# Expected: Recent updates (within last 2 weeks)
```

#### Dependency Reputability

- [ ] **Official Packages**: Using official packages (e.g., zod, not zod-fork)
- [ ] **License Check**: All dependencies have permissive licenses (MIT, Apache, ISC, BSD)
- [ ] **Maintainer Status**: Active projects (recent commits, responsive maintainers)

**Verification Commands**:
```bash
# Check for typosquatting (suspicious packages)
pnpm list | grep -E 'fork|unofficial|clone' -i
# Expected: No results (all packages official)

# Check licenses
pnpm list --json | jq '.[] | .license' | sort | uniq -c
# Expected: Only permissive licenses (MIT, Apache-2.0, ISC, BSD*)

# Check package health (maintenance status)
npm view zod time.modified
# Expected: Recent date (within last month for active packages)
```

---

### Phase 6: Documentation & Traceability Audit

**Question**: Is the security framework documented and traceable?

#### Documentation Completeness

- [ ] **Authority File**: § 24 Security Governance exists (1000+ lines)
- [ ] **Implementation Guide**: § 10 Security Instructions exists (300+ lines)
- [ ] **Developer Workflow**: DEVELOPER_WORKFLOW.md exists with code examples
- [ ] **Reviewer Workflow**: REVIEWER_WORKFLOW.md exists with checklist
- [ ] **Auditor Workflow**: AUDITOR_WORKFLOW.md exists with procedures
- [ ] **Agent Instructions**: AGENT_INSTRUCTIONS.md documents how agents use skills

**Verification Commands**:
```bash
# Check all documentation files exist
ls -la .github/instructions/24-security-governance.md
ls -la .github/instructions/10-security.instructions.md
ls -la .github/skills/security-governance/DEVELOPER_WORKFLOW.md
ls -la .github/skills/security-governance/REVIEWER_WORKFLOW.md
ls -la .github/skills/security-governance/AUDITOR_WORKFLOW.md
ls -la .github/skills/security-governance/AGENT_INSTRUCTIONS.md
# Expected: All files exist

# Verify file sizes (should have substantial content)
wc -l .github/instructions/24-security-governance.md
# Expected: > 1000 lines

wc -l .github/instructions/10-security.instructions.md
# Expected: > 300 lines
```

#### Citation Traceability

- [ ] **Authority URLs**: Every rule has OWASP/MDN/CWE URL
- [ ] **CWE Mapping**: Every vulnerability class has CWE number
- [ ] **OWASP Mapping**: Every enforcement mechanism maps to OWASP category
- [ ] **Enforcement Link**: Every rule links to enforcement mechanism

**Verification Commands**:
```bash
# Count authority URLs in § 10
grep -o 'https://[^)]*' .github/instructions/10-security.instructions.md | sort -u | wc -l
# Expected: > 25 unique URLs

# Count CWE references
grep -o 'CWE-[0-9]*' .github/instructions/ -r | sort -u | wc -l
# Expected: > 6 distinct CWE numbers

# Verify OWASP category in every section
grep -E '^## ' .github/instructions/10-security.instructions.md | wc -l
# Expected: > 6 major sections (each with authority citation)
```

---

### Phase 7: Operational Validation

**Question**: Does the security framework actually work in practice?

#### Pre-Commit Enforcement

- [ ] **Lint Check**: Violations blocked before commit
- [ ] **Type Check**: Type errors blocked before commit
- [ ] **Secret Scanning**: Accidental secrets blocked before commit
- [ ] **Test Pass**: Failed tests block commit (if configured)

**Verification Commands**:
```bash
# Simulate a violation and attempt commit
echo 'const x = "sk-secret-key"' > test-secret.ts
git add test-secret.ts
pnpm lint:scope:app  # Should fail with secret or lint warning

# Revert test file
git reset HEAD test-secret.ts
rm test-secret.ts

# Check pre-commit configuration
cat .husky/pre-commit
# Expected: References lint-staged or similar enforcement
```

#### CI/CD Enforcement

- [ ] **GitHub Actions**: Security checks run on every PR
- [ ] **Build Gate**: `pnpm validate` must pass before merge
- [ ] **Test Gate**: All tests must pass before merge
- [ ] **Audit Gate**: Dependency audit must pass before merge

**Verification Commands**:
```bash
# Check GitHub Actions workflow
ls -la .github/workflows/
# Expected: validate.yml or check.yml or similar

# View workflow content
cat .github/workflows/*.yml | grep -E 'pnpm (lint|typecheck|test|validate|audit)'
# Expected: At least one validation script runs on PR

# Check branch protection rules (if using GitHub)
# (Manual verification: Settings → Branches → Branch protection rules)
```

#### Manual Governance Enforcement

- [ ] **Code Review**: Security reviews required for sensitive changes
- [ ] **Approval Required**: Security PRs need explicit approval
- [ ] **Authority Citation**: Reviewers check for OWASP/CWE references
- [ ] **Test Verification**: Reviewers verify security tests added

**Verification Commands**:
```bash
# Check recent merged PRs have security reviews
git log --format='%H %s' -20 | while read hash msg; do
  git show $hash --format='' --name-only | grep -q 'security' && echo "$msg: contains security changes"
done

# Verify code review comments exist
git log --all --grep='OWASP\|CWE\|security' --oneline | wc -l
# Expected: > 10 commits reference security standards
```

---

## Audit Report Template

Use this template to document your audit findings:

```markdown
# Security Governance Audit Report
**Date**: YYYY-MM-DD  
**Auditor**: [Your Name]  
**Scope**: Platform security framework (AGENTS.md § 24, § 10, Skills)

## Executive Summary

**Status**: ✅ COMPLIANT / 🟡 PARTIAL / ❌ NON-COMPLIANT

- ✅ 10/10 OWASP categories covered
- ✅ 40+ authoritative sources cited
- ✅ ESLint enforcement active
- ✅ TypeScript strict mode enabled
- ✅ Security tests comprehensive
- ✅ Dependency audit passing

**Risk Level**: LOW / MEDIUM / HIGH

---

## Findings by Phase

### Phase 1: Governance Authority
- ✅ AGENTS.md § 24 exists (1200+ lines, 45 sources)
- ✅ All 10 OWASP categories mapped
- ✅ CWE numbers documented
- Status: ✅ COMPLIANT

### Phase 2: Implementation Enforcement
- ✅ ESLint react/no-danger rule enabled
- ✅ TypeScript strict: "strict": true
- ✅ .env.local in .gitignore
- ✅ Zod validation installed and used
- ✅ Pre-commit hook configured (Husky)
- Status: ✅ COMPLIANT

### Phase 3: OWASP Mapping
- A01: ✅ CSRF validation
- A02: ✅ Secrets management
- A03: ✅ XSS prevention (react/no-danger)
- A04: ✅ Architecture review
- A05: ✅ Security config (ESLint + TypeScript)
- A06: ✅ Dependency audit (pnpm audit)
- A07: ✅ Secure cookies
- A08: ✅ Input validation (Zod)
- A09: ✅ Error handling
- A10: ✅ SSRF prevention
- Status: ✅ COMPLIANT

### Phase 4: Test Coverage
- Unit tests: ✅ (25+ files)
- Integration tests: ✅ (15+ files)
- E2E tests: ✅ (8+ files)
- Security-specific tests: ✅ (XSS, CSRF, injection covered)
- Coverage: 87% (target: 80%)
- Status: ✅ COMPLIANT

### Phase 5: Dependency Security
- pnpm audit: ✅ No high/critical CVEs
- Lock file: ✅ pnpm-lock.yaml committed
- Official packages: ✅ No typosquatting detected
- Licenses: ✅ All permissive (MIT, Apache)
- Recent updates: ✅ (within 2 weeks)
- Status: ✅ COMPLIANT

### Phase 6: Documentation & Traceability
- Authority file: ✅ § 24 (1200+ lines)
- Implementation guide: ✅ § 10 (358 lines)
- Developer workflow: ✅ (250+ lines, 5 code examples)
- Reviewer workflow: ✅ (400+ lines, checklist)
- Auditor workflow: ✅ (this document)
- Authority URLs: ✅ (45+ unique URLs)
- CWE mapping: ✅ (7 distinct CWE numbers)
- Status: ✅ COMPLIANT

### Phase 7: Operational Validation
- Pre-commit enforcement: ✅ Verified (lint blocks invalid code)
- CI/CD enforcement: ✅ GitHub Actions runs pnpm validate
- Test gate: ✅ Tests must pass before merge
- Audit gate: ✅ pnpm audit included in validation
- Code review: ✅ Security PRs require approval
- Status: ✅ COMPLIANT

---

## Compliance Matrix

| Control | Requirement | Status | Evidence |
|---------|---|--------|----------|
| Authority | 40+ authoritative sources | ✅ | § 24 § 2 lists 45 sources |
| OWASP Coverage | All 10 categories | ✅ | § 24 § 1 maps A01-A10 |
| CWE Mapping | 6+ distinct CWE numbers | ✅ | § 10 references CWE-79/601/798/etc. |
| ESLint Enforcement | react/no-danger enabled | ✅ | eslint.config.js confirmed |
| TypeScript Strict | "strict": true enabled | ✅ | tsconfig.json verified |
| Input Validation | Zod or equivalent | ✅ | 30+ Zod schema usages found |
| Secrets Management | .env.local excluded | ✅ | .gitignore includes .env.local |
| Security Tests | >20 security-specific tests | ✅ | xss.test.tsx, csrf.test.ts, etc. |
| Test Coverage | >80% for critical paths | ✅ | Coverage report: 87% |
| Dependency Audit | No high/critical CVEs | ✅ | pnpm audit: 0 vulnerabilities |
| Pre-commit Hooks | Lint + typecheck before commit | ✅ | Husky hooks configured |
| CI/CD Gate | pnpm validate in CI | ✅ | .github/workflows/validate.yml |
| Code Review | Security PRs require approval | ✅ | Branch protection rules active |
| Documentation | Authority + workflows | ✅ | 6 docs files, 1000+ lines total |

---

## Recommendations

### Immediate (P0 - Do Now)
- None identified; framework is compliant

### Short-term (P1 - Next Sprint)
- Create compliance audit automation script (audit-owasp-compliance.mjs)
- Add supply chain security guidance (SLSA levels, OSSF Scorecard)

### Long-term (P2 - Next Quarter)
- Expand security training for new team members
- Publish security case studies (e.g., "How we prevented X vulnerability")

---

## Sign-Off

**Auditor**: [Your Name]  
**Date**: YYYY-MM-DD  
**Status**: ✅ AUDIT PASSED  
**Next Audit**: [Date + 6 months]

**Reviewer**: [Security Lead]  
**Approved**: ✅ YES
```

---

## Continuous Monitoring

**Monthly Audit Checklist** (15 minutes):

```bash
# 1. Check for new CVEs
pnpm audit

# 2. Verify lint compliance
pnpm lint:scope:app

# 3. Verify type checking
pnpm typecheck

# 4. Run security tests
pnpm test security

# 5. Check GitHub Actions status
# (Manual: GitHub repo → Actions → Recent workflows)

# 6. Review recent security PRs
git log --all --grep='OWASP\|CWE\|security' --since='1 month ago' --oneline
```

---

## Summary

**The Auditor Security Workflow**:
1. ✅ **Authority Review** — § 24 governance + OWASP mapping complete?
2. ✅ **Enforcement Check** — ESLint, TypeScript, tests all enforced?
3. ✅ **OWASP Coverage** — All 10 categories implemented?
4. ✅ **Test Audit** — Security scenarios actually tested?
5. ✅ **Dependency Review** — No high/critical CVEs?
6. ✅ **Documentation** — Traceability preserved?
7. ✅ **Operational** — Pre-commit + CI/CD enforcement working?
8. ✅ **Report** — Findings documented with sign-off
