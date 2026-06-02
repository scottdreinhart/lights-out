# Security Governance — OWASP Supplement

> **Authority**: `AGENTS.md` § 0, § 24 (Security Governance) + `10-security.instructions.md`
> **Source**: OWASP Top 10 Cheat Sheets (Node.js, NPM, REST)
> **Integration**: Extends `10-security.instructions.md` with backend, API, and supply chain security
> **Scope**: Game platform with potential REST backend, npm dependencies, Docker deployment

---

## NAVIGATION

1. **Frontend Hardening** (Extends § 2 of 10-security.instructions.md)
2. **Backend Security** (New: Node.js + Express)
3. **Package Ecosystem Security** (New: npm supply chain)
4. **REST API Security** (New: If backend exists)
5. **Secrets & Environment** (Extends § 3)
6. **Testing Checklist** (Extends § 7)

---

## EXTENSION 1: Frontend XSS Hardening (Extends § 2)

### Rule: React Automatic Escaping (Still Valid)

React escapes string interpolation by default. **Always prefer JSX binding over DOM APIs.**

```tsx
// ✅ SAFE: React escapes user data automatically
export const UserCard = ({ username, bio }) => (
  <div className="card">
    <h2>{username}</h2> {/* "<script>..." → safe, escaped */}
    <p>{bio}</p> {/* All user strings escaped */}
  </div>
)

// ❌ FORBIDDEN: Bypass React escaping
const UnsafeCard = ({ html }) => <div dangerouslySetInnerHTML={{ __html: html }} />

// ❌ FORBIDDEN: Direct DOM manipulation
document.querySelector('#app').innerHTML = userContent
```

### Rule: Never Use Unsafe DOM Methods

```typescript
// ❌ FORBIDDEN
element.innerHTML = userInput
element.insertAdjacentHTML('afterbegin', userData)
document.write(userContent)

// ✅ SAFE: Use React or textContent
element.textContent = userContent  // No HTML parsing
<div>{userContent}</div>            // React binding (auto-escaped)
```

### Rule: Safe SVG/Image Handling

```tsx
// ❌ FORBIDDEN: SVG from untrusted source
<img src={`data:image/svg+xml,${userSvg}`} />

// ✅ SAFE: URL-based, not inline
<img src="https://trusted-cdn.example.com/images/icon.svg" />

// ✅ SAFE: Validate SVG before rendering (if necessary)
const isSafeSvgUrl = (url: string) => {
  const allowedOrigins = ['https://trusted-cdn.example.com']
  try {
    const u = new URL(url)
    return allowedOrigins.some(origin => u.origin === origin)
  } catch {
    return false
  }
}
```

### Rule: Event Handler Validation

```tsx
// ❌ RISKY: Unvalidated onclick event
;<button onClick={() => (window.location = userProvidedUrl)}>Click</button>

// ✅ SAFE: Whitelist URLs
const SAFE_ROUTES = ['/game', '/settings', '/history']
const handleNavigation = (path: string) => {
  if (SAFE_ROUTES.includes(path)) {
    window.location.hash = path
  }
}

;<button onClick={() => handleNavigation(userPath)}>Navigate</button>
```

---

## EXTENSION 2: Backend Security (Node.js + Express)

> **Source**: OWASP Node.js Security Cheat Sheet
> **Apply If**: Building REST backend, WebSocket server, or API routes

### § 2.1 Request Handling & Input Validation

#### Rule: Limit Request Sizes (DoS Prevention)

```typescript
// src/server.ts
import express from 'express'

const app = express()

// Limit JSON payload (default 1kb)
app.use(express.json({ limit: '1kb' }))

// Limit URL-encoded payload
app.use(express.urlencoded({ limit: '500b', extended: false }))

// Reject oversized requests with 413 Payload Too Large
app.use((err, req, res, next) => {
  if (err.status === 413) {
    res.status(413).json({ error: 'Request body too large' })
    return
  }
  next(err)
})
```

#### Rule: Input Validation Middleware

```typescript
// src/middleware/validate.ts
import { z } from 'zod'

export const validateRequest = <T>(schema: z.Schema<T>) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const validated = schema.parse(req.body)
      req.body = validated
      next()
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ errors: err.errors })
        return
      }
      res.status(400).json({ error: 'Invalid request' })
    }
  }
}

// Usage
const userSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  score: z.number().int().min(0).max(999999),
})

app.post('/user', validateRequest(userSchema), (req, res) => {
  const { username, email, score } = req.body // Type-safe
  // ...
})
```

