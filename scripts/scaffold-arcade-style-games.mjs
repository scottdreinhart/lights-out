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
const nimDir = path.join(appsDir, 'nim')

const GAME_DEFS = [
  {
    slug: 'circuit-maze',
    title: 'Circuit Maze',
    family: 'Maze Runner',
    summary:
      'Collect all nodes in a hostile grid while pressure rises from roaming sentinels.',
    controls: ['Primary: Move/Collect', 'Secondary: Pulse Scan', 'Tertiary: Burst Dash'],
    mechanics: [
      'Grid navigation with pickup completion objective',
      'Pursuit pressure simulated through rising intensity',
      'Power state represented by temporary focus burst',
    ],
    dynamics: [
      'Route planning under escalating pressure',
      'Risk/reward choices between safe clears and burst dashes',
    ],
    sharedComponents: ['GridMap', 'Pathfinder', 'CollectibleLayer', 'EnemyStateMachine'],
    tuning: {
      primaryLabel: 'Move + Collect',
      secondaryLabel: 'Pulse Scan',
      tertiaryLabel: 'Burst Dash',
      primaryProgress: 3,
      primaryScore: 9,
      secondaryFocus: 8,
      secondaryIntensity: -4,
      tertiaryProgress: 5,
      tertiaryScore: 14,
      tertiaryIntensity: 5,
      passiveIntensity: 2,
      progressTarget: 100,
    },
  },
  {
    slug: 'sky-blitz',
    title: 'Sky Blitz',
    family: 'Side Scroller',
    summary: 'Push forward through scrolling hazard waves and keep flight momentum alive.',
    controls: ['Primary: Boost Forward', 'Secondary: Stabilize', 'Tertiary: Barrel Roll'],
    mechanics: [
      'Forward pressure loop with hazard cadence',
      'Boost and stability management under scrolling tension',
      'Distance-driven progression represented by progress score',
    ],
    dynamics: [
      'Momentum management and recovery windows',
      'High-tempo risk spikes during barrel roll bursts',
    ],
    sharedComponents: ['SideScrollCamera', 'HazardSpawner', 'CheckpointSystem'],
    tuning: {
      primaryLabel: 'Boost Forward',
      secondaryLabel: 'Stabilize',
      tertiaryLabel: 'Barrel Roll',
      primaryProgress: 4,
      primaryScore: 8,
      secondaryFocus: 7,
      secondaryIntensity: -5,
      tertiaryProgress: 6,
      tertiaryScore: 13,
      tertiaryIntensity: 6,
      passiveIntensity: 3,
      progressTarget: 120,
    },
  },
  {
    slug: 'neon-hop',
    title: 'Neon Hop',
    family: 'Platform Physics',
    summary: 'Time jumps and recoveries with precision to keep a kinetic platform run alive.',
    controls: ['Primary: Jump', 'Secondary: Balance', 'Tertiary: Chain Hop'],
    mechanics: [
      'Jump-timing cadence and landing discipline',
      'Airborne risk represented by intensity growth',
      'Chain hops trade safety for speed and score',
    ],
    dynamics: ['Precision rhythm under increasing speed', 'Recovery decisions after risky hops'],
    sharedComponents: ['KinematicBody2D', 'GroundDetector', 'JumpTuningProfile'],
    tuning: {
      primaryLabel: 'Jump',
      secondaryLabel: 'Balance',
      tertiaryLabel: 'Chain Hop',
      primaryProgress: 3,
      primaryScore: 7,
      secondaryFocus: 9,
      secondaryIntensity: -6,
      tertiaryProgress: 7,
      tertiaryScore: 15,
      tertiaryIntensity: 7,
      passiveIntensity: 3,
      progressTarget: 110,
    },
  },
  {
    slug: 'arc-spin',
    title: 'Arc Spin',
    family: 'Paddle / Rotary',
    summary: 'Deflect incoming vectors with precision and build combo pressure on clean returns.',
    controls: ['Primary: Deflect', 'Secondary: Re-center', 'Tertiary: Power Spin'],
    mechanics: [
      'Reflection-focused control loop',
      'Angle discipline modeled through focus and intensity',
      'Power spin raises output but also danger',
    ],
    dynamics: ['Combo-oriented precision play', 'Controlled aggression during power windows'],
    sharedComponents: ['PaddleController', 'DeflectionResolver', 'AngularLaneMap'],
    tuning: {
      primaryLabel: 'Deflect',
      secondaryLabel: 'Re-center',
      tertiaryLabel: 'Power Spin',
      primaryProgress: 4,
      primaryScore: 10,
      secondaryFocus: 8,
      secondaryIntensity: -4,
      tertiaryProgress: 6,
      tertiaryScore: 16,
      tertiaryIntensity: 8,
      passiveIntensity: 2,
      progressTarget: 115,
    },
  },
  {
    slug: 'vector-assault',
    title: 'Vector Assault',
    family: 'Arena Shooter',
    summary: 'Survive escalating arena waves with independent positioning and burst attacks.',
    controls: ['Primary: Strafe Fire', 'Secondary: Reposition', 'Tertiary: Overdrive Burst'],
    mechanics: [
      'Arena survival with escalating pressure',
      'Independent positioning and output cadence',
      'Burst phases amplify score and threat simultaneously',
    ],
    dynamics: ['High-pressure survival optimization', 'Tempo shifts between control and burst'],
    sharedComponents: ['AimVectorController', 'ProjectilePool', 'WaveDirector'],
    tuning: {
      primaryLabel: 'Strafe Fire',
      secondaryLabel: 'Reposition',
      tertiaryLabel: 'Overdrive Burst',
      primaryProgress: 4,
      primaryScore: 11,
      secondaryFocus: 7,
      secondaryIntensity: -5,
      tertiaryProgress: 7,
      tertiaryScore: 18,
      tertiaryIntensity: 8,
      passiveIntensity: 3,
      progressTarget: 130,
    },
  },
  {
    slug: 'block-fall',
    title: 'Block Fall',
    family: 'Falling Block Puzzle',
    summary: 'Place and stabilize falling pieces while pace and collapse pressure intensify.',
    controls: ['Primary: Drop Piece', 'Secondary: Settle Board', 'Tertiary: Hard Drop'],
    mechanics: [
      'Matrix placement cadence represented by progress',
      'Stability windows through settle actions',
      'Hard drops accelerate score and pacing risk',
    ],
    dynamics: ['Planned pacing with occasional speed spikes', 'Tradeoff between setup and throughput'],
    sharedComponents: ['BoardMatrix', 'CollisionProbe', 'LineClearResolver'],
    tuning: {
      primaryLabel: 'Drop Piece',
      secondaryLabel: 'Settle Board',
      tertiaryLabel: 'Hard Drop',
      primaryProgress: 3,
      primaryScore: 8,
      secondaryFocus: 8,
      secondaryIntensity: -5,
      tertiaryProgress: 8,
      tertiaryScore: 17,
      tertiaryIntensity: 9,
      passiveIntensity: 3,
      progressTarget: 125,
    },
  },
  {
    slug: 'angle-war',
    title: 'Angle War',
    family: 'Artillery / Ballistics',
    summary: 'Tune trajectory and force, then commit to high-value artillery shots.',
    controls: ['Primary: Standard Shot', 'Secondary: Re-aim', 'Tertiary: Full Salvo'],
    mechanics: [
      'Angle and power control loop abstracted into action cadence',
      'Turn pressure simulated via intensity accumulation',
      'Salvo mechanics provide high-risk scoring bursts',
    ],
    dynamics: ['Deliberate setup versus aggressive volleys', 'Turn-by-turn tension escalation'],
    sharedComponents: ['TurnManager', 'BallisticsSolver', 'ExplosionResolver'],
    tuning: {
      primaryLabel: 'Standard Shot',
      secondaryLabel: 'Re-aim',
      tertiaryLabel: 'Full Salvo',
      primaryProgress: 4,
      primaryScore: 10,
      secondaryFocus: 8,
      secondaryIntensity: -6,
      tertiaryProgress: 7,
      tertiaryScore: 19,
      tertiaryIntensity: 9,
      passiveIntensity: 3,
      progressTarget: 120,
    },
  },
  {
    slug: 'beat-grid',
    title: 'Beat Grid',
    family: 'Rhythm Timing',
    summary: 'Hit timing windows and sustain combo chains as beat density ramps upward.',
    controls: ['Primary: Hit Window', 'Secondary: Re-sync', 'Tertiary: Combo Push'],
    mechanics: [
      'Timing-window judgment loop',
      'Sync maintenance with penalty recovery path',
      'Combo push increases reward while narrowing safety',
    ],
    dynamics: ['Cadence mastery and rhythm consistency', 'Intentional risk during combo pushes'],
    sharedComponents: ['BeatClock', 'TimingWindowEvaluator', 'ComboSystem'],
    tuning: {
      primaryLabel: 'Hit Window',
      secondaryLabel: 'Re-sync',
      tertiaryLabel: 'Combo Push',
      primaryProgress: 3,
      primaryScore: 9,
      secondaryFocus: 10,
      secondaryIntensity: -7,
      tertiaryProgress: 6,
      tertiaryScore: 18,
      tertiaryIntensity: 10,
      passiveIntensity: 4,
      progressTarget: 110,
    },
  },
  {
    slug: 'tower-rise',
    title: 'Tower Rise',
    family: 'Vertical Climber',
    summary: 'Climb upward through procedural pressure and avoid falling below the active frame.',
    controls: ['Primary: Climb Step', 'Secondary: Secure Grip', 'Tertiary: Vault Boost'],
    mechanics: [
      'Vertical ascent progression',
      'Fall pressure represented through intensity debt',
      'Vault boosts accelerate score and risk',
    ],
    dynamics: ['Steady climb punctuated by burst jumps', 'Position security versus speed'],
    sharedComponents: ['VerticalCameraController', 'ProceduralPlatformSpawner', 'FallOutDetector'],
    tuning: {
      primaryLabel: 'Climb Step',
      secondaryLabel: 'Secure Grip',
      tertiaryLabel: 'Vault Boost',
      primaryProgress: 4,
      primaryScore: 9,
      secondaryFocus: 9,
      secondaryIntensity: -6,
      tertiaryProgress: 7,
      tertiaryScore: 16,
      tertiaryIntensity: 8,
      passiveIntensity: 3,
      progressTarget: 118,
    },
  },
  {
    slug: 'dash-lanes',
    title: 'Dash Lanes',
    family: 'Endless Runner',
    summary: 'Maintain lane-read rhythm while obstacle cadence and speed pressure increase.',
    controls: ['Primary: Forward Push', 'Secondary: Lane Reset', 'Tertiary: Dash Surge'],
    mechanics: [
      'Forced-forward style progression',
      'Lane management represented by focus recovery',
      'Dash surges create high-output risk windows',
    ],
    dynamics: ['Reaction-window play and pacing control', 'Burst scoring under obstacle pressure'],
    sharedComponents: ['ForwardMotionController', 'LaneSwitcher', 'ObstacleSequencer'],
    tuning: {
      primaryLabel: 'Forward Push',
      secondaryLabel: 'Lane Reset',
      tertiaryLabel: 'Dash Surge',
      primaryProgress: 4,
      primaryScore: 8,
      secondaryFocus: 8,
      secondaryIntensity: -5,
      tertiaryProgress: 8,
      tertiaryScore: 17,
      tertiaryIntensity: 9,
      passiveIntensity: 3,
      progressTarget: 128,
    },
  },
]

