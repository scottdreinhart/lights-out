# Agent Guardrails

> **Purpose**: Generated guardrails for agents operating in this repository.
> This document is informational and summarizes mandatory constraints from
> repository governance, instruction files, and skill routing.

## Non-Negotiables

- Follow `AGENTS.md` § 0 for non-negotiable operating rules.
- Follow `AGENTS.md` § 0.A for validation and self-correction.
- Follow `AGENTS.md` § 1.A for skill routing.
- Follow `AGENTS.md` § 2 for pnpm-only package manager rules.
- Follow `AGENTS.md` § 3-4 for architecture and path discipline.

## Architecture Guardrails

Follow `AGENTS.md` § 3-4 for layer boundaries, public barrels, aliases, and
cross-layer import restrictions.

## React and Frontend Guardrails

- Keep React as shell, composition, HUD, and view orchestration.
- Keep deterministic game simulation and rules outside React reconciliation.
- Use existing hooks and providers for responsive state, sound, storage, theme,
  input, and platform concerns.
- Preserve visible focus, keyboard access, semantic HTML, ARIA, and contrast.
- Avoid touch-only or mouse-only paths for core flows.
- Use CSS modules or existing theme systems according to local patterns.
- Do not scatter responsive logic; use the canonical responsive state approach.

## Input and Platform Guardrails

- Map physical input to semantic actions before game handling.
- Preserve text-entry safety. Game shortcuts must not hijack typing contexts.
- Back behavior must be deterministic.
- TV and Fire TV surfaces must be fully remote reachable.
- Fire TV key support must include `37`, `38`, `39`, `40`, `13`, `4`, `179`,
  `227`, and `228`.
- Do not depend on capturing Home, Menu, or Voice Search on Fire TV.
- Lifecycle changes must pause or mute gameplay and restore coherent focus.

## Testing Guardrails

Follow `AGENTS.md` § 28 and `.github/instructions/17-testing.instructions.md`
for test taxonomy, framework selection, naming, and validation.

## Security Guardrails

Follow `AGENTS.md` § 24, `.github/instructions/10-security.instructions.md`,
and `.github/instructions/24-security-governance.md`.

## Build and Packaging Guardrails

- Use root and app-local scripts as the command source of truth.
- Keep Electron, Capacitor, WASM, and web build paths aligned with their scoped
  instruction files.
- Do not edit generated WASM outputs manually.
- Do not create orphan scripts in random languages or locations.
- Preserve output directories and cleanup conventions.
- Use platform-specific tooling only where the instructions require it.

## Documentation Guardrails

- Governance changes must be explicit, surgical, and harmonized with the
  authority hierarchy.
- New docs must state whether they are binding or informational.
- Do not duplicate canonical rules in ways that can drift; link or summarize.
- Keep generated docs aligned with actual scripts and current skill bundles.
