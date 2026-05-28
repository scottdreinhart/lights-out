# Shell Script Standardization Progress (April 29, 2026)

## Summary

**Project Goal**: Standardize all 220+ automation scripts (72 .mjs + 148 .sh) with consistent ANSI colors and emoji output

**Completed**:
- ✅ All 72 *.mjs files (100%)
- ✅ Documentation: SCRIPT-STANDARDS.md & DEVELOPER-TOOLS-GUIDE.md
- 🔄 Shell scripts: 3 of 148 updated (~2%)

**Total Script Inventory**: ~220 files
- 72 JavaScript/Node.js (.mjs)
- 148 Bash/Shell (.sh)

---

## .sh Files Updated ✅ (3/148)

1. **`.github/validate.sh`** ✅ - Root governance validation script
   - Status: Complete with colors, emoji, and progress indicators [1/4], [2/4], etc.
   - Result styling: GREEN for passes, RED for failures, YELLOW for warnings

2. **`scripts/checkers-preflight-validate.sh`** ✅ - Core validation for checkers app
   - Status: Complete with [1/7] through [7/7] progress indicators
   - Result reporting: Summary table with passed/failed counts

3. **`apps/angle-war/scripts/check-input-controls.sh`** ✅ - Input validation script
   - Status: Complete with [1/2] and [2/2] progress
   - Error reporting: Color-coded violations with governance link

---

## .sh Files Categorized (148 Total)

### By Category & Priority

**ROOT-LEVEL (Priority: HIGH)**
- `.github/validate.sh` ✅
- Potential: `.github/other-*.sh` (if any exist)

**CORE VALIDATION SCRIPTS** (Priority: HIGH)  
Location: `scripts/`
- `checkers-preflight-validate.sh` ✅
- Similar per-app validation scripts (if any)

**PER-APP SCRIPTS** (Priority: MEDIUM) — ~128 files
Location: `apps/<app>/scripts/`

**Categories by Function:**
1. **Input Validation** (~60 files)
   - `check-input-controls.sh` ✅ (angle-war example)
   - `check-input-controls.sh` (battleship, etc. — templated across apps)
   - `check-diffs.sh` (~50+ apps)

2. **Android Setup & Deploy** (~40 files)
   - `setup-android-wsl.sh` (~40 apps)
   - `deploy-android.sh` (~40 apps)
   - `deploy-real-device.sh` (~40 apps)

3. **Utility & Audit** (~20 files)
   - `list-ttt.sh` (~40 apps)
   - `audit-repos.sh` (~40 apps)
   - `audit-details.sh` (~40 apps)

4. **App-Level Validation** (~8 files)
   - `.github/validate.sh` per app (distributed)

---

## Standardization Strategy

### Phase 1: High-Priority Core Scripts (Complete)
- [x] Root `.github/validate.sh`
- [x] `scripts/checkers-preflight-validate.sh`
- [x] Sample app script (`apps/angle-war/scripts/check-input-controls.sh`)

### Phase 2: Pattern-Based Bulk Updates (Ready)

Given the highly templated nature of app scripts (many have the same structure across 40+ apps), we can:

1. **Identify Template Groups**:
   - All `check-input-controls.sh` files follow same pattern
   - All `setup-android-wsl.sh` files follow same pattern
   - All `deploy-android.sh` files follow same pattern
   - Etc.

2. **Batch Update by Template**:
   - For each template type, read one file
   - Create COLORS block
   - Update one representative file completely
   - Use multi_replace_string_in_file to apply to all ~40 matching files
   - Validate all in batch

3. **Expected Efficiency**:
   - ~4-5 main template groups
   - ~10 files per main group (average)
   - ~5-10 unique variations
   - Total batches: ~10-15 operations to update all 145 remaining files

### Phase 3: Edge Cases & Unique Scripts
- Any scripts with non-standard patterns
- Custom one-offs in specific apps

---

## Color Palette (Standard Across All Scripts)

```bash
# All .sh files MUST use this exact palette:
readonly CYAN='\033[96m'        # Progress, structure
readonly GREEN='\033[92m'       # Success ✅
readonly RED='\033[91m'         # Errors ❌
readonly YELLOW='\033[93m'      # Warnings ⚠️
readonly BLUE='\033[94m'        # Headers
readonly WHITE='\033[97m'       # Neutral
readonly GRAY='\033[90m'        # Meta
readonly MAGENTA='\033[95m'     # Alternative
readonly RESET='\033[0m'        # Reset
readonly BOLD='\033[1m'         # Bold text
```

