# Security Governance - Developer Workflow

## Before You Code

1. **Read the Authority**
  - Read [§ 24 Security Governance](../../instructions/24-security-governance.md) — Authoritative sources (OWASP, MDN, CWE/CVE)
  - Read [§ 10 Security Instructions](../../instructions/10-security.instructions.md) — Implementation patterns for your feature
   - Note the OWASP category and CWE number for your feature

2. **Check Existing Patterns**
   - Search codebase for similar security implementations
   - Reuse validated patterns instead of creating new ones
   - Example: Search for "DOMPurify" or "Zod" usage patterns

3. **Identify Enforcement Mechanism**
   - Determine which ESLint rule applies (e.g., `react/no-danger` for XSS)
   - Verify TypeScript strictness constraints (no-any, strictNullChecks)
   - Note the pnpm script that enforces your rule (`pnpm lint`, `pnpm typecheck`)

---

## Example Workflows by Feature Type

### XSS Prevention (OWASP A03:2021, CWE-79)

**1. Read Authority**
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [§ 10 Security § 1 - ESLint Enforcement](../../instructions/10-security.instructions.md)

**2. Determine Approach**
- React auto-escapes by default → Use `{userInput}` ✅
- If HTML rendering required → Use DOMPurify + review ✅
- Never use `dangerouslySetInnerHTML` without DOMPurify ❌

**3. Implement**
```tsx
// ✅ SAFE: React auto-escapes
<div>{userContent}</div>

// ✅ SAFE IF NECESSARY: DOMPurify
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
  // ⚠️ Add comment: Prevents: OWASP A03:2021 Injection (XSS), CWE-79
```

**4. Validate**
```bash
pnpm lint    # react/no-danger rule checks dangerouslySetInnerHTML
```

**5. Write Test**
```typescript
// xss.prevention.test.tsx
describe('XSS Prevention', () => {
  it('escapes user input by default', () => {
    const { container } = render(<div>{userInput}</div>)
    expect(container.innerHTML).not.toContain('<script>')
  })
  
  it('blocks dangerous content even with DOMPurify', () => {
    const sanitized = DOMPurify.sanitize('<img src=x onerror=alert()>')
    expect(sanitized).not.toContain('onerror')
  })
})
```

**6. Document in PR**
```markdown
**Security Changes**:
- Prevents: OWASP A03:2021 Injection (XSS), CWE-79
- Authority: [OWASP XSS Prevention Cheat Sheet](URL)
- Enforcement: react/no-danger ESLint rule
- Test Coverage: XSS prevention tests in xss.prevention.test.tsx
```

---

### Input Validation (OWASP A03:2021, CWE-89/1025)

**1. Read Authority**
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [§ 10 Security § 2 - Input Sanitization](../../instructions/10-security.instructions.md)

**2. Determine Validation Strategy**
- JSON parsing → Use Zod schema validation
- URL input → Use URL constructor + protocol check
- Game moves → Use TypeScript types + schema validation
- User text → React escaping (XSS prevention)

**3. Implement**
```typescript
import { z } from 'zod'

// Define schema for game move
const MoveSchema = z.object({
  row: z.number().int().min(0).max(2),
  col: z.number().int().min(0).max(2),
})

export type Move = z.infer<typeof MoveSchema>

// Validate untrusted input
export const parseMove = (input: unknown): Move => {
  try {
    return MoveSchema.parse(input)
  } catch (error) {
    // Error has validation details, never expose to user
    console.error('Invalid move:', error)
    throw new Error('Invalid move format')
  }
}
```

**4. Validate**
```bash
pnpm typecheck  # TypeScript validates Move type usage
pnpm lint       # ESLint checks input validation patterns
```

**5. Write Test**
```typescript
describe('Input Validation', () => {
  it('accepts valid moves', () => {
    const move = parseMove({ row: 0, col: 1 })
    expect(move).toEqual({ row: 0, col: 1 })
  })
  
  it('rejects out-of-bounds moves', () => {
    expect(() => parseMove({ row: 9, col: 9 })).toThrow()
  })
  
  it('rejects non-numeric input', () => {
    expect(() => parseMove({ row: 'a', col: 'b' })).toThrow()
  })
})
```