const toAppId = (slug) => slug.replace(/-/g, '')

const writeFile = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
}

const scaffoldBase = (slug) => {
  const appDir = path.join(appsDir, slug)
  if (!fs.existsSync(appDir)) {
    fs.cpSync(nimDir, appDir, {
      recursive: true,
      filter: (src) => {
        const rel = path.relative(nimDir, src)
        if (!rel) return true
        if (rel.startsWith('node_modules')) return false
        if (rel.startsWith('dist')) return false
        if (rel.startsWith('release')) return false
        if (rel.startsWith('test-results')) return false
        if (rel.startsWith('playwright-report')) return false
        return true
      },
    })
  }
  return appDir
}

const buildDomainTypes = (game) => `export type GamePhase = 'playing' | 'gameOver'

export interface GameState {
  phase: GamePhase
  tick: number
  score: number
  lives: number
  intensity: number
  progress: number
  focus: number
  status: string
}
`

const buildDomainConstants = (game) => `import type { GameState } from './types'

export interface GameMeta {
  slug: string
  title: string
  family: string
  summary: string
  primaryLabel: string
  secondaryLabel: string
  tertiaryLabel: string
}

export const GAME_META: GameMeta = {
  slug: '${game.slug}',
  title: '${game.title}',
  family: '${game.family}',
  summary: '${game.summary}',
  primaryLabel: '${game.tuning.primaryLabel}',
  secondaryLabel: '${game.tuning.secondaryLabel}',
  tertiaryLabel: '${game.tuning.tertiaryLabel}',
}

export const PROGRESS_TARGET = ${game.tuning.progressTarget}

export const INITIAL_STATE: GameState = {
  phase: 'playing',
  tick: 0,
  score: 0,
  lives: 3,
  intensity: 10,
  progress: 0,
  focus: 50,
  status: 'Ready for ${game.family.toLowerCase()} loop',
}
`

