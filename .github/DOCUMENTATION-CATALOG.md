# .github Documentation Catalog

This catalog formalizes markdown documentation under `.github/` for governance, implementation reports, and operational runbooks.

## Metadata Standard

- **Category**: governance | implementation | operations | planning | quality | policy
- **Status**: active | snapshot | archived-candidate
- **Scope**: repository | app-specific | workflow
- **Owner**: team or role responsible for updates

## Catalog

| File | Title | Category | Status | Scope | Owner | Action |
|---|---|---|---|---|---|---|
| `ACCESSIBILITY-AUDIT-REPORT.md` | Accessibility Audit Report (WCAG 2.1 AA) | quality | snapshot | repository | QA/Accessibility | merge-to-instructions (`09-wcag-accessibility.instructions.md`) then archive-candidate |
| `AUTOMATED-TESTING-GUIDE.md` | Automated Testing Guide — axe + Lighthouse + Playwright + Mobile | operations | active | workflow | QA/DevEx | keep |
| `CI-CD-SETUP.md` | CI/CD Pipeline & Validation Gates | operations | active | workflow | DevOps | keep |
| `COMPLETE-ACCESSIBILITY-IMPLEMENTATION-REPORT.md` | Complete Accessibility Implementation Report | implementation | snapshot | repository | UI Platform | merge key guardrails to accessibility instructions, then archive-candidate |
| `DEPLOYMENT-RESULTS.md` | Deployment Results & Status Summary | operations | snapshot | repository | DevOps | archive-candidate |
| `GOVERNANCE-STATUS.md` | Governance Status Report | governance | active | repository | Architecture | keep |
| `HAMBURGER-MENU-COMPLETION.md` | Hamburger Menu Refinement — Completion Summary | implementation | snapshot | app-specific | UI Platform | merge durable rules to `13`/`06` instructions, then archive-candidate |
| `INSTRUCTION-FILE-CONSOLIDATION-SUMMARY.md` | Instruction File Consolidation Summary | governance | snapshot | repository | Architecture | archive-candidate |
| `LINT-PERFORMANCE-ANALYSIS.md` | ESLint Performance Analysis & Findings | quality | snapshot | workflow | DevEx | merge durable lint guidance to build/frontend instructions, then archive-candidate |
| `NEW-APP-TEMPLATE.md` | New Game App Template | planning | active | repository | Architecture | keep |
| `NIM-ALIGNMENT-REMAINING-WORK.md` | Nim Architecture Alignment — Remaining Work | planning | active | app-specific | App Owner | keep (until closed), then archive-candidate |
| `PHASE-1-COMPLETE.md` | DEPLOYMENT COMPLETE — Final Status Report | operations | snapshot | repository | DevOps | archive-candidate |
| `PULL_REQUEST_TEMPLATE.md` | PR Review Checklist — Input Controls & Cross-Platform UX | governance | active | workflow | Maintainers | keep |
| `RESPONSIVE-TESTING-CHECKLIST.md` | Responsive Testing Checklist — Settings Modal Integration | quality | active | workflow | QA | keep |
| `SETTINGS-MODAL-COMPLETION.md` | Settings Modal Implementation Report | implementation | snapshot | app-specific | UI Platform | merge durable rules to responsive/input instructions, then archive-candidate |
| `WAVE-A-EXECUTION-TRACKER.md` | Wave A: Execution Tracker & Progress Log | planning | snapshot | repository | Modernization Team | archive-candidate |
| `WAVE-A-HOOK-DUPLICATION-AUDIT.md` | Wave A: App-Local Hook Duplication Audit | quality | snapshot | repository | Modernization Team | keep as audit evidence or archive-candidate after sign-off |
| `WAVE-A-INDEX.md` | Wave A Complete: Documentation Index & Quick Start | planning | active | repository | Modernization Team | merge useful pointers into this catalog, then archive-candidate |
| `WAVE-A-PHASE-1-IMPLEMENTATION.md` | Wave A Phase 1: Factory Consolidation Implementation Plan | planning | snapshot | repository | Modernization Team | archive-candidate |
| `WAVE-A-READY.md` | Wave A: Complete Analysis & Execution Ready | planning | snapshot | repository | Modernization Team | archive-candidate |
| `WAVE-A-SUMMARY.md` | Wave A: Complete Summary & Status | planning | snapshot | repository | Modernization Team | archive-candidate |
| `copilot-instructions.md` | Copilot Runtime Policy — Nim | policy | active | repository | Architecture | keep (authoritative runtime policy) |

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

## Triage Policy for ALL-CAPS Docs

- Prefer `keep` only for documents used as current operational policy, workflow checklist, or template.
- For implementation/completion reports, extract durable rules into numbered instruction files, then mark as `archive-candidate`.
- Keep one canonical index (`DOCUMENTATION-CATALOG.md`) rather than multiple wave/status indexes.
- Archive-candidate files should be moved to a dated archive folder only after owner sign-off.
