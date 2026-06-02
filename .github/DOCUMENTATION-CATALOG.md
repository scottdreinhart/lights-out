# .github Documentation Catalog

This catalog formalizes markdown documentation under `.github/` for governance, implementation reports, and operational runbooks.

## Metadata Standard

- **Category**: governance | implementation | operations | planning | quality | policy
- **Status**: active | snapshot | archived-candidate
- **Scope**: repository | app-specific | workflow
- **Owner**: team or role responsible for updates
- **Default context**: active policy, instruction, skill, template, and workflow
  docs only; historical/status/snapshot docs are discoverable evidence and must
  not be preloaded.

## Catalog

| File | Title | Category | Status | Scope | Owner | Action |
|---|---|---|---|---|---|---|
| `../docs/evidence/github/ACCESSIBILITY-AUDIT-REPORT.md` | Accessibility Audit Report (WCAG 2.1 AA) | quality | snapshot | repository | QA/Accessibility | evidence only; no default context |
| `AUTOMATED-TESTING-GUIDE.md` | Automated Testing Guide — axe + Lighthouse + Playwright + Mobile | operations | active | workflow | QA/DevEx | keep |
| `CI-CD-SETUP.md` | CI/CD Pipeline & Validation Gates | operations | active | workflow | DevOps | keep |
| `../docs/evidence/github/COMPLETE-ACCESSIBILITY-IMPLEMENTATION-REPORT.md` | Complete Accessibility Implementation Report | implementation | snapshot | repository | UI Platform | evidence only; no default context |
| `../docs/archive/evidence/github/DEPLOYMENT-RESULTS.md` | Deployment Results & Status Summary | operations | archived-candidate | repository | DevOps | archived to docs/archive |
| `../docs/evidence/github/GOVERNANCE-STATUS.md` | Governance Status Report | governance | snapshot | repository | Architecture | evidence only; no default context |
| `../docs/archive/evidence/github/HAMBURGER-MENU-COMPLETION.md` | Hamburger Menu Refinement Completion Summary | implementation | archived-candidate | app-specific | UI Platform | archived to docs/archive |
| `../docs/archive/evidence/github/INSTRUCTION-FILE-CONSOLIDATION-SUMMARY.md` | Instruction File Consolidation Summary | governance | archived-candidate | repository | Architecture | archived to docs/archive |
| `../docs/evidence/github/LINT-PERFORMANCE-ANALYSIS.md` | ESLint Performance Analysis and Findings | quality | snapshot | workflow | DevEx | evidence only; no default context |
| `NEW-APP-TEMPLATE.md` | New Game App Template | planning | active | repository | Architecture | keep |
| `../docs/evidence/github/NIM-ALIGNMENT-REMAINING-WORK.md` | Nim Architecture Alignment Remaining Work | planning | snapshot | app-specific | App Owner | evidence only; no default context |
| `../docs/archive/phase-reports/PHASE-1-COMPLETE.md` | Deployment Complete Final Status Report | operations | snapshot | repository | DevOps | evidence only; no default context |
| `PULL_REQUEST_TEMPLATE.md` | PR Review Checklist — Input Controls & Cross-Platform UX | governance | active | workflow | Maintainers | keep |
| `instructions/22-endless-runner.instructions.md` | Endless Runner Generation Instructions | governance | active | workflow | Architecture | keep |
| `instructions/26-vector-assault.instructions.md` | Vector Assault Hybrid Arena Shooter Instructions | governance | active | app-specific | Architecture | keep |
| `instructions/25-game-engine-factory.instructions.md` | Game Engine Factory Instructions | governance | active | workflow | Architecture | keep |
| `prompts/endless-runner/README.md` | Endless Runner Prompt Pack | operations | active | workflow | Architecture | keep |
| `prompts/vector-assault/README.md` | Vector Assault Ingestion Pack | operations | active | app-specific | Architecture | keep |
| `prompts/game-engine-factory/super-prompt.txt` | Game Engine Factory Super Prompt | operations | active | workflow | Architecture | keep |
| `skills/README.md` | Skills Catalog — Tracks, Specialists, and Workflow Bundles | governance | active | workflow | Architecture | keep (canonical skill routing index) |
| `ai-runtime-policy.md` | Canonical AI Runtime Policy | policy | active | repository | Architecture | keep (shared AI-agent policy) |
| `openai-instructions.md` | OpenAI Runtime Policy Shim | policy | active | repository | Architecture | keep (OpenAI/Codex ingestion shim) |
| `RESPONSIVE-TESTING-CHECKLIST.md` | Responsive Testing Checklist — Settings Modal Integration | quality | active | workflow | QA | keep |
| `../docs/evidence/github/SETTINGS-MODAL-COMPLETION.md` | Settings Modal Implementation Report | implementation | snapshot | app-specific | UI Platform | evidence only; no default context |
| `../docs/evidence/github/WAVE-A-EXECUTION-TRACKER.md` | Wave A Execution Tracker and Progress Log | planning | snapshot | repository | Modernization Team | evidence only; no default context |
| `../docs/evidence/github/WAVE-A-HOOK-DUPLICATION-AUDIT.md` | Wave A App-Local Hook Duplication Audit | quality | snapshot | repository | Modernization Team | evidence only; no default context |
| `../docs/evidence/github/WAVE-A-INDEX.md` | Wave A Documentation Index and Quick Start | planning | snapshot | repository | Modernization Team | evidence only; no default context |
| `../docs/evidence/github/WAVE-A-PHASE-1-IMPLEMENTATION.md` | Wave A Phase 1 Factory Consolidation Plan | planning | snapshot | repository | Modernization Team | evidence only; no default context |
| `../docs/evidence/github/WAVE-A-READY.md` | Wave A Complete Analysis and Execution Ready | planning | snapshot | repository | Modernization Team | evidence only; no default context |
| `../docs/evidence/github/WAVE-A-SUMMARY.md` | Wave A Complete Summary and Status | planning | snapshot | repository | Modernization Team | evidence only; no default context |
| `copilot-instructions.md` | Copilot Runtime Policy Shim | policy | active | repository | Architecture | keep (Copilot provider shim) |

## Normalization Guidance

For future formalization, each markdown file should include YAML frontmatter:

```yaml
---
title: "..."
category: governance|implementation|operations|planning|quality|policy
status: active|snapshot|archived-candidate
scope: repository|app-specific|workflow
owner: "..."
lastReviewed: "YYYY-MM-DD"
---
```

## Ingestion Notes

- This catalog is an index/metadata layer and does not rewrite source documents.
- Use it to drive phased frontmatter normalization and lifecycle cleanup.
- Default context should include active policy, instruction, skill, template, and
  workflow docs only.
- Historical/status/snapshot docs must be loaded only when the task explicitly
  needs audit evidence, migration history, or implementation provenance.

## Triage Policy for ALL-CAPS Docs

- Prefer `keep` only for documents used as current operational policy, workflow checklist, or template.
- For implementation/completion reports, extract durable rules into numbered instruction files, then mark as `archive-candidate`.
- Keep one canonical index (`DOCUMENTATION-CATALOG.md`) rather than multiple wave/status indexes.
- Archive-candidate files should be moved to a dated archive folder only after owner sign-off.
- Do not preload ALL-CAPS status, phase, wave, audit, completion, or implementation
  report files by default.
