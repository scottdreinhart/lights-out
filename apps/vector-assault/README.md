# Vector Assault

## Style Family
Arena Shooter

## High-Concept Pitch
Survive escalating arena waves with independent positioning and burst attacks.

## Core Mechanics
- Arena survival with escalating pressure
- Independent positioning and output cadence
- Burst phases amplify score and threat simultaneously

## Target Dynamics
- High-pressure survival optimization
- Tempo shifts between control and burst

## Shared Engine Components To Reuse/Extract
- AimVectorController
- ProjectilePool
- WaveDirector

## Input Verbs
- Primary: Strafe Fire
- Secondary: Reposition
- Tertiary: Overdrive Burst

## Current Implementation Status
- Prototype loop implemented with style-specific action verbs
- Domain/app/ui layers separated
- Ready for next pass: full engine extraction + richer board/simulation rendering
