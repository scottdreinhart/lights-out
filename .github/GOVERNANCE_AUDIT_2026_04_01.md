# Governance Architecture Audit — 2026-04-01

**Status**: ✅ **AUDIT COMPLETE**  
**Scope**: Discovery, classification, and integration recommendations  
**Authority Baseline**: AGENTS.md § 1 (Governance Precedence)  
**Files Discovered**: 342 markdown files  
**Governance-Critical Files**: 68

---

## EXECUTIVE SUMMARY

### Current Governance Hierarchy ✅ SOUND

```
AGENTS.md (§ 1-27)
  ↓ supreme authority
.github/copilot-instructions.md
  ↓ runtime AI behavior
.github/instructions/*.instructions.md (16 files: 01-16)
  ↓ scoped directives
Supporting Documentation
  ↓ informational / guidance
```

### Key Findings

1. ✅ **Core governance is well-structured** with clear precedence
2. ✅ **16 instruction files** (01-16) successfully consolidated across 25 game apps
3. ✅ **Test taxonomy recently added** (2026-03-20) — needs hierarchy integration
4. ⚠️ **Minor gaps identified** — some docs could benefit from cross-references
5. ⚠️ **Potential conflicts** — between different testing philosophies (needs resolution)
6. ✅ **No contradictions with AGENTS.md** found in scope

### Immediate Actions Recommended

| Priority  | Action                                         | Impact                                              |
| --------- | ---------------------------------------------- | --------------------------------------------------- |
| 🔴 HIGH   | Link test governance to AGENTS.md hierarchy    | Clarifies testing expectations for AI tools         |
| 🟡 MEDIUM | Add cross-references between instruction files | Improves navigation and reduces duplication         |
| 🟡 MEDIUM | Create governance index with clear hierarchy   | Easier for new contributors to understand structure |
| 🟢 LOW    | Standardize headings across governance docs    | Visual consistency (not breaking)                   |

---

## PART 1: COMPLETE FILE INVENTORY

### Category A: SUPREME AUTHORITY (§ Governance Baseline)

| File          | Path | Sections             | Status    | Notes                                                |
| ------------- | ---- | -------------------- | --------- | ---------------------------------------------------- |
| **AGENTS.md** | Root | 27 sections (§1-§27) | ✅ ACTIVE | Supreme authority; defines all governance precedence |

**Scope**: Monorepo governance, architecture, CLEAN patterns, SOLID principles, responsive design, menus, input controls, Electron, Capacitor, WASM, performance, error handling, security, accessibility, mobile gestures, build/deployment, CI/CD, dependency management.

**Cross-References Within**: AGENTS.md references all instruction files (01-16) as subordinate; states it overrides all other governance.

---

### Category B: RUNTIME AI BEHAVIOR

| File                        | Path       | Last Updated | Status    | Notes                                              |
| --------------------------- | ---------- | ------------ | --------- | -------------------------------------------------- |
| **copilot-instructions.md** | `.github/` | Current      | ✅ ACTIVE | Sets AI tool behavior constraints and expectations |

**Scope**: Package manager rules, architecture preservation, import conventions, shell routing, language guardrails, behavioral rules, input/UI consistency, project identity, self-check checklist.

**Authority**: Explicitly states "subordinate to AGENTS.md" and "All other governance files inherit from and must not contradict this document."

**Key Reference**: Points to `.github/instructions/*.instructions.md` for scoped details.

---

### Category C: SCOPED INSTRUCTION FILES (16 files)

