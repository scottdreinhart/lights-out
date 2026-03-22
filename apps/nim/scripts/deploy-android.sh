#!/bin/bash

# deploy-android.sh
# Team-friendly Android deployment helper (emulators + real devices)
#
# Usage:
#   bash scripts/deploy-android.sh [device-id] [task]
#
# Device ID can be:
#   - Emulator AVD name: Pixel_7_API_34, Pixel_8_API_35, etc.
#   - Real device serial: emulator-5554, <device-serial>
#   - "auto" or omitted: auto-detect (single device) or prompt (multiple)
#
# Examples:
#   bash scripts/deploy-android.sh                           # Auto-detect device
#   bash scripts/deploy-android.sh auto run                  # Auto-detect, then run
#   bash scripts/deploy-android.sh Pixel_8_API_35 run        # Launch emulator + deploy
#   bash scripts/deploy-android.sh emulator-5554 run         # Deploy to running emulator
#   bash scripts/deploy-android.sh 12AB34CD56EF run          # Deploy to real device (Pixel 8 serial)
#   bash scripts/deploy-android.sh --devices                 # List connected devices
#   bash scripts/deploy-android.sh --emulators               # List available AVDs

set -e

# Load Android environment
if [ ! -f .env.android ]; then
  echo "❌ .env.android not found. Run scripts/setup-android-wsl.sh first"
  exit 1
fi
source .env.android

# Parameters
DEVICE_ID="${1:-auto}"
TASK="${2:-run}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ────────────────────────────────────────────────────────────────────────────
# DEVICE DETECTION & HELPER FUNCTIONS
# ────────────────────────────────────────────────────────────────────────────

# List all connected devices (real devices + running emulators)
list_connected_devices() {
  echo -e "${BLUE}Connected devices (via adb):${NC}"
  local devices=$(adb devices | grep -v '^List' | grep -v '^$')
  
  if [ -z "$devices" ]; then
    echo "  (none)"
    return 1
  fi
  
  while IFS= read -r line; do
    local serial=$(echo "$line" | awk '{print $1}')
    local status=$(echo "$line" | awk '{print $2}')
    
    if [ -n "$serial" ] && [ "$status" != "offline" ]; then
      # Try to detect if emulator or real device
      local device_name=$(adb -s "$serial" shell getprop ro.kernel.qemu 2>/dev/null)
      if [ "$device_name" = "1" ]; then
        local avd_name=$(adb -s "$serial" shell getprop ro.kernel.android.qemud 2>/dev/null)
        echo "  💻 EMULATOR: $serial (running)"
      else
        local model=$(adb -s "$serial" shell getprop ro.product.model 2>/dev/null)
        echo "  📱 REAL DEVICE: $serial ($model) [$status]"
      fi
    fi
  done <<< "$devices"
}

# List all available AVDs (emulator definitions)
list_available_avds() {
  echo -e "${BLUE}Available Android Virtual Devices (AVDs):${NC}"
  if ! command -v emulator &> /dev/null; then
    echo "  ⚠️  emulator command not found. Check ANDROID_HOME/emulator path"
    return 1
  fi
  
  local avds=$(emulator -list-avds 2>/dev/null || echo "")
  if [ -z "$avds" ]; then
    echo "  (none)"
    return 1
  fi
  
  while IFS= read -r avd; do
    echo "  - $avd"
  done <<< "$avds"
}

# Detect device type (emulator or real)
is_emulator() {
  local serial="$1"
  local is_qemu=$(adb -s "$serial" shell getprop ro.kernel.qemu 2>/dev/null)
  [ "$is_qemu" = "1" ]
}

# Smart device selection
select_device() {
  local input="$1"
  
  # Special handling for flag requests
  if [ "$input" = "--devices" ]; then
    list_connected_devices
    exit 0
  fi
  
  if [ "$input" = "--emulators" ]; then
    list_available_avds
    exit 0
  fi
  
  # If input is "auto" or empty, try to auto-detect
  if [ "$input" = "auto" ]; then
    local devices=$(adb devices | grep -v '^List' | grep -v '^$' | grep -v '^$')
    local count=$(echo "$devices" | grep -c 'device$' || true)
    
    if [ "$count" -eq 0 ]; then
      echo -e "${YELLOW}No devices connected. Options:${NC}"
      echo ""
      echo "1. Launch an emulator:"
      echo "   bash scripts/deploy-android.sh <AVD_NAME> launch"
      echo ""
      echo "2. Available AVDs:"
      list_available_avds
      echo ""
      echo "3. Or connect a real device via USB and retry"
      exit 1
    elif [ "$count" -eq 1 ]; then
      # Single device, auto-select
      local device=$(echo "$devices" | grep 'device$' | awk '{print $1}')
      echo "$device"
      return 0
    else
      # Multiple devices, prompt user
      echo -e "${YELLOW}Multiple devices detected. Select one:${NC}"
      list_connected_devices
      echo ""
      read -p "Enter device serial (or 'q' to quit): " device
      if [ "$device" = "q" ]; then
        exit 0
      fi
      echo "$device"
      return 0
    fi
  fi
  
  # Input is a specific device name/serial
  # Check if it's an AVD name (try to launch it)
  if emulator -list-avds 2>/dev/null | grep -q "^${input}$"; then
    echo "Launching AVD: $input"
    emulator -avd "$input" -no-window &
    sleep 8
    echo "emulator-5554"  # Default first emulator port
    return 0
  fi
  
  # Otherwise treat as a serial number
  echo "$input"
}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Android Deployment Helper (Emulators + Real Devices)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

