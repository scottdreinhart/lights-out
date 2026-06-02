# Changelog — @games/ship-captain-crew

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

## [1.0.0] — 2026-04-13

### Added

- Initial release: Nautical dice game — roll Ship (6), Captain (5), Crew (4) before scoring.
- CLEAN Architecture: domain/app/ui layer separation
- Atomic Design component hierarchy (atoms → molecules → organisms)
- 5-tier responsive design (`useResponsiveState`)
- Theme system with dark/light mode (`useTheme`)
- Sound effects via `useSoundEffects`
- Game statistics tracking via `useStats`
- `useGame` hook encapsulating all game state logic
- Unit tests for domain layer (`pnpm test`)
