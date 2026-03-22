# Android System Images - Official Reference

## Problem Fixed
**Before**: Script used system image/AVD names without verifying they were actually installed.  
**Error**: `ERROR | Unknown AVD name [Pixel_8_API_34]`  
**Root cause**: System image `system-images;android-34;google_apis;x86_64` wasn't installed when AVD creation was attempted.

**After**: Script now lists available system images FIRST, then creates AVDs only with verified image paths.

---

## Official Android API Levels
Source: https://developer.android.com/tools/releases/platforms

| Android Version | API Level | Status | Recommendation |
|---|---|---|---|
| Android 16 | 36 | Latest | New projects |
| Android 15 | 35 | Stable | ✓ Production |
| **Android 14** | **34** | Stable | **✓ Verified (Used)** |
| Android 13 | 33 | Stable | ✓ Production |
| Android 12 | 31, 32 | Stable | ✓ Production |
| Android 11 | 30 | Stable | ✓ Older devices |
| Android 10 | 29 | Stable | ✓ Older devices |
| **Android 9** | **28** | Stable | **✓ Verified (Used)** |
| Android 8.1 | 27 | Maintenance | Older devices only |

---

## System Image Naming Format
Source: https://developer.android.com/studio/run/managing-avds

### Official Format
```
system-images;android-<API>;google_apis;x86_64
```

### Available Variants per API
- **google_apis** — Includes Google Play services (recommended for development)
- **google_apis_playstore** — Includes Play Store app (CTS compliant)
- **aosp** — Pure Android Open Source (allows root access via adb)

### Used in This Setup
```bash
# Android 14 (API 34) - Recent stable version
system-images;android-34;google_apis;x86_64

# Android 9 (API 28) - Older version for compatibility testing
system-images;android-28;google_apis;x86_64
```

---

## AVD Creation Rules
Source: https://developer.android.com/studio/run/managing-avds

### AVD Name
- **Arbitrary** — Can be any valid filename (letters, numbers, underscores, dashes, spaces, parentheses, periods)
- Examples that work equally:
  - `Pixel_8_API_34`
  - `my-pixel-8`
  - `Pixel 8 API 34`
  - `MyTestDevice`

### System Image Path
- **Must be installed** via sdkmanager first
- Must exactly match format: `system-images;android-<API>;google_apis;x86_64`
- Verify before creating AVD: `sdkmanager --list | grep "system-images;android"`

### Correct Command Flow
```bash
# 1. List what's available
sdkmanager --list

# 2. Install specific images
sdkmanager "system-images;android-34;google_apis;x86_64"
sdkmanager "system-images;android-28;google_apis;x86_64"

# 3. Create AVDs using verified paths
echo no | avdmanager create avd \
  -n Pixel_8_API_34 \
  -k "system-images;android-34;google_apis;x86_64"

echo no | avdmanager create avd \
  -n Pixel_6a_API_28 \
  -k "system-images;android-28;google_apis;x86_64"
```

---

## Debugging If AVD Creation Fails

### Error: "Unknown AVD name [Pixel_8_API_34]"
**Means**: The system image you specified doesn't exist locally

**Solution**:
```bash
# List installed images
sdkmanager --list | grep "system-images"

# Check specific API level
sdkmanager --list | grep "system-images;android-34"

# If missing, install it
sdkmanager "system-images;android-34;google_apis;x86_64"
```

### Error: "Package 'system-images;android-34;google_apis;x86_64' was not found"
**Means**: The exact package path doesn't exist (wrong variant or API level)

**Solution**:
```bash
# Find correct packages for Android 14 (API 34)
sdkmanager --list | grep "api-34"

# Choose one:
sdkmanager "system-images;android-34;google_apis;x86_64"      # With Play services
sdkmanager "system-images;android-34;google_apis_playstore;x86_64"  # With Play Store
sdkmanager "system-images;android-34;aosp;x86_64"              # Pure AOSP
```

---

## Team Setup (What the Script Does)

### Step 4: Lists Available Images
```
Available system images for x86_64:
  system-images;android-34;google_apis;x86_64 [not installed]
  system-images;android-34;google_apis_playstore;x86_64 [not installed]
  system-images;android-28;google_apis;x86_64 [not installed]
  ...
```

### Step 4: Installs Verified Images
Only these two (confirmed available from official Google):
- `system-images;android-34;google_apis;x86_64` ✓
- `system-images;android-28;google_apis;x86_64` ✓

### Step 5: Creates AVDs
Once images are installed, creates AVDs with those paths:
- `Pixel_8_API_34` → system-images;android-34;google_apis;x86_64
- `Pixel_6a_API_28` → system-images;android-28;google_apis;x86_64

### Verification
```bash
source .env.android
emulator -list-avds
# Output:
# Pixel_8_API_34
# Pixel_6a_API_28
```

---

## Official References
- **SDK Platforms**: https://developer.android.com/tools/releases/platforms
- **Managing AVDs**: https://developer.android.com/studio/run/managing-avds
- **Emulator**: https://developer.android.com/studio/run/emulator
- **Command-line tools**: https://developer.android.com/studio/command-line/sdkmanager