#### Rule: Query Parameter Validation

```typescript
// src/middleware/validate-query.ts
export const validateQuery = (schema: z.Schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.query)
      req.query = validated
      next()
    } catch (err) {
      res.status(400).json({ error: 'Invalid query parameters' })
    }
  }
}

// Usage
const filterSchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
})

app.get('/games', validateQuery(filterSchema), (req, res) => {
  const { difficulty, limit = 10, offset = 0 } = req.query
  // ...
})
```

#### Rule: Avoid Dangerous Functions

```typescript
// ❌ FORBIDDEN: eval() — executes arbitrary code
const result = eval(userCode)

// ❌ FORBIDDEN: child_process.exec() with user input
import { exec } from 'child_process'
exec(`convert ${userFilename} output.png`) // Command injection!

// ✅ SAFE: Use execFile with array args (no shell interpolation)
import { execFile } from 'child_process'
execFile('convert', [userFilename, 'output.png'])

// ❌ FORBIDDEN: Unsanitized fs operations
import fs from 'fs'
const file = fs.readFileSync(`./uploads/${userPath}`) // Path traversal!

// ✅ SAFE: Validate path
import path from 'path'
const targetPath = path.join('./uploads', userPath)
const realPath = path.resolve(targetPath)
if (!realPath.startsWith(path.resolve('./uploads'))) {
  throw new Error('Path traversal attempt')
}
const file = fs.readFileSync(realPath)

// ❌ FORBIDDEN: vm module with untrusted code
import { runInNewContext } from 'vm'
runInNewContext(userCode)

// ✅ SAFE: Use isolated worker threads instead
import { Worker } from 'worker_threads'
```

### § 2.2 Async & Promise Patterns

#### Rule: Flat Promise Chains (No Callback Hell)

```typescript
// ❌ NESTED (Callback Hell)
getUserData(userId, (err, user) => {
  if (err) handleError(err)
  else {
    getGameScores(user.id, (err, scores) => {
      if (err) handleError(err)
      else {
        updateLeaderboard(scores, (err, result) => {
          if (err) handleError(err)
          else sendResponse(result)
        })
      }
    })
  }
})

// ✅ FLAT (Promise Chain)
getUserData(userId)
  .then((user) => getGameScores(user.id))
  .then((scores) => updateLeaderboard(scores))
  .then((result) => sendResponse(result))
  .catch((err) => handleError(err))

// ✅ FLAT (Async/Await)
try {
  const user = await getUserData(userId)
  const scores = await getGameScores(user.id)
  const result = await updateLeaderboard(scores)
  sendResponse(result)
} catch (err) {
  handleError(err)
}
```

#### Rule: Race Condition Prevention

```typescript
// ❌ RISKY: Parallel operations without coordination
const user = await User.findById(userId)
const score = user.score + 10
user.score = score
await user.save() // Lost update if another request incremented in parallel

// ✅ SAFE: Atomic database operation
await User.updateOne({ _id: userId }, { $inc: { score: 10 } })

// ✅ SAFE: Coordination with Promise.all (if operations are independent)
const [user, stats, history] = await Promise.all([
  User.findById(userId),
  Stats.findById(userId),
  ScoreHistory.find({ userId }),
])
```

### § 2.3 Event Loop Protection

#### Rule: Monitor for Event Loop Saturation

```typescript
// src/middleware/loop-monitor.ts
import toobusy from 'toobusy-js'

// Check every 100ms if event loop is blocked
toobusy.interval = 100

// Middleware: reject new requests if loop is saturated
app.use((req, res, next) => {
  if (toobusy()) {
    res.status(503).json({ error: 'Server too busy' })
    return
  }
  next()
})
```

#### Rule: Never Block the Event Loop

```typescript
// ❌ BLOCKING: CPU-intensive work on main thread
app.post('/generate-board', (req, res) => {
  const board = generateComplexBoard() // Blocks for 500ms
  res.json(board)
})

// ✅ SAFE: Move to Worker thread
import { Worker } from 'worker_threads'
app.post('/generate-board', (req, res) => {
  const worker = new Worker('./board-generator.js')
  worker.on('message', (board) => {
    res.json(board)
  })
})

// worker thread: board-generator.js
import { parentPort } from 'worker_threads'
const board = generateComplexBoard()
parentPort.postMessage(board)
```

