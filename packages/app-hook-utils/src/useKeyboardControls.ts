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
			if (checkGlobalBlocked(tokens)) return true
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
