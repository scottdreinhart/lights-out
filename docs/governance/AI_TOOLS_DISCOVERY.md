# AI Tools & Skills Discovery Guide

**Authority**: AGENTS.md § 1.A (Skills Orchestration)  
**Updated**: May 2, 2026  
**Purpose**: Single source of truth for all AI tools, skills, and workflow bundles

---

## 🎯 Quick Start: "What Should I Use?"

### **By Task Type** (Find your task below)

| Task | Use Skill | Use Workflow Bundle | Use Script |
|------|-----------|-------------------|------------|
| **Fix code quality issues** | `testing-quality-gate-runner` | Bundle 1 | `pnpm check:ws` |
| **Workspace-wide operations** | `pnpm-monorepo-workflow` | Bundle 2 | `pnpm validate:ws` |
| **Build/package for platforms** | `build-packaging-orchestrator` | Bundle 3 | `pnpm build:ws` |
| **Audit compliance & security** | `security-owasp-deep-auditor` | Bundle 4 | `pnpm compliance:ci` |
| **Architecture & design patterns** | `frontend-architecture-guardian` | Bundle 5 | `pnpm lint:architecture` |
| **Release & versioning** | `release-train-manager` | Bundle 6 | `pnpm release:dry` |
| **Performance & WASM** | `performance-optimizer` | Bundle 7 | `pnpm wasm:build:check` |
| **Run specific app tasks** | `app-runbook-specialist` | Bundle 8 | `pnpm <app>:web:validate` |

---

## 🛠️ Complete Skill Inventory (26 Skills)

### **Track 1: Core Engineering** (5 skills)

#### `frontend-architecture-guardian`
- **Purpose**: Validate CLEAN/SOLID architecture, layer boundaries, import discipline
- **When to use**: Refactoring code, reviewing architecture, enforcing separation of concerns
- **Key files**: `docs/governance/ARCHITECTURE.md`, `eslint.config.js`
- **Example**: `"Help me fix architecture violations in apps/checkers"`

#### `build-packaging-orchestrator`
- **Purpose**: Cross-platform builds (Web, Electron, Capacitor, WASM)
- **When to use**: Building for release, packaging for app stores, platform-specific builds
- **Key files**: `vite.config.ts`, `playwright.config.ts`, `plopfile.cjs`
- **Example**: `"Package the Electron app for Windows and Linux"`

#### `testing-quality-gate-runner`
- **Purpose**: Execute validation pipelines (test:names, lint, typecheck, build)
- **When to use**: Running quality gates, CI/CD validation, pre-commit checks
- **Key files**: `.github/instructions/17-testing.instructions.md`
- **Example**: `"Run full validation for all apps"`

#### `security-owasp-deep-auditor`
- **Purpose**: Security audits, OWASP compliance, secret detection, module boundary analysis
- **When to use**: Security reviews, finding exposed secrets, architecture security
- **Key files**: `.github/instructions/10-security.instructions.md`, `compliance/`
- **Example**: `"Audit all apps for exposed environment variables"`

#### `game-engine-factory-orchestrator`
- **Purpose**: Generate game specs, validate game engines, endless-runner designs
- **When to use**: Creating new games, validating game architecture, designing game loops
- **Key files**: `.github/instructions/22-endless-runner.instructions.md`
- **Example**: `"Design a new endless-runner game with specific difficulty curve"`

---

### **Track 2: Platform** (4 skills)

#### `mobile-readiness-validator`
- **Purpose**: Validate iOS/Android readiness via Capacitor
- **When to use**: Mobile platform testing, app store compliance, device compatibility
- **Key files**: `.github/instructions/04-capacitor.instructions.md`
- **Example**: `"Validate app for iOS App Store submission"`

#### `input-controls-specialist`
- **Purpose**: Keyboard/gamepad/touch input validation, Fire TV compatibility
- **When to use**: Input system design, accessibility testing, multi-platform controls
- **Key files**: `.github/instructions/08-input-controls.instructions.md`, `.github/instructions/21-fire-tv.instructions.md`
- **Example**: `"Ensure app works with Fire TV remote controls"`

#### `fire-tv-platform-specialist`
- **Purpose**: Fire TV web app optimization, remote input mapping, 10-foot UI
- **When to use**: Fire TV deployment, TV-optimized UX, remote navigation testing
- **Key files**: `.github/instructions/21-fire-tv.instructions.md`, `AGENTS.md § 32`
- **Example**: `"Make this game compatible with Fire TV including remote controls"`

