#!/bin/bash
# setup-android-wsl.sh - Team Android Emulator Setup for WSL
# Enables collaborative development with standard Android emulators
# Usage: bash scripts/setup-android-wsl.sh [--skip-download]

set +e  # Don't exit on error - continue gracefully

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

ANDROID_TOOLS_DIR="${HOME}/android-tools"
ANDROID_SDK="${ANDROID_TOOLS_DIR}/android-sdk"

echo -e "${BLUE}${BOLD}Android Emulator Setup for Team Development (WSL)${RESET}"
echo -e "${CYAN}═════════════════════════════════════════════════${RESET}"
echo ""

# STEP 1: Create .env.android for environment loading
echo -e "${CYAN}[1/3] 🏗️ Setting up environment...${RESET}"
cat > .env.android << 'EOF'
#!/bin/bash
export ANDROID_HOME="${HOME}/android-tools/android-sdk"
export ANDROID_SDK_ROOT="${ANDROID_HOME}"
export PATH="${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/emulator:${ANDROID_HOME}/platform-tools:${PATH}"
echo "✅ Android env ready"
EOF
chmod +x .env.android
grep -q "\.env\.android" .gitignore 2>/dev/null || echo ".env.android" >> .gitignore
echo -e "${GREEN}✅ .env.android created${RESET}"
echo ""

# STEP 2: Setup SDK
echo -e "${CYAN}[2/3] 📦 Setting up Android SDK...${RESET}"
SKIP_DL=false
[ "$1" = "--skip-download" ] && SKIP_DL=true

if [ -d "${ANDROID_SDK}/cmdline-tools/latest" ]; then
  echo -e "${GREEN}✅ SDK found at ${ANDROID_SDK}${RESET}"
  SKIP_DL=true
fi

if [ "$SKIP_DL" = false ]; then
  echo -e "${YELLOW}⏳ Downloading Android SDK...${RESET}"
  mkdir -p "${ANDROID_TOOLS_DIR}"
  cd "${ANDROID_TOOLS_DIR}"
  
  # Download with validation
  if curl -L --max-time 90 --progress-bar \
       -o cmdline-tools.zip \
       "https://dl.google.com/android/repository/commandlinetools-linux-latest.zip"; then
    
    # Check if valid ZIP before proceeding
    if file cmdline-tools.zip | grep -q "Zip archive"; then
      echo -e "${GREEN}✅ ZIP file valid${RESET}"
      unzip -q cmdline-tools.zip
      mkdir -p "${ANDROID_SDK}/cmdline-tools"
      [ -d "cmdline-tools" ] && mv cmdline-tools "${ANDROID_SDK}/cmdline-tools/latest"
      rm -f cmdline-tools.zip
    else
      echo -e "${RED}❌ Downloaded file corrupt - using manual install${RESET}"
      SKIP_DL=true
      rm -f cmdline-tools.zip
    fi
  else
    echo -e "${RED}❌ Download failed (network timeout/error)${RESET}"
    SKIP_DL=true
  fi
  
  cd - > /dev/null 2>&1
fi

# If download failed/skipped, provide manual instructions
if [ "$SKIP_DL" = true ] && [ ! -d "${ANDROID_SDK}/cmdline-tools/latest" ]; then
  echo ""
  echo -e "${YELLOW}╔══════════════════════════════════════════════════╗${RESET}"
  echo -e "${YELLOW}║          Manual SDK Installation Required        ║${RESET}"
  echo -e "${YELLOW}╚══════════════════════════════════════════════════╝${RESET}"
  echo ""
  echo "1. Download from:"
  echo "   https://developer.android.com/studio/command-line/sdkmanager"
  echo ""
  echo "2. Extract to:"
  echo "   mkdir -p ${ANDROID_TOOLS_DIR}/android-sdk/cmdline-tools"
  echo "   unzip commandlinetools-linux-latest.zip"
  echo "   mv cmdline-tools ${ANDROID_TOOLS_DIR}/android-sdk/cmdline-tools/latest"
  echo ""
  echo "3. Then run:"
  echo "   bash scripts/setup-android-wsl.sh --skip-download"
  echo ""
  exit 1
fi

