# § 24. Security Governance & Authoritative Sources (MANDATORY)

**Authority**: AGENTS.md § 0 (Non-Negotiable Rules), AGENTS.md § 22 (Dependency Governance), AGENTS.md § 28 (Testing)
**Primary Source**: OWASP, MDN Web Security, Official TypeScript/React/Node.js Documentation
**Scope**: All game-platform applications, all developers, all CI/CD pipelines
**Enforcement**: ESLint security rules, TypeScript strictness, pre-commit hooks, quality gates

---

## Introduction

Security is not optional. This section connects **authoritative security sources** (OWASP, MDN, CWE/CVE standards, official tech docs) to **executable governance** (ESLint rules, TypeScript enforcement, quality gates, testing).

Every rule here references official sources so you can:
- Verify compliance against industry standards
- Audit your codebase against OWASP Top 10, CWE-25 Most Dangerous Software Weaknesses, CVSS scoring
- Trace each lint rule to specific vulnerability categories
- Prove compliance to security stakeholders

---

## Part 1: Governance Model

### Security Pyramid (Defense in Depth)

```
┌───────────────────────────────────────────────────────────┐
│ 1. Dependency & Supply Chain Security                     │
│    (pnpm, audit, SLSA, OSSF Scorecard)                    │
├───────────────────────────────────────────────────────────┤
│ 2. TypeScript Strictness & Type Safety                    │
│    (no-any, no-unsafe-*, strictness levels)               │
├───────────────────────────────────────────────────────────┤
│ 3. Input Validation & Output Encoding                     │
│    (Zod schemas, HTML escape, CSP, X-Frame-Options)       │
├───────────────────────────────────────────────────────────┤
│ 4. Authentication & Authorization (RBS)                   │
│    (Role-Based Security, permission checks, audit logs)   │
├───────────────────────────────────────────────────────────┤
│ 5. Data Integrity & Secrets Management                    │
│    (.env isolation, HttpOnly cookies, Secure flag)        │
├───────────────────────────────────────────────────────────┤
│ 6. Testing & Validation                                   │
│    (Unit/E2E/Security tests, Lighthouse audit)            │
└───────────────────────────────────────────────────────────┘
```

### OWASP Top 10 Mapping (2021)

| OWASP Risk | Game-Platform Relevance | Enforcement | ESLint Rule |
|---|---|---|---|
| **A01:2021 Broken Access Control** | Role-based access, state mutation guards | `§ 10 RBS + § 23 POLP` | `eslint-plugin-security/detect-unvalidated-redirect` |
| **A02:2021 Cryptographic Failures** | Secrets in .env, localStorage sensitivity | `pnpm audit`, `.npmrc`, overrides | N/A (infra-level) |
| **A03:2021 Injection** | XSS, SQL (N/A), template injection | Input sanitization, CSP | `security/detect-unsafe-regex`, `react/no-danger` |
| **A04:2021 Insecure Design** | Game rules enforcement, state machine design | `src/domain/rules.ts` + tests | No specific rule (design review) |
| **A05:2021 Security Misconfiguration** | CORS, CSP headers, Content-Type, X-Frame-Options | `.github/instructions/24-security-governance.md § HTTP Headers` | N/A (deployment) |
| **A06:2021 Vulnerable & Outdated Components** | Dependency updates, known CVEs, SLSA | `pnpm audit --recursive`, overrides | N/A (pnpm-check-updates) |
| **A07:2021 Authentication & Session Management** | HttpOnly, Secure, SameSite cookies, session timeouts | `.github/instructions/10-security.instructions.md § Cookies` | N/A (server-side) |
| **A08:2021 Software & Data Integrity Failures** | Untrusted dependencies, WASM sandbox, worker isolation | `AGENT.md § 22 (dependency overrides)` | N/A (architectural) |
| **A09:2021 Logging & Monitoring Gaps** | Error handling, security events, audit trails | `.github/instructions/12-error-handling.md` | No specific rule |
| **A10:2021 Server-Side Request Forgery (SSRF)** | Redirect validation, URL validation | URL parsing with Zod schema | `security/detect-unvalidated-redirect` |

---

## Part 2: Authoritative Sources (Verified & Linked)

### OWASP Resources