### § 2.4 Exception Handling & Error Recovery

#### Rule: Uncaught Exception Handler

```typescript
// src/server.ts
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)

  // Cleanup: close handles, flush logs
  logger.flush()
  server.close()

  // Exit process (unknown state, cannot resume)
  process.exit(1)
})
```

#### Rule: Unhandled Promise Rejection Handler

```typescript
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)

  // Cleanup
  logger.flush()
  server.close()

  process.exit(1)
})
```

#### Rule: EventEmitter Error Handling

```typescript
// ❌ DANGEROUS: EventEmitter error crashes process
const emitter = new EventEmitter()
emitter.emit('error', new Error('Something went wrong')) // Unhandled! → process crash

// ✅ SAFE: Attach error listener
emitter.on('error', (err) => {
  console.error('EventEmitter error:', err)
  // Handle gracefully (do not rethrow)
})
```

### § 2.5 Secrets & Credentials

#### Rule: Never Log Sensitive Data

```typescript
// ❌ FORBIDDEN
console.log('User login:', { email, password })

// ✅ SAFE: Sanitize before logging
const sanitized = { email, passwordHash: '***' }
logger.info('User login:', sanitized)
```

#### Rule: Rotate Secrets Regularly

```bash
# .env
# Change these weekly/monthly
DATABASE_PASSWORD=...
JWT_SECRET=...
API_KEY=...

# Check into version control: (gitignored)
# - .env.example (remove actual values)
# - .env.local (not committed)
```

### § 2.6 Output Escaping (Server-to-Client)

#### Rule: Escape HTML in Responses

```typescript
// src/middleware/escape.ts
import { escapeHtml } from 'escape-html'

// If returning user-provided content in HTML responses
app.get('/user-profile', (req, res) => {
  const user = await User.findById(req.params.id)

  // HTML template (server-side)
  const html = `
    <h1>${escapeHtml(user.name)}</h1>
    <p>${escapeHtml(user.bio)}</p>
  `

  res.send(html)
})

// Or: use template engine with auto-escaping (EJS, Handlebars)
```

#### Rule: Validate Content-Type Responses

```typescript
// Always set correct Content-Type
app.get('/api/data', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.json({ data: 'value' })
})

// Never copy user input to Content-Type
// ❌ res.setHeader('Content-Type', req.headers['accept'])  // WRONG!
// ✅ res.setHeader('Content-Type', 'application/json')     // CORRECT
```

### § 2.7 Activity Logging

#### Rule: Log Security-Relevant Events

```typescript
// src/middleware/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

// Log failed authentication attempts
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user || !user.validatePassword(password)) {
    logger.warn('Failed login attempt', { email, ip: req.ip })
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  logger.info('Successful login', { email, ip: req.ip })
  // Generate token...
})

// Log token validation failures (sign of attack)
app.use(authenticateJWT, (req, res, next) => {
  if (!req.user) {
    logger.warn('JWT validation failed', {
      token: req.headers.authorization?.substring(0, 20),
      ip: req.ip,
    })
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
})
```

### § 2.8 Cookie Security

#### Rule: HttpOnly + Secure + SameSite Flags

```typescript
// src/middleware/session.ts
import session from 'express-session'

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // No JavaScript access (XSS protection)
      secure: true, // HTTPS-only (network sniffing protection)
      sameSite: 'strict', // CSRF protection (strict: no cross-site cookies)
      path: '/', // Restrict to root path
      domain: '.example.com', // Restrict to domain + subdomains
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
)
```

### § 2.9 Security Headers (helmet.js)

#### Rule: Use helmet() for Security Headers

```typescript
// src/server.ts
import helmet from 'helmet'

const app = express()

// Apply all default helmet protections
app.use(helmet())

// Or customize per requirement:
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'wasm-unsafe-eval'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.example.com'],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year (Strict-Transport-Security)
      includeSubDomains: true,
      preload: true,
    },
    frameGuard: {
      action: 'deny', // X-Frame-Options: DENY
    },
    xssFilter: {
      mode: 'block', // X-XSS-Protection: 1; mode=block
    },
  }),
)
```