#### `electron-capacitor-platform-specialist`
- **Purpose**: Electron and Capacitor platform integration, multi-shell orchestration
- **When to use**: Desktop packaging, native mobile features, cross-platform compatibility
- **Key files**: `.github/instructions/03-electron.instructions.md`, `.github/instructions/04-capacitor.instructions.md`
- **Example**: `"Package the app for Windows desktop and iOS simultaneously"`

---

### **Track 3: Quality & Governance** (4 skills)

#### `performance-optimizer`
- **Purpose**: Performance profiling, bundle optimization, Core Web Vitals
- **When to use**: Optimization work, Lighthouse audits, performance regression detection
- **Key files**: `.github/instructions/20-css-performance-rendering-optimization.instructions.md`, `compliance/wasm-profiles-baseline.json`
- **Example**: `"Profile and optimize the bingo app's Lighthouse score"`

#### `accessibility-wcag-auditor`
- **Purpose**: WCAG compliance (A, AA, AAA), a11y testing, keyboard navigation
- **When to use**: Accessibility audits, a11y testing, ensuring inclusive UX
- **Key files**: `.github/instructions/09-wcag-accessibility.instructions.md`
- **Example**: `"Audit all games for WCAG AA compliance"`

#### `commit-compliance-enforcer`
- **Purpose**: Conventional Commits, Commitizen, Gitmoji, changelog generation
- **When to use**: Commit validation, automated releases, changelog updates
- **Key files**: `.github/instructions/31-commit-governance.md`, `.github/skills/commit-compliance-enforcer/SKILL.md`
- **Example**: `"Enforce commit message standards across the team"`

#### `documentation-governance-curator`
- **Purpose**: Governance documentation, README updates, architecture docs
- **When to use**: Maintaining governance docs, updating policies, architecture documentation
- **Key files**: `docs/governance/`, `AGENTS.md`, `.github/instructions/`
- **Example**: `"Update the governance documentation for new workflow changes"`

---

### **Workflow Bundle Specialists** (7 skills)

#### `gate-segment-orchestrator`
- **Purpose**: Orchestrate segmented validation gates (lint, format, typecheck, build)
- **When to use**: Running quality gate pipelines, parallel test execution
- **Key files**: `scripts/quality-gates.sh`, `scripts/validate-gated.mjs`
- **Example**: `"Run the full quality gate pipeline for all apps"`

#### `workspace-matrix-operator`
- **Purpose**: Multi-app matrix operations, cross-app coordination
- **When to use**: Batch operations across all apps, workspace-wide analytics
- **Key files**: `scripts/validate-matrix.mjs`
- **Example**: `"Update all game apps with new feature matrix values"`

#### `compliance-pipeline-manager`
- **Purpose**: Compliance dashboard, feature matrix, app status tracking
- **When to use**: Compliance reporting, feature rollout tracking, dashboard updates
- **Key files**: `compliance/`, `scripts/rebuild-feature-implementation-matrix.mjs`
- **Example**: `"Update the compliance dashboard with latest metrics"`

#### `toolchain-automation-engineer`
- **Purpose**: Build automation, shell scripts, task orchestration
- **When to use**: Scripting tasks, CI/CD setup, automation workflows
- **Key files**: `scripts/`, `ci/`
- **Example**: `"Create a script to run validation for a subset of apps"`

#### `release-train-manager`
- **Purpose**: Release orchestration, versioning, changelog management
- **When to use**: Release planning, version bumps, release communication
- **Key files**: `CHANGELOG.md`, standard-version config
- **Example**: `"Prepare a release with automated changelog generation"`

#### `wasm-regression-analyst`
- **Purpose**: WASM build analysis, performance regression detection
- **When to use**: WASM optimization, bundle size analysis, performance tracking
- **Key files**: `.github/skills/wasm-regression-analyst/SKILL.md`, `compliance/baselines/`
- **Example**: `"Check for WASM bundle size regressions"`

