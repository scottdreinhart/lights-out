# Pulse Burst

## Canonical Name
Pulse Burst

## Style Family
Impulse-Gap Runner

## High-Concept Pitch
Ride a forward-scrolling corridor using timed upward bursts while gravity drags you into narrowing obstacle gaps.

## Engine and Mechanics
- **Impulse Physics Engine**: deterministic `gravity + burst impulse + velocity clamp` update model.
- **Obstacle Gap Engine**: paired top/bottom barriers with procedural gap center/size and spawn cadence.
- **Intensity Scaling Engine**: progressive speed-up, tighter gaps, and faster spawn intervals.
- **Session Lifecycle Engine**: start -> playing -> fail -> retry with full state reset.

## Core Mechanics
- Burst-only vertical control (tap/Space/W/ArrowUp).
- Constant forward pressure simulated by right-to-left obstacle motion.
- Collision fail states (obstacle impact or boundary breach).
- Score progression from distance ticks + obstacle pass bonus.

## Input Verbs
- Primary: Burst
- Secondary: Restart

## Current Implementation Status
- Prototype loop implemented with domain-first simulation.
- Domain/app/ui layers separated.
- Domain unit tests cover burst, gravity, collision, scoring, restart, and scaling.