**Headers Applied by helmet()**:

| Header                      | Value                                          | Purpose                               |
| --------------------------- | ---------------------------------------------- | ------------------------------------- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Force HTTPS                           |
| `X-Content-Type-Options`    | `nosniff`                                      | Prevent MIME sniffing                 |
| `X-Frame-Options`           | `DENY`                                         | Prevent clickjacking                  |
| `X-XSS-Protection`          | `0`                                            | Disable browser XSS auditor (use CSP) |
| `Content-Security-Policy`   | Custom (see above)                             | Restrict content sources              |
| `Referrer-Policy`           | `no-referrer`                                  | Minimize referrer leakage             |

---

## EXTENSION 3: NPM Package Ecosystem Security

> **Source**: OWASP NPM Security Cheat Sheet
> **Apply If**: Managing dependencies via npm/pnpm

### § 3.1 Dependency Management

#### Rule: Use Lockfile Enforcement (pnpm ci)

```bash
# Install exact versions from lockfile (fail if mismatch)
pnpm ci

# Do NOT use pnpm install in CI (can upgrade packages)
# ✅ CORRECT (CI environment)
pnpm ci

# ✅ CORRECT (local development)
pnpm install
```

#### Rule: Regular Audits for Vulnerabilities

```bash
# Check for known CVEs
pnpm audit

# Auto-fix if safe
pnpm audit --fix

# Check outdated packages
pnpm outdated

# Validate environment
pnpm doctor
```

#### Rule: Script Security (Prevent Malicious postinstall)

```bash
# Add to .npmrc (global or project-level)
echo "ignore-scripts=true" >> .npmrc

# Or install without scripts
pnpm install --ignore-scripts

# For specific packages that need scripts, use allow-list
# (see § 3.2 below)
```

### § 3.2 Supply Chain Hardening

#### Rule: Private Registry for Internal Packages

```yaml
# pnpm-workspace.yaml (monorepo) or package.json
# Use Verdaccio for local caching and upstream proxy
# .npmrc example:
registry=https://your-verdaccio.example.com
# Keep internal packages scoped
# @yourorg/game-engine
# @yourorg/shared-utils
```

#### Rule: Script Allow-listing (for trusted packages)

```json
{
  "pnpm": {
    "allowScripts": {
      "esbuild": true,
      "sharp": true
    }
  }
}
```

Use `@lavamoat/allow-scripts` plugin to audit and allowlist package lifecycle scripts.

#### Rule: Secrets Prevention

```bash
# ❌ DANGER: .npmignore takes precedence over .gitignore
# Secret in .env → published via npm!

# ✅ SAFE: Use files array in package.json as allowlist
# package.json
{
  "files": [
    "dist",
    "src",
    "README.md"
  ]
}

# Before publishing, check tarball contents
pnpm publish --dry-run
# Inspect: node_modules/ listed? env files listed? → FIX!
```

#### Rule: 2FA for npm Account

```bash
# Enable 2FA with publish protection
npm profile enable-2fa auth-and-writes

# Or auth-only (less restrictive)
npm profile enable-2fa auth-only
```

#### Rule: Author Tokens with IP Restrictions

```bash
# Create token with IP restrictions + read-only access
npm token create --read-only --cidr=192.0.2.0/24

# List tokens
npm token list

# Revoke if compromised
npm token revoke <token-id>
```

#### Rule: Protect Against Typosquatting & Slopsquatting

```bash
# Before installing, verify package exists and is popular
npm view @username/package

# Check:
# - Weekly downloads (thousands = legitimate, <10 = suspicious)
# - GitHub repository + commit history
# - Maintainer info + history
# - Publish date (recent + 0 history = suspicious)

# Never blindly trust AI-suggested package names!
# AI assistants (Copilot, ChatGPT) hallucinate non-existent packages
# Attackers publish malicious packages with exact hallucinated names

# Mitigation: npm view <package> before install
pnpm add package-name
# Becomes:
npm view package-name  # Verify exists
pnpm add package-name
```

#### Rule: Trusted Publishing (OIDC)

```yaml
# GitHub Actions workflow example
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # Request OIDC token
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install
      - run: pnpm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
          # Or let npm auto-generate from OIDC token
```