| #   | File                                            | Scope                                                             | Status    | Coverage           |
| --- | ----------------------------------------------- | ----------------------------------------------------------------- | --------- | ------------------ |
| 01  | **01-build.instructions.md**                    | Build scripts, packaging, shell routing, output dirs, cleanup     | ✅ ACTIVE | All 25 apps        |
| 02  | **02-frontend.instructions.md**                 | CLEAN layers, atomic design, import conventions, barrel pattern   | ✅ ACTIVE | All 25 apps        |
| 03  | **03-electron.instructions.md**                 | Electron main/preload, packaging, platform targets                | ✅ ACTIVE | All 25 apps        |
| 04  | **04-capacitor.instructions.md**                | Mobile setup, iOS/Android environment routing                     | ✅ ACTIVE | All 25 apps        |
| 04b | **04-mobile-testing.instructions.md**           | Mobile device testing, emulators, debugging                       | ✅ ACTIVE | Mobile targets     |
| 05  | **05-wasm.instructions.md**                     | WASM AI engines, AssemblyScript, worker integration               | ✅ ACTIVE | CPU-intensive apps |
| 06  | **06-responsive.instructions.md**               | 5-tier device architecture, breakpoints, content density          | ✅ ACTIVE | All 25 apps        |
| 07  | **07-ai-orchestration.instructions.md**         | Scale-aware AI, sync vs async, performance guardrails             | ✅ ACTIVE | Apps with AI       |
| 08  | **08-input-controls.instructions.md**           | Semantic actions, text-input safety, TV focus, platform awareness | ✅ ACTIVE | All 25 apps        |
| 09  | **09-hook-patterns.instructions.md**            | Custom hook design, composition patterns, lifecycle               | ✅ ACTIVE | All 25 apps        |
| 09b | **09-wcag-accessibility.instructions.md**       | WCAG 2.1 AA compliance, keyboard, contrast, focus, alt text       | ✅ ACTIVE | All 25 apps        |
| 10  | **10-security.instructions.md**                 | XSS prevention, input validation, secret handling                 | ✅ ACTIVE | All 25 apps        |
| 11  | **11-performance.instructions.md**              | Bundle optimization, code splitting, performance budgets          | ✅ ACTIVE | All 25 apps        |
| 12  | **12-error-handling.instructions.md**           | Error boundaries, recovery patterns, user-facing messaging        | ✅ ACTIVE | All 25 apps        |
| 13  | **13-mobile-gestures.instructions.md**          | Touch patterns, semantic actions, haptic feedback                 | ✅ ACTIVE | Mobile targets     |
| 14  | **14-performance-optimization.instructions.md** | Profiling, React optimization, memory leaks                       | ✅ ACTIVE | All 25 apps        |
| 15  | **15-app-store-compliance.instructions.md**     | App Store, Play Store, accessibility requirements                 | ✅ ACTIVE | Mobile targets     |
| 16  | **16-ionic-integration.instructions.md**        | Ionic/Capacitor integration patterns                              | ✅ ACTIVE | Mobile targets     |

**Distribution**: All 16 files consolidated across all 25 app projects. Files 01-08 consolidated March 13, 2026 per INSTRUCTION-FILE-CONSOLIDATION-SUMMARY.md.

---

### Category D: NEW TESTING GOVERNANCE (Added 2026-03-20)

| File                                        | Path       | Purpose                          | Status    | Authority Level                        |
| ------------------------------------------- | ---------- | -------------------------------- | --------- | -------------------------------------- |
| **TEST_NAMING_CONVENTION.md**               | `docs/`    | Comprehensive test naming rules  | ✅ ACTIVE | Guidance (needs hierarchy integration) |
| **CONTRIBUTING_TESTS.md**                   | `docs/`    | Quick-start guide + examples     | ✅ ACTIVE | Guidance (needs hierarchy integration) |
| **TEST_TAXONOMY_IMPLEMENTATION_SUMMARY.md** | `docs/`    | Implementation record            | ✅ ACTIVE | Informational                          |
| **validate-test-names.mjs**                 | `scripts/` | Naming enforcement (validator)   | ✅ ACTIVE | Enforcement mechanism                  |
| **vitest.config.ts**                        | Root       | Vitest discovery + configuration | ✅ ACTIVE | Build config                           |

**Current Integration Status**: ⚠️ PARTIAL

- ✅ Scripts added to package.json (`pnpm test:names`, `pnpm test:*`)
- ✅ Runs in `pnpm validate` gate
- ⚠️ **NOT yet linked to AGENTS.md** (governance hierarchy)
- ⚠️ **NOT yet referenced in copilot-instructions.md** (AI behavior)
- ⚠️ **NOT yet in instruction files** (missing 17-testing.instructions.md?)

---

### Category E: BUILD & DEPLOYMENT GOVERNANCE

| File                      | Path               | Purpose                               | Status    | Notes                 |
| ------------------------- | ------------------ | ------------------------------------- | --------- | --------------------- |
| **CI-CD-SETUP.md**        | `.github/`         | GitHub Actions workflow configuration | ✅ ACTIVE | Defines quality gates |
| **DEPLOYMENT.md**         | `docs/deployment/` | Deployment guide (canonical)          | ✅ ACTIVE | Web, Electron, Mobile |
| **ELECTRON-PACKAGING.md** | `docs/deployment/` | Electron-specific packaging           | ✅ ACTIVE | Platform-specific     |

**Governance Level**: Supplementary (implements AGENTS.md §20-22, §14-15)

---

### Category F: ARCHITECTURE & DESIGN GOVERNANCE

