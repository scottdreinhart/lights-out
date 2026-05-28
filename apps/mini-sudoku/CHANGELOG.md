# Changelog — mini-sudoku-game

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

## [1.0.0] — 2026-04-13

### Added

- Initial release: Compact 4×4 and 6×6 sudoku variants for quick solving sessions.
- CLEAN Architecture: domain/app/ui layer separation
- Atomic Design component hierarchy (atoms → molecules → organisms)
- 5-tier responsive design (`useResponsiveState`)
- Theme system with dark/light mode (`useTheme`)
- Sound effects via `useSoundEffects`
- Game statistics tracking via `useStats`
- `useGame` hook encapsulating all game state logic
- Unit tests for domain layer (`pnpm test`)
