---
name: compliance-pipeline-manager
description: "Compliance Pipeline Manager"
---

# Compliance Pipeline Manager

## When to Use

- Running compliance/matrix/threshold reporting pipelines
- Refreshing and validating dashboard-backed compliance datasets
- Auditing drift between declared governance and measured implementation

## Authority

- `AGENTS.md` § 0, § 22, § 23, § 31
- `APP_FEATURE_MATRIX.md`
- Compliance scripts in root `package.json` (`generate-compliance-data`, `validate:compliance*`, `validate:feature-thresholds`, `compliance:*`, `dashboard:*`)

## Core Responsibilities

- Orchestrate compliance data generation, validation, and dashboard publishing chain
- Enforce threshold gates and identify non-compliant categories/apps
- Keep compliance outputs synchronized with current script and governance reality
- Provide deterministic remediation ordering for failed compliance checks

## Definition of Done

- Compliance pipeline status is green or failures are categorized with exact owner/action
- Dashboard data is current and traceable to script outputs
- Threshold violations are explicit and reproducible

---

## Phase 2: CI/CD Integration Patterns

### GitHub Actions Workflow (`.github/workflows/compliance.yml`)

```yaml
name: Compliance Pipeline

on:
  schedule:
    - cron: '0 9 * * 1'  # Weekly Monday 9 AM
  workflow_dispatch:

jobs:
  compliance-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.31.0
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 24.14.0
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Generate compliance data
        run: pnpm generate-compliance-data
      
      - name: Validate compliance thresholds
        run: pnpm validate:compliance-strict || true
        continue-on-error: true
      
      - name: Report compliance status
        run: pnpm dashboard:publish-compliance
      
      - name: Notify Slack on failure
        if: failure()
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "text": "⚠️ Compliance check failed",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Compliance Pipeline Failed*\n${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Automated Policy Enforcement

```typescript
// scripts/validate-compliance-policy.mjs
import fs from 'fs';
import path from 'path';

const COMPLIANCE_THRESHOLDS = {
  'security-governance': { min: 100 },          // 100% security patterns required
  'testing-quality-gate': { min: 80 },          // 80% test coverage
  'responsive-design': { min: 90 },             // 90% device tier support
  'accessibility': { min: 85 },                 // 85% WCAG 2.1 AA compliance
  'performance': { min: 75 },                   // 75% Core Web Vitals passing
};

const validateCompliance = async () => {
  const complianceData = JSON.parse(
    fs.readFileSync('./compliance-data.json', 'utf-8')
  );

  let failures = [];
  for (const [category, threshold] of Object.entries(COMPLIANCE_THRESHOLDS)) {
    const actual = complianceData[category]?.score || 0;
    if (actual < threshold.min) {
      failures.push({
        category,
        expected: threshold.min,
        actual,
        gap: threshold.min - actual,
        owner: complianceData[category]?.owner,
        action: `Increase ${category} from ${actual}% to ${threshold.min}%`,
      });
    }
  }

  if (failures.length > 0) {
    console.error('❌ Compliance violations detected:\n');
    failures.forEach((f) => {
      console.error(`  ${f.category}: ${f.actual}% (need ${f.expected}%) [${f.owner}]`);
      console.error(`     Action: ${f.action}\n`);
    });
    process.exit(1);
  }

  console.log('✅ All compliance thresholds met');
  process.exit(0);
};

await validateCompliance();
```

### Audit Trail Documentation

```typescript
// Automated audit log (docs/COMPLIANCE-AUDIT-TRAIL.md)
interface AuditEntry {
  timestamp: Date;
  category: string;  // security-governance, testing, etc.
  status: 'PASS' | 'FAIL' | 'DRIFT';
  previousScore: number;
  currentScore: number;
  delta: number;
  changedBy: string;  // Git author
  action: string;     // What changed
  reference: string;  // PR/commit link
}

const auditLog: AuditEntry[] = [];

const recordAuditEntry = (entry: AuditEntry) => {
  auditLog.push(entry);
  
  // Append to COMPLIANCE-AUDIT-TRAIL.md
  const markdown = `
| ${entry.timestamp.toISOString()} | ${entry.category} | ${entry.status} | ${entry.previousScore}% → ${entry.currentScore}% | [${entry.changedBy}](${entry.reference}) | ${entry.action} |
`;
  
  fs.appendFileSync('docs/COMPLIANCE-AUDIT-TRAIL.md', markdown);
};
```

### Compliance Reporting Templates

```markdown
# Compliance Report Template (Weekly)

## Executive Summary
- **Overall Score**: 87% (target: 90%)
- **Status**: ⚠️ AMBER (1 category below threshold)
- **Trend**: ↑ +2% from last week

## Category Breakdown

| Category | Score | Target | Status | Owner |
|----------|-------|--------|--------|-------|
| Security Governance | 100% | 100% | ✅ | @security-team |
| Testing Quality | 78% | 80% | ❌ FAIL | @qa-team |
| Responsive Design | 92% | 90% | ✅ | @frontend-team |
| Accessibility | 88% | 85% | ✅ | @a11y-team |
| Performance | 76% | 75% | ✅ | @perf-team |

## Remediation Plan

1. **Testing Quality (78% → 80%)**
   - Add 15 security-pattern tests (estimated 2% increase)
   - Owner: @qa-team
   - Timeline: Next sprint
   - PR: [#2841](https://github.com/org/repo/pull/2841)

## Trend Analysis

- **4-week trend**: 82% → 84% → 86% → 87% ✓ Improving
- **Best performing**: Security Governance (100%)
- **Needs attention**: Testing Quality (below threshold)

## Next Review: Monday, April 21, 2026
```