---

### Secrets Management (OWASP A02:2021, CWE-798)

**1. Read Authority**
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [§ 10 Security § 3 - Secrets Management](../../instructions/10-security.instructions.md)

**2. Identify Secret Type**
- API keys → Environment variable only
- Database credentials → Never in code
- OAuth tokens → Backend only, never frontend

**3. Implement**
```typescript
// ✅ SAFE: Environment variable in Vite config
// Access in frontend (public only):
const PUBLIC_API_KEY = import.meta.env.VITE_PUBLIC_API_KEY

// ✅ SAFE: Backend environment variable (never exposed)
// Access in Node.js backend:
const DB_PASSWORD = process.env.DB_PASSWORD

// ❌ FORBIDDEN: Hard-coded secrets
// const API_KEY = 'sk-1234567890'
```

**4. Validate**
```bash
# Before commit, verify no secrets in code
pnpm lint          # Checks for common secret patterns
git diff --cached | grep -i 'key\|password\|token\|secret'  # Manual check
```

**5. Configure .env Files**
```bash
# .env.local (NEVER commit, add to .gitignore)
VITE_PUBLIC_API_KEY=pk_live_test_key
DB_PASSWORD=secret_database_password

# .env.example (Safe to commit, helps team)
VITE_PUBLIC_API_KEY=pk_test_key_placeholder
DB_PASSWORD=YOUR_SECRET_HERE
```

---

### CSRF Protection (OWASP A01:2021, CWE-352)

**1. Read Authority**
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [§ 10 Security § 5 - CSRF & Session Hardening](../../instructions/10-security.instructions.md)

**2. Implement Token-Based Protection**
```typescript
// Backend: Generate CSRF token on page load
app.get('/api/csrf-token', (req, res) => {
  const token = generateCsrfToken()  // Cryptographically random
  req.session.csrfToken = token
  res.json({ csrfToken: token })
})

// Frontend: Include token in state-changing requests
const submitGameMove = async (move: Move, csrfToken: string) => {
  const response = await fetch('/api/moves', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,  // Token in header, not body
    },
    credentials: 'include',  // Include cookies
    body: JSON.stringify(move),
  })
  return response.json()
}

// Backend: Validate CSRF token
app.post('/api/moves', (req, res) => {
  const token = req.headers['x-csrf-token']
  if (token !== req.session.csrfToken) {
    return res.status(403).json({ error: 'CSRF token invalid' })
  }
  // Process move...
})
```

**3. Set Secure Cookies**
```typescript
// Backend: Set session cookie with security flags
res.cookie('sessionId', token, {
  httpOnly: true,        // Prevents JavaScript theft (XSS safe)
  secure: true,          // HTTPS only (production)
  sameSite: 'strict',    // Prevents CSRF (best) or 'lax' (compatible)
  maxAge: 3600000,       // 1 hour
  path: '/',
  domain: 'example.com',
})
```

---

### Secure Cookie Headers (OWASP A01:2021, CWE-384)

