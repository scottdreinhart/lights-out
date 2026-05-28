# Agent Governance

> **Purpose**: Generated operational governance for agents working in this repository.
> This document is informational. Binding authority remains `AGENTS.md`,
> `.github/copilot-instructions.md`, scoped files in `.github/instructions/`,
> and `.github/skills/README.md`.

## Authority Order

1. `AGENTS.md`
2. `.github/copilot-instructions.md`
3. `.github/instructions/*.instructions.md` and related scoped governance files
4. `.github/skills/README.md`
5. `docs/**` reference material

If documents conflict, the higher authority wins. Documentation generated under
`docs/**` must never dilute or override repository governance.

## Operating Contract

- Follow `AGENTS.md` § 0 for non-negotiable operating rules.
- Follow `AGENTS.md` § 0.A for Runtime Validation & Self-Correction.
- Follow `AGENTS.md` § 1.A and `.github/skills/README.md` for skill routing.
- Follow `AGENTS.md` § 2 for pnpm-only package manager rules.
- Follow `AGENTS.md` § 3-4 for architecture and path discipline.

## Compact References

- Skill bundle table: `.github/skills/README.md`.
- Package manager and workspace policy: `AGENTS.md` § 2.
- Architecture matrix and barrel policy: `AGENTS.md` § 3-4.
- Validation command priority and failure rules: `AGENTS.md` § 0.A.
- Test taxonomy and naming: `AGENTS.md` § 28.
- Current AI runtime policy: `.github/ai-runtime-policy.md`.

## Platform Governance

- Input controls are semantic action dispatches, not one-off raw key handlers.
- Fire TV targets must support remote-first directional navigation, explicit
  focus, deterministic back behavior, and lifecycle pause or resume handling.
- Mobile and app-store work must preserve safe areas, touch targets, offline
  behavior, lifecycle handling, accessibility, and performance targets.
- Electron and Capacitor work must use the existing platform adapters and
  script routing.

## Security Governance

- Apply role-based security and least privilege where authorization exists.
- Never hardcode secrets.
- Treat browser-exposed environment variables as public.
- Validate input, URLs, methods, content types, and JSON schemas at boundaries.
- Avoid unsafe DOM writes and dangerous HTML injection.
- Keep client-facing errors generic while logging useful diagnostic detail.
- Follow OWASP and repository security instruction files for deeper review.
