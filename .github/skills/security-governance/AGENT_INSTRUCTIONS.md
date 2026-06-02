# Security Governance - Agent Instructions

## What Agents Should Know

This file teaches AI agents (Claude, Copilot, Foundry agents) how to apply security governance skills in code generation, code review, compliance audits, and architecture discussions.

---

## When to Apply Each Workflow

### Trigger 1: User Asks for Secure Code Implementation

**User Request Examples**:
- "How do I prevent XSS in React?"
- "Add CSRF protection to this form"
- "Generate secure input validation for move validation"
- "Show me how to handle API keys safely"

**Agent Action**:
1. Load [DEVELOPER_WORKFLOW.md](DEVELOPER_WORKFLOW.md)
2. Identify OWASP category (XSS = A03, Secrets = A02, etc.)
3. Find matching feature workflow section
4. Provide complete code pattern with:
   - Authority link (OWASP + CWE)
   - Implementation code (copy-paste ready)
   - Validation command (`pnpm lint` / `pnpm typecheck` / etc.)
   - Test example (normal + attack scenario)
5. Explain pre-commit checklist (5 steps)
6. Reference PR submission template

**Response Template**:
```markdown
## XSS Prevention (OWASP A03:2021, CWE-79)

**Authority**: [OWASP XSS Prevention Cheat Sheet](URL)

### Safe Pattern

[Code pattern from DEVELOPER_WORKFLOW.md]

### Validation

```bash
pnpm lint  # Catches dangerouslySetInnerHTML without DOMPurify
pnpm test  # Runs XSS prevention tests
```

### Pre-Commit Checklist
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] Security tests added (XSS payload blocked)
- [ ] Authority cited in code comment
```

---

### Trigger 2: User Asks Agent to Review Code for Security

**User Request Examples**:
- "Review this form for security issues"
- "Check if this API endpoint is vulnerable"
- "Is this CSRF-protected correctly?"

**Agent Action**:
1. Load [REVIEWER_WORKFLOW.md](REVIEWER_WORKFLOW.md)
2. Go through Pre-Review Checklist (4 steps)
3. Identify OWASP category of code being reviewed
4. Run through Security Review Checklist for that category
5. Check testing (attack scenario tested?)
6. Provide approval or specific change requests

**Response Template**:
```markdown
## Security Review

**OWASP Category**: A03:2021 Injection (CWE-79)  
**Authority**: [Reference](URL)

### Pre-Review Checks ✅
- ✅ PR mentions OWASP category
- ✅ Authority link provided
- ✅ ESLint enforcement verified

### Security Checklist
- [ ] No dangerouslySetInnerHTML without DOMPurify
- [ ] React auto-escaping used by default
- [ ] XSS tests verify attack blocked

### Findings
[Specific feedback or approval]
```

---

### Trigger 3: User Asks if Code Meets Governance Standards

**User Request Examples**:
- "Are we compliant with OWASP?"
- "Audit this app's security"
- "What's our CWE coverage?"

**Agent Action**:
1. Load [AUDITOR_WORKFLOW.md](AUDITOR_WORKFLOW.md)
2. Go through Platform Audit Checklist (7 phases)
3. Check each phase against codebase
4. Report findings (compliant / partial / non-compliant)
5. Provide compliance matrix

**Response Template**:
```markdown
## Security Audit Summary

**Overall Status**: ✅ COMPLIANT

| Phase | Finding | Status |
|-------|---------|--------|
| Authority | § 24 complete, 40+ sources | ✅ |
| Enforcement | ESLint + TypeScript enforced | ✅ |
| OWASP Coverage | All 10 categories implemented | ✅ |
| Test Coverage | 85% coverage, attack scenarios tested | ✅ |
| Dependencies | No high/critical CVEs | ✅ |

### Recommendations
[Specific next steps]
```

---

### Trigger 4: User Asks How to Implement a Specific Pattern

**User Request Examples**:
- "What's the best way to validate user input?"
- "How should we structure CSRF token validation?"
- "Show me a secure cookie configuration"

**Agent Action**:
1. Identify the security concern (OWASP category)
2. Load [DEVELOPER_WORKFLOW.md](DEVELOPER_WORKFLOW.md) or [REVIEWER_WORKFLOW.md](REVIEWER_WORKFLOW.md)
3. Find the matching workflow section
4. Provide:
   - Authority (OWASP + CWE)
   - Code pattern (complete, production-ready)
   - What each part does (explanation)
   - Common mistakes (what NOT to do)
   - How to test (attack scenario)
   - How enforcement works (ESLint / TypeScript / tests)

