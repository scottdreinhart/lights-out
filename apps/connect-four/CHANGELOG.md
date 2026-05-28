# Changelog — @games/connect-four

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

## [1.0.0] — 2026-04-13

### Added

- Initial release: Two-player connection game — drop discs to connect four in a row.
- CLEAN Architecture: domain/app/ui layer separation
- Atomic Design component hierarchy (atoms → molecules → organisms)
- 5-tier responsive design (useResponsiveState)
- Theme system with dark/light mode (useTheme)
- Sound effects via useSoundEffects
- Game statistics tracking via useStats
- useGame hook encapsulating all game state logic
- Electron desktop build support
- Web PWA manifest and service worker
- WCAG 2.1 AA accessibility (keyboard nav, ARIA, focus management)
- Unit tests for domain layer (pnpm test)
