# `useKeyboardControls` — docs

Purpose
- High-level keyboard input orchestration for game actions.

API
- `useKeyboardControls(bindings, options?)` — attach keyboard bindings to document or provided `target`.

Binding shape
- `action: string` — logical action id
- `keys: readonly string[]` — tokens (e.g. `KeyW`, `w`, `ArrowUp`, `ctrl+s`)
- `onTrigger: (event) => void` — called with `{ action, phase, event }`
- other flags: `enabled`, `preventDefault`, `allowRepeat`, `allowInInputs`, `phase`, `blocked`

Options
- `enabled` — boolean or () => boolean
- `ignoreInputs` — when true, bindings are not triggered inside form elements unless `binding.allowInInputs` is true
- `target` — host element or Document
- `blockedKeys` — global blocked keys

Token matching
- Tokens are normalized to lowercase and support variants: `code`, `key`, `key:alias`, and modifier prefixes such as `ctrl+`.
- WASD aliases map to arrow keys automatically.

Notes
- The implementation is split across `useKeyboardControls.ts`, `useKeyboardControls.utils.ts`, and `useKeyboardControls.constants.ts` for clarity and testability.