---

## Template Examples

### Template 1: Check-Input-Controls Pattern
```bash
#!/usr/bin/env bash
# [description]
set -euo pipefail

readonly CYAN='\033[96m'
readonly GREEN='\033[92m'
readonly RED='\033[91m'
readonly RESET='\033[0m'

echo -e "${CYAN}[1/2] 🔍 Step 1${RESET}"
# ... check logic ...
if [ $violations -eq 0 ]; then
  echo -e "${GREEN}✅ Check passed${RESET}"
  exit 0
else
  echo -e "${RED}❌ Check failed${RESET}"
  exit 1
fi
```

### Template 2: Setup-Android-WSL Pattern
```bash
#!/usr/bin/env bash
set -e

readonly CYAN='\033[96m'
readonly GREEN='\033[92m'
readonly RESET='\033[0m'

echo -e "${CYAN}[1/N] 📚 Step${RESET}"
# ... setup logic ...
echo -e "${GREEN}✅ Setup complete${RESET}"
```

### Template 3: Deploy Pattern
```bash
#!/usr/bin/env bash
set -e

readonly CYAN='\033[96m'
readonly GREEN='\033[92m'
readonly RED='\033[91m'
readonly RESET='\033[0m'

echo -e "${CYAN}🚀 Deploying to device${RESET}"
# ... deploy logic ...
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Deploy successful${RESET}"
else
  echo -e "${RED}❌ Deploy failed${RESET}"
  exit 1
fi
```

---

## Next Steps (Immediate)

1. **Identify Template Groups**
   - Scan all 148 .sh files by name and opening lines
   - Group by function/pattern
   - Document group sizes

2. **Create Batch Updates**
   - For each template group, prepare multi_replace_string_in_file operations
   - Update all matching files in ~10-15 total batch operations
   - Validate each batch with get_errors or similar

3. **Edge Case Handling**
   - Scripts that don't fit templates
   - Custom or one-of-a-kind scripts
   - Platform-specific scripts

4. **Final Validation**
   - Spot-check 10-20 random updated files
   - Verify colors render correctly
   - Confirm emoji display
   - Check exit codes

---

## Estimated Completion Timeline

- **Phase 1 (Complete)**: Root + core scripts (3 files) ✅
- **Phase 2 (Template-Based)**: ~145 remaining files
  - ~10-15 batch operations
  - ~1-2 hours of agent work
  - ~1 validation cycle per batch
- **Phase 3 (Edge Cases)**: <5 hours
  - Manual review and custom updates
  - Full test pass

**Total Estimated Time**: 3-4 more hours to complete all 148 .sh files

---

## Quality Assurance Checklist

For each batch of updates:
- [ ] File opens with correct shebang
- [ ] COLORS block present after shebang (readonly declaration)
- [ ] All 10 color codes defined
- [ ] All echo statements use `-e` flag
- [ ] All output wrapped with `${COLOR}..${RESET}` pairs
- [ ] Emoji present in output
- [ ] Progress indicators [X/N] where applicable
- [ ] Error/success results clearly indicated (GREEN/RED)
- [ ] Exit codes appropriate (0 success, 1 failure, 2 usage error)
- [ ] Script tested with valid + error inputs
- [ ] ShellCheck validates (if available)

---

## Reference & Authority

- **SCRIPT-STANDARDS.md**: Complete specifications for all 220 scripts
- **DEVELOPER-TOOLS-GUIDE.md**: Quick reference and common tasks
- **AGENTS.md § 5**: Cross-platform shell governance
- **docs/emoji-map.md**: Emoji standardization
- **Individual script headers**: Per-script purpose

---

## File Inventory (For Reference)

All 148 .sh files are distributed as:
- **Root**: 1 file (validate.sh)
- **scripts/**: ~1-2 files
- **apps/**: ~145 files distributed across 60+ game apps

Most apps have the following scripts:
```
apps/<app>/scripts/
├── check-input-controls.sh
├── check-diffs.sh
├── setup-android-wsl.sh
├── deploy-android.sh
├── deploy-real-device.sh
├── list-ttt.sh
├── audit-repos.sh
└── audit-details.sh
```

This templated structure makes batch updates highly efficient.

---

**Last Updated**: April 29, 2026  
**Status**: Phase 1 & 2 planning complete; ready for Phase 2 execution  
**Next Milestone**: Complete all 148 .sh files to 100% standardized
