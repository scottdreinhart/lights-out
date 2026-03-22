# ESLint Exemption Policy

This document defines the **governance, approval process, and mechanisms** for exempting code from ESLint rules.

## Philosophy

ESLint rules exist to prevent bugs, security issues, and maintainability problems. **Exemptions are exceptions, not defaults.**

- **Default**: All code must pass linting
- **Exception**: Exemptions are rare and require explicit justification
- **Accountability**: Every exemption is tracked and reviewable

## Types of Exemptions

### 1. **Approved Rule Exemptions** (Governance-Level)

Some rules are intentionally disabled or exempted in `eslint.config.js` because they conflict with project standards.

**Currently Approved Exemptions**:
- None (all 110+ rules are active)

If a rule conflicts with project standards, **update AGENTS.md § 22** (Build & Dependency Governance) to document the exemption.

### 2. **Inline Code Exemptions** (File/Block-Level)

Temporarily disable rules for specific code blocks using `eslint-disable` comments.

**Approval Process**:
1. Technical lead reviews exemption
2. Comments explain reason in detail
3. Tracked in GitHub for trending

**Format**:
```typescript
// eslint-disable-next-line rule-name
const result = eval('...')  // Only for dynamic code eval

// eslint-disable rule-name -- Reason: [explicit justification]
// ... code block ...
// eslint-enable rule-name
```

**Valid Reasons**:
- Third-party library integration (no control)
- Dynamic code generation (necessary for feature)
- Legacy code (being refactored incrementally)
- Performance critical path (after profiling proves value)
- Security exception (approved by security review)

**Invalid Reasons**:
- "Too much work to fix"
- "It's just a warning"
- "Everyone else does it"
- "I don't understand the rule"

### 3. **File-Level Exemptions**

Disable rules for entire files when the file serves a special purpose (e.g., generated code, vendor integration).

**Format** (top of file):
```typescript
/* eslint-disable rule1, rule2 -- Reason: special-purpose file */
// ... file contents ...
```

**Approval**: Pull request review required; comment in PR.

### 4. **Scope Exemptions** (Directory-Level)

Disable rules for entire directories via `eslint.config.js` (requires code change + approval).

**Example**:
```javascript
{
  files: ['src/generated/**'],
  rules: {
    'no-unused-vars': 'off',  // Generated code has unused imports
  },
},
```

**Approval**: Merge to `eslint.config.js`, documented in commit.

## Common Exemption Scenarios

### Scenario 1: Third-Party Integration

**Situation**: Integrating a library that violates ESLint rules.

**Solution**:
```typescript
// eslint-disable-next-line complexity -- Third-party: library-name has high-complexity function
import { complexFn } from 'complex-library'
```

**Governance**: Acceptable for vendor code; prefer wrapping in a service layer.

### Scenario 2: Performance-Critical Code

**Situation**: Performance optimization requires a pattern normally flagged by ESLint.

**Solution**:
1. Validate with performance profiling (Lighthouse, Vitest benchmarks)
2. Document in [14-performance-optimization.instructions.md](../../.github/instructions/14-performance-optimization.instructions.md) if significant
3. Use exemption with proof:

```typescript
// eslint-disable-next-line no-param-reassign -- Perf: avoid object spread in hot path (bench: 2x faster)
array[i].value = newValue
```

**Governance**: Exemptions must include measurements before/after.

### Scenario 3: Dynamic Code (eval, Function constructor)

**Situation**: Feature requires dynamic code execution.

**Situation**: **Forbidden by default** (security policy).

**Solution**:
1. Consult security team (AGENTS.md § 24 — Security Governance)
2. Implement sandboxing if approved
3. Document threat model
4. Use exemption with risk analysis:

```typescript
// eslint-disable-next-line no-eval -- Security: pre-approved for user formula evaluation after validation + sandbox
const result = eval(userFormula)
```

**Governance**: Security exemptions require approval from project lead.

### Scenario 4: Legacy Code Refactoring

**Situation**: Incrementally refactoring code with many violations.

**Solution**:
1. File-level exemption while refactoring:
   ```typescript
   /* eslint-disable rule1, rule2 -- Legacy: refactoring in progress (#456) */
   ```
2. Update issue tracker with refactoring plan
3. Remove exemption when complete

**Governance**: Must have an associated GitHub issue with timeline.

## Approval Process

### For Inline Exemptions

1. **Developer**: Adds exemption with clear reason
2. **Pre-commit hook**: Allows because exemption is in code
3. **Pull request reviewer**: Reviews reason; approves or requests changes
4. **Merge**: Exemption is documented in commit

### For File/Scope Exemptions