const buildDomainRules = (game) => `import type { GameState } from './types'
import { INITIAL_STATE, PROGRESS_TARGET } from './constants'

export type GameAction = 'primary' | 'secondary' | 'tertiary' | 'tick' | 'reset'

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) return min
  if (value > max) return max
  return value
}

const withGameOverCheck = (state: GameState): GameState => {
  if (state.lives <= 0) {
    return { ...state, phase: 'gameOver', status: 'System collapse: retry run' }
  }

  if (state.progress >= PROGRESS_TARGET) {
    return {
      ...state,
      phase: 'gameOver',
      status: 'Prototype objective reached',
      score: state.score + 25,
    }
  }

  return state
}

export const reduceGameState = (state: GameState, action: GameAction): GameState => {
  if (action === 'reset') return INITIAL_STATE
  if (state.phase === 'gameOver') return state

  if (action === 'tick') {
    const next = {
      ...state,
      tick: state.tick + 1,
      intensity: clamp(state.intensity + ${game.tuning.passiveIntensity}, 0, 100),
      focus: clamp(state.focus - 1, 0, 100),
      lives: state.intensity > 92 ? state.lives - 1 : state.lives,
      status: '${game.family} pressure rising',
    }
    return withGameOverCheck(next)
  }

  if (action === 'primary') {
    const next = {
      ...state,
      score: state.score + ${game.tuning.primaryScore},
      progress: state.progress + ${game.tuning.primaryProgress},
      focus: clamp(state.focus + 2, 0, 100),
      status: '${game.tuning.primaryLabel} executed',
    }
    return withGameOverCheck(next)
  }

  if (action === 'secondary') {
    const next = {
      ...state,
      focus: clamp(state.focus + ${game.tuning.secondaryFocus}, 0, 100),
      intensity: clamp(state.intensity + ${game.tuning.secondaryIntensity}, 0, 100),
      score: state.score + 2,
      status: '${game.tuning.secondaryLabel} recovered control',
    }
    return withGameOverCheck(next)
  }

  const next = {
    ...state,
    score: state.score + ${game.tuning.tertiaryScore},
    progress: state.progress + ${game.tuning.tertiaryProgress},
    intensity: clamp(state.intensity + ${game.tuning.tertiaryIntensity}, 0, 100),
    focus: clamp(state.focus - 6, 0, 100),
    status: '${game.tuning.tertiaryLabel} high-risk burst',
  }
  return withGameOverCheck(next)
}
`

