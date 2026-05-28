# Beat Grid

## Style Family
Rhythm Timing

## High-Concept Pitch
Hit timing windows and sustain combo chains as beat density ramps upward.

## Core Mechanics
- Timing-window judgment loop
- Sync maintenance with penalty recovery path
- Combo push increases reward while narrowing safety

## Target Dynamics
- Cadence mastery and rhythm consistency
- Intentional risk during combo pushes

## Shared Engine Components To Reuse/Extract
- BeatClock
- TimingWindowEvaluator
- ComboSystem

## Input Verbs
- Primary: Hit Window
- Secondary: Re-sync
- Tertiary: Combo Push

## Current Implementation Status
- Prototype loop implemented with style-specific action verbs
- Domain/app/ui layers separated
- Ready for next pass: full engine extraction + richer board/simulation rendering
