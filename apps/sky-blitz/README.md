# Sky Blitz

## Style Family
Side Scroller

## High-Concept Pitch
Push forward through scrolling hazard waves and keep flight momentum alive.

## Core Mechanics
- Forward pressure loop with hazard cadence
- Boost and stability management under scrolling tension
- Distance-driven progression represented by progress score

## Target Dynamics
- Momentum management and recovery windows
- High-tempo risk spikes during barrel roll bursts

## Shared Engine Components To Reuse/Extract
- SideScrollCamera
- HazardSpawner
- CheckpointSystem

## Input Verbs
- Primary: Boost Forward
- Secondary: Stabilize
- Tertiary: Barrel Roll

## Current Implementation Status
- Prototype loop implemented with style-specific action verbs
- Domain/app/ui layers separated
- Ready for next pass: full engine extraction + richer board/simulation rendering
