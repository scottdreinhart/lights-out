# Angle War

## Style Family
Artillery / Ballistics

## High-Concept Pitch
Tune trajectory and force, then commit to high-value artillery shots.

## Core Mechanics
- Defender-style horizontal wrap pressure with continuous enemy ingress
- Ballistic artillery aiming via angle + force with deterministic arcs
- Standard Shot, Re-aim, and Full Salvo abilities with cooldown pressure
- Abductor enemies that capture ground objectives and force defensive triage

## Target Dynamics
- Fast skimmers, floaters, and abductors requiring different shot profiles
- Continuous escalation in wave speed and spawn cadence
- Rescue bonus for intercepting abductors before objective loss

## Shared Engine Components To Reuse/Extract
- TrajectoryCalculator
- ProjectilePhysics
- EnemySpawnDirector
- WaveProgression
- CollisionResolver
- BallisticsSolver
- ObjectiveDefenseResolver

## Input Verbs
- Primary: Standard Shot
- Secondary: Re-aim
- Tertiary: Full Salvo

## Current Implementation Status
- Deterministic simulation loop implemented in `src/domain`
- App layer orchestrates fixed-timestep updates and keyboard adapter controls
- UI layer renders scrolling battlefield, arc preview, HUD, and actions
- Ready for extraction into shared artillery engine package once additional variants are added