const buildDomainIndex = () => `export type { GamePhase, GameState } from './types'
export type { GameMeta } from './constants'
export { GAME_META, INITIAL_STATE, PROGRESS_TARGET } from './constants'
export type { GameAction } from './rules'
export { reduceGameState } from './rules'
`

const buildHook = () => `import type { GameAction, GameState } from '@/domain'
import { GAME_META, INITIAL_STATE, reduceGameState } from '@/domain'
import { useCallback, useEffect, useState } from 'react'

export interface UseGameResult {
  state: GameState
  meta: typeof GAME_META
  dispatch: (action: GameAction) => void
  reset: () => void
}

export const useGame = (): UseGameResult => {
  const [state, setState] = useState<GameState>(INITIAL_STATE)

  const dispatch = useCallback((action: GameAction) => {
    setState((prev) => reduceGameState(prev, action))
  }, [])

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setState((prev) => reduceGameState(prev, 'tick'))
    }, 1400)

    return () => window.clearInterval(timer)
  }, [])

  return { state, meta: GAME_META, dispatch, reset }
}
`

const buildAppIndex = () => `export { useGame } from './hooks/useGame'
`

const buildOrganismApp = () => `import { useGame } from '@/app'
import styles from './App.module.css'

const meterStyle = (value: number) => ({ width: \`\${value}%\` })

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

        <div className={styles.meters}>
          <div className={styles.meterRow}>
            <span>Intensity</span>
            <div className={styles.meterTrack}>
              <div className={styles.meterFillDanger} style={meterStyle(state.intensity)} />
            </div>
          </div>
          <div className={styles.meterRow}>
            <span>Focus</span>
            <div className={styles.meterTrack}>
              <div className={styles.meterFillFocus} style={meterStyle(state.focus)} />
            </div>
          </div>
          <div className={styles.meterRow}>
            <span>Progress</span>
            <div className={styles.meterTrack}>
              <div className={styles.meterFillProgress} style={meterStyle(progressPercent)} />
            </div>
          </div>
        </div>

        <dl className={styles.stats}>
          <div>
            <dt>Score</dt>
            <dd>{state.score}</dd>
          </div>
          <div>
            <dt>Lives</dt>
            <dd>{state.lives}</dd>
          </div>
          <div>
            <dt>Tick</dt>
            <dd>{state.tick}</dd>
          </div>
        </dl>

        <p className={styles.status}>{state.status}</p>

        <div className={styles.actions}>
          <button onClick={() => dispatch('primary')} type="button">
            {meta.primaryLabel}
          </button>
          <button onClick={() => dispatch('secondary')} type="button">
            {meta.secondaryLabel}
          </button>
          <button onClick={() => dispatch('tertiary')} type="button">
            {meta.tertiaryLabel}
          </button>
        </div>

        <button className={styles.reset} onClick={reset} type="button">
          Reset Session
        </button>
      </section>
    </main>
  )
}
`

