#!/bin/bash
# deploy-real-device.sh - Simple Pixel 8 deployment
# Usage: bash scripts/deploy-real-device.sh

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

APK="/mnt/c/Users/scott/nim/android/app/build/outputs/apk/debug/app-debug.apk"
PACKAGE="com.scottreinhart.nim"
ACTIVITY="${PACKAGE}/.MainActivity"

echo "Nim - Real Device Deployment"
echo "════════════════════════════"
echo ""

# Check device
DEVICES=$(adb devices | tail -n +2 | awk '{print $1}' | grep -v '^$')

if [ -z "$DEVICES" ]; then
  echo "❌ No devices connected!"
  echo ""
  echo "TO FIX:"
  echo "  1. Connect Pixel 8 via USB to Windows machine"
  echo "  2. Enable: Settings → Developer options → USB debugging → ON"
  echo "  3. Approve RSA fingerprint when VS Code prompts"
  echo "  4. Run: adb devices (should list your device)"
  echo ""
  exit 1
fi

echo "✓ Found device(s):"
adb devices | tail -n +2 | grep -v '^$'
echo ""

# Deploy
echo "Installing APK to device..."
if adb install -r "$APK"; then
  echo ""
  echo "✅ APK installed!"
  echo ""
  echo "Launching app..."
  adb shell am start -n "$ACTIVITY"
  echo ""
  echo "🎮 App should now be running on your Pixel 8!"
else
  echo "❌ Installation failed"
  exit 1
fi