| Resource | URL | Applies To | Game-Platform Mapping |
|---|---|---|---|
| **OWASP Top 10** | https://owasp.org/www-project-top-ten/ | All web apps | § 24 Table 1 above |
| **OWASP XSS Prevention** | https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html | React components, CSP | `react/no-danger`, inline sanitization |
| **OWASP Input Validation** | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html | All user input (forms, URLs, JSON) | Zod schemas, regex safety |
| **OWASP Authentication** | https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html | Session management, token handling | HttpOnly, Secure, SameSite flags |
| **OWASP Authorization** | https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html | Role-based security, permission checks | § 23 RBS (AGENTS.md) |
| **OWASP Node.js Security** | https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html | Express backends (if present), Node.js runtime | Environment isolation, strict mode |
| **OWASP CSRF Prevention** | https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html | Form submissions, API calls | SameSite=Strict, token validation |
| **OWASP Secure Headers** | https://cheatsheetseries.owasp.org/cheatsheets/Secure_Headers_Cheat_Sheet.html | HTTP response headers | CSP, X-Frame-Options, X-Content-Type-Options |
| **OWASP Denial of Service** | https://owasp.org/www-community/attacks/Denial_of_Service | Rate limiting, resource validation | Performance monitoring, timeouts |

### MDN Web Security

| Resource | URL | Applies To | Implementation |
|---|---|---|---|
| **MDN Web Security** | https://developer.mozilla.org/en-US/docs/Web/Security | General security principles | Baseline for all frontend work |
| **MDN XSS Prevention** | https://developer.mozilla.org/en-US/docs/Glossary/Cross_site_scripting_(XSS) | React rendering | `react/no-danger` enforcement |
| **MDN Content Security Policy** | https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP | HTTP headers, inline scripts | CSP directives: `script-src 'self' 'wasm-unsafe-eval'` |
| **MDN Trusted Types** | https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API | Preventing XSS in DOM sinks | TypeScript strict types + no-any |
| **MDN HTTP Headers** | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers | Response security headers | Deployment-level enforcement |
| **MDN CORS** | https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS | Cross-origin resource sharing | Server configuration |
| **MDN Cookies** | https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies | Session management | HttpOnly, Secure, SameSite flags |
| **MDN JavaScript Security** | https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site | JavaScript-specific vulnerabilities | Input validation, eval() avoidance |

### Official Technology Documentation

| Technology | Resource | Security Guidance | Game-Platform Use |
|---|---|---|---|
| **TypeScript** | https://www.typescriptlang.org/docs/handbook/2/narrowing.html | Type narrowing, strict mode | `tsconfig.json` strict=true |
| **React** | https://react.dev/learn/security | XSS prevention, dangerouslySetInnerHTML | Auto-escaping, HTML sanitization |
| **React Docs Security** | https://react.dev/reference/react-dom/createRoot#handling-rendering-errors | Error boundaries | Error handling without exposing internals |
| **Vite** | https://vitejs.dev/guide/ssr.html#security-considerations | Environment variable exposure | Prevent VITE_* leakage |
| **ESLint Security Plugin** | https://github.com/eslint-community/eslint-plugin-security | Security-focused lint rules | Installed: v4.0.0 |
| **TypeScript-ESLint** | https://typescript-eslint.io/rules/ | Type safety rules | Installed: v8.57.0 |
| **Node.js Security** | https://nodejs.org/en/docs/guides/nodejs-security/ | Node.js best practices | Applies if backend exists |
| **Express.js Security** | https://expressjs.com/en/advanced/best-practice-security.html | Express-specific threats | Applies if Express used |

### CWE/CVE Standards

| Standard | URL | Relevance | Example |
|---|---|---|---|
| **CWE-25 Dangerous Software Weaknesses** | https://cwe.mitre.org/top25/ | Top 25 vulnerability types | XSS (CWE-79), Injection (CWE-89) |
| **CWE-79: Cross-site Scripting** | https://cwe.mitre.org/data/definitions/79.html | XSS prevention | Improper output encoding |
| **CWE-89: SQL Injection** | https://cwe.mitre.org/data/definitions/89.html | Not applicable (no SQL in frontend) | N/A for game-platform |
| **CWE-434: Unrestricted Upload** | https://cwe.mitre.org/data/definitions/434.html | File upload handling | Not applicable (no uploads) |
| **CWE-1021: Improper Restriction of Rendered UI Layers** | https://cwe.mitre.org/data/definitions/1021.html | Clickjacking, frame embedding | X-Frame-Options: DENY |
| **CVSS Calculator** | https://www.first.org/cvss/calculator/3.1 | Vulnerability scoring | Audit dependencies against scores |

