#!/usr/bin/env bash
# Workspace Validation Matrix: Test critical gates across all game apps
# Purpose: Quick audit of test:names, lint, typecheck across 40+ apps
# Outputs: CSV report + terminal summary

set -e

WORKSPACE_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$WORKSPACE_ROOT"

REPORT_FILE="reports/workspace-validation-matrix-$(date +%Y%m%d-%H%M%S).csv"
mkdir -p reports

# Initialize report header
echo "app,test_names,lint,typecheck,test,build,validate,status" > "$REPORT_FILE"

# Get list of all game apps
APPS=($(find apps -maxdepth 1 -mindepth 1 -type d | sort | xargs -I {} basename {}))
TOTAL_APPS=${#APPS[@]}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Workspace Validation Matrix"
echo "Total apps: $TOTAL_APPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

PASSED=0
FAILED=0
PARTIAL=0

# Test each app
for APP in "${APPS[@]}"; do
  APP_FILTER="@games/$APP"
  
  # Run gates sequentially, capture exit codes
  test_names_result=0
  lint_result=0
  typecheck_result=0
  test_result=0
  build_result=0
  
  # Test:names (fast)
  if pnpm --filter "$APP_FILTER" test:names > /dev/null 2>&1; then
    test_names_result=1
  fi
  
  # Lint (fast)
  if pnpm --filter "$APP_FILTER" lint > /dev/null 2>&1; then
    lint_result=1
  fi
  
  # Typecheck (moderate)
  if pnpm --filter "$APP_FILTER" typecheck > /dev/null 2>&1; then
    typecheck_result=1
  fi
  
  # Test (moderate)
  if pnpm --filter "$APP_FILTER" test > /dev/null 2>&1; then
    test_result=1
  fi
  
  # Build (moderate)
  if pnpm --filter "$APP_FILTER" build > /dev/null 2>&1; then
    build_result=1
  fi
  
  # Overall status
  GATES_PASSED=$((test_names_result + lint_result + typecheck_result + test_result + build_result))
  if [ $GATES_PASSED -eq 5 ]; then
    STATUS="✅ PASS"
    ((PASSED++))
  elif [ $GATES_PASSED -ge 3 ]; then
    STATUS="⚠️  PARTIAL"
    ((PARTIAL++))
  else
    STATUS="❌ FAIL"
    ((FAILED++))
  fi
  
  # Write to report
  echo "$APP,$test_names_result,$lint_result,$typecheck_result,$test_result,$build_result,TBD,$STATUS" >> "$REPORT_FILE"
  
  # Print progress
  printf "%-30s %s %s %s %s %s  %s\n" \
    "$APP" \
    "$([ $test_names_result -eq 1 ] && echo '✓' || echo '✗')" \
    "$([ $lint_result -eq 1 ] && echo '✓' || echo '✗')" \
    "$([ $typecheck_result -eq 1 ] && echo '✓' || echo '✗')" \
    "$([ $test_result -eq 1 ] && echo '✓' || echo '✗')" \
    "$([ $build_result -eq 1 ] && echo '✓' || echo '✗')" \
    "$STATUS"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Passed:   $PASSED/$TOTAL_APPS"
echo "⚠️  Partial: $PARTIAL/$TOTAL_APPS"
echo "❌ Failed:   $FAILED/$TOTAL_APPS"
echo ""
echo "Report saved to: $REPORT_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
