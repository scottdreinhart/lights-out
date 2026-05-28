# Circuit Maze

## Style Family
Maze Runner

## High-Concept Pitch
Collect all nodes in a hostile grid while pressure rises from roaming sentinels.

## Core Mechanics
- Grid navigation with pickup completion objective
- Pursuit pressure simulated through rising intensity
- Power state represented by temporary focus burst

## Target Dynamics
- Route planning under escalating pressure
- Risk/reward choices between safe clears and burst dashes

## Shared Engine Components To Reuse/Extract
- GridMap
- Pathfinder
- CollectibleLayer
- EnemyStateMachine

## Input Verbs
- Primary: Move/Collect
- Secondary: Pulse Scan
- Tertiary: Burst Dash

## Current Implementation Status
- Prototype loop implemented with style-specific action verbs
- Domain/app/ui layers separated
- Ready for next pass: full engine extraction + richer board/simulation rendering