case "${TASK}" in
  launch|start)
    echo -e "${YELLOW}Launching emulator: ${EMULATOR_NAME} (headless)${NC}"
    emulator -avd "${EMULATOR_NAME}" -no-window &
    sleep 5
    echo -e "${GREEN}✓ Emulator launched${NC}"
    echo "Wait for boot (30-60 seconds), then run:"
    echo "  bash scripts/deploy-android.sh ${EMULATOR_NAME} install"
    ;;

  console)
    echo -e "${YELLOW}Launching emulator: ${EMULATOR_NAME} (with console)${NC}"
    emulator -avd "${EMULATOR_NAME}" &
    sleep 5
    echo -e "${GREEN}✓ Emulator launched with UI${NC}"
    ;;

  build)
    echo -e "${YELLOW}Building Android APK...${NC}"
    pnpm build
    pnpm cap sync android
    cd android
    ./gradlew assembleDebug
    cd -
    APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
    if [ -f "${APK_PATH}" ]; then
      echo -e "${GREEN}✓ APK built: ${APK_PATH}${NC}"
    else
      echo -e "❌ APK build failed"
      exit 1
    fi
    ;;

  install)
    echo -e "${YELLOW}Installing APK to emulator: ${EMULATOR_NAME}${NC}"
    APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
    
    if [ ! -f "${APK_PATH}" ]; then
      echo -e "${YELLOW}APK not found, building...${NC}"
      bash "$0" "${EMULATOR_NAME}" build
    fi
    
    echo "Waiting for emulator boot..."
    adb wait-for-device
    sleep 5
    
    echo "Installing APK..."
    adb install -r "${APK_PATH}"
    echo -e "${GREEN}✓ APK installed${NC}"
    ;;

  run|deploy)
    echo -e "${YELLOW}Full deployment: build → install → run${NC}"
    bash "$0" "${EMULATOR_NAME}" build
    bash "$0" "${EMULATOR_NAME}" install
    echo -e "${YELLOW}Launching app...${NC}"
    adb shell am start -n com.scottreinhart.nim/.MainActivity
    echo -e "${GREEN}✓ App launched${NC}"
    ;;

  logcat|logs)
    echo -e "${YELLOW}Streaming logcat (Ctrl+C to exit)${NC}"
    adb logcat | grep -E "(nim|Capacitor|com\.scottreinhart)"
    ;;

  list)
    echo -e "${YELLOW}Installed packages:${NC}"
    adb shell pm list packages | grep scottreinhart
    ;;

  clear)
    echo -e "${YELLOW}Clearing app data...${NC}"
    adb shell am force-stop com.scottreinhart.nim
    adb shell pm clear com.scottreinhart.nim
    echo -e "${GREEN}✓ App data cleared${NC}"
    ;;

  kill)
    echo -e "${YELLOW}Stopping emulator...${NC}"
    adb emu kill
    echo -e "${GREEN}✓ Emulator stopped${NC}"
    ;;

  *)
    echo -e "❌ Unknown task: ${TASK}"
    echo ""
    echo "Available tasks:"
    echo "  launch            Launch emulator (headless)"
    echo "  console           Launch emulator with console"
    echo "  build             Build APK (pnpm build + Gradle)"
    echo "  install           Install APK to running emulator"
    echo "  run               Full flow: build → install → run"
    echo "  logcat            Stream app logs"
    echo "  list              List installed packages"
    echo "  clear             Clear app data"
    echo "  kill              Stop running emulator"
    echo ""
    echo "Examples:"
    echo "  bash scripts/deploy-android.sh Pixel_7_API_34 launch"
    echo "  bash scripts/deploy-android.sh Pixel_7_API_34 run"
    echo "  bash scripts/deploy-android.sh Pixel_7_API_34 logcat"
    exit 1
    ;;
esac

echo ""
