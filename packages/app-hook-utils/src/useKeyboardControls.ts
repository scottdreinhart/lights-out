import { useEffect, useMemo } from 'react'

import { FORM_TAGS } from './useKeyboardControls.constants'
import {
 	isEnabled,
 	normalizeToken,
 	buildEventTokens,
 	isKeyBlocked,
} from './useKeyboardControls.utils'

type Enabled = boolean | (() => boolean)

export type KeyboardPhase = 'keydown' | 'keyup'

export interface KeyboardActionEvent {
	action: string
	phase: KeyboardPhase
	event: KeyboardEvent
}

export type KeyboardActionHandler = (input: KeyboardActionEvent) => void

export interface KeyboardActionBinding {
	action: string
	keys: readonly string[]
	onTrigger: KeyboardActionHandler
	enabled?: Enabled
	preventDefault?: boolean
	allowRepeat?: boolean
	allowInInputs?: boolean
	phase?: KeyboardPhase
	blocked?: boolean
}

export interface UseKeyboardControlsOptions {
	enabled?: Enabled
	ignoreInputs?: boolean
	target?: Document | HTMLElement
	blockedKeys?: readonly string[]
}

const getModifiers = (event: KeyboardEvent): string[] => {
 	const mods: string[] = []
 	if (event.ctrlKey || event.metaKey) {
 		mods.push('ctrl')
 	}
 	if (event.altKey) {
 		mods.push('alt')
 	}
 	if (event.shiftKey) {
 		mods.push('shift')
 	}
 	return mods
}

const getCodeAndKey = (event: KeyboardEvent) => {
 	const code = event.code.toLowerCase()
 	const keyRaw = event.key.toLowerCase()
 	const key = keyRaw === ' ' ? 'space' : keyRaw
 	return { code, key }
}

const buildKeyAliases = (code: string, key: string): string[] => {
 	const aliases = new Set<string>()

 	if (code.startsWith('key') && code.length === 4) {
 		aliases.add(code.slice(3))
 	}
 	if (code.startsWith('digit') && code.length === 6) {
 		aliases.add(code.slice(5))
 	}
 	if (code.startsWith('numpad') && code.length === 7) {
 		aliases.add(code.slice(6))
 	}

 	if (key === 'escape') {
 		aliases.add('esc')
 	}
 	if (key === 'arrowup') {
 		aliases.add('up')
 	}
 	if (key === 'arrowdown') {
 		aliases.add('down')
 	}
 	if (key === 'arrowleft') {
 		aliases.add('left')
 	}
 	if (key === 'arrowright') {
 		aliases.add('right')
 	}

 	// WASD mapping
 	if (key === 'w') {
 		aliases.add('arrowup')
 		aliases.add('up')
 	}
 	if (key === 'a') {
 		aliases.add('arrowleft')
 		aliases.add('left')
 	}
 	if (key === 's') {
 		aliases.add('arrowdown')
 		aliases.add('down')
 	}
 	if (key === 'd') {
 		aliases.add('arrowright')
 		aliases.add('right')
 	}

 	return [...aliases]
}

const addTokenVariants = (tokens: Set<string>, base: string, modifiers: string[]) => {
 	tokens.add(base)
 	if (modifiers.length > 0) {
 		tokens.add(`${modifiers.join('+')}+${base}`)
 	}
}

/**
 * Check if a key token is in the blockedKeys set.
 * Normalizes tokens for comparison.
 */
const isFormElement = (target: EventTarget | null): boolean => {
 	if (!(target instanceof HTMLElement)) {
 		return false
 	}

 	if (target.isContentEditable) {
 		return true
 	}

 	return FORM_TAGS.has(target.tagName)
}

export function useKeyboardControls(
	bindings: KeyboardActionBinding[],
	{ enabled = true, ignoreInputs = true, target, blockedKeys }: UseKeyboardControlsOptions = {},
): void {
	const host = target ?? document

 	const bindingMap = useMemo(() => {
		const map = new Map<string, KeyboardActionBinding[]>()

		for (const binding of bindings) {
			for (const rawKey of binding.keys) {
				const token = normalizeToken(rawKey)
				const existing = map.get(token)
				if (existing) {
					existing.push(binding)
				} else {
					map.set(token, [binding])
				}
			}
		}

		return map
	}, [bindings])

	useEffect(() => {
		if (!isEnabled(enabled)) return

		const checkGlobalBlocked = (tokens: string[]): boolean => {
			return isKeyBlocked(tokens[0] ?? '', blockedKeys)
		}

		const processInputBindings = (tokens: string[], phase: KeyboardPhase, evt: KeyboardEvent): boolean => {
			for (const t of tokens) {
				const candidateBindings = bindingMap.get(t) ?? []
				for (const binding of candidateBindings) {
					if (!binding.allowInInputs) continue
					if (binding.blocked) continue
					if ((binding.phase ?? 'keydown') !== phase) continue
					if (!isEnabled(binding.enabled)) continue
					if (evt.repeat && !binding.allowRepeat) continue
					if (binding.preventDefault ?? true) evt.preventDefault()
					binding.onTrigger({ action: binding.action, phase, event: evt })
					return true
				}
			}
			return false
		}

		const processNormalBindings = (tokens: string[], phase: KeyboardPhase, evt: KeyboardEvent): boolean => {
			for (const token of tokens) {
				const matches = bindingMap.get(token)
				if (!matches) continue

				for (const binding of matches) {
					if (binding.blocked) continue
					if ((binding.phase ?? 'keydown') !== phase) continue
					if (!isEnabled(binding.enabled)) continue
					if (evt.repeat && !binding.allowRepeat) continue
					if (binding.preventDefault ?? true) evt.preventDefault()
					binding.onTrigger({ action: binding.action, phase, event: evt })
					return true
				}
			}
			return false
		}

		const tryTriggerBindings = (
			evt: KeyboardEvent,
			phase: KeyboardPhase,
			allowInputsOnly: boolean,
		) => {
			const tokens = buildEventTokens(evt)
			if (tokens.length === 0) return false
			if (checkGlobalBlocked(tokens, evt)) return true
			if (allowInputsOnly) return processInputBindings(tokens, phase, evt)
			return processNormalBindings(tokens, phase, evt)
		}

		const onKeyDown = (raw: Event) => {
			if (!(raw instanceof KeyboardEvent)) {
				return
			}
			const evt = raw
			if (ignoreInputs && isFormElement(evt.target)) {
				if (tryTriggerBindings(evt, 'keydown', true)) return
				return
			}
			tryTriggerBindings(evt, 'keydown', false)
		}

		const onKeyUp = (raw: Event) => {
			if (!(raw instanceof KeyboardEvent)) {
				return
			}
			const evt = raw
			if (ignoreInputs && isFormElement(evt.target)) {
				if (tryTriggerBindings(evt, 'keyup', true)) return
				return
			}
			tryTriggerBindings(evt, 'keyup', false)
		}

		host.addEventListener('keydown', onKeyDown)
		host.addEventListener('keyup', onKeyUp)

		return () => {
			host.removeEventListener('keydown', onKeyDown)
			host.removeEventListener('keyup', onKeyUp)
		}
	}, [bindingMap, enabled, host, ignoreInputs, blockedKeys])
}
