# Android Team Emulator Setup

**Problem**: Google CDN returning corrupted downloads. **Solution**: Manual SDK preparation.

## For the Team Lead (One-Time Setup)

### Option A: Download & Prepare SDK

1. **Download SDK** from official source:
   ```
   https://developer.android.com/studio/command-line/sdkmanager
   ```
   Click: "commandlinetools-linux-latest.zip"

2. **Extract locally**:
   ```bash
   mkdir -p ~/android-tools/android-sdk/cmdline-tools
   unzip commandlinetools-linux-latest.zip
   mv cmdline-tools ~/android-tools/android-sdk/cmdline-tools/latest
   ```

3. **Verify it works**:
   ```bash
   bash scripts/setup-android-wsl.sh --skip-download
   ```

### Option B: Share SDK with Team via Git LFS (or similar)

Once setup works locally, package the SDK for team:

```bash
# After setup completes:
zip -r android-sdk-linux.zip ~/android-tools/android-sdk/

# Share via:
# - Google Drive / OneDrive (team can download)
# - git-lfs in repository
# - Internal artifact server
```

---

## For Team Members

Once team lead provides SDK file:

```bash
# 1. Extract to home directory
mkdir -p ~/android-tools/android-sdk/cmdline-tools
unzip android-sdk-linux.zip

# 2. Run setup with skip-download flag
bash scripts/setup-android-wsl.sh --skip-download

# 3. Start emulator
source .env.android
emulator -avd Pixel_8_API_34 -no-window &
```

---

## One-Line Alternative (If You Have SDK File Ready)

```bash
# .env.android exists, SDK is in place
source .env.android
emulator -avd Pixel_8_API_34 -no-window &
sleep 20
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.scottreinhart.nim/.MainActivity
```

---

## Emulator AVDs Available (Once Setup Complete)

- **Pixel_8_API_34** - Modern (Android 14)
- **Pixel_6a_API_28** - Legacy compatibility (Android 9)

All team members run same AVDs → consistent testing environment.