### Supply Chain & Dependency Security

| Resource | URL | Purpose | Game-Platform Integration |
|---|---|---|---|
| **SLSA Framework** | https://slsa.dev/ | Supply chain security levels | `AGENTS.md § 22` dependency governance |
| **OSSF Scorecard** | https://github.com/ossf/scorecard | Open Source Security Foundation assessment | Audit critical dependencies |
| **npm Security** | https://docs.npmjs.com/cli/v11/commands/npm-audit | npm audit command | Use `pnpm audit` equivalent |
| **pnpm Security** | https://pnpm.io/security | pnpm lock file integrity | Enforce `pnpm-lock.yaml` integrity |
| **Dependabot** | https://github.blog/2020-12-16-dependabot-now-updates-your-dependencies/ | Automated dependency updates | Enable in GitHub Actions if used |
| **SBOM (Software Bill of Materials)** | https://www.ntia.gov/report/2021/minimum-elements-software-bill-materials-sbom | Component tracking | Document critical dependencies |

---

## Part 3: Enforcement Mapping (ESLint → OWASP)

### Installed ESLint Security Plugins

**Version**: eslint-plugin-security v4.0.0

| Rule ID | OWASP Category | Vulnerability | Enforcement |
|---|---|---|---|
| `security/detect-unsafe-regex` | A03:2021 Injection | Regex Denial of Service (ReDoS) | ❌ ERROR on unsafe patterns |
| `security/detect-unvalidated-redirect` | A01:2021 Access Control, A10:2021 SSRF | Open redirects to attacker URLs | ❌ ERROR on unvalidated redirects |
| `security/detect-buffer-noalloc` | A04:2021 Insecure Design | Buffer allocation vulnerabilities | ⚠️ WARN (Node.js specific) |
| `security/detect-non-literal-regexp` | A03:2021 Injection | Regex injection | ⚠️ WARN on dynamic regexes |
| `security/detect-unsafe-json` | A03:2021 Injection | Prototype pollution in JSON | ⚠️ WARN on unsafe JSON parsing |
| `security/detect-unsafe-method` | A01:2021 Access Control | Unsafe DOM methods | ❌ ERROR on innerHTML without validation |

### TypeScript-ESLint Type Safety

| Rule | CWE/Security Concern | Enforcement |
|---|---|---|
| `no-explicit-any` | Bypasses type system, enables exploitation | ❌ ERROR |
| `no-unsafe-assignment` | Assigns untyped values to typed variables | ❌ ERROR |
| `no-unsafe-member-access` | Accesses properties of any-typed objects | ❌ ERROR |
| `no-unsafe-return` | Returns any-typed values from typed functions | ❌ ERROR |
| `strict-boolean-expressions` | Implicit type coercion in conditions | ⚠️ WARN |
| `no-implicit-any-catch` | Catch blocks with implicit any errors | ⚠️ WARN |

### React Security Plugin

| Rule | XSS Prevention | Enforcement |
|---|---|---|
| `react/no-danger` | Prevents dangerouslySetInnerHTML | ❌ ERROR (with justification comment required) |
| `react/no-danger-with-children` | Prevents mixing dangerous HTML + children | ❌ ERROR |
| `react/jsx-no-constructed-context-values` | Prevents accidental context re-renders | ⚠️ WARN |
| `react/no-string-refs` | Prevents deprecated string refs | ⚠️ WARN (legacy) |

---

## Part 4: By-Technology Security Best Practices

### TypeScript Security

**Authority**: https://www.typescriptlang.org/docs/handbook/2/narrowing.html

