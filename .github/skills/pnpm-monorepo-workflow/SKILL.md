---
name: pnpm-monorepo-workflow
description: "pnpm Monorepo Workflow"
---

# pnpm Monorepo Workflow

## When to Use

- Running workspace-scoped commands in a pnpm monorepo
- Choosing filtered package execution over ad hoc shell navigation
- Keeping install, run, and validation flows package-manager compliant

## Authority

- `AGENTS.md` § 2, § 5, § 20, § 22
- `.github/skills/README.md`

## Core Responsibilities

- Use pnpm filtering and workspace-aware commands consistently
- Preserve the monorepo package-manager contract
- Avoid npm, yarn, and unscoped command drift

## Definition of Done

- Commands are routed through pnpm and the workspace filter model
- Package scope is explicit and deterministic
- The workflow stays aligned with repository governance

## Commands
- pnpm --filter <pkg> run <script>
- pnpm --filter <pkg> add <dep>
- pnpm --filter <pkg> add -D <dep>

## Rules
- never run npm
- never run yarn
- always scope commands
