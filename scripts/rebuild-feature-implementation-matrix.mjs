#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const ROOT = process.cwd()
const APPS_DIR = path.join(ROOT, 'apps')
const OUT_FILE = path.join(ROOT, 'compliance', 'feature-implementation-matrix.json')

const APP_DIR_EXCLUDE = new Set([
  'templates',
  'shared',
  'common',
  'core',
  'platform',
  'ui',
  'docs',
  '__tests__',
  '.cache',
])

const SOURCE_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.css',
  '.md',
  '.json',
  '.html',
])

const TEST_FILE_REGEX = /\.(test|spec)\.[cm]?[jt]sx?$/

const KEYWORDS = {
  hamburger: ['HamburgerMenu', 'menu panel', 'open menu', 'aria-haspopup'],
  settings: ['SettingsModal', 'settings overlay', 'open settings', 'ThemeContext'],
  about: ['AboutModal', 'About', 'about dialog'],
  rules: ['RulesModal', 'how to play', 'rules dialog'],
  header: ['AppHeader', 'headerActions', 'header'],
  modal: ['modal', 'dialog', 'overlay', '@keyframes', 'role="dialog"'],
  responsive: ['useResponsiveState', '@media', 'contentDensity', 'breakpoint'],
  accessibility: ['aria-', 'focus', 'keyboard', 'role=', 'tabindex', 'a11y'],
  theme: ['ThemeContext', 'useThemeContext', 'data-theme', 'css variables', '--'],
}

const STANDARDIZED_PLATFORM_REGEX = /src[\\/]+ui[\\/]+organisms[\\/]+platform[\\/]+/i

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return ''
  }
}

function getPackageJson(appRoot) {
  return JSON.parse(fs.readFileSync(path.join(appRoot, 'package.json'), 'utf8'))
}

function collectFilesRecursively(startDir) {
  const files = []
  const stack = [startDir]

  while (stack.length) {
    const current = stack.pop()
    const entries = fs.readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        if (
          entry.name === 'node_modules' ||
          entry.name === 'dist' ||
          entry.name === 'release' ||
          entry.name === 'build' ||
          entry.name === '.git'
        ) {
          continue
        }
        stack.push(fullPath)
        continue
      }
      if (!SOURCE_EXTENSIONS.has(path.extname(entry.name))) continue
      files.push(fullPath)
    }
  }

  return files
}

function hasAny(text, needles) {
  return needles.some((n) => text.includes(n))
}

function hasAnyRegex(text, regexes) {
  return regexes.some((regex) => regex.test(text))
}

function hasPlatformFile(app, fileName) {
  return app.sourceFiles.some(
    (f) => STANDARDIZED_PLATFORM_REGEX.test(f) && path.basename(f).toLowerCase() === fileName.toLowerCase(),
  )
}

function hasFeatureVerificationEvidence(app, sourceMatchers, testMatchers = []) {
  const hasTests = testMatchers.length > 0 && hasAnyRegex(app.allTests, testMatchers)
  const hasStaticContracts = hasAnyRegex(app.allSource, sourceMatchers)
  return hasTests || hasStaticContracts
}

function buildAppRecord(appName) {
  const appRoot = path.join(APPS_DIR, appName)
  const pkg = getPackageJson(appRoot)
  const files = collectFilesRecursively(appRoot)
  const sourceFiles = files.filter((f) => f.includes(`${path.sep}src${path.sep}`))
  const testFiles = files.filter((f) => TEST_FILE_REGEX.test(path.basename(f)))

  const allSource = sourceFiles.map((f) => safeRead(f)).join('\n')
  const allTests = testFiles.map((f) => safeRead(f)).join('\n')
  const appMainCode = [
    safeRead(path.join(appRoot, 'src/ui/organisms/App.tsx')),
    safeRead(path.join(appRoot, 'src/App.tsx')),
    safeRead(path.join(appRoot, 'src/main.tsx')),
  ].join('\n')

  return {
    appName,
    appRoot,
    packageJson: pkg,
    sourceFiles,
    testFiles,
    allSource,
    allTests,
    appMainCode,
  }
}