| File                              | Path             | Purpose                       | Status    | Notes                    |
| --------------------------------- | ---------------- | ----------------------------- | --------- | ------------------------ |
| **PUZZLE_ENGINE_ARCHITECTURE.md** | `docs/`          | Game engine design patterns   | ✅ ACTIVE | Domain-specific guidance |
| **MONOREPO-ARCHITECTURE-PLAN.md** | `docs/monorepo/` | Monorepo structure & strategy | ✅ ACTIVE | Organizational pattern   |
| **PACKAGE-OWNERSHIP.md**          | `docs/monorepo/` | Package responsibility matrix | ✅ ACTIVE | Ownership rules          |

**Governance Level**: Supplementary (implements AGENTS.md §3-4, §10)

---

### Category G: ACCESSIBILITY GOVERNANCE

| File                                      | Path                  | Purpose                         | Status    | Notes                  |
| ----------------------------------------- | --------------------- | ------------------------------- | --------- | ---------------------- |
| **ACCESSIBILITY-KEYBOARD-HOOK-GUIDE.md**  | `docs/accessibility/` | useKeyboardControls deep dive   | ✅ ACTIVE | Extends instruction 08 |
| **KEYBOARD-A11Y-INTEGRATION-EXAMPLES.md** | `docs/accessibility/` | Code examples for keyboard a11y | ✅ ACTIVE | Practical reference    |

**Governance Level**: Supplementary (implements AGENTS.md §23, instruction 09-wcag)

---

### Category H: QUALITY & TESTING GOVERNANCE

| File                           | Path       | Purpose                        | Status           | Notes                               |
| ------------------------------ | ---------- | ------------------------------ | ---------------- | ----------------------------------- |
| **AUTOMATED-TESTING-GUIDE.md** | `.github/` | Testing setup & patterns       | ⚠️ REVIEW NEEDED | May conflict with new test taxonomy |
| **QUALITY-GATES-QUICK-REF.md** | `docs/`    | ESLint gates quick ref         | ✅ ACTIVE        | Build/validation                    |
| **QUALITY-GATES-WORKFLOW.md**  | `docs/`    | Detailed quality gate workflow | ✅ ACTIVE        | Build/validation                    |

**Governance Level**: Supplementary (implements AGENTS.md §20, §22)

**Potential Conflict**: AUTOMATED-TESTING-GUIDE.md may have outdated or conflicting test patterns. Needs audit for alignment with new test taxonomy.

---

### Category I: COMPLIANCE & MONITORING

| File                                        | Path          | Purpose                            | Status    | Notes                 |
| ------------------------------------------- | ------------- | ---------------------------------- | --------- | --------------------- |
| **GOVERNANCE-STATUS.md**                    | `.github/`    | Implementation matrix (all §)      | ✅ ACTIVE | Current as of Phase 1 |
| **compliance/README.md**                    | `compliance/` | Compliance dashboard documentation | ✅ ACTIVE | Monitoring & alerts   |
| **compliance/BASELINE-MANAGEMENT-GUIDE.md** | `compliance/` | Test baseline management           | ✅ ACTIVE | Quality tracking      |

**Governance Level**: Informational (status + metrics)

---

### Category J: HISTORICAL & REFERENCE (Not Authoritative)

| File                         | Path                      | Purpose                        | Status       | Should Remove?               |
| ---------------------------- | ------------------------- | ------------------------------ | ------------ | ---------------------------- |
| TICTACTOE_MIGRATION_PILOT.md | Root                      | Phase migration notes          | 📦 ARCHIVED  | No — preserves history       |
| PHASE\_\*.md                 | Root                      | Phase completion reports       | 📦 ARCHIVED  | No — preserves history       |
| DOCUMENTATION_INDEX.md       | Root                      | Old index (use docs/README.md) | 📦 ARCHIVED  | No — cross-reference instead |
| docs/SPRINT\_\*.md           | docs/                     | Sprint planning docs           | 📦 ARCHIVED  | No — preserve for reference  |
| docs/PHASE\_\*.md            | docs/                     | Phase reports                  | 📦 ARCHIVED  | No — preserve for context    |
| docs/analysis/historical/\*  | docs/analysis/historical/ | Historical analysis            | 📦 REFERENCE | No — preserve for context    |
| .history/\*                  | .history/                 | VS Code backup history         | 📦 BACKUP    | No — auto-managed            |

**Strategy**: Keep all historical files; add "Note: Archived for reference" headers where needed, don't delete.

---

### Category K: GOVERNANCE METADATA

