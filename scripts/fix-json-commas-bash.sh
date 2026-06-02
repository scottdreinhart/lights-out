#!/bin/bash

# Fix missing commas in package.json files
# This script adds commas after property values that are followed by the next property on a new line

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

for file in apps/*/package.json; do
  if [ -f "$file" ]; then
    # Use sed to add commas where missing
    # Pattern: "property": "value" followed by newline then next property
    sed -i 's/"\([^"]*\)": "\([^"]*\)"\s*$/"\1": "\2",/g' "$file"
    # Remove trailing comma from last property before closing brace
    sed -i 's/,\s*}/}/g' "$file"
    echo "Fixed: $file"
  fi
done