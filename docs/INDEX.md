# Documentation Index

> **Last Updated**: May 28, 2026  
> **Status**: Complete reorganization of 56+ markdown files

---

## 🎯 Quick Start

1. **New to the project?** → Start with [README.md](../README.md)
2. **Need project governance?** → See [AGENTS.md](../AGENTS.md) (supreme authority)
3. **Setting up environment?** → See [docs/reference/ENVIRONMENT.md](./reference/ENVIRONMENT.md)
4. **Want to build/run?** → See [docs/reference/WORKSPACE_SCRIPTS.md](./reference/WORKSPACE_SCRIPTS.md)

---

## 📂 Documentation Structure

### Root Level (Supreme Authority)
Essential governance files that remain in repository root:
- **[AGENTS.md](../AGENTS.md)** - Non-negotiable repository rules (§0-§35)
- **[CLAUDE.md](../CLAUDE.md)** - Claude AI policy (subordinate to AGENTS.md)
- **[OPENAI.md](../OPENAI.md)** - OpenAI policy (subordinate to AGENTS.md)
- **[GEMINI.md](../GEMINI.md)** - Gemini policy (subordinate to AGENTS.md)
- **[README.md](../README.md)** - Project overview and entry point
- **[CHANGELOG.md](../CHANGELOG.md)** - Release history and version tracking

### docs/governance/
**Authority**: Project-wide governance, architecture, and structural decisions

| File | Purpose |
|------|---------|
| ARCHITECTURE.md | CLEAN + Atomic Design architecture specification (authority reference) |
| ARCHITECTURE.root.md | Root-level architecture documentation (legacy, consolidate with ARCHITECTURE.md) |
| ARCHITECTURE_CONTRACT.md | Interface contracts for layers and modules |
| ARCHITECTURE_REVIEW_CHECKLIST.md | Pre-commit architecture validation checklist |
| ATOMIC_DESIGN_POLICY.md | Atomic Design pattern enforcement rules |
| CLEAN_SOLID_DRY_SOC_POLICY.md | CLEAN, SOLID, DRY, and SoC principles |
| INSTRUCTION_AUTHORING_CHECKLIST.md | Guidelines for creating .instructions.md files |
| INSTRUCTION_BASELINE_PROFILE.md | Expected governance documentation standards |
| COMMIT-ENFORCEMENT.md | Conventional Commits and commit message standards |
| APP_FEATURE_MATRIX.md | (Root version - consolidate with docs/APP_FEATURE_MATRIX.md) |
| APP_FEATURE_MATRIX.md.root | Duplicate, merge into docs/APP_FEATURE_MATRIX.md |

**Other governance docs in this directory**:
- `README.md` - Governance directory overview
- AI_TOOLS_DISCOVERY.md - Skills and toolchain audit
- AI_ASSISTANT_WORKFLOW.md - Workflow definitions
- AGENT-GOVERNANCE.md - Agent orchestration rules
- COMMIT_GOVERNANCE.md - Commit management
- AUDIO_GOVERNANCE.md - Audio system architecture
- TESTING.md - Testing standards
- SOLID_PATTERNS.md - Design patterns
- DEPENDENCY_CLASSIFICATION.md - Dependency management
- DEPENDENCY_CHECKLIST.md - Dependency validation
- ROO_MODES_QUICK_START.md - AI/Copilot modes
- GOVERNANCE-CANONICAL-SPEC.md - Specification documents

### docs/reference/
**Purpose**: Quick-reference guides for setup and common operations

| File | Purpose |
|------|---------|
| ENVIRONMENT.md | Environment setup, Node.js versions, WSL configuration |
| WORKSPACE_SCRIPTS.md | Available pnpm scripts and CLI commands |

### docs/phase-reports/
**Purpose**: Session/phase deliverables and completion reports (transient)

These are deliverables from specific phases of development:

| Phase | Files | Purpose |
|-------|-------|---------|
| **Phase 8** | 10 files | UI frameworks consolidation (Animations, Loading, Forms) |
| **Phase 1** | 1 file | Iterative game app consolidation |
| **Sessions** | 2 files | Session completion summaries |

**Key Phase 8 Reports**:
- `PHASE_8_CONSOLIDATION_REPORT.md` - Framework analysis, consolidation roadmap
- `PHASE_8_ADOPTION_PLAYBOOK.md` - Step-by-step guides with code examples
- `PHASE_8_QUICK_REFERENCE.md` - Quick lookup tables
- `PHASE_8_CONSOLIDATION_PLAN.md` - Multi-phase adoption strategy

### docs/analysis/
**Purpose**: Historical analysis, audit reports, and past consolidation studies

| Category | Files | Purpose |
|----------|-------|---------|
| **Consolidation** | 6 files | Past consolidation audits and analyses |
| **Input Controls** | 3 files | Input mapping and control analysis |
| **Code Generation** | 3 files | Code generation system designs |
| **Audits & Reports** | 7 files | Historical audit reports |
| **Other Analysis** | 4 files | Format segmentation, board status, etc. |

**Example files**:
- `CONSOLIDATION_ANALYSIS_REPORT.md` - Initial analysis of 52 apps
- `CODE_CONSOLIDATION_OPPORTUNITIES.md` - Identified reuse opportunities
- `INPUT_PATTERNS_ANALYSIS.md` - Input control patterns across apps
- `MODERNIZATION-AUDIT-2026-04-13.md` - Modernization assessment

