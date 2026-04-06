# Build & Packaging Instructions

> **Scope**: Build scripts, packaging, shell/environment routing, output directories.
> Subordinate to `AGENTS.md` §0 (Non-Negotiable Rules), §2 (pnpm-only), and §5 (shell routing).
> **BASELINE** — Before working on build tasks, read `AGENTS.md` § 0 for non-negotiable AI operating rules.
> **MANDATORY SHELL POLICY**: Bash/POSIX is the default shell for all development and build tasks. PowerShell is opt-in only.

---

## Script Routing Matrix

| Script                      | What It Does                                                    | Shell                          |
| --------------------------- | --------------------------------------------------------------- | ------------------------------ |
| `pnpm build`                | Vite production build → `dist/`                                 | Bash (WSL: Ubuntu)             |
| `pnpm build:preview`        | Build + local preview server                                    | Bash (WSL: Ubuntu)             |
| `pnpm electron:build`       | Vite build + electron-builder for current platform → `release/` | Platform-dependent (see below) |
| `pnpm electron:build:win`   | Windows `.exe` (portable) → `release/`                          | **PowerShell**                 |
| `pnpm electron:build:linux` | Linux `.AppImage` → `release/`                                  | Bash (WSL: Ubuntu)             |
| `pnpm electron:build:mac`   | macOS `.dmg` → `release/`                                       | **macOS / Apple**              |
| `pnpm cap:sync`             | Vite build + Capacitor sync to native projects                  | Bash (WSL: Ubuntu)             |
| `pnpm wasm:build`           | AssemblyScript → WASM → base64                                  | Bash (WSL: Ubuntu)             |
| `pnpm wasm:build:debug`     | WASM debug build                                                | Bash (WSL: Ubuntu)             |

---

## Shell / Environment Routing (Mandatory Defaults)

**Default Shell: Bash (WSL: Ubuntu)** — All development, build, and operational tasks use Bash unless explicitly exempted.

| Environment            | Tasks                                                                                                                                                | DEFAULT?  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| **Bash (WSL: Ubuntu)** | `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm check`, `pnpm fix`, `pnpm validate`, `pnpm electron:build:linux`, `pnpm cap:sync`, `pnpm wasm:build` | ✅ YES    |
| **PowerShell**         | `pnpm electron:build:win` only                                                                                                                       | ❌ OPT-IN |
| **macOS / Apple**      | `pnpm electron:build:mac`, `pnpm cap:open:ios`, `pnpm cap:run:ios`                                                                                   | ❌ OPT-IN |

**Default**: Bash (WSL: Ubuntu) for everything unless the task explicitly targets Windows packaging or Apple platforms.

**NonNegotiable Rule**: PowerShell is opt-in only. Never default to PowerShell, never present it as interchangeable with Bash, never generate PowerShell commands unless explicitly requested.

### WSL/PowerShell Native Binary Guardrail

When the workspace lives on NTFS and is shared between WSL and Windows, `node_modules/` may contain incompatible native binaries (`esbuild`, `rollup`, etc.).

- Check `.node-platform.md` before running commands.
- If current shell does not match marker platform:
  - Run `pnpm clean:node && pnpm install` in the current shell.
  - Update marker (`platform: linux` for WSL, `platform: windows` for PowerShell).
- If command shims are still missing, run `pnpm rebuild`.

---

## Electron Builder Configuration

Defined in `package.json` under the `"build"` key:

| Field                | Value                        |
| -------------------- | ---------------------------- |
| `appId`              | `com.scottreinhart.nim`      |
| `productName`        | `Nim`                        |
| `directories.output` | `release`                    |
| `files`              | `dist/**/*`, `electron/**/*` |
| `win.target`         | `portable` (unsigned)        |
| `mac.target`         | `dmg`                        |
| `linux.target`       | `AppImage`                   |

---

## Output Directories

| Directory       | Contents                        | Gitignored |
| --------------- | ------------------------------- | ---------- |
| `dist/`         | Vite production build output    | Yes        |
| `release/`      | Electron Builder distributables | Yes        |
| `node_modules/` | Dependencies                    | Yes        |

---

## Cleanup Scripts

| Script            | Effect                                           |
| ----------------- | ------------------------------------------------ |
| `pnpm clean`      | Removes `dist/` and `release/`                   |
| `pnpm clean:node` | Removes `node_modules/`                          |
| `pnpm clean:all`  | Removes `dist/`, `release/`, and `node_modules/` |
| `pnpm reinstall`  | `clean:all` + `pnpm install`                     |

---

## Quality Gate Scripts

| Script              | Effect                                 |
| ------------------- | -------------------------------------- |
| `pnpm lint`         | ESLint check on `src/`                 |
| `pnpm lint:fix`     | ESLint auto-fix on `src/`              |
| `pnpm format`       | Prettier format `src/`                 |
| `pnpm format:check` | Prettier check `src/` (no write)       |
| `pnpm typecheck`    | `tsc --noEmit`                         |
| `pnpm check`        | `lint` + `format:check` + `typecheck`  |
| `pnpm fix`          | `lint:fix` + `format`                  |
| `pnpm validate`     | `check` + `build` + Lighthouse audit (full pre-push gate, MUST pass ≥80 Lighthouse score for CSS performance) |

Always run `pnpm validate` before pushing changes.

**CSS Performance Validation** (Mandatory in `pnpm validate`):
- Runs Lighthouse audit (target ≥90, minimum ≥80)
- Validates Core Web Vitals: FCP <1.8s, LCP <2.5s, CLS <0.1
- Verifies CSS critical path <50KB
- Checks DevTools Coverage >80% CSS used
- Confirms no render-blocking resources beyond critical path
- See AGENTS.md § 30 and `.github/instructions/20-css-performance-rendering-optimization.instructions.md` for complete enforcement

---

## Language Guardrails

Build scripts use **JavaScript** (Node) in `scripts/`. Do not introduce Python, Bash, PowerShell, or other side-language build helpers.
Prefer existing `package.json` scripts over raw CLI commands.
Do not create parallel build paths or duplicate tooling.
