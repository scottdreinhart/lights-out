# Script Output Examples & Visual Guide

> **Visual reference** showing standardized output from all script types  
> **Authority**: [SCRIPT-STANDARDS.md](SCRIPT-STANDARDS.md)

---

## Color & Emoji Examples

### Example 1: Multi-Step Validation Script

```bash
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 Script Standards Validation (Quick Gate)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 Root-Level Scripts
  ✅ batch-1-app-to-domain.sh
  ✅ batch-2-ui-to-app.sh
  ✅ batch-3-ui-to-ui.sh
  ❌ legacy-script.sh (missing COLORS)

📚 App Scripts (sample check)
  ✅ apps/angle-war/scripts/check-input-controls.sh
  ✅ apps/block-fall/scripts/check-input-controls.sh
  ✅ apps/vector-assault/scripts/check-input-controls.sh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Script standards validated
(Reference: docs/SCRIPT-STANDARDS.md)
```

**Color Breakdown:**
- `━━━` = CYAN dividers
- `🧪` = Testing emoji
- `📚` = Documentation emoji (headers)
- `✅` = GREEN success indicator
- `❌` = RED error indicator
- `(Reference...)` = GRAY meta info

---

### Example 2: Progress-Based Validation

```bash
🔍 Parallel Validation [1/5] Starting...
  
  [1/5] 🧪 TypeScript compilation
        ✅ Completed in 2.3s
        
  [2/5] 🔍 ESLint validation
        ✅ 0 errors, 2 warnings ⚠️
        
  [3/5] 🏗️  Build artifacts
        ❌ Failed: Missing output.js
        
  [4/5] 📊 Coverage report
        ⏳ Skipped (due to #3)
        
  [5/5] 🎴 Summary
        ❌ 1 error blocking merge
        
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Results: 1 passed, 1 skipped, 1 failed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Color Breakdown:**
- `[1/5]` = CYAN progress counter
- `🧪 🔍 🏗️ 📊 🎴` = Emoji indicators for each phase
- `✅` = GREEN pass
- `❌` = RED fail
- `⚠️` = YELLOW warning
- `⏳` = GRAY waiting

---

### Example 3: Detailed Audit Output

```bash
╔════════════════════════════════════════════════════════════╗
║  🎮 Game Platform Script Audit                             ║
╚════════════════════════════════════════════════════════════╝

📦 Package Inventory

  Shell Scripts (.sh)
    Total: 148 files
    ✅ Standardized: 148 (100%)
    ❌ Non-compliant: 0
    
  Node.js Scripts (.mjs)
    Total: 84 files
    ✅ Standardized: 84 (100%)
    ❌ Non-compliant: 0