### docs/archive/
**Purpose**: Older documentation, historical analysis, completed work (auto-created)

Contains subdirectories for app-specific documentation:
- `battleship/` - Battleship app analysis
- `mancala/` - Mancala app analysis
- `nim/` - Nim app analysis
- `snake/` - Snake app analysis
- `tictactoe/` - TicTacToe app analysis

### docs/accessibility/
**Purpose**: Accessibility and keyboard integration guides

- `ACCESSIBILITY-KEYBOARD-HOOK-GUIDE.md` - Keyboard hook patterns
- `KEYBOARD-A11Y-INTEGRATION-EXAMPLES.md` - Integration examples

### docs/APPS.md
**Purpose**: Application registry and feature matrix

---

## 🔄 Cross-References & Related Files

### For AI Assistant Configuration
See `.github/instructions/` directory for scoped instruction files:
- `.github/instructions/00-skill-routing.instructions.md` - Skill routing logic
- `.github/instructions/01-build.instructions.md` - Build system
- `.github/instructions/02-frontend.instructions.md` - Frontend standards
- etc. (26+ instruction files total)

### For Shared Skills
See `.github/skills/` directory with skill definitions for various domains.

### For Project Configuration
- `package.json` - Root package manifest
- `pnpm-workspace.yaml` - Monorepo configuration
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Build configuration
- `vitest.config.ts` - Test configuration
- `eslint.config.js` - Linting configuration
- `playwright.config.ts` - E2E testing configuration

---

## 📊 Consolidation Summary

### Before (56 files in root)
- ❌ Disorganized structure
- ❌ Hard to navigate
- ❌ Mixed governance with transient docs
- ❌ No clear categorization

### After (6 files in root + organized structure)
- ✅ Supreme governance only in root
- ✅ Clear category structure
- ✅ Transient docs separated from governance
- ✅ Historical analysis archived
- ✅ Quick references organized

| Target | Count | Status |
|--------|-------|--------|
| **Root (essential)** | 6 | ✓ Complete |
| **docs/governance/** | 20+ | ✓ Organized |
| **docs/reference/** | 2 | ✓ Quick access |
| **docs/phase-reports/** | 13 | ✓ Phase deliverables |
| **docs/analysis/** | 23 | ✓ Historical |
| **docs/archive/** | 50+ | ✓ Existing |
| **docs/accessibility/** | 2 | ✓ Existing |

---

## 🚀 Navigation Tips

### Looking for...

**"How do I set up my environment?"**
→ [docs/reference/ENVIRONMENT.md](./reference/ENVIRONMENT.md)

**"What scripts can I run?"**
→ [docs/reference/WORKSPACE_SCRIPTS.md](./reference/WORKSPACE_SCRIPTS.md)

**"What are the repository rules?"**
→ [AGENTS.md](../AGENTS.md) (§0 for non-negotiable rules)

**"How should I architect a component?"**
→ [docs/governance/ARCHITECTURE.md](./governance/ARCHITECTURE.md)

**"How do I commit changes?"**
→ [docs/governance/COMMIT-ENFORCEMENT.md](./governance/COMMIT-ENFORCEMENT.md)

**"Phase 8 consolidation details?"**
→ [docs/phase-reports/](./phase-reports/)

**"Past consolidation analysis?"**
→ [docs/analysis/](./analysis/)

**"Accessibility guidelines?"**
→ [docs/accessibility/](./accessibility/)

---

## ✅ Reorganization Checklist

- [x] Created directory structure (governance, reference, phase-reports, analysis)
- [x] Moved 50+ markdown files from root to appropriate directories
- [x] Consolidated duplicates (APP_FEATURE_MATRIX, ARCHITECTURE variants)
- [x] Verified root-level files (only supreme governance + essential project docs)
- [x] Created this INDEX.md for navigation
- [ ] Update internal cross-references (README, navigation links)
- [ ] Update GitHub PR/issue templates to reference new doc structure
- [ ] Add breadcrumb navigation to key files
- [ ] Create per-directory README files for sub-categories

---

## 📝 Maintenance Notes

### Adding New Documentation

**If you're creating a new governance file:**
- Add to `docs/governance/`
- Reference it from AGENTS.md if it's authority-level
- Keep files focused and single-purpose

**If you're creating a phase/session report:**
- Add to `docs/phase-reports/`
- Name it `PHASE_X_*` or `SESSION_X_*`
- Add link to this INDEX.md

**If you're creating analysis/audit:**
- Add to `docs/analysis/` (or `docs/archive/` if historical)
- Group by topic if possible
- Reference in relevant governance files

---

## 🔗 Useful Links

- **Governance Authority**: [AGENTS.md](../AGENTS.md)
- **Architecture Reference**: [docs/governance/ARCHITECTURE.md](./governance/ARCHITECTURE.md)
- **Build System**: [docs/reference/WORKSPACE_SCRIPTS.md](./reference/WORKSPACE_SCRIPTS.md)
- **Testing Standards**: [docs/governance/TESTING.md](./governance/TESTING.md)
- **Skills Catalog**: [.github/skills/README.md](../.github/skills/README.md)
- **Instruction Files**: [.github/instructions/](../.github/instructions/)

---

**Generated**: May 28, 2026  
**Reorganization Status**: ✅ Complete