const buildOrganismCss = () => `.root {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: radial-gradient(circle at 10% 10%, #1f2a44 0%, #0d1220 55%, #090d18 100%);
  color: #f7f9ff;
}

.card {
  width: min(760px, 95vw);
  border: 1px solid rgba(137, 167, 255, 0.25);
  border-radius: 16px;
  background: rgba(12, 19, 35, 0.88);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  padding: 24px;
}

.header h1 {
  margin: 0;
  font-size: clamp(1.6rem, 2.2vw, 2.2rem);
}

.kicker {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ac5ff;
}

.summary {
  margin: 10px 0 0;
  color: #d3def8;
}

.meters {
  margin-top: 18px;
  display: grid;
  gap: 10px;
}

.meterRow {
  display: grid;
  gap: 6px;
}

.meterTrack {
  height: 10px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  overflow: hidden;
}

.meterFillDanger,
.meterFillFocus,
.meterFillProgress {
  height: 100%;
  transition: width 180ms ease;
}

.meterFillDanger {
  background: linear-gradient(90deg, #ffb98a, #ff5c5c);
}

.meterFillFocus {
  background: linear-gradient(90deg, #9af7d8, #3ac4ff);
}

.meterFillProgress {
  background: linear-gradient(90deg, #d3a6ff, #7a8dff);
}

.stats {
  margin: 18px 0 8px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.stats div {
  border: 1px solid rgba(150, 180, 255, 0.2);
  border-radius: 12px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
}

.stats dt {
  font-size: 0.78rem;
  color: #b6c8ef;
}

.stats dd {
  margin: 4px 0 0;
  font-weight: 700;
  font-size: 1.05rem;
}

.status {
  margin: 10px 0 14px;
  color: #d8e3ff;
}

.actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.actions button,
.reset {
  min-height: 44px;
  border-radius: 10px;
  border: 1px solid rgba(157, 184, 255, 0.45);
  background: linear-gradient(180deg, #2c3d66, #1e2944);
  color: #f5f8ff;
  font-weight: 600;
  cursor: pointer;
}

.actions button:hover,
.reset:hover {
  filter: brightness(1.08);
}

.reset {
  margin-top: 12px;
  width: 100%;
}

@media (max-width: 599px) {
  .actions {
    grid-template-columns: 1fr;
  }
}
`

