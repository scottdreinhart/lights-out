# AI Skills Routing Guide

**Authority**: AGENTS.md § 1.A (Skills Orchestration)  
**Updated**: May 2, 2026  
**Purpose**: Decision tree for selecting the right skill/mode/tool for any task

---

## 🚀 Start Here: "What Am I Trying To Do?"

### **TIER 1: Task Category** (First decision)

```
┌─────────────────────────────────────────────────────────────┐
│ What am I trying to accomplish?                             │
└─────────────────────────────────────────────────────────────┘
         ↓
    ┌────┴────┬────────┬─────────┬──────────┬──────────┬─────────┐
    ↓         ↓        ↓         ↓          ↓          ↓         ↓
 CODE     QUALITY   BUILD    SECURITY   PERFORMANCE DOCS    LEARN
 BUILD    GATES    RELEASE   AUDIT      OPTIMIZE   UPDATE
    │         │        │         │          │          │         │
    └─────────┴────────┴─────────┴──────────┴──────────┴─────────┘
```

---

## 🎯 DECISION TREE

### **PATH 1: Code Development**
**"I'm writing/changing code"**

→ **Is it architecture or refactoring?**
  - **YES**: Use `frontend-architecture-guardian` skill
    - Focus: CLEAN boundaries, SOLID principles, import discipline
    - Validate: `pnpm lint:architecture`
    - Read: `docs/governance/ARCHITECTURE.md`
  
  - **NO**: Is it a new game?
    - **YES**: Use `game-engine-factory-orchestrator` skill
      - Focus: Game spec design, engine architecture, difficulty curves
      - Validate: Review game spec against `.github/instructions/22-endless-runner.instructions.md`
      - Read: `AGENTS.md § 33` (Endless Runner Governance)
    
    - **NO**: Is it React/component code?
      - **YES**: Use `react-vite-architecture` skill
        - Focus: Component design, hooks, state management
        - Validate: `pnpm lint`
        - Read: `.github/instructions/02-frontend.instructions.md`
      
      - **NO**: Default to **Copilot** or **Claude** with current context

---

### **PATH 2: Quality Gates & Testing**
**"I need to validate/test code"**

→ **Is it workspace-wide validation?**
  - **YES**: Use `testing-quality-gate-runner` skill
    - Command: `pnpm validate:ws` (test:names + check:ws + build:ws)
    - Skill focus: Execute segmented quality gates
    - Read: `.github/instructions/17-testing.instructions.md`
  
  - **NO**: Is it a single app?
    - **YES**: Use `app-runbook-specialist` skill (Bundle 8)
      - Command: `pnpm --filter @games/<app> validate`
      - Skill focus: Per-app execution runbooks
      - Read: `WORKSPACE_SCRIPTS.md`
    
    - **NO**: Is it specific test type (unit/integration/e2e)?
      - **UNIT**: `pnpm test:unit`
      - **INTEGRATION**: `pnpm test:integration`
      - **COMPONENT**: `pnpm test:component`
      - **E2E**: `pnpm test:e2e`

---

### **PATH 3: Build & Release**
**"I'm building/packaging/releasing"**

→ **Is it a cross-platform build (Electron/Capacitor)?**
  - **YES**: Use `build-packaging-orchestrator` skill (Bundle 3)
    - Skill focus: Web, Electron, Capacitor, WASM builds
    - Validate: `pnpm build:ws` then check output
    - Read: `.github/instructions/03-electron.instructions.md`, `.github/instructions/04-capacitor.instructions.md`
  
  - **NO**: Is it mobile specific?
    - **YES**: Use `electron-capacitor-platform-specialist` skill (Bundle 3)
      - Focus: iOS/Android packaging via Capacitor
      - Validate: `pnpm mobile-readiness-validator`
      - Read: `.github/instructions/04-capacitor.instructions.md`
    
    - **NO**: Is it a release (version bump, changelog)?
      - **YES**: Use `release-train-manager` skill (Bundle 6)
        - Command: `pnpm release:dry` (preview), `pnpm release` (execute)
        - Focus: Conventional Commits, versioning, changelog
        - Read: `.github/instructions/31-commit-governance.md`
      
      - **NO**: Is it WASM?
        - **YES**: Use `wasm-regression-analyst` skill (Bundle 7)
          - Command: `pnpm wasm:build:check`
          - Focus: Bundle size, performance regressions
          - Validate: Check `compliance/wasm-profiles-baseline.json`

---

### **PATH 4: Security & Compliance**
**"I need to audit/secure/comply"**

