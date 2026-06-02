# Changelog

All notable changes to the Game Platform are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Changes are generated automatically from commit history using Conventional Commits.

---

## [Unreleased] - 2026-04-12

### 📄 Documentation (docs)

- Added a central documentation classification policy in `docs/DOCUMENTATION_GOVERNANCE.md`.
- Linked docs governance policy from `docs/README.md`.
- Formalized canonical vs operational vs historical document classes and reconciliation rules against `CHANGELOG.md`.
- Clarified that root architecture documents are intentional canonical entry points and documented how they remain accessible if reorganized.
- Added explicit docs-hub links to `ARCHITECTURE.md`, `ARCHITECTURE_CONTRACT.md`, and `ARCHITECTURE_REVIEW_CHECKLIST.md`.
- Marked dated monorepo files as historical snapshots with canonical authority pointers.
- Expanded historical snapshot labeling across additional dated monorepo planning and validation documents.

### 📚 Continuous Integration (ci)

- Hardened platform governance scan behavior for large/legacy repos.
- Added `PNPM_SCAN_MODE` strategy: `governance` (default) and `strict` (full workflow sweep).
- Tuned strict scan logic to reduce false positives by excluding self-scan matches and documentation prohibition text (for example, lines that say to never use a command).
- Scoped app-layer framework import checks to domain boundaries (`apps/*/src/domain`) so React usage in app shell code is not incorrectly blocked.
- Improved fallback directory discovery performance in Bash environments without ripgrep by pruning heavy folders (`node_modules`, `.git`, build outputs).

Rationale:
- Keep pnpm-only and architecture governance strict where it matters.
- Preserve signal quality by separating true violations from policy noise.
- Maintain practical CI throughput for monorepo-scale scans.

---

## [1.0.0] - 2026-04-06

### ⭐ Features (feat)

- Complete game platform architecture with 40+ games
- CLEAN architecture layers (domain → app → ui)
- Atomic design component hierarchy (atoms → molecules → organisms)
- Multi-platform support (Electron, Capacitor mobile, Web)
- Monorepo structure with shared packages and independent game apps
- Comprehensive documentation system with multiple formats
- Commit enforcement system (Conventional Commits + commitlint + Husky)
- Automated changelog generation from commits
- Card asset system (56 blackjack cards with SVG format)
- Emoji standardization map for consistent documentation

### ❌ Bug Fixes (fix)

- Resolved project tree documentation pruning issue
- Fixed markdown formatting for better readability
- Corrected card asset inventory (56/56 verified)

### ♻️ Code Refactoring (refactor)

- Organized documentation into modular markdown files
- Consolidated project structure documentation
- Restructured governance hierarchy (AGENTS.md → CLAUDE.md → instructions)

### 📄 Documentation (docs)

- Created PROJECT_STRUCTURE_ENHANCED.md (quick reference)
- Created CARD-ASSETS.md (56 blackjack cards documented)
- Created DOCUMENTATION-INDEX.md (navigation guide)
- Created EMOJI-MAP.md (emoji standardization)
- Created COMMIT-ENFORCEMENT.md (this system)
- Generated PROJECT_STRUCTURE_DOCUMENTED_COMPLETE.txt (4,541-line tree)
- Updated AGENTS.md with comprehensive governance rules
- Created .github/instructions/ documentation library

### 🛠️ Build System (build)

- Configured standard-version for semantic versioning
- Set up Husky git hooks framework
- Integrated lint-staged for pre-commit validation
- Established pnpm monorepo configuration

### 🔒 Security (security)

- Implemented commit message validation (security type support)
- Added pre-commit quality gate enforcement
- Configured commit-driven security tracking

### ✅ Tests (test)

- Established Vitest + Playwright testing framework
- Created test naming convention validation
- Configured 8-test-type taxonomy (unit, integration, component, api, e2e, a11y, visual, perf)

### 📚 Continuous Integration (ci)

- Configured pre-commit hook enforcement
- Prepared CI/CD validation pipeline structure
- Established quality gate system

### 📚 Accessibility (a11y)

- WCAG 2.1 AA compliance standards documented
- Keyboard navigation patterns established
- Focus management framework defined

---

## Upcoming Releases

### Per-App Changelogs

Each app will receive its own `CHANGELOG.md`:

- `/apps/lights-out/CHANGELOG.md`
- `/apps/sudoku/CHANGELOG.md`
- `/apps/battleship/CHANGELOG.md`
- ... and all 40+ other games

### Deployment Summaries

`/docs/deployments/<date>.md` will track:

- What changed
- Affected systems
- Commit groups
- Release information

### Security & Maintenance Logs

- `/docs/SECURITY-CHANGES.md` — Security-related commits
- `/docs/DEPENDENCY-UPDATES.md` — Dependency management
- `/docs/MIGRATIONS.md` — Breaking changes

---

## Generation

This changelog is generated automatically from Conventional Commits using `standard-version`.

To generate a new release:

```bash
# Preview changes
pnpm release:dry

# Create release (version bump + changelog + tag)
pnpm release

# Changelog-only (no version bump)
pnpm release:changelog
```

---

## Commit Types & Emojis

| Type     | Emoji | Section       | Purpose             |
| -------- | ----- | ------------- | ------------------- |
| feat     | ⭐    | Features      | New functionality   |
| fix      | ❌    | Bug Fixes     | Bug corrections     |
| perf     | 🚀    | Performance   | Optimizations       |
| security | 🔐    | Security      | Security fixes      |
| a11y     | 📚    | Accessibility | a11y improvements   |
| refactor | ♻️    | Refactoring   | Code reorganization |
| docs     | 📄    | Documentation | Doc changes         |
| test     | ✅    | Tests         | Test changes        |
| build    | 🛠️    | Build         | Build system        |
| ci       | 🛠️    | CI            | CI/CD config        |

---

See [COMMIT-ENFORCEMENT.md](COMMIT-ENFORCEMENT.md) for complete governance information.
