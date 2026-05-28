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

const targetApps = [
  'angle-war',
  'arc-spin',
  'beat-grid',
  'block-fall',
  'circuit-maze',
  'dash-lanes',
  'neon-hop',
  'sky-blitz',
  'tower-rise',
  'vector-assault',
]

const knownTemplateSignals = [
  'meta.family',
  'meterFillDanger',
  "dispatch('primary')",
  'Reset Session',
]

const files = {
  'src/ui/atoms/ActionButton.tsx': `interface ActionButtonProps {
  label: string
  onClick: () => void
}

export const ActionButton = ({ label, onClick }: ActionButtonProps) => (
  <button onClick={onClick} type="button">
    {label}
  </button>
)
`,
  'src/ui/atoms/ProgressMeter.tsx': `interface ProgressMeterProps {
  label: string
  value: number
  fillClassName: string
  styles: Record<string, string>
}

const meterStyle = (value: number) => ({ width: \`\${value}%\` })

export const ProgressMeter = ({ label, value, fillClassName, styles }: ProgressMeterProps) => (
  <div className={styles.meterRow}>
    <span>{label}</span>
    <div className={styles.meterTrack}>
      <div className={fillClassName} style={meterStyle(value)} />
    </div>
  </div>
)
`,
  'src/ui/atoms/StatTile.tsx': `interface StatTileProps {
  label: string
  value: number
}

export const StatTile = ({ label, value }: StatTileProps) => (
  <div>
    <dt>{label}</dt>
    <dd>{value}</dd>
  </div>
)
`,
  'src/ui/atoms/index.ts': `export { ActionButton } from './ActionButton'
export { ProgressMeter } from './ProgressMeter'
export { StatTile } from './StatTile'
`,
  'src/ui/molecules/ActionButtons.tsx': `import { ActionButton } from '@/ui/atoms'

interface ActionButtonsProps {
  primaryLabel: string
  secondaryLabel: string
  tertiaryLabel: string
  onAction: (action: 'primary' | 'secondary' | 'tertiary') => void
  styles: Record<string, string>
}

export const ActionButtons = ({
  primaryLabel,
  secondaryLabel,
  tertiaryLabel,
  onAction,
  styles,
}: ActionButtonsProps) => (
  <div className={styles.actions}>
    <ActionButton label={primaryLabel} onClick={() => onAction('primary')} />
    <ActionButton label={secondaryLabel} onClick={() => onAction('secondary')} />
    <ActionButton label={tertiaryLabel} onClick={() => onAction('tertiary')} />
  </div>
)
`,
  'src/ui/molecules/ProgressMeters.tsx': `import { ProgressMeter } from '@/ui/atoms'

interface ProgressMetersProps {
  intensity: number
  focus: number
  progress: number
  styles: Record<string, string>
}

export const ProgressMeters = ({ intensity, focus, progress, styles }: ProgressMetersProps) => (
  <div className={styles.meters}>
    <ProgressMeter
      fillClassName={styles.meterFillDanger}
      label="Intensity"
      styles={styles}
      value={intensity}
    />
    <ProgressMeter
      fillClassName={styles.meterFillFocus}
      label="Focus"
      styles={styles}
      value={focus}
    />
    <ProgressMeter
      fillClassName={styles.meterFillProgress}
      label="Progress"
      styles={styles}
      value={progress}
    />
  </div>
)
`,
  'src/ui/molecules/StatsGrid.tsx': `import { StatTile } from '@/ui/atoms'

interface StatsGridProps {
  score: number
  lives: number
  tick: number
  styles: Record<string, string>
}

export const StatsGrid = ({ score, lives, tick, styles }: StatsGridProps) => (
  <dl className={styles.stats}>
    <StatTile label="Score" value={score} />
    <StatTile label="Lives" value={lives} />
    <StatTile label="Tick" value={tick} />
  </dl>
)
`,
  'src/ui/molecules/index.ts': `export { ActionButtons } from './ActionButtons'
export { ProgressMeters } from './ProgressMeters'
export { StatsGrid } from './StatsGrid'
`,
  'src/ui/organisms/App.tsx': `import { useGame } from '@/app'
import { ActionButtons, ProgressMeters, StatsGrid } from '@/ui/molecules'
import styles from './App.module.css'

export const App = () => {
  const { state, meta, dispatch, reset } = useGame()
  const progressPercent = Math.min(100, Math.max(0, (state.progress / 130) * 100))

  return (
    <main className={styles.root}>
      <section className={styles.card}>
        <header className={styles.header}>
          <p className={styles.kicker}>{meta.family} Prototype</p>
          <h1>{meta.title}</h1>
          <p className={styles.summary}>{meta.summary}</p>
        </header>

        <ProgressMeters
          focus={state.focus}
          intensity={state.intensity}
          progress={progressPercent}
          styles={styles}
        />

        <StatsGrid lives={state.lives} score={state.score} styles={styles} tick={state.tick} />

        <p className={styles.status}>{state.status}</p>

        <ActionButtons
          onAction={dispatch}
          primaryLabel={meta.primaryLabel}
          secondaryLabel={meta.secondaryLabel}
          styles={styles}
          tertiaryLabel={meta.tertiaryLabel}
        />

        <button className={styles.reset} onClick={reset} type="button">
          Reset Session
        </button>
      </section>
    </main>
  )
}
`,
  'src/ui/index.ts': `export * from './atoms'
export * from './molecules'
export * from './organisms'
`,
}

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const writeFile = (filePath, content) => {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, content, 'utf8')
}

let migrated = 0
let skipped = 0
const skippedApps = []

for (const appName of targetApps) {
  const appRoot = path.join(appsDir, appName)
  const appFilePath = path.join(appRoot, 'src', 'ui', 'organisms', 'App.tsx')
  if (!fs.existsSync(appFilePath)) {
    skipped++
    skippedApps.push(`${appName}: missing App.tsx`)
    continue
  }

  const currentAppSource = fs.readFileSync(appFilePath, 'utf8')
  if (!knownTemplateSignals.every((signal) => currentAppSource.includes(signal))) {
    skipped++
    skippedApps.push(`${appName}: App.tsx not on expected template`)
    continue
  }

  for (const [relativePath, content] of Object.entries(files)) {
    writeFile(path.join(appRoot, relativePath), content)
  }
  migrated++
}

console.log(`Atomic refactor migrated ${migrated}/${targetApps.length} apps.`)
if (skipped > 0) {
  console.log(`Skipped ${skipped} apps:`)
  for (const item of skippedApps) {
    console.log(`- ${item}`)
  }
}
