## Governance Canonical Spec (Non-Lossy)

Purpose: Produce a single, machine-actionable canonical governance specification that preserves every non-negotiable rule verbatim or by authoritative reference, and provides concrete enforcement/check commands and bundles.

Authority & Sources
- Primary authority: `AGENTS.md` (source of non-negotiable rules).
- Supporting documents (indexed): all files under `.github/instructions/` and `docs/governance/`. Use originals as ground truth; this file is a canonical index and enforcement layer, not a replacement.

Canonical Constants
- PKG_MANAGER = "pnpm@10.31.0" (workspace root `packageManager`)
- DEFAULT_SHELL = "bash" (Bash / POSIX required default)
- VALIDATION_GATE = `pnpm validate` (full quality gate)

Non-Negotiable Rules (authoritative reference)
- Preserve the entire `AGENTS.md` as authoritative. Any rule marked in `AGENTS.md` as "Non-Negotiable" or under § 0 must be enforced exactly. See: [AGENTS.md](AGENTS.md)

Rule Index (compact, unique IDs)
- G-0001: PNPM_ONLY — Enforce pnpm as single package manager (source: AGENTS.md §2).
- G-0002: DEFAULT_SHELL_BASH — Use Bash/POSIX as the default shell (source: AGENTS.md §5).
- G-0003: VALIDATION_SELF_CORRECTION — Run `pnpm validate` and follow the Self-Correction Loop on failures (source: AGENTS.md §0.A).
- G-0004: ARCHITECTURE_PRESERVE — Respect layer boundaries (Domain → App → UI) and avoid cross-layer shortcuts (AGENTS.md §3).
- G-0005: NO_NEW_DEPENDENCIES — Do not add dependencies unless justified (AGENTS.md §0.9).
- G-0006: MINIMAL_CHANGE — Make the smallest correct change set possible (AGENTS.md §0.3).

Mapping to Source Files
- For each rule above the canonical source is recorded: G-0001 → `AGENTS.md` (§2), G-0002 → `AGENTS.md` (§5), G-0003 → `AGENTS.md` (§0.A), G-0004 → `AGENTS.md` (§3), G-0005 → `AGENTS.md` (§0.9), G-0006 → `AGENTS.md` (§0.3).

Enforcement Bundles (machine-actionable checks)
- Bundle: CHECK_BASIC (fast):
  - Commands: `pnpm --version`, `node -v`, `bash -c 'echo ok'`
  - Expected: exit code 0 for each.
- Bundle: CHECK_VALIDATION (full gate):
  - Command: `pnpm validate`
  - Success: exit code 0; otherwise follow Self-Correction Loop (inspect output, fix root cause, rerun).
- Bundle: CHECK_STYLE (format/lint/type):
  - Commands: `pnpm check`, `pnpm test`

Machine-Actionable Validation Checklist
1. Run `pnpm validate` at workspace root. Expect: exit 0.
2. If it fails, capture failing commands and follow Self-Correction Loop: inspect logs, fix root cause, rerun.
3. For package-level changes, run `pnpm --filter <pkg> validate` (use workspace filters).

Self-Correction Loop (automatable)
- Step 1: Run validation command (store stdout/stderr).
- Step 2: If exit != 0, parse output for file paths, line numbers, error codes; create an issue/annotated report.
- Step 3: Attempt minimal fix candidate(s) (lint fix, type fix, missing import).
- Step 4: Re-run same command; repeat until green or human-in-the-loop required.

Exceptions & Edge Cases
- Any formal exception must be explicitly recorded in the source governance file and referenced here with a unique exception ID and justification. No implicit exceptions allowed.

Traceability & Audit
- Each enforcement run should store: timestamp, command, exit code, stdout/stderr, and commit hash. Use `reports/validation` for artifacts.

How to Use This File
- Read-only ground truth remains the original governance files. Use this spec for CI checks, local pre-submit validation, and as the canonical index for automation. Do not edit `AGENTS.md` from this file.

Next Actions (recommended automation)
- Add CI job step that runs `pnpm validate` and archives logs to `reports/validation/<run-id>`.
- Implement a validator script `scripts/gov-validate.mjs` that runs the Bundles above and uploads results.

