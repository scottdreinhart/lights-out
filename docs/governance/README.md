# Governance Directory

> **Authority**: AGENTS.md (supreme authority)  
> **Purpose**: Repository-wide governance, architecture, and structural decisions  
> **Last Updated**: May 28, 2026 (Reorganization Complete)

---

## 📋 Overview

This directory contains all governance files that define:
- **Architecture rules** (CLEAN layers, Atomic Design)
- **Policy standards** (SOLID, DRY, SoC principles)
- **Structural contracts** (interface definitions)
- **Quality standards** (testing, commit, accessibility)
- **AI governance** (skill routing, workflows)
- **Project authority** (rules, precedence)

---

## 🏗️ Architecture & Design (Authority-Level)

| File | Authority | Purpose |
|------|-----------|---------|
| **ARCHITECTURE.md** | AGENTS.md § 3 | CLEAN + Atomic Design specification |
| **ARCHITECTURE_CONTRACT.md** | AGENTS.md § 0.4 | Interface contracts between layers |
| **ATOMIC_DESIGN_POLICY.md** | AGENTS.md § 10 | Atomic Design enforcement rules |
| **CLEAN_SOLID_DRY_SOC_POLICY.md** | AGENTS.md § 10 | SOLID principles enforcement |
| **SOLID_PATTERNS.md** | AGENTS.md § 10 | Design patterns library |
| **ARCHITECTURE_REVIEW_CHECKLIST.md** | AGENTS.md § 0 | Pre-commit architecture validation |

## 🤖 AI Governance & Workflow

| File | Authority | Purpose |
|------|-----------|---------|
| **AI_ASSISTANT_WORKFLOW.md** | AGENTS.md § 1.A | Unified workflow for all AI agents |
| **AI_TOOLS_DISCOVERY.md** | AGENTS.md § 1.A | Complete skill inventory (26 skills, 8 bundles) |
| **ROO_MODES_QUICK_START.md** | AGENTS.md § 1.A | 15 workspace Roo modes + workflows |
| **AGENT-GOVERNANCE.md** | AGENTS.md § 1.A | Agent orchestration rules |

## ✅ Quality, Testing & Standards

| File | Authority | Purpose |
|------|-----------|---------|
| **TESTING.md** | AGENTS.md § 28 | Testing frameworks & standards |
| **COMMIT_GOVERNANCE.md** | AGENTS.md § 31 | Conventional commits + Gitmoji |
| **COMMIT-ENFORCEMENT.md** | AGENTS.md § 31 | Commit message standards |
| **AUDIO_GOVERNANCE.md** | AGENTS.md § 35 | Audio system architecture |

## 📦 Dependency Management

| File | Authority | Purpose |
|------|-----------|---------|
| **DEPENDENCY_CLASSIFICATION.md** | AGENTS.md § 2, 9 | Package classification scheme |
| **DEPENDENCY_CHECKLIST.md** | AGENTS.md § 2, 9 | Dependency validation |

## 📝 Instruction & Process

| File | Authority | Purpose |
|------|-----------|---------|
| **INSTRUCTION_AUTHORING_CHECKLIST.md** | AGENTS.md § 1 | Guidelines for .instructions.md files |
| **INSTRUCTION_BASELINE_PROFILE.md** | AGENTS.md § 1 | Expected governance standards |
| **GOVERNANCE-CANONICAL-SPEC.md** | AGENTS.md § 0 | Specification format standards |

## 🔍 Consolidations (Post-Reorganization)

- **APP_FEATURE_MATRIX.md.root** — Root version (consolidate with docs/APP_FEATURE_MATRIX.md)
- **ARCHITECTURE.root.md** — Root-level architecture docs (legacy)

---

## 📊 Quick Navigation

### Looking for...

**"How do I structure a component?"**
→ [ARCHITECTURE.md](./ARCHITECTURE.md)

**"What design patterns should I use?"**
→ [SOLID_PATTERNS.md](./SOLID_PATTERNS.md) or [ATOMIC_DESIGN_POLICY.md](./ATOMIC_DESIGN_POLICY.md)

**"How do I write commits?"**
→ [COMMIT-ENFORCEMENT.md](./COMMIT-ENFORCEMENT.md)

**"What are the testing standards?"**
→ [TESTING.md](./TESTING.md)

**"How do I write an instruction file?"**
→ [INSTRUCTION_AUTHORING_CHECKLIST.md](./INSTRUCTION_AUTHORING_CHECKLIST.md)

**"What skills are available?"**
→ [AI_TOOLS_DISCOVERY.md](./AI_TOOLS_DISCOVERY.md)

**"What are the AI workflows?"**
→ [AI_ASSISTANT_WORKFLOW.md](./AI_ASSISTANT_WORKFLOW.md) or [ROO_MODES_QUICK_START.md](./ROO_MODES_QUICK_START.md)

---

## 🔐 Authority Hierarchy

1. **[AGENTS.md](../../AGENTS.md)** (Root) — Supreme Constitution (§0-§35)
2. **docs/governance/*.md** (This directory) — Modularized governance policies
3. **.github/instructions/*.md** — Domain-specific technical guidance
4. **.github/skills/README.md** — Skill routing and workflows

---

## 📚 Related Directories

- **docs/reference/** — Quick-start guides (environment, scripts)
- **docs/phase-reports/** — Session/phase deliverables
- **docs/analysis/** — Historical analysis and audit reports
- **docs/INDEX.md** — Master documentation index
- **.github/instructions/** — 26+ scoped instruction files
- **.github/skills/** — Skill definitions and workflows

---

## ✅ Reorganization Status (May 28, 2026)

- [x] Moved 50+ markdown files from root to appropriate directories
- [x] Created docs/governance/ with all policy files
- [x] Created docs/reference/ for quick-start guides
- [x] Created docs/phase-reports/ for session/phase deliverables
- [x] Created docs/analysis/ for historical analysis
- [x] Kept only 6 essential files in root (supreme governance)
- [x] Updated this README with new structure
- [x] Created docs/INDEX.md for master navigation

---

**Last Updated**: May 28, 2026  
**Status**: ✅ Complete
