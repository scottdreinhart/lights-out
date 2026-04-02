#!/bin/bash
# Cleanup script: Move obsolete documentation to docs/archive/

cd /mnt/c/Users/scott/game-platform

files=(
  "PHASE_1_COMPLETION_REPORT.md"
  "PHASE_1_EXECUTION_CHECKLIST.md"
  "PHASE_1_EXECUTION_START.md"
  "PHASE_1_POC_NIM.md"
  "PHASE_2_COMPLETION_REPORT.md"
  "PHASE_2_SERVICES_CONSOLIDATION.md"
  "PHASE_3-4_BLOCKER_MONITOR.md"
  "PHASE_4-7_IMPLEMENTATION_PLAN.md"
  "PHASE_8_FINAL_STATUS.md"
  "PHASE_8_QUICK_REFERENCE.md"
  "TICTACTOE_MIGRATION_PILOT.md"
  "MINI-SUDOKU-VERIFICATION-CHECKLIST.md"
  "OPTION_A_CARD_DECK_INTEGRATION_PLAN.md"
  "MASTER_EXECUTION_ROADMAP.md"
)

moved=0
failed=0

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    mv "$file" docs/archive/
    ((moved++))
    echo "✓ moved $file"
  else
    ((failed++))
    echo "✗ not found: $file"
  fi
done

echo ""
echo "Summary: $moved moved, $failed not found"
ls -la docs/archive/*.md | wc -l
echo "files now in archive"
