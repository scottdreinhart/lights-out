# Governance Documentation Hub

This directory contains the modularized governance policies for the repository. All documents here are subordinate to the root `AGENTS.md`.

---

## 🏗️ Architecture & Patterns
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — CLEAN Architecture, Layers, and Atomic Design.
- **[SOLID_PATTERNS.md](SOLID_PATTERNS.md)** — SOLID principles and common design patterns.

## 🤖 AI & Workflow
- **[AI_ASSISTANT_WORKFLOW.md](AI_ASSISTANT_WORKFLOW.md)** — Unified workflow for all AI agents.
- **[AI_TOOLS_DISCOVERY.md](AI_TOOLS_DISCOVERY.md)** — Complete skill inventory (26 skills), workflow bundles (1-8), and tool mapping. **Start here for Copilot/Claude.**
- **[ROO_MODES_QUICK_START.md](ROO_MODES_QUICK_START.md)** — All 15 workspace Roo modes, permissions, and workflows. **Start here for Roo Code IDE.**
- **[.github/instructions/00-ai-skills-routing.md](../../.github/instructions/00-ai-skills-routing.md)** — Decision tree for selecting the right skill/mode for any task.
- **[.github/ai-runtime-policy.md](../../.github/ai-runtime-policy.md)** — Shared runtime policy for AI tools.
- **Governance Sync mode** — Workspace-scoped Roo mode in [.roomodes](../../.roomodes) for preserving scripts, aliases, config, and governance while repairing drift or planning preservation-first updates.

## ✅ Quality, Testing & Ops
- **[TESTING.md](TESTING.md)** — Testing taxonomy, naming conventions, and frameworks.
- **[COMMIT_GOVERNANCE.md](COMMIT_GOVERNANCE.md)** — Conventional commits, Gitmoji, and auto-changelog.
- **[CSS_PERFORMANCE.md](CSS_PERFORMANCE.md)** (Planned) — Critical rendering path and Lighthouse targets.

---

## 🔐 Authority
1. **AGENTS.md** (Root) — Supreme Constitution.
2. **docs/governance/*.md** — Focused policies.
3. **.github/instructions/*.md** — Domain-specific technical guidance.
