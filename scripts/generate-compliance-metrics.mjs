#!/usr/bin/env node

/**
 * Compliance Metrics Generator
 * Dynamically scans all game apps under /apps (excluding /apps/ui)
 * and extends compliance/matrix.json with per-game compliance data.
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  BLUE: '\x1b[94m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const appsDir = path.join(rootDir, 'apps')
const complianceDir = path.join(rootDir, 'compliance')
const matrixFile = path.join(complianceDir, 'matrix.json')
const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.opus'])

function listFilesRecursive(dir, opts = {}) {
  const { allowedExtensions = null, skipDirs = new Set() } = opts
  if (!fs.existsSync(dir)) return []

  const files = []
  const stack = [dir]

  while (stack.length > 0) {
    const current = stack.pop()
    const entries = fs.readdirSync(current, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        if (skipDirs.has(entry.name)) continue
        stack.push(fullPath)
        continue
      }

      if (!allowedExtensions) {
        files.push(fullPath)
        continue
      }

      const ext = path.extname(entry.name).toLowerCase()
      if (allowedExtensions.has(ext)) {
        files.push(fullPath)
      }
    }
  }

  return files
}

function countPatternInSource(srcDir, pattern) {
  try {
    const result = execSync(
      `find "${srcDir}" -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs grep -h -E "${pattern}" 2>/dev/null | wc -l`,
      { encoding: 'utf-8', shell: '/bin/bash', stdio: 'pipe' },
    ).trim()
    return parseInt(result) || 0
  } catch (e) {
    return 0
  }
}

function collectGameApps() {
  return fs
    .readdirSync(appsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name !== 'ui')
    .filter((name) => fs.existsSync(path.join(appsDir, name, 'package.json')))
    .sort((a, b) => a.localeCompare(b))
}

function readAppPackageJson(appName) {
  const packageJsonPath = path.join(appsDir, appName, 'package.json')
  if (!fs.existsSync(packageJsonPath)) return null

  try {
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  } catch {
    return null
  }
}

/**
 * Check if app has passing build
 */
function checkBuildStatus(appName) {
  const appDir = path.join(appsDir, appName)
  const distDir = path.join(appDir, 'dist')
  return fs.existsSync(distDir) ? 'green' : 'red'
}

/**
 * Check test status
 */
