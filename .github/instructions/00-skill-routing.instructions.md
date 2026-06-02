# 🧭 Skill Routing Instructions

> **Scope**: Skill assignment and workflow-bundle routing for all repository work.
> Subordinate to `AGENTS.md` § 0 (Non-Negotiable Rules), § 1.A (Skills Orchestration Governance), and § 20 (Build/Deployment Governance).
> **BASELINE**: Before non-trivial work, map the task to a skill bundle owner from `.github/skills/README.md`.

---

## 1. Canonical Source

Use `.github/skills/README.md` as the single source of truth for:

- Skill tracks
- Specialized skills
- Operational Workflow Bundles (1-8)
- Bundle-to-owner mapping

Do not invent parallel skill maps outside the catalog.

---

## 2. Mandatory Routing Rules

Before implementation:

1. Identify the matching **Operational Workflow Bundle (1-8)**.
2. Select a **primary owner skill** for the task.
3. If scope spans multiple bundles, assign supporting skills explicitly.
4. Execute using existing `package.json` script chains owned by the selected bundle.

For multi-phase work, keep the same primary owner unless the task intent changes.

---

## 3. Bundle Routing Matrix (Authoritative Summary)

| Bundle | Scope                                 | Primary Skills                                                                                         |
| ------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1      | Quality execution pipeline            | `testing-quality-gate-runner`, `gate-segment-orchestrator`                                             |
| 2      | Monorepo/workspace operations         | `pnpm-monorepo-workflow`, `workspace-matrix-operator`                                                  |
| 3      | Platform build and packaging          | `build-packaging-orchestrator`, `electron-capacitor-platform-specialist`, `mobile-readiness-validator` |
| 4      | Compliance and dashboard pipelines    | `documentation-governance-curator`, `compliance-pipeline-manager`                                      |
| 5      | DevEx automation and static tooling   | `toolchain-automation-engineer`, `frontend-architecture-guardian`                                      |
| 6      | Release and changelog train           | `commit-compliance-enforcer`, `release-train-manager`                                                  |
| 7      | WASM and performance regression guard | `performance-optimizer`, `wasm-regression-analyst`                                                     |
| 8      | App-targeted execution runbooks       | `app-runbook-specialist`, `workspace-matrix-operator`                                                  |

---

## 4. Guardrails

- Do not bypass owner bundles for complex work.
- Do not run undocumented command chains when equivalent scripted chains exist.
- Do not leave skill files and script reality out of sync.
- Do not duplicate ownership boundaries across multiple skill definitions.

---

## 5. Validation Checklist

- [ ] Task mapped to a bundle in `.github/skills/README.md`
- [ ] Primary owner skill selected
- [ ] Supporting skills declared (if multi-bundle)
- [ ] Existing script chain used (no ad hoc replacement)
- [ ] Output and handoff align with bundle Definition of Done
