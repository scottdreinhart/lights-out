#!/bin/bash

# Remove pnpm.onlyBuiltDependencies from all apps/*/package.json

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

for app in apps/*/; do
  if [ -f "$app/package.json" ]; then
    # Use sed to remove the pnpm block
    sed -i '/"pnpm": {/,/}/d' "$app/package.json"
    # Clean up any trailing commas
    sed -i 's/,$//' "$app/package.json"
    echo "Cleaned $app/package.json"
  fi
done

echo "All app package.json files cleaned of pnpm.onlyBuiltDependencies"