**1. Read Authority**
- [MDN Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [§ 10 Security § 5 - Cookies](../../instructions/10-security.instructions.md)

**2. Set All Required Flags**
```
Set-Cookie: sessionId=abc123xyz;
  HttpOnly;        # Prevents JavaScript theft (XSS safe)
  Secure;          # HTTPS only (prevents MitM on network)
  SameSite=Strict; # Prevents CSRF (best option) or SameSite=Lax (compatible)
  Max-Age=3600;    # 1 hour expiry (limits exposure)
  Path=/;          # Root path
  Domain=.example.com; # Specify domain
```

**3. Validate in Tests**
```typescript
describe('Cookie Security', () => {
  it('sets HttpOnly flag on session cookie', () => {
    // Login, capture Set-Cookie header
    const setCookie = response.headers['set-cookie'][0]
    expect(setCookie).toContain('HttpOnly')
    expect(setCookie).toContain('Secure')
    expect(setCookie).toContain('SameSite=Strict')
  })
})
```

---

### Insecure Design (OWASP A04:2021, CWE-1025)

**1. Read Authority**
- [OWASP Insecure Design Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [CWE-1025: Comparison Using Wrong Factors](https://cwe.mitre.org/data/definitions/1025.html)

**2. Principle: Threat Model First**
Design secure systems by modeling threats BEFORE coding:

```typescript
// BEFORE: Untested, ad-hoc access control
const canPlayerMove = (userId: string, gameId: string): boolean => {
  // What if userId is null? What if gameId is invalid?
  // What if player is not in game? Not thought through.
  return Math.random() > 0.5  // ❌ NO! Not secure
}

// AFTER: Explicit threat model with validation
interface GameThreat {
  threat: 'unauthorized_player' | 'invalid_game' | 'player_not_in_game'
  description: string
  mitigation: string
}

const gameThreats: GameThreat[] = [
  {
    threat: 'unauthorized_player',
    description: 'Player attempts to move in game they do not own',
    mitigation: 'Verify player membership before allowing move',
  },
  {
    threat: 'invalid_game',
    description: 'Game ID does not exist or is corrupted',
    mitigation: 'Validate game exists and is in valid state',
  },
]

// Implement mitigations
const canPlayerMove = (userId: string, gameId: string): boolean => {
  // Validation: player exists
  if (!userId) throw new Error('Player ID required')
  if (!gameId) throw new Error('Game ID required')
  
  // Validation: game exists
  const game = games.get(gameId)
  if (!game) throw new Error('Game not found')
  
  // Validation: player in game
  const playerInGame = game.players.includes(userId)
  if (!playerInGame) throw new Error('Player not in game')
  
  // Validation: game state allows moves
  if (game.state !== 'active') throw new Error('Game not active')
  
  return true  // ✅ Safe
}
```

**3. Test Threat Model**
```typescript
describe('Secure Game Design', () => {
  it('rejects move from player not in game', () => {
    const gameId = 'game-1'
    const otherPlayerId = 'player-xyz'
    
    expect(() => canPlayerMove(otherPlayerId, gameId))
      .toThrow('Player not in game')
  })
  
  it('rejects move when game does not exist', () => {
    expect(() => canPlayerMove('player-1', 'nonexistent'))
      .toThrow('Game not found')
  })
  
  it('rejects move when game is completed', () => {
    const game = games.get('game-1')
    game.state = 'completed'  // Simulate completed game
    
    expect(() => canPlayerMove('player-1', 'game-1'))
      .toThrow('Game not active')
  })
})
```

---

### Security Misconfiguration (OWASP A05:2021, CWE-16)

**1. Read Authority**
- [OWASP Security Misconfiguration Prevention](https://owasp.org/Top10/A05_2021-Security_Misconfiguration/)
- [CWE-16: Configuration Data Exposure](https://cwe.mitre.org/data/definitions/16.html)

**2. Hardcoded Config → Environment-Driven**
```typescript
// ❌ BAD: Hardcoded secrets and config
const API_KEY = 'sk-12345abcde'  // NEVER hardcode
const DB_HOST = 'prod-db.internal'
const LOG_LEVEL = 'debug'  // Too verbose in prod

// ✅ GOOD: Environment-driven with validation
import { z } from 'zod'

const envSchema = z.object({
  API_KEY: z.string().min(20, 'API_KEY must be >20 chars'),
  DB_HOST: z.string().url('DB_HOST must be valid URL'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
})

export const env = envSchema.parse(process.env)
// If invalid: immediate error, app doesn't start

// Usage:
console.log(`Connecting to ${env.DB_HOST} with log level ${env.LOG_LEVEL}`)
```

**3. Validate Config at Startup**
```typescript
// src/config.ts
import { z } from 'zod'

const configSchema = z.object({
  NODE_ENV: z.enum(['dev', 'prod']).default('dev'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be >32 chars'),
  API_TIMEOUT: z.number().positive().default(5000),
})

export const config = configSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '5000'),
})

if (config.NODE_ENV === 'prod' && config.LOG_LEVEL === 'debug') {
  throw new Error('DEBUG logging not allowed in production')
}
```

**4. Test Configuration**
```typescript
describe('Config Validation', () => {
  it('fails when SESSION_SECRET < 32 chars', () => {
    expect(() => configSchema.parse({
      NODE_ENV: 'prod',
      SESSION_SECRET: 'short',  // Too short
    })).toThrow('SESSION_SECRET must be >32 chars')
  })
  
  it('rejects debug logging in production', () => {
    const config = { NODE_ENV: 'prod', LOG_LEVEL: 'debug' }
    expect(() => validateProdConfig(config))
      .toThrow('DEBUG logging not allowed in production')
  })
})
```

---

### Vulnerable & Outdated Components (OWASP A06:2021, CWE-1035)

**1. Read Authority**
- [OWASP Vulnerable Components Prevention](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)
- [CWE-1035: Wrong Comparison](https://cwe.mitre.org/data/definitions/1035.html)
- [Dependency Auditing Best Practices](https://docs.npmjs.com/cli/v8/commands/npm-audit)

**2. Lock Dependencies Explicitly**
```json
{
  "engines": {
    "node": "24.14.0",
    "pnpm": "10.31.0"
  },
  "dependencies": {
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "typescript": "5.9.3",
    "eslint": "10.0.3"
  }
}
```

**3. Regular Audits**
```bash
# Weekly: Check for known vulnerabilities
pnpm audit --audit-level=moderate
# Blocks if moderate or higher severity found

# Monthly: Update safe minor/patch versions
pnpm update --latest  # (Test after)

# Quarterly: Major version review
pnpm outdated  # Show what's available
```

**4. Test Dependency Versions**
```typescript
describe('Dependencies', () => {
  it('uses correct React version', () => {
    // Read package.json
    const pkg = require('../package.json')
    expect(pkg.dependencies.react).toBe('19.2.4')
  })
  
  it('node version >= 24', () => {
    const version = parseInt(process.version.split('.')[0].slice(1))
    expect(version).toBeGreaterThanOrEqual(24)
  })
  
  it('no known vulnerabilities', async () => {
    const result = execSync('pnpm audit --json 2>/dev/null || echo {}')
    const audit = JSON.parse(result)
    expect(audit.metadata?.vulnerabilities?.total).toBe(0)
  })
})
```

---

### Identification & Authentication Failures (OWASP A07:2021, CWE-287)

**1. Read Authority**
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [CWE-287: Improper Authentication](https://cwe.mitre.org/data/definitions/287.html)

**2. Session Tokens Must Be Cryptographically Secure**
```typescript
import { randomBytes } from 'crypto'

// ❌ BAD: Not cryptographically secure
const sessionId = Math.random().toString(36)

// ✅ GOOD: Cryptographically random
const sessionId = randomBytes(32).toString('hex')
// Result: 'a8b2c3d4e5f6g7h8...' (64 hex chars = 256 bits)

// Validate token format
const tokenSchema = z.string().regex(/^[a-f0-9]{64}$/, 'Invalid token format')
```

**3. Password Handling**
```typescript
import bcrypt from 'bcrypt'

// Never store plain passwords
const hashPassword = async (password: string): Promise<string> => {
  // bcrypt adds salt automatically
  const hash = await bcrypt.hash(password, 12)
  // hash: $2b$12$...(with salt embedded)
  return hash
}

// Verify login
const verifyLogin = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

// Test
describe('Password Security', () => {
  it('hashes password with bcrypt', async () => {
    const hash = await hashPassword('secret123')
    expect(hash).toMatch(/^\$2b\$12\$/)  // bcrypt format
  })
  
  it('rejects wrong password', async () => {
    const hash = await hashPassword('correct')
    const valid = await verifyLogin('wrong', hash)
    expect(valid).toBe(false)
  })
})
```

**4. Session Timeout & Validation**
```typescript
interface Session {
  userId: string
  token: string
  createdAt: number
  expiresAt: number
}

const SESSION_DURATION_MS = 3600000  // 1 hour

const validateSession = (session: Session): boolean => {
  const now = Date.now()
  
  // Check: token exists
  if (!session.token) return false
  
  // Check: not expired
  if (now > session.expiresAt) return false
  
  // Check: created recently (not backdated)
  if (session.createdAt > now) return false
  
  // Check: duration reasonable
  const duration = session.expiresAt - session.createdAt
  if (duration !== SESSION_DURATION_MS) return false
  
  return true
}
```

---

### Logging & Monitoring Failures (OWASP A09:2021, CWE-532)

**1. Read Authority**
- [OWASP Logging Best Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [CWE-532: Logging of Sensitive Data](https://cwe.mitre.org/data/definitions/532.html)

**2. Log Security Events (Not Sensitive Data)**
```typescript
interface SecurityLog {
  timestamp: Date
  event: 'login' | 'login_failed' | 'unauthorized_access' | 'move_invalid'
  userId?: string
  severity: 'info' | 'warn' | 'error'
  details: string  // NOT containing passwords, tokens, etc.
}

// ❌ BAD: Log sensitive data
console.log(`Login attempt: password=${password}`)

// ✅ GOOD: Log security events without sensitive data
const logSecurityEvent = (event: SecurityLog) => {
  const sanitized = {
    ...event,
    timestamp: event.timestamp.toISOString(),
    details: event.details
      .replace(/password[^,]*/g, 'PASSWORD_REDACTED')
      .replace(/token[^,]*/g, 'TOKEN_REDACTED')
      .replace(/apikey[^,]*/g, 'APIKEY_REDACTED'),
  }
  
  // Send to log aggregator (not stdout in prod)
  if (process.env.NODE_ENV === 'production') {
    sendToLogAggregator(sanitized)  // CloudWatch, Datadog, etc.
  } else {
    console.log(JSON.stringify(sanitized, null, 2))
  }
}

// Examples
logSecurityEvent({
  timestamp: new Date(),
  event: 'login_failed',
  userId: 'user-123',
  severity: 'warn',
  details: 'Invalid credentials for user user-123',
})

logSecurityEvent({
  timestamp: new Date(),
  event: 'unauthorized_access',
  userId: 'user-456',
  severity: 'error',
  details: 'Attempted access to game not owned by user',
})
```

**3. Monitoring Dashboard**
```typescript
// Track key metrics
const securityMetrics = {
  login_attempts_per_minute: 0,
  failed_logins_per_minute: 0,
  unauthorized_accesses_per_minute: 0,
  invalid_moves_per_minute: 0,
}

// Alert on anomalies
const checkSecurityMetrics = () => {
  if (securityMetrics.failed_logins_per_minute > 10) {
    alert('⚠️ High failed login rate detected')
    // Escalate: disable account, notify user
  }
  
  if (securityMetrics.unauthorized_accesses_per_minute > 5) {
    alert('🚨 Potential attack: Multiple unauthorized access attempts')
    // Escalate: investigate, block IP, notify security team
  }
}
```

**4. Test Logging**
```typescript
describe('Security Logging', () => {
  it('logs login failure without exposing password', () => {
    const logs: SecurityLog[] = []
    const spy = jest.spyOn(console, 'log')
      .mockImplementation((msg) => logs.push(JSON.parse(msg)))
    
    logSecurityEvent({
      event: 'login_failed',
      userId: 'user-123',
      severity: 'warn',
      details: 'Invalid password for user user-123',
      timestamp: new Date(),
    })
    
    const log = logs[0]
    expect(log.details).not.toContain('password')  // Password not in logs
    expect(log.event).toBe('login_failed')
    
    spy.mockRestore()
  })
  
  it('aggregates security metrics', () => {
    recordFailedLogin()
    recordFailedLogin()
    recordFailedLogin()
    
    expect(getFailedLoginCount()).toBe(3)
  })
})
```

---

## Pre-Commit Checklist

Before you commit security code, run:

```bash
# 1. Lint checks (ESLint rules + security patterns)
pnpm lint
# Expected: ✅ PASS (no ESLint errors)

# 2. Type checking (TypeScript strict mode)
pnpm typecheck
# Expected: ✅ PASS (no type errors, no 'any')

# 3. Tests (unit + integration)
pnpm test
# Expected: ✅ PASS (all security tests passing)

# 4. Full validation gate
pnpm validate
# Expected: ✅ PASS (lint + typecheck + build)

# 5. Manual verification
git diff --staged | grep -E 'TODO|FIXME|XXX'
# Expected: No TODO comments in security code
```

---

## PR Submission Template

Include this section in your PR description:

```markdown
## Security Changes

**Features Implemented**:
- [ ] [Feature name]

**OWASP Categories Addressed**:
- [ ] A01:2021 Broken Access Control (CWE-284, 352, 601)
- [ ] A02:2021 Cryptographic Failures (CWE-327, 798)
- [ ] A03:2021 Injection (CWE-79, 89, 1333)
- [ ] A08:2021 Software & Data Integrity (CWE-1025)
- [ ] A10:2021 SSRF (CWE-918)

**Enforcement Mechanisms**:
- [ ] ESLint rules verified: `pnpm lint` passes
- [ ] TypeScript strict mode verified: `pnpm typecheck` passes
- [ ] Security tests added: `pnpm test` passes
- [ ] Citation in code: OWASP category + CWE + authority link

**Authority References**:
- [OWASP XYZ Prevention](URL)
- [MDN Resource](URL)
- [§ 24 Security Governance](../../instructions/24-security-governance.md)
- [§ 10 Security Instructions](../../instructions/10-security.instructions.md)

**Testing**:
- [ ] Unit tests cover normal flow
- [ ] Integration tests cover attack scenarios
- [ ] Edge cases tested (invalid input, boundary conditions)
```

---

---

## Comprehensive Test Templates (Copy & Paste)

### Template 1: Input Validation Tests

```typescript
// file.validation.test.ts
import { z } from 'zod'

describe('Input Validation', () => {
  const schema = z.object({
    userId: z.string().uuid('Invalid user ID'),
    gameId: z.string().uuid('Invalid game ID'),
    move: z.object({
      row: z.number().int().min(0).max(2),
      col: z.number().int().min(0).max(2),
    }),
  })

  describe('Valid Inputs', () => {
    it('accepts valid game move', () => {
      const input = {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        gameId: '550e8400-e29b-41d4-a716-446655440001',
        move: { row: 0, col: 1 },
      }
      expect(() => schema.parse(input)).not.toThrow()
    })
  })

  describe('Invalid Inputs', () => {
    it('rejects non-UUID user ID', () => {
      const input = {
        userId: 'not-a-uuid',
        gameId: '550e8400-e29b-41d4-a716-446655440001',
        move: { row: 0, col: 1 },
      }
      expect(() => schema.parse(input)).toThrow('Invalid user ID')
    })

    it('rejects out-of-bounds move', () => {
      const input = {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        gameId: '550e8400-e29b-41d4-a716-446655440001',
        move: { row: 5, col: 5 },  // Outside 0-2 range
      }
      expect(() => schema.parse(input)).toThrow()
    })

    it('rejects missing fields', () => {
      const input = { userId: 'valid-id' }  // Missing gameId, move
      expect(() => schema.parse(input)).toThrow()
    })

    it('rejects SQL injection attempt', () => {
      const input = {
        userId: "'; DROP TABLE users; --",
        gameId: '550e8400-e29b-41d4-a716-446655440001',
        move: { row: 0, col: 1 },
      }
      expect(() => schema.parse(input)).toThrow('Invalid user ID')
    })

    it('rejects XSS script in string field', () => {
      const input = {
        userId: '<script>alert("xss")</script>',
        gameId: '550e8400-e29b-41d4-a716-446655440001',
        move: { row: 0, col: 1 },
      }
      expect(() => schema.parse(input)).toThrow('Invalid user ID')
    })
  })
})
```

### Template 2: Authentication & Session Tests

```typescript
// auth.integration.test.ts
import { randomBytes } from 'crypto'

describe('Authentication & Sessions', () => {
  describe('Session Token Generation', () => {
    it('generates cryptographically random token', () => {
      const token1 = randomBytes(32).toString('hex')
      const token2 = randomBytes(32).toString('hex')
      
      expect(token1).toHaveLength(64)
      expect(token2).toHaveLength(64)
      expect(token1).not.toBe(token2)  // Different each time
    })

    it('rejects weak token format', () => {
      const weakToken = Math.random().toString(36)
      const tokenSchema = z.string().regex(/^[a-f0-9]{64}$/)
      
      expect(() => tokenSchema.parse(weakToken)).toThrow()
    })
  })

  describe('Session Validation', () => {
    const validSession = {
      userId: 'user-123',
      token: 'a' .repeat(64),
      createdAt: Date.now() - 1000,
      expiresAt: Date.now() + 3599000,  // 1 hour from creation
    }

    it('validates active session', () => {
      expect(validateSession(validSession)).toBe(true)
    })

    it('rejects expired session', () => {
      const expired = { ...validSession, expiresAt: Date.now() - 1000 }
      expect(validateSession(expired)).toBe(false)
    })

    it('rejects session created in future', () => {
      const backdated = { ...validSession, createdAt: Date.now() + 10000 }
      expect(validateSession(backdated)).toBe(false)
    })
  })

  describe('Password Hashing', () => {
    it('bcrypt hash has correct format', async () => {
      const hash = await hashPassword('mypassword123')
      expect(hash).toMatch(/^\$2b\$12\$/)
    })

    it('verifies correct password', async () => {
      const password = 'correctpassword'
      const hash = await hashPassword(password)
      const valid = await verifyLogin(password, hash)
      expect(valid).toBe(true)
    })

    it('rejects wrong password', async () => {
      const hash = await hashPassword('correct')
      const valid = await verifyLogin('wrong', hash)
      expect(valid).toBe(false)
    })

    it('never logs passwords', () => {
      const logs: string[] = []
      const spy = jest.spyOn(console, 'log').mockImplementation((msg) => logs.push(msg))
      
      logLoginAttempt('user123', 'mypassword')
      
      expect(logs[0]).not.toContain('mypassword')
      expect(logs[0]).toContain('login_attempt')
      
      spy.mockRestore()
    })
  })
})
```

### Template 3: CSRF Protection Tests

```typescript
// csrf.integration.test.ts
describe('CSRF Protection', () => {
  it('includes CSRF token in form submission', async () => {
    const token = randomBytes(32).toString('hex')
    const response = await submitGameMove(
      { row: 0, col: 1 },
      token
    )
    
    expect(response.status).toBe(200)
  })

  it('rejects request without CSRF token', async () => {
    const response = await submitGameMove({ row: 0, col: 1 }, undefined)
    expect(response.status).toBe(403)
    expect(response.body.error).toContain('CSRF token')
  })

  it('rejects request with invalid CSRF token', async () => {
    const response = await submitGameMove(
      { row: 0, col: 1 },
      'invalid-token-12345'
    )
    expect(response.status).toBe(403)
  })

  it('token is in header, not body', async () => {
    const headers = captureRequestHeaders(submitGameMove)
    expect(headers['x-csrf-token']).toBeDefined()
  })
})
```

### Template 4: Secure Cookie Tests

```typescript
// cookies.integration.test.ts
describe('Secure Cookies', () => {
  it('sets HttpOnly flag on session cookie', () => {
    const setCookie = captureSetCookie(loginUser)
    
    expect(setCookie).toContain('HttpOnly')
    expect(setCookie).toContain('Secure')
    expect(setCookie).toContain('SameSite=Strict')
  })

  it('cookie expires in correct time', () => {
    const setCookie = captureSetCookie(loginUser)
    const maxAge = parseInt(setCookie.match(/Max-Age=(\d+)/)[1])
    
    expect(maxAge).toBe(3600)  // 1 hour
  })

  it('cookie path is restricted', () => {
    const setCookie = captureSetCookie(loginUser)
    expect(setCookie).toContain('Path=/')
  })

  it('cookie domain is correct', () => {
    const setCookie = captureSetCookie(loginUser)
    expect(setCookie).toMatch(/Domain=\.example\.com/)
  })
})
```

### Template 5: Security Event Logging Tests

```typescript
// logging.integration.test.ts
describe('Security Event Logging', () => {
  it('logs login attempts without exposing credentials', () => {
    const logs: string[] = []
    jest.spyOn(console, 'log').mockImplementation((msg) => logs.push(msg))
    
    recordLoginAttempt('user-123', 'password123')
    
    const logEntry = JSON.parse(logs[0])
    expect(logEntry.event).toBe('login_attempt')
    expect(logEntry.details).not.toContain('password')
    expect(logEntry.details).toContain('user-123')
  })

  it('logs failed logins with severity warn', () => {
    const logs: SecurityLog[] = []
    
    recordFailedLogin('user-123')
    
    expect(logs[0].event).toBe('login_failed')
    expect(logs[0].severity).toBe('warn')
  })

  it('redacts sensitive fields from logs', () => {
    const logEntry = sanitizeLogEntry({
      details: 'API call with token=abc123xyz and password=secret456',
    })
    
    expect(logEntry.details).toContain('TOKEN_REDACTED')
    expect(logEntry.details).toContain('PASSWORD_REDACTED')
    expect(logEntry.details).not.toContain('abc123xyz')
    expect(logEntry.details).not.toContain('secret456')
  })

  it('includes timestamp in all logs', () => {
    const log = createSecurityLog('login_attempt')
    expect(log.timestamp).toBeDefined()
    expect(log.timestamp).toBeInstanceOf(Date)
  })
})
```

### Template 6: Configuration Validation Tests

```typescript
// config.validation.test.ts
describe('Configuration Validation', () => {
  it('loads valid config without errors', () => {
    process.env.NODE_ENV = 'prod'
    process.env.LOG_LEVEL = 'info'
    process.env.SESSION_SECRET = 'a'.repeat(32)
    
    expect(() => loadConfig()).not.toThrow()
  })

  it('rejects missing required variables', () => {
    delete process.env.SESSION_SECRET
    
    expect(() => loadConfig()).toThrow('SESSION_SECRET is required')
  })

  it('rejects short SESSION_SECRET', () => {
    process.env.SESSION_SECRET = 'tooshort'
    
    expect(() => loadConfig()).toThrow('SESSION_SECRET must be >32 chars')
  })

  it('prevents debug logging in production', () => {
    process.env.NODE_ENV = 'prod'
    process.env.LOG_LEVEL = 'debug'
    
    expect(() => loadConfig()).toThrow('DEBUG logging not allowed in production')
  })

  it('allows debug logging in development', () => {
    process.env.NODE_ENV = 'dev'
    process.env.LOG_LEVEL = 'debug'
    
    expect(() => loadConfig()).not.toThrow()
  })
})
```

---

## When You Get Stuck

1. **ESLint Error**: Check [§ 10 § 1 - ESLint Enforcement](../../instructions/10-security.instructions.md) for specific rule
2. **Type Error**: Check [AGENTS.md § 0 - TypeScript strictness](../../../AGENTS.md)
3. **Validation Pattern**: Search codebase for existing Zod/validation patterns
4. **Authority Question**: Check [§ 24 Security Governance](../../instructions/24-security-governance.md) § 2 (40+ sources)
5. **Still Stuck**: Reference ESLint rule → OWASP category → OWASP Cheat Sheet (click authority link)

---

## Summary

**The Developer Security Workflow**:
1. ✅ **Read Authority** — § 24 + § 10 + OWASP/MDN standards
2. ✅ **Implement Pattern** — Follow code examples (now covers all 10 OWASP categories)
3. ✅ **Validate Enforcement** — Run `pnpm lint`, `pnpm typecheck`, `pnpm validate`
4. ✅ **Write Tests** — Use copy-paste test templates (6 comprehensive templates provided)
5. ✅ **Cite Authority** — Link OWASP/CWE/URL in code comment
6. ✅ **Submit PR** — Use security checklist template

**New in this expansion**:
- ✅ All 10 OWASP Top 10 2021 categories covered (was 5, now 10)
- ✅ Detailed code examples for each category
- ✅ 6 comprehensive test templates (copy & paste ready)
- ✅ Enhanced PR submission template with all OWASP categories
- ✅ Threat modeling pattern for secure design
- ✅ Configuration validation & monitoring patterns

