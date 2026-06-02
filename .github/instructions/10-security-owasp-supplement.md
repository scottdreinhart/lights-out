# Security Governance — OWASP Supplement

> **Authority**: `AGENTS.md` § 24, `.github/instructions/10-security.instructions.md`,
> and the detailed reference at
> `docs/reference/instructions/10-security-owasp-supplement.detail.md`.

## Default Context

This file is a compact routing stub. Load the detailed reference only when a
task touches XSS hardening, backend request handling, async safety, event-loop
protection, secrets, cookies, security headers, logging, or OWASP mapping.

## Required Rules

- Treat untrusted input and model output as unsafe until validated.
- Do not use unsafe DOM or HTML APIs without explicit sanitization.
- Do not leak secrets, sensitive logs, stack traces, or internal errors.
- Prefer allowlists for protocols, redirects, methods, and content types.
- Follow `AGENTS.md` § 0.A for validation and self-correction.
