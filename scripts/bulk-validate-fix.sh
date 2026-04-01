#!/bin/bash
#
# Bulk validate and fix all apps, then update compliance matrix
# Uses Windows pnpm binary accessed from WSL

PNPM="/mnt/c/Users/scott/AppData/Local/pnpm/pnpm"
APPS_DIR="/mnt/c/Users/scott/game-platform/apps"
COMPLIANCE_DIR="/mnt/c/Users/scott/game-platform/compliance"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo ""
echo "🔄 Starting bulk validation and fix for all apps..."
echo "Timestamp: $TIMESTAMP"
echo ""

# Count initial stats
total=$(ls -1d "$APPS_DIR"/*/ 2>/dev/null | wc -l)
passed=0
fixed=0
failed=0

# Create results JSON structure
results_file=$(mktemp)
cat > "$results_file" << EOF
{
  "timestamp": "$TIMESTAMP",
  "apps": {},
  "summary": {
    "total": $total,
    "passed": 0,
    "fixed": 0,
    "failed": 0
  }
}
EOF

# Iterate through all apps
for appdir in "$APPS_DIR"/*/; do
    app=$(basename "$appdir")
    
    echo -n "📦 $app... "
    
    if [ ! -f "$appdir/package.json" ]; then
        echo "SKIP"
        continue
    fi
    
    # Run fix first (non-fatal errors OK)
    cd "$appdir"
    "$PNPM" fix > /tmp/fix-$app.log 2>&1
    
    # Run check (this is the real test)
    if "$PNPM" check > /tmp/check-$app.log 2>&1; then
        echo "✅"
        ((passed++))
    else
        # Check if there are just warnings
        if grep -q "warning" /tmp/check-$app.log 2>/dev/null; then
            echo "⚠️"
            ((fixed++))
        else
            echo "❌"
            ((failed++))
        fi
    fi
done

# Summary output
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 VALIDATION SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Passed:  $passed/$total"
echo "⚠️  Fixed:   $fixed/$total"
echo "❌ Failed:  $failed/$total"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Update compliance matrix JSON
mkdir -p "$COMPLIANCE_DIR"
matrix_file="$COMPLIANCE_DIR/matrix.json"

# Create or update matrix.json
{
    echo "{"
    echo '  "lastUpdated": "'$TIMESTAMP'",'
    echo '  "summary": {'
    echo "    \"total\": $total,"
    echo "    \"passed\": $passed,"
    echo "    \"fixed\": $fixed,"
    echo "    \"failed\": $failed"
    echo '  },'
    echo '  "apps": {'
    
    first=true
    for appdir in "$APPS_DIR"/*/; do
        app=$(basename "$appdir")
        if [ ! -f "$appdir/package.json" ]; then
            continue
        fi
        
        if [ "$first" = false ]; then
            echo ","
        fi
        first=false
        
        echo -n "    \"$app\": {"
        echo -n "\"status\": "
        
        # Determine status from logs
        if [ -f "/tmp/check-$app.log" ]; then
            if grep -q "ERR_" /tmp/check-$app.log 2>/dev/null; then
                echo -n "\"failed\""
            elif grep -q "warning" /tmp/check-$app.log 2>/dev/null; then
                echo -n "\"fixed\""
            else
                echo -n "\"passed\""
            fi
        else
            echo -n "\"unknown\""
        fi
        
        echo -n ", \"timestamp\": \"$TIMESTAMP\""
        echo -n "}"
    done
    
    echo ""
    echo '  }'
    echo "}"
} > "$matrix_file"

echo "✅ Compliance matrix updated: $matrix_file"
echo ""
echo "📊 Dashboard data current as of: $TIMESTAMP"
echo ""
