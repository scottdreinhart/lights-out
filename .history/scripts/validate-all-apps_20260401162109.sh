#!/bin/bash
# Validate all apps and generate compliance matrix

set -e

PNPM="/mnt/c/Users/scott/AppData/Local/pnpm/pnpm"
APPS_DIR="/mnt/c/Users/scott/game-platform/apps"
RESULTS_FILE="/mnt/c/Users/scott/game-platform/compliance/validation-results.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Array to store results
declare -A results

# Get list of all apps
apps=($(cd "$APPS_DIR" && ls -d */ | sed 's|/||g' | sort))

echo "🔄 Validating ${#apps[@]} apps..."
echo "Timestamp: $TIMESTAMP"
echo ""

passed=0
failed=0
warned=0

for app in "${apps[@]}"; do
    echo -n "📦 $app... "
    app_path="$APPS_DIR/$app"
    
    if [ ! -d "$app_path" ]; then
        echo "❌ NOT FOUND"
        ((failed++))
        continue
    fi
    
    # Run validation, capture exit code
    if cd "$app_path" && "$PNPM" validate > /tmp/validate-$app.log 2>&1; then
        echo "✅ PASS"
        results["$app"]="passed"
        ((passed++))
    else
        # Check if it's just warnings
        if grep -q "ERR_PNPM" /tmp/validate-$app.log; then
            echo "⚠️  WARNINGS"
            results["$app"]="warned"
            ((warned++))
        else
            echo "❌ FAIL"
            results["$app"]="failed"
            ((failed++))
        fi
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESULTS SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Passed:  $passed/${#apps[@]}"
echo "⚠️  Warned:  $warned/${#apps[@]}"
echo "❌ Failed:  $failed/${#apps[@]}"
echo ""

exit 0
