---
name: release-train-manager
description: "Release Train Manager"
---

# Release Train Manager

## When to Use

- Coordinating commit-to-release flows and semantic version progression
- Running dry-run/final release pipelines and changelog generation
- Verifying release readiness across quality and governance gates

## Authority

- `AGENTS.md` § 0, § 20, § 22, § 31
- `COMMIT-ENFORCEMENT.md`
- Root release scripts (`commit`, `cz`, `release`, `release:dry`, `release:changelog`)

## Core Responsibilities

- Enforce release sequencing discipline (quality gates before version/tag actions)
- Ensure commit semantics are sufficient for changelog/release automation
- Validate dry-run output before final release execution
- Surface blockers that invalidate release readiness

## Definition of Done

- Release path is script-backed, deterministic, and governance-compliant
- Changelog/version outputs match commit signal
- Go/no-go status is explicit with blocking reasons if any