→ **Is it a deep security audit (OWASP)?**
  - **YES**: Use `security-owasp-deep-auditor` skill (Bundle 4)
    - Focus: OWASP vulnerabilities, secret detection, module boundaries
    - Validate: `pnpm compliance:ci`
    - Read: `.github/instructions/10-security.instructions.md`
  
  - **NO**: Is it infrastructure security (secrets, env)?
    - **YES**: Use `security-governance` skill (Bundle 4)
      - Focus: Secret management, environment configuration
      - Validate: Check `.env.example` and ENVIRONMENT.md
      - Read: `.github/instructions/10-security.instructions.md`
    
    - **NO**: Is it compliance reporting (dashboard, features)?
      - **YES**: Use `compliance-pipeline-manager` skill (Bundle 4)
        - Command: `pnpm compliance:refresh`
        - Focus: Feature matrix, app status, compliance dashboard
        - Validate: `pnpm validate:compliance`

---

### **PATH 5: Performance & Optimization**
**"I need to optimize/profile"**

→ **Is it WASM performance?**
  - **YES**: Use `wasm-regression-analyst` skill (Bundle 7)
    - Command: `pnpm wasm:build:check`
    - Focus: Bundle size, regression detection
  
  - **NO**: Is it web performance (Core Web Vitals)?
    - **YES**: Use `performance-optimizer` skill (Bundle 7)
      - Command: `pnpm test:lighthouse`
      - Focus: FCP, LCP, CLS, CSS performance
      - Validate: Run Lighthouse audit
      - Read: `.github/instructions/20-css-performance-rendering-optimization.instructions.md`
    
    - **NO**: Is it bundle/dependency analysis?
      - **YES**: Use `pnpm-monorepo-workflow` skill (Bundle 2)
        - Commands: `pnpm depcruise`, `pnpm knip`, `pnpm codemod:list`

---

### **PATH 6: Documentation & Communication**
**"I need to write/update docs"**

→ **Is it governance documentation?**
  - **YES**: Use `documentation-governance-curator` skill (Bundle 4)
    - Focus: Governance docs, policy updates, instruction files
    - Files: AGENTS.md, .github/instructions/, docs/governance/
    - Validate: Run `pnpm lint:md`
  
  - **NO**: Use `documentation-writer` mode (workspace-scoped)
    - Focus: README, API docs, user guides
    - Files: README.md, docs/, CHANGELOG.md
    - Validate: `pnpm lint:md`

---

### **PATH 7: Infrastructure & DevOps**
**"I'm deploying/configuring infrastructure"**

→ **Use `devops` mode (workspace-scoped)**
  - Focus: CI/CD, containerization, deployment automation
  - Files: ci/, scripts/, Dockerfile, k8s/, terraform/
  - Validate: Dry-run deployments, check CI/CD logs
  - Read: `.github/instructions/03-electron.instructions.md`, `.github/instructions/04-capacitor.instructions.md`

---

### **PATH 8: Learning & Mentoring**
**"I want to learn about a concept"**

→ **Use `coding-teacher` mode (workspace-scoped)**
  - Focus: Programming concepts, architecture patterns, project guidance
  - Style: Socratic questions, progressive disclosure, code examples
  - Example: "Teach me about CLEAN architecture"
  - Validation: Ask follow-up questions, apply to real code

---

### **PATH 9: Merge Conflicts**
**"I have a merge conflict to resolve"**

→ **Use `merge-resolver` mode (workspace-scoped)**
  - Focus: Intelligent conflict resolution using git history
  - Process: Analyze blame, commit intent, propose resolution
  - Validate: Review resolved files, test build
  - Example: "Use merge-resolver mode and resolve #123 conflicts"

---

### **PATH 10: Workspace Operations**
**"I need to manage workspace/dependencies"**

→ **Use `pnpm-monorepo-workflow` skill (Bundle 2)**
  - Focus: Multi-app coordination, dependency management
  - Commands: `pnpm -r`, `pnpm --filter`, `pnpm lint:ws`, `pnpm format:ws`
  - Validate: `pnpm check:ws`
  - Read: `WORKSPACE_SCRIPTS.md`, `.github/instructions/01-build.instructions.md`

---

## 📋 Quick Lookup Table

| Task | Skill | Bundle | Command |
|------|-------|--------|---------|
| Fix architecture issues | `frontend-architecture-guardian` | 5 | `pnpm lint:architecture` |
| Design new game | `game-engine-factory-orchestrator` | - | Design spec first |
| Run quality gates | `testing-quality-gate-runner` | 1 | `pnpm validate:ws` |
| Work on single app | `app-runbook-specialist` | 8 | `pnpm --filter @games/<app> <task>` |
| Build for release | `build-packaging-orchestrator` | 3 | `pnpm build:ws` |
| Audit security | `security-owasp-deep-auditor` | 4 | `pnpm compliance:ci` |
| Optimize performance | `performance-optimizer` | 7 | `pnpm test:lighthouse` |
| Update docs | `documentation-writer` mode | - | Update docs/ |
| Deploy infrastructure | `devops` mode | - | Config ci/, scripts/ |
| Learn concept | `coding-teacher` mode | - | "Teach me about..." |
| Resolve merge conflict | `merge-resolver` mode | - | "Resolve #NNN conflicts" |
| Manage workspace | `pnpm-monorepo-workflow` | 2 | `pnpm -r <command>` |
| Update compliance | `compliance-pipeline-manager` | 4 | `pnpm compliance:refresh` |
| Check WASM regressions | `wasm-regression-analyst` | 7 | `pnpm wasm:build:check` |

