---
name: workspace-matrix-operator
description: "Workspace Matrix Operator"
---

# Workspace Matrix Operator

## When to Use

- Executing workspace-wide `:ws` flows across all apps/packages
- Isolating failing projects from matrix-style monorepo runs
- Designing efficient `pnpm -r` parallel vs sequential orchestration

## Authority

- `AGENTS.md` § 0, § 2, § 5, § 20, § 22
- `WORKSPACE_SCRIPTS.md`
- `pnpm-workspace.yaml`

## Core Responsibilities

- Run monorepo workflows with correct workspace routing and shell policy
- Separate global failures from app-local failures rapidly
- Enforce pnpm-only, filtered, and repeatable execution patterns
- Keep matrix runs auditable with explicit script and package targeting

## Definition of Done

- Workspace run strategy (parallel/sequential/filter) is explicit and justified
- Failing workspace nodes are identified with rerun-ready commands
- Monorepo script execution remains policy-compliant