1. **Developer**: Updates `.eslintrc.js` + proposes reason
2. **Pull request**: Changed configuration file
3. **Code review**: Technical lead reviews & approves
4. **Merge**: Configuration change is tracked

### For Governance Exemptions

When entire rule should be disabled:

1. **Propose** in GitHub issue (discussion)
2. **Technical lead review** + team consensus
3. **Update** `AGENTS.md § 22` with:
   - Rule name & link to docs
   - Reason for exemption
   - Alternative approach (if any)
4. **Merge** with peer review

## Tracking & Monitoring

### Finding Exemptions

Search for exemptions in the codebase:

```bash
# Find all ESLint disable comments
grep -r "eslint-disable" src/

# Find in specific directory
grep -r "eslint-disable" src/domain/

# Show with line numbers
grep -rn "eslint-disable" src/ | head -20
```

### Auditing

Quarterly exemption audit:

```bash
# Generate exemption report
grep -rn "eslint-disable" src/ > exemptions-report.txt

# Review report
cat exemptions-report.txt | wc -l  # Total exemptions
```

**Action Items**:
- Are exemptions still valid?
- Has the issue been resolved?
- Is there a time limit on exemption?

### Trending

Track exemptions over time:

```bash
# Month 1
grep -rn "eslint-disable" src/ > reports/exemptions-mar-2026.txt

# Month 2
grep -rn "eslint-disable" src/ > reports/exemptions-apr-2026.txt

# Compare growth
wc -l reports/exemptions-*.txt
```

**Goal**: Track that exemptions are decreasing, not accumulating.

## Rule-Specific Guidance

### `eslint-plugin-boundaries` (Layer Enforcement)

**Rule**: No cross-layer imports.

**Cannot be exempted** — if violated, fix the code instead.

**Alternative**: Move code to shared layer or create service.

### `no-unused-vars`

**Can be exempted**: For intentional API contracts (e.g., unused params in callback signatures).

```typescript
// eslint-disable-next-line no-unused-vars
const handler = (event, context) => {
  // Only event is needed; context part of AWS Lambda signature
}
```

### `no-console`

**Can be exempted**: For intended logging/debugging output.

```typescript
// eslint-disable-next-line no-console -- Intentional: performance benchmark logging
console.log(`AI move computed in ${elapsed}ms`)
```

### `complexity`

**Cannot be exempted** — Refactor using helper functions or early returns.

### `no-eval` / `unsafe-function`

**Cannot be exempted** — Security policy (requires security lead approval in AGENTS.md).

### `react-hooks/exhaustive-deps`

**Can be exempted**: When dependency is intentionally excluded (document why).

```typescript
useEffect(() => {
  // ...
}, [
  // eslint-disable-next-line react-hooks/exhaustive-deps
  userId, // Intentionally excluding instance ref (stable across mount)
])
```

## Best Practices

1. **Default to fixing**, not exempting
   - Refactor instead of disable
   - Ask: "Can I improve the code instead?"

2. **Use specific rule names**
   ```typescript
   // ✅ GOOD: Specific rule
   // eslint-disable-next-line no-unused-vars

   // ❌ BAD: Generic disable
   // eslint-disable-next-line
   ```

3. **Always explain why**
   ```typescript
   // ✅ GOOD: Reason is clear
   // eslint-disable-next-line no-console -- Debug: remove before merge

   // ❌ BAD: No reason
   // eslint-disable-next-line no-console
   ```

4. **Use line-level**, not file-level, when possible
   ```typescript
   // ✅ GOOD: Targeted exemption
   // eslint-disable-next-line rule-name
   problematic()

   // ❌ BAD: Exempts entire file
   /* eslint-disable rule-name */
   ```

5. **Remove when no longer needed**
   ```bash
   # Periodically audit exemptions
   grep -rn "eslint-disable" src/ | review & remove
   ```

## FAQ

**Q: Can I disable all linting for my file?**  
A: No. Use specific rules only, and provide justification.

**Q: My PR has linting failures. Can you skip them?**  
A: Fix the issues with `pnpm fix`. If truly an exception, propose exemption in PR with justification.

**Q: How long can an exemption stay?**  
A: As short as possible. If > 1 month old and not being addressed, open issue to track removal date.

**Q: What if I disagree with a rule?**  
A: Propose rule change in GitHub discussion. Don't just exempt; address at governance level (AGENTS.md).

**Q: Can I use `eslint-disable-line` on multiple lines?**  
A: No. Use `eslint-disable` / `eslint-enable` block pairing.

## Resources

- [ESLint Disable Documentation](https://eslint.org/docs/latest/use/configure/rules#disabling-rules)
- [Project Rule Set](../../AGENTS.md#section-22)
- [ESLint Performance Auditing](ESLINT-PERFORMANCE-AUDITING.md)
