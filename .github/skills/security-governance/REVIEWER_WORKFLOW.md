# Security Governance - Reviewer Workflow

## Your Role

You are verifying that security code:
1. ✅ Follows OWASP standards (authority-first)
2. ✅ Passes ESLint + TypeScript (enforcement-verified)
3. ✅ Includes adequate tests (attack scenarios covered)
4. ✅ Cites authoritative sources (traceability preserved)
5. ✅ Doesn't bypass architecture (minimal edits, no shortcuts)

---

## Pre-Review Checklist

Before reviewing security changes:

### Step 1: Understand the Risk

**Question**: What is the security risk being addressed?

- Read PR title and description
- Identify OWASP category (A01-A10) from PR or from code
- Check [§ 24 Security Governance](../../instructions/24-security-governance.md) for that category
- Example: "XSS prevention" → OWASP A03:2021 (CWE-79)

### Step 2: Verify Authority

**Question**: Is this aligned with OWASP/MDN/CWE standards?

- [ ] PR mentions OWASP category or CWE number
- [ ] Authority link included (OWASP Cheat Sheet or MDN doc)
- [ ] Link is to official source (not blog post or Stack Overflow)
- [ ] If uncertain, check [§ 24 § 2 Authoritative Sources](../../instructions/24-security-governance.md)

**Red Flag** ⚠️: PR says "I added security" but no OWASP/CWE reference → Request authority citation

### Step 3: Check Enforcement

**Question**: Will this be enforced on every commit?

- [ ] ESLint rule exists (e.g., react/no-danger)
- [ ] Rule is enabled in `.eslintrc` / `eslint.config.js`
- [ ] PR shows `pnpm lint` passing
- [ ] TypeScript strict mode catching type errors

**Red Flag** ⚠️: "Manual review only" without lint rule → Not scalable, request ESLint addition

### Step 4: Verify Tests

**Question**: Is the attack scenario actually tested?

- [ ] Unit tests cover normal flow
- [ ] Integration tests cover attack scenario
- [ ] Test names indicate what they prevent (e.g., "blocks XSS injection")
- [ ] PR shows `pnpm test` passing
- [ ] Edge cases tested (boundary conditions, invalid input)

**Red Flag** ⚠️: No tests for the attack → Request test coverage before approving

---

## Security Review Checklist by OWASP Category

### A01:2021 - Broken Access Control (CWE-284, 352, 601)

**What to Check**:
- [ ] CSRF token generated on page load
- [ ] CSRF token validated for state-changing requests (POST, PUT, DELETE)
- [ ] Token is unique per session (not reused)
- [ ] Token not in query string (in header or hidden form field only)
- [ ] Backend validates token before processing request
- [ ] Test verifies invalid token is rejected

