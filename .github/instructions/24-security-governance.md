# Security Governance and Authoritative Sources

> **Authority**: `AGENTS.md` § 24, `.github/instructions/10-security.instructions.md`,
> and the detailed reference at
> `docs/reference/instructions/24-security-governance.detail.md`.

## Default Context

This file is a compact routing stub. Load the detailed reference only when a
task needs OWASP/CWE/CVE mapping, source authority, supply-chain policy,
security compliance evidence, or detailed enforcement mapping.

## Required Rules

- Apply defense in depth, least privilege, and default-deny authorization where
  relevant.
- Validate inputs, URLs, content types, methods, and environment configuration
  at trust boundaries.
- Do not hardcode or expose secrets.
- Keep security-relevant changes auditable through tests or explicit evidence.
- Follow `AGENTS.md` § 0.A for validation and self-correction.
