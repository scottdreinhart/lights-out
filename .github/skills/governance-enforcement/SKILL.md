---
name: governance-enforcement
description: "Governance Enforcement"
---

# Governance Enforcement

## When to Use

- Enforcing repository governance, boundaries, and quality expectations
- Reviewing work that touches architecture, validation, or execution rules
- Requiring deterministic checks instead of ad hoc judgment

## Authority

- `AGENTS.md` § 0, § 1.A, § 3, § 20, § 22, § 28
- `.github/skills/README.md`

## Core Responsibilities

- Enforce CLEAN, SOLID, DRY, and separation-of-concerns constraints
- Keep skill routing aligned with the canonical bundle matrix
- Ensure validation uses approved pnpm scripts and documented workflows
- Surface governance drift instead of silently bypassing it

## Definition of Done

- Governance rules are clear, discoverable, and executable
- Skill routing and script chains stay in sync with repository policy
- Any drift is identified with a concrete follow-up action

- enforce CLEAN + SOLID + DRY + SoC
- preserve import boundaries
- split large files by responsibility
- never bypass architecture for convenience
- validate using pnpm scripts

---

## Phase 5: Governance Enforcement Integration

### Cross-Skill Validation Matrix

```typescript
// scripts/validate-governance-integration.mjs
const GOVERNANCE_MATRIX = {
  // Security Governance ↔ All Skills
  'security-governance': {
    'compliance-pipeline-manager': 'Security thresholds in compliance data',
    'documentation-governance-curator': 'OWASP references in authority catalog',
    'testing-quality-gate-runner': 'Security test templates enforced',
    'governance-enforcement': 'POLP + RBS rules validated',
  },
  // Compliance Pipeline ↔ All Skills
  'compliance-pipeline-manager': {
    'security-governance': 'Compliance dashboard fed by security patterns',
    'documentation-governance-curator': 'Audit trail documented with version links',
    'testing-quality-gate-runner': 'Test coverage feeds compliance score',
    'governance-enforcement': 'Threshold violations escalated to owners',
  },
  // Documentation ↔ All Skills
  'documentation-governance-curator': {
    'security-governance': 'All OWASP refs linked and functional',
    'compliance-pipeline-manager': 'Reporting templates use consistent format',
    'testing-quality-gate-runner': 'Test taxonomy documented and indexed',
    'governance-enforcement': 'Authority precedence chain documented',
  },
  // Testing ↔ All Skills
  'testing-quality-gate-runner': {
    'security-governance': 'Security test templates in DEVELOPER_WORKFLOW.md',
    'compliance-pipeline-manager': 'Test coverage drives compliance metrics',
    'documentation-governance-curator': 'Test naming rules documented',
    'governance-enforcement': 'Vitest/Playwright separation enforced',
  },
};

const validateGovernanceIntegration = async () => {
  const failures = [];

  for (const [skill, dependencies] of Object.entries(GOVERNANCE_MATRIX)) {
    for (const [depSkill, requirement] of Object.entries(dependencies)) {
      const isValid = await checkIntegration(skill, depSkill, requirement);
      if (!isValid) {
        failures.push({
          from: skill,
          to: depSkill,
          requirement,
          action: `Verify: ${requirement}`,
        });
      }
    }
  }

  if (failures.length > 0) {
    console.error('❌ Governance integration issues:\n');
    failures.forEach((f) => {
      console.error(`  ${f.from} → ${f.to}`);
      console.error(`     Requirement: ${f.requirement}`);
      console.error(`     Action: ${f.action}\n`);
    });
    return false;
  }

  console.log('✅ All governance integrations validated');
  return true;
};
```

### Authority Link Validation

```bash
# Ensure all OWASP/MDN/CWE links are valid and current
pnpm run validate:authority-links

# Check that § references point to existing sections
pnpm run validate:governance-sections

# Verify no circular dependencies between skills
pnpm run validate:skill-dependencies

# Validate all test templates compile
pnpm run validate:test-templates
```

### Skill Routing Sync Matrix

| Operational Workflow | Primary Owner | Supporting Skills | Validation |
|---------------------|---|---|---|
| **Security Implementation** | security-governance | governance-enforcement, documentation-governance-curator | `pnpm lint` + security rules |
| **Compliance Reporting** | compliance-pipeline-manager | security-governance, testing-quality-gate-runner | `pnpm dashboard:publish-compliance` |
| **Documentation Updates** | documentation-governance-curator | governance-enforcement | `pnpm validate:doc-references` |
| **Test Execution** | testing-quality-gate-runner | security-governance, governance-enforcement | `pnpm test:names` + `pnpm test` + `pnpm test:e2e` |
| **Governance Drift Detection** | governance-enforcement | All other skills | `pnpm validate:governance-integration` |

### Final Integration Checklist

✅ **Phase 1 Complete**: DEVELOPER_WORKFLOW.md expanded from 5 to 10 OWASP categories with 6 test templates

✅ **Phase 2 Complete**: compliance-pipeline-manager enhanced with CI/CD workflows, audit trails, threshold enforcement

✅ **Phase 3 Complete**: documentation-governance-curator enhanced with authority templates, consistency checkers, version management

✅ **Phase 4 Complete**: testing-quality-gate-runner integrated with security test templates and OWASP context

✅ **Phase 5 Complete**: governance-enforcement validates all skill integrations and maintains cross-reference matrix
