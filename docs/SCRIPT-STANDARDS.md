# Script Standards & Conventions

> **Authority**: AGENTS.md § 5 (Cross-platform Shell Governance) and § 29 (Node.js Best Practices)  
> **Scope**: All automation scripts in the game-platform monorepo (*.mjs, *.sh, and other executable files)  
> **Last Updated**: April 29, 2026

---

## § 1. Overview

All developer scripts must follow consistent patterns for:
- **Color-coded output** for visual clarity and accessibility
- **Emoji prefixes** for semantic meaning (per docs/emoji-map.md)
- **Progress tracking** with explicit gate/metric/status labels
- **Error classification** (user error vs recoverable vs fatal)
- **Shell consistency** (Bash/POSIX default, PowerShell opt-in only)

This standardization ensures developers get clear, actionable feedback from all automation tools.

---

## § 2. ANSI Color Palette (Universal Standard)

Every script MUST use this color palette. Do **not** deviate or add custom colors.

```javascript
// JavaScript/Node.js (.mjs files)
const COLORS = {
  CYAN: '\x1b[96m',      // Structural labels, nesting, brackets
  GREEN: '\x1b[92m',     // Success indicators (✅)
  RED: '\x1b[91m',       // Errors/failures (❌)
  YELLOW: '\x1b[93m',    // Warnings (⚠️)
  BLUE: '\x1b[94m',      // Headers, titles
  WHITE: '\x1b[97m',     // Neutral/summary text
  GRAY: '\x1b[90m',      // Subtle/meta information
  MAGENTA: '\x1b[95m',   // Alternative nesting/secondary labels
  RESET: '\x1b[0m',      // Reset formatting
  BOLD: '\x1b[1m',       // Bold text
}
```

```bash
# Bash/Shell (.sh files)
readonly CYAN='\033[96m'
readonly GREEN='\033[92m'
readonly RED='\033[91m'
readonly YELLOW='\033[93m'
readonly BLUE='\033[94m'
readonly WHITE='\033[97m'
readonly GRAY='\033[90m'
readonly MAGENTA='\033[95m'
readonly RESET='\033[0m'
readonly BOLD='\033[1m'
```

**Color Semantics:**
- **CYAN/BLUE/MAGENTA/WHITE** = Structure, labels, progress indicators (neutral)
- **GREEN** = Success, pass, completion, ✅
- **RED** = Errors, failures, blocking issues, ❌
- **YELLOW** = Warnings, non-blocking issues, ⚠️
- **GRAY** = Meta-information, timestamps, counts
- **BOLD** = Emphasis for important errors/warnings

---

## § 3. Emoji Standards (Per docs/emoji-map.md)

Use emoji consistently to indicate semantic meaning:

| Emoji | Meaning | Use Cases |
|-------|---------|-----------|
| 🧪 | Testing/validation phase | `pnpm test`, validation gates, test runs |
| 📚 | Lists/brackets/segments | `[1/10]`, enumerated items, batch markers |
| ✅ | Success/passed | Test pass, build success, validation complete |
| ❌ | Errors/failures | Test fail, build error, validation blocked |
| ⏳ | In-progress/waiting | Spinner, long-running tasks, pending |
| 🔍 | Validation/searching | Audit, scan, search operations |
| 🏗️ | Building/constructing | Build process, scaffold generation |
| 📊 | Reports/metrics | Performance data, statistics, summaries |
| ℹ️ | Information | Metadata, notices, non-critical info |
| 🔧 | Configuration/fixing | Fix operations, config changes |
| 🎯 | Target/goal | Milestone reached, completion |
| ⚠️ | Warning | Non-blocking issues, deprecation notices |

---

## § 4. Output Format Pattern

### 4.1 JavaScript/Node.js Files (.mjs)

**Template: Script initialization with COLORS object**

```javascript
#!/usr/bin/env node

// ... standard imports ...

// ANSI color codes (IMMEDIATELY after imports)
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  BLUE: '\x1b[94m',
  WHITE: '\x1b[97m',
  GRAY: '\x1b[90m',
  MAGENTA: '\x1b[95m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

// ... rest of script logic ...

// Output examples:
console.log(`${COLORS.CYAN}[1/10] 📚 Starting validation${COLORS.RESET}`)
console.log(`${COLORS.GREEN}✅ All tests passed${COLORS.RESET}`)
console.error(`${COLORS.RED}${COLORS.BOLD}❌ Build failed${COLORS.RESET}`)
console.log(`${COLORS.YELLOW}⚠️ Deprecation warning${COLORS.RESET}`)
```

### 4.2 Bash/Shell Scripts (.sh)

**Template: Script initialization with color variables**

