# Node.js Frontend Best Practices

> **Authority**: `AGENTS.md` § 29 and the detailed reference at
> `docs/reference/instructions/19-nodejs-frontend-best-practices.detail.md`.

## Default Context

This file is a compact routing stub. Load the detailed reference only when a
task touches async error handling, promises, naming conventions, config/env
handling, or Node-influenced frontend tooling.

## Required Rules

- Handle promise rejections explicitly.
- Prefer clear async/await flows with typed error classification.
- Use meaningful names for async functions, booleans, callbacks, and handlers.
- Validate configuration at startup boundaries where applicable.
- Follow `AGENTS.md` § 0.A for validation and self-correction.