const buildOrganismsIndex = () => `export { App } from './App'
`

const buildUIIndex = () => `export * from './organisms'
`

const buildIndexTsx = () => `import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import { App } from '@/ui'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`

const buildStylesCss = () => `:root {
  font-family: Inter, Segoe UI, system-ui, -apple-system, sans-serif;
  color-scheme: dark;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  min-height: 100%;
}
`

const buildReadme = (game) => `# ${game.title}

## Style Family
${game.family}

## High-Concept Pitch
${game.summary}

## Core Mechanics
${game.mechanics.map((line) => `- ${line}`).join('\n')}

## Target Dynamics
${game.dynamics.map((line) => `- ${line}`).join('\n')}

## Shared Engine Components To Reuse/Extract
${game.sharedComponents.map((line) => `- ${line}`).join('\n')}

## Input Verbs
${game.controls.map((line) => `- ${line}`).join('\n')}

## Current Implementation Status
- Prototype loop implemented with style-specific action verbs
- Domain/app/ui layers separated
- Ready for next pass: full engine extraction + richer board/simulation rendering
`

const buildDeveloperPrompt = (game) => `# Developer Prompt — ${game.title}

You are implementing the ${game.family} family game shell in this app.

## Product Direction
${game.summary}

## Non-Negotiable Mechanics
${game.mechanics.map((line) => `- ${line}`).join('\n')}

## Dynamics To Preserve
${game.dynamics.map((line) => `- ${line}`).join('\n')}

## Reuse Targets
${game.sharedComponents.map((line) => `- ${line}`).join('\n')}

## Architecture Contract
- Keep game rules in \`src/domain\`
- Keep orchestration/state hooks in \`src/app\`
- Keep rendering in \`src/ui\`
- Preserve monorepo conventions and app package boundaries

## Next Iteration Tasks
1. Replace prototype meters with concrete board/field simulation.
2. Extract reusable mechanics into shared engine packages.
3. Add deterministic unit tests for rules transitions.
4. Add component + e2e tests for interaction flow.
`

const buildManifest = (game) =>
  JSON.stringify(
    {
      name: `${game.title} Game`,
      short_name: game.title,
      description: game.summary,
      start_url: '/',
      display: 'standalone',
      theme_color: '#111827',
      background_color: '#0b1020',
      icons: [{ src: '/icon.svg', sizes: '192x192', type: 'image/svg+xml' }],
    },
    null,
    2,
  ) + '\n'

const buildIcon = (game) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7a8dff"/>
      <stop offset="100%" stop-color="#3ac4ff"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="192" height="192" rx="32" fill="#0f172a"/>
  <circle cx="96" cy="96" r="70" fill="url(#g)"/>
  <text x="96" y="112" text-anchor="middle" fill="#0f172a" font-size="62" font-family="Arial" font-weight="700">
    ${game.title.charAt(0)}
  </text>
