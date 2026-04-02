# Phase 2: Automated Regression Detection Roadmap

**Status**: 🟡 **SPRINT 2 WEEK 3 IN PROGRESS** — Dashboard Alerts & Visualization  
**Start Date**: April 1, 2026  
**Target Completion**: May 1, 2026 (1-month sprint)  
**Effort Estimate**: 40–60 developer hours  
**Priority**: HIGH (prevents performance degradation)  
**Owner**: Solo Development (You)

---

## 🎉 SPRINT 1 COMPLETION SUMMARY (Week 1 + Week 2)

**Status**: ✅ **COMPLETE** - All deliverables finished, tested, and operational

### Week 1: Baseline Setup ✅ COMPLETE
- ✅ Created `compliance/wasm-profiles-baseline.json` (v1.0.0, all 25 apps GREEN)
- ✅ Created `compliance/baselines/` directory structure for historical tracking
- ✅ Wrote `compliance/BASELINE-MANAGEMENT-GUIDE.md` (440+ lines, complete procedures)
- ✅ Created `compliance/regression-alerts.json` template with schema
- ✅ Added 3 new npm scripts: `baseline:list`, `baseline:show`, `wasm:build:check`
- ✅ All systems verified and working

**Deliverables**: Baseline infrastructure complete, baseline v1.0.0 snapshot established, documentation ready

### Week 2: Regression Detection Script ✅ COMPLETE
- ✅ Created `scripts/check-wasm-regressions.js` (240 lines, ES6 modules)
- ✅ Implemented full detection logic with 3 severity levels (NO_ISSUE / INVESTIGATE / FIX_REQUIRED)
- ✅ Added colorized console reports with emoji severity indicators
- ✅ Integrated JSON logging to `compliance/regression-alerts.json`
- ✅ Proper exit codes: 0 (OK), 1 (INVESTIGATE), 2 (FIX_REQUIRED)
- ✅ Updated `package.json` with `check:regressions` command
- ✅ Tested with synthetic regressions — detection working correctly
- ✅ All 25 apps detected and compared against baseline

**Deliverables**: Regression detection script operational, baseline comparison working, alerts logging functional

### Verification Results
```
✅ pnpm baseline:list      → Lists active baseline (12K, Apr 1)
✅ pnpm baseline:show      → Displays baseline summary (25 GREEN, avg 2.58ms)
✅ pnpm check:regressions  → Detects regressions, logs alerts, exits with proper code
```

**Status**: Both scripts operational, all baseline infrastructure ready for Phase 2 Sprints 2+ 

---

## Executive Summary

Phase 2 extends the existing WASM profiling system with automated regression detection, alerting, and performance budgeting. The goal is to catch performance degradation immediately and enforce performance constraints across all 25 game AI modules.

**Key Outcomes:**

- ✅ Automated baseline comparison on every build
- ⏳ Real-time regression alerts (email, dashboard, CI/CD) — Weeks 3-4
- ⏳ Per-app performance budgets with enforcement — Weeks 5-6
- ⏳ Historical trending and anomaly detection — Weeks 7-8
- ⏳ Optimization prioritization framework — Weeks 7-8

---

## Current State (Phase 1 - Operational)

**Baseline Performance:**

- ✅ All 25 apps: GREEN status (<100ms hard difficulty)
- ✅ Fastest: Cee-lo (0.01ms)
- ✅ Slowest: Sudoku (52.42ms)
- ✅ Average: ~15ms hard difficulty
- ✅ Build overhead: <3 seconds

**Files in Production:**

- `scripts/build-wasm-all.js` — Orchestration and profiling
- `compliance/wasm-profiles.json` — Current metrics snapshot
- `compliance/matrix.json` — Governance integration
- `compliance/dashboard.html` — Real-time visualization
- `compliance/WASM-PROFILING-GUIDE.md` — Operational documentation

**Open Questions for Phase 2:**

- How do we detect when a single build regresses relative to the last build?
- What are acceptable regression thresholds per app?
- How do we alert you immediately on detection?
- How do we track historical trends?
- Which apps have optimization opportunities?

---

## Phase 2 Objectives

### O1: Baseline Management

Track historical performance and identify deviations.

**Baseline Definition:**

- Snapshot of performance metrics at a known good state (e.g., v1.0.0 release)
- Includes all 25 apps with easy/medium/hard timings
- Timestamped for audit trail
- Versioned in git for tracking changes

**Implementation:**

- Create `compliance/wasm-profiles-baseline.json` at release time
- Store historical baselines in `compliance/baselines/` directory
- Tag each baseline with semantic version number
- Document baseline setup procedure

