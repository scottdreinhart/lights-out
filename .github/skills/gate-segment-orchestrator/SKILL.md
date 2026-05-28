---
name: gate-segment-orchestrator
description: "Gate Segment Orchestrator"
---

# Gate Segment Orchestrator

## When to Use

- Running segmented lint/test/validation flows with controlled scope
- Triage of gate timeouts, chunk sizing, and flaky segment failures
- Fast isolation of failing segment/scope combinations in CI and local runs

## Authority

- `AGENTS.md` § 0, § 0.A, § 20, § 28
- `docs/QUALITY-GATES-WORKFLOW.md`
- `package.json` segmented gate scripts (`lint:type:*`, `lint:scope:*`, `test:*`, `validate:*`)

## Core Responsibilities

- Orchestrate quick/standard/full/strict quality gate paths by intent
- Optimize segmented execution order for fast feedback and deterministic failure isolation
- Preserve existing script chains and avoid ad hoc command drift
- Produce actionable remediation ordering by failing segment

## Definition of Done

- Failing gate is isolated to concrete segment(s) and command(s)
- Recommended rerun path is minimal, deterministic, and script-backed
- No script-chain bypasses introduced