</svg>
`

const buildIndexHtml = (game) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${game.summary}" />
    <meta name="theme-color" content="#0f172a" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <link rel="manifest" href="/manifest.json" />
    <title>${game.title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
`

const updatePackageMetadata = (appDir, game) => {
  const pkgPath = path.join(appDir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  pkg.name = `@games/${game.slug}`
  pkg.description = `${game.title} (${game.family})`
  if (pkg.build && typeof pkg.build === 'object') {
    pkg.build.appId = `com.scottreinhart.${toAppId(game.slug)}`
    pkg.build.productName = game.title
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

const updateCapacitorConfig = (appDir, game) => {
  const capPath = path.join(appDir, 'capacitor.config.ts')
  if (!fs.existsSync(capPath)) return
  const text = fs
    .readFileSync(capPath, 'utf8')
    .replace(/appId:\s*'[^']*'/, `appId: 'com.scottreinhart.${toAppId(game.slug)}'`)
    .replace(/appName:\s*'[^']*'/, `appName: '${game.title}'`)
  fs.writeFileSync(capPath, text)
}

const updateElectronMain = (appDir, game) => {
  const mainPath = path.join(appDir, 'electron', 'main.js')
  if (!fs.existsSync(mainPath)) return
  const text = fs.readFileSync(mainPath, 'utf8').replace(/title:\s*'[^']*'/, `title: '${game.title}'`)
  fs.writeFileSync(mainPath, text)
}

const writeAppSource = (appDir, game) => {
  fs.rmSync(path.join(appDir, 'src'), { recursive: true, force: true })
  writeFile(path.join(appDir, 'src', 'domain', 'types.ts'), buildDomainTypes(game))
  writeFile(path.join(appDir, 'src', 'domain', 'constants.ts'), buildDomainConstants(game))
  writeFile(path.join(appDir, 'src', 'domain', 'rules.ts'), buildDomainRules(game))
  writeFile(path.join(appDir, 'src', 'domain', 'index.ts'), buildDomainIndex())
  writeFile(path.join(appDir, 'src', 'app', 'hooks', 'useGame.ts'), buildHook())
  writeFile(path.join(appDir, 'src', 'app', 'index.ts'), buildAppIndex())
  writeFile(path.join(appDir, 'src', 'ui', 'organisms', 'App.tsx'), buildOrganismApp())
  writeFile(path.join(appDir, 'src', 'ui', 'organisms', 'App.module.css'), buildOrganismCss())
  writeFile(path.join(appDir, 'src', 'ui', 'organisms', 'index.ts'), buildOrganismsIndex())
  writeFile(path.join(appDir, 'src', 'ui', 'index.ts'), buildUIIndex())
  writeFile(path.join(appDir, 'src', 'index.tsx'), buildIndexTsx())
  writeFile(path.join(appDir, 'src', 'styles.css'), buildStylesCss())
}

const writeDocsAndPublic = (appDir, game) => {
  writeFile(path.join(appDir, 'README.md'), buildReadme(game))
  writeFile(path.join(appDir, 'DEVELOPER_PROMPT.md'), buildDeveloperPrompt(game))
  writeFile(path.join(appDir, 'index.html'), buildIndexHtml(game))
  writeFile(path.join(appDir, 'public', 'manifest.json'), buildManifest(game))
  writeFile(path.join(appDir, 'public', 'icon.svg'), buildIcon(game))
  writeFile(path.join(appDir, 'CHANGELOG.md'), `# Changelog — @games/${game.slug}\n\n## 1.0.0\n- Initial ${game.family} prototype scaffold.\n`)
}

for (const game of GAME_DEFS) {
  const appDir = scaffoldBase(game.slug)
  updatePackageMetadata(appDir, game)
  updateCapacitorConfig(appDir, game)
  updateElectronMain(appDir, game)
  writeAppSource(appDir, game)
  writeDocsAndPublic(appDir, game)
  console.log(`✅ ${game.slug} scaffolded (${game.family})`)
}