---

### O2: Regression Detection

Identify deviations from baseline in automated builds.

**Detection Strategy:**

1. **Build-Time Detection** (every `pnpm wasm:build`)
   - Load current baseline from `compliance/wasm-profiles-baseline.json`
   - Load latest build from `compliance/wasm-profiles.json`
   - Compare each app's hard difficulty timing
   - Flag if: `latest.hard > baseline.hard * 1.1` (10% threshold)

2. **Continuous Integration** (optional, skip for solo dev)
   - Run detection on every commit to main branch
   - Fail CI if regression > 20ms (hard stop)
   - Warn if regression 5–20ms (allow with justification)
   - Log all results to `compliance/regression-log.json`

3. **Historical Comparison** (weekly trend analysis)
   - Compare current vs last week's average
   - Detect unexpected patterns or trends
   - Flag sustained degradation over time

**Regression Categories:**

- 🟢 **NO ISSUE**: Regression <5% (noise, accept)
- 🟡 **INVESTIGATE**: Regression 5–10% (profile and explain)
- 🔴 **FIX REQUIRED**: Regression >10% (revert code change, fix, re-run)

---

### O3: Alerting System

Notify you immediately when regressions detected.

**Alert Channels:**

1. **Terminal Console** (immediate, always enabled)

   ```
   ⚠️  WASM REGRESSION DETECTED
   App: sudoku
   Baseline Hard: 52.42ms
   Current Hard: 58.88ms
   Regression: +6.46ms (+12.3%)
   Status: 🔴 FIX REQUIRED
   Action: Review recent assembly/index.ts changes
   ```

2. **Dashboard Alert** (visual, always enabled)
   - Red banner at top when regression detected
   - List of problematic apps with details
   - Links to commit history and code diff
   - Manual dismiss button (recorded in log)

3. **JSON Log** (audit trail, always enabled)
   - `compliance/regression-alerts.json`
   - Timestamp, app, threshold, severity
   - Triggered by, dismissed by, justification if ignored
   - Used for trend analysis

4. **Email Alert** (optional, manual setup)
   - One email per regression detection
   - Summary of all flagged apps
   - Links to dashboard and detailed report
   - Requires SMTP configuration

---

### O4: Performance Budgeting

Define and enforce per-app performance constraints.

**Budget Framework:**

Each app has a **performance budget** defined as:

- **Easy Limit**: 10ms (for accessibility, smooth play)
- **Medium Limit**: 30ms (for balanced experience)
- **Hard Limit**: 100ms (current threshold for GREEN status)

**Budget File Structure** (`compliance/performance-budgets.json`):

```json
{
  "budgets": {
    "sudoku": {
      "easy": { "limit": 10, "current": 0.2, "status": "GREEN" },
      "medium": { "limit": 30, "current": 5.1, "status": "GREEN" },
      "hard": { "limit": 100, "current": 52.42, "status": "GREEN" },
      "owner": "Solo Dev",
      "lastReview": "2026-04-01",
      "notes": "Constraint solving performance-bound, difficult to optimize further"
    },
    "bunco": {
      "easy": { "limit": 10, "current": 0.01, "status": "GREEN" },
      "medium": { "limit": 30, "current": 0.02, "status": "GREEN" },
      "hard": { "limit": 100, "current": 0.01, "status": "GREEN" },
      "owner": "Solo Dev",
      "lastReview": "2026-04-01",
      "notes": "Minimal AI logic, excellent performance headroom"
    }
  },
  "globalThresholds": {
    "regressionWarning": 5,
    "regressionAlert": 10,
    "regressionStop": 20
  }
}
```

**Budget Enforcement:**

- Dashboard displays budget vs current for each app
- Visual indicator when approaching limit
- Alerts when crossing 80%, 90%, 100% of budget
- Code reviews must justify any budget increases
- Historical tracking of budget changes

---

### O5: Optimization Strategy

Identify and prioritize optimization opportunities.

**Current Optimization Status:**

- 🟢 **25 apps GREEN** — All performing well
- 🟡 **0 apps AMBER** — No immediate optimization needed
- 🔴 **0 apps RED** — No critical performance issues

**Future Optimization Candidates** (if they move to AMBER/RED):

1. **Sudoku** (highest complexity)
   - Current: 52.42ms (hard)
   - Headroom: 47.58ms to 100ms limit
   - Opportunities:
     - Bitboard representation for constraint checks (potential 30% speedup)
     - Pre-computed lookup tables for validity checks
     - Early-termination heuristics for constraint propagation
   - Estimated Effort: 8–12 hours
   - Estimated Speedup: 20–35%

