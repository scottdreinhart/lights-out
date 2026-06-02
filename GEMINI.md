# GEMINI.md — Gemini AI Model Policy

> **Authority**: Subordinate to `AGENTS.md`.  
> **Unified Reference**: [docs/governance/AI_ASSISTANT_WORKFLOW.md](docs/governance/AI_ASSISTANT_WORKFLOW.md)  
> **Canonical Shared Policy**: [.github/ai-runtime-policy.md](.github/ai-runtime-policy.md)  
> **Scope**: Google Gemini and Gemini-family AI coding assistants.

Gemini inherits **all** repository AI operating rules from `AGENTS.md` and `.github/ai-runtime-policy.md`. If this file conflicts with `AGENTS.md`, **`AGENTS.md` wins**.

---

## Executive Summary

**Gemini operates as a governed AI agent in a strict, architecture-first codebase.** This file consolidates Gemini-specific policies, safety mandates, operational rules, and guardrails synthesized from the complete project governance framework.

**Core Mandate:** Deliver high-quality, minimal, validated changes that preserve architecture, reuse existing patterns, and respect governance rules.

**Golden Rules:**
1. Read governance first, code second
2. Validate deterministically; trust the machine, not intuition
3. Self-correct failures; never suppress errors
4. Respect architecture; never bypass it for convenience
5. Reuse first; create only when necessary
6. Report truthfully; don't claim completion without proof

---

## 0. MANDATORY: Pre-Execution Sequence

Before making **ANY** changes to this codebase, Gemini **MUST**:

1. ✅ **Read `AGENTS.md` first** — This is the supreme authority. All governance flows from here.
   - Focus on: § 0 (Non-Negotiable Rules), § 0.A (Runtime Validation & Self-Correction)
   - Also read: § 2 (Package Manager), § 3 (Architecture), § 5 (Shell), § 1.A (Skills)

2. ✅ **Read this file** (`GEMINI.md`) — Gemini-specific deltas and tool mandates

3. ✅ **Read `.github/ai-runtime-policy.md`** — Shared runtime policy for all AI models

4. ✅ **Consult `docs/governance/AI_ASSISTANT_WORKFLOW.md`** — Unified workflow for all AI assistants

5. ✅ **Read scoped `.github/instructions/*.md` files** — Task-specific guidance (see reference table below)

6. ✅ **Read `.github/skills/README.md`** — Workflow bundle routing and skill ownership

7. ✅ **Inspect root and app-level config files**:
   - `package.json` (root and app-level scripts)
   - `pnpm-workspace.yaml`
   - `tsconfig.json`
   - `eslint.config.js`
   - `vite.config.ts`
   - Platform configs (Electron, Capacitor, WASM)

8. ✅ **Search existing code before creating anything new** — Reuse first, create last.

**No shortcuts. No exceptions. Read the docs first.**

---

## 1. Gemini-Specific Operating Rules

### 1.1 Governance Inheritance

Gemini **inherits and enforces** all rules from:

| Source | Rule | Gemini Requirement |
| ------ | ---- | ------------------ |
| `AGENTS.md` § 0 | Non-negotiable AI operating rules | **MANDATORY** |
| `AGENTS.md` § 0.A | Runtime validation & self-correction | **MANDATORY** |
| `AGENTS.md` § 2 | pnpm-only package manager | **MANDATORY** |
| `AGENTS.md` § 3–4 | Architecture preservation and import rules | **MANDATORY** |
| `AGENTS.md` § 1.A | Skill routing via workflow bundles | **MANDATORY** |
| `.github/ai-runtime-policy.md` | Shared AI runtime policy | **MANDATORY** |

**Conflict Resolution:** If `AGENTS.md` and this file conflict, follow `AGENTS.md`.

### 1.2 Code Generation Philosophy

**Gemini must:**

- Generate **minimal, surgical edits** — not full-file rewrites unless explicitly required
- **Preserve existing code style, naming, and organization** — match repo conventions exactly
- **Use shared patterns, hooks, components, utilities** before creating parallel implementations
- **Respect CLEAN Architecture** — Domain → App → UI layering is inviolable
- **Use path aliases** (`@/domain`, `@/app`, `@/ui`) — no cross-layer relative imports
- **Verify every change** — Run quality gates before claiming completion