#### `app-runbook-specialist`
- **Purpose**: Per-app execution runbooks, app-specific setup and workflows
- **When to use**: App-specific tasks, per-app builds, targeted deployments
- **Key files**: `scripts/`, WORKSPACE_SCRIPTS.md`
- **Example**: `"Build and validate just the checkers app"`

---

### **Foundational Skills** (4 skills)

#### `governance-enforcement`
- **Purpose**: Enforce governance rules, validate compliance with AGENTS.md
- **When to use**: Policy enforcement, governance validation, rule checking
- **Key files**: `AGENTS.md`, `.github/ai-runtime-policy.md`
- **Example**: `"Validate that all changes follow governance rules"`

#### `pnpm-monorepo-workflow`
- **Purpose**: pnpm workspace operations, dependency management, monorepo structure
- **When to use**: Package management, workspace configuration, dependency updates
- **Key files**: `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `package.json`
- **Example**: `"Add a new package to the workspace and update dependencies"`

#### `react-vite-architecture`
- **Purpose**: React + TypeScript + Vite best practices, component architecture
- **When to use**: React component development, Vite configuration, build optimization
- **Key files**: `vite.config.ts`, `tsconfig.json`, `.github/instructions/02-frontend.instructions.md`
- **Example**: `"Design a new React component following project patterns"`

#### `security-governance`
- **Purpose**: Security policies, secret management, dependency security
- **When to use**: Security policy enforcement, secret vault setup, vulnerability scanning
- **Key files**: `ENVIRONMENT.md`, `.github/instructions/10-security.instructions.md`
- **Example**: `"Set up environment variables and secret management"`

#### `local-ollama`
- **Purpose**: Local LLM model orchestration (if using local Ollama for code generation)
- **When to use**: Local code generation, offline AI assistance
- **Key files**: `.github/skills/local-ollama/SKILL.md`
- **Example**: `"Generate boilerplate code using local Ollama"`

---

## 📦 Operational Workflow Bundles (1-8)

Each bundle is a **pre-composed set of skills** for a specific workflow. Select a bundle when you know the task category.

### **Bundle 1: Quality Execution Pipeline**
**When to use**: Running quality checks, validation gates, pre-commit hooks  
**Primary Skills**: `testing-quality-gate-runner`, `gate-segment-orchestrator`  
**Key Scripts**: `pnpm check:ws`, `pnpm validate:ws`, `pnpm test:names`  
**Example Workflow**:
```bash
pnpm test:names       # Validate test naming convention
pnpm check:ws         # Lint + format:check + typecheck all apps
pnpm build:ws         # Build all apps
```

### **Bundle 2: Monorepo/Workspace Operations**
**When to use**: Workspace-wide operations, dependency management, multi-app coordination  
**Primary Skills**: `pnpm-monorepo-workflow`, `workspace-matrix-operator`  
**Key Scripts**: `pnpm lint:ws`, `pnpm format:ws`, `pnpm typecheck:ws`, `pnpm clean:ws`  
**Example Workflow**:
```bash
pnpm -r install          # Install across all apps
pnpm lint:ws             # Lint all apps
pnpm format:ws           # Format all apps
```

### **Bundle 3: Platform Build & Packaging**
**When to use**: Cross-platform builds, app packaging, platform-specific releases  
**Primary Skills**: `build-packaging-orchestrator`, `electron-capacitor-platform-specialist`, `mobile-readiness-validator`  
**Key Scripts**: `pnpm build:ws`, `pnpm electron:build`, `pnpm cap:sync`, `pnpm build:preview`  
**Example Workflow**:
```bash
pnpm build:ws                      # Build for web
pnpm electron:build:win            # Package for Windows
pnpm cap:sync && pnpm cap:open:ios # Prepare iOS
```

### **Bundle 4: Compliance & Dashboard Pipelines**
**When to use**: Compliance audits, dashboard updates, security scanning, governance verification  
**Primary Skills**: `documentation-governance-curator`, `compliance-pipeline-manager`, `security-governance`, `security-owasp-deep-auditor`  
**Key Scripts**: `pnpm compliance:refresh`, `pnpm report:compliance`, `pnpm validate:compliance`  
**Example Workflow**:
```bash
pnpm compliance:refresh           # Update all compliance data
pnpm validate:compliance:detailed  # Deep compliance audit
pnpm report:platform-approval      # Generate approval report
```

### **Bundle 5: DevEx Automation & Static Tooling**
**When to use**: Developer experience improvements, tooling setup, linting configuration  
**Primary Skills**: `toolchain-automation-engineer`, `frontend-architecture-guardian`  
**Key Scripts**: `pnpm lint:architecture`, `pnpm lint:tools`, `pnpm codemod:list`  
**Example Workflow**:
```bash
pnpm lint:architecture       # Check import boundaries
pnpm lint:unused             # Find unused code
pnpm depcruise:graph         # Visualize dependencies
```

