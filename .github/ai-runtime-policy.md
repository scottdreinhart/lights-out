# AI Runtime Policy

> **Authority**: Subordinate to `AGENTS.md`.
> **Scope**: Shared runtime policy for AI coding assistants in this repository,
> including Claude, Copilot, OpenAI, Codex, GPT-family models, IDE assistants,
> and API-powered agents.

## Required Startup

Before making changes:

1. Read `AGENTS.md` first.
2. Read the provider shim: `CLAUDE.md`, `OPENAI.md`, or
   `.github/copilot-instructions.md`.
3. Read scoped `.github/instructions/*` files relevant to the task.
4. Select the owning workflow bundle from `.github/skills/README.md`.
5. Inspect root and app-local toolchain files relevant to the changed surface.
6. Search existing code, docs, scripts, tests, components, hooks, services,
   stores, packages, and patterns before creating anything new.

## Non-Negotiable Rules

- `AGENTS.md` is supreme. If documents conflict, `AGENTS.md` wins.
- Follow `AGENTS.md` § 0 for non-negotiable operating rules.
- Follow `AGENTS.md` § 0.A for Runtime Validation & Self-Correction.
- Follow `AGENTS.md` § 2 for pnpm-only package manager policy.
- Follow `AGENTS.md` § 3-4 for architecture, path, barrel, and import policy.
- Follow `AGENTS.md` § 1.A and `.github/skills/README.md` for skill routing.
- Treat deterministic repo checks as the source of truth.

## Compact References

- Skill routing: `AGENTS.md` § 1.A and `.github/skills/README.md`.
- Package manager: `AGENTS.md` § 2.
- Architecture: `AGENTS.md` § 3-4.
- Validation and self-correction: `AGENTS.md` § 0.A.
- Signal-driven game governance: `AGENTS.md` “Signal-Driven Game Governance”.
- Testing: `AGENTS.md` § 28 and `.github/instructions/17-testing.instructions.md`.
- Security: `AGENTS.md` § 24 and `.github/instructions/24-security-governance.md`.

## Default Context Loading

Load active policy, instruction, skill, template, and workflow docs by default.
Do not preload historical/status/snapshot docs; use `.github/DOCUMENTATION-CATALOG.md`
to find them only when audit evidence or provenance is explicitly needed.
Honor `.ai-context-ignore` for local AI tooling and prompt-build scripts.

## Scoped Instruction Map

- Build and packaging: `.github/instructions/01-build.instructions.md`
- Frontend architecture: `.github/instructions/02-frontend.instructions.md`
- Electron: `.github/instructions/03-electron.instructions.md`
- Capacitor and mobile: `.github/instructions/04-capacitor.instructions.md`,
  `.github/instructions/04-mobile-testing.instructions.md`,
  `.github/instructions/13-mobile-gestures.instructions.md`,
  `.github/instructions/15-app-store-compliance.instructions.md`,
  `.github/instructions/18-capacitor-conditional.instructions.md`
- WASM: `.github/instructions/05-wasm.instructions.md`
- Responsive UI: `.github/instructions/06-responsive.instructions.md`
- AI orchestration: `.github/instructions/07-ai-orchestration.instructions.md`
- Input controls: `.github/instructions/08-input-controls.instructions.md`
- Hooks: `.github/instructions/09-hook-patterns.instructions.md`
- Accessibility: `.github/instructions/09-wcag-accessibility.instructions.md`
- Security: `.github/instructions/10-security.instructions.md`,
  `.github/instructions/10-security-owasp-supplement.md`,
  `.github/instructions/24-security-governance.md`
- Performance: `.github/instructions/11-performance.instructions.md`,
  `.github/instructions/14-performance-optimization.instructions.md`
- Error handling: `.github/instructions/12-error-handling.instructions.md`
- Testing: `.github/instructions/17-testing.instructions.md`
- Node/frontend practices:
  `.github/instructions/19-nodejs-frontend-best-practices.instructions.md`
- Fire TV: `.github/instructions/21-fire-tv.instructions.md`
- Endless runners: `.github/instructions/22-endless-runner.instructions.md`
- Game engine factory:
  `.github/instructions/25-game-engine-factory.instructions.md`
- Vector Assault: `.github/instructions/26-vector-assault.instructions.md`

## Completion Report

Final responses should state:

- files changed
- behavior or governance changed
- validation commands and results
- unrelated blockers, if any
