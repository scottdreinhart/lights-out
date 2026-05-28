---
name: game-engine-factory-orchestrator
description: "Game Engine Factory Orchestrator"
---

# Game Engine Factory Orchestrator

## When to Use

- Building or extending shared engine archetypes in `/packages`
- Enforcing deterministic game-loop contracts across generated engines
- Standardizing variant-driven templates before app-level integration

## Authority

- `AGENTS.md` § 0, § 3, § 4, § 10, § 21
- `.github/instructions/25-game-engine-factory.instructions.md`
- `.github/instructions/00-skill-routing.instructions.md`

## Core Responsibilities

- Keep simulation logic in domain-only templates
- Enforce `update(state, input, dt)` deterministic contract
- Prevent archetype duplication across apps
- Route reusable mechanics into `/packages/game-engine-factory`
- Require tests for rules, determinism, and variant mapping

## Definition of Done

- Engine templates are deterministic and test-backed
- Variants are data-driven (no game-name branching)
- Domain/app/ui boundaries stay intact
