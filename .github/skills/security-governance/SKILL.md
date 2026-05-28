---
name: security-governance
description: "Security Governance Skill"
---

# Security Governance Skill

## When to Use

Use this skill when:
- **Developing secure code** — Implementing XSS prevention, input validation, secrets management, CSRF protection
- **Reviewing security changes** — Verifying ESLint compliance, checking OWASP/CWE alignment, validating enforcement
- **Auditing compliance** — Mapping rules to OWASP Top 10, verifying dependency security, assessing governance alignment
- **Creating security patterns** — Adding new validation rules, implementing hardening measures, designing secure APIs

## Authority

**Primary Reference**: [§ 24 Security Governance & Authoritative Sources](../../instructions/24-security-governance.md)  
**Implementation Guide**: [§ 10 Security Instructions](../../instructions/10-security.instructions.md)  
**Governance Authority**: [AGENTS.md § 0 - Non-Negotiable Rules](../../../AGENTS.md)

## Core Principles

- **Authority-First**: Every rule traces to OWASP/MDN/CWE standards
- **Enforcement-Mandatory**: ESLint, TypeScript, pnpm scripts enforce all rules
- **Citation-Required**: Developers cite governance authority in code/PRs
- **Quality-Gates**: `pnpm lint`, `pnpm typecheck`, `pnpm validate` must pass
- **No-Shortcuts**: Security cannot be bypassed for convenience

## Core Responsibilities

- Map security tasks to OWASP categories, CWE identifiers, and validated patterns
- Verify enforcement exists in ESLint, TypeScript, and pnpm scripts
- Keep guidance, reviews, and audits anchored to authoritative sources
- Prefer reusable security patterns over ad hoc implementations

## Definition of Done

- Security guidance is traceable to OWASP/MDN/CWE and repository governance
- Enforcement is executable through existing lint, typecheck, and validation scripts
- Developers, reviewers, and auditors can follow the workflow without ambiguity

## Key Workflows

| Workflow | Purpose | When | Reference |
|----------|---------|------|-----------|
| **Developer** | Implement secure features with OWASP/CWE compliance | Coding security features | DEVELOPER_WORKFLOW.md |
| **Reviewer** | Verify security rules + audit trail during code review | Reviewing security PRs | REVIEWER_WORKFLOW.md |
| **Auditor** | Map governance to OWASP + verify enforcement | Compliance audits | AUDITOR_WORKFLOW.md |

## Quick Reference

### OWASP Top 10 2021 to Enforcement Mapping

| OWASP Category | CWE | ESLint Rule / Enforcement | Documentation |
|---|---|---|---|
| A01: Broken Access Control | 284, 352, 601 | security/detect-unvalidated-redirect | § 10 § 2, § 5 |
| A02: Cryptographic Failures | 327, 798 | No hard-coded secrets, .env.local | § 10 § 3 |
| A03: Injection (XSS) | 79, 89, 1333 | react/no-danger, security/detect-unsafe-regex | § 10 § 1, § 2 |
| A08: Software & Data Integrity | 1025 | Zod validation, schema parsing | § 10 § 2 |
| A10: SSRF | 918 | URL protocol validation, whitelist | § 10 § 2 |

### Pre-Commit Validation

```bash
# Developers must run before committing:
pnpm lint          # ESLint security rules
pnpm typecheck     # TypeScript strict mode
pnpm validate      # Full gate (lint + typecheck + build)
```

### Citation Format

When implementing security, cite OWASP category:

```typescript
// Prevents: OWASP A03:2021 Injection (XSS), CWE-79
// Reference: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
const isSafeContent = DOMPurify.sanitize(userInput)
```

## Skill Workflows

See individual workflow files for detailed guidance:
- **DEVELOPER_WORKFLOW.md** — Step-by-step implementation patterns
- **REVIEWER_WORKFLOW.md** — Code review checklist and verification
- **AUDITOR_WORKFLOW.md** — Compliance audit procedures
- **AGENT_INSTRUCTIONS.md** — How AI agents apply this skill