Benefits:

- Short-lived, workflow-specific tokens (no long-lived credentials stored)
- Automatic provenance attestations (cryptographic proof of authenticity)

---

## EXTENSION 4: REST API Security

> **Source**: OWASP REST Security Cheat Sheet
> **Apply If**: Building REST backend

### § 4.1 HTTPS & Transport Security

#### Rule: HTTPS Mandatory for All API Endpoints

```typescript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.protocol !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.hostname}${req.originalUrl}`)
    return
  }
  next()
})

// Enforce HSTS (http-to-https strict transport)
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }))
```

### § 4.2 Authentication & JWT Security

#### Rule: Independent JWT Verification

```typescript
// src/middleware/auth.ts
import jwt from 'jsonwebtoken'

export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    // CRITICAL: Do NOT trust JWT header for algorithm selection
    // Always specify algorithm explicitly
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'], // ✅ Whitelist algorithm
      // Do NOT: algorithms: [json.header.alg]  // ❌ VULNERABLE
    })

    // Verify standard claims
    if (!decoded.iss || !decoded.aud || !decoded.exp || !decoded.nbf) {
      res.status(401).json({ error: 'Invalid token claims' })
      return
    }

    // Verify expiration
    if (Date.now() >= decoded.exp * 1000) {
      res.status(401).json({ error: 'Token expired' })
      return
    }

    req.user = decoded
    next()
  } catch (err) {
    logger.warn('JWT validation failed', { error: err.message, ip: req.ip })
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Usage
app.get('/api/scores', authenticateJWT, (req, res) => {
  res.json({
    scores: [
      /* ... */
    ],
  })
})
```

#### Rule: JWT Revocation (Logout)

```typescript
// src/middleware/jwt-revocation.ts
class TokenDenylist {
  private denylist = new Set<string>()

  add(token: string, expiresAt: number) {
    this.denylist.add(token)

    // Auto-cleanup after expiration
    const ttl = (expiresAt * 1000 - Date.now()) / 1000
    setTimeout(() => this.denylist.delete(token), ttl * 1000)
  }

  has(token: string) {
    return this.denylist.has(token)
  }
}

const denylist = new TokenDenylist()

// Check denylist during verification
export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (denylist.has(token)) {
    res.status(401).json({ error: 'Token revoked' })
    return
  }

  // ... rest of verification ...
}

// Logout endpoint
app.post('/logout', authenticateJWT, (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  denylist.add(token, req.user.exp)
  res.json({ message: 'Logged out' })
})
```

### § 4.3 HTTP Method & Workflow Validation

#### Rule: Strict HTTP Method Handling

```typescript
// ❌ FORBIDDEN: All methods allowed
app.all('/games/:id', (req, res) => {
  if (req.method === 'GET') {
    /* ... */
  } else if (req.method === 'PUT') {
    /* ... */
  }
  // What about DELETE, PATCH, etc.?
})

// ✅ SAFE: Explicit per-method routes
app.get('/games/:id', (req, res) => {
  /* read */
})
app.put('/games/:id', validateAuth, (req, res) => {
  /* update */
})
app.delete('/games/:id', validateAuth, (req, res) => {
  /* delete */
})

// Reject unsupported methods with 405
app.all('/games/:id', (req, res) => {
  res.status(405).json({ error: 'Method not allowed' })
})
```

#### Rule: Out-of-Order Workflow Prevention

```typescript
// Example: Checkout workflow must be: create → pay → confirm

// ❌ RISKY: User can skip to confirm without creating/paying
app.post('/checkout/:checkoutId/confirm', (req, res) => {
  const checkout = Checkout.findById(req.params.checkoutId)
  checkout.status = 'confirmed'
  checkout.save()
})

// ✅ SAFE: Validate state machine
const CHECKOUT_STATES = {
  created: ['paying'],
  paying: ['paying', 'paid'],
  paid: ['confirming'],
  confirming: ['confirmed'],
  confirmed: [], // Final state
}

