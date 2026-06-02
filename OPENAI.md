# OPENAI.md — OpenAI AI Policy

> **Authority**: Subordinate to `AGENTS.md`.
> **Canonical shared policy**: `.github/ai-runtime-policy.md`.
> **Scope**: OpenAI, Codex, GPT-family models, and OpenAI API-powered coding
> assistants.

OpenAI agents inherit all repository AI operating rules from `AGENTS.md` and
`.github/ai-runtime-policy.md`. If this file conflicts with `AGENTS.md`,
`AGENTS.md` wins.

## Required Reading

1. `AGENTS.md`
2. `.github/ai-runtime-policy.md`
3. `.github/copilot-instructions.md` and `CLAUDE.md` when comparing provider
   behavior
4. Scoped files in `.github/instructions/` relevant to the task
5. `.github/skills/README.md` for workflow bundle routing

## OpenAI-Specific Deltas

- For current OpenAI API, SDK, model, pricing, parameter, or product behavior,
  use official OpenAI documentation as the source of truth.
- Do not rely on stale model memory for OpenAI product behavior.
- Do not expose API keys, organization IDs, project secrets, logs, prompts with
  sensitive data, or raw user data.
- Do not add OpenAI dependencies unless implementation requires them and
  existing repo dependencies cannot satisfy the task.
- Keep OpenAI integrations behind app or service boundaries, not UI components.
- Treat model output as untrusted input; validate and sanitize before use.
- Treat `pressure`, `intensity`, `focus`, and `progress` as shared gameplay
  signals per `AGENTS.md` “Signal-Driven Game Governance”; signal shells
  without a playable loop are scaffolds, not finished games.

## Completion Rule

OpenAI agents must report validation exactly as required by
`.github/ai-runtime-policy.md`. Do not claim completion when required checks
fail for OpenAI-authored changes.
