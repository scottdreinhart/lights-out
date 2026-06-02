# Neon Hop

## Style Family
Platform Physics

## High-Concept Pitch
Time jumps and recoveries with precision to keep a kinetic platform run alive.

## Core Mechanics
- Jump-timing cadence and landing discipline
- Airborne risk represented by intensity growth
- Chain hops trade safety for speed and score

## Target Dynamics
- Precision rhythm under increasing speed
- Recovery decisions after risky hops

## Shared Engine Components To Reuse/Extract
- KinematicBody2D
- GroundDetector
- JumpTuningProfile

## Input Verbs
- Primary: Jump
- Secondary: Balance
- Tertiary: Chain Hop

## Current Implementation Status
- Prototype loop implemented with style-specific action verbs
- Domain/app/ui layers separated
- Ready for next pass: full engine extraction + richer board/simulation rendering