### 1.3 Validation as Source of Truth

**Gemini must treat deterministic repo checks as the source of truth:**

| Command | Purpose | When |
| ------- | ------- | ---- |
| `pnpm check` | Lint + format + typecheck (fast) | After every code change |
| `pnpm validate` | Full gate: check + build | Before final submission |
| `pnpm test` | Unit/integration/component tests | If tests affected |
| `pnpm test:e2e` | End-to-end tests | If E2E tests exist and affected |
| `pnpm test:names` | Test naming validation | If adding/modifying tests |
| Platform-specific checks | Electron, Capacitor, WASM | If platform code affected |

**If checks fail, Gemini MUST self-correct.** No disabling lint, weakening types, or suppressing errors.

### 1.4 Self-Correction Loop (Mandatory)

When validation fails, Gemini **MUST** follow this deterministic loop:

```
STEP 1: INSPECT OUTPUT
├─ Read error output carefully
├─ Identify ROOT CAUSE (not symptom)
├─ Note file path, line number, rule violated
└─ Understand WHY the check failed

STEP 2: FIX ROOT CAUSE
├─ Address underlying issue in code/config
├─ Do NOT disable/suppress rules
├─ Do NOT weaken type safety
├─ Do NOT comment out failing tests
└─ For build failures: diagnose dependency/config issue

STEP 3: RERUN THE COMMAND
├─ Run exact same command that failed
├─ Capture complete output
├─ Did it pass? → Go to STEP 4
└─ Still failing? → Go to STEP 1 (new analysis)

STEP 4: REPEAT UNTIL GREEN
├─ All checks must pass
├─ Code "looks right" is NOT done without machine verification
└─ Keep self-correcting until all checks pass
```

### 1.5 Forbidden Actions (Non-Negotiable)

When validation fails, Gemini **MUST NOT**:

| Action | Why | What To Do |
| ------ | --- | --------- |
| Disable lint rules | Suppresses real problems | Fix code to satisfy rule |
| Use `// eslint-disable` | Hides violations | Address underlying issue |
| Loosen TypeScript strictness | Reduces type safety | Add proper types |
| Comment out failing tests | Loses test coverage | Make test pass |
| Delete failing tests | Masks bugs | Never delete; always fix |
| Use `// @ts-ignore` | Bypasses type checking | Fix type error properly |
| Skip validation checks | Claims completion without proof | Run ALL checks |
| Bypass architecture checks | Violates separation of concerns | Respect boundaries |
| Weaken build validation | Hides problems | Fix real code/config issue |
| Claim "it looks right" without checks | Intuition ≠ verification | Wait for machine verification |

### 1.6 Minimal Change Principle

**Gemini must make the smallest correct change set:**

- Change **only what the task requires**
- Prefer **surgical edits** over rewrites
- **Preserve** existing naming, structure, conventions, behavior, layout
- **Update existing files** instead of creating replacements
- **Do not remove** comments, documentation, or guardrails unless explicitly instructed

### 1.7 Architecture Is Sacred

Gemini **must respect:**

- **CLEAN Architecture**: Domain → App → UI separation is inviolable
- **Barrel exports**: Every directory `MUST` have an `index.ts`
- **Path aliases**: Use `@/domain`, `@/app`, `@/ui` — never relative cross-layer imports
- **Import rules**: No `../../` relative paths; use aliases
- **Naming conventions**: 
  - Hooks: `use*` (e.g., `useBingoGame`)
  - Contexts: `*Context` (e.g., `ThemeContext`)
  - Services: `*Service` (e.g., `AudioService`)
  - Components: `PascalCase` (e.g., `GameBoard`)
  - Utilities: `camelCase` (e.g., `calculateScore`)
  - Types: `PascalCase` (e.g., `Player`, `GameState`)
  - Tests: `<feature>.<type>.test.ts(x)` (e.g., `bingo.game.test.ts`)

**Violating architecture breaks the entire system.**

### 1.8 Reuse Before Creation

Gemini **must:**

- Search for **existing components, hooks, utilities, types, services, stores** before creating new ones
- Search for **existing patterns and abstractions** in the repo
- **Extend existing implementations** rather than building parallel code
- **Never create duplicate functionality** or parallel abstractions

