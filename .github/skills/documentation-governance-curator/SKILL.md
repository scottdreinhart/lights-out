---
name: documentation-governance-curator
description: "Documentation Governance Curator"
---

# Documentation Governance Curator

## When to Use

- Maintaining instruction coherence and documentation quality
- Consolidating overlapping governance content
- Validating doc authority chains and index/catalog integrity

## Authority

- `AGENTS.md` § 0, § 1
- `INSTRUCTION_AUTHORING_CHECKLIST.md`
- `docs/DOCUMENTATION_GOVERNANCE.md`
- `.github/DOCUMENTATION-CATALOG.md`

## Core Responsibilities

- Keep documentation aligned with governance precedence
- Reduce duplication and stale guidance across instruction files
- Maintain discoverability through canonical indexes and catalogs
- Ensure docs reflect actual scripts, architecture, and operational reality

## Definition of Done

- Documentation is consistent, current, and navigable
- Governance references are accurate and non-conflicting

---

## Phase 3: Authority Citation Templates

### Citation Style Guide

```markdown
## Authority References (Standardized Format)

### External Standards
- **OWASP Top 10 2021**: [Link to A01](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- **WCAG 2.1 Level AA**: [Link to guideline](https://www.w3.org/WAI/WCAG21/quickref/)
- **CWE**: [CWE-79 Cross-site Scripting](https://cwe.mitre.org/data/definitions/79.html)
- **MDN Web Docs**: [Web Security](https://developer.mozilla.org/en-US/docs/Web/Security/)
- **NIST Cybersecurity Framework**: [Link to CSF](https://www.nist.gov/cyberframework/)

### Internal Governance
- **AGENTS.md**: [§ 0 Non-Negotiable Rules](../../../AGENTS.md#-0-non-negotiable-ai-operating-rules)
- **Security Instructions**: [§ 10 Security Governance](../../instructions/10-security.instructions.md)
- **Testing Standards**: [§ 28 Testing Governance](../../../AGENTS.md#-28-testing-governance--standards-mandatory)
- **Accessibility**: [§ 23 Accessibility Governance](../../../AGENTS.md#-23-accessibility-governance-mandatory)

### Citation Authority Precedence
1. **Supreme Authority**: AGENTS.md § 0
2. **Governance**: AGENTS.md § (specific section)
3. **Scoped Instructions**: `.github/instructions/*.md`
4. **Skill Files**: `.github/skills/*/SKILL.md`
5. **External Standards**: OWASP, WCAG, CWE, NIST, MDN
```

## Documentation Consistency Checkers

### Broken Reference Validator

```typescript
// scripts/validate-doc-references.mjs
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const validateReferences = async () => {
  const docs = await glob('.github/**/*.md');
  const errors = [];

  for (const doc of docs) {
    const content = fs.readFileSync(doc, 'utf-8');
    
    // Find all markdown links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      const [, text, href] = match;
      
      // Skip external URLs
      if (href.startsWith('http')) continue;
      
      // Check internal file exists
      const resolvedPath = path.resolve(path.dirname(doc), href.split('#')[0]);
      if (!fs.existsSync(resolvedPath)) {
        errors.push({
          file: doc,
          link: href,
          text,
          error: `File not found: ${resolvedPath}`,
        });
      }
    }
  }

  if (errors.length > 0) {
    console.error('❌ Broken documentation references:\n');
    errors.forEach((e) => {
      console.error(`  ${e.file}: [${e.text}](${e.link})`);
      console.error(`     ${e.error}\n`);
    });
    process.exit(1);
  }

  console.log('✅ All documentation references valid');
};

await validateReferences();
```

## Version Management Patterns

```markdown
# Documentation Versioning Strategy

## Version Lifecycle

| Status | Definition | Action |
|--------|-----------|--------|
| **STABLE** | Used by all apps in production | No breaking changes |
| **EVOLVING** | New patterns under evaluation | Breaking changes documented |
| **DEPRECATED** | Being phased out, replacements exist | Migration guide required |
| **ARCHIVED** | No longer used, historical reference | Read-only, no maintenance |

## Breaking Change Documentation

When documenting a breaking change:

```markdown
## ⚠️ BREAKING CHANGE v2.0.0

**What Changed**: Description of the change

**Why**: Rationale for the breaking change

**Old Pattern**:
```typescript
// Code example showing old way
```

**New Pattern**:
```typescript
// Code example showing new way
```

**Migration Path**:
1. Step 1: Describe first step
2. Step 2: Describe second step
3. Step 3: Verify migration complete

**Timeline**: Deprecated v1.9.x, removed v2.0.0

**Issue**: [#1234](https://github.com/org/repo/issues/1234)
```
```
