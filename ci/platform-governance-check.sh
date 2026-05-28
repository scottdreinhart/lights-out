#!/usr/bin/env bash

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

set -euo pipefail

# Prefer rg when available, fall back to grep for WSL/minimal environments.
if command -v rg >/dev/null 2>&1; then
  HAS_RG=1
else
  HAS_RG=0
fi

# 1) Enforce pnpm-only command usage in automation/config surfaces.
# Default mode scans governance-critical surfaces only to avoid false positives
# from unrelated legacy workflows. Set PNPM_SCAN_MODE=strict to scan all workflows.
PNPM_SCAN_MODE="${PNPM_SCAN_MODE:-governance}"

if [[ "$PNPM_SCAN_MODE" == "strict" ]]; then
  PNPM_SCAN_PATHS=(
    ".github/workflows"
    ".github/scripts"
    "ci"
    "scripts"
    "package.json"
    "pnpm-workspace.yaml"
    ".npmrc"
  )
else
  PNPM_SCAN_PATHS=(
    ".github/workflows/platform-governance.yml"
    "ci"
    "scripts"
    "package.json"
    "pnpm-workspace.yaml"
    ".npmrc"
  )
fi

for scan_path in "${PNPM_SCAN_PATHS[@]}"; do
  [[ -e "$scan_path" ]] || continue

  if [[ "$HAS_RG" -eq 1 ]]; then
    if rg -n "\\bnpm\\s+|\\bnpx\\s+" "$scan_path" --glob '!ci/platform-governance-check.sh'; then
      echo "ERROR: Detected npm/npx usage in $scan_path. This repository is pnpm-only."
      exit 1
    fi
  else
    if grep -R -n -E "\\bnpm[[:space:]]+|\\bnpx[[:space:]]+" "$scan_path" | grep -v '^ci/platform-governance-check.sh:'; then
      echo "ERROR: Detected npm/npx usage in $scan_path. This repository is pnpm-only."
      exit 1
    fi
  fi
done

# 2) Enforce architecture contract existence.
if [[ ! -f "ARCHITECTURE_CONTRACT.md" ]]; then
  echo "ERROR: ARCHITECTURE_CONTRACT.md is required at repo root."
  exit 1
fi

# 3) Enforce architecture checklist existence.
if [[ ! -f "ARCHITECTURE_REVIEW_CHECKLIST.md" ]]; then
  echo "ERROR: ARCHITECTURE_REVIEW_CHECKLIST.md is required at repo root."
  exit 1
fi

# 4) Enforce policy documents existence.
if [[ ! -f "CLEAN_SOLID_DRY_SOC_POLICY.md" ]]; then
  echo "ERROR: CLEAN_SOLID_DRY_SOC_POLICY.md is required at repo root."
  exit 1
fi

if [[ ! -f "ATOMIC_DESIGN_POLICY.md" ]]; then
  echo "ERROR: ATOMIC_DESIGN_POLICY.md is required at repo root."
  exit 1
fi

# 5) Prevent framework/runtime imports from shared core/application packages.
CORE_PATHS=(
  "packages/core"
  "packages/domain"
  "packages/services"
  "packages/shared-types"
  "packages/shared-hooks"
  "packages/application"
)

EXISTING_CORE_PATHS=()
for core_path in "${CORE_PATHS[@]}"; do
  [[ -d "$core_path" ]] && EXISTING_CORE_PATHS+=("$core_path")
done