**Duplication is a code smell. Reuse first.**

### 1.9 Package Manager: pnpm Only

**Gemini must use pnpm exclusively:**

- `pnpm install` — dependency installation
- `pnpm add` — add packages
- `pnpm remove` — remove packages
- `pnpm update` — update packages
- `pnpm exec` — execute in workspace context
- `pnpm run <script>` — run workspace scripts
- `pnpm --filter <workspace-name>` — target specific app/package

**Forbidden:**
- ❌ Never suggest `npm install`, `npm run`, `npx`
- ❌ Never suggest `yarn` or other package managers
- ❌ Never generate `package-lock.json` or `yarn.lock`

### 1.10 Shell Governance: Bash/WSL Default (MANDATORY)

**Gemini must use Bash/POSIX shell as the mandatory default:**

- **Bash is the default** for all development, builds, and operational tasks
- **PowerShell is opt-in only** — never assume, never suggest unless explicitly building Windows Electron `.exe` packages
- **WSL: Ubuntu** is the preferred Windows development environment
- **macOS bash** is the native macOS environment
- **CI/CD**: Linux runners use Bash

**Use Bash for:**
- Dependency installation
- Development server execution
- Vite builds
- WASM builds
- Linting and formatting
- Typechecking
- Testing
- All general development tasks

**PowerShell only for:**
- `pnpm run electron:build:win` — Windows Electron packaging (explicitly requested)

**Forbidden:**
- ❌ Never default to PowerShell
- ❌ Never present PowerShell as interchangeable with Bash
- ❌ Never suggest PowerShell without explicit user approval

### 1.11 No Fake Completion

**Gemini must NOT:**

- Claim work is complete without running relevant checks
- Leave placeholder wiring, mock flows, incomplete integration, or stubbed logic (unless explicitly requested)
- Treat partial scaffolding as finished implementation
- Mark tasks done if required tests, validation, or verification have been skipped

**Real completion is verified. Fake completion is a trap.**

### 1.12 Audio Implementation (MANDATORY)

**Gemini must enforce the unified audio architecture:**

- **Abstraction**: Never import `howler` directly in apps. Use `@games/audio-engine` hooks (`useAudio`, `useMusic`, `useSynth`).
- **Synthesis**: Prioritize programmatic Web Audio synthesis (`useSynth`) for UI bleeps and simple SFX to minimize asset weight.
- **Context**: Ensure every application is wrapped in the `<AudioProvider>` at the root.
- **Governance**: Follow the rules defined in `docs/governance/AUDIO_GOVERNANCE.md`.

---

## 2. Gemini-Specific Tool Mandates

### 2.1 Efficiency & Context Usage

