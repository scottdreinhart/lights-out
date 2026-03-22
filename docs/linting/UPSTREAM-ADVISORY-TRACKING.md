# Upstream Advisory Tracking

## Scope

This note tracks unresolved upstream security advisories that remain after repository-level remediation.

## Current Status (2026-03-16)

- Local remediation completed for transitive `lodash` and `tmp` via `pnpm.overrides` in `package.json` (commit `aef84d1`).
- `pnpm audit` now reports one remaining advisory.

## Remaining Advisory

- **Package**: `yauzl`
- **Severity**: Moderate
- **Advisory**: GHSA-gmq8-994r-jv83
- **Affected Range**: `<3.2.1`
- **Patched Range**: `>=3.2.1`
- **Dependency Path**: `@capacitor/cli -> native-run -> yauzl`

## Risk Assessment

### Impact

- The issue is in build/developer tooling dependency chain, not core runtime gameplay logic.
- Potential impact is concentrated in local/CI tooling operations that exercise the affected chain.

### Likelihood

- Low to moderate for app runtime exposure.
- Moderate for tooling environments where affected package paths are exercised.

## Mitigations In Place

- Reduced total advisories from three to one by pinning safe transitive versions for `lodash` and `tmp`.
- Chose not to force-override `yauzl` to a major version because this can break Capacitor tooling behavior.
- Verified no straightforward direct Capacitor upgrade path surfaced during current audit cycle.

## Exit Criteria

This note can be closed when all of the following are true:

1. Upstream dependency chain (`@capacitor/cli` and/or `native-run`) resolves to patched `yauzl`.
2. `pnpm audit` returns zero vulnerabilities for this advisory.
3. Any temporary tracking references in PR/issue threads are updated with closure evidence.

## Follow-up Workflow

1. Monitor Capacitor and `native-run` releases for transitive dependency updates.
2. Re-run `pnpm audit` at each dependency maintenance cycle.
3. Remove this tracking item once the exit criteria are satisfied.

## PR/Issue Comment Template

Title: Remaining upstream advisory: `yauzl` via Capacitor CLI transitive dependency

Body:

- Security remediation completed for transitive `lodash` and `tmp` via `pnpm.overrides` (commit `aef84d1`).
- One moderate advisory remains: `yauzl` (GHSA-gmq8-994r-jv83), path: `@capacitor/cli -> native-run -> yauzl`.
- No clean direct upgrade path was surfaced in current constraints.
- We intentionally did not force a major override to `yauzl >= 3.2.1` due to tooling compatibility risk.
- Current posture: residual risk is primarily tooling-chain scoped; runtime app exposure is limited.
- Action: monitor upstream releases and re-run audit on each dependency refresh.