**Response Template**:
```markdown
## Input Validation Pattern (OWASP A08:2021, CWE-1025)

**Authority**: [OWASP Input Validation Cheat Sheet](URL)

### The Right Way (Zod Schema)

[Complete pattern from DEVELOPER_WORKFLOW.md]

### What Each Part Does
- `z.number().int()` — Ensures integer, not float
- `.min(0).max(2)` — Validates boundary conditions
- `try/catch` — Handles invalid input safely
- Error message is safe — No system details leaked

### Common Mistakes ❌
- No validation at all
- Hard-coded ranges instead of schema
- Logging the user input (could be malicious)
- Returning system details in error message

### How to Test
[Test example from DEVELOPER_WORKFLOW.md]

### Enforcement
- **Validation**: `pnpm typecheck` (TypeScript ensures types)
- **Pre-commit**: `pnpm lint` catches patterns
- **Tests**: `pnpm test` verifies attack scenarios
```

---

## Authority-First Implementation

**When implementing anything security-related, agents MUST**:

1. **Always cite authority first**
   - OWASP Cheat Sheet + OWASP A## category
   - CWE number (e.g., CWE-79 for XSS)
   - MDN or official spec link
   - Example: "OWASP A03:2021 Injection (CWE-79, [OWASP XSS Cheat Sheet](...))"

2. **Reference governance documents**
   - § 24 for authority (40+ sources)
   - § 10 for implementation patterns
   - DEVELOPER_WORKFLOW.md for code examples
   - REVIEWER_WORKFLOW.md for review checklist
   - AUDITOR_WORKFLOW.md for compliance verification

3. **Explain the enforcement mechanism**
   - Which ESLint rule catches this?
   - Which TypeScript constraint applies?
   - Which test pattern validates this?
   - Which pnpm script verifies compliance?

---

## Code Generation Best Practices (for Agents)

### When Agent is Generating Security Code

**DO**:
- ✅ Load DEVELOPER_WORKFLOW.md and provide matching code pattern
- ✅ Cite OWASP category + CWE in code comment
- ✅ Include test example (normal + attack scenario)
- ✅ List pre-commit validation commands
- ✅ Reference enforcement mechanism (ESLint rule / TypeScript constraint)
- ✅ Provide complete, copy-paste-ready code
- ✅ Explain why each part is necessary

**DO NOT**:
- ❌ Generate security code without authority citation
- ❌ Skip enforcement mechanism explanation
- ❌ Provide incomplete patterns (no error handling)
- ❌ Suggest disabling ESLint rules
- ❌ Create new security patterns (reuse existing)
- ❌ Leave TODOs in security code
- ❌ Test only happy path (must include attack scenarios)

### Example: Good Security Code Generation

```markdown
## CSRF Protection Implementation

**Authority**: OWASP A01:2021 Broken Access Control (CWE-352)  
[OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/...)

### Backend: Token Generation

[Complete code from DEVELOPER_WORKFLOW.md § CSRF Protection]

### Frontend: Token Inclusion

[Complete code showing X-CSRF-Token header]

### Backend: Token Validation

[Complete validation code]

### Secure Cookie Configuration

[Complete cookie headers with HttpOnly, Secure, SameSite]

### Testing

[Test example that verifies token validation]

### Pre-Commit Validation

```bash
pnpm lint      # Checks for security patterns
pnpm typecheck # Ensures type safety
pnpm test      # Runs CSRF token validation tests
pnpm validate  # Full gate (all checks)
```

### Enforcement

- **ESLint**: security/detect-unvalidated-redirect catches CSRF issues
- **TypeScript**: Strict types ensure token is string, not null
- **Tests**: CSRF token tests verify backend validation
```

---

## Code Review Best Practices (for Agents)

### When Agent is Reviewing Security Code

**MUST DO**:
- ✅ Load REVIEWER_WORKFLOW.md and run Pre-Review Checklist (4 steps)
- ✅ Identify OWASP category from code
- ✅ Check Security Review Checklist for that category
- ✅ Verify ESLint enforcement (`pnpm lint` passes)
- ✅ Verify TypeScript enforcement (`pnpm typecheck` passes)
- ✅ Verify security tests added (attack scenario + boundary conditions)
- ✅ Request authority citation if missing
- ✅ Request test coverage if incomplete

