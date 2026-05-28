---
name: react-vite-architecture
description: "React Vite Architecture"
---

# React Vite Architecture

## When to Use

- Designing React/Vite features within the repository architecture
- Reviewing component boundaries, hook placement, and state flow
- Preventing cross-layer coupling and oversized components

## Authority

- `AGENTS.md` § 3, § 4, § 12, § 21
- `.github/skills/README.md`

## Core Responsibilities

- Keep React code within the app/UI boundaries defined by governance
- Prefer hooks and composition over duplicated component logic
- Maintain Vite-compatible structure, exports, and module boundaries

## Definition of Done

- Component structure aligns with CLEAN + Atomic Design expectations
- Feature logic is separated from presentation and reusable where needed
- Architecture decisions are explicit and reviewable

- use React + Vite + TypeScript
- prefer functional components
- move logic into hooks/services
- avoid large components
- prefer composition