**Authority**: [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

**Code Pattern**:
```typescript
// Check for: CSRF token in X-CSRF-Token header
headers: { 'X-CSRF-Token': csrfToken }

// Check for: Validation on backend
if (req.headers['x-csrf-token'] !== req.session.csrfToken) {
  res.status(403).json({ error: 'CSRF token invalid' })
}
```

---

### A02:2021 - Cryptographic Failures (CWE-327, 798)

**What to Check**:
- [ ] No hard-coded secrets in code
- [ ] API keys in environment variables only
- [ ] `.env.local` is in `.gitignore`
- [ ] Private keys never committed
- [ ] Secrets not logged (check console.log statements)
- [ ] Test verifies secrets are not exposed in error messages

**Authority**: [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

**Code Pattern**:
```typescript
// ✅ GOOD: Environment variable
const API_KEY = import.meta.env.VITE_PUBLIC_API_KEY

// ❌ BAD: Hard-coded
const API_KEY = 'sk-1234567890abc'

// ❌ BAD: Logged
console.log('API Key:', API_KEY)

// ✅ GOOD: Not logged
logger.info('Connecting to API')
```

**Questions to Ask**:
- "Is this API key hard-coded?" → Request use of environment variables
- "Could this secret appear in logs?" → Request removal of logging

---

### A03:2021 - Injection (CWE-79, 89, 1333)

**What to Check**:

#### XSS Prevention (CWE-79)

- [ ] No `dangerouslySetInnerHTML` without DOMPurify
- [ ] If DOMPurify used, code review comment explains why
- [ ] User input not rendered without escaping
- [ ] React auto-escaping used by default
- [ ] ESLint rule `react/no-danger` passes
- [ ] Test verifies XSS payload is blocked

**Authority**: [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

**Code Pattern**:
```typescript
// ✅ GOOD: React auto-escapes
<div>{userInput}</div>

// ✅ IF NEEDED: DOMPurify with comment
// Prevents: OWASP A03:2021 Injection (XSS), CWE-79
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />

// ❌ BAD: dangerouslySetInnerHTML without DOMPurify
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

#### SQL Injection (CWE-89)

- [ ] Parameterized queries used (never string concatenation)
- [ ] ORM or query builder with prepared statements
- [ ] User input never interpolated into SQL string

**Code Pattern**:
```typescript
// ✅ GOOD: Parameterized query
db.query('SELECT * FROM users WHERE id = ?', [userId])

// ❌ BAD: String concatenation
db.query(`SELECT * FROM users WHERE id = ${userId}`)
```

---

### A08:2021 - Software & Data Integrity (CWE-1025)

**What to Check**:
- [ ] Input validation with Zod or equivalent
- [ ] Schema defines boundaries (min/max, allowed values)
- [ ] Invalid input rejected with error message
- [ ] Error message does NOT reveal system details
- [ ] Test verifies invalid input is rejected
- [ ] Boundary conditions tested (0, -1, max value)

**Authority**: [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

**Code Pattern**:
```typescript
// ✅ GOOD: Zod schema with validation
const MoveSchema = z.object({
  row: z.number().int().min(0).max(2),
  col: z.number().int().min(0).max(2),
})

try {
  MoveSchema.parse(userInput)
} catch (error) {
  // ✅ Error message is safe (no system details)
  res.status(400).json({ error: 'Invalid move' })
}
```

---

### A10:2021 - SSRF (CWE-918)

**What to Check**:
- [ ] URL input is validated (not any URL allowed)
- [ ] Protocol whitelist (only http/https, no file://)
- [ ] Domain whitelist (if applicable)
- [ ] URL constructor used to parse (catches malformed URLs)
- [ ] Test verifies dangerous protocols are rejected

**Authority**: [OWASP SSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server-Side_Request_Forgery_Prevention_Cheat_Sheet.html)

**Code Pattern**:
```typescript
// ✅ GOOD: URL validation with whitelist
const validateUrl = (input: string): URL => {
  const url = new URL(input)  // Throws if invalid
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only http/https allowed')
  }
  if (!['example.com', 'api.example.com'].includes(url.hostname)) {
    throw new Error('Domain not whitelisted')
  }
  return url
}

// ❌ BAD: No validation
fetch(userProvidedUrl)

// ❌ BAD: Protocol not checked
const url = new URL(input)  // Could be file://
```

---

## Security Testing Verification

**Question**: Are the tests actually testing the attack?

### For XSS Tests
```typescript
// ✅ GOOD: Tests the attack scenario
it('blocks XSS payload injection', () => {
  const xssPayload = '<img src=x onerror=alert()>'
  const sanitized = DOMPurify.sanitize(xssPayload)
  expect(sanitized).not.toContain('onerror')
})

// ❌ BAD: Only tests normal input
it('renders user content', () => {
  expect(render(<Component content="Hello" />)).toBeInTheDocument()
})
```

### For CSRF Tests
```typescript
// ✅ GOOD: Tests the attack scenario
it('rejects request with invalid CSRF token', async () => {
  const response = await fetch('/api/moves', {
    method: 'POST',
    headers: { 'X-CSRF-Token': 'wrong_token' },
    body: JSON.stringify({ move: 1 }),
  })
  expect(response.status).toBe(403)
})

// ❌ BAD: Only tests valid token
it('accepts request with valid CSRF token', () => {
  // ...
})
```

### For Input Validation Tests
```typescript
// ✅ GOOD: Tests boundary and invalid input
it('rejects out-of-bounds row', () => {
  expect(() => parseMove({ row: 9, col: 0 })).toThrow()
})

it('rejects non-numeric input', () => {
  expect(() => parseMove({ row: 'a', col: 'b' })).toThrow()
})

// ❌ BAD: Only tests valid input
it('accepts valid move', () => {
  expect(parseMove({ row: 0, col: 0 })).toEqual({ row: 0, col: 0 })
})
```

---

## Common Issues & What to Request

| Issue | What to Request | Authority |
|-------|--|---|
| **"I added security"** without OWASP/CWE | Request OWASP category + CWE + authority link | [§ 24 § 2](../../instructions/24-security-governance.md) |
| **No ESLint enforcement** | Request ESLint rule or lint rule enhancement | [§ 10 § 1](../../instructions/10-security.instructions.md) |
| **No security tests** (only happy path) | Request tests for attack scenarios + boundary conditions | [§ 10 § 6 Testing Checklist](../../instructions/10-security.instructions.md) |
| **dangerouslySetInnerHTML without DOMPurify** | Request DOMPurify or removal | [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) |
| **No input validation** | Request Zod schema or validation library | [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) |
| **Secrets in code** | Request .env.local or environment variables | [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) |
| **CSRF token not validated** | Request backend validation of CSRF token | [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) |
| **Error message reveals system details** | Request generic error message | [OWASP Error Handling](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html) |

---

## PR Approval Criteria

**You CAN approve if**:
- [ ] OWASP category documented (A01-A10)
- [ ] Authority reference provided (OWASP/MDN/CWE link)
- [ ] ESLint rule passes (`pnpm lint`)
- [ ] TypeScript strict mode passes (`pnpm typecheck`)
- [ ] Security tests added (attack scenarios + boundary conditions)
- [ ] `pnpm test` shows all tests passing
- [ ] No hard-coded secrets
- [ ] No dangerous patterns detected
- [ ] Minimal edits (no unnecessary refactoring)
- [ ] All governance checklists satisfied

**You MUST REQUEST CHANGES if**:
- ❌ No OWASP/CWE reference
- ❌ ESLint doesn't pass
- ❌ TypeScript errors present
- ❌ No security tests (or only happy path)
- ❌ Secrets in code
- ❌ Hard-coded validation or magic strings
- ❌ Unnecessary architecture changes
- ❌ Large rewrites when minimal edits would work

---

## PR Comment Template

Use this template for your review comment:

```markdown
## Security Review

**OWASP Category**: A03:2021 Injection (CWE-79)  
**Authority**: [OWASP XSS Prevention](URL)  
**Enforcement**: react/no-danger ESLint rule

**Pre-Commit Checks**:
- [x] `pnpm lint` passes
- [x] `pnpm typecheck` passes
- [x] Security tests present + passing
- [x] No secrets committed

**Test Coverage**:
- [x] Normal flow: User content renders
- [x] Attack scenario: XSS payload blocked
- [x] Boundary: Empty string handled

**Questions for Author**:
1. Why is `dangerouslySetInnerHTML` necessary here?
2. Have you considered using React auto-escaping instead?
3. Can DOMPurify configuration be tightened further?

**Approved** ✅ — All checks passed, security tests comprehensive
```

---

## When You Need Help

**Question**: "Is this pattern secure?"
→ Check [§ 10 Security Instructions](../../instructions/10-security.instructions.md) sections 1-6

**Question**: "What OWASP category is this?"
→ Check [§ 24 § 1 OWASP Top 10 2021 Mapping](../../instructions/24-security-governance.md)

**Question**: "What's the authority for this rule?"
→ Check [§ 24 § 2 Authoritative Sources](../../instructions/24-security-governance.md)

**Question**: "Should this have an ESLint rule?"
→ Check [§ 10 § 1 ESLint Enforcement](../../instructions/10-security.instructions.md)

---

## Summary

**The Code Review Workflow**:
1. ✅ **Understand Risk** — Identify OWASP category
2. ✅ **Verify Authority** — Check OWASP/MDN/CWE reference
3. ✅ **Check Enforcement** — ESLint rule passes
4. ✅ **Verify Tests** — Attack scenarios tested
5. ✅ **Approve** — All criteria met, no blockers
