# 🔐 Security Governance

> **Authority**: `AGENTS.md` § 0 (Non-Negotiable Rules), § 24 (Security Governance & Authoritative Sources)  
> **Primary Reference**: [§ 24 Security Governance & Authoritative Sources](.github/instructions/24-security-governance.md) — Comprehensive security standards with 40+ authoritative sources (OWASP, MDN, CWE/CVE, official tech docs)  
> **BASELINE**: Before touching security code, read `AGENTS.md` § 0. No shortcuts. Minimal edits. Quality gates mandatory.  
> **Scope**: XSS prevention, input sanitization, secrets management, CSP, CSRF/session hardening, dependency security

---

## 1. ESLint Enforcement

ESLint security rules (`eslint-plugin-plugin-security`) automatically catch many vulnerabilities.

**Authority**: [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security), [React Docs Security](https://react.dev/learn/security)

### Rule: react/no-danger (Error)

**Prevents**: OWASP A03:2021 Injection (XSS), CWE-79 Cross-site Scripting

```tsx
// ❌ FORBIDDEN: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ SAFE: React escapes by default
<div>{userContent}</div>

// ✅ SAFE IF NECESSARY: Use DOMPurify
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

**Citation**: [React dangerouslySetInnerHTML](https://react.dev/reference/react-dom/dangerouslySetInnerHTML), [MDN XSS Prevention](https://developer.mozilla.org/en-US/docs/Glossary/Cross_site_scripting_(XSS))

### Rule: security/detect-unsafe-regex (Error)

**Prevents**: Regular Expression Denial of Service (ReDoS), CWE-1333 Inefficient Regular Expression

```typescript
// ❌ FORBIDDEN: Regex DoS vulnerability (exponential backtracking)
const regex = /(a+)+$/ // Matches "aaaaaaaaaaaaaaaaaaaaab" — locks up!

// ✅ SAFE: No exponential patterns
const regex = /^[a-z]+$/
```

**Citation**: [OWASP ReDoS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Regular_Expression_Denial_of_Service_Prevention_Cheat_Sheet.html)

### Rule: security/detect-unvalidated-redirect (Error)

**Prevents**: OWASP A01:2021 Broken Access Control, A10:2021 SSRF, CWE-601 URL Redirection

```tsx
// ❌ FORBIDDEN: User input controls redirect
window.location = userProvidedUrl

// ✅ SAFE: Whitelist URLs
const ALLOWED_URLS = ['/', '/game', '/about']
if (ALLOWED_URLS.includes(url)) {
  window.location = url
}
```

**Citation**: [OWASP Unvalidated Redirects](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)

---

## 2. Input Sanitization

**Authority**: [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html), [MDN JavaScript Security](https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Validating_forms)

### Rule: Always Escape User Input (React Default)

**Prevents**: OWASP A03:2021 Injection (XSS), CWE-79

```tsx
// ✅ SAFE: React escapes all string interpolation by default
const username = props.username
<div>{username}</div>  // "<script>alert('xss')</script>" → safe text

// ❌ UNSAFE: Direct innerHTML (never do this)
element.innerHTML = userInput  // XSS vulnerability!

// ✅ SAFE: Use React, not DOM APIs
<div data-value={userInput}>{user}</div>
```

**Citation**: [React Auto-escaping](https://react.dev/learn/security#how-to-prevent-an-xss-attack), [MDN HTML Escaping](https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Validating_forms)

### Rule: Validate URLs (Whitelist + Protocol Check)

**Prevents**: OWASP A10:2021 SSRF, Open Redirects (CWE-601)

```tsx
// ❌ UNSAFE: User URL without validation
<a href={userProvidedUrl}>Click</a>

// ✅ SAFE: Use URL constructor + protocol check
const isSafeUrl = (url: string) => {
  try {
    const u = new URL(url, window.location.href)
    // Only allow http/https, not javascript: or data:
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

if (isSafeUrl(url)) {
  <a href={url}>Click</a>
}
```

**Citation**: [MDN URL Constructor](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL), [OWASP Unvalidated Redirects](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)

### Rule: JSON.parse() — Validate Schema First

**Prevents**: OWASP A08:2021 Software & Data Integrity (Prototype Pollution, CWE-1025)

```typescript
// ❌ RISKY: Parsing untrusted JSON without validation
const data = JSON.parse(userInput)

// ✅ SAFE: Use Zod schema validation
import { z } from 'zod'
const schema = z.object({
  name: z.string(),
  score: z.number().min(0).max(9999),
})
const data = schema.parse(JSON.parse(userInput)) // Throws ZodError if invalid
```

**Citation**: [Zod Documentation](https://zod.dev/), [OWASP Type Safety](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

---

## 3. Secrets Management

**Authority**: [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html), [MDN Passwords](https://developer.mozilla.org/en-US/docs/Web/Security/Passwords), [Vite Security Guide](https://vitejs.dev/guide/ssr.html#security-considerations)

**Prevents**: OWASP A02:2021 Cryptographic Failures, CWE-798 Use of Hard-Coded Credentials

### Rule: No API Keys in Source Code

```typescript
// ❌ FORBIDDEN: Hard-coded secrets
const API_KEY = 'sk-1234567890abcdef'
const DATABASE_URL = 'postgres://user:pass@host/db'

// ✅ SAFE: Environment variables only
const API_KEY = import.meta.env.VITE_API_KEY
const DB_URL = process.env.DATABASE_URL  // Backend only
```

**Key Rule**: Only `VITE_*` prefixed variables are exposed to browser (all are public).

### Rule: .env.local Gitignored (Already Done)

```bash
# .gitignore (verified in this repo)
.env.local
.env.*.local
.env.production.local
```

**Enforcement**: Pre-commit hook prevents `.env.local` commits.

### Accessing Public Environment Variables:

```typescript
// .env / .env.development / .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_APP_VERSION=1.0.0

// src/config.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '0.0.0'
```

**Citation**: [Vite Env Variables](https://vitejs.dev/guide/env-and-modes.html), [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## 4. Content Security Policy (CSP) & Security Headers

**Authority**: [MDN Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), [OWASP Secure Headers Project](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Headers_Cheat_Sheet.html), [MDN HTTP Headers Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)

**Prevents**: OWASP A03:2021 Injection (XSS), A01:2021 Broken Access Control (Clickjacking)

### Recommended CSP Header (for deployed app):

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

**Key Directives**:
- `default-src 'self'` — Only allow same-origin by default
- `script-src 'self' 'wasm-unsafe-eval'` — JS + WASM, no external scripts
- `frame-ancestors 'none'` — Prevents clickjacking (embed in iframes)
- `object-src 'none'` — Disables Flash, Java, Silverlight plugins
- `form-action 'self'` — Forms submit only to same origin

**Deployment Note**: Set via server headers (Electron, Capacitor, or backend).

### For Electron:

```javascript
// apps/<game-app>/electron/main.js
mainWindow.webPreferences = {
  preload: path.join(__dirname, 'preload.js'),
  sandbox: true,
  contextIsolation: true,
}
```

**Citation**: [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), [OWASP Secure Headers](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Headers_Cheat_Sheet.html)

---

## 5. CSRF & Session Cookie Hardening

**Authority**: [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), [MDN Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

**Prevents**: OWASP A01:2021 Broken Access Control (CSRF), Session hijacking (CWE-352, CWE-384)

### Rule: Protect State-Changing Requests from CSRF

All backend `POST`, `PUT`, `PATCH`, and `DELETE` routes must be protected against CSRF.

**Recommended Backend Controls**:

- ✅ CSRF token verification for authenticated state-changing endpoints
- ✅ Strict `Origin` / `Referer` header validation for browser requests
- ✅ `SameSite` cookie strategy (`Lax` or `Strict` preferred)

### Rule: Use HttpOnly Cookies for Sensitive Tokens

**Never** store authentication/session tokens in `localStorage` or `sessionStorage`.

**Required Flags** (for session/auth cookies):

```
Set-Cookie: sessionId=abc123; 
  HttpOnly;        # Prevents JavaScript theft (XSS safe)
  Secure;          # HTTPS only (prevents MitM)
  SameSite=Strict; # Prevents CSRF (best) or SameSite=Lax (compatible)
  Max-Age=3600;    # 1 hour expiry (limits exposure)
  Path=/;          # Root path
  Domain=.example.com; # Specify domain
```

**If short-lived tokens needed in browser**: Keep lifetime **minimal** (< 5 minutes) and enforce backend rotation/revocation.

**Citation**: [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), [MDN Cookie Attributes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_where_cookies_are_sent)

## 6. CSP Hardening Addendum

**Authority**: [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), [OWASP Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

Use this tighter baseline where compatible with runtime requirements:

```text
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

**Operational Guidance**:

- Start with `Content-Security-Policy-Report-Only` in staging to detect breaks
- Remove unnecessary allowances over time (e.g., reduce `'unsafe-inline'` scope)
- Keep CSP policy in version control and review alongside security changes
- Monitor CSP violation reports in production

---

## 7. Additional Security Measures

### TypeScript Strictness

**Authority**: [TypeScript Handbook: Strict Mode](https://www.typescriptlang.org/tsconfig#strict), [AGENTS.md § 0 (Type Safety)](https://github.com/game-platform/AGENTS.md)

**Enforce** via `pnpm typecheck`:
- `no-any` — Prevents bypassing type system
- `no-unsafe-*` — Prevents unsafe type operations
- `strictNullChecks` — Prevents null/undefined bugs

### ESLint Plugin Versions

**Verified Installed**:
- `eslint-plugin-security` v4.0.0+
- `@typescript-eslint/eslint-plugin` v8.57.0+
- `eslint-plugin-react` v7.x

Run `pnpm list eslint-plugin-* @typescript-eslint/` to verify.

### Dependency Audit

**Authority**: [npm audit Documentation](https://docs.npmjs.com/cli/v11/commands/npm-audit), [pnpm Security](https://pnpm.io/security)

Run `pnpm audit` before shipping. Block high/critical CVEs.

**pnpm overrides** for known CVE patches:
- `lodash` ≥4.17.21 (prototype pollution fixes)
- `tmp` ≥0.2.2 (secure temp file creation)
- `three` ≥0.125.0 (3D rendering security)

---

## Testing Checklist (Comprehensive)

## Testing Checklist (Comprehensive)

**Authority**: [AGENTS.md § 28 (Testing Governance)](AGENTS.md), [Playwright Security Testing](https://playwright.dev/), [Lighthouse Security Audit](https://developers.google.com/web/tools/lighthouse)

**Pre-Commit Requirements**:

- [ ] `pnpm lint` passes — No ESLint security errors
- [ ] `pnpm typecheck` passes — No `any` types, strict TypeScript
- [ ] All input validated — Zod schemas or equivalent validation for external data
- [ ] No secrets committed — `.env.local` excluded, verified in `.gitignore`
- [ ] `dangerouslySetInnerHTML` reviewed — Only with DOMPurify + code review comment
- [ ] No hard-coded secrets — API keys not in code, only in `VITE_*` env vars (which are public)
- [ ] CSRF protection enabled — Backend validates tokens for state changes
- [ ] Cookies secure — `HttpOnly`, `Secure`, `SameSite` flags set
- [ ] Error messages safe — No stack traces or sensitive info in UI errors
- [ ] Dependencies audited — `pnpm audit` passes, no high/critical CVEs

**Integration Tests** (Playwright/Jest):

- [ ] XSS prevention — `dangerouslySetInnerHTML` blocked, React escaping verified
- [ ] Input validation — Invalid moves rejected with Zod schema
- [ ] URL validation — Only whitelisted URLs allowed in redirects
- [ ] CSRF token workflow — Token generated, validated, refreshed correctly
- [ ] Session recovery — Cookie persists across page reload with correct flags

**Cross-Reference**:

- Full security governance model: [AGENTS.md § 24 - Security Governance & Authoritative Sources](.github/instructions/24-security-governance.md)
- ESLint rule details: [ESLint Security Plugin](https://github.com/eslint-community/eslint-plugin-security)
- OWASP standards: [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
