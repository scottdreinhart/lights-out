---
name: frontend-architecture-guardian
description: "Frontend Architecture Guardian"
---

# Frontend Architecture Guardian

## When to Use

- Enforcing CLEAN boundaries and Atomic Design in frontend changes
- Reviewing imports, layering, and hook/component placement
- Preventing architecture drift during feature work

## Authority

- `AGENTS.md` § 0, § 3, § 4, § 21
- `.github/instructions/02-frontend.instructions.md`
- `.github/instructions/06-responsive.instructions.md`
- `.github/instructions/09-hook-patterns.instructions.md`

## Core Responsibilities

- Keep Domain/App/UI boundaries intact
- Enforce barrel imports and alias usage
- Keep logic in hooks/services, not UI components
- Ensure responsive and accessibility integration patterns are followed

## Definition of Done

- No boundary violations
- No cross-layer relative imports
- Component hierarchy and hook usage aligned to repo policy
