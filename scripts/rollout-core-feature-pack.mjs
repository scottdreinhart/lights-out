#!/usr/bin/env node

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

const dryRun = process.argv.includes('--dry-run')
const verbose = process.argv.includes('--verbose')
const force = process.argv.includes('--force')

const skipDirs = new Set(['ui'])

const files = {
  'platform/HamburgerMenu.tsx': `import { useMemo, useState } from 'react'
import styles from './HamburgerMenu.module.css'

export interface MenuAction {
  label: string
  onSelect: () => void
}

export interface HamburgerMenuProps {
  actions: MenuAction[]
  ariaLabel?: string
}

export function HamburgerMenu({
  actions,
  ariaLabel = 'Open menu',
}: HamburgerMenuProps) {
  const [open, setOpen] = useState(false)
  const validActions = useMemo(() => actions.filter((a) => a.label.trim().length > 0), [actions])

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.button}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={open ? 'Close menu' : ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.line} />
        <span className={styles.line} />
        <span className={styles.line} />
      </button>

      {open ? (
        <div className={styles.panel} role="menu" aria-label="Game menu">
          {validActions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              className={styles.item}
              onClick={() => {
                action.onSelect()
                setOpen(false)
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
`,
  'platform/HamburgerMenu.module.css': `.root {
  position: relative;
}

.button {
  min-width: 44px;
  min-height: 44px;
  border: 1px solid var(--feature-border, #666);
  background: var(--feature-bg, #111);
  color: var(--feature-text, #fff);
  border-radius: 10px;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 8px;
}

.line {
  display: block;
  height: 2px;
  width: 20px;
  background: currentColor;
}

.panel {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 220px;
  padding: 12px;
  border-radius: 12px;
  background: var(--feature-panel-bg, #202028);
  border: 1px solid var(--feature-border, #666);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
  display: grid;
  gap: 8px;
  z-index: 9999;
  animation: panelEnter 180ms ease-out;
}

.item {
  min-height: 44px;
  border: 1px solid var(--feature-border, #666);
  border-radius: 10px;
  background: transparent;
  color: var(--feature-text, #fff);
  text-align: left;
  padding: 10px 12px;
}

@keyframes panelEnter {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`,
  'platform/Modal.module.css': `.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 9998;
  animation: fadeIn 180ms ease-out;
}

.modal {
  width: min(700px, 92vw);
  max-height: 90vh;
  overflow: auto;
  border-radius: 14px;
  border: 1px solid var(--feature-border, #666);
  background: var(--feature-panel-bg, #1a1a24);
  color: var(--feature-text, #fff);
  padding: 18px;
  animation: modalEnter 220ms ease-out;
}

.title {
  margin: 0 0 10px;
  font-size: clamp(1.1rem, 2.2vw, 1.4rem);
}

.section {
  margin: 10px 0 14px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.button {
  min-height: 44px;
  border: 1px solid var(--feature-border, #666);
  border-radius: 10px;
  background: transparent;
  color: inherit;
  padding: 8px 12px;
}

@media (max-width: 599px) {
  .modal {
    width: min(96vw, 96vw);
    border-radius: 10px;
  }
}

@media (min-width: 600px) and (max-width: 899px) {
  .modal {
    width: min(90vw, 640px);
  }
}

@media (min-width: 1800px) {
  .modal {
    width: min(70vw, 900px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
`,
  'platform/SettingsModal.tsx': `import styles from './Modal.module.css'

export interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.backdrop}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <h2 className={styles.title}>Settings</h2>

        <div className={styles.section}>
          <p>Theme, audio, and gameplay preferences can be configured here.</p>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.button} onClick={onClose}>
            Close
          </button>
        </div>
      </section>
    </div>
  )
}
`,
  'platform/AboutModal.tsx': `import styles from './Modal.module.css'

export interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
  gameName?: string
}

export function AboutModal({ isOpen, onClose, gameName = 'Game' }: AboutModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.backdrop}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="About this game"
      >
        <h2 className={styles.title}>About {gameName}</h2>

        <div className={styles.section}>
          <p>{gameName} is part of the game-platform family with shared architecture standards.</p>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.button} onClick={onClose}>
            Close
          </button>
        </div>
      </section>
    </div>
  )
}
`,
  'platform/RulesModal.tsx': `import styles from './Modal.module.css'

export interface RulesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.backdrop}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="How to play"
      >
        <h2 className={styles.title}>How to Play</h2>

        <div className={styles.section}>
          <ol>
            <li>Read this game’s specific objective.</li>
            <li>Use keyboard, touch, or gamepad controls.</li>
            <li>Complete the win condition before the opponent or timer.</li>
          </ol>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.button} onClick={onClose}>
            Close
          </button>
        </div>
      </section>
    </div>
  )
}
`,
  'platform/AppHeader.tsx': `import { useMemo } from 'react'
import { HamburgerMenu, type MenuAction } from './HamburgerMenu'
import styles from './FeatureShell.module.css'

export interface AppHeaderProps {
  title: string
  onOpenRules: () => void
  onOpenSettings: () => void
  onOpenAbout: () => void
}

export function AppHeader({
  title,
  onOpenRules,
  onOpenSettings,
  onOpenAbout,
}: AppHeaderProps) {
  const actions = useMemo<MenuAction[]>(
    () => [
      { label: 'How to Play', onSelect: onOpenRules },
      { label: 'Settings', onSelect: onOpenSettings },
      { label: 'About', onSelect: onOpenAbout },
    ],
    [onOpenAbout, onOpenRules, onOpenSettings],
  )

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <HamburgerMenu actions={actions} />
    </header>
  )
}
`,
  'platform/FeatureShell.tsx': `import { useState } from 'react'
import { AboutModal } from './AboutModal'
import { AppHeader } from './AppHeader'
import { RulesModal } from './RulesModal'
import { SettingsModal } from './SettingsModal'
import styles from './FeatureShell.module.css'

export interface FeatureShellProps {
  title: string
  children: React.ReactNode
}

export function FeatureShell({ title, children }: FeatureShellProps) {
  const [showRules, setShowRules] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  return (
    <div className={styles.shell} data-theme="platform-default">
      <AppHeader
        title={title}
        onOpenRules={() => setShowRules(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenAbout={() => setShowAbout(true)}
      />

      <main className={styles.content}>{children}</main>

      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} gameName={title} />
    </div>
  )
}
`,
  'platform/FeatureShell.module.css': `.shell {
  --feature-bg: #121218;
  --feature-panel-bg: #1a1a24;
  --feature-text: #f0f3ff;
  --feature-border: #4b567d;
  color: var(--feature-text);
}

.header {
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px max(12px, env(safe-area-inset-left)) 10px max(12px, env(safe-area-inset-right));
  border-bottom: 1px solid var(--feature-border);
}

.title {
  margin: 0;
  font-size: clamp(1rem, 2.1vw, 1.5rem);
}

.content {
  padding: 12px max(12px, env(safe-area-inset-left)) max(12px, env(safe-area-inset-bottom))
    max(12px, env(safe-area-inset-right));
}

@media (max-width: 599px) {
  .header {
    padding-top: max(12px, env(safe-area-inset-top));
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`,
  'platform/index.ts': `export { AboutModal, type AboutModalProps } from './AboutModal'
export { AppHeader, type AppHeaderProps } from './AppHeader'
export { FeatureShell, type FeatureShellProps } from './FeatureShell'
export { HamburgerMenu, type HamburgerMenuProps, type MenuAction } from './HamburgerMenu'
export { RulesModal, type RulesModalProps } from './RulesModal'
export { SettingsModal, type SettingsModalProps } from './SettingsModal'
`,
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function writeIfMissing(filePath, content) {
  if (!force && fs.existsSync(filePath)) return false
  if (!dryRun) fs.writeFileSync(filePath, content, 'utf8')
  return true
}

function run() {
  const apps = fs
    .readdirSync(appsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !skipDirs.has(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))

  let createdFiles = 0
  let upgradedApps = 0
  const skippedApps = []

  for (const app of apps) {
    const appRoot = path.join(appsDir, app)
    const organismsDir = path.join(appRoot, 'src', 'ui', 'organisms')
    const platformDir = path.join(organismsDir, 'platform')

    if (!fs.existsSync(path.join(appRoot, 'src'))) {
      skippedApps.push(app)
      continue
    }

    ensureDir(platformDir)
    let appCreated = 0

    for (const [relativeName, content] of Object.entries(files)) {
      const filePath = path.join(organismsDir, relativeName)
      const created = writeIfMissing(filePath, content)
      if (created) {
        appCreated++
        createdFiles++
        if (verbose) console.log(`+ ${app}: ${path.relative(appRoot, filePath)}`)
      }
    }

    if (appCreated > 0) upgradedApps++
  }

  console.log(
    `${dryRun ? 'DRY RUN' : 'DONE'}: upgraded ${upgradedApps}/${apps.length} apps, created ${createdFiles} files.`,
  )
  if (skippedApps.length > 0) {
    console.log(`Skipped apps (no src folder): ${skippedApps.join(', ')}`)
  }
}

run()