**REQUEST CHANGES IF**:
- ❌ No OWASP/CWE reference in PR
- ❌ ESLint rule doesn't pass
- ❌ TypeScript errors present
- ❌ Only happy-path tests (no attack scenario)
- ❌ Secrets in code
- ❌ dangerouslySetInnerHTML without DOMPurify
- ❌ No input validation on user data

**APPROVE IF**:
- ✅ All pre-review checks passed
- ✅ All relevant security checklist items verified
- ✅ ESLint + TypeScript + tests all pass
- ✅ Authority cited (OWASP/CWE/URL in PR or code comment)
- ✅ No red flags detected

### Example: Good Security Code Review

```markdown
## Security Review ✅ APPROVED

**OWASP Category**: A03:2021 Injection (CWE-79)  
**Authority**: [OWASP XSS Prevention Cheat Sheet](...)

### Pre-Review Checks ✅
- ✅ PR mentions OWASP A03 (XSS prevention)
- ✅ Authority link to OWASP cheat sheet provided
- ✅ ESLint enforcement verified (react/no-danger rule active)
- ✅ TypeScript checks enforce safety

### Security Checklist (A03:2021)

| Item | Status | Note |
|------|--------|------|
| No dangerouslySetInnerHTML without DOMPurify | ✅ | All innerHTML uses DOMPurify.sanitize() |
| React auto-escaping used by default | ✅ | {userContent} properly escaped |
| react/no-danger rule passes | ✅ | pnpm lint: 0 violations |
| XSS tests present | ✅ | xss.test.tsx includes 5 attack scenarios |
| Attack scenario blocked | ✅ | <img onerror=> payload correctly blocked |

### Test Coverage
```typescript
it('blocks XSS payload <img onerror=alert()>', () => {
  const result = DOMPurify.sanitize('<img src=x onerror=alert()>')
  expect(result).not.toContain('onerror')
})
```

### Enforcement
- **ESLint**: react/no-danger catches dangerouslySetInnerHTML
- **TypeScript**: Union type ensures safe sanitization
- **Tests**: XSS test suite verifies attack blocked
- **Pre-commit**: `pnpm lint` enforces on every commit

### Approval

✅ **APPROVED** — All security checks passed. Ready to merge.
```

---

## Compliance Audit Best Practices (for Agents)

### When Agent is Running a Security Audit

**MUST DO**:
- ✅ Load AUDITOR_WORKFLOW.md
- ✅ Run Platform Audit Checklist (7 phases)
- ✅ For each phase, verify requirements are met
- ✅ Report findings per phase (COMPLIANT / PARTIAL / NON-COMPLIANT)
- ✅ Create compliance matrix
- ✅ Provide recommendations

**PHASES TO CHECK** (in order):
1. Governance Authority Review (§ 24, OWASP mapping, CWE documentation)
2. Implementation Enforcement Review (ESLint, TypeScript, Secrets, Validation)
3. OWASP Mapping Verification (all 10 categories covered)
4. Test Coverage Audit (unit/integration/E2E/attack scenarios)
5. Dependency Security Audit (pnpm audit, CVE check)
6. Documentation & Traceability Audit (authority files, citations)
7. Operational Validation (pre-commit hooks, CI/CD gates, code review)

### Example: Good Security Compliance Audit

```markdown
## Security Governance Audit Report

**Status**: ✅ COMPLIANT

### Phase 1: Governance Authority ✅
- ✅ § 24 Security Governance exists (1200+ lines)
- ✅ 45 authoritative sources cited
- ✅ All 10 OWASP categories mapped
- ✅ CWE numbers documented
- Status: ✅ COMPLIANT

### Phase 2: Implementation Enforcement ✅
- ✅ react/no-danger ESLint rule active
- ✅ TypeScript strict mode: "strict": true
- ✅ .env.local in .gitignore
- ✅ Zod validation used in 30+ places
- Status: ✅ COMPLIANT

[... additional phases ...]

### Compliance Matrix

| Control | Requirement | Status | Evidence |
|---------|---|--------|----------|
| Authority | 40+ sources | ✅ | § 24 § 2: 45 URLs |
| OWASP Coverage | All 10 categories | ✅ | § 24 § 1: A01-A10 |
| ESLint Enforcement | react/no-danger enabled | ✅ | eslint.config.js |
| TypeScript Strict | "strict": true | ✅ | tsconfig.json |
| Input Validation | Zod or equivalent | ✅ | 30+ schemas |
| Security Tests | >20 test files | ✅ | xss/csrf/injection |
| Dependency Audit | No high/critical CVEs | ✅ | pnpm audit: 0 |
| Pre-commit Hooks | Lint + typecheck | ✅ | Husky configured |

### Recommendations

**P0 (Immediate)**: None — framework fully compliant

**P1 (Next Sprint)**: Create compliance automation script

**P2 (Next Quarter)**: Expand security training program

### Sign-Off

✅ **AUDIT PASSED** — All 7 phases compliant  
Next audit: [Date + 6 months]
```