if [[ ${#EXISTING_CORE_PATHS[@]} -gt 0 ]]; then
  if [[ "$HAS_RG" -eq 1 ]]; then
    if rg -n "from ['\"](react|react-native|electron|@capacitor/|expo)" "${EXISTING_CORE_PATHS[@]}"; then
      echo "ERROR: Shared core/application packages import UI/runtime frameworks directly."
      exit 1
    fi
  else
    if grep -R -n -E "from ['\"](react|react-native|electron|@capacitor/|expo)" "${EXISTING_CORE_PATHS[@]}"; then
      echo "ERROR: Shared core/application packages import UI/runtime frameworks directly."
      exit 1
    fi
  fi
fi

# 6) Domain-layer contract checks for repos that use app-local CLEAN structure.
if [[ "$HAS_RG" -eq 1 ]]; then
  if rg -n "from ['\"](react|react-native|electron|@capacitor/|expo)" apps/**/src/domain 2>/dev/null; then
    echo "ERROR: apps/*/src/domain imports platform runtimes/frameworks directly."
    exit 1
  fi
else
  app_paths=()
  while IFS= read -r p; do
    app_paths+=("$p")
  done < <(find apps \
    \( -name node_modules -o -name .git -o -name dist -o -name build -o -name coverage -o -name .next -o -name .turbo \) -prune \
    -o -type d -path '*/src/domain' -print \
    2>/dev/null || true)
  if [[ ${#app_paths[@]} -gt 0 ]]; then
    if grep -R -n -E "from ['\"](react|react-native|electron|@capacitor/|expo)" "${app_paths[@]}"; then
      echo "ERROR: apps/*/src/domain imports platform runtimes/frameworks directly."
      exit 1
    fi
  fi
fi

# 7) Optional instruction baseline enforcement for instruction-driven repos.
if [[ "${ENFORCE_INSTRUCTION_BASELINE:-0}" == "1" ]]; then
  if [[ ! -d ".github/instructions" ]]; then
    echo "ERROR: ENFORCE_INSTRUCTION_BASELINE=1 requires .github/instructions/."
    exit 1
  fi

  REQUIRED_INSTRUCTIONS=(
    "01-build.instructions.md"
    "02-frontend.instructions.md"
    "03-electron.instructions.md"
    "04-capacitor.instructions.md"
    "05-wasm.instructions.md"
    "06-responsive.instructions.md"
    "07-ai-orchestration.instructions.md"
    "08-input-controls.instructions.md"
    "09-hook-patterns.instructions.md"
    "09-wcag-accessibility.instructions.md"
    "10-security.instructions.md"
    "11-performance.instructions.md"
    "12-error-handling.instructions.md"
    "13-mobile-gestures.instructions.md"
    "14-performance-optimization.instructions.md"
    "15-app-store-compliance.instructions.md"
    "16-ionic-integration.instructions.md"
    "17-testing.instructions.md"
    "18-capacitor-conditional.instructions.md"
    "19-nodejs-frontend-best-practices.instructions.md"
  )

  for instruction_file in "${REQUIRED_INSTRUCTIONS[@]}"; do
    if [[ ! -f ".github/instructions/$instruction_file" ]]; then
      echo "ERROR: Missing required instruction: .github/instructions/$instruction_file"
      exit 1
    fi
  done

  if ! grep -q "Bash" .github/instructions/01-build.instructions.md; then
    echo "ERROR: 01-build.instructions.md must define Bash as default shell policy."
    exit 1
  fi
  if ! grep -q "Bash" .github/instructions/03-electron.instructions.md; then
    echo "ERROR: 03-electron.instructions.md must define Electron shell routing."
    exit 1
  fi
  if ! grep -q "Bash" .github/instructions/04-capacitor.instructions.md; then
    echo "ERROR: 04-capacitor.instructions.md must define Capacitor shell routing."
    exit 1
  fi

  if grep -n -E "\bnpx\s+cap\b" .github/instructions/04-capacitor.instructions.md | grep -vi -E "never.*npx\s+cap|must\s+not\s+use\s+npx\s+cap"; then
    echo "ERROR: 04-capacitor.instructions.md must not use npx cap; use pnpm exec cap."
    exit 1
  fi

  if ! grep -q "8 Test Types" .github/instructions/17-testing.instructions.md; then
    echo "ERROR: 17-testing.instructions.md must define strict test taxonomy."
    exit 1
  fi
fi

# 8) Run quality gates (prefer validate when available).
if pnpm run | grep -q "^\s*validate\s"; then
  pnpm validate
else
  if pnpm run | grep -q "^\s*lint\s"; then
    pnpm lint
  fi
  if pnpm run | grep -q "^\s*format:check\s"; then
    pnpm format:check
  fi
  if pnpm run | grep -q "^\s*check\s"; then
    pnpm check
  fi
fi

# Optional if scripts exist.
if pnpm run | grep -q "^\s*test\s"; then
  pnpm test
fi
if pnpm run | grep -q "^\s*test:e2e:web\s"; then
  pnpm test:e2e:web
fi
if pnpm run | grep -q "^\s*test:e2e:desktop\s"; then
  pnpm test:e2e:desktop
fi
