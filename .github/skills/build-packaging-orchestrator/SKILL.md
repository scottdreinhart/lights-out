---
name: build-packaging-orchestrator
description: "Build Packaging Orchestrator"
---

# Build Packaging Orchestrator

## When to Use

- Running or troubleshooting build, package, and release flows
- Coordinating Vite, Electron, Capacitor, and WASM build scripts
- Enforcing shell-routing and pnpm-only execution

## Authority

- `AGENTS.md` § 0, § 2, § 5, § 14, § 15, § 16, § 20, § 22
- `.github/instructions/01-build.instructions.md`
- `.github/instructions/03-electron.instructions.md`
- `.github/instructions/04-capacitor.instructions.md`
- `.github/instructions/05-wasm.instructions.md`

## Core Responsibilities

- Route commands to correct environment (Bash default, exceptions explicit)
- Use existing package scripts only (no parallel build paths)
- Preserve output structure (`dist/`, `release/`, native projects)
- Validate with repo quality gates before handoff

## Definition of Done

- Required build flow succeeds with approved scripts
- Shell/platform policy honored
- Output artifacts generated in expected directories