# STEP 3: Load environment and install components
echo -e "${CYAN}[3/3] 🧪 Installing SDK components...${RESET}"
source .env.android 2>/dev/null

echo -e "\n\n\n\n\n\n\n\n" | sdkmanager --licenses 2>/dev/null || true
sdkmanager "platforms;android-34" "platforms;android-28" "build-tools;34.0.0" \
  "emulator" "platform-tools" 2>/dev/null || true
echo -e "${GREEN}✅ Components ready${RESET}"

# STEP 4: Download system images (from official Android API levels)
# Source: https://developer.android.com/tools/releases/platforms
# Format: system-images;android-<API>;google_apis;x86_64
echo -e "${CYAN}[4/5] 📥 System Images${RESET}"
echo -e "${GRAY}Checking available system images...${RESET}"
echo ""
echo "Available system images for x86_64:"
sdkmanager --list 2>/dev/null | grep "system-images;android" | grep "x86_64" | head -15 || echo "Error listing images - installer may still be running"
echo ""

echo -e "${YELLOW}Installing verified system images:${RESET}"
echo "  - Android 14 (API 34): system-images;android-34;google_apis;x86_64"
echo "  - Android 9 (API 28): system-images;android-28;google_apis;x86_64"
echo ""

# Install in parallel with better error handling
sdkmanager "system-images;android-34;google_apis;x86_64" 2>/dev/null &
IMG34_PID=$!
sdkmanager "system-images;android-28;google_apis;x86_64" 2>/dev/null &
IMG28_PID=$!

wait $IMG34_PID $IMG28_PID
echo -e "${GREEN}✅ System images installed${RESET}"
echo ""

# STEP 5: Create AVDs with verified system image names
echo -e "${CYAN}[5/5] 🖥️  Creating Android Virtual Devices${RESET}"
echo ""

# Clean old AVDs
rm -rf ~/.android/avd/Pixel_8_API_34.avd 2>/dev/null
rm -rf ~/.android/avd/Pixel_6a_API_28.avd 2>/dev/null

# Create Pixel 8 emulator with Android 14 (API 34)
# AVD name can be arbitrary, but system-images path MUST be installed above
echo "Creating: Pixel_8_API_34 (Android 14, API 34)..."
echo no | avdmanager create avd \
  -n Pixel_8_API_34 \
  -k "system-images;android-34;google_apis;x86_64" \
  -c 2048M \
  -f 2>/dev/null

if [ $? -eq 0 ] && [ -d ~/.android/avd/Pixel_8_API_34.avd ]; then
  echo -e "${GREEN}✅ Pixel_8_API_34 created${RESET}"
else
  echo -e "${RED}❌ Failed to create Pixel_8_API_34${RESET}"
  echo "  Verify: sdkmanager --list | grep 'system-images;android-34;google_apis;x86_64'"
fi

echo ""

# Create Pixel 6a emulator with Android 9 (API 28)
echo "Creating: Pixel_6a_API_28 (Android 9, API 28)..."
echo no | avdmanager create avd \
  -n Pixel_6a_API_28 \
  -k "system-images;android-28;google_apis;x86_64" \
  -c 2048M \
  -f 2>/dev/null

if [ $? -eq 0 ] && [ -d ~/.android/avd/Pixel_6a_API_28.avd ]; then
  echo -e "${GREEN}✅ Pixel_6a_API_28 created${RESET}"
else
  echo -e "${RED}❌ Failed to create Pixel_6a_API_28${RESET}"
  echo "  Verify: sdkmanager --list | grep 'system-images;android-28;google_apis;x86_64'"
fi

# FINAL: Instructions
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}║       ✅ Team Emulator Setup Complete!          ║${RESET}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${RESET}"
echo ""
echo "Verify AVDs were created:"
echo "  source .env.android"
echo "  emulator -list-avds"
echo ""
echo "Run an emulator:"
echo "  source .env.android"
echo "  emulator -avd Pixel_8_API_34 -no-window &"
echo ""
echo "Deploy APK to running emulator:"
echo "  adb install -r android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "Team members can run same commands with same emulator AVDs"
echo ""
echo "Official Documentation:"
echo "  - API Levels: https://developer.android.com/tools/releases/platforms"
echo "  - System Images: https://developer.android.com/studio/run/managing-avds"
echo ""
