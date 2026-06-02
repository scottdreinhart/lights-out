# Block Fall

## Style Family
Falling Block Puzzle

## High-Concept Pitch
Place and stabilize falling pieces while pace and collapse pressure intensify.

## Core Mechanics
- Matrix placement cadence represented by progress
- Stability windows through settle actions
- Hard drops accelerate score and pacing risk

## Target Dynamics
- Planned pacing with occasional speed spikes
- Tradeoff between setup and throughput

## Shared Engine Components To Reuse/Extract
- BoardMatrix
- CollisionProbe
- LineClearResolver

## Input Verbs
- Primary: Drop Piece
- Secondary: Settle Board
- Tertiary: Hard Drop

## Current Implementation Status
- Prototype loop implemented with style-specific action verbs
- Domain/app/ui layers separated
- Ready for next pass: full engine extraction + richer board/simulation rendering