app.post('/checkout/:checkoutId/confirm', (req, res) => {
  const checkout = Checkout.findById(req.params.checkoutId)

  // Validate: can only confirm from 'paid' state
  if (checkout.status !== 'paid') {
    res.status(400).json({ error: `Cannot confirm from state: ${checkout.status}` })
    return
  }

  // Validate: token is bound to this checkout
  if (req.body.token !== checkout.paymentToken) {
    res.status(400).json({ error: 'Invalid payment token' })
    return
  }

  checkout.status = 'confirmed'
  checkout.save()
  res.json(checkout)
})
```

### § 4.4 Content-Type & Input Validation

#### Rule: Strict Content-Type Handling

```typescript
// ❌ FORBIDDEN: Accept any content-type
app.post('/api/score', (req, res) => {
  const data = req.body // What format? JSON? XML? Form?
})

// ✅ SAFE: Explicit content-type validation
app.post('/api/score', expressJSON(), (req, res) => {
  // express.json() parses and validates Content-Type: application/json
  // Returns 415 Unsupported Media Type for other content-types

  const { score, difficulty } = req.body
  res.json({ success: true })
})

// Response: Always set explicit Content-Type
app.get('/api/data', (req, res) => {
  // ❌ res.setHeader('Content-Type', req.headers['accept'])  // WRONG!
  // ✅ res.setHeader('Content-Type', 'application/json')     // CORRECT

  res.json({ data: 'value' })
})
```

#### Rule: Array/Object Parameter Handling

```typescript
// src/middleware/parse-arrays.ts
// Query params come as strings; use middleware to parse arrays

app.get('/games', (req, res) => {
  // ?difficulty=easy&difficulty=medium&difficulty=hard
  // req.query.difficulty = 'hard'  (only last value!)

  // ❌ RISKY: Duplicates are silently dropped

  // ✅ SAFE: Parse as array
  const difficulties = Array.isArray(req.query.difficulty)
    ? req.query.difficulty
    : [req.query.difficulty]

  res.json({ results: [] })
})
```

### § 4.5 Error Handling & Response Security

#### Rule: Generic Error Messages

```typescript
// ❌ FORBIDDEN: Leak internals
app.get('/user/:id', (req, res) => {
  try {
    const user = User.findById(req.params.id)
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack })
  }
})

// ✅ SAFE: Generic messages only
app.get('/user/:id', (req, res) => {
  try {
    const user = User.findById(req.params.id)
    if (!user) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(user)
  } catch (err) {
    logger.error('Error fetching user', { error: err, userId: req.params.id })
    res.status(500).json({ error: 'Internal server error' })
  }
})
```

#### Rule: HTTP Status Codes (Use Correctly)

```typescript
// Success
app.post('/games', (req, res) => {
  const game = Game.create(req.body)
  res.status(201).json(game) // 201 Created
})

// Auth errors
res.status(401).json({ error: 'Unauthorized' }) // Missing/invalid auth

// Permission errors
res.status(403).json({ error: 'Forbidden' }) // Auth OK, but insufficient privilege

// Client errors
res.status(400).json({ error: 'Bad request' }) // Malformed
res.status(406).json({ error: 'Not acceptable' }) // Unsupported Accept header
res.status(409).json({ error: 'Conflict' }) // Duplicate resource
res.status(413).json({ error: 'Payload too large' }) // DoS prevention
res.status(429).json({ error: 'Too many requests' }) // Rate limit exceeded

// Server errors (no details to client)
res.status(500).json({ error: 'Internal server error' })
res.status(503).json({ error: 'Service unavailable' })
```

### § 4.6 Rate Limiting & Brute-Force Protection

#### Rule: Rate Limiting per IP

```typescript
// src/middleware/rate-limit.ts
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
  statusCode: 429,
})

// apply to all API routes
app.use('/api/', limiter)

// Stricter limit for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 min
  skipSuccessfulRequests: true, // Don't count successful logins
})