---

## 🔄 Provider-Specific Notes

### **Using with GitHub Copilot**
1. Read `.github/copilot-instructions.md`
2. Mention skill or script explicitly: "Using the `testing-quality-gate-runner` skill, ..."
3. Copilot will route through Copilot-specific instructions
4. Validate with gates before claiming completion

### **Using with Claude**
1. Read `CLAUDE.md`
2. Include this routing guide in your prompt if needed
3. Claude can autonomously select skills based on task description
4. Expect detailed analysis before implementation

### **Using with Roo Code IDE**
1. Switch modes via Command Palette: "Roo: Switch Mode"
2. Select from 15 workspace modes
3. Mode provides role definition and file restrictions
4. Read `docs/governance/ROO_MODES_QUICK_START.md` for mode details

### **Using with Ollama (Local LLM)**
1. See `.github/skills/local-ollama/SKILL.md`
2. Local models can assist with code generation without internet
3. Use for boilerplate, scaffolding, exploration
4. Still validate with Copilot/Claude for complex logic

---

## 🎓 Example Workflows

### **Scenario 1: Add HamburgerMenu to All Games**
```
1. Research phase: Use project-research mode (read-only)
   - Understand existing menu patterns
   - Find HamburgerMenu template

2. Design phase: Use coding-teacher mode
   - Learn about component composition
   - Plan rollout strategy

3. Implementation: Default Copilot/Claude + governance-sync validation
   - Copy template to each game
   - Run pnpm check:ws after each batch

4. Validation: Use testing-quality-gate-runner skill
   - Command: pnpm validate:ws
```

### **Scenario 2: Optimize Lighthouse Scores**
```
1. Measure: Use performance-optimizer skill
   - Run: pnpm test:lighthouse
   - Identify failures (FCP, LCP, CLS)

2. Analyze: Use frontend-architecture-guardian skill
   - Review CSS critical path
   - Check component rendering

3. Implement: Default with performance guidance
   - Optimize CSS, fonts, images
   - Use CSS: link prefetch, font-display: swap

4. Validate: Use performance-optimizer skill
   - Rerun: pnpm test:lighthouse
   - Confirm improvement
```

### **Scenario 3: Audit Security Across Workspace**
```
1. Discovery: Use security-owasp-deep-auditor skill
   - Command: pnpm compliance:ci
   - Identify secrets, boundaries, monoliths

2. Analysis: Use security-governance skill
   - Review environment configuration
   - Check secret management

3. Remediation: Use security-review mode
   - Fix identified issues
   - Update compliance data

4. Validation: Re-run compliance:ci
```

---

## 🚨 Emergency Recovery Paths

### **"Everything is broken"**
1. Use `governance-sync` mode to validate governance rules
2. Run `pnpm validate` with errors captured
3. Use `project-research` mode to understand issue scope
4. Use `frontend-architecture-guardian` to assess damage
5. Call for help with full error context

### **"I broke something I don't understand"**
1. Use `git revert` to undo last changes
2. Use `merge-resolver` mode if conflicts occur
3. Use `project-research` mode to understand what was broken
4. Use `coding-teacher` mode to learn correct pattern
5. Re-implement carefully

### **"Quality gates are failing"**
1. Run `pnpm test:names` (test naming)
2. Run `pnpm check:ws` (lint + format + typecheck)
3. Run `pnpm build:ws` (build all apps)
4. For each failure: Read error → Fix root cause → Retest
5. Use `testing-quality-gate-runner` skill for complex failures

---

## 📚 Document Links

- **Governance**: `AGENTS.md` (complete rules)
- **Skills**: `docs/governance/AI_TOOLS_DISCOVERY.md` (26 skills + 8 bundles)
- **Modes**: `docs/governance/ROO_MODES_QUICK_START.md` (15 modes)
- **Scripts**: `WORKSPACE_SCRIPTS.md` (all scripts reference)
- **Instructions**: `.github/instructions/` (scoped guidance by task)

---

## ✅ Validation Checklist

**Before submitting work, verify:**

- [ ] Selected correct skill/mode/tool for the task
- [ ] Followed the decision tree above
- [ ] Read relevant instruction file in `.github/instructions/`
- [ ] Ran appropriate validation command (`pnpm check`, `pnpm validate:ws`, etc.)
- [ ] All quality gates passing (lint, typecheck, test, build)
- [ ] Changes preserve architecture boundaries
- [ ] No suppressed errors or warnings
- [ ] Ready for code review or merge

---

**Last Updated**: May 2, 2026  
**Authority**: AGENTS.md § 1.A (Skills Orchestration Governance)  
**Related**: `docs/governance/AI_TOOLS_DISCOVERY.md`, `docs/governance/ROO_MODES_QUICK_START.md`