```bash
#!/usr/bin/env bash
set -e  # or set +e if error continuation required

# ANSI color codes (early in script, after shebangs/options)
readonly CYAN='\033[96m'
readonly GREEN='\033[92m'
readonly RED='\033[91m'
readonly YELLOW='\033[93m'
readonly BLUE='\033[94m'
readonly WHITE='\033[97m'
readonly GRAY='\033[90m'
readonly MAGENTA='\033[95m'
readonly RESET='\033[0m'
readonly BOLD='\033[1m'

# ... rest of script logic ...

# Output examples:
echo -e "${CYAN}[1/10] 📚 Starting validation${RESET}"
echo -e "${GREEN}✅ All tests passed${RESET}"
echo -e "${RED}${BOLD}❌ Build failed${RESET}" >&2
echo -e "${YELLOW}⚠️ Deprecation warning${RESET}"
```

---

## § 5. Progress Indicator Format

When script performs multiple steps, use this format:

```
[STEP/TOTAL] 📚 Descriptive label
```

**Examples:**
```javascript
console.log(`${COLORS.CYAN}[1/5] 📚 Installing dependencies${COLORS.RESET}`)
console.log(`${COLORS.CYAN}[2/5] 🧪 Running tests${COLORS.RESET}`)
console.log(`${COLORS.CYAN}[3/5] 🔍 Auditing performance${COLORS.RESET}`)
```

---

## § 6. Result Reporting

### Success Case
```javascript
console.log(`${COLORS.GREEN}✅ All validations passed${COLORS.RESET}`)
```

### Error Case
```javascript
console.error(`${COLORS.RED}${COLORS.BOLD}❌ Validation failed${COLORS.RESET}`)
process.exit(1)
```

### Warning Case
```javascript
console.log(`${COLORS.YELLOW}⚠️ 3 warnings (non-blocking)${COLORS.RESET}`)
```

### Summary/Report Case
```javascript
console.log(`${COLORS.BLUE}📊 Summary${COLORS.RESET}`)
console.log(`${COLORS.CYAN}├─ Total: ${count}${COLORS.RESET}`)
console.log(`${COLORS.GREEN}├─ Passed: ${passed}${COLORS.RESET}`)
console.log(`${COLORS.RED}└─ Failed: ${failed}${COLORS.RESET}`)
```

---

## § 7. File Structure Requirements

Every script MUST include:

1. **Shebang** (first line)
   ```
   #!/usr/bin/env node (JavaScript)
   #!/usr/bin/env bash (Bash)
   ```

2. **Description** (comment block, lines 2-10)
   ```javascript
   /**
    * Brief description of what the script does
    * 
    * Usage: node script.mjs [options]
    * 
    * Features:
    * - Feature 1
    * - Feature 2
    */
   ```

3. **Imports** (after description)
   - Standard library imports first
   - Third-party imports next
   - Local imports last

4. **COLORS Object** (immediately after imports)
   - Defined once at module scope
   - All 10 color codes included
   - No modifications after definition

5. **Main Logic** (rest of script)
   - Use COLORS in all console output
   - Follow error handling patterns (§ 8)

6. **Error Handling** (throughout, per § 8)
   - Classify errors explicitly
   - Provide actionable messages
   - Exit with appropriate codes

---

## § 8. Error Handling & Exit Codes

### Error Classification

```javascript
// User error (missing arg, invalid input)
if (!inputValue) {
  console.error(`${COLORS.RED}❌ Input value required${COLORS.RESET}`)
  process.exit(2)  // Misuse of shell builtins/usage error
}

// Recoverable error (retry-able, continues)
try {
  await operation()
} catch (err) {
  console.warn(`${COLORS.YELLOW}⚠️ Operation failed, continuing${COLORS.RESET}`)
  // Continue script execution
}

// Fatal error (stops script)
try {
  await criticalOperation()
} catch (err) {
  console.error(`${COLORS.RED}${COLORS.BOLD}❌ Fatal error: ${err.message}${COLORS.RESET}`)
  process.exit(1)  // General error
}
```

### Exit Codes (Standard POSIX)

| Code | Meaning | When |
|------|---------|------|
| 0 | Success | Script completed successfully |
| 1 | General error | Unexpected failure, fatal condition |
| 2 | Misuse of shell builtins | Invalid arguments, missing required params |
| 126 | Invocation issues | Insufficient permissions, not executable |
| 127 | Command not found | Missing dependency, tool unavailable |

---

## § 9. Shell Routing (Per AGENTS.md § 5)

**Default Shell: Bash/POSIX**

All scripts MUST default to Bash unless explicitly exempted:
- Use `#!/usr/bin/env bash` shebang
- Write POSIX-compatible syntax
- Assume WSL Ubuntu or native Linux environment
- DO NOT assume PowerShell

**PowerShell Exception:**
- Only `electron:build:win` and related Windows-specific packaging scripts
- Must include explicit `# PowerShell` comment
- Must document why PowerShell required

**macOS Exception:**
- Only `electron:build:mac`, iOS Capacitor tasks
- Document Apple hardware requirement

---

## § 10. Documentation Requirements

Every new script MUST include:

1. **File header comment** explaining purpose
2. **Usage line** in comment (e.g., `Usage: bash script.sh [options]`)
3. **Features list** (bullet points of what it does)
4. **Examples** (if non-obvious)

Example:
```javascript
/**
 * Validate Workspace Integrity
 * 
 * Checks all apps for TypeScript, lint, format compliance.
 * Reports summary and blocks CI if any app fails.
 * 
 * Usage: node validate-workspace.mjs [--filter <app>]
 * 
 * Features:
 * - Parallel validation across all apps
 * - Color-coded output by result
 * - Generates validation report
 * - Blocks on critical errors
 * 
 * Examples:
 *   # Validate all apps
 *   node validate-workspace.mjs
 *   
 *   # Validate single app
 *   node validate-workspace.mjs --filter @games/checkers
 */
```

---

## § 11. Testing & Validation

After creating or modifying a script:

1. **Run the script** with various inputs
   ```bash
   node script.mjs
   node script.mjs --help
   node script.mjs --invalid-arg
   ```

2. **Check output colors** are visible and clear
   - Success messages: GREEN with ✅
   - Errors: RED with ❌
   - Progress: CYAN with [X/Y]

3. **Verify exit codes**
   ```bash
   node script.mjs
   echo $?  # Should be 0 on success
   ```

4. **Test error paths**
   - Missing dependencies
   - Invalid arguments
   - File not found scenarios

5. **Check ESLint compliance** (for .mjs files)
   ```bash
   pnpm eslint script.mjs
   ```

---

## § 12. Continuous Synchronization

When introducing new scripts:

1. Add COLORS object immediately after imports
2. Use the standard color palette (§ 2)
3. Wrap ALL console output with color codes
4. Include proper error handling (§ 8)
5. Document in script header (§ 10)
6. Test across Bash/WSL environment
7. Validate with get_errors (for .mjs) or shellcheck (for .sh)

**No exceptions.** Every developer-facing script gets consistent treatment.

---

## § 13. Examples by Script Type

### Example 1: Validation Script (.mjs)

```javascript
#!/usr/bin/env node

/**
 * Validate Game App Configuration
 * 
 * Checks app.config.json structure, required fields, and compliance.
 */

import fs from 'fs'
import path from 'path'

const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  BLUE: '\x1b[94m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

function validate() {
  const configPath = path.join(process.cwd(), 'app.config.json')
  
  console.log(`${COLORS.CYAN}🔍 Validating app configuration${COLORS.RESET}`)
  
  if (!fs.existsSync(configPath)) {
    console.error(`${COLORS.RED}❌ app.config.json not found${COLORS.RESET}`)
    process.exit(1)
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  const required = ['name', 'family', 'summary']
  let valid = true
  
  required.forEach((field) => {
    if (!config[field]) {
      console.error(`${COLORS.RED}❌ Missing field: ${field}${COLORS.RESET}`)
      valid = false
    }
  })
  
  if (valid) {
    console.log(`${COLORS.GREEN}✅ Config valid${COLORS.RESET}`)
    process.exit(0)
  }
  
  process.exit(1)
}

validate()
```

### Example 2: Build Script (.sh)

```bash
#!/usr/bin/env bash
set -e

# Build Wasm Module
# Compiles AssemblyScript to WebAssembly

readonly CYAN='\033[96m'
readonly GREEN='\033[92m'
readonly RED='\033[91m'
readonly RESET='\033[0m'
readonly BOLD='\033[1m'

echo -e "${CYAN}[1/3] 🏗️ Building AssemblyScript${RESET}"
pnpm asc src/index.ts --target release

echo -e "${CYAN}[2/3] 📦 Generating .wasm bindings${RESET}"
pnpm tsc --declaration

echo -e "${CYAN}[3/3] 📊 Verifying output${RESET}"
if [ -f dist/index.wasm ]; then
  echo -e "${GREEN}✅ Build successful${RESET}"
  exit 0
else
  echo -e "${RED}${BOLD}❌ Build failed: wasm not generated${RESET}"
  exit 1
fi
```

---

## § 14. Migration Path (Existing Scripts)

For scripts already in the repository:

1. **Low Priority**: App-specific scripts (can migrate incrementally)
2. **Medium Priority**: Shared utility scripts (migrate in batches)
3. **High Priority**: Root-level validation/build scripts (migrate first)

Incremental migration is acceptable. Every new script or modified script MUST comply with § 1-13.

---

## § 15. Reference & Authority

- **AGENTS.md § 5**: Cross-platform Shell Governance
- **AGENTS.md § 29**: Node.js Best Practices
- **docs/emoji-map.md**: Semantic emoji usage
- **Individual script headers**: Per-script purpose and usage

---

## Change Log

| Date | Changes |
|------|---------|
| 2026-04-29 | Initial standardization: 72 *.mjs files + 148 *.sh files |
| | Defined COLORS palette, emoji standards, output patterns |
| | Documented error handling, exit codes, validation requirements |