app.post('/login', loginLimiter, (req, res) => {
  // ...
})
```

#### Rule: Brute-Force Protection (Account Lockout)

```typescript
// src/schema/User.ts (MongoDB example)
interface User {
  email: string
  password: string
  failedLoginAttempts: number
  lockUntil: Date | null
}

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  // Check if locked
  if (user?.lockUntil && user.lockUntil > new Date()) {
    res.status(429).json({ error: 'Account locked. Try again later.' })
    return
  }

  // Verify password
  if (!user || !(await user.validatePassword(password))) {
    // Increment failed attempts
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1

    if (user.failedLoginAttempts >= 5) {
      // Lock account for 30 minutes
      user.lockUntil = new Date(Date.now() + 30 * 60 * 1000)
    }

    await user.save()
    logger.warn('Failed login attempt', { email })
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  // Reset failed attempts on success
  user.failedLoginAttempts = 0
  user.lockUntil = null
  await user.save()

  logger.info('Successful login', { email })
  res.json({ token: generateJWT(user) })
})
```

---

## EXTENSION 5: Secrets & Environment (Extends § 3 of 10-security.instructions.md)

### Rule: No Secrets in Source Code

```bash
# ❌ FORBIDDEN in git
API_KEY=sk-1234567890abcdef
DATABASE_PASSWORD=mysql_password_123
JWT_SECRET=super_secret_key

# ✅ SAFE: Environment variables only
# .env (gitignored)
VITE_API_BASE_URL=https://api.example.com
DATABASE_URL=postgres://user:pass@localhost/db
JWT_SECRET=$(openssl rand -base64 32)

# .env.example (committed, shows structure only)
VITE_API_BASE_URL=https://api.example.com
DATABASE_URL=postgresql://user:password@localhost/dbname
JWT_SECRET=your-secret-here
```

### Rule: Environment Variable Validation

```typescript
// src/config.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  VITE_API_BASE_URL: z.string().url(),
  DATABASE_URL: z.string().startsWith('postgres://'),
  JWT_SECRET: z.string().min(32),
})

// Validate at startup
const env = envSchema.parse(process.env)

export { env }
```

### Rule: Docker Secrets (Not Build ARGs)

```dockerfile
# ❌ FORBIDDEN: ARG values visible in image layers
ARG API_KEY=sk-1234567890abcdef
RUN npm install && echo $API_KEY > .env

# ✅ SAFE: Build secrets (available during build only, not baked)
# docker build --secret my_secret="value" -t myapp .
FROM node:lts-alpine
RUN --mount=type=secret,id=my_secret \
    cat /run/secrets/my_secret > /tmp/secret.txt && \
    npm install && \
    rm /tmp/secret.txt

