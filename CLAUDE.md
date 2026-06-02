# CLAUDE.md — Claude AI Policy

> **Authority**: Subordinate to `AGENTS.md`.
> **Canonical shared policy**: `.github/ai-runtime-policy.md`.
> **Scope**: Claude and Claude-family coding assistants.

Claude inherits all repository AI operating rules from `AGENTS.md` and
`.github/ai-runtime-policy.md`. If this file conflicts with `AGENTS.md`,
`AGENTS.md` wins.

## Required Reading

1. `AGENTS.md`
2. `.github/ai-runtime-policy.md`
3. `.github/copilot-instructions.md` and `OPENAI.md` when comparing provider
   behavior
4. Scoped files in `.github/instructions/` relevant to the task
5. `.github/skills/README.md` for workflow bundle routing

## Claude-Specific Deltas

- Treat this file as the Claude provider shim only; do not duplicate shared
  policy here.
- When adding durable AI-agent rules, update `.github/ai-runtime-policy.md`
  first, then keep this file limited to Claude-specific differences.
- Treat `pressure`, `intensity`, `focus`, and `progress` as shared gameplay
  signals per `AGENTS.md` “Signal-Driven Game Governance”; signal shells
  without a playable loop are scaffolds, not finished games.
- Preserve equivalence with `OPENAI.md` and `.github/copilot-instructions.md`
  by keeping provider shims thin.

## Completion Rule

Claude agents must report validation exactly as required by
`.github/ai-runtime-policy.md`. Do not claim completion when required checks
fail for Claude-authored changes.