function checkTestStatus(appName) {
  const appDir = path.join(appsDir, appName)
  try {
    // Try to run tests for this app (isolated)
    execSync(`cd "${appDir}" && pnpm test --run 2>/dev/null`, {
      stdio: 'pipe',
      timeout: 30000,
    })
    return 'green'
  } catch (e) {
    // Tests failed or no tests
    const testsDir = path.join(appDir, 'src')
    const hasTests = execSync(`find "${testsDir}" -name "*.test.ts*" -type f 2>/dev/null | wc -l`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim()
    return hasTests > 0 ? 'amber' : 'red'
  }
}

/**
 * Check input controls support matrix implementation.
 * This reports keyboard (WASD + arrows), touch/gestures, and TV/controller signals.
 */
function checkInputControlsMatrix(appName) {
  const appDir = path.join(appsDir, appName)
  const srcDir = path.join(appDir, 'src')
  const packageJson = readAppPackageJson(appName)
  const packageDeps = {
    ...(packageJson?.dependencies || {}),
    ...(packageJson?.devDependencies || {}),
  }
  const usesSharedKeyboardPackage = Boolean(packageDeps['@games/app-hook-utils'])

  const runCount = (pattern) => {
    try {
      const result = execSync(
        `find "${srcDir}" -name "*.ts" -o -name "*.tsx" | xargs grep -h -E "${pattern}" 2>/dev/null | wc -l`,
        { encoding: 'utf-8', shell: '/bin/bash', stdio: 'pipe' },
      ).trim()
      return parseInt(result) || 0
    } catch (e) {
      return 0
    }
  }

  const checks = {
    hasInputAdapterHook:
      runCount('useKeyboardControls|useInputControls|useActionControls|useDropdownBehavior') > 0,
    hasKeyboardEventHandling: runCount('onKeyDown|onKeyUp|KeyboardEvent|keydown|keyup') > 0,
    hasWASDSupport: runCount('KeyW|KeyA|KeyS|KeyD|\\bWASD\\b') > 0,
    hasArrowKeySupport: runCount('ArrowUp|ArrowDown|ArrowLeft|ArrowRight') > 0,
    hasTouchSupport:
      runCount('onTouchStart|onTouchEnd|onTouchMove|touchstart|touchend|TouchEvent') > 0,
    hasGestureSupport: runCount('useSwipeGesture|useLongPress|swipe|gesture|touchAction') > 0,
    hasDpadSupport:
      runCount('ArrowUp|ArrowDown|ArrowLeft|ArrowRight|keyCode\\s*===\\s*4|\\bBack\\b') > 0,
    hasGameControllerSupport:
      runCount('getGamepads|Gamepad|gamepadconnected|gamepaddisconnected|controller') > 0,
    hasConfirmCancelMappings:
      runCount(
        'Enter|NumpadEnter|Space|Escape|Backspace|keyCode\\s*===\\s*13|keyCode\\s*===\\s*4',
      ) > 0,
    hasTextInputSafetyGuard: false,
  }

  const hasTextInputSurfaceSignals =
    runCount(
      '<input|<textarea|contentEditable|openChat|sendChat|onInput|onChange|role\\s*=\\s*[\'"]textbox[\'"]',
    ) > 0
  const hasTextInputGuardSignals =
    runCount(
      'isTyping|isInputFocused|isFormElement|ignoreInputs|allowInInputs|isContentEditable|FORM_TAGS|target\\.tagName\\s*===\\s*[\'"]INPUT[\'"]|target\\.tagName\\s*===\\s*[\'"]TEXTAREA[\'"]',
    ) > 0
  const textInputSafetyRequired = checks.hasKeyboardEventHandling || hasTextInputSurfaceSignals
  checks.hasTextInputSafetyGuard =
    !textInputSafetyRequired || hasTextInputGuardSignals || usesSharedKeyboardPackage

  const keyboardRequiredChecks = {
    hasInputAdapterHook: checks.hasInputAdapterHook,
    hasKeyboardEventHandling: checks.hasKeyboardEventHandling,
    hasWASDSupport: checks.hasWASDSupport,
    hasArrowKeySupport: checks.hasArrowKeySupport,
    hasConfirmCancelMappings: checks.hasConfirmCancelMappings,
  }
  const touchRequiredChecks = {
    hasTouchSupport: checks.hasTouchSupport,
    hasGestureSupport: checks.hasGestureSupport,
  }
  const dpadControllerRequiredChecks = {
    hasDpadSupport: checks.hasDpadSupport,
    hasGameControllerSupport: checks.hasGameControllerSupport,
  }

  const keyboardPassed = Object.values(keyboardRequiredChecks).filter(Boolean).length
  const keyboardTotal = Object.values(keyboardRequiredChecks).length
  const keyboardRatio = keyboardTotal > 0 ? keyboardPassed / keyboardTotal : 0
  const touchPassed = Object.values(touchRequiredChecks).filter(Boolean).length
  const touchTotal = Object.values(touchRequiredChecks).length
  const touchRatio = touchTotal > 0 ? touchPassed / touchTotal : 0
  const dpadControllerPassed = Object.values(dpadControllerRequiredChecks).filter(Boolean).length
  const dpadControllerTotal = Object.values(dpadControllerRequiredChecks).length
  const dpadControllerRatio =
    dpadControllerTotal > 0 ? dpadControllerPassed / dpadControllerTotal : 0
  const allPassed = Object.values(checks).filter(Boolean).length
  const allTotal = Object.values(checks).length

  return {
    keyboardStatus: keyboardRatio >= 1 ? 'green' : keyboardRatio >= 0.5 ? 'amber' : 'red',
    touchStatus: touchRatio >= 1 ? 'green' : touchRatio >= 0.5 ? 'amber' : 'red',
    dpadControllerStatus:
      dpadControllerRatio >= 1 ? 'green' : dpadControllerRatio >= 0.5 ? 'amber' : 'red',
    status: keyboardRatio >= 1 ? 'green' : keyboardRatio >= 0.5 ? 'amber' : 'red',
    checks,
    score: allTotal > 0 ? Math.round((allPassed / allTotal) * 100) : 0,
  }
}

/**
 * Check accessibility (WCAG) implementation
 */
function checkAccessibility(appName) {
  const appDir = path.join(appsDir, appName)
  const srcDir = path.join(appDir, 'src')

  try {
    // Look for aria attributes and semantic HTML
    const result = execSync(
      `find "${srcDir}" -name "*.tsx" -type f -exec grep -l "aria-\\|role=\\|semantic" {} \\; 2>/dev/null | wc -l`,
      { encoding: 'utf-8', stdio: 'pipe' },
    ).trim()
    return parseInt(result) > 0 ? 'green' : 'amber'
  } catch (e) {
    return 'red'
  }
}

/**
 * Check shared system adoption
 */
function checkSharedSystems(appName) {
  const appDir = path.join(appsDir, appName)
  const srcDir = path.join(appDir, 'src')

  try {
    // Check for usage of shared packages
    const result = execSync(
      `find "${srcDir}" -name "*.tsx" -o -name "*.ts" | xargs grep -h "@games/\\|@packages/" 2>/dev/null | sort -u | wc -l`,
      { encoding: 'utf-8', shell: '/bin/bash', stdio: 'pipe' },
    ).trim()
    const count = parseInt(result)
    if (count > 5) return 'green'
    if (count > 2) return 'amber'
    return 'red'
  } catch (e) {
    return 'amber'
  }
}

/**
 * Check responsive design (5 tiers)
 */
function checkResponsiveDesign(appName) {
  const appDir = path.join(appsDir, appName)
  const srcDir = path.join(appDir, 'src')

  try {
    // Look for responsive patterns
    const result = execSync(
      `find "${srcDir}" -name "*.css" -o -name "*.module.css" | xargs grep -l "@media\\|useResponsiveState" 2>/dev/null | wc -l`,
      { encoding: 'utf-8', shell: '/bin/bash', stdio: 'pipe' },
    ).trim()
    return parseInt(result) > 0 ? 'green' : 'amber'
  } catch (e) {
    return 'amber'
  }
}

/**
 * Check feature completeness
 */
function checkFeatureCompleteness(appName) {
  const appDir = path.join(appsDir, appName)

  // Check for required feature files
  const requiredPatterns = [
    'src/domain', // Game rules
    'src/ui', // UI components
    'src/app', // App logic
  ]

  const hasAllPatterns = requiredPatterns.every((pattern) => {
    return fs.existsSync(path.join(appDir, pattern))
  })

  return hasAllPatterns ? 'green' : 'amber'
}

/**
 * Calculate sound support matrix and local sample usage counts.
 */
function checkSoundSupportMatrix(appName) {
  const appDir = path.join(appsDir, appName)
  const srcDir = path.join(appDir, 'src')
  const sourceFiles = listFilesRecursive(srcDir, {
    allowedExtensions: new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.json']),
    skipDirs: new Set(['node_modules', 'dist', 'release', 'android', 'ios', '.git']),
  })
  const sourceBlob = sourceFiles
    .map((filePath) => {
      try {
        return fs.readFileSync(filePath, 'utf-8')
      } catch (e) {
        return ''
      }
    })
    .join('\n')

  const sampleFiles = listFilesRecursive(appDir, {
    allowedExtensions: AUDIO_EXTENSIONS,
    skipDirs: new Set(['node_modules', 'dist', 'release', 'android', 'ios', '.git', 'coverage']),
  })

  const usedSampleFiles = sampleFiles.filter((filePath) =>
    sourceBlob.includes(path.basename(filePath)),
  )

  const integrationSignals =
    countPatternInSource(
      srcDir,
      'useSound|useSoundEffects|SoundProvider|sound-context|playSound|new Audio\\(|Howl\\(|AudioContext|setVolume|mute|unmute',
    ) > 0

  const hasSoundSupport = integrationSignals || usedSampleFiles.length > 0
  const status = hasSoundSupport ? 'green' : sampleFiles.length > 0 ? 'amber' : 'red'

  return {
    status,
    checks: {
      hasSoundIntegration: integrationSignals,
      hasSampleFiles: sampleFiles.length > 0,
      hasUsedSamples: usedSampleFiles.length > 0,
    },
    totalSamples: sampleFiles.length,
    usedSamples: usedSampleFiles.length,
    unusedSamples: Math.max(0, sampleFiles.length - usedSampleFiles.length),
  }
}

/**
 * Calculate animated notification/banner support matrix.
 */
function checkAnimatedNotificationMatrix(appName) {
  const appDir = path.join(appsDir, appName)
  const srcDir = path.join(appDir, 'src')

  const notificationComponentSignals = countPatternInSource(
    srcDir,
    'NotificationBanner|GlitchNotification|GameEndNotification|StatusBanner|Toast|useIonicToast|useNotificationQueue|banner',
  )
  const animationSignals = countPatternInSource(srcDir, '@keyframes|animation|transition|animate')
  const usageSignals = countPatternInSource(
    srcDir,
    '<NotificationBanner|<GlitchNotification|<GameEndNotification|<StatusBanner|toast\\.show|enqueue\\(',
  )

  const hasAnimatedNotifications = notificationComponentSignals > 0 && usageSignals > 0
  const status = hasAnimatedNotifications
    ? 'green'
    : notificationComponentSignals > 0 || usageSignals > 0
      ? 'amber'
      : 'red'

  return {
    status,
    checks: {
      hasNotificationComponents: notificationComponentSignals > 0,
      hasAnimationSignals: animationSignals > 0,
      hasUsageSignals: usageSignals > 0,
    },
    componentSignalCount: notificationComponentSignals,
    usageSignalCount: usageSignals,
  }
}

/**
 * Check Vite build optimization configuration and lazy-loading usage
 */
function checkBundlingOptimization(appName) {
  const appDir = path.join(appsDir, appName)
  const srcDir = path.join(appDir, 'src')
  const viteJs = path.join(appDir, 'vite.config.js')
  const viteTs = path.join(appDir, 'vite.config.ts')
  const viteConfigPath = fs.existsSync(viteTs) ? viteTs : viteJs

  if (!fs.existsSync(viteConfigPath)) {
    return {
      status: 'red',
      checks: {
        hasViteConfig: false,
        chunkedAssets: false,
        manualChunks: false,
        treeshake: false,
        compressionGzip: false,
        compressionBrotli: false,
        cssLightning: false,
        lazyLoading: false,
      },
    }
  }

  const config = fs.readFileSync(viteConfigPath, 'utf-8')
  let lazyLoading = false

  try {
    const lazyLoadingMatches = execSync(
      `find "${srcDir}" -name "*.ts" -o -name "*.tsx" | xargs grep -h "import\\(" 2>/dev/null | wc -l`,
      { encoding: 'utf-8', shell: '/bin/bash', stdio: 'pipe' },
    ).trim()
    lazyLoading = parseInt(lazyLoadingMatches) > 0
  } catch (e) {
    lazyLoading = false
  }

  const checks = {
    hasViteConfig: true,
    chunkedAssets: /chunkFileNames\s*:/.test(config),
    manualChunks: /manualChunks\s*:\s*\(/.test(config),
    treeshake: /treeshake\s*:\s*true/.test(config),
    compressionGzip: /algorithm:\s*['"]gzip['"]/.test(config),
    compressionBrotli: /algorithm:\s*['"]brotliCompress['"]/.test(config),
    cssLightning: /cssMinify:\s*['"]lightningcss['"]/.test(config),
    lazyLoading,
  }

  const requiredChecks = {
    hasViteConfig: checks.hasViteConfig,
    chunkedAssets: checks.chunkedAssets,
    manualChunks: checks.manualChunks,
    treeshake: checks.treeshake,
    compressionGzip: checks.compressionGzip,
    compressionBrotli: checks.compressionBrotli,
    cssLightning: checks.cssLightning,
  }
  const passed = Object.values(requiredChecks).filter(Boolean).length
  const total = Object.values(requiredChecks).length
  const ratio = total > 0 ? passed / total : 0

  return {
    status: ratio >= 1 ? 'green' : ratio >= 0.75 ? 'amber' : 'red',
    checks,
  }
}

/**
 * Aggregate compliance status
 */
function aggregateStatus(metrics) {
  const counts = { green: 0, amber: 0, red: 0 }
  Object.values(metrics)
    .filter((value) => value === 'green' || value === 'amber' || value === 'red')
    .forEach((status) => {
      if (status === 'green') counts.green++
      else if (status === 'amber') counts.amber++
      else if (status === 'red') counts.red++
    })

  const total = counts.green + counts.amber + counts.red
  const percentage = total > 0 ? Math.round((counts.green / total) * 100) : 0

  if (counts.red > 0) return 'red'
  if (counts.amber > 0) return 'amber'
  return 'green'
}

/**
 * Main execution
 */
function generateCompliance() {
  console.log('📊 Generating compliance metrics for all games...\n')
  const gameApps = collectGameApps()

  // Load existing matrix
  let matrix = {}
  if (fs.existsSync(matrixFile)) {
    const content = fs.readFileSync(matrixFile, 'utf-8')
    const data = JSON.parse(content)
    matrix = data
  }

  // Initialize compliance section if not exists
  if (!matrix.compliance) {
    matrix.compliance = {
      metadata: {
        version: '1.0.0',
        generatedAt: new Date().toISOString(),
        description: 'Quality and compliance metrics for all discovered game apps',
        totalGames: gameApps.length,
      },
      games: {},
    }
  } else {
    // Update generation time
    matrix.compliance.metadata.generatedAt = new Date().toISOString()
  }

  // Generate metrics for each game
  gameApps.forEach((gameName, index) => {
    const appDir = path.join(appsDir, gameName)

    if (!fs.existsSync(appDir)) {
      console.log(`⏭️  ${gameName}: Skipped (directory not found)`)
      return
    }

    console.log(`📈 ${index + 1}/${gameApps.length}: Scanning ${gameName}...`)

    const inputControls = checkInputControlsMatrix(gameName)
    const sound = checkSoundSupportMatrix(gameName)
    const animatedNotifications = checkAnimatedNotificationMatrix(gameName)
    const bundling = checkBundlingOptimization(gameName)
    const metrics = {
      buildStatus: checkBuildStatus(gameName),
      testStatus: checkTestStatus(gameName),
      keyboardNavigation: inputControls.keyboardStatus,
      keyboardSupportMatrix: inputControls.checks,
      keyboardSupportScore: inputControls.score,
      touchGestureSupport: inputControls.touchStatus,
      dpadGameControllerSupport: inputControls.dpadControllerStatus,
      soundSupport: sound.status,
      soundMatrix: sound.checks,
      soundSampleCounts: {
        totalSamples: sound.totalSamples,
        usedSamples: sound.usedSamples,
        unusedSamples: sound.unusedSamples,
      },
      animatedNotificationSupport: animatedNotifications.status,
      animatedNotificationMatrix: animatedNotifications.checks,
      animatedNotificationCounts: {
        componentSignals: animatedNotifications.componentSignalCount,
        usageSignals: animatedNotifications.usageSignalCount,
      },
      accessibility: checkAccessibility(gameName),
      sharedSystems: checkSharedSystems(gameName),
      responsiveDesign: checkResponsiveDesign(gameName),
      featureCompleteness: checkFeatureCompleteness(gameName),
      bundlingOptimization: bundling.status,
      bundlingChecks: bundling.checks,
    }

    metrics.overallStatus = aggregateStatus(metrics)
    const statusFields = Object.entries(metrics).filter(
      ([, value]) => value === 'green' || value === 'amber' || value === 'red',
    )
    const greenStatuses = statusFields.filter(([, value]) => value === 'green').length

    matrix.compliance.games[gameName] = {
      ...metrics,
      completionPercentage:
        statusFields.length > 0 ? Math.round((greenStatuses / statusFields.length) * 100) : 0,
      lastScanned: new Date().toISOString(),
    }
  })

  // Calculate overall compliance
  const statuses = Object.values(matrix.compliance.games).map((g) => g.overallStatus)
  const overallGreen = statuses.filter((s) => s === 'green').length
  const overallAmber = statuses.filter((s) => s === 'amber').length
  const overallRed = statuses.filter((s) => s === 'red').length

  matrix.compliance.metadata.overallStatus = {
    green: overallGreen,
    amber: overallAmber,
    red: overallRed,
    completionPercentage:
      gameApps.length > 0 ? Math.round((overallGreen / gameApps.length) * 100) : 0,
  }

  // Write updated matrix
  fs.writeFileSync(matrixFile, JSON.stringify(matrix, null, 2), 'utf-8')

  console.log(`\n✅ Updated: ${matrixFile}`)
  console.log(`\n📊 Summary:`)
  console.log(
    `   🟢 Green (compliant):  ${matrix.compliance.metadata.overallStatus.green}/${gameApps.length}`,
  )
  console.log(
    `   🟡 Amber (partial):    ${matrix.compliance.metadata.overallStatus.amber}/${gameApps.length}`,
  )
  console.log(
    `   🔴 Red (issues):       ${matrix.compliance.metadata.overallStatus.red}/${gameApps.length}`,
  )
  console.log(
    `   Overall:               ${matrix.compliance.metadata.overallStatus.completionPercentage}% compliant\n`,
  )
}

// Run
generateCompliance()