📍 Location Breakdown

  Root Scripts (scripts/)
    ✅ 28 shell scripts
    ✅ 84 Node.js scripts
    
  App Scripts (apps/*/scripts/)
    ✅ 112 shell scripts across 51 apps
    
  CI Scripts (ci/.)
    ✅ 8 shell scripts
    
  GitHub Workflows (.github/)
    ✅ 3 shell scripts

✅ All 220 scripts pass SCRIPT-STANDARDS.md requirements
```

**Color Breakdown:**
- `║` `╔` `╚` = CYAN box drawing
- `📦 📍` = Documentation emojis
- `✅` = GREEN indicator
- `❌` = RED indicator (none in this example)
- Numeric values = GRAY text

---

### Example 4: Error/Warning Output

```bash
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Validation Failed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 CRITICAL ERRORS (blocking merge):

  ❌ scripts/old-script.sh
     Missing COLORS block (10 required colors)
     
  ❌ scripts/legacy-build.mjs
     Missing COLORS object

⚠️  NON-BLOCKING WARNINGS:

  ⚠️ scripts/future-feature.sh
     Uses deprecated ${NC} instead of ${RESET}
     Automatic fix: sed -i 's/\${NC}/${RESET}/g'

📋 Quick Fix

  1. Add COLORS block to flagged scripts
  2. Reference: docs/SCRIPT-STANDARDS.md § Shell Scripts
  3. Run: bash scripts/validate-script-standards.sh
  4. Commit changes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Exit: 1 (failures found)
```

**Color Breakdown:**
- `❌` = RED for critical errors
- `⚠️` = YELLOW for warnings
- `━━━` = CYAN dividers
- `📋` = Instruction emoji
- `Exit: 1` = GRAY exit code

---

## Shell Script Template (with Colors)

### Before (Legacy)

```bash
#!/bin/bash
# My validation script

echo "Starting validation..."
for file in *.ts; do
  if check_syntax "$file"; then
    echo "✓ $file"
  else
    echo "✗ $file FAILED"
    exit 1
  fi
done
echo "All done!"
```

### After (Standardized)

```bash
#!/bin/bash
# My validation script

# ANSI color codes (standardized per SCRIPT-STANDARDS.md)
readonly CYAN='\033[96m'
readonly GREEN='\033[92m'
readonly RED='\033[91m'
readonly YELLOW='\033[93m'
readonly BLUE='\033[94m'
readonly WHITE='\033[97m'
readonly GRAY='\033[90m'
readonly RESET='\033[0m'
readonly BOLD='\033[1m'

echo "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo "${BOLD}🧪 Syntax Validation${RESET}"
echo "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

TOTAL=0
PASSED=0
FAILED=0

for file in *.ts; do
  ((TOTAL++))
  if check_syntax "$file"; then
    echo "  ${GREEN}✅${RESET} $file"
    ((PASSED++))
  else
    echo "  ${RED}❌${RESET} $file"
    ((FAILED++))
  fi
done

echo ""
echo "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

if [[ $FAILED -eq 0 ]]; then
  echo "${GREEN}✅ All $TOTAL files passed${RESET}"
  exit 0
else
  echo "${RED}❌ $FAILED/$TOTAL files failed${RESET}"
  exit 1
fi
```

**Improvements:**
- ✅ Structured COLORS block (1st thing after shebang)
- ✅ Dividers and headers for readability
- ✅ Progress tracking (TOTAL, PASSED, FAILED)
- ✅ Emoji indicators (✅, ❌)
- ✅ Color-coded summary
- ✅ Proper exit codes

---

## Node.js Script Template (with Colors)

### Before (Legacy)

```javascript
#!/usr/bin/env node
import fs from 'fs'

console.log('Checking files...')
const files = fs.readdirSync('.')
for (const file of files) {
  if (validate(file)) {
    console.log(`✓ ${file}`)
  } else {
    console.log(`✗ ${file} FAILED`)
    process.exit(1)
  }
}
console.log('Done!')
```

### After (Standardized)

```javascript
#!/usr/bin/env node

import fs from 'fs'

// ANSI color codes (standardized per SCRIPT-STANDARDS.md)
const COLORS = {
  CYAN: '\033[96m',
  GREEN: '\033[92m',
  RED: '\033[91m',
  YELLOW: '\033[93m',
  BLUE: '\033[94m',
  WHITE: '\033[97m',
  GRAY: '\033[90m',
  MAGENTA: '\033[95m',
  RESET: '\033[0m',
  BOLD: '\033[1m',
}

console.log(`${COLORS.CYAN}${'━'.repeat(50)}${COLORS.RESET}`)
console.log(`${COLORS.BOLD}🧪 File Validation${COLORS.RESET}`)
console.log(`${COLORS.CYAN}${'━'.repeat(50)}${COLORS.RESET}`)
console.log('')

let total = 0
let passed = 0
let failed = 0

const files = fs.readdirSync('.')
for (const file of files) {
  total++
  if (validate(file)) {
    console.log(`  ${COLORS.GREEN}✅${COLORS.RESET} ${file}`)
    passed++
  } else {
    console.log(`  ${COLORS.RED}❌${COLORS.RESET} ${file}`)
    failed++
  }
}

console.log('')
console.log(`${COLORS.CYAN}${'━'.repeat(50)}${COLORS.RESET}`)

if (failed === 0) {
  console.log(`${COLORS.GREEN}✅ All ${total} files passed${COLORS.RESET}`)
  process.exit(0)
} else {
  console.log(`${COLORS.RED}❌ ${failed}/${total} files failed${COLORS.RESET}`)
  process.exit(1)
}
```

**Improvements:**
- ✅ COLORS object first (after imports)
- ✅ Structured output with dividers
- ✅ Progress tracking (total, passed, failed)
- ✅ Emoji + color coded results
- ✅ Color-coded summary and exit

---

## Real-World Examples

### Example: Bingo App Validation

```bash
$ pnpm --filter @games/bingo validate

🏗️ Building @games/bingo...
[1/4] 🧪 TypeScript check... ✅ 2.1s
[2/4] 🔍 ESLint... ✅ 1.3s
[3/4] 📦 Build... ✅ 8.7s
[4/4] 📊 Bundle size... ✅ 512KB (within budget)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ bingo validation passed (12.1s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example: Pre-commit Hook Output

```bash
$ git commit -m "fix: update script standards"

🚀 Pre-commit Quality Gate
════════════════════════════════════════════════════════

📋 Auto-fixing staged files...

🔍 Running script standards validation...
  ✅ validate-script-standards.sh
  ✅ check-input-controls.sh
  
🔍 Running quick quality gate...
  ✅ Security checks passed
  ✅ Architecture boundaries validated

✅ Pre-commit check passed!
```

### Example: CI/CD Workflow

```bash
$ gh workflow run script-standards.yml

🧪 Script Standards Validation

📚 Root-Level Scripts
  ✅ 28 shell scripts
  ✅ 84 node scripts
  
📚 App Scripts (sample)
  ✅ 5 apps checked
  
✅ All scripts conform to SCRIPT-STANDARDS.md
```

---

## Troubleshooting Color Output

### Colors Not Showing?

**Check 1: Terminal Support**
```bash
# Test ANSI color support
echo -e "\033[92mGreen Text\033[0m"
# Should show in green
```

**Check 2: Environment Variables**
```bash
# Disable colors if needed
NO_COLOR=1 bash scripts/validate-script-standards.sh

# Or use explicit flag
bash scripts/validate-script-standards.sh --no-color
```

**Check 3: Windows/WSL**
- WSL2: Colors work natively ✅
- Windows PowerShell: Limited ANSI support (use WSL) ⚠️
- Git Bash: Colors work ✅

---

## Resources

- **Standard Spec**: [SCRIPT-STANDARDS.md](SCRIPT-STANDARDS.md)
- **Developer Guide**: [DEVELOPER-TOOLS-GUIDE.md](DEVELOPER-TOOLS-GUIDE.md)
- **Governance**: [AGENTS.md](../AGENTS.md) § 5 & 29
- **Validation**: `bash scripts/validate-script-standards.sh`
- **ANSI Reference**: [Wikipedia: ANSI Escape Code](https://en.wikipedia.org/wiki/ANSI_escape_code)
