# Testing Standards Instructions

> **Authority**: `AGENTS.md` § 28 and the detailed reference at
> `docs/reference/instructions/17-testing.detail.md`.

## Default Context

This file is a compact routing stub. Load the detailed reference only when a
task adds, renames, debugs, or reorganizes tests, or when framework selection is
ambiguous.

## Required Rules

- Use the repository test taxonomy: unit, integration, component, API, E2E,
  accessibility, visual, and performance.
- Use Vitest for unit, integration, component, API, and performance tests.
- Use Playwright for E2E, accessibility, and visual tests.
- Follow enforced filename patterns and run `pnpm test:names` when tests are
  added or renamed.
- Follow `AGENTS.md` § 0.A for validation and self-correction.