2. **Minesweeper** (complex board logic)
   - Current: ~25ms (hard)
   - Headroom: 75ms to 100ms limit
   - Opportunities:
     - Optimize flood-fill algorithm with visited set pre-allocation
     - Cache board state hash for rapid equality checks
   - Estimated Effort: 4–6 hours
   - Estimated Speedup: 15–25%

3. **Queens** (permutation complexity)
   - Current: ~40ms (hard)
   - Headroom: 60ms to 100ms limit
   - Opportunities:
     - Constraint propagation with bitmask operations
     - Row/column/diagonal tracking via integer flags
   - Estimated Effort: 6–10 hours
   - Estimated Speedup: 25–40%

4. **Chess/Checkers** (minimax depth)
   - Current: ~30–35ms (hard)
   - Headroom: 65–70ms to 100ms limit
   - Opportunities:
     - Alpha-beta pruning enhancements
     - Transposition table (zobrist hashing)
     - Move ordering improvements
   - Estimated Effort: 10–15 hours
   - Estimated Speedup: 20–35%

**Optimization Decision Framework:**

- Optimize only if: moving toward AMBER (>80ms hard) OR user requests
- Measure before and after with 5-run averages
- Ensure correctness with extended test suite
- Document algorithmic changes in code comments
- Update budget documentation after optimization

---

## Phase 2 Implementation Plan

### Sprint 1: Baseline & Regression Detection (Weeks 1–2) ✅ COMPLETE

**Week 1: Setup** ✅ COMPLETE

- [x] Create `compliance/wasm-profiles-baseline.json` from current production state
- [x] Create `compliance/baselines/` directory for historical tracking
- [x] Write documentation: "How to Create and Update Baselines"
- [x] Add `compliance/regression-alerts.json` template
- [x] Update `package.json` to include baseline management scripts

**Completed Files:**
- `compliance/wasm-profiles-baseline.json` — v1.0.0 baseline, 12KB, 25 apps GREEN
- `compliance/BASELINE-MANAGEMENT-GUIDE.md` — 440+ lines, complete operational procedures
- `compliance/baselines/README.md` — Archive index and historical tracking procedures
- `compliance/regression-alerts.json` — Alert schema template, 2 entries logged
- `package.json` — Added 3 new scripts (baseline:list, baseline:show, check:regressions)

**Actual Duration**: ~4 hours (Week 1 rapid delivery)

**Status**: ✅ DELIVERED — All components tested and operational

---

**Week 2: Detection Script** ✅ COMPLETE

- [x] Create `scripts/check-wasm-regressions.js` (240 lines)
  - [x] Load baseline and current profiles
  - [x] Compare each app per difficulty
  - [x] Calculate regression percentages
  - [x] Flag regressions per categories (NO ISSUE / INVESTIGATE / FIX REQUIRED)
  - [x] Output formatted report to console
  - [x] Write JSON log to `compliance/regression-alerts.json`
- [x] Integrate into build pipeline (`pnpm check:regressions` command)
- [x] Test with synthetic regression (simulate regression, verify detection)
- [x] Document script usage and output format

**Completed Files:**
- `scripts/check-wasm-regressions.js` — 240-line ES6 module, fully functional
- Updated `package.json` — Added `check:regressions` and `wasm:build:check` scripts

**Test Results:**
- ✅ No regressions: All 25 apps detected, zero regressions logged
- ✅ Synthetic regression (6% increase): Correctly detected and classified as INVESTIGATE
- ✅ Exit codes: Proper exit codes returned (0, 1, 2 per severity)
- ✅ Alerts logging: JSON entries appended correctly with full regression details

**Actual Duration**: ~6 hours (Week 2 implementation + testing)

**Status**: ✅ DELIVERED — Script tested in production, alerts system functional, all tests passing

---

### Next: Sprint 2 - Alerting & Dashboard (Weeks 3–4)

⏳ Not yet started. Baseline infrastructure established and tested. Ready to begin alerting system design and implementation.

**Week 3: Dashboard Alerts**

- [ ] Add regression alert banner to dashboard.html
  - Red background, high visibility
  - Display list of regressed apps with severity
  - Show baseline vs current vs regression percentage
  - Manual dismiss button (records in log)
- [ ] Add regression details section to dashboard
  - New tab or expandable section
  - Historical regression log viewer
  - Trend chart (regression count over time)
  - Severity distribution pie chart
- [ ] Styling and responsive design
- [ ] User testing and refinement

**Task Duration**: 6–8 hours

**Deliverables:**

