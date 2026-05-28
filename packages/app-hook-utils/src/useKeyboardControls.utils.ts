export type Enabled = boolean | (() => boolean)

export const isEnabled = (enabled: Enabled | undefined): boolean => {
	if (enabled === undefined) return true
	return typeof enabled === 'function' ? enabled() : enabled
}

export const normalizeToken = (token: string): string => token.trim().toLowerCase().replace(/\s+/g, '')

export const getModifiers = (event: KeyboardEvent): string[] => {
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

export const getCodeAndKey = (event: KeyboardEvent) => {
	const code = event.code.toLowerCase()
	const keyRaw = event.key.toLowerCase()
	const key = keyRaw === ' ' ? 'space' : keyRaw
	return { code, key }
}

export const buildKeyAliases = (code: string, key: string): string[] => {
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

export const addTokenVariants = (tokens: Set<string>, base: string, modifiers: string[]) => {
	tokens.add(base)
	if (modifiers.length > 0) {
		tokens.add(`${modifiers.join('+')}+${base}`)
	}
}

export const buildEventTokens = (event: KeyboardEvent): string[] => {
	const modifiers = getModifiers(event)
	const { code, key } = getCodeAndKey(event)
	const tokens = new Set<string>()

	addTokenVariants(tokens, code, modifiers)
	addTokenVariants(tokens, key, modifiers)
	addTokenVariants(tokens, `key:${key}`, modifiers)

	for (const alias of buildKeyAliases(code, key)) {
		addTokenVariants(tokens, alias, modifiers)
		addTokenVariants(tokens, `key:${alias}`, modifiers)
	}

	return [...tokens]
}

export const isKeyBlocked = (token: string, blockedKeys?: readonly string[]): boolean => {
	if (!blockedKeys || blockedKeys.length === 0) return false
	const normalized = normalizeToken(token)
	return blockedKeys.some((blocked) => normalizeToken(blocked) === normalized)
}