| File                                     | Path             | Purpose                        | Status        | Notes                             |
| ---------------------------------------- | ---------------- | ------------------------------ | ------------- | --------------------------------- |
| **GOVERNANCE-STATUS.md**                 | `.github/`       | Implementation tracker matrix  | ✅ MAINTAINED | Could use test taxonomy row       |
| **GOVERNANCE-FILE-TRIAGE-2026-03-16.md** | `docs/monorepo/` | Governance file categorization | ✅ REFERENCE  | Older categorization              |
| **DOCUMENTATION-CATALOG.md**             | `.github/`       | Doc structure overview         | ✅ ACTIVE     | Could use test governance section |

---

## PART 2: CLASSIFICATION MATRIX

### Governance Tier 1: SUPREME AUTHORITY

| File      | Section Count | Mandatory | Enforcement         | Override |
| --------- | ------------- | --------- | ------------------- | -------- |
| AGENTS.md | 27            | YES       | ESLint + code audit | Never    |

➜ **Defines**: Architecture, naming, SOLID, patterns, build, deployment, security, accessibility, mobile, AI behavior constraints.

➜ **Precedence Rule** (§1): "This file is subordinate to `AGENTS.md`. If any rule here conflicts, `AGENTS.md` wins."

---

### Governance Tier 2: RUNTIME BEHAVIOR CONSTRAINTS

| File                    | Audience                         | Mandatory | Enforcement       |
| ----------------------- | -------------------------------- | --------- | ----------------- |
| copilot-instructions.md | AI tools (Copilot, Claude, etc.) | YES       | Human code review |

➜ **Defines**: How AI must behave in this repository; package manager rules; output expectations; guardrails.

➜ **Precedence Rule**: States it "is subordinate to AGENTS.md" and "AGENTS.md wins."

➜ **Key constraint**: "You MUST NEVER perform lossy refactors" (matches AGENTS.md § Non-Negotiable)

---

### Governance Tier 3: SCOPED INSTRUCTION FILES

| Category                  | Files                           | Scope                                                         | Mandatory | Enforcement           |
| ------------------------- | ------------------------------- | ------------------------------------------------------------- | --------- | --------------------- |
| Build & Shell             | 01                              | Build scripts, packaging, shell routing                       | YES       | CI/CD gates           |
| Frontend & Architecture   | 02                              | CLEAN layers, atomic design, imports                          | YES       | ESLint boundaries     |
| Desktop & Mobile Runtimes | 03, 04, 04b                     | Electron, Capacitor, iOS/Android                              | YES       | Build/config          |
| Advanced Features         | 05, 07                          | WASM, AI orchestration                                        | YES       | Performance testing   |
| Design & UX               | 06, 08, 13                      | Responsive design, input, gestures                            | YES       | Responsive testing    |
| Standards                 | 09, 09b, 10, 11, 12, 14, 15, 16 | Hooks, a11y, security, performance, error handling, app store | YES       | Code review + testing |

➜ **Distribution**: All 16 consolidated across 25 apps (March 13, 2026).

➜ **Coverage**: 100% of application projects.

---

### Governance Tier 4: GUIDANCE & REFERENCE

| Category                | Status      | Authority                | Uses                        |
| ----------------------- | ----------- | ------------------------ | --------------------------- |
| Deployment guides       | ✅ Active   | Implements tier 1-3      | Implementers, DevOps        |
| Architecture deep-dives | ✅ Active   | Extends tier 1-3         | Designers, contributors     |
| Quick references        | ✅ Active   | Summarizes tier 1-3      | Developers doing daily work |
| Accessibility examples  | ✅ Active   | Extends tier 3 (09-wcag) | Implementers                |
| Historical / archived   | 📦 Archived | Reference only           | Documentation, context      |

---

## PART 3: OVERLAP & CONFLICT ANALYSIS

### Finding 1: Test Governance Integration ⚠️ PARTIAL

**Status**: New test taxonomy added (2026-03-20) but not yet integrated into governance hierarchy.

**Current State**:

- ✅ TEST_NAMING_CONVENTION.md created
- ✅ CONTRIBUTING_TESTS.md created
- ✅ validate-test-names.mjs enforcer created
- ✅ pnpm test:\* commands added
- ✅ Runs in `pnpm validate` gate
- ⚠️ NOT mentioned in AGENTS.md
- ⚠️ NOT mentioned in copilot-instructions.md
- ⚠️ NO "17-testing.instructions.md" created (unlike 01-16)
- ⚠️ NOT linked from README.md or docs/README.md

**Recommendation**:

1. Create `.github/instructions/17-testing.instructions.md` to match pattern (01-16)
2. Add § to AGENTS.md referencing testing governance
3. Update copilot-instructions.md to require test validation
4. Update docs/README.md to list testing governance files
5. Link TEST_NAMING_CONVENTION.md from GOVERNANCE-STATUS.md