- **Strategic Orchestration**: Use `runSubagent` to compress complex or repetitive work (don't do the work inline if a subagent can parallelize it)
- **Parallel Operations**: Combine independent tool calls (file reads, searches) in single invocation to reduce context turns
- **Intent Clarity**: Always provide a concise one-sentence intent before executing tool calls
- **Output Filtering**: For large command outputs, use `grep`, `head`, `tail`, `awk` to extract relevant portions (don't force the user to read 10KB of irrelevant output)

### 2.2 Security & Safety

- **Credential Protection**: Never log or print secrets/keys/tokens
- **Sensitive Data**: Never output API keys, passwords, or authentication tokens
- **Safe Defaults**: Explain the impact of modifying commands **before** execution
- **Validation**: Always run validation gates before claiming changes are complete

### 2.3 File and Workspace Operations

- **Path Accuracy**: Always use absolute paths in tool parameters
- **File Existence**: Verify files exist before attempting edits (use `read_file` or `file_search` first)
- **Minimal Edits**: Use `replace_string_in_file` for surgical changes; avoid `create_file` for modifications
- **Bulk Operations**: Use `multi_replace_string_in_file` when making multiple independent edits (more efficient than sequential calls)
- **Context Preservation**: Include 3–5 lines of surrounding code in `replace_string_in_file` `oldString` to ensure uniqueness

---

## 3. Scoped Instruction Map (Quick Reference)

When task-specific guidance is needed, consult:

| Domain | File | Purpose |
| ------ | ---- | ------- |
| **Routing & Skills** | `.github/instructions/00-skill-routing.instructions.md` | Workflow bundle routing |
| **Build & Packaging** | `.github/instructions/01-build.instructions.md` | Build configuration, Vite optimization |
| **Frontend** | `.github/instructions/02-frontend.instructions.md` | React/Vite architecture patterns |
| **Electron** | `.github/instructions/03-electron.instructions.md` | Electron-specific patterns, packaging |
| **Mobile (Capacitor)** | `.github/instructions/04-capacitor.instructions.md` | Capacitor integration, routing |
| | `.github/instructions/04-mobile-testing.instructions.md` | Mobile testing strategies |
| | `.github/instructions/13-mobile-gestures.instructions.md` | Mobile gesture handling |
| | `.github/instructions/15-app-store-compliance.instructions.md` | App Store compliance rules |
| | `.github/instructions/18-capacitor-conditional.instructions.md` | Platform-conditional code patterns |
| **WASM** | `.github/instructions/05-wasm.instructions.md` | WebAssembly build, integration |
| **Responsive Design** | `.github/instructions/06-responsive.instructions.md` | Responsive UI, adaptive patterns |
| **AI Orchestration** | `.github/instructions/07-ai-orchestration.instructions.md` | AI service integration |
| **Input Controls** | `.github/instructions/08-input-controls.instructions.md` | Keyboard, touch, game input |
| **Hooks** | `.github/instructions/09-hook-patterns.instructions.md` | Custom React hook patterns |
| **Accessibility** | `.github/instructions/09-wcag-accessibility.instructions.md` | WCAG 2.1 AA compliance |
| **Security** | `.github/instructions/10-security.instructions.md` | Security best practices |
| | `.github/instructions/10-security-owasp-supplement.md` | OWASP Top 10 mitigation |
| | `.github/instructions/24-security-governance.md` | Security governance, compliance |
| **Performance** | `.github/instructions/11-performance.instructions.md` | Performance baseline |
| | `.github/instructions/14-performance-optimization.instructions.md` | Advanced tuning |
| | `.github/instructions/20-css-performance-rendering-optimization.instructions.md` | CSS critical rendering path |
| **Error Handling** | `.github/instructions/12-error-handling.instructions.md` | Error classification, recovery |
| **Testing** | `.github/instructions/17-testing.instructions.md` | Testing patterns, quality gates |
| **Node.js/Frontend** | `.github/instructions/19-nodejs-frontend-best-practices.instructions.md` | Async/await, promises, naming |
| **Fire TV** | `.github/instructions/21-fire-tv.instructions.md` | Fire TV input, focus handling |
| **Endless Runners** | `.github/instructions/22-endless-runner.instructions.md` | Runner game generation, schema |
| **Game Engine Factory** | `.github/instructions/25-game-engine-factory.instructions.md` | Game engine architecture |
| **Vector Assault** | `.github/instructions/26-vector-assault.instructions.md` | Vector Assault implementation |

---

## 4. Skill Routing (Workflow Bundle Ownership)

**Gemini must map tasks to workflow bundles BEFORE implementation:**

Consult `.github/skills/README.md` for:
- **Operational Workflow Bundles 1–8**: Build, test, deploy, validate, optimize, analyze, troubleshoot, document
- **Skill-owned script chains**: Prefer existing `pnpm` scripts over ad hoc commands
- **Multi-scope work**: Assign a lead bundle and supporting bundles explicitly

**Mandatory:** Route complex work through skill owners. Do not create parallel workflows.

---

## 5. Completion Reporting

When Gemini completes a task, it **MUST** report:

1. **Files changed** — List of modified files with purpose
2. **Validation results** — Output from `pnpm check` and/or `pnpm validate`
3. **Behavior preserved** — Confirmation that existing behavior is unchanged (unless task required change)
4. **Blockers** — Any unresolved issues with explanation and escalation

**Reporting Format:**

```markdown
## Completion Report

**Files Changed:**
- [path/file.ts](path/file.ts) — Brief description of change

**Validation:**
- ✅ pnpm check: PASS
- ✅ pnpm validate: PASS (if full gate was run)
- ✅ pnpm test: PASS (if tests were run)

**Behavior:**
- Existing functionality preserved
- No architecture violations
- All required checks passing

**Blockers:** None
```

---

## 6. When to Ask for Guidance (Escalation)

**Gemini should escalate to the user when:**

- A validation check fails and the self-correction loop cannot resolve it
- An architectural boundary needs to be violated (ask for permission, don't bypass it)
- A new dependency must be added (ask if precedent exists)
- The task conflicts with existing governance rules
- Multiple valid approaches exist and the repo pattern is unclear
- A "real blocker" is found (external input needed, fundamental issue revealed)

**Escalation Format:**

```markdown
I cannot proceed because [specific reason].

**Why it blocks:** [What would need to change]

**Evidence:** [Command output, file excerpt, error message]

**Options:**
1. [Option A with tradeoff]
2. [Option B with tradeoff]
3. [Request guidance: What would you prefer?]
```

---

## 7. Gemini Operating Checklist

Before every response, Gemini must verify:

- [ ] Have I read `AGENTS.md` and relevant governance files?
- [ ] Have I read the unified workflow in `docs/governance/AI_ASSISTANT_WORKFLOW.md`?
- [ ] Am I using `pnpm` (not npm/npx/yarn)?
- [ ] Is my shell **Bash** (not PowerShell, except for Windows Electron packaging)?
- [ ] Does my code respect CLEAN Architecture boundaries?
- [ ] Am I using path aliases (`@/`), not relative cross-layer imports?
- [ ] Am I following the minimal change principle?
- [ ] Have I reused existing patterns instead of creating new ones?
- [ ] Have I mapped this task to a workflow bundle?
- [ ] Will my changes pass `pnpm check`?
- [ ] Have I run `pnpm validate` for final changes?
- [ ] Am I ready to provide a completion report with validation results?
- [ ] Have I avoided all forbidden actions (suppressing errors, disabling lint, etc.)?

**If any check fails, pause and address it before proceeding.**

---

## 8. Key Policies at a Glance

| Policy | Rule | Gemini Responsibility |
| ------ | ---- | --------------------- |
| **Governance** | `AGENTS.md` is supreme | Read and follow absolutely |
| **Package Manager** | pnpm only | Use exclusively; never npm/yarn |
| **Shell** | Bash/WSL default | Use Bash by default; PowerShell opt-in only |
| **Code Changes** | Minimal surgical edits | Don't rewrite; preserve conventions |
| **Architecture** | CLEAN layers inviolable | Respect Domain→App→UI separation |
| **Imports** | Path aliases required | Use `@/domain`, never `../../` |
| **Reuse** | Search first, create last | Extend existing, avoid duplication |
| **Testing** | 100% required checks | Run `pnpm validate` before completion |
| **Self-Correction** | Mandatory loop | Fix root cause, don't suppress errors |
| **Completion** | Verified only | Don't claim done without green checks |
| **Safety** | No secrets in output | Never log keys/tokens/credentials |
| **Efficiency** | Parallelize operations | Combine independent tool calls |

---

## 9. Provider Alignment (For Reference)

**Other AI models working in this repo:**

- **Claude**: See `CLAUDE.md` for Claude-specific behaviors and policy alignment
- **Copilot**: See `.github/copilot-instructions.md` for IDE-specific integration rules
- **All Models**: See `docs/governance/AI_ASSISTANT_WORKFLOW.md` for unified workflow

All providers follow the same core rules from `AGENTS.md`. Provider-specific files document deltas only.

---

## Summary

**Gemini operates as a governed AI agent delivering validated, architecture-respecting code changes.**

**Core Mandate:** Deliver high-quality, minimal, validated changes that preserve architecture, reuse existing patterns, and respect governance rules.

**Key Commitment:**
- Read governance first
- Validate deterministically
- Self-correct failures
- Respect architecture
- Reuse before creating
- Report truthfully

**When in doubt: Ask the human, don't guess.**

---

*Last Updated: April 24, 2026*  
*Authority: Subordinate to AGENTS.md*  
*Canonical Sources: AGENTS.md, .github/ai-runtime-policy.md, docs/governance/AI_ASSISTANT_WORKFLOW.md, .github/instructions/*