### **Bundle 6: Release & Changelog Train**
**When to use**: Release planning, version management, changelog generation  
**Primary Skills**: `commit-compliance-enforcer`, `release-train-manager`  
**Key Scripts**: `pnpm release:dry`, `pnpm release`, `pnpm commit`  
**Example Workflow**:
```bash
pnpm commit                  # Create conventional commit
pnpm release:dry            # Preview release
pnpm release                # Execute release
```

### **Bundle 7: WASM & Performance Regression Guard**
**When to use**: WASM optimization, performance profiling, bundle analysis  
**Primary Skills**: `performance-optimizer`, `wasm-regression-analyst`  
**Key Scripts**: `pnpm wasm:build`, `pnpm check:regressions`, `pnpm test:lighthouse`  
**Example Workflow**:
```bash
pnpm wasm:build              # Build WASM modules
pnpm wasm:build:check        # Build + check regressions
pnpm test:lighthouse         # Measure Core Web Vitals
```

### **Bundle 8: App-Targeted Execution Runbooks**
**When to use**: Per-app builds, app-specific validation, targeted deployments  
**Primary Skills**: `app-runbook-specialist`, `workspace-matrix-operator`  
**Key Scripts**: `pnpm <app>:web:*`, `pnpm --filter @games/<app> <task>`  
**Example Workflow**:
```bash
pnpm monchola:web:validate     # Validate monchola app
pnpm --filter @games/checkers lint:fix  # Fix checkers
```

---

## 🔄 Script → Skill Mapping

| Script | Skill | Bundle | Description |
|--------|-------|--------|-------------|
| `pnpm validate:ws` | `testing-quality-gate-runner` | 1 | Full workspace validation |
| `pnpm check:ws` | `gate-segment-orchestrator` | 1 | Lint + format + typecheck |
| `pnpm lint:ws` | `frontend-architecture-guardian` | 5 | Architecture & code quality |
| `pnpm format:ws` | `pnpm-monorepo-workflow` | 2 | Format all apps |
| `pnpm build:ws` | `build-packaging-orchestrator` | 3 | Build all apps |
| `pnpm compliance:refresh` | `compliance-pipeline-manager` | 4 | Update compliance data |
| `pnpm wasm:build:check` | `wasm-regression-analyst` | 7 | WASM + regression check |
| `pnpm release:dry` | `release-train-manager` | 6 | Preview release |
| `pnpm <app>:web:validate` | `app-runbook-specialist` | 8 | Validate single app |

---

## ⚙️ MCP Server Status

**Current State**: No dedicated MCP servers configured in this project.

**Available via VS Code Extensions**:
- GitHub Copilot (Copilot Chat, inline suggestions)
- GitHub Pull Request / Issues extension
- Playwright Test (browser automation)

**Future Consideration**: Consider MCP servers for:
- LLM-powered code analysis (Ollama)
- Custom project indexing
- Specialized linting (AST-Grep)

---

## 📚 Related Documentation

- **AGENTS.md** — Complete governance rules and architecture mandates
- **CLAUDE.md** — Claude-specific policy and best practices
- **OPENAI.md** — OpenAI/ChatGPT policy and best practices
- **.github/copilot-instructions.md** — Copilot-specific integration rules
- **docs/governance/ROO_MODES_QUICK_START.md** — Roo Code mode reference (15 modes)
- **.github/instructions/00-ai-skills-routing.md** — Decision tree for skill selection

---

## 🚀 Quick Decision Tree

**"I need to..."**

1. **Fix code quality** → Use `testing-quality-gate-runner` (Bundle 1)
2. **Work on all apps** → Use `pnpm-monorepo-workflow` (Bundle 2)
3. **Build for release** → Use `build-packaging-orchestrator` (Bundle 3)
4. **Audit security/compliance** → Use `security-owasp-deep-auditor` (Bundle 4)
5. **Improve architecture** → Use `frontend-architecture-guardian` (Bundle 5)
6. **Release + version** → Use `release-train-manager` (Bundle 6)
7. **Optimize performance** → Use `performance-optimizer` (Bundle 7)
8. **Work on one app** → Use `app-runbook-specialist` (Bundle 8)

---

**Last Updated**: May 2, 2026  
**Authority**: AGENTS.md § 1.A (Skills Orchestration Governance)