References
- `AGENTS.md` — canonical authority.
- `.github/copilot-instructions.md` — Copilot runtime policy.
- `.github/instructions/` — all instruction files (refer to originals for specific rule text).

Appendix: Quick Commands
```
# Full gate (root)
pnpm validate

# Package-scoped
pnpm --filter @games/monchola validate

# Style/type checks
pnpm check
pnpm test
```
# Governance and Guardrails Canonical Non-Lossy Token-Efficient Specification

**Version**: 1.0.0-canonical
**Authority**: AGENTS.md, CLAUDE.md, .github/copilot-instructions.md, .github/instructions/*.md, .github/skills/README.md

## PURPOSE
Canonical compressed governance for reuse in prompts, agents, and policy-normalized workflows. Preserve all mandatory constraints, exceptions, and enforcement semantics while reducing duplication.

## CONSTANTS
- PKG_MANAGER = pnpm
- PKG_MANAGER_VERSION = 10.31.0
- NODE_ENGINE_POLICY = 24.14.0
- NODE_ENGINE_PACKAGE = 24.14.1
- ROOT_ALIAS = @/
- ALIAS_DOMAIN = @/domain
- ALIAS_APP = @/app
- ALIAS_UI = @/ui
- LAYER_DOMAIN = src/domain
- LAYER_APP = src/app
- LAYER_UI = src/ui
- LAYER_WORKERS = src/workers
- LAYER_THEMES = src/themes
- BARREL_FILE = index.ts
- DEFAULT_SHELL = bash/posix (WSL/Linux/macOS)
- POWERSHELL_ALLOWED_ONLY_FOR = pnpm run electron:build:win
- MACOS_REQUIRED_FOR = electron:build:mac, cap:init:ios, cap:open:ios, cap:run:ios
- ANDROID_SDK_REQUIRED_FOR = cap:open:android, cap:run:android
- QUALITY_GATE_MIN = pnpm check + pnpm test + pnpm validate
- TEST_NAME_PATTERN_VITEST = <feature>.<type>.test.ts(x)
- TEST_NAME_PATTERN_PLAYWRIGHT = <feature>.<type>.spec.ts
- TEST_TYPES = unit|integration|component|api|e2e|a11y|visual|perf
- LIGHTHOUSE_TARGET = >=90
- LIGHTHOUSE_MIN = >=80
- CSS_CRITICAL_PATH_TARGET = <50KB
- CSS_USAGE_TARGET = >80%
- FIRETV_RESOLUTION_BASE = 1920x1080
- FIRETV_KEYS = 37,38,39,40,13,4,179,227,228
- FIRETV_NONCAPTURABLE = Home,Menu,VoiceSearch
- RUNNER_REQUIRED_FIELDS = scroll_direction,camera_mode,lane_model,movement_model,primary_input,obstacle_model,difficulty_curve,failure_condition
- RUNNER_OUTPUT_SECTIONS = 14 fixed sections
- COMPLIANCE_STATUS = GREEN|AMBER|RED
- COMPLIANCE_LABELS = implemented|in-progress|not implemented
- COMMIT_TYPES = feat,fix,refactor,perf,docs,style,test,chore,a11y,security
- COMMIT_SCOPE_CANONICAL = domain,app,ui,workers,infra,shared,docs,deps,tests

## SYMBOL DEFINITIONS
- @CLEAN = strict layered architecture and dependency direction.
- @SOLID = SRP/OCP/LSP/ISP/DIP enforcement.
- @DRY = no duplicate logic or abstractions.
- @SOC = strict separation of concerns.
- @ATOMIC = atoms -> molecules -> organisms only.
- @POLP = minimum privilege only.
- @RBS = role-based authorization with default deny.
- @SELF_CORRECT = inspect failure, fix root cause, rerun, repeat until green.
- @NO_LOSSY_REFACTOR = behavior/contracts/accessibility/fallbacks must not be removed or silently changed.
- @ONE_PM = pnpm-only operations.
- @SKILL_ROUTING = mandatory workflow-bundle owner selection before non-trivial work.
- @NON_FAKE_DONE = no completion claim without deterministic checks.
- @TV_FIRST = remote-first directional navigation with deterministic back/focus recovery.
- @RUNNER_STRICT = deterministic endless-runner spec with required schema and section order.

## RULE INDEX
- GOV_PRECEDENCE_AGENTS_SUPREME
- GOV_READ_GOVERNANCE_FIRST
- GOV_REUSE_BEFORE_CREATE
- GOV_MINIMAL_DIFF_ONLY
- GOV_NO_FAKE_COMPLETION
- GOV_SELF_CORRECTION_REQUIRED
- GOV_BLOCKER_DISCLOSURE_REQUIRED
- GOV_NO_RULE_DILUTION
- GOV_REPO_CONVENTIONS_STRICT
- GOV_DEPENDENCY_ADDITION_STRICT
- GOV_SKILL_BUNDLE_MAPPING_REQUIRED
- GOV_SKILL_CHAIN_SYNC_REQUIRED
- ARCH_LAYER_DOMAIN_PURE
- ARCH_LAYER_APP_BRIDGE_ONLY
- ARCH_LAYER_UI_PRESENTATION_ONLY
- ARCH_LAYER_WORKER_DOMAIN_ONLY
- ARCH_LAYER_THEMES_CSS_ONLY
- ARCH_IMPORT_BARREL_ONLY
- ARCH_IMPORT_ALIAS_REQUIRED
- ARCH_IMPORT_CROSSLAYER_RELATIVE_FORBIDDEN
- ARCH_COMPONENT_ATOMIC_ORDER_REQUIRED
- ARCH_NO_BUSINESS_LOGIC_IN_UI
- ARCH_DOMAIN_FRAMEWORK_AGNOSTIC
- ARCH_DIRECTORY_TOPLEVEL_ADDITION_RESTRICTED
- ARCH_FILE_NAMING_CONVENTIONS_REQUIRED
- ARCH_ANTIPATTERN_BLOCKLIST_ENFORCED
- SEC_RBS_REQUIRED
- SEC_POLP_REQUIRED
- SEC_NO_HARDCODED_SECRETS
- SEC_XSS_GUARDS_REQUIRED
- SEC_DANGEROUS_HTML_RESTRICTED
- SEC_URL_REDIRECT_VALIDATION_REQUIRED
- SEC_METHOD_ALLOWLIST_REQUIRED
- SEC_ERROR_LEAKAGE_FORBIDDEN
- SEC_ENV_EXPOSURE_VITE_PUBLIC_ONLY
- SEC_COOKIE_CSP_HEADERS_REQUIRED
- TOOL_PNPM_ONLY
- TOOL_NPM_YARN_FORBIDDEN
- TOOL_SCRIPT_REUSE_REQUIRED
- TOOL_BUILD_PATH_SINGLE_SOURCE
- TOOL_WASM_AUTOGEN_FILE_MANUAL_EDIT_FORBIDDEN
- TOOL_JS_BUILD_SCRIPTS_ONLY
- TOOL_FORMAT_LINT_TS_ENFORCED
- TEST_TAXONOMY_8TYPE_REQUIRED
- TEST_FRAMEWORK_SPLIT_REQUIRED
- TEST_NAMING_PATTERN_REQUIRED
- TEST_NAME_VALIDATION_GATE_REQUIRED
- TEST_COLOCATION_ALLOWED_DOMAIN_EXCEPTION
- CI_CHECK_TEST_VALIDATE_REQUIRED
- CI_NO_SUPPRESSION_SHORTCUTS
- CI_PRECOMMIT_ENFORCED
- CI_COMMITLINT_ENFORCED
- CI_RELEASE_AUTOGEN_ENFORCED
- WF_NO_SUPER_APP_RULE
- WF_APP_PROLIFERATION_STRATEGY_REQUIRED
- WF_APP_IDENTITY_PRESERVATION_REQUIRED
- WF_REUSE_WITHOUT_CONSOLIDATION_REQUIRED
- WF_SHARED_PACKAGE_EXTRACTION_REQUIRED
- WF_COMPLIANCE_MATRIX_REQUIRED
- WF_RAG_STATUS_MODEL_REQUIRED
- WF_DASHBOARD_VISIBILITY_REQUIRED
- WF_COMMIT_TYPE_SCOPE_POLICY_REQUIRED
- ENV_SHELL_BASH_DEFAULT_REQUIRED
- ENV_POWERSHELL_OPT_IN_ONLY
- ENV_NODE_PLATFORM_MARKER_SWAP_REQUIRED
- ENV_IOS_APPLE_HARDWARE_REQUIRED
- RESP_USE_RESPONSIVESTATE_REQUIRED
- RESP_5_TIER_SUPPORT_REQUIRED
- RESP_TOUCH_HOVER_FALLBACK_REQUIRED
- PERF_CWV_THRESHOLDS_REQUIRED
- PERF_CSS_CRP_REQUIRED
- PERF_GPU_ANIMATION_ONLY
- INPUT_SEMANTIC_ACTION_MODEL_REQUIRED
- INPUT_TEXT_ENTRY_SAFETY_REQUIRED
- INPUT_KEYBOARD_ADAPTER_SCOPE_REQUIRED
- INPUT_DEVICE_CONTEXT_BEHAVIOR_REQUIRED
- TV_KEYMAP_REQUIRED
- TV_NONCAPTURABLE_KEYS_ASSUMPTION_REQUIRED
- TV_LIFECYCLE_FOCUS_RECOVERY_REQUIRED
- TV_VALIDATION_WORKFLOW_REQUIRED
- RUNNER_SCHEMA_TEMPLATE_REQUIRED
- RUNNER_REQUIRED_FIELDS_REQUIRED
- RUNNER_14_SECTION_OUTPUT_REQUIRED
- RUNNER_DETERMINISTIC_SPEC_REQUIRED
- MENU_DUAL_LAYER_ARCH_REQUIRED
- MENU_PORTAL_DROPDOWN_REQUIREMENTS
- MENU_SETTINGS_MODAL_TRANSACTIONAL_REQUIRED
- A11Y_WCAG_AA_REQUIRED
- A11Y_KEYBOARD_FOCUS_ESC_REQUIRED
- MOBILE_SAFEAREA_GESTURE_OFFLINE_REQUIRED
- MOBILE_PERF_BASELINES_REQUIRED
- STORE_COMPLIANCE_GATES_REQUIRED

## ARCHITECTURE

### Principles
1. Apply @CLEAN @SOLID @DRY @SOC @ATOMIC @NO_LOSSY_REFACTOR.
2. Domain logic MUST be deterministic and framework-agnostic.
3. UI MUST remain presentation/composition only.
4. Shared logic SHOULD live in packages; apps SHOULD compose, not duplicate.
5. Product identity belongs in apps; reusable logic belongs in packages.

### Layer Matrix

| Layer | May Depend On | Must Not Depend On | Notes |
|---|---|---|---|
| Domain (`src/domain`) | domain only | app, ui, react/frameworks, side-effect storage | pure rules/types/constants/engines |
| App (`src/app`) | domain, app | ui internals | hooks/context/services orchestration |
| UI (`src/ui`) | domain, app, ui | domain violations, direct infra bypass | atoms -> molecules -> organisms |
| Workers (`src/workers`) | domain, wasm data | app, ui, react, DOM/localStorage | message-based only |
| Themes (`src/themes`) | none | all JS/TS imports | pure CSS only |

### Dependency and Import Constraints
1. Use aliases and barrels only: @/domain, @/app, @/ui.
2. Relative cross-layer imports are forbidden.
3. Every public directory API MUST be controlled by index.ts.
4. Theme CSS MUST stay in src/themes only.
5. UI MUST not contain business logic.
6. useResponsiveState() is the semantic responsive source of truth.
7. UI components MUST NOT access localStorage directly.
8. Gameplay MUST use semantic actions, not raw device events.

## SECURITY
1. Enforce @POLP and @RBS with default deny.
2. Secrets MUST NOT be hardcoded.
3. Browser-exposed env vars are public; only VITE_* is exposed.
4. Unsafe HTML/DOM injection is forbidden by default.
5. URL redirects MUST be allowlisted.
6. HTTP methods/content-types MUST be validated by allowlist.
7. Client-visible errors MUST be generic; internals MUST NOT leak.
8. Secure headers/cookies/CSP MUST follow secure defaults.
9. Security governance MUST remain auditable and compliance-linked.

## TOOLING
1. pnpm only; npm/yarn/npx are forbidden in repository workflows.
2. Prefer package.json scripts and skill-owned script chains.
3. Build baseline: Vite, TypeScript, ESLint, Prettier, Vitest, Playwright.
4. WASM path MUST remain single-source and generated artifacts MUST NOT be edited manually.
5. Build/helper scripts MUST remain in JS/TS ecosystem.
6. Commit governance stack (commitizen, commitlint, husky, CI, standard-version) is mandatory.

## TESTING
1. Enforce 8-type taxonomy: unit, integration, component, api, e2e, a11y, visual, perf.
2. Vitest is for unit/integration/component/api/perf; Playwright is for e2e/a11y/visual.
3. Test filenames MUST match canonical patterns.
4. test:names MUST gate naming.
5. Co-located tests are standard; domain-only exception applies when explicitly allowed.
6. No framework-mixing in one test file.

## CI/CD AND QUALITY GATES
1. Required sequence: pnpm check, pnpm test, pnpm validate (or stricter equivalent).
2. Validation failure triggers @SELF_CORRECT.
3. Do not bypass failures by disabling lint, weakening types, deleting tests, or suppressing errors.
4. Commit type/scope/subject and breaking-change footer rules MUST be enforced.
5. Releases/changelogs MUST be automated and semver-driven.
6. Compliance pipelines MUST preserve dashboards and threshold validation.
7. CSS/CRP and Core Web Vitals thresholds are gate criteria for frontend changes.

## REPOSITORY / WORKFLOW RULES
1. Map work to Operational Workflow Bundles and select a primary owner skill.
2. Reuse before create; do not duplicate abstractions or workflows.
3. Minimal diff is mandatory.
4. No lossy refactors.
5. Super-app/selector consolidation is forbidden; many independent apps are the platform strategy.
6. Shared systems belong in packages; app identity belongs in apps.
7. Compliance matrix MUST track features, quality gates, security, accessibility, and platform readiness with GREEN/AMBER/RED.
8. Dashboard visibility for compliance status MUST remain available.
9. Governance references MUST stay synchronized and non-conflicting.
10. No new top-level directories without explicit instruction.

## PLATFORM / ENVIRONMENT RULES
1. Bash/POSIX is the default shell; PowerShell is opt-in only for pnpm run electron:build:win.
2. iOS tasks require Apple/macOS-capable environments.
3. Respect node-platform marker workflow when switching WSL/Windows native module contexts.
4. Responsive policy: 5-tier support, content-density awareness, touch-safe hover fallback.
5. Input policy: semantic actions, text-input safety, context-aware behavior, keyboard adapter scope discipline.
6. Fire TV: required keymap, non-capturable controls, lifecycle pause/resume, focus recovery, 10-foot UI constraints.
7. Endless runner: schema/template authority, required fields, deterministic 14-section output.
8. Mobile readiness: safe-area handling, gesture reliability, offline persistence, lifecycle survival, performance and accessibility checks.
9. App-store compliance gates MUST remain active and strict.

## PROHIBITIONS
1. NEVER use npm/yarn/npx in governed repository workflows.
2. NEVER bypass architecture boundaries or import constraints.
3. NEVER place business logic in UI presentation layers.
4. NEVER claim work complete without required checks.
5. NEVER suppress quality failures by disabling lint/type/test protections.
6. NEVER perform lossy refactors that remove behavior/contracts/fallbacks/accessibility/focus/input semantics.
7. NEVER create super-app or selector consolidation.
8. NEVER hardcode secrets or leak private internals.
9. NEVER rely on Fire TV non-capturable controls or hover/precision-only interactions for required flows.
10. NEVER manually edit generated WASM payloads.
11. NEVER create parallel build pipelines that duplicate sanctioned paths.
12. NEVER introduce ad hoc command chains when skill-owned chains exist.
13. NEVER use cross-layer relative imports or internal-file imports that bypass barrels.
14. NEVER break keyboard/text-input safety.
15. NEVER silently weaken governance documents or precedence.

## EXCEPTIONS / EDGE CASES
1. PowerShell is allowed only for pnpm run electron:build:win.
2. iOS commands are valid only on Apple/macOS-capable environments.
3. App-local .npmrc files are allowed only for additive, non-conflicting tuning.
4. Colocated tests are allowed for domain-only/pure-function cases when explicitly instructed.
5. Sync AI paths are acceptable for low complexity; async paths are required when thresholds demand.
6. dangerouslySetInnerHTML is allowed only with explicit sanitization and review constraints.
7. AGENTS authority supersedes subordinate docs.
8. Policy engine version pinning in governance remains authoritative over silent metadata drift.
9. Hover behavior is allowed only with coarse-pointer fallback.
10. Fire TV cache guidance may be augmented by platform APIs when available, but sensitive auth defaults remain strict.

## REFERENCE INVOCATION FORMAT
- APPLY_RULES: [ARCH_IMPORT_BARREL_ONLY]
- APPLY_RULES: [GOV_READ_GOVERNANCE_FIRST, TOOL_PNPM_ONLY, CI_CHECK_TEST_VALIDATE_REQUIRED]
- APPLY_BUNDLES: [APPLY_ARCH_CORE, APPLY_SEC_CORE, APPLY_TOOLCHAIN_CORE, APPLY_TEST_CORE, APPLY_PLATFORM_CORE]
- APPLY_EXCEPTIONS: [ENV_POWERSHELL_OPT_IN_ONLY]

## GROUP REFERENCES
- APPLY_ARCH_CORE = [ARCH_LAYER_DOMAIN_PURE, ARCH_LAYER_APP_BRIDGE_ONLY, ARCH_LAYER_UI_PRESENTATION_ONLY, ARCH_IMPORT_BARREL_ONLY, ARCH_IMPORT_ALIAS_REQUIRED, ARCH_IMPORT_CROSSLAYER_RELATIVE_FORBIDDEN, ARCH_NO_BUSINESS_LOGIC_IN_UI]
- APPLY_SEC_CORE = [SEC_RBS_REQUIRED, SEC_POLP_REQUIRED, SEC_NO_HARDCODED_SECRETS, SEC_XSS_GUARDS_REQUIRED, SEC_ERROR_LEAKAGE_FORBIDDEN, SEC_ENV_EXPOSURE_VITE_PUBLIC_ONLY]
- APPLY_TOOLCHAIN_CORE = [TOOL_PNPM_ONLY, TOOL_SCRIPT_REUSE_REQUIRED, TOOL_FORMAT_LINT_TS_ENFORCED, TOOL_BUILD_PATH_SINGLE_SOURCE, TOOL_WASM_AUTOGEN_FILE_MANUAL_EDIT_FORBIDDEN]
- APPLY_TEST_CORE = [TEST_TAXONOMY_8TYPE_REQUIRED, TEST_FRAMEWORK_SPLIT_REQUIRED, TEST_NAMING_PATTERN_REQUIRED, TEST_NAME_VALIDATION_GATE_REQUIRED, CI_CHECK_TEST_VALIDATE_REQUIRED]
- APPLY_CI_CORE = [CI_CHECK_TEST_VALIDATE_REQUIRED, CI_NO_SUPPRESSION_SHORTCUTS, CI_PRECOMMIT_ENFORCED, CI_COMMITLINT_ENFORCED, CI_RELEASE_AUTOGEN_ENFORCED]
- APPLY_PLATFORM_CORE = [ENV_SHELL_BASH_DEFAULT_REQUIRED, ENV_POWERSHELL_OPT_IN_ONLY, RESP_USE_RESPONSIVESTATE_REQUIRED, INPUT_SEMANTIC_ACTION_MODEL_REQUIRED, TV_KEYMAP_REQUIRED, RUNNER_SCHEMA_TEMPLATE_REQUIRED]
- APPLY_WORKFLOW_CORE = [GOV_REUSE_BEFORE_CREATE, GOV_MINIMAL_DIFF_ONLY, WF_NO_SUPER_APP_RULE, WF_REUSE_WITHOUT_CONSOLIDATION_REQUIRED, WF_COMPLIANCE_MATRIX_REQUIRED]

## VALIDATION CHECKLIST
- No rules lost.
- No constraints weakened.
- Duplicates removed.
- Canonical IDs assigned.
- Constants extracted where beneficial.
- Architecture preserved.
- Security preserved.
- Exceptions preserved.
- Token usage reduced materially.