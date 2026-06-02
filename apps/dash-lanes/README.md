# Dash-Lanes

## Style Family
Endless Runner

## High-Concept Pitch
Maintain lane-read rhythm while obstacle cadence and speed pressure increase.

## Core Mechanics
- Forced-forward style progression
- Lane management represented by focus recovery
- Dash surges create high-output risk windows

## Target Dynamics
- Reaction-window play and pacing control
- Burst scoring under obstacle pressure

## Shared Engine Components To Reuse/Extract
- ForwardMotionController
- LaneSwitcher
- ObstacleSequencer

## Input Verbs
- Primary: Forward Push
- Secondary: Lane Reset
- Tertiary: Dash Surge

## Current Implementation Status
- Prototype loop implemented with style-specific action verbs
- Domain/app/ui layers separated
- Ready for next pass: full engine extraction + richer board/simulation rendering