**Requirements**:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "useDefineForClassFields": true,
    "esModuleInterop": true
  }
}
```

**Enforcement**: `pnpm typecheck` must pass before commit.

**Common Violations**:
- ❌ `const x: any = getValue()` — Use specific type
- ❌ `function handler(event) { ... }` — Annotate `event: React.MouseEvent`
- ❌ `Optional chaining without narrowing` — Use type guards

### React Security

**Authority**: https://react.dev/learn/security

**Requirements**:

| Practice | Rule | Enforcement |
|---|---|---|
| **XSS Prevention** | Never use `dangerouslySetInnerHTML` without DOMPurify | `react/no-danger` ERROR + code review |
| **Output Escaping** | React auto-escapes string values in JSX | Default (no rule needed) |
| **Event Handlers** | Always validate user input before state updates | Manual code review |
| **Context Security** | Don't pass sensitive data via Context (not encrypted) | Manual review |
| **Form Handling** | Validate form inputs before submission | Zod schema validation |

**Pattern - Safe HTML Rendering**:

```tsx
// ❌ BAD
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ GOOD
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />

// ✅ BETTER (for plain text)
<div>{userContent}</div>  // React auto-escapes
```

### Vite Security

**Authority**: https://vitejs.dev/guide/ssr.html#security-considerations

**Requirements**:

| Concern | Mitigation | Enforcement |
|---|---|---|
| **Environment Variable Leakage** | Only expose VITE_* vars (not secrets) | Code review: no VITE_SECRET_KEY |
| **Build Output** | Never commit secrets to dist/ | `.gitignore` + pre-commit hook |
| **Import Analysis** | Use Vite's built-in dependency scanning | `pnpm build` includes warnings |

**Config Pattern**:

```js
// vite.config.js
export default {
  define: {
    // Only expose public build-time vars
    __VITE_PUBLIC_API_URL__: JSON.stringify(process.env.VITE_API_URL),
    // NEVER do: __SECRET__: JSON.stringify(process.env.SECRET_KEY)
  }
}
```

### JavaScript/Node.js Security

**Authority**: https://nodejs.org/en/docs/guides/nodejs-security/

**Requirements** (if Express/Node.js backend exists):

| Threat | Prevention | Enforcement |
|---|---|---|
| **Regular Expression DoS** | Use `safe-regex` library or avoid user input | `security/detect-unsafe-regex` |
| **Prototype Pollution** | Validate object keys, use Object.create(null) | Manual review |
| **REPL Injection** | Never eval() user input | `no-eval` ESLint rule |
| **Environment Leakage** | Isolate .env, never expose to frontend | Review: no process.env in browser code |

### Input Validation

**Authority**: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html

**Enforcement Pattern** (using Zod):

```ts
// src/domain/validators.ts
import { z } from 'zod'

export const MoveSchema = z.object({
  row: z.number().int().min(0).max(2),
  col: z.number().int().min(0).max(2),
})

export const GameStateSchema = z.object({
  board: z.array(z.array(z.enum(['X', 'O', null]))),
  turn: z.enum(['X', 'O']),
})

// Usage in domain logic
export const validateMove = (move: unknown): Move => {
  return MoveSchema.parse(move)  // Throws ZodError if invalid
}
```

**Enforcement**: All external input (forms, API, messages) validated with Zod before state update.

### Secrets & Credentials Management

**Authority**: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html

**Requirements**:

| Item | Storage | Enforcement |
|---|---|---|
| **API Keys** | `.env.local` (gitignored) | Reviewed in `.gitignore` |
| **Passwords** | Never stored in code or localStorage | Code review + semantic search |
| **Auth Tokens** | HttpOnly, Secure, SameSite cookies (server-side) | Server config |
| **Database Credentials** | Environment variables only | Code review |

**Enforcement Script**:

```bash
# .github/workflows/secret-scan.yml
name: Detect Leaked Secrets
on: push
jobs:
  detect-secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: gitleaks/gitleaks-action@v2
```

### Cookie Security

**Authority**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies

**Required Flags** (for authenticated sessions):

```
Set-Cookie: sessionId=abc123; 
  HttpOnly;        # Prevents JavaScript theft
  Secure;          # HTTPS only
  SameSite=Strict; # Prevents CSRF
  Max-Age=3600;    # 1 hour expiry
  Path=/;          # Root path
  Domain=.example.com;