# ✅ SAFE: Runtime secrets (environment at runtime)
# docker run -e API_KEY="sk-..." myapp
FROM node:lts-alpine
RUN npm ci --omit=dev
CMD ["node", "server.js"]
# Secrets injected at runtime via -e or docker-compose env
```

---

## TESTING CHECKLIST (Extends § 7 of 10-security.instructions.md)

### Frontend

- [ ] `pnpm lint` passes (no dangerouslySetInnerHTML, unsafe regex, unvalidated redirects)
- [ ] No direct DOM manipulation (`innerHTML`, `insertAdjacentHTML`)
- [ ] All user input bound via JSX (auto-escaped by React)
- [ ] URLs validated against whitelist before navigation
- [ ] Environment secrets not hardcoded (use `import.meta.env.VITE_*`)
- [ ] No tokens in localStorage (only session/httpOnly cookies from backend)
- [ ] No sensitive data in browser logs or error messages
- [ ] CSP header validation passes (no blocked resources)

### Backend (If Present)

- [ ] [Request validation enforcement: size limits, schema validation, query parameter parsing
- [ ] [No dangerous functions: eval(), child_process.exec(), unsanitized fs operations
- [ ] [ JWT verification: algorithms whitelisted, standard claims verified, expiration checked
- [ ] [JWT revocation: logout endpoint denylists tokens correctly
- [ ] [Async patterns: flat promise chains, no callback hell, race conditions prevented
- [ ] [Event loop: toobusy-js monitoring, no blocking operations
- [ ] [Exception handling: uncaughtException listener, EventEmitter error handling
- [ ] [Logging: security-relevant events logged, no sensitive data in logs
- [ ] [Cookies: httpOnly=true, secure=true, sameSite=strict
- [ ] [Security headers: helmet() configured, CSP directives correct
- [ ] [HTTP methods: only allowed methods return responses, others 405
- [ ] [Workflow validation: state machine enforced, out-of-order requests rejected
- [ ] [Content-Type: request validation (415), response explicit (never copy Accept)
- [ ] [Rate limiting: enabled on sensitive endpoints, brute-force lockout implemented
- [ ] [Error handling: generic messages only, no stack traces to client
- [ ] [HTTP status codes: correct codes for each scenario (401/403/404/429/500)

### Dependencies

- [ ] `pnpm audit` passes (no high/critical vulnerabilities)
- [ ] `pnpm ci` used in CI (lockfile enforcement)
- [ ] `.npmrc` has `ignore-scripts=true` (prevent malicious postinstall)
- [ ] No typosquatting: verified package popularity and GitHub repo
- [ ] No slopsquatting: did not blindly trust AI package suggestions
- [ ] Secrets (.env) not in .npmignore (use files array allowlist)
- [ ] 2FA enabled on npm account
- [ ] Author tokens use IP restrictions where applicable
- [ ] Scoped packages used for internal code (@yourorg/\*)

### Secrets & Env

- [ ] No API keys, passwords, tokens in source code
- [ ] .env.local gitignored
- [ ] .env.example committed (structure only, no values)
- [ ] Environment variables validated at startup (using zod or similar)
- [ ] Docker secrets used for build-time secrets (not ARG/ENV)
- [ ] Docker runtime secrets injected via -e or docker-compose
- [ ] No secrets in logs or error responses

### Infrastructure

- [ ] HTTPS enforced (HTTP → HTTPS redirect)
- [ ] HSTS header set (Strict-Transport-Security)
- [ ] CSP headers present (Content-Security-Policy)
- [ ] X-Content-Type-Options: nosniff set
- [ ] X-Frame-Options or CSP frame-ancestors set
- [ ] Referrer-Policy set (no-referrer or minimal)
- [ ] Docker image uses distroless or alpine (minimal attack surface)
- [ ] Docker process runs as non-root user
- [ ] Docker dumb-init used for signal handling

---

## RESOURCES

**OWASP Cheat Sheets** (Source Documents)

- [OWASP Node.js Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [OWASP NPM Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

**Related Repository Files**

- `10-security.instructions.md` - Original frontend-focused security rules (extends this)
- `.github/copilot-instructions.md` - Copilot runtime rules (references AGENTS.md § 24)
- `AGENTS.md` § 24 - Security Governance (top authority)
- `tsconfig.json` - TypeScript strict mode (enforces type safety)
- `eslint.config.js` - Security linting rules

**Third-Party Tools**

- `helmet.js` - Security headers middleware
- `express-rate-limit` - Rate limiting
- `zod` - Runtime schema validation
- `jsonwebtoken` - JWT signing/verification
- `escape-html` - HTML escaping
- `toobusy-js` - Event loop monitoring
- `winston` - Activity logging
- `@lavamoat/allow-scripts` - Script whitelisting

---

## INTEGRATION NOTES

**How This Supplement Extends the Existing Security Rules:**

1. **§ 1 (ESLint Enforcement)** — No changes needed (already comprehensive)
2. **§ 2 (Input Sanitization)** — EXTENDED with:
   - Backend request validation patterns
   - Input validation middleware + schema validation
   - Query parameter parsing
3. **§ 3 (Secrets)** — EXTENDED with:
   - Environment variable validation
   - Docker secrets vs build args
   - Runtime vs build-time secrets
4. **§ 4 (CSP)** — Enhanced with helmet.js configuration + custom CSP directives
5. **§ 5 (CSRF & Cookies)** — EXTENDED with:
   - Session cookie hardening example
   - CSRF token patterns
6. **§ 6 (CSP Hardening)** — EXTENDED with specific directives + operationalnal guidance
7. **Testing Checklist** — EXPANDED with backend, dependencies, secrets, infrastructure checks

**Non-Conflicting Additions** (New Knowledge):

- Backend security (Node.js + Express) — Frontend-only original
- NPM/package ecosystem security — Dependency management original
- REST API security — API design patterns original
- Rate limiting & brute-force protection — Does not conflict with existing
- JWT implementation & revocation — Complements session management
- Event loop monitoring & async patterns — Application performance addition
- Docker security hardening — Infrastructure-level addition

**Backward Compatibility:**

✅ All original rules from `10-security.instructions.md` remain valid and unchanged
✅ New sections are additive, not replacement
✅ References original file for continuity
✅ Maintains AGENTS.md authority hierarchy

---

**Status**: ✅ READY FOR INTEGRATION  
**Date**: 2026-03-19  
**OWASP Source URLs Preserved**: All 3 cheat sheet links included in Resources section
