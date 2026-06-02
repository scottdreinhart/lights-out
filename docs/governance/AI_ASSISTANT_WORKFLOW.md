# AI Assistant Unified Workflow

**Authority**: AGENTS.md § 0 · .github/ai-runtime-policy.md
**Scope**: All AI coding assistants (Gemini, Claude, Copilot, ChatGPT, etc.)

---

## 1. Mandatory Pre-Execution Sequence

Before making ANY changes, every AI assistant MUST:

1. **Read AGENTS.md** — Especially § 0 (Rules), § 0.A (Validation), § 3 (Architecture), § 5 (Shell).
2. **Read .github/ai-runtime-policy.md** — This is the shared policy for all AI tools.
3. **Inspect the Environment** — Check `ENVIRONMENT.md` and `package.json` for current context.
4. **Research Existing Patterns** — Search `apps/` and `packages/` for similar implementations. **Reuse before creating.**
5. **Select Skill Bundle** — Route work through `.github/skills/README.md` workflow bundles.

---

## 2. Core Operational Mandates

- **Bash/POSIX Only**: Mandatory default for all dev/build tasks. PowerShell is opt-in only.
- **pnpm Only**: Never use npm or yarn.
- **CLEAN + Atomic Architecture**: Maintain layer boundaries (Domain → App → UI).
- **Barrel Pattern**: Always export via `index.ts`. Import from barrels, never internals.
- **Minimal Changes**: Surgical edits only. Do not refactor outside of the requested scope.
- **No Purges for Fixable Issues**: If a problem is caused by path case, import target, alias, or entrypoint wiring, correct the path or import with the smallest non-destructive change. Do not delete or "clean up" directories unless the directory is proven unused and the deletion is explicitly requested or verified by tests.

---

## 3. Validation & Self-Correction

- **Machine Verification**: Never claim completion without running `pnpm validate` or relevant gates.
- **Self-Correction Loop**: If a check fails, read the error, fix the root cause, and rerun. Repeat until green.
- **Forbidden**: Do not suppress lint/type errors with comments. Do not delete failing tests.

---

## 4. Platform Reinforcements

- **Gemini**: See `GEMINI.md` for CLI-specific tool usage and safety mandates.
- **Claude**: See `CLAUDE.md` for provider-specific behaviors and policy alignment.
- **Copilot**: See `.github/copilot-instructions.md` for IDE-specific integration rules.
- **Roo governance sync**: See [docs/governance/README.md](README.md) and the workspace mode in [.roomodes](../../.roomodes) when you need a preservation-first mode for governance drift, aliases, scripts, or config repairs.