```

**Enforcement**: Server-side validation; code review for localStorage usage.

### Content Security Policy (CSP)

**Authority**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

**Recommended Header**:

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'wasm-unsafe-eval'; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https:; 
  font-src 'self'; 
  connect-src 'self' https://api.example.com; 
  frame-ancestors 'none'; 
  object-src 'none'; 
  base-uri 'self'; 
  form-action 'self'
```

**Enforcement**: Deployment-level (server headers); code review for inline scripts.

### CORS Configuration

**Authority**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

**Enforcement** (if API present):

```ts
// Only allow trusted origins
const ALLOWED_ORIGINS = [
  'https://example.com',
  'https://app.example.com',
]

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,  // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,  // 24 hours
}))
```

**Enforcement**: Code review + server configuration audit.

---

## Part 5: Quality Gates & Automated Enforcement

### Pre-Commit Hook

**Command**: `pnpm fix` (runs automatically via Husky)

**Coverage**:
- ✅ ESLint security rules
- ✅ TypeScript no-any, no-unsafe-*
- ✅ Prettier formatting (reduces attack surface via consistent code)

### Continuous Integration

**Command**: `pnpm validate` (full pre-push gate)

**Coverage**:
- ✅ All ESLint rules (including security)
- ✅ TypeScript strict compilation
- ✅ Vite build (catches import/export security issues)
- ✅ Playwright security tests (if configured)

### Runtime Validation

**Command**: `pnpm test`

**Test Types**:
- ✅ Unit tests for validators (Zod schemas)
- ✅ Integration tests for state mutations (ACID properties)
- ✅ Component tests for XSS prevention (dangerouslySetInnerHTML)
- ✅ E2E tests for authentication flows

---

## Part 6: Compliance Checklist (Before Commit)

- [ ] ESLint passes: `pnpm lint` (no security errors)
- [ ] TypeScript passes: `pnpm typecheck` (no `any` types)
- [ ] All input validated: Zod schemas for external data
- [ ] No secrets committed: Check `.env.local`, `.gitignore`
- [ ] dangerouslySetInnerHTML: Only with DOMPurify + code review
- [ ] Secrets not in env: No API keys in VITE_* vars
- [ ] CSRF tokens: Validated on state mutations
- [ ] Cookies: HttpOnly, Secure, SameSite flags (if server-side)
- [ ] Error messages: No sensitive info in user-facing errors
- [ ] Audit dependencies: `pnpm audit` passes, no high/critical CVEs

---

## Part 7: Reference & Escalation

**Governance Authority**: AGENTS.md § 0 (Non-Negotiable Rules), § 23 (RBS), § 24 (This Section)

**Escalation Path** (if security issue found):
1. Document the vulnerability
2. Assess CVSS score via https://www.first.org/cvss/calculator/3.1
3. Reference relevant OWASP/CWE/CVE
4. Open GitHub Security Advisory (if critical)
5. Notify security team (if exists)

**Audit Trail** (for compliance):
- Git commits reference security fixes with OWASP category
- ESLint violations tracked in CI logs
- Dependency audits run automatically (`pnpm audit`)
- Security tests in `pnpm test` suite

---

## Part 8: Related Governance Documents

| Document | Covers |
|---|---|
| **AGENTS.md § 0** | Non-negotiable self-correction loop for ALL code |
| **AGENTS.md § 23 RBS** | Role-Based Security access control |
| **AGENTS.md § 22** | Dependency governance + supply chain security |
| **AGENTS.md § 28** | Testing standards + security test types |
| **.github/instructions/10-security.instructions.md** | Detailed ESLint enforcement, CSP, CSRF patterns |
| **.github/instructions/12-error-handling.md** | Error handling without leaking sensitive info |
| **CLAUDE.md** | AI assistant security expectations |

---

## Conclusion

Security is enforced at **three layers**:

1. **Static** — TypeScript, ESLint, code review (prevents at write-time)
2. **Runtime** — Input validation, ACID properties, error handling (prevents at run-time)
3. **Deployment** — Headers, CORS, cookies, secrets management (prevents in production)

Every security rule here is **backed by authoritative sources** (OWASP, MDN, CWE, official docs). You can cite them in audits, compliance reviews, and security assessments.

**Enforcement is non-negotiable.** If `pnpm validate` fails for security reasons, the code does not ship.