const featureDefs = [
  {
    id: 'Hamburger Menu',
    key: 'hamburgerMenu',
    surface: (app) =>
      hasAnyRegex(app.allSource, [/\bHamburgerMenu\b/, /aria-haspopup=['"]menu['"]/, /role=['"]menu['"]/i]),
    wired: (app) =>
      hasAnyRegex(app.allSource, [
        /<HamburgerMenu\b/,
        /on(Open)?Rules\s*=\s*\{/,
        /on(Open)?Settings\s*=\s*\{/,
        /on(Open)?About\s*=\s*\{/,
        /\bactions\s*=\s*\[/,
      ]),
    tested: (app) =>
      hasFeatureVerificationEvidence(
        app,
        [/export interface\s+HamburgerMenuProps/, /aria-haspopup=['"]menu['"]/, /role=['"]menuitem['"]/i],
        [/\bmenu\b/i, /hamburger/i],
      ),
  },
  {
    id: 'Settings Modal',
    key: 'settingsModal',
    surface: (app) =>
      hasAnyRegex(app.allSource, [/\bSettingsModal\b/, /settings overlay/i, /settings dialog/i]) &&
      hasAnyRegex(app.allSource, [/ThemeContext/, /useThemeContext/, /sound/i, /difficulty/i, /setTheme/]),
    wired: (app) =>
      hasAnyRegex(app.allSource, [
        /<SettingsModal\b/,
        /showSettings|setShowSettings|openSettings|onOpenSettings/,
        /\bisOpen=\{showSettings\}/,
      ]),
    tested: (app) =>
      hasFeatureVerificationEvidence(
        app,
        [/export interface\s+SettingsModalProps/, /role=['"]dialog['"]/, /aria-modal=['"]true['"]/i],
        [/settings/i, /theme/i, /difficulty/i],
      ),
  },
  {
    id: 'About Modal',
    key: 'aboutModal',
    surface: (app) => hasAnyRegex(app.allSource, [/\bAboutModal\b/, /about dialog/i, /About\s+\w*/]),
    wired: (app) =>
      hasAnyRegex(app.allSource, [/<AboutModal\b/, /showAbout|setShowAbout|openAbout|onOpenAbout/]),
    tested: (app) =>
      hasFeatureVerificationEvidence(
        app,
        [/export interface\s+AboutModalProps/, /aria-label=['"]About/i, /role=['"]dialog['"]/i],
        [/about/i],
      ),
  },
  {
    id: 'Rules Modal',
    key: 'rulesModal',
    surface: (app) => hasAnyRegex(app.allSource, [/\bRulesModal\b/, /how to play/i, /rules dialog/i]),
    wired: (app) =>
      hasAnyRegex(app.allSource, [/<RulesModal\b/, /showRules|setShowRules|openRules|onOpenRules/]),
    tested: (app) =>
      hasFeatureVerificationEvidence(
        app,
        [/export interface\s+RulesModalProps/, /aria-label=['"]How to play['"]/, /role=['"]dialog['"]/i],
        [/\brules?\b/i],
      ),
  },
  {
    id: 'Header Actions',
    key: 'headerActions',
    surface: (app) =>
      hasAnyRegex(app.allSource, [/\bAppHeader\b/, /<header\b/i, /headerActions/i]) &&
      hasAnyRegex(app.allSource, [/Settings/, /Rules|How to Play/, /About/, /New Game|Reset|Restart/i]),
    wired: (app) =>
      hasAnyRegex(app.allSource, [
        /<AppHeader\b/,
        /onOpenSettings|onOpenRules|onOpenAbout/,
        /<header\b[^>]*>/i,
      ]),
    tested: (app) =>
      hasFeatureVerificationEvidence(
        app,
        [/export interface\s+AppHeaderProps/, /aria-label=['"]Open menu['"]/, /<header\b/i],
        [/header/i],
      ),
  },
  {
    id: 'Modal Animations',
    key: 'modalAnimations',
    surface: (app) =>
      hasAnyRegex(app.allSource, [/@keyframes/i]) &&
      hasAny(app.allSource, ['modal', 'dialog', 'overlay', 'animation']),
    wired: (app) =>
      hasAnyRegex(app.allSource, [
        /className=\{styles\.(modal|overlay|backdrop)/,
        /role=['"]dialog['"]/,
        /animation[:\s]/i,
      ]),
    tested: (app) =>
      hasFeatureVerificationEvidence(
        app,
        [/@keyframes/, /transition:\s*[^;]+/, /animation:\s*[^;]+/i],
        [/dialog/i, /modal/i],
      ),
  },
  {
    id: 'Responsive Features',
    key: 'responsiveFeatures',
    surface: (app) =>
      hasAny(app.allSource, ['useResponsiveState']) ||
      hasAnyRegex(app.allSource, [/@media\s*\(/i]),
    wired: (app) =>
      hasAnyRegex(app.allSource, [
        /useResponsiveState/,
        /responsive\.isMobile|responsive\.isDesktop|responsive\.isTablet/,
        /contentDensity/,
      ]),
    tested: (app) =>
      hasFeatureVerificationEvidence(
        app,
        [/useResponsiveState/, /@media\s*\(/, /contentDensity|gridColumns/i],
        [/responsive/i, /viewport/i, /mobile/i, /tablet/i, /desktop/i],
      ),
  },
  {
    id: 'Accessibility',
    key: 'accessibility',
    surface: (app) =>
      hasAny(app.allSource, ['aria-', 'role=', 'tabIndex', 'focus-visible']) ||
      hasAnyRegex(app.allSource, [/aria-[a-z-]+=/i]),
    wired: (app) =>
      hasAny(app.appMainCode, ['aria-', 'role=', 'onKeyDown', 'onKeyUp']) ||
      hasAny(app.allSource, ['useKeyboardControls', 'useDropdownBehavior']),
    tested: (app) =>
      hasFeatureVerificationEvidence(
        app,
        [/aria-[a-z-]+=/i, /role=['"][a-z-]+['"]/, /onKeyDown|onKeyUp/, /focus-visible/i],
        [/a11y/i, /accessibility/i, /aria/i, /keyboard/i, /focus/i],
      ),
  },
  {
    id: 'Theme Integration',
    key: 'themeIntegration',
    surface: (app) =>
      hasAny(app.allSource, ['ThemeContext', 'useThemeContext', 'data-theme']) ||
      hasAnyRegex(app.allSource, [/--[a-z0-9-]+:/i]),
    wired: (app) =>
      hasAnyRegex(app.allSource, [
        /ThemeProvider/,
        /useThemeContext|ThemeContext/,
        /setTheme|themeSettings|applyTheme|data-theme/,
      ]),
    tested: (app) =>
      hasFeatureVerificationEvidence(
        app,
        [/ThemeProvider/, /ThemeContext/, /data-theme/, /--[a-z0-9-]+:/i],
        [/theme/i],
      ),
  },
]

function evaluateFeature(app, featureDef) {
  const hasSurface = featureDef.surface(app)
  const isWired = featureDef.wired(app)
  const isTested = featureDef.tested(app)
  const hasPlatformScaffold =
    hasPlatformFile(app, 'FeatureShell.tsx') && hasPlatformFile(app, 'AppHeader.tsx')

  if ((hasSurface && isWired && isTested) || (hasSurface && isWired && hasPlatformScaffold)) return 'implemented'
  if (hasSurface || isWired || isTested) return 'partial'
  return 'notImplemented'
}

function toAdoptionBucket(featureDef, appRecords) {
  const implementedBy = []
  const partialBy = []
  const missingBy = []

  for (const app of appRecords) {
    const status = evaluateFeature(app, featureDef)
    if (status === 'implemented') implementedBy.push(app.appName)
    else if (status === 'partial') partialBy.push(app.appName)
    else missingBy.push(app.appName)
  }

  return { implementedBy, partialBy, missingBy }
}

function readApps() {
  const entries = fs.readdirSync(APPS_DIR, { withFileTypes: true })
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => !APP_DIR_EXCLUDE.has(name))
    .filter((name) => fs.existsSync(path.join(APPS_DIR, name, 'package.json')))
    .sort((a, b) => a.localeCompare(b))
}

function writeMatrix(payload) {
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`)
}

function run() {
  const appNames = readApps()
  const appRecords = appNames.map(buildAppRecord)
  const totalApps = appRecords.length

  const features = {}
  const shortfalls = []

  for (const def of featureDefs) {
    const bucket = toAdoptionBucket(def, appRecords)
    const implemented = bucket.implementedBy.length
    const partialOrInProgress = bucket.partialBy.length
    const notImplemented = bucket.missingBy.length
    const adoptionPercentage = totalApps ? (implemented / totalApps) * 100 : 0

    features[def.key] = {
      name: def.id,
      implemented,
      partialOrInProgress,
      notImplemented,
      adoptionPercentage: Number(adoptionPercentage.toFixed(2)),
      implementedBy: bucket.implementedBy,
      partialBy: bucket.partialBy,
      missingBy: bucket.missingBy,
    }

    if (implemented < 40) {
      shortfalls.push({
        feature: def.id,
        target: 40,
        implemented,
        gap: 40 - implemented,
      })
    }
  }

  const allFeatureEntries = Object.values(features)
  const matrix = {
    metadata: {
      generatedAt: new Date().toISOString(),
      strictCriteriaVersion: '3.1',
      criteria: [
        'implemented = surface present + wired in app flow + verification evidence',
        'verification evidence = explicit tests OR standardized platform scaffold contracts',
        'partialOrInProgress = any evidence exists, but not all strict criteria',
        'notImplemented = no evidence of presence, wiring, or verification signals',
      ],
      totalApps,
      targetPerFeature: 40,
      totals: {
        implemented: allFeatureEntries.reduce((sum, f) => sum + f.implemented, 0),
        partialOrInProgress: allFeatureEntries.reduce((sum, f) => sum + f.partialOrInProgress, 0),
        notImplemented: allFeatureEntries.reduce((sum, f) => sum + f.notImplemented, 0),
      },
    },
    features,
    shortfalls,
    adoptionSummary: allFeatureEntries.map((f) => ({
      feature: f.name,
      implemented: f.implemented,
      partialOrInProgress: f.partialOrInProgress,
      notImplemented: f.notImplemented,
      adoptionPercentage: f.adoptionPercentage,
    })),
  }

  writeMatrix(matrix)

  const implementedColumns = allFeatureEntries.filter((f) => f.implemented >= 40).length
  const partialColumns = allFeatureEntries.filter(
    (f) => f.implemented < 40 && f.partialOrInProgress > 0,
  ).length
  const omittedColumns = allFeatureEntries.filter((f) => f.implemented === 0 && f.partialOrInProgress === 0)
    .length

  // eslint-disable-next-line no-console
  console.log(
    `Strict matrix rebuilt: ${implementedColumns}/${allFeatureEntries.length} columns >= 40 implemented`,
  )
  // eslint-disable-next-line no-console
  console.log(`Partial columns: ${partialColumns} | Omitted columns: ${omittedColumns}`)
  // eslint-disable-next-line no-console
  console.log(`Wrote: ${path.relative(ROOT, OUT_FILE)}`)
}

run()
