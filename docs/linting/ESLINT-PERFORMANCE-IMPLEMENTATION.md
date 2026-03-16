# ESLint Performance Implementation (Consolidated)

**Status**: Consolidated on 2026-03-16.

This document now serves as a compact entry point. Detailed implementation content was consolidated into canonical docs to avoid duplication drift.

## Canonical Documents

- [ESLINT-PERFORMANCE-AUDITING.md](ESLINT-PERFORMANCE-AUDITING.md) — full architecture, rationale, rollout plan, troubleshooting
- [ESLINT-PERFORMANCE-RULES-REFERENCE.md](ESLINT-PERFORMANCE-RULES-REFERENCE.md) — rule-by-rule quick lookup and severity matrix

## Quick Commands

```bash
pnpm lint:performance
pnpm lint:performance:fix
pnpm lint
pnpm validate
```

## Consolidation Notes

- Redundant “summary-of-summary” sections were removed from this file.
- Rule definitions and implementation guidance are maintained in one place each.
- Keep this file as an index only; add substantive updates to the canonical docs above.