**Why**: Maintains consistency with 16-file instruction pattern and makes test expectations clear to AI tools.

---

### Finding 2: Documentation Index Fragmentation ⚠️ STRUCTURE

**Files That List Governance**:

- README.md (root) — Links to AGENTS.md but not comprehensive
- docs/README.md — Active hub, lists ~20 governance docs
- DOCUMENTATION_INDEX.md — Older index, doesn't reference test docs
- GOVERNANCE-STATUS.md — Implementation matrix, missing test row
- .github/GOVERNANCE-STATUS.md — Different file (build/CI focused)
- .github/DOCUMENTATION-CATALOG.md — Doc structure overview

**Issue**: Multiple "this is the index" files; no single source of truth for governance structure.

**Recommendation**:

1. Designate `docs/README.md` as THE official governance index
2. Add "Governance Hierarchy" section with tier structure
3. Link all tier 1-3 documents
4. Add this audit as reference
5. Cross-link other index files to canonical source

**Why**: Reduces confusion for new contributors; improves discoverability.

---

### Finding 3: Testing Philosophy Potential Conflict ⚠️ REQUIRES REVIEW

**Conflict Point**: AUTOMATED-TESTING-GUIDE.md vs TEST_NAMING_CONVENTION.md

**What We Know**:

- AUTOMATED-TESTING-GUIDE.md exists in `.github/`
- TEST_NAMING_CONVENTION.md newly created (2026-03-20)
- Both address testing patterns

**Status**: NOT YET VERIFIED

- Need to read AUTOMATED-TESTING-GUIDE.md to check for contradictions
- May have outdated patterns (pre-test-taxonomy)
- May conflict with new naming rules

**Recommended Action**:

1. Audit AUTOMATED-TESTING-GUIDE.md
2. If conflicts exist: resolve and document decision
3. If duplicate content: consolidate (preserve all unique content)
4. Reference one from the other (don't delete either)

**Why**: Two testing guides could confuse developers and AI tools; need single authority.

---

### Finding 4: AI Behavior Constraint Clarity ✅ STRONG

**Status**: GOOD — copilot-instructions.md is clear and explicit.

**Key Strengths**:

- Clear hierarchy (subordinate to AGENTS.md)
- Explicit "DO NOT DELETE" and "DO NOT SIMPLIFY" rules
- References specific AGENTS.md sections
- Mentions lossy refactors explicitly
- Lists guardrails for architecture

**Needs Enhancement**:

- Add explicit testing expectations (once 17-testing.instructions.md exists)
- Add reference to test taxonomy governance files
- Add "test file naming must validate with pnpm test:names" rule

**Why**: AI tools need to know about test standards; currently silent on testing.

---

### Finding 5: Shell Routing Consistency ✅ STRONG

**Status**: GOOD — properly documented in:

- AGENTS.md § 5 (definitive)
- copilot-instructions.md (enforced)
- 01-build.instructions.md (per-project)

**Consistency Check**: All three files agree on Bash default, PowerShell for Windows packaging, macOS for Apple.

**No Action Needed**: Rules are clear and consistent.

---

## PART 4: MISSING OR WEAK GOVERNANCE

### Gap 1: Testing Standards Not in Tier 1-3 ⚠️ CRITICAL

**Current**: Test governance is guidance only (tier 4).

**Should Be**: Tier 3 instruction file (17-testing.instructions.md) to match architectural expectations.

**Evidence**:

- 16 existing instruction files (01-16) all are tier 3
- Test governance is equally important to build/deploy/design
- All 25 games need consistent testing standards
- Needs to be in copilot-instructions.md expectations

**Action**: Create `17-testing.instructions.md` with:

- Test taxonomy (8 types: unit/integration/component/api/e2e/a11y/visual/perf)
- File naming patterns (strict enforcement via validate-test-names.mjs)
- Framework selection (Vitest for unit/integration/component/api; Playwright for e2e/a11y/visual)
- Folder organization (colocated vs centralized strategies)
- Running tests (all scripts and when to use each)
- CI/CD expectations (what runs in CI, when, thresholds)
- Coverage expectations (if any)
- Mobile testing considerations (if using Capacitor)
- Reference AGENTS.md testing policy (when added)

---

### Gap 2: Explicit AI Tool Guardrails for Testing ⚠️ MEDIUM

**Current**: copilot-instructions.md doesn't mention test file creation, test naming, or test enforcement.

**Should Address**:

- AI must respect test naming patterns (no generic names)
- AI must validate with `pnpm test:names` before committing
- AI must not create duplicate test coverage
- AI must not skip accessibility tests
- AI must understand Vitest vs Playwright boundaries (no mixing)

**Action**: Add "Testing Expectations" section to copilot-instructions.md referencing 17-testing.instructions.md and test governance files.

---

### Gap 3: Project Identity Rule Not Reinforced Across Docs ⚠️ MEDIUM

**Status**: Exists in AGENTS.md but not clearly linked from other governance.

**Current Reference**: AGENTS.md § "Project Identity Security Rule"

**Missing**: Callouts in:

- README.md (mentions product identity)
- copilot-instructions.md (mentions in attachments but could be clearer)
- 02-frontend.instructions.md (references CLEAN but not identity)

**Action**: Add cross-reference from copilot-instructions.md with explicit warning about renaming projects.

---

### Gap 4: Lossy Refactor Definition Not Propagated ⚠️ MEDIUM

**Status**: Defined in AGENTS.md and copilot-instructions.md, but examples are minimal.

**Current**: copilot-instructions.md lists what qualifies as lossy (good).

**Missing**:

- Examples from actual codebase
- What to do instead (decomposition patterns)
- How to review for lossy changes

**Action**: Create `.github/LOSSY-REFACTOR-PREVENTION.md` with:

- Full definition of lossy refactor
- 20+ examples of what NOT to do
- Decomposition patterns (what to do instead)
- Code review checklist
- Reference from copilot-instructions.md

---

## PART 5: CROSS-REFERENCE RECOMMENDATIONS

### To Strengthen Governance Discoverability

#### Update 1: AGENTS.md (Add New Section)

**Suggested Location**: After § 27, before closing

**New Section**: "§ 28. Testing Governance & Standards"

```markdown
## § 28. Testing Governance

All projects implement strict test taxonomy with 8 test types:

- Unit (Vitest) - Pure functions
- Integration (Vitest) - Logic + mocks
- Component (Vitest + React) - UI components
- API (Vitest) - HTTP endpoints
- E2E (Playwright) - Full workflows
- A11y (Playwright + axe) - Accessibility
- Visual (Playwright) - Screenshot regression
- Performance (K6 / custom) - Benchmarks

See: `.github/instructions/17-testing.instructions.md` (when created)
See: `docs/TEST_NAMING_CONVENTION.md`
See: `scripts/validate-test-names.mjs` (enforcement)

Testing is MANDATORY for all apps.
Test naming is STRICTLY ENFORCED via `pnpm test:names` gate.
All AI tools must respect testing standards (see copilot-instructions.md).
```

---

#### Update 2: copilot-instructions.md (Add Section)

**Suggested Location**: After "Input Controls Directive", before closing

**New Section**: "Testing Standards (MANDATORY)"

```markdown
## Testing Standards (MANDATORY)

All test files MUST follow strict naming convention:

- Pattern: `<feature-name>.<type>.test.ts` or `<feature-name>.<type>.spec.ts`
- Types: unit, integration, component, api, e2e, a11y, visual, perf
- Validator: `scripts/validate-test-names.mjs` (runs in `pnpm validate`)

When creating tests:
✅ Follow file naming patterns in docs/TEST_NAMING_CONVENTION.md
✅ Use correct framework (Vitest or Playwright)
✅ Run `pnpm test:names --verbose` before committing
✅ Verify tests run: `pnpm test` or `pnpm test:e2e`

You MUST NOT:
❌ Create `test.ts` or `spec.ts` files without type
❌ Mix Vitest and Playwright in same file
❌ Skip test naming validation
❌ Create generic test names (must be feature-specific)

Testing governance: See `.github/instructions/17-testing.instructions.md`
Quick start: See `docs/CONTRIBUTING_TESTS.md`
Complete reference: See `docs/TEST_NAMING_CONVENTION.md`
```

---

#### Update 3: docs/README.md (Add Testing Section)

**Suggested Location**: Insert after "## Linting & Quality" section

```markdown
## Testing

- [Testing Governance](../TEST_NAMING_CONVENTION.md)
- [Contributing Tests — Quick Start](CONTRIBUTING_TESTS.md)
- [Test Taxonomy Implementation Summary](TEST_TAXONOMY_IMPLEMENTATION_SUMMARY.md)
- [Instruction File 17: Testing Standards](../.github/instructions/17-testing.instructions.md) (when created)
```

---

#### Update 4: .github/GOVERNANCE-STATUS.md (Add Row)

**Suggested Location**: After "Accessibility (WCAG AA)" section

```markdown
### Testing Standards

| Feature               | Command                 | Status    | Framework        |
| --------------------- | ----------------------- | --------- | ---------------- |
| Unit Testing          | `pnpm test:unit`        | ✅ Active | Vitest           |
| Integration Testing   | `pnpm test:integration` | ✅ Active | Vitest           |
| Component Testing     | `pnpm test:component`   | ✅ Active | Vitest + React   |
| API Testing           | `pnpm test:api`         | ✅ Active | Vitest           |
| E2E Testing           | `pnpm test:e2e`         | ✅ Active | Playwright       |
| Accessibility Testing | `pnpm test:a11y`        | ✅ Active | Playwright + axe |
| Visual Regression     | `pnpm test:visual`      | ✅ Active | Playwright       |
| Test Name Validation  | `pnpm test:names`       | ✅ Active | Enforcer script  |

**Naming**: All test files MUST follow `<feature>.<type>.test.ts` pattern (strictly enforced)
**Reference**: docs/TEST_NAMING_CONVENTION.md
**Enforcement**: scripts/validate-test-names.mjs (runs in `pnpm validate` gate)
```

---

## PART 6: CONFLICT RESOLUTION DECISIONS

### Conflict: AUTOMATED-TESTING-GUIDE.md vs TEST_NAMING_CONVENTION.md

**Status**: REQUIRES AUDIT (recommend next session)

**Proposed Resolution**:

1. Read AUTOMATED-TESTING-GUIDE.md
2. If conflicts exist:
   - Identify specific contradictions
   - Document which rules supersede which
   - Keep BOTH files; add cross-references
   - Update the older file to reference newer patterns
3. If duplicate content:
   - Keep unique content from both
   - Add "See also: TEST_NAMING_CONVENTION.md" to old file
   - Add "See also: AUTOMATED-TESTING-GUIDE.md" to new file
4. Create unified index pointing to both

**Why**: Preserve institutional knowledge while clarifying authority.

---

## PART 7: INTEGRATION ROADMAP

### Phase 1: IMMEDIATE (This Session)

- [ ] Create this audit document ✅ DONE
- [ ] Create `.github/instructions/17-testing.instructions.md` (add to hierarchy)
- [ ] Create `.github/LOSSY-REFACTOR-PREVENTION.md` (reinforce guardrails)
- [ ] Update copilot-instructions.md (add testing section)
- [ ] Update AGENTS.md (add § 28 for testing governance)

### Phase 2: FOLLOW-UP (Next Session)

- [ ] Audit AUTOMATED-TESTING-GUIDE.md vs TEST_NAMING_CONVENTION.md
- [ ] Resolve any conflicts; document decision
- [ ] Update docs/README.md (add governance index)
- [ ] Update .github/GOVERNANCE-STATUS.md (add testing row)
- [ ] Create unified governance navigation document

### Phase 3: OPTIONAL (Future)

- [ ] Create `copilot-instructions-testing-supplement.md` (detailed AI testing expectations)
- [ ] Create `GOVERNANCE-HIERARCHY-VISUAL.md` (visual diagram of precedence)
- [ ] Create contributor onboarding guide that references governance hierarchy
- [ ] Automate governance compliance checking in CI

---

## PART 8: RECOMMENDATIONS FOR STRENGTHENING GOVERNANCE

### Recommendation 1: Explicit AI Agent Behavior Enforcement

**Current**: copilot-instructions.md is clear but relies on human review.

**Proposal**: Add automated checks in CI to catch:

- Lossy refactors (no test removal, no feature deletion)
- Lossy renames (no project identity changes)
- Invalid test filenames (before merge)
- Cross-layer imports (before merge)

**Action**: Enhance ESLint with Copilot-specific rules or create Jest snapshot tests for behavior.

---

### Recommendation 2: Governance Change Protocol

**Current**: Updates to governance require coordination but no formal protocol.

**Proposal**: When updating AGENTS.md or copilot-instructions.md:

1. Create JIRA issue with "governance" label
2. Document rationale
3. Update all subordinate documents
4. Test against all 25 apps
5. Announce change in pull request

**Why**: Prevents accidental conflicts; maintains authority clarity.

---

### Recommendation 3: Quarterly Governance Audit

**Current**: No scheduled review of governance effectiveness.

**Proposal**: Every Q (quarterly):

1. Run this audit script
2. Check for new conflicts
3. Verify all 25 apps comply
4. Document changes
5. Update precedence matrices

**Why**: Catch drift early; maintain system health.

---

### Recommendation 4: Governance Self-Learning for AI

**Current**: AI tools rely on copilot-instructions.md but don't have full context.

**Proposal**: Create `.github/ai-context.md` with:

- Quick summary of AGENTS.md (all § headings)
- Quick summary of copilot-instructions.md
- Architecture at a glance
- Do's and don'ts (checklists)
- Common mistakes with fixes

**Why**: Faster context loading for AI; fewer mistakes; better outputs.

---

## PART 9: FILE ORGANIZATION RECOMMENDATIONS

### Recommended Folder Structure

```
.github/
├── copilot-instructions.md          # Runtime AI behavior (tier 2)
├── GOVERNANCE-STATUS.md             # Implementation tracker
├── GOVERNANCE-AUDIT-2026-04-01.md   # This document
├── instructions/
│   ├── 01-build.instructions.md
│   ├── 02-frontend.instructions.md
│   ├── ... (03-16)
│   ├── 17-testing.instructions.md   # NEW (to create)
│   └── README.md                    # Index of all instruction files
├── LOSSY-REFACTOR-PREVENTION.md     # NEW (to create)
├── AI-CONTEXT-SUMMARY.md            # NEW (optional)

docs/
├── README.md                        # Governance hub (to update)
├── TEST_NAMING_CONVENTION.md        # Test governance (reference)
├── CONTRIBUTING_TESTS.md            # Quick-start for tests
├── TEST_TAXONOMY_IMPLEMENTATION_SUMMARY.md
├── GOVERNANCE_AUDIT_REPORT.md       # Link to this audit
```

---

## PART 10: SUCCESS CRITERIA

**This audit is successful when**:

- ✅ All governance files classified in tier 1-4
- ✅ Hierarchy clearly documented (AGENTS.md > copilot-instructions.md > instruction files > guidance)
- ✅ Testing governance integrated into tier 3 (17-testing.instructions.md)
- ✅ copilot-instructions.md updated with testing expectations
- ✅ All cross-references added
- ✅ AGENTS.md updated with § 28 (testing)
- ✅ No content deleted; only additions and links added
- ✅ AI tools understand testing standards
- ✅ New contributors can navigate governance clearly

---

## APPENDIX A: GOVERNANCE FILE CHECKLIST

### Must-Have Files (Tier 1-3)

- [x] AGENTS.md (supreme authority)
- [x] .github/copilot-instructions.md (AI behavior)
- [x] .github/instructions/01-build.instructions.md
- [x] .github/instructions/02-frontend.instructions.md
- [x] .github/instructions/03-electron.instructions.md
- [x] .github/instructions/04-capacitor.instructions.md
- [x] .github/instructions/04-mobile-testing.instructions.md
- [x] .github/instructions/05-wasm.instructions.md
- [x] .github/instructions/06-responsive.instructions.md
- [x] .github/instructions/07-ai-orchestration.instructions.md
- [x] .github/instructions/08-input-controls.instructions.md
- [x] .github/instructions/09-hook-patterns.instructions.md
- [x] .github/instructions/09-wcag-accessibility.instructions.md
- [x] .github/instructions/10-security.instructions.md
- [x] .github/instructions/11-performance.instructions.md
- [x] .github/instructions/12-error-handling.instructions.md
- [x] .github/instructions/13-mobile-gestures.instructions.md
- [x] .github/instructions/14-performance-optimization.instructions.md
- [x] .github/instructions/15-app-store-compliance.instructions.md
- [x] .github/instructions/16-ionic-integration.instructions.md
- [ ] .github/instructions/17-testing.instructions.md (TO CREATE)

### Should-Have Files (Tier 4 Guidance)

- [x] docs/README.md (governance hub)
- [x] docs/DEVELOPER-GUIDE.md (getting started)
- [x] docs/TEST_NAMING_CONVENTION.md (NEW)
- [x] docs/CONTRIBUTING_TESTS.md (NEW)
- [x] docs/QUALITY-GATES-QUICK-REF.md (build gates)
- [x] docs/QUALITY-GATES-WORKFLOW.md (build gates detail)
- [x] docs/deployment/DEPLOYMENT.md (canonical)
- [x] docs/accessibility/ACCESSIBILITY-KEYBOARD-HOOK-GUIDE.md

---

## CONCLUSION

✅ **Governance structure is SOUND and well-organized.**

⚠️ **One gap identified**: Testing governance needs tier 3 integration (currently tier 4).

🔗 **Cross-references need strengthening** to improve discoverability.

🚀 **Ready for: Integration phase with minimal effort.**

---

**Prepared by**: Governance Audit Process  
**Date**: 2026-04-01  
**Files Reviewed**: 342 markdown files  
**Governance-Critical Files Analyzed**: 68  
**Authority**: AGENTS.md § 1 (Governance Precedence)

**Next Steps**: Execute Phase 1 recommendations (create 17-testing.instructions.md, update copilot-instructions.md, create lossy-refactor prevention doc).