- Enhanced dashboard with regression visualization
- Regression log viewer
- Screenshot examples in documentation

**Week 4: Multi-Channel Alerts**

- [ ] Email alert template (optional)
  - HTML email with regression summary
  - Links to dashboard and detailed report
  - App-specific details with images
- [ ] Slack webhook integration (optional)
  - Real-time notification to a channel
  - Formatted message with severity emoji
  - Link to dashboard
- [ ] Documentation
  - Setup guide for email alerts
  - Setup guide for Slack integration
  - Alert customization options

**Task Duration**: 4–6 hours (email only, skip Slack for Phase 2 V1)

**Deliverables:**

- Email alert system
- Documentation of alert setup
- Test run with sample regression

---

### Sprint 3: Performance Budgets (Weeks 5–6)

**Week 5: Budget Data & Dashboard**

- [ ] Create and populate `compliance/performance-budgets.json`
  - Define limits for all 25 apps
  - Set global thresholds
  - Add usage notes per app
- [ ] Enhance dashboard with budget visualization
  - New "Performance Budgets" tab or section
  - Bar charts: budget vs current per app, per difficulty
  - Color coding: GREEN (0–80%), YELLOW (80–100%), RED (>100%)
  - Sorting options: by app, by remaining headroom, by complexity
- [ ] Add budget enforcement to regression detection script
  - Flag when current >80% of limit (warning)
  - Flag when current >100% of limit (critical, but shouldn't happen in Phase 1)

**Task Duration**: 6–8 hours

**Deliverables:**

- Budget configuration file
- Dashboard budget visualization
- Budget enforcement in detection script
- Initial budget review documentation

**Week 6: Budget Tracking & Trend Analysis**

- [ ] Create historical budget tracking
  - `compliance/budget-history.json` to track budget changes over time
  - Append entry on each build with current state
  - Track when budgets are increased and justifications
- [ ] Add trend analysis to dashboard
  - Line chart: each app's hard difficulty over last 30 builds
  - Detect trends: improving, stable, degrading
  - Highlight apps with increasing trend toward budget limit
- [ ] Documentation
  - How to adjust budgets (when and why)
  - How to review budget trends
  - How to use for prioritization

**Task Duration**: 5–7 hours

**Deliverables:**

- Budget history tracking system
- Dashboard trend visualization
- Budget management guidelines

---

### Sprint 4: Optimization Strategy & Documentation (Weeks 7–8)

**Week 7: Optimization Analysis**

- [ ] Analyze each of the highest-complexity apps
  - Profile decision trees and branching patterns
  - Identify performance hotspots from AssemblyScript source
  - Evaluate optimization impact/effort ratio
  - Document findings in `compliance/OPTIMIZATION-OPPORTUNITIES.md`
- [ ] Prioritize by impact and effort
  - Matrix: Low Effort / High Impact (do first)
  - Matrix: High Effort / Medium Impact (do later)
  - Matrix: Low Impact (archive for reference)
- [ ] Create per-app optimization plans
  - Specific algorithmic improvements
  - Estimated speedup (conservative, optimistic)
  - Estimated effort hours
  - Testing strategy

**Task Duration**: 6–8 hours

**Deliverables:**

- Optimization opportunities document
- Per-app improvement plans
- Prioritization matrix

**Week 8: Documentation & Finalization**

- [ ] Write Phase 2 operations guide
  - Daily operational procedures
  - Weekly trend review
  - Monthly optimization assessment
  - Quarterly baseline refresh decision
- [ ] Create troubleshooting guide
  - "Regression detected—what now?"
  - "How to revert a regression?"
  - "How to investigate a complex regression?"
  - "When should I optimize vs accept?"
- [ ] Update main README with Phase 2 status
- [ ] Create "Phase 3 Roadmap" placeholder (optional)
- [ ] Training/handoff documentation (for future)

**Task Duration**: 5–6 hours

**Deliverables:**

- Operations guide
- Troubleshooting guide
- Phase 2 completion report

---

## Detailed Component Specifications

### Component 1: Regression Detection Script

**File**: `scripts/check-wasm-regressions.js` (200–250 lines)

**Purpose**: Compare current WASM profiles against a baseline and report regressions.

**Inputs:**

- `compliance/wasm-profiles-baseline.json` (baseline state)
- `compliance/wasm-profiles.json` (current build state)
- Optional CLI arg: `--baseline <file>` to use alternate baseline
- Optional CLI arg: `--threshold <percent>` to override default 10%

**Algorithm:**

```
1. Load baseline and current profiles
2. For each app in current:
   a. Get baseline metrics
   b. If app missing from baseline: SKIP (new app)
   c. Compare each difficulty (easy, medium, hard)
   d. Calculate regression % = (current - baseline) / baseline * 100
   e. Classify severity:
      - < 5%: NO_ISSUE (ignore)
      - 5–10%: INVESTIGATE (warning)
      - > 10%: FIX_REQUIRED (alert)
3. Collect results by severity
4. Output formatted report to console
5. Append to regression-alerts.json with timestamp
```

**Console Output Format:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 WASM REGRESSION DETECTION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Baseline: compliance/wasm-profiles-baseline.json
Current:  compliance/wasm-profiles.json
Timestamp: 2026-04-15T14:32:18.905Z

🔴 FIX REQUIRED (>10% regression):
   • sudoku: 52.42ms → 58.88ms (+12.3%)
   • queens: 40.15ms → 45.22ms (+12.6%)

🟡 INVESTIGATE (5–10% regression):
   • minesweeper: 25.10ms → 26.50ms (+5.6%)

🟢 OK (no issue or <5% regression):
   • 22 other apps within tolerance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  ACTION REQUIRED: Review and fix regressions >10%
Detailed log: compliance/regression-alerts.json
Dashboard: open compliance/dashboard.html
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**JSON Output** (`compliance/regression-alerts.json` append):

```json
{
  "timestamp": "2026-04-15T14:32:18.905Z",
  "baselineFile": "compliance/wasm-profiles-baseline.json",
  "currentFile": "compliance/wasm-profiles.json",
  "totalApps": 25,
  "regressions": [
    {
      "app": "sudoku",
      "difficulty": "hard",
      "baselineMs": 52.42,
      "currentMs": 58.88,
      "regressionMs": 6.46,
      "regressionPercent": 12.3,
      "severity": "FIX_REQUIRED",
      "threshold": 10
    }
  ],
  "summary": {
    "fixRequired": 2,
    "investigate": 1,
    "ok": 22
  },
  "acknowledgedBy": null,
  "acknowledgedAt": null
}
```

**Exit Codes:**

- 0: No regressions
- 1: INVESTIGATE level regressions (warnings)
- 2: FIX_REQUIRED level regressions (errors)

---

### Component 2: Dashboard Regression Alert System

**File**: `compliance/dashboard.html` (additions to existing file)

**New UI Elements:**

1. **Regression Alert Banner**
   - Appears at top of page when regression detected
   - Red background (#d32f2f), white text
   - Icon: 🔴 WARNING
   - Content: "WASM regression detected: 2 apps require attention. View regression details."
   - Dismiss button (records dismissal to log)
   - Auto-hide after 24 hours unless threshold increases

2. **Regression Details Tab**
   - New tab in dashboard: "🔴 Regressions"
   - Shows regression-alerts.json data
   - Filtered view: Show only FIX_REQUIRED and INVESTIGATE (hide OK)
   - Sortable columns: App, Difficulty, Baseline, Current, Regression %, Severity
   - Each row expandable to show full JSON record
   - Color-coded cells: RED for FIX_REQUIRED, YELLOW for INVESTIGATE

3. **Regression Trend Chart**
   - Mini line chart: Regression count over last 30 builds
   - X-axis: Build count
   - Y-axis: Number of regressions (FIX_REQUIRED + INVESTIGATE)
   - Trend line shows if regressions increasing or decreasing
   - Hoverable: Show date and counts on hover

---

### Component 3: Performance Budget System

**File**: `compliance/performance-budgets.json` (new config file)

**Schema:**

```json
{
  "version": "1.0",
  "createdDate": "2026-04-01",
  "budgets": {
    "[app-name]": {
      "easy": {
        "limitMs": 10,
        "currentMs": 0.2,
        "headroomMs": 9.8,
        "utilization": 2,
        "status": "GREEN"
      },
      "medium": { ... },
      "hard": { ... },
      "owner": "Solo Dev",
      "lastReviewDate": "2026-04-01",
      "notes": "Single-player game, no constraint solving"
    }
  },
  "globalThresholds": {
    "regressionWarningPercent": 5,
    "regressionAlertPercent": 10,
    "regressionStopPercent": 20,
    "budgetUtilizationWarning": 80,
    "budgetUtilizationCritical": 100
  },
  "reviewSchedule": {
    "frequency": "quarterly",
    "nextReviewDate": "2026-07-01"
  }
}
```

**Budget Visualization on Dashboard:**

1. **Budget Summary Card**
   - Count of apps by status
   - Average headroom across all apps
   - Trend indicator: improving, stable, degrading

2. **Budget Table**
   - Columns: App, Difficulty, Limit, Current, Headroom, Utilization %, Status
   - Rows colored: GREEN (<80%), YELLOW (80–100%), RED (>100%)
   - Sortable by headroom (default: ascending, showing most at-risk apps first)

3. **Budget Headroom Chart**
   - Horizontal bar for each app
   - Bar length = 100ms (hard limit)
   - Green section = headroom remaining
   - Red section = current usage
   - Hover shows exact values

---

### Component 4: Optimization Opportunities Document

**File**: `compliance/OPTIMIZATION-OPPORTUNITIES.md` (new document)

**Structure:**

```markdown
# WASM Optimization Opportunities

**Status**: Analysis Complete, Phase 2  
**Date**: April 15, 2026  
**Current Baseline**: All 25 apps GREEN, no immediate optimization needed

## Executive Summary

Current performance is healthy with no apps approaching RED status. This document captures optimization opportunities for future phases when performance becomes a concern (e.g., game complexity increases, new AI algorithms added, or market demands lower latency).

## Prioritization Matrix

| App         | Current (Hard) | Complexity | Impact | Effort | Ratio | Priority |
| ----------- | -------------- | ---------- | ------ | ------ | ----- | -------- |
| sudoku      | 52.42ms        | ⭐⭐⭐⭐⭐ | High   | 8–12h  | 0.75  | P1       |
| queens      | 40.15ms        | ⭐⭐⭐⭐   | High   | 6–10h  | 0.80  | P1       |
| minesweeper | 25.10ms        | ⭐⭐⭐     | Medium | 4–6h   | 0.67  | P2       |
| chess       | 35.20ms        | ⭐⭐⭐⭐   | Medium | 10–15h | 0.50  | P3       |

**Ratio**: High Impact / Effort Hours (higher = better ROI)

## Detailed Opportunity Analysis

### [App Name]

**Current Performance**: X.XXms (hard)  
**Headroom**: Yms to 100ms limit  
**Complexity**: ⭐⭐⭐⭐ (out of 5)

**Bottlenecks Identified**:

- Description of performance hotspots
- Code sections or algorithms identified
- Estimated % contribution to total time

**Optimization Strategies**:

1. Strategy A
   - Description and rationale
   - Estimated speedup: 15–25%
   - Effort: 6–8 hours
   - Risk: Low / Medium / High
2. Strategy B
   - ...

**Success Criteria**:

- X% faster than baseline
- All test cases pass
- Generated solution quality unchanged
```

---

## Alerting System Setup

### Alert Channel 1: Console Output (Built-In)

**Trigger**: Every `pnpm wasm:build` execution  
**Mechanism**: check-wasm-regressions.js prints to stdout  
**Customization**: None required, works automatically

**Example Output** (see Component 1 above)

---

### Alert Channel 2: Dashboard Visual Alert (Built-In)

**Trigger**: Dashboard.html loads and fetches regression-alerts.json  
**Mechanism**: JavaScript renders alert banner if any FIX_REQUIRED or INVESTIGATE regressions  
**Customization**: None required, works automatically

**Dismissal**: Manual click, recorded in regression-alerts.json acknowledgedBy/At fields

---

### Alert Channel 3: Email (Optional, Phase 2 V2)

**Setup Required**:

1. Create `scripts/send-regression-email.js`
   - Reads regression-alerts.json
   - Formats HTML email with severity colors
   - Uses nodemailer to send email
2. Configure `.env.local` with SMTP details
   - `SMTP_HOST` (e.g., gmail, outlook, sendgrid)
   - `SMTP_PORT` (e.g., 587, 465)
   - `SMTP_USER` (your email)
   - `SMTP_PASS` (app password or API key)
   - `ALERT_EMAIL_TO` (recipient email)
3. Integrate into build pipeline or cron job
   - Can run standalone: `node scripts/send-regression-email.js`
   - Can be called from `check-wasm-regressions.js` with `--email` flag

**Timeline**: Week 4 of Phase 2 (optional, skip if console/dashboard sufficient)

---

### Alert Channel 4: Slack (Optional, Phase 3)

**Deferred to Phase 3** — Requires webhook setup and JSON formatting

---

## Performance Budget Rules

### Rule 1: Budget Limits

Each app has explicit limits per difficulty:

```
Easy: 10ms (touch-optimized, instant feedback)
Medium: 30ms (balanced)
Hard: 100ms (maximum acceptable latency)
```

### Rule 2: Regression Thresholds

```
< 5%: Acceptable (natural variance)
5–10%: Investigate (profile and understand)
> 10%: Fix Required (revert or optimize)
```

### Rule 3: Budget Utilization

```
0–80%: Green (comfortable headroom)
80–100%: Yellow (approaching limit, monitor)
> 100%: Red (budget exceeded, fix required)
```

### Rule 4: Budget Review Schedule

```
Monthly: Spot check on apps approaching 80%
Quarterly: Full review of all budgets and thresholds
Annually: Major framework/algorithm updates → all budgets re-baselined
```

### Rule 5: Budget Increase Workflow

If an app genuinely needs a higher budget:

1. Profile the new algorithm to verify necessity
2. Document the change and rationale
3. Update `compliance/performance-budgets.json`
4. Add entry to `compliance/budget-history.json` with justification
5. Commit with detailed message
6. Note: Increases are rare—optimize instead when possible

---

## Timeline & Effort Breakdown

**Total Duration**: 8 weeks (2 months, 1 sprint per week)  
**Total Effort**: 40–60 hours solo  
**Breakdown by Sprint**:

| Sprint    | Focus                 | Hours      | Deliverables                        |
| --------- | --------------------- | ---------- | ----------------------------------- |
| 1         | Baseline & Detection  | 10–14h     | Baseline file, detection script     |
| 2         | Alerting & Dashboard  | 10–14h     | Alert banner, regression viewer     |
| 3         | Performance Budgets   | 11–15h     | Budget config, budget visualization |
| 4         | Optimization Strategy | 9–12h      | Opportunities doc, operations guide |
| **Total** |                       | **40–60h** | Phase 2 complete                    |

**Parallel Work Possible**:

- Sprint 1 and 2 can overlap (start Sprint 2's dashboard work in week 2)
- Sprint 3 can overlap with Sprint 2 (budget file created in week 3, dashboard in week 4)
- Actual timeline: ~6 weeks if overlapped

---

## Success Criteria & Definition of Done

### Baseline Management ✅

- [ ] Baseline file created from current production state
- [ ] Baseline versioned in git with semantic version tag
- [ ] Directory structure for historical baselines established
- [ ] Documentation: "How to create/refresh baselines"

### Regression Detection ✅

- [ ] Detection script created and integrated into build
- [ ] Detects regressions >10% with high confidence
- [ ] Console output clear and actionable
- [ ] JSON logging to regression-alerts.json working
- [ ] Tested with synthetic regressions

### Alerting ✅

- [ ] Console alert functional and informative
- [ ] Dashboard alert banner displays on regression
- [ ] Regression details viewable on dashboard
- [ ] Alert dismissal recorded to log
- [ ] Optional: Email alerts configured (if chosen)

### Performance Budgets ✅

- [ ] Budget configuration file created for all 25 apps
- [ ] Dashboard displays budgets and headroom clearly
- [ ] Budget enforcement integrated into detection script
- [ ] Budget history tracking initialized
- [ ] Trend visualization on dashboard working

### Optimization Strategy ✅

- [ ] Opportunities document completed with prioritization matrix
- [ ] Per-app optimization plans documented
- [ ] Prioritization framework established
- [ ] Decision criteria for "when to optimize" documented

### Documentation ✅

- [ ] Phase 2 Operations Guide complete
- [ ] Troubleshooting Guide complete
- [ ] Optimization Opportunities Guide complete
- [ ] All procedures tested and verified
- [ ] README updated with Phase 2 status

---

## Risk Mitigation

### Risk 1: Regression Detection False Positives

**Risk**: Normal variance flagged as regressions, alert fatigue  
**Mitigation**:

- Set threshold at 10% (conservative, natural variance ~2–3%)
- Collect 5-run averages instead of single measurements
- Document variance in baseline creation

### Risk 2: Baseline Drift

**Risk**: Baseline becomes stale, no longer representative  
**Mitigation**:

- Quarterly review and refresh
- Tag baselines with semantic version
- Document when/why baseline changed

### Risk 3: Over-Optimization

**Risk**: Spend too much effort optimizing healthy apps  
**Mitigation**:

- Optimize only when moving toward RED (>80% of budget)
- Prioritize by cost/benefit ratio
- Stop at reasonable stopping point (~60–70% utilization)

### Risk 4: Phase 2 Scope Creep

**Risk**: Additional features requested mid-sprint  
**Mitigation**:

- Define Phase 2 scope clearly (this document)
- Defer new features to Phase 3
- Document "Phase 3 Roadmap" for future enhancements

---

## Phase 3 Preview (Optional)

**Planned Enhancements** (if time permits or future phases):

1. **Historical Trending**
   - Build graph showing performance over time (last 50 builds)
   - Moving average calculation
   - Anomaly detection

2. **Automated Performance Testing**
   - CI/CD integration: Fail build if >10% regression
   - Parallel regression check on every commit

3. **Performance Budget Enforcement in Code**
   - Jest snapshots capturing performance
   - Pre-commit hook validates against budgets
   - Commit message validation for budget changes

4. **Machine Learning Anomaly Detection** (optional, probably overkill)
   - Detect unexpected patterns in performance data
   - Alert on statistically significant changes

5. **App Store Integration**
   - Track performance on real devices
   - Comparative analysis: lab vs field performance

---

## Configuration Checklist for Phase 2 Setup

**Pre-Launch Setup**:

- [ ] Review and approve baseline performance data
- [ ] Confirm regression thresholds (5%, 10%, etc.) are acceptable
- [ ] Review and approve performance budgets for all 25 apps
- [ ] Set up alert email (or skip if using console/dashboard only)
- [ ] Document your alert preferences and response procedures

**During Phase 2 Execution**:

- [ ] Weekly: Review regression-alerts.json for patterns
- [ ] Bi-weekly: Check for apps approaching 80% budget utilization
- [ ] Monthly: Review optimization opportunities document
- [ ] Monthly: Add new entries to budget-history.json

**Post-Phase 2 Handoff**:

- [ ] All documentation finalized and reviewed
- [ ] Operations guide created and tested
- [ ] Troubleshooting procedures documented
- [ ] Phase 3 roadmap placeholder created

---

## Related Documentation

**Phase 1 (Completed)**:

- `compliance/WASM-PROFILING-GUIDE.md` — Current system overview and operations

**Phase 2 (This Document)**:

- `compliance/PHASE-2-REGRESSION-DETECTION-ROADMAP.md` — Implementation plan

**Phase 3 (Future)**:

- `compliance/PHASE-3-HISTORICAL-TRENDING-ROADMAP.md` — Long-term tracking

**Governance Alignment**:

- `AGENTS.md § 16` — WASM Governance (reference for performance budgets)
- `AGENTS.md § 18` — Scale-Aware AI Orchestration (performance constraints)

---

## Questions for You (Before Starting)

1. **Alert Preferences**:
   - Console output sufficient, or add email alerts?
   - Slack integration desired?

2. **Regression Thresholds**:
   - Is 10% acceptable, or should it be 5% / 15%?
   - Different thresholds per game family?

3. **Budget Limits**:
   - Proposed: Easy 10ms, Medium 30ms, Hard 100ms
   - Any games you expect to need higher limits?

4. **Optimization Priority**:
   - Start optimization immediately if any app AMBER, or only if RED?
   - Willing to spend 20+ hours on sudoku optimization now, or defer?

5. **Timeline**:
   - 8-week sprint acceptable, or want it compressed to 4 weeks?
   - Parallelization okay to speed up?

6. **Documentation Scope**:
   - Phase 2 sufficient, or plan Phase 3 implementation now?

---

## Sign-Off Checklist

- [ ] Roadmap reviewed and approved
- [ ] Sprint 1 work begins (Baseline & Detection)
- [ ] Alert preferences confirmed
- [ ] Budget limits approved
- [ ] Timeline acceptable

---

**Status**:

- 📋 **Ready for Approval** (all sections drafted, awaiting your confirmation)
- 🚀 **Ready to Begin** (after Q&A above, can start Week 1)

---

## Appendix: Glossary

| Term            | Definition                                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| **Baseline**    | Snapshot of WASM performance at a known good state (e.g., v1.0.0 release)                                      |
| **Regression**  | Performance degradation relative to baseline (current > baseline)                                              |
| **Severity**    | Regression magnitude: NO_ISSUE (<5%), INVESTIGATE (5–10%), FIX_REQUIRED (>10%)                                 |
| **Budget**      | Target performance limit per app per difficulty (Easy 10ms, Medium 30ms, Hard 100ms)                           |
| **Headroom**    | Available performance margin before hitting budget limit                                                       |
| **Utilization** | Current performance as % of budget limit                                                                       |
| **Threshold**   | Performance boundary that triggers alerts (e.g., 80% of budget = yellow alert)                                 |
| **Anomaly**     | Unexpected performance behavior outside normal variance                                                        |
| **Phase**       | Release cycle or major feature addition (Phase 1: Profiling, Phase 2: Regression Detection, Phase 3: Trending) |

---

**Document Version**: 1.0  
**Created**: April 1, 2026  
**Last Updated**: April 1, 2026  
**Next Review**: April 8, 2026 (after Q&A confirmation)
