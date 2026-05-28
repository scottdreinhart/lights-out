# Copilot Runtime Policy

> **Authority**: Subordinate to `AGENTS.md`.
> **Canonical shared policy**: `.github/ai-runtime-policy.md`.
> **Scope**: GitHub Copilot, Copilot Chat, and Copilot-compatible IDE
> assistants.

Copilot inherits all repository AI operating rules from `AGENTS.md` and
`.github/ai-runtime-policy.md`. If this file conflicts with `AGENTS.md`,
`AGENTS.md` wins.

## Required Reading

1. `AGENTS.md` — Complete governance rules
2. `docs/governance/AI_TOOLS_DISCOVERY.md` — **Skill inventory** (26 skills + 8 bundles) — START HERE
3. `.github/instructions/00-ai-skills-routing.md` — Decision tree for skill selection
4. `.github/ai-runtime-policy.md` — Shared AI policy
5. `CLAUDE.md` and `OPENAI.md` when comparing provider behavior
6. Scoped files in `.github/instructions/` relevant to the task
7. `.github/skills/README.md` for workflow bundle routing

## Copilot-Specific Deltas

- Keep generated edits minimal and aligned with local repository patterns.
- Prefer existing `package.json` scripts and skill-owned workflow chains.
- For generated game specifications, follow the relevant prompt packs and
  scoped instruction files before producing implementation guidance.
- Endless-runner output must follow
  `.github/instructions/22-endless-runner.instructions.md` and its canonical
  schema/template assets.
- Treat `pressure`, `intensity`, `focus`, and `progress` as shared gameplay
  signals per `AGENTS.md` “Signal-Driven Game Governance”; signal shells
  without a playable loop are scaffolds, not finished games.- All shell scripts (`.sh`) and Node.js scripts (`.mjs`) must follow 
  [`docs/SCRIPT-STANDARDS.md`](../../docs/SCRIPT-STANDARDS.md) for ANSI color palette, emoji usage, 
  and output formatting consistency.
## Completion Rule

Copilot agents must report validation exactly as required by
`.github/ai-runtime-policy.md`. Do not claim completion when required checks
fail for Copilot-authored changes.