---

## Citation Format for Agents

**When citing authority, agents MUST use this format**:

```
OWASP Category: A##:2021 Name (CWE-###)
Authority URL: [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/...)
Reference: § 24 § # (for governance),  § 10 § # (for implementation)
Enforcement: ESLint rule / TypeScript constraint / Test pattern
```

### Examples:

**XSS (OWASP A03)**:
```
OWASP A03:2021 Injection - Cross-Site Scripting (CWE-79)
Authority: [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
Reference: § 10 § 1, DEVELOPER_WORKFLOW.md § XSS Prevention
Enforcement: ESLint react/no-danger rule + DOMPurify pattern
```

**CSRF (OWASP A01)**:
```
OWASP A01:2021 Broken Access Control (CWE-352)
Authority: [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
Reference: § 10 § 5, DEVELOPER_WORKFLOW.md § CSRF Protection
Enforcement: CSRF token validation + secure cookie headers
```

**Input Validation (OWASP A08)**:
```
OWASP A08:2021 Software & Data Integrity Failures (CWE-1025)
Authority: [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
Reference: § 10 § 2, DEVELOPER_WORKFLOW.md § Input Validation
Enforcement: Zod schema validation + TypeScript strict mode
```

---

## Escalation & Uncertainty

**When Agent Is Uncertain**:

1. **About OWASP category?**
   → Check [§ 24 § 1 OWASP Top 10 2021 Mapping](../../instructions/24-security-governance.md)

2. **About implementation pattern?**
   → Check [DEVELOPER_WORKFLOW.md](DEVELOPER_WORKFLOW.md) sections 1-5

3. **About code review?**
   → Check [REVIEWER_WORKFLOW.md](REVIEWER_WORKFLOW.md) checklist

4. **About compliance?**
   → Check [AUDITOR_WORKFLOW.md](AUDITOR_WORKFLOW.md) phases

5. **About authority source?**
   → Check [§ 24 § 2 Authoritative Sources](../../instructions/24-security-governance.md)

6. **Still uncertain?**
   → Ask human expert; never guess on security

**When Agent Should Ask Clarifying Questions**:

- "Which OWASP category does this address?" (if user didn't specify)
- "Is this user-facing or backend?" (changes enforcement approach)
- "Do you want complete code pattern or conceptual explanation?" (adjusts detail level)
- "Should I focus on new implementation or code review?" (different workflows)

---

## Summary: Agent Security Workflow

**The Agent Security Workflow**:

1. **Identify the security concern** → Which OWASP category?
2. **Load the appropriate workflow** → Developer / Reviewer / Auditor
3. **Find the matching section** → XSS / CSRF / Input Validation / etc.
4. **Cite authority** → OWASP + CWE + URL
5. **Provide complete pattern** → Code or checklist
6. **Explain enforcement** → ESLint / TypeScript / tests / pnpm scripts
7. **If uncertain** → Ask human expert, never guess

**Workflows at a Glance**:

| Role | Workflow | Trigger | Output |
|------|----------|---------|--------|
| Developer | DEVELOPER_WORKFLOW.md | "How do I implement X?" | Complete code pattern + tests |
| Reviewer | REVIEWER_WORKFLOW.md | "Review this for security" | Approval or specific change requests |
| Auditor | AUDITOR_WORKFLOW.md | "Are we compliant?" | Compliance matrix + recommendations |
| Teaching | All three | "Show me best practices" | Pattern + authority + enforcement |

**Key Rule**: Authority first. Always cite OWASP/CWE before implementation. When in doubt, escalate to human expert.